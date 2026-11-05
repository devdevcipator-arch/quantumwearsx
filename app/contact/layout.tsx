import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quantumwearx.com";

export const metadata: Metadata = {
  title: "Contact Us — Talk to Our Production Experts",
  description:
    "Contact QuantumWear X to start your custom apparel project. Reach our sales and production team for custom manufacturing inquiries, tech pack reviews, sampling, and global logistics support.",
  keywords: [
    "contact quantumwearx",
    "custom apparel manufacturer contact",
    "apparel production inquiry",
    "OEM clothing factory contact",
    "private label manufacturer quote",
    "custom garment manufacturing Sialkot",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/contact`,
    siteName: "QUANTUMWEARX",
    title: "Contact QuantumWear X — Let's Build Your Future Collection",
    description:
      "Contact our production experts for custom manufacturing, sampling, private labeling, and worldwide delivery.",
    images: [
      {
        url: "/images/hero_factory_sewing.jpg",
        width: 1200,
        height: 630,
        alt: "QuantumWear X production floor with industrial sewing lines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact QuantumWear X — Global Manufacturing Partner",
    description:
      "Let's build your future collection. Contact our production experts today.",
    images: ["/images/hero_factory_sewing.jpg"],
  },
};

const contactStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${siteUrl}/contact#webpage`,
      url: `${siteUrl}/contact`,
      name: "Contact QuantumWear X",
      description:
        "Contact our production experts for custom manufacturing inquiries, sampling, and global logistics support.",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/contact#breadcrumb`,
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
          name: "Contact Us",
          item: `${siteUrl}/contact`,
        },
      ],
    },
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactStructuredData),
        }}
      />
      {children}
    </>
  );
}
