import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quantumwearx.com";

export const metadata: Metadata = {
  title: "About Us — Global Custom Apparel & Private Label Partner",
  description:
    "Learn about QuantumWear X: turning designer sketches into market reality with precision apparel engineering, ethical sourcing, SEDEX & BSCI compliance, and agile private label manufacturing since 2008.",
  keywords: [
    "about quantumwearx",
    "custom apparel manufacturer story",
    "ethical clothing factory Sialkot",
    "private label apparel partner",
    "BSCI compliant garment factory",
    "SEDEX certified apparel supplier",
    "OEM clothing manufacturing Pakistan",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "article",
    locale: "en_US",
    url: `${siteUrl}/about`,
    siteName: "QUANTUMWEARX",
    title: "About QuantumWear X — Turning Sketches Into Reality",
    description:
      "High-end apparel engineering, ethical sourcing, global compliance, and agile private label manufacturing.",
    images: [
      {
        url: "/images/about_sketching_designer.jpg",
        width: 1200,
        height: 630,
        alt: "QuantumWear X Design and Technical Prototyping",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About QuantumWear X — Global Manufacturing Partner",
    description:
      "Turning designer sketches into market-ready apparel with precision engineering and global compliance.",
    images: ["/images/about_sketching_designer.jpg"],
  },
};

const aboutStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteUrl}/about#webpage`,
      url: `${siteUrl}/about`,
      name: "About QuantumWear X",
      description:
        "Learn about QuantumWear X: turning sketches into reality with high-end apparel engineering, ethical sourcing, and private label manufacturing.",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/about#breadcrumb`,
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
          name: "About Us",
          item: `${siteUrl}/about`,
        },
      ],
    },
  ],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutStructuredData),
        }}
      />
      {children}
    </>
  );
}
