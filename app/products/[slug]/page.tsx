import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductCatalogView from "./ProductCatalogView";
import {
  categoryCatalogs,
  findCategoryBySlug,
} from "../../data/categories";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ item?: string }>;
}

/** Pre-render every known category catalog at build time */
export function generateStaticParams() {
  return categoryCatalogs.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found | QuantumWear X" };
  return {
    title: `${category.headingTitle} | QuantumWear X`,
    description: category.intro,
  };
}

export default async function CategoryCatalogPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);
  if (!category) notFound();

  const { item } = await searchParams;

  return (
    <ProductCatalogView category={category} itemQuery={item} />
  );
}
