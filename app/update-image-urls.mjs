#!/usr/bin/env node
/**
 * YY Leathers - Update Image URLs Script
 * 
 * After you upload images to the new Supabase Storage bucket "yy-images",
 * run this script to update all product image URLs in db.json
 * 
 * USAGE:
 *   1. Upload images to Supabase Storage → yy-images → products folder
 *   2. Run: node update-image-urls.mjs
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

const BUCKET = 'yy-images';
const OLD_URL = 'https://vnspipodxzxuwsailgok.supabase.co';

async function listUploadedImages() {
  console.log('\n📋 Listing images in new Supabase Storage...');
  const { data, error } = await supabase.storage.from(BUCKET).list('products', {
    limit: 1000,
    sortBy: { column: 'name', order: 'asc' }
  });
  
  if (error) {
    console.error('❌ Error listing images:', error.message);
    return [];
  }
  
  console.log(`   Found ${data.length} images in storage`);
  return data.map(file => `products/${file.name}`);
}

async function updateImageUrls() {
  console.log('====================================');
  console.log('  YY Leathers - Update Image URLs');
  console.log('====================================');
  
  // List uploaded images
  const uploadedFiles = await listUploadedImages();
  if (uploadedFiles.length === 0) {
    console.log('\n⚠️  No images found in Supabase Storage!');
    console.log('   Please upload images first:');
    console.log('   1. Go to https://joutnmqckfwtfwicfqrm.supabase.co');
    console.log('   2. Storage → yy-images → products folder');
    console.log('   3. Upload all product images');
    console.log('   4. Run this script again');
    return;
  }
  
  // Read db.json
  const dbPath = join(__dirname, 'db.json');
  const db = JSON.parse(readFileSync(dbPath, 'utf-8'));
  const products = db.products || [];
  
  console.log(`\n📦 Processing ${products.length} products...\n`);
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const product of products) {
    if (!product.images || product.images.length === 0) continue;
    
    const newImages = [];
    
    for (let i = 0; i < product.images.length; i++) {
      const oldUrl = product.images[i];
      
      // Skip if already on new Supabase
      if (!oldUrl.includes(OLD_URL)) {
        console.log(`  ✓ ${product.name} image ${i + 1}: already updated`);
        newImages.push(oldUrl);
        skippedCount++;
        continue;
      }
      
      // Try to find matching uploaded image
      const oldFilename = oldUrl.split('/').pop();
      const matchingFile = uploadedFiles.find(f => f.endsWith(`-${i}.webp`) || f.endsWith(`-${i}.jpg`) || f.endsWith(`-${i}.jpeg`) || f.endsWith(`-${i}.png`));
      
      if (matchingFile) {
        const newUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${matchingFile}`;
        console.log(`  ✅ ${product.name} image ${i + 1}: ${oldFilename} → ${matchingFile}`);
        newImages.push(newUrl);
        updatedCount++;
      } else {
        // No matching file found, use placeholder
        console.log(`  ⚠️  ${product.name} image ${i + 1}: no uploaded file found, using placeholder`);
        newImages.push(`https://via.placeholder.com/600x600/e5e5e5/999999?text=YY+Leathers`);
      }
    }
    
    product.images = newImages;
  }
  
  // Save updated db.json
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
  
  console.log('\n====================================');
  console.log('  Summary');
  console.log('====================================');
  console.log(`  Updated: ${updatedCount} images`);
  console.log(`  Skipped: ${skippedCount} images (already on new Supabase)`);
  console.log('  ✅ db.json updated with new image URLs');
  console.log('\nNext steps:');
  console.log('  1. Run: npm run dev');
  console.log('  2. Check if images are showing');
  console.log('  3. If images still missing, upload them to Supabase Storage');
}

async function main() {
  await updateImageUrls();
}

main().catch(err => { console.error('\n❌ Error:', err); process.exit(1); });