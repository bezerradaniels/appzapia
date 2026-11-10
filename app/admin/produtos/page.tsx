"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Eye,
  EyeOff,
  ShoppingBag,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { formatCurrency } from "@/store/cartStore";
import type { ProductData, CategoryData } from "@/utils/demoData";

export default function AdminProductsPage() {
  const [storeSlug, setStoreSlug] = useState<string>("");
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: store } = await supabase
        .from("stores")
        .select("id, slug")
        .eq("owner_id", user.id)
        .single();

      if (!store) return;
      setStoreSlug(store.slug);

      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("store_id", store.id)
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("store_id", store.id),
      ]);

      const catMap: Record<string, string> = {};
      (cats as CategoryData[] | null)?.forEach((c) => {
        catMap[c.id] = c.name;
      });

      setCategories(catMap);
      setProducts((prods as ProductData[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleToggleActive = async (product: ProductData) => {
    const nextState = !product.is_active;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, is_active: nextState } : p
      )
    );

    const supabase = createClient();
    await supabase
      .from("products")
      .update({ is_active: nextState })
      .eq("id", product.id);
  };

  const handleDeleteProduct = async (product: ProductData) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${product.name}" da sua vitrine?`
    );
    if (!confirmed) return;

    setDeletingId(product.id);
    setProducts((prev) => prev.filter((p) => p.id !== product.id));

    const supabase = createClient();
    await supabase.from("products").delete().eq("id", product.id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Produtos da sua loja
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Visualize, edite, pause ou exclua produtos do catálogo com um toque.
          </p>
        </div>

        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 text-xs font-bold px-5 py-3 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo produto</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-[28px] border border-slate-200 p-12 text-center text-xs text-slate-600">
          Carregando produtos...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-rosa-100 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6 text-slate-900 stroke-[2]" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900">
            Sua vitrine ainda está sem produtos
          </h2>
          <p className="text-xs text-slate-600 mt-1 mb-6">
            Coloque seu primeiro produto em menos de 30 segundos.
          </p>
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center gap-2 rounded-full bg-rosa-500 text-slate-900 text-xs font-bold px-6 py-3.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Adicionar primeiro produto</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[20px] border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-[16px] bg-rosa-100/70 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-slate-600 stroke-[2]" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {product.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        product.is_active
                          ? "bg-rosa-100 text-rosa-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {product.is_active ? "No ar" : "Pausado"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {(product.category_id && categories[product.category_id]) ||
                      "Sem categoria"}
                  </p>
                  <p className="text-sm font-extrabold text-slate-900 tracking-tight mt-1">
                    {formatCurrency(Number(product.price))}
                  </p>
                </div>
              </div>

              {/* Ações do Produto: Visualizar, Editar, Pausar/Ativar, Excluir */}
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                {storeSlug && (
                  <Link
                    href={`/${storeSlug}/${product.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-bege-100 text-xs font-bold text-slate-900 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Visualizar</span>
                  </Link>
                )}

                <Link
                  href={`/admin/produtos/${product.id}/editar`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-bege-100 text-xs font-bold text-slate-900 transition"
                >
                  <Pencil className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Editar</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleToggleActive(product)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                    product.is_active
                      ? "bg-bege-100 text-slate-900 hover:bg-bege-200"
                      : "bg-slate-900 text-white"
                  }`}
                >
                  {product.is_active ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 stroke-[2]" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 stroke-[2]" />
                      <span>Ativar</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={deletingId === product.id}
                  onClick={() => handleDeleteProduct(product)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-rosa-100 text-xs font-bold text-erro transition cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
