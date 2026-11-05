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
  "Safety Wear",
  "Leather Products",
  "Custom Bags"
];

const INITIAL_PRODUCTS = [
  // Activewear
  {
    title: "Gym T-shirts and tank tops",
    description: "Custom breathable athletic fabrics engineered for gym performance and durability",
    category: "Activewear",
    image: "/images/grid_sportswear.jpg"
  },
  {
    title: "Leggings and sports bras",
    description: "Four-way stretch non-sheer compression leggings paired with supportive sports bras",
    category: "Activewear",
    image: "/images/triptych_brand_tag.jpg"
  },
  {
    title: "Compression wear",
    description: "Ergonomic compression tops and bottoms providing targeted muscular support",
    category: "Activewear",
    image: "/images/grid_backpack.jpg"
  },
  {
    title: "Workout shorts and joggers",
    description: "Lightweight gym shorts with zipper pockets and tapered fleece training joggers",
    category: "Activewear",
    image: "/images/grid_tracksuit.jpg"
  },
  {
    title: "Custom fitness sets",
    description: "Color-coordinated fitness two-piece sets ready for private label collection drops",
    category: "Activewear",
    image: "/images/triptych_embroidery.jpg"
  },

  // Sportswear
  {
    title: "Football and hockey uniforms",
    description: "Reinforced tear-resistant match jerseys and socks with vivid all-over sublimation printing",
    category: "Sportswear",
    image: "/images/grid_sportswear.jpg"
  },
  {
    title: "Tracksuits and training suits",
    description: "Breathable poly-spandex athletic tracksuits tailored for warm-ups and team travel",
    category: "Sportswear",
    image: "/images/grid_tracksuit.jpg"
  },
  {
    title: "Cycling jerseys and bib shorts",
    description: "Pro-cut aerodynamic cycling jerseys with anti-slip silicone hems and gel-padded bib shorts",
    category: "Sportswear",
    image: "/images/triptych_brand_tag.jpg"
  },
  {
    title: "Basketball jerseys and shorts",
    description: "Quick-drying breathable court uniforms available in single and reversible team styles",
    category: "Sportswear",
    image: "/images/hero_factory_sewing.jpg"
  },
  {
    title: "Sports jackets and teamwear",
    description: "Waterproof and windbreaker team jackets featuring custom crest embroidery and thermal lining",
    category: "Sportswear",
    image: "/images/triptych_embroidery.jpg"
  },

  // Streetwear
  {
    title: "Oversized T-shirts",
    description: "Vintage-washed heavyweight combed cotton tees featuring dropped shoulders and custom fit blocks",
    category: "Streetwear",
    image: "/images/hero_factory_sewing.jpg"
  },
  {
    title: "Hoodies and sweatshirts",
    description: "Boxy luxury cut 400 GSM French terry pullover hoodies with double-layer hoods and puff printing",
    category: "Streetwear",
    image: "/images/triptych_embroidery.jpg"
  },
  {
    title: "Baggy jeans and joggers",
    description: "Relaxed wide-leg denim and heavy fleece casual streetwear sweatpants with custom metal hardware",
    category: "Streetwear",
    image: "/images/grid_tracksuit.jpg"
  },
  {
    title: "Varsity and bomber jackets",
    description: "Heritage wool body with genuine leather sleeves, custom chenille embroidery, and quilted interior",
    category: "Streetwear",
    image: "/images/grid_leather_jacket.jpg"
  },
  {
    title: "Custom caps and beanies",
    description: "6-panel flat brim snapbacks, curved dad hats, and acrylic ribbed knit beanies with custom patch tags",
    category: "Streetwear",
    image: "/images/triptych_brand_tag.jpg"
  },

  // Safety Wear
  {
    title: "High-visibility safety vests",
    description: "ANSI/ISEA 107 Class 2 certified mesh and solid polyester safety vests with silver reflective tape",
    category: "Safety Wear",
    image: "/images/grid_workwear.jpg"
  },
  {
    title: "Reflective jackets and trousers",
    description: "Waterproof polyurethane-coated shell jackets and trousers with 360-degree reflective bands",
    category: "Safety Wear",
    image: "/images/grid_tactical_vest.jpg"
  },
  {
    title: "Work shirts and uniforms",
    description: "Rip-stop cotton-poly twill work shirts with dual chest pockets and reinforced stress points",
    category: "Safety Wear",
    image: "/images/grid_workwear.jpg"
  },
  {
    title: "Industrial coveralls",
    description: "Heavy twill safety coveralls with two-way heavy brass zippers and tool storage loops",
    category: "Safety Wear",
    image: "/images/hero_factory_sewing.jpg"
  },
  {
    title: "Company-branded workwear",
    description: "Customized corporate workwear branded with direct embroidery, heat transfers, and high-visibility patches",
    category: "Safety Wear",
    image: "/images/triptych_brand_tag.jpg"
  },

  // Leather Products
  {
    title: "Leather jackets",
    description: "Handcrafted 100% genuine top-grain cowhide and sheepskin leather jackets with antique YKK hardware",
    category: "Leather Products",
    image: "/images/grid_leather_jacket.jpg"
  },
  {
    title: "Leather wallets and cardholders",
    description: "Vegetable-tanned leather bifold wallets and slim RFID-blocking credit card organizers",
    category: "Leather Products",
    image: "/images/grid_leather_hide.jpg"
  },
  {
    title: "Leather belts",
    description: "Solid 3.5mm full-grain leather belts with burnished edges and interchangeable buckle hardware",
    category: "Leather Products",
    image: "/images/triptych_leather_stitch.jpg"
  },
  {
    title: "Leather accessories",
    description: "Custom debossed leather key fobs, watch straps, desk pads, and leather coasters",
    category: "Leather Products",
    image: "/images/triptych_leather_glove.jpg"
  },
  {
    title: "Custom leather products",
    description: "End-to-end bespoke leather manufacturing tailored precisely to client drawings and tech packs",
    category: "Leather Products",
    image: "/images/grid_leather_hide.jpg"
  },

  // Custom Bags
  {
    title: "Backpacks",
    description: "High-density Cordura daypacks with waterproof zippers, ergonomic straps, and laptop sleeves",
    category: "Custom Bags",
    image: "/images/grid_backpack.jpg"
  },
  {
    title: "Gym and duffel bags",
    description: "All-purpose gym duffels featuring ventilated wet/shoe compartments and reinforced grab handles",
    category: "Custom Bags",
    image: "/images/hero_factory_sewing.jpg"
  },
  {
    title: "Sports and team bags",
    description: "Heavy-duty gear holdalls designed to haul team equipment, bats, pads, and balls in bulk",
    category: "Custom Bags",
    image: "/images/grid_backpack.jpg"
  },
  {
    title: "Travel bags",
    description: "Durable weekender bags and carry-on luggage with reinforced base panels and leather trims",
    category: "Custom Bags",
    image: "/images/triptych_leather_stitch.jpg"
  },
  {
    title: "Custom promotional bags",
    description: "Organic cotton canvas tote bags, drawstring cinch packs, and branded event giveaways",
    category: "Custom Bags",
    image: "/images/triptych_embroidery.jpg"
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

