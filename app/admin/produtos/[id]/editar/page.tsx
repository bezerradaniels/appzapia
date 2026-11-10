"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import type { CategoryData } from "@/utils/demoData";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [storeId, setStoreId] = useState<string>("");
  const [categories, setCategories] = useState<CategoryData[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadProductAndMeta() {
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

      const [{ data: cats }, { data: prod }] = await Promise.all([
        supabase
          .from("categories")
          .select("*")
          .eq("store_id", store.id)
          .order("sort_order", { ascending: true }),
        supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .eq("store_id", store.id)
          .single(),
      ]);

      setCategories((cats as CategoryData[]) || []);

      if (prod) {
        setName(prod.name || "");
        setPrice(
          prod.price !== undefined && prod.price !== null
            ? String(prod.price).replace(".", ",")
            : ""
        );
        setCategoryId(prod.category_id || "");
        setDescription(prod.description || "");
        setImagePreview(prod.image_url || null);
      }

      setLoading(false);
    }
    loadProductAndMeta();
  }, [productId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !price.trim()) {
      setErrorMsg("Faltou colocar o nome ou o preço do produto.");
      return;
    }

    const numericPrice = parseFloat(price.replace(",", "."));
    if (isNaN(numericPrice) || numericPrice < 0) {
      setErrorMsg("Coloque um valor de preço válido.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      let uploadedUrl: string | null = imagePreview;

      if (imageFile && storeId) {
        const ext = imageFile.name.split(".").pop() || "jpg";
        const filePath = `${storeId}/products/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("store-assets")
          .upload(filePath, imageFile, { upsert: true });

        if (!uploadError) {
          const { data: pub } = supabase.storage
            .from("store-assets")
            .getPublicUrl(filePath);
          uploadedUrl = pub.publicUrl;
        }
      }

      const { error } = await supabase
        .from("products")
        .update({
          category_id: categoryId || null,
          name: name.trim(),
          price: numericPrice,
          description: description.trim(),
          image_url: uploadedUrl,
        })
        .eq("id", productId)
        .eq("store_id", storeId);

      if (error) {
        setErrorMsg(error.message);
        setSubmitting(false);
        return;
      }

      router.push("/admin/produtos");
      router.refresh();
    } catch {
      setErrorMsg("Não conseguimos salvar as alterações agora.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-[28px] border border-slate-200 p-12 text-center text-xs text-slate-600">
        Carregando dados do produto...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/produtos"
          className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-slate-900 stroke-[2]" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Editar produto
          </h1>
          <p className="text-xs text-slate-600">
            Atualize a foto, nome, preço ou categoria desta peça.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[28px] border border-slate-200 p-6 md:p-7 space-y-5"
      >
        {/* 1. Foto do Produto */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2">
            1. Foto do produto
          </label>
          <label className="aspect-[4/3] w-full rounded-[20px] bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative hover:border-rosa-500 transition">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 mb-2">
                  <ImageIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-xs font-bold text-slate-900">
                  Toque para escolher a foto do produto
                </span>
                <span className="text-[11px] text-slate-600 mt-0.5">
                  PNG, JPG ou WebP
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* 2. Nome do Produto */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            2. Nome do produto
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Moletom Oversized Essential"
            className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
          />
        </div>

        {/* 3. Preço & 4. Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              3. Preço (R$)
            </label>
            <input
              type="text"
              inputMode="decimal"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="189,90"
              className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm font-extrabold text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              4. Categoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Descrição */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            5. Descrição curta
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Conte os detalhes que ajudam seu cliente a escolher..."
            className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500 resize-none"
          />
        </div>

        {errorMsg && (
          <div className="bg-rosa-100 text-erro text-xs font-bold px-4 py-3 rounded-[20px]">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{submitting ? "Salvando..." : "Salvar alterações"}</span>
        </button>
      </form>
    </div>
  );
}
