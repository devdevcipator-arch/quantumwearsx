import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QUANTUMWEARX — Your Vision. Our Manufacturing Expertise.",
  description:
    "Your trusted partner for custom apparel, leather goods, sportswear, workwear, and bags. From first sample to final shipment.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
