import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantam Wear — Future-Ready Apparel",
  description:
    "Quantam Wear is a next-generation apparel brand. Tech-wear essentials designed for motion, comfort and style.",
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
