import type { Metadata, Viewport } from "next";
import "./globals.css";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quantumwearx.com";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QUANTUMWEARX — Custom Apparel & Private Label Manufacturing",
    template: "%s | QUANTUMWEARX",
  },
  description:
    "Your trusted global B2B manufacturing partner for custom athletic apparel, activewear, streetwear, fine leather goods, safety wear, and tactical bags. Turning vision into reality with agile OEM production, low MOQs, and ISO 9001:2015 certified craftsmanship.",
  applicationName: "QUANTUMWEARX",
  keywords: [
    "custom apparel manufacturer",
    "private label sportswear",
    "athletic wear manufacturer",
    "activewear OEM factory",
    "custom leather goods",
    "leather jackets manufacturer",
    "safety workwear manufacturer",
    "custom gym clothing",
    "OEM clothing manufacturer Sialkot",
    "apparel manufacturing Pakistan",
    "private label tracksuits",
    "tactical bags manufacturer",
    "ethical garment manufacturing",
    "low MOQ clothing manufacturer",
    "custom sports apparel supplier",
  ],
  authors: [{ name: "QuantumWearX Inc.", url: siteUrl }],
  creator: "QuantumWearX Inc.",
  publisher: "QuantumWearX Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "QUANTUMWEARX",
    title: "QUANTUMWEARX — Custom Apparel & Private Label Manufacturing",
    description:
      "Premier B2B manufacturing partner for custom athletic apparel, fine leather goods, workwear, and bags. From first sample to final shipment.",
    images: [
      {
        url: "/images/hero-poster.jpg",
        width: 1200,
        height: 630,
        alt: "QuantumWear X Custom Apparel & Gear Manufacturing Facility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QUANTUMWEARX — Custom Apparel & Private Label Manufacturing",
    description:
      "Premier B2B manufacturing partner for custom athletic apparel, fine leather goods, workwear, and bags.",
    images: ["/images/hero-poster.jpg"],
    creator: "@quantumwearx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/icon.png" }],
  },
  category: "manufacturing",
};

const rootStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "QuantumWear X",
      alternateName: ["QUANTUMWEARX", "QuantumWearX Inc."],
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      description:
        "Global B2B custom apparel, sportswear, streetwear, leather goods, and bags manufacturer based in Sialkot, Pakistan.",
      email: "quantumwearsx@gmail.com",
      telephone: "+92-331-4092799",
      address: {
        "@type": "PostalAddress",
        streetAddress: "14 Industrial Avenue",
        addressLocality: "Sialkot",
        addressRegion: "Punjab",
        addressCountry: "PK",
      },
      sameAs: [
        "https://linkedin.com",
        "https://instagram.com",
        "https://facebook.com",
      ],
      knowsAbout: [
        "Custom Apparel Manufacturing",
        "Activewear Production",
        "Private Label Sportswear",
        "Leather Goods Craftsmanship",
        "Workwear & Uniforms",
        "Sublimation and Screen Printing",
        "Embroidery and Tech Pack Development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "QUANTUMWEARX",
      description:
        "Your trusted partner for custom apparel, leather goods, sportswear, workwear, and bags.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is your Minimum Order Quantity (MOQ)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our standard MOQ for activewear starts at 100 pieces per style/color, which can be split across multiple sizes to help you launch your collection efficiently.",
          },
        },
        {
          "@type": "Question",
          name: "What are the typical lead times?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sampling usually takes 10–14 days. Once samples are approved, bulk production typically ranges from 4–6 weeks depending on the complexity and order volume.",
          },
        },
        {
          "@type": "Question",
          name: "Can I get a sample before bulk production?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. We provide proto-samples for fit and construction testing, and PPS (Pre-Production Samples) for final approval before the bulk run begins.",
          },
        },
        {
          "@type": "Question",
          name: "Do you provide design support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, our technical team can assist in creating tech packs from your sketches or physical samples to ensure manufacturing accuracy.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rootStructuredData),
          }}
        />
      </head>
      <body>
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
