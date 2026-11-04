import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | QuantumWear X - Your Global Manufacturing Partner",
  description:
    "Learn about QuantumWear X: turning sketches into reality with high-end apparel engineering, ethical sourcing, global compliance, and agile private label manufacturing.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

