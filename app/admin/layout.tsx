import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Management — QuantumWear X Admin",
  description: "QuantumWear X B2B Product Catalog Admin Management Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

