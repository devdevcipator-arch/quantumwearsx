# QuantumWear X — Admin Product Page → Supabase Backend (Mindmap)

> **How to view:** Open this file in the editor preview (`Ctrl+Shift+V` in VS Code —
> install the *"Markdown Preview Mermaid Support"* extension if the diagram doesn't
> render; GitHub renders it natively).

```mermaid
mindmap
  root((QuantumWear X<br/>Admin Products<br/>→ Supabase))
    1 · Supabase Setup
      Create project
        URL + anon key + service role key
      Install SDK
        @supabase/supabase-js
        @supabase/ssr
      lib/supabase.ts
        browser client
        server client helpers
    2 · Database Schema — PostgreSQL
      categories table
        id uuid PK
        name unique
        display_order
        created_at
      products table
        id uuid PK
        title
        description
        category_id FK → categories
        image_url text
        created_at + updated_at
      category delete policy
        restrict or set null — decide
      Key change
        categories as foreign key
        rename cascades to all products
    3 · Image Handling
      replaces base64 FileReader approach
      Supabase Storage bucket product-images
        public read
      Upload flow
        file → bucket path products/uuid.ext
        public URL stored in products.image_url
      same UPLOAD IMAGE button + preview UI
      cleanup old object on replace/delete
    4 · Security
      Enable RLS on both tables
        SELECT → public read for storefront
        INSERT / UPDATE / DELETE → authenticated only
      Supabase Auth admin account
        email + password
      /admin layout session guard
        redirect to login if no session
      env keys
        anon key client-safe
        service key server-only
    5 · Data Access Layer lib/products.ts
      listProducts / createProduct / updateProduct / deleteProduct
      listCategories / createCategory / renameCategory / deleteCategory
      Product + Category types
    6 · Admin Page Changes — UI stays identical
      fetch from DB replaces localStorage loader
      Add / Update / Remove / Category handlers
        optimistic UI + rollback on error
        loading + error toasts
      category rename via FK → no manual products walk
      search / tabs / dropdown filtering unchanged client-side
    7 · Public Pages Sync :: related pages
      Phase A
        public pages stay hardcoded
        backend is admin-only
      Phase B
        /products/[slug] server component reads DB by slug
        /products + home Collections read DB
        ISR or revalidate on save
      preserve quoteCategory mapping during migration
    8 · Migration / Seed
      one-time seed script
        INITIAL_PRODUCTS + INITIAL_CATEGORIES → DB
      categories.ts catalog content
        optional catalog table later
        or stays static for now
    9 · Edge Cases to Decide
      delete category with products
        block or orphan or reassign
      image size + type limits
      future multiple admins — RLS ready
```

---

## Current state (read before coding)

| Area | File | Today | After Supabase |
|---|---|---|---|
| Admin products persistence | `app/admin/products/page.tsx` | `localStorage` (`qw_admin_products`) | `products` table |
| Admin categories | same file + Manage Categories modal | `localStorage` (`qw_admin_categories`) | `categories` table (FK) |
| Image uploads | `FileReader` → base64 data URL | stored inline in record | Supabase Storage object + public URL |
| Product grid on `/products` | `app/products/page.tsx` | hardcoded `productCards` | Phase B: DB read |
| Category catalog pages | `app/products/[slug]` + `app/data/categories.ts` | static TS data | Phase B: DB read by slug |

## Recommended execution order

1. Setup → 2. Schema → 3. Storage → 4. Auth/RLS → 5. Data layer → 6. Admin page swap → 7. Seed → 8. Phase B public pages
