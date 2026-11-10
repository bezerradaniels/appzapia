"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface CartBadgeButtonProps {
  storeSlug: string;
  variant?: "default" | "overlay";
}

export default function CartBadgeButton({
  storeSlug,
  variant = "default",
}: CartBadgeButtonProps) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCount = mounted
    ? items
        .filter((item) => item.storeSlug === storeSlug)
        .reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    <Link
      href={`/${storeSlug}/checkout`}
      aria-label="Abrir sacola de compras"
      className={`w-11 h-11 rounded-full flex items-center justify-center relative active:scale-95 transition-transform ${
        variant === "overlay"
          ? "bg-white text-slate-900 border border-slate-200/60"
          : "bg-slate-200/60 text-slate-900"
      }`}
    >
      <ShoppingBag className="w-5 h-5 text-slate-900 stroke-[2]" />
      {totalCount > 0 && (
        <span className="bg-slate-900 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center absolute -top-1 -right-1 border-2 border-white">
          {totalCount}
        </span>
      )}
    </Link>
  );
}
