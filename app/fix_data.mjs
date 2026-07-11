import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vnspipodxzxuwsailgok.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuc3BpcG9keHp4dXdzYWlsZ29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTIyNTgsImV4cCI6MjA5NjMyODI1OH0.wI8_OVKRzSGDTMyNQd5I_U1wZmQwVkDWYR2g-eiU78s";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Products data (from initialDB in server.ts)
const products = [
  {
    id: "prod-1021",
    name: "Leather Chelsea Boot for Men's - 1021",
    description: "VOGUISH Masterpiece. Hand-crafted premium high-ankle Chelsea boot featuring premium full-grain leather upper, sweat-wicking leather lining, durable double elasticated side gussets, front and back leather pull tabs, and a supportive cushioned heel step with dynamic anti-slip sole. Chennai's ultimate style icon.",
    price: 4999,
    category: "Boots",
    images: [
      "https://images.unsplash.com/photo-1634825212488-8b9f713e7104?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop"
    ],
    is_new_arrival: true,
    is_best_seller: true,
    is_published: true
  },
  {
    id: "prod-1",
    name: "The Imperial Wingtip Derby",
    description: "Masterpiece derby crafted from full-grain French calfskin with hand-bushed mahogany patina. Hand-stitched wingtip brogue detailing, Blake welted construction with single-layer oak bark tanned leather sole. Chennai's peak bespoke shoe.",
    price: 18500,
    category: "Derby",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop"
    ],
    is_new_arrival: false,
    is_best_seller: true,
    is_published: true
  },
  {
    id: "prod-2",
    name: "The Royal Chelsea Boot",
    description: "Sleek, continuous single-piece leather cut Chelsea boot in rich Italian tan leather. Generous elasticated gussets, leather pull tabs, and robust storm-welted leather soles. Epitomizes royal elegance combined with modern durable craft.",
    price: 24000,
    category: "Boots",
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1634825212488-8b9f713e7104?q=80&w=600&auto=format&fit=crop"
    ],
    is_new_arrival: true,
    is_best_seller: true,
    is_published: true
  },
  {
    id: "prod-3",
    name: "The Chennai Legacy Monkstraps",
    description: "Distinctive double-buckle monkstrap shoes using gold-burnished solid brass buckles. Tailored using premium locally tanned deep dark leather, presenting an exceptional dark sheen under sunlight. Fully customizable shoe depth and instep fit.",
    price: 19500,
    category: "Monkstrap",
    images: [
      "https://images.unsplash.com/photo-1614252304915-d36c53fc36d9?q=80&w=600&auto=format&fit=crop"
    ],
    is_new_arrival: false,
    is_best_seller: true,
    is_published: true
  },
  {
    id: "prod-4",
    name: "The Heirloom Oxford",
    description: "Unmatched formal elegance. Strict cap-toe oxford constructed on a custom high-arch royal last. Handmade detailing across blind eyelets and double-waxed braided corded laces. Rich tan finish matches custom designer drapes.",
    price: 16800,
    category: "Oxford",
    images: [
      "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=600&auto=format&fit=crop"
    ],
    is_new_arrival: true,
    is_best_seller: false,
    is_published: true
  },
  {
    id: "prod-5",
    name: "The Estate Velvet Loafer",
    description: "Slip-on penny loafer incorporating supple full-grain chocolate brown suede. Unlined structure gives lightweight flexibility and supreme barefoot luxury feel. Hand-sewn apron stitching with customized heel counters.",
    price: 15500,
    category: "PENNY LOAFERS",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop"
    ],
    is_new_arrival: true,
    is_best_seller: false,
    is_published: true
  },
  {
    id: "prod-6",
    name: "Classic Leather Belt",
    description: "Premium full grain leather belt with solid brass buckle.",
    price: 2500,
    category: "BELT",
    images: [
      "https://images.unsplash.com/photo-1627092104085-f2adba578508?q=80&w=600&auto=format&fit=crop"
    ],
    is_new_arrival: true,
    is_best_seller: true,
    is_published: true
  },
  {
    id: "prod-7",
    name: "Minimalist Suede Mules",
    description: "Handcrafted suede mules for effortless style.",
    price: 9500,
    category: "MULES",
    images: [
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=600&auto=format&fit=crop"
    ],
    is_new_arrival: true,
    is_best_seller: false,
    is_published: true
  }
];

console.log(`Pushing ${products.length} products to Supabase...`);

// Push products
const { error: productsErr } = await supabase
  .from('yy_store_sync')
  .upsert({ key: 'products', value: products, updated_at: new Date().toISOString() }, { onConflict: 'key' });

if (productsErr) {
  console.error('Products push error:', productsErr);
} else {
  console.log('✓ Products pushed successfully!');
}

// Now also push all other data from db.json
import fs from 'fs';
const raw = fs.readFileSync('./db.json', 'utf8');
const db = JSON.parse(raw);

const keys = ['profiles', 'orders', 'preorders', 'offers', 'content_blocks'];
for (const key of keys) {
  const { error } = await supabase
    .from('yy_store_sync')
    .upsert({ key, value: db[key] || [], updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) {
    console.error(`Push error for ${key}:`, error);
  } else {
    console.log(`✓ ${key} pushed successfully!`);
  }
}

console.log('\nAll data pushed to Supabase! Now restart the server to reload.');