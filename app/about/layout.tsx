import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quantumwearx.com";

export const metadata: Metadata = {
  title: "About Us — Established in 2020 | QuantumWear X Sialkot",
  description:
    "QuantumWear X was established in 2020 as a family-owned manufacturing business in Sialkot, Pakistan, delivering high-quality custom apparel, sportswear, leather goods, and bags worldwide.",
  keywords: [
    "about quantumwearx",
    "custom apparel manufacturer Sialkot",
    "family owned garment factory Pakistan",
    "private label apparel partner",
    "leather goods manufacturer Sialkot",
    "sports bags OEM factory",
    "custom clothing manufacturing Pakistan",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "article",
    locale: "en_US",
    url: `${siteUrl}/about`,
    siteName: "QUANTUMWEARX",
    title: "About QuantumWear X — Precision in Every Stitch",
    description:
      "Established in 2020 in Sialkot, Pakistan. Transforming ideas into professionally manufactured apparel, leather goods, and custom bags.",
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
    title: "About QuantumWear X — Sialkot Manufacturing Partner",
    description:
      "Established in 2020 in Sialkot, Pakistan. Precision in Every Stitch. Your Vision. Our Manufacturing. Your Brand's Identity.",
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
        "QuantumWear X was established in 2020 as a family-owned manufacturing business in Sialkot, Pakistan, delivering high-quality customized apparel, leather products, and bags worldwide.",
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
