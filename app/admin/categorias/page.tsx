"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { normalizeSlug } from "@/utils/slug";
import type { CategoryData } from "@/utils/demoData";

export default function AdminCategoriesPage() {
  const [storeId, setStoreId] = useState("");
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (!store) return;
      setStoreId(store.id);

      const { data: cats } = await supabase
        .from("categories")
        .select("*")
        .eq("store_id", store.id)
        .order("sort_order", { ascending: true });

      setCategories((cats as CategoryData[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !storeId) return;

    const supabase = createClient();
    const slug = normalizeSlug(newName);
    const nextOrder = categories.length + 1;

    const { data } = await supabase
      .from("categories")
      .insert({
        store_id: storeId,
        name: newName.trim(),
        slug: `${slug}-${Math.floor(10 + Math.random() * 89)}`,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (data) {
      setCategories((prev) => [...prev, data as CategoryData]);
      setNewName("");
    }
  };

  const handleDelete = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Categorias da vitrine
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Elas aparecem no topo da sua loja para o cliente filtrar os produtos.
        </p>
      </div>

      <form
        onSubmit={handleAddCategory}
        className="bg-white rounded-[28px] border border-slate-200 p-5 flex items-center gap-3"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Ex.: Vestidos, Conjuntos, Tricot & Casacos..."
          className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-3 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 text-xs font-bold px-5 py-3.5 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Criar</span>
        </button>
      </form>

      <div className="space-y-2.5">
        {loading ? (
          <div className="bg-white rounded-[28px] border border-slate-200 p-8 text-center text-xs text-slate-600">
            Carregando categorias...
          </div>
        ) : (
          categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="bg-white rounded-[20px] border border-slate-200 px-5 py-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-rosa-100 text-rosa-700 text-xs font-extrabold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {cat.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                aria-label={`Remover ${cat.name}`}
                className="w-8 h-8 rounded-full bg-bege-100 hover:bg-rosa-100 text-slate-600 hover:text-erro flex items-center justify-center transition cursor-pointer"
              >
                <Minus className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
