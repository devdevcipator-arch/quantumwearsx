import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductCatalogView from "./ProductCatalogView";
import {
  categoryCatalogs,
  findCategoryBySlug,
} from "../../data/categories";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quantumwearx.com";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ item?: string }>;
}

/** Pre-render every known category catalog at build time */
export function generateStaticParams() {
  return categoryCatalogs.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);
  if (!category) {
    return {
      title: "Category Not Found | QUANTUMWEARX",
      description: "The requested product category was not found.",
      robots: { index: false, follow: false },
    };
  }

  const primaryImage =
    category.products[0]?.image || "/images/hero-poster.jpg";
  const title = `${category.headingTitle} — Custom ${category.name} Manufacturing`;
  const description = category.intro.length > 160
    ? `${category.intro.slice(0, 157)}...`
    : category.intro;

  const keywords = [
    `custom ${category.name.toLowerCase()}`,
    `private label ${category.name.toLowerCase()}`,
    `${category.name.toLowerCase()} manufacturer`,
    `${category.name.toLowerCase()} OEM factory`,
    ...category.subItems
      .filter((item) => !item.toLowerCase().startsWith("all "))
      .map((item) => item.toLowerCase()),
    "b2b apparel manufacturing",
    "Sialkot clothing manufacturer",
    "bulk clothing production",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/products/${category.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `${siteUrl}/products/${category.slug}`,
      siteName: "QUANTUMWEARX",
      title: `${category.headingTitle} | QUANTUMWEARX`,
      description,
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: `${category.name} Custom Manufacturing Catalog`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.headingTitle} | QUANTUMWEARX`,
      description,
      images: [primaryImage],
    },
  };
}

export default async function CategoryCatalogPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);
  if (!category) notFound();

  const { item } = await searchParams;

  const categoryStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/products/${category.slug}#webpage`,
        url: `${siteUrl}/products/${category.slug}`,
        name: `${category.headingTitle} — Custom ${category.name}`,
        description: category.intro,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/products/${category.slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${siteUrl}/products`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.name,
            item: `${siteUrl}/products/${category.slug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/products/${category.slug}#itemlist`,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: category.products.length,
        itemListElement: category.products.map((prod, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "Product",
            name: prod.name,
            image: prod.image.startsWith("http")
              ? prod.image
              : `${siteUrl}${prod.image}`,
            description: prod.alt,
            category: category.name,
            brand: {
              "@type": "Brand",
              name: "QuantumWear X",
            },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              price: "Contact for B2B Quotation",
            },
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryStructuredData),
        }}
      />
      <ProductCatalogView key={slug} category={category} itemQuery={item} />
    </>
  );
}
