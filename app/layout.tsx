import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quantam Wear — Coming Soon",
  description:
    "Quantam Wear is arriving soon. Tech-wear essentials designed for motion, comfort and style.",
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
