import { Metadata } from "next";
import ProductDetailView from "./ProductDetailView";
import {
  getAllStaticProductSlugs,
  getProductDetailBySlug,
} from "@/lib/product-details";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = getAllStaticProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);

  const title = `${product.title} — Custom ${product.category} Manufacturing | QUANTUMWEARX`;
  const metaDesc = product.shortDescription || product.description1 || product.title;
  const description = `${product.title}: ${metaDesc.slice(0, 155)}...`;

  return {
    title,
    description,
    keywords: [
      product.title.toLowerCase(),
      `custom ${product.category.toLowerCase()}`,
      `private label ${product.category.toLowerCase()}`,
      "b2b apparel manufacturing",
      "Sialkot manufacturer",
      "QuantumWear X",
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.mainImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);

  return <ProductDetailView product={product} />;
}

