import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  DEMO_STORE,
  DEMO_PRODUCTS,
  type StoreData,
  type ProductData,
} from "@/utils/demoData";
import { formatCurrency } from "@/store/cartStore";
import ProductDetailClient from "./ProductDetailClient";

async function getProductDetail(
  storeSlug: string,
  productSlug: string
): Promise<{
  store: StoreData;
  product: ProductData;
  relatedProducts: ProductData[];
} | null> {
  if (storeSlug === "demo") {
    const product = DEMO_PRODUCTS.find((p) => p.slug === productSlug);
    if (!product) return null;
    const relatedProducts = DEMO_PRODUCTS.filter((p) => p.id !== product.id);
    return { store: DEMO_STORE, product, relatedProducts };
  }

  try {
    const supabase = await createClient();
    const { data: store } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", storeSlug)
      .eq("is_active", true)
      .single();

    if (!store) return null;

    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("slug", productSlug)
      .eq("is_active", true)
      .single();

    if (!product) return null;

    const { data: related } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("is_active", true)
      .neq("id", product.id)
      .limit(4);

    return {
      store: store as StoreData,
      product: product as ProductData,
      relatedProducts: (related || []) as ProductData[],
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeSlug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { storeSlug, productSlug } = await params;
  const data = await getProductDetail(storeSlug, productSlug);

  if (!data) {
    return { title: "Produto não encontrado" };
  }

  const { store, product } = data;
  const locationText =
    store.city && store.state ? ` em ${store.city} - ${store.state}` : "";

  return {
    title: `${product.name} | ${store.name}${locationText}`,
    description:
      product.description ||
      `Compre ${product.name} por ${formatCurrency(
        Number(product.price)
      )} na ${store.name}${locationText}. Peça direto pelo WhatsApp!`,
    openGraph: {
      title: `${product.name} — ${store.name}`,
      description:
        product.description ||
        `Peça ${product.name} pelo WhatsApp na ${store.name}.`,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ storeSlug: string; productSlug: string }>;
}) {
  const { storeSlug, productSlug } = await params;
  const data = await getProductDetail(storeSlug, productSlug);

  if (!data) {
    notFound();
  }

  const { store, product, relatedProducts } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.image_url || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: Number(product.price).toFixed(2),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "LocalBusiness",
        name: store.name,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        store={store}
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
