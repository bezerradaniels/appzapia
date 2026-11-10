import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DEMO_STORE, type StoreData } from "@/utils/demoData";
import CheckoutClient from "./CheckoutClient";

async function getStoreForCheckout(
  storeSlug: string
): Promise<StoreData | null> {
  if (storeSlug === "demo") {
    return DEMO_STORE;
  }

  try {
    const supabase = await createClient();
    const { data: store } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", storeSlug)
      .eq("is_active", true)
      .single();

    return (store as StoreData) || null;
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
  const store = await getStoreForCheckout(storeSlug);

  return {
    title: store ? `Sacola & Checkout — ${store.name}` : "Checkout",
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreForCheckout(storeSlug);

  if (!store) {
    notFound();
  }

  return (
    <CheckoutClient
      storeSlug={store.slug}
      storeName={store.name}
      storeWhatsapp={store.whatsapp}
      paymentMethods={
        store.payment_methods && store.payment_methods.length > 0
          ? store.payment_methods
          : ["Dinheiro", "PIX", "Cartão de crédito", "Cartão de débito"]
      }
      deliveryMethods={
        store.delivery_methods && store.delivery_methods.length > 0
          ? store.delivery_methods
          : ["Entrega em domicílio", "Retirada na loja"]
      }
      deliveryNotes={store.delivery_notes || null}
      deliveryFee={Number(store.delivery_fee || 0)}
    />
  );
}
