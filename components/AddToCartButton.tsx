"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface AddToCartProduct {
  id: string;
  storeSlug: string;
  name: string;
  slug: string;
  price: number;
  image_url?: string | null;
  categoryName?: string | null;
}

interface AddToCartButtonProps {
  product: AddToCartProduct;
  variant?: "icon" | "detail-bar";
}

export default function AddToCartButton({
  product,
  variant = "icon",
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1200);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      storeSlug: product.storeSlug,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image_url: product.image_url,
      categoryName: product.categoryName,
    });
    setJustAdded(true);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      storeSlug: product.storeSlug,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image_url: product.image_url,
      categoryName: product.categoryName,
    });
    router.push(`/${product.storeSlug}/checkout`);
  };

  if (variant === "detail-bar") {
    return (
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 flex gap-3 z-40">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 py-3.5 rounded-full border border-slate-900 text-slate-900 font-bold text-sm active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 text-sucesso stroke-[2.5]" />
              <span>Na sacola!</span>
            </>
          ) : (
            <span>Adicionar</span>
          )}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-3.5 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 font-bold text-sm active:scale-95 transition cursor-pointer"
        >
          Pedir no WhatsApp
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Adicionar ${product.name} à sacola`}
      className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform cursor-pointer ${
        justAdded
          ? "bg-rosa-500 text-slate-900"
          : "bg-slate-900 text-white hover:bg-slate-800"
      }`}
    >
      {justAdded ? (
        <Check className="w-4 h-4 stroke-[2.5]" />
      ) : (
        <Plus className="w-4 h-4 stroke-[2.5]" />
      )}
    </button>
  );
}
