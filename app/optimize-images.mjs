#!/usr/bin/env node
/**
 * YY Leathers - Image Optimization Script
 * Downloads images from old Supabase, compresses to ~80KB WebP, uploads to new Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const OLD_SUPABASE_URL = 'https://vnspipodxzxuwsailgok.supabase.co';
const BUCKET = 'yy-images';

async function fetchImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function compressImage(buffer) {
  try {
    const sharp = await import('sharp');
    return await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();
  } catch (e) {
    console.warn('sharp not installed, using original');
    return buffer;
  }
}

async function uploadImage(buffer, path) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: 'image/webp',
      upsert: true,
      cacheControl: '3600',
    });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function optimizeAndUpload(imageUrl, productId, index) {
  try {
    const newFilename = `${productId}-${index}.webp`;
    const newPath = `products/${newFilename}`;
    
    console.log(`  Processing: ${newFilename}`);
    const imageBuffer = await fetchImage(imageUrl);
    const originalSizeKB = (imageBuffer.length / 1024).toFixed(1);
    console.log(`    Original: ${originalSizeKB}KB`);
    
    const compressed = await compressImage(imageBuffer);
    const compressedSizeKB = (compressed.length / 1024).toFixed(1);
    console.log(`    Compressed: ${compressedSizeKB}KB`);
    
    const newUrl = await uploadImage(compressed, newPath);
    console.log(`    ✅ Uploaded`);
    
    return { oldUrl: imageUrl, newUrl, originalSizeKB, compressedSizeKB };
  } catch (error) {
    console.error(`    ❌ Failed: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('====================================');
  console.log('  YY Leathers - Image Optimization');
  console.log('====================================');
  
  const dbPath = join(__dirname, 'db.json');
  const db = JSON.parse(readFileSync(dbPath, 'utf-8'));
  const products = db.products || [];
  
  console.log(`Found ${products.length} products\n`);
  
  let totalImages = 0;
  let processedImages = 0;
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  
  for (const product of products) {
    if (!product.images || product.images.length === 0) continue;
    
    const newImages = [];
    
    for (let i = 0; i < product.images.length; i++) {
      const oldUrl = product.images[i];
      totalImages++;
      
      if (!oldUrl.includes(OLD_SUPABASE_URL)) {
        console.log(`Skipping ${product.name} image ${i + 1}: already on new Supabase`);
        newImages.push(oldUrl);
        continue;
      }
      
      const result = await optimizeAndUpload(oldUrl, product.id, i);
      if (result) {
        newImages.push(result.newUrl);
        totalOriginalSize += parseFloat(result.originalSizeKB);
        totalCompressedSize += parseFloat(result.compressedSizeKB);
        processedImages++;
      } else {
        newImages.push(oldUrl);
      }
    }
    
    product.images = newImages;
  }
  
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('\n✅ Updated db.json with new image URLs');
  
  console.log('\n====================================');
  console.log('  Summary');
  console.log('====================================');
  console.log(`  Total images: ${totalImages}`);
  console.log(`  Processed: ${processedImages}`);
  console.log(`  Original: ${(totalOriginalSize / 1024).toFixed(2)}MB`);
  console.log(`  Compressed: ${(totalCompressedSize / 1024).toFixed(2)}MB`);
  console.log(`  Savings: ${((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log('\nNext: Run migrate-to-supabase.mjs to update products in Supabase');
}

main().catch(err => { console.error('\n❌ Error:', err); process.exit(1); });