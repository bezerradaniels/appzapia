"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCartStore, formatCurrency } from "@/store/cartStore";

interface FloatingCartProps {
  storeSlug: string;
}

export default function FloatingCart({ storeSlug }: FloatingCartProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const segments = pathname.split("/").filter(Boolean);
  const isCheckout = pathname.endsWith("/checkout");
  const isProductDetail =
    !isCheckout &&
    ((segments.length === 2 && segments[0] === storeSlug) ||
      (segments.length === 1 && segments[0] !== storeSlug));

  if (isCheckout || isProductDetail) {
    return null;
  }

  const storeItems = items.filter((item) => item.storeSlug === storeSlug);
  const totalCount = storeItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = storeItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-5 z-40 pointer-events-none">
      <Link
        href={`/${storeSlug}/checkout`}
        className="pointer-events-auto w-full bg-slate-900 text-white rounded-full p-3.5 pl-5 pr-4 flex items-center justify-between active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/15">
            <ShoppingBag className="w-4 h-4 text-white stroke-[2]" />
            <span className="bg-rosa-500 text-slate-900 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center absolute -top-1 -right-1">
              {totalCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-200 font-normal leading-none">
              Sua sacolinha
            </span>
            <span className="text-sm font-extrabold text-white tracking-tight mt-0.5">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>

        <span className="bg-rosa-500 text-slate-900 text-xs font-bold px-4 py-2 rounded-full">
          Pedir no WhatsApp
        </span>
      </Link>
    </div>
  );
}
