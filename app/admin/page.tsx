import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, ExternalLink, ShoppingBag, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import CopyStoreLinkButton from "./CopyStoreLinkButton";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!store) redirect("/onboarding");

  const [{ count: totalProducts }, { count: activeProducts }, { count: totalCategories }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id)
        .eq("is_active", true),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id),
    ]);

  return (
    <div className="space-y-6">
      {/* Hero Card com Tom de Voz oficial (Pág. 13: "Seu catálogo está no ar. Bora vender?") */}
      <div className="bg-white rounded-[28px] rounded-br-[64px] border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-rosa-100 text-rosa-700 text-xs font-bold px-3.5 py-1 rounded-full mb-3">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Seu catálogo está no
            ar. Bora vender?
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Oi, {store.name}
          </h1>
          <p className="text-xs text-slate-600 font-normal mt-1">
            Coloque o link abaixo na bio do Instagram e mande no zap para seus
            clientes fazerem pedidos.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-bege-100 px-4 py-2 rounded-full text-xs font-extrabold text-slate-900">
            <span>{store.slug}.zapia.app</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/${store.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 transition"
          >
            <span>Ver catálogo</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
          </Link>
          <CopyStoreLinkButton storeSlug={store.slug} />
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[28px] border border-slate-200 p-6">
          <p className="text-xs font-bold text-slate-600">
            Produtos visíveis na loja
          </p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            {activeProducts || 0}
          </p>
          <p className="text-[11px] text-slate-600 mt-1">
            De {totalProducts || 0} produtos cadastrados
          </p>
        </div>

        <div className="bg-white rounded-[28px] border border-slate-200 p-6">
          <p className="text-xs font-bold text-slate-600">
            Categorias da vitrine
          </p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            {totalCategories || 0}
          </p>
          <Link
            href="/admin/categorias"
            className="inline-block text-xs font-bold text-rosa-700 hover:underline mt-1"
          >
            Organizar categorias
          </Link>
        </div>

        <div className="bg-white rounded-[28px] border border-slate-200 p-6">
          <p className="text-xs font-bold text-slate-600">
            WhatsApp dos pedidos
          </p>
          <p className="text-xl font-extrabold text-slate-900 tracking-tight mt-2">
            {store.whatsapp}
          </p>
          <Link
            href="/admin/configuracoes"
            className="inline-block text-xs font-bold text-rosa-700 hover:underline mt-2"
          >
            Trocar número
          </Link>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-rosa-100 rounded-[28px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[20px] bg-white flex items-center justify-center text-slate-900">
            <ShoppingBag className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Tem produto novo chegando?
            </h2>
            <p className="text-xs text-slate-600 font-normal">
              Suba a foto, coloque o preço e ele aparece na hora na sua vitrine.
            </p>
          </div>
        </div>

        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 text-xs font-bold px-6 py-3.5 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Adicionar produto</span>
        </Link>
      </div>
    </div>
  );
}
