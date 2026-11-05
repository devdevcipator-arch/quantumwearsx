const fs = require('fs');
let token = process.env.SUPABASE_ACCESS_TOKEN || '';
if (!token && fs.existsSync('.env.local')) {
  const match = fs.readFileSync('.env.local', 'utf-8').match(/SUPABASE_SERVICE_ROLE_KEY=["']?([^"'\r\n]+)/);
  if (match) token = match[1];
}
const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/https?:\/\/|\.supabase\.co/g, '') : 'ukyiqvuxqhzohaufnryr';

const INITIAL_CATEGORIES = [
  "Activewear",
  "Sportswear",
  "Streetwear",
  "Leather Products",
  "Safety Wear",
  "Custom Bags",
  "Denim & Casual",
  "Jackets & Outerwear",
  "Accessories",
  "Tactical Wear",
  "Gym Clothing",
  "Compression Wear",
  "Footwear",
  "Handbags",
  "Duffle Bags",
  "Tech Packs",
  "Tracksuits",
  "Workwear"
];

const INITIAL_PRODUCTS = [
  {
    title: "Hand-Stitched Leather Sets",
    description: "Premium Italian calfskin with reinforced edges",
    category: "Leather Products",
    image: "/images/triptych_leather_stitch.jpg"
  },
  {
    title: "Executive Briefcase",
    description: "Full-grain leather with dedicated laptop sleeve",
    category: "Custom Bags",
    image: "/images/grid_backpack.jpg"
  },
  {
    title: "Noir Watch Strap",
    description: "Hand-crafted exotic leather pattern",
    category: "Leather Products",
    image: "/images/triptych_leather_glove.jpg"
  },
  {
    title: "Signature Desk Mat",
    description: "Spacious minimalist workspace essential",
    category: "Accessories",
    image: "/images/grid_desk_mat.jpg"
  },
  {
    title: "Tactical Combat Vest",
    description: "Ballistic nylon with modular MOLLE webbing",
    category: "Safety Wear",
    image: "/images/grid_tactical_vest.jpg"
  },
  {
    title: "Pro Performance Athletic Tracksuit",
    description: "Custom breathable poly-spandex blend built for high-intensity training",
    category: "Sportswear",
    image: "/images/grid_tracksuit.jpg"
  }
];

async function runQuery(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  return res.json();
}

async function main() {
  console.log('Seeding initial categories...');
  for (let i = 0; i < INITIAL_CATEGORIES.length; i++) {
    const cat = INITIAL_CATEGORIES[i].replace(/'/g, "''");
    await runQuery(`
      INSERT INTO public.categories (name, display_order)
      VALUES ('${cat}', ${i})
      ON CONFLICT (name) DO NOTHING;
    `);
  }

  console.log('Seeding initial products...');
  for (const prod of INITIAL_PRODUCTS) {
    const title = prod.title.replace(/'/g, "''");
    const desc = prod.description.replace(/'/g, "''");
    const cat = prod.category.replace(/'/g, "''");
    const img = prod.image.replace(/'/g, "''");
    await runQuery(`
      INSERT INTO public.products (title, description, category, image)
      SELECT '${title}', '${desc}', '${cat}', '${img}'
      WHERE NOT EXISTS (
        SELECT 1 FROM public.products WHERE title = '${title}'
      );
    `);
  }

  // Update category_id foreign keys
  await runQuery(`
    UPDATE public.products p
    SET category_id = c.id
    FROM public.categories c
    WHERE p.category = c.name AND p.category_id IS NULL;
  `);

  const cats = await runQuery('SELECT count(*) FROM public.categories;');
  const prods = await runQuery('SELECT count(*) FROM public.products;');
  console.log('Seed completed successfully!');
  console.log('Categories count:', cats[0]?.count);
  console.log('Products count:', prods[0]?.count);
}

main().catch(console.error);

