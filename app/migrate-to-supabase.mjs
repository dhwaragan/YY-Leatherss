#!/usr/bin/env node
/**
 * YY Leathers - Supabase Migration Script
 * 
 * Reads db.json and uploads all data to your NEW Supabase project.
 * 
 * USAGE:
 *   1. Set these environment variables:
 *      SUPABASE_URL=https://YOUR_NEW_PROJECT.supabase.co
 *      SUPABASE_SERVICE_KEY=your_service_role_key
 *   2. Run: node migrate-to-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('   SUPABASE_URL:', SUPABASE_URL || 'NOT SET');
  console.error('   SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? 'SET' : 'NOT SET');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const dbPath = join(__dirname, 'db.json');
console.log(`Reading db.json from: ${dbPath}`);
const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

const SYNC_KEYS = ['products', 'offers', 'content_blocks', 'hero_slides', 'custom_categories', 'orders', 'preorders'];

async function migrateSyncData() {
  console.log('\nMigrating key-value data to yy_store_sync...');
  for (const key of SYNC_KEYS) {
    const value = db[key] || [];
    const count = Array.isArray(value) ? value.length : Object.keys(value).length;
    console.log(`  ${key}: ${count} items`);
    const { error } = await supabase.from('yy_store_sync').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) console.error(`  FAILED "${key}":`, error.message);
    else console.log(`  OK "${key}"`);
  }
}

async function migrateProfiles() {
  console.log('\nMigrating profiles...');
  const profiles = db.profiles || [];
  for (const profile of profiles) {
    const { error } = await supabase.from('profiles').upsert({
      email: profile.email, name: profile.name, role: profile.role || 'customer',
      phone: profile.phone, avatar: profile.avatar, address: profile.address,
      created_at: profile.created_at || new Date().toISOString()
    }, { onConflict: 'email' });
    if (error) console.error(`  FAILED "${profile.email}":`, error.message);
    else console.log(`  OK "${profile.email}"`);
  }
}

async function checkImageUrls() {
  console.log('\nChecking product image URLs...');
  const products = db.products || [];
  const oldUrl = 'vnspipodxzxuwsailgok.supabase.co';
  let hasOldUrls = false;
  for (const p of products) {
    if (p.images && p.images.some(img => img.includes(oldUrl))) { hasOldUrls = true; break; }
  }
  if (hasOldUrls) {
    console.log(`  WARNING: Images reference OLD Supabase (${oldUrl})`);
    console.log(`  You need to re-upload images to the new Supabase Storage bucket "yy-images"`);
    console.log(`  Or move images to Cloudinary/another CDN`);
  } else {
    console.log('  OK - No old image URLs found');
  }
}

async function main() {
  console.log('====================================');
  console.log('  YY Leathers - Supabase Migration');
  console.log('====================================');
  console.log(`  URL: ${SUPABASE_URL}`);
  await migrateSyncData();
  await migrateProfiles();
  await checkImageUrls();
  console.log('\n====================================');
  console.log('  Migration Complete!');
  console.log('====================================');
  console.log('\nNext steps:');
  console.log('  1. Update app/.env with new Supabase URL and anon key');
  console.log('  2. Re-upload product images to new Supabase Storage');
  console.log('  3. Run: npm run dev');
}

main().catch(err => { console.error('\nMigration failed:', err); process.exit(1); });