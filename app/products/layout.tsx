import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quantumwearx.com";

export const metadata: Metadata = {
  title: "B2B Product Catalog & Custom Manufacturing Categories",
  description:
    "Explore QuantumWear X's comprehensive manufacturing catalog: Custom activewear, technical sportswear, urban streetwear, industrial safety wear, fine leather goods, and custom bags.",
  keywords: [
    "custom apparel catalog",
    "private label activewear wholesale",
    "custom sportswear manufacturing",
    "OEM streetwear production",
    "custom leather jackets factory",
    "safety wear manufacturer",
    "tactical bags OEM",
    "gym clothing wholesale manufacturer",
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/products`,
    siteName: "QUANTUMWEARX",
    title: "B2B Product Catalog — QuantumWear X Manufacturing",
    description:
      "Explore our full range of custom athletic apparel, streetwear, workwear, leather goods, and bags built for high-performance brands worldwide.",
    images: [
      {
        url: "/images/grid_sportswear.jpg",
        width: 1200,
        height: 630,
        alt: "QuantumWear X Complete Product Range & Categories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B Product Catalog | QuantumWear X",
    description:
      "Explore custom activewear, sportswear, streetwear, leather goods, and bags engineered to specification.",
    images: ["/images/grid_sportswear.jpg"],
  },
};

const productsStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/products#webpage`,
      url: `${siteUrl}/products`,
      name: "QuantumWear X Product Catalog & Categories",
      description:
        "Complete B2B manufacturing catalog for activewear, sportswear, streetwear, safety wear, leather goods, and bags.",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/products#breadcrumb`,
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
      ],
    },
  ],
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productsStructuredData),
        }}
      />
      {children}
    </>
  );
}

