import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  DEMO_STORE,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  type StoreData,
  type CategoryData,
  type ProductData,
} from "@/utils/demoData";
import StoreCatalogClient from "./StoreCatalogClient";

async function getStoreBundle(storeSlug: string): Promise<{
  store: StoreData;
  categories: CategoryData[];
  products: ProductData[];
} | null> {
  if (storeSlug === "demo") {
    return {
      store: DEMO_STORE,
      categories: DEMO_CATEGORIES,
      products: DEMO_PRODUCTS,
    };
  }

  try {
    const supabase = await createClient();
    const { data: store } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", storeSlug)
      .eq("is_active", true)
      .single();

    if (!store) {
      return null;
    }

    const [{ data: categories }, { data: products }] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("store_id", store.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("products")
        .select("*")
        .eq("store_id", store.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
    ]);

    return {
      store: store as StoreData,
      categories: (categories || []) as CategoryData[],
      products: (products || []) as ProductData[],
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}): Promise<Metadata> {
  const { storeSlug } = await params;
  const bundle = await getStoreBundle(storeSlug);

  if (!bundle) {
    return {
      title: "Loja não encontrada",
    };
  }

  const { store } = bundle;
  const locationSuffix =
    store.city && store.state ? ` em ${store.city} - ${store.state}` : "";

  return {
    title: `${store.name}${locationSuffix} — Catálogo Online`,
    description:
      store.welcome_message ||
      `Confira o catálogo online de ${store.name}${locationSuffix} e faça seu pedido direto pelo WhatsApp.`,
    openGraph: {
      title: `${store.name} — Catálogo Online`,
      description:
        store.welcome_message ||
        `Peça online na ${store.name} direto pelo WhatsApp.`,
      images: store.logo_url ? [store.logo_url] : [],
    },
  };
}

export default async function StoreCatalogPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const bundle = await getStoreBundle(storeSlug);

  if (!bundle) {
    notFound();
  }

  return (
    <StoreCatalogClient
      store={bundle.store}
      categories={bundle.categories}
      products={bundle.products}
    />
  );
}
