"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Heart,
  Plus,
} from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import CartBadgeButton from "@/components/CartBadgeButton";
import StoreFooter from "@/components/StoreFooter";
import { formatCurrency } from "@/store/cartStore";
import type { StoreData, CategoryData, ProductData } from "@/utils/demoData";

interface StoreCatalogClientProps {
  store: StoreData;
  categories: CategoryData[];
  products: ProductData[];
}

export default function StoreCatalogClient({
  store,
  categories,
  products,
}: StoreCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [sortAsc, setSortAsc] = useState<boolean | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
      const matchesCategory =
        selectedCategoryId === "all" ||
        product.category_id === selectedCategoryId;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description &&
          product.description.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    if (sortAsc !== null) {
      return [...list].sort((a, b) =>
        sortAsc
          ? Number(a.price) - Number(b.price)
          : Number(b.price) - Number(a.price)
      );
    }
    return list;
  }, [products, selectedCategoryId, searchQuery, sortAsc]);

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  const initials = store.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const heroProduct = filteredProducts[0] || null;
  const gridProducts = filteredProducts.slice(1);

  return (
    <div className="space-y-3 pb-4">
      {/* BLOCO 1: Card Superior (Header Centrado + Saudação + Barra de Busca com Botão Filter) */}
      <section className="bg-white rounded-b-[28px] px-5 pt-5 pb-6 border-b border-slate-200/70">
        {/* Top Bar: Avatar à esquerda | Nome da Loja centralizado em CAPS | Sacola à direita */}
        <header className="flex items-center justify-between">
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt={store.name}
              className="w-11 h-11 rounded-full object-cover border border-bege-200 bg-rosa-100"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-rosa-100 text-slate-900 flex items-center justify-center font-extrabold text-sm">
              {initials}
            </div>
          )}

          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-900 truncate max-w-[180px] text-center">
            {store.name}
          </span>

          <CartBadgeButton storeSlug={store.slug} />
        </header>

        {/* Saudação Editorial Grande */}
        <div className="mt-6">
          <h1 className="text-[26px] text-slate-900 tracking-tight leading-tight">
            <span className="font-light">Olá, </span>
            <span className="font-extrabold">bem-vindo!</span>
          </h1>
          <p className="text-xs text-slate-600 font-normal mt-1 leading-relaxed">
            {store.welcome_message ||
              "Escolha seus favoritos e faça seu pedido direto no WhatsApp."}
          </p>
        </div>

        {/* Barra de Busca Pílula Branca com Botão Filter embutido à direita */}
        <div className="mt-5 flex items-center bg-white border border-slate-200 rounded-full p-1.5 pl-4">
          <Search className="w-4 h-4 text-slate-600 stroke-[2] shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar aqui..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-600 px-3 py-1.5 outline-none min-w-0"
          />
          <button
            type="button"
            onClick={() =>
              setSortAsc((prev) =>
                prev === null ? true : prev === true ? false : null
              )
            }
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-full active:scale-95 transition cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2]" />
            <span>
              {sortAsc === null
                ? "Filtrar"
                : sortAsc
                ? "Menor R$"
                : "Maior R$"}
            </span>
          </button>
        </div>
      </section>

      {/* BLOCO 2: Container Principal de Categorias + Card Hero em Destaque + Grid */}
      <section className="bg-white rounded-[28px] px-4 py-5 border border-slate-200/70">
        {/* Pílulas de Categoria (Ativa em Rosa Zapia #ED70C0 + Texto Slate-900) */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategoryId("all")}
            className={`rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === "all"
                ? "bg-rosa-500 text-slate-900"
                : "bg-slate-50 text-slate-600 hover:bg-bege-100 hover:text-slate-900"
            }`}
          >
            Destaques
          </button>
          {categories.map((cat) => {
            const isActive = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-rosa-500 text-slate-900"
                    : "bg-slate-50 text-slate-600 hover:bg-bege-100 hover:text-slate-900"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-rosa-100 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-slate-900 stroke-[2]" />
            </div>
            <p className="text-sm font-bold text-slate-900">
              Nenhum produto encontrado
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Tente outro termo na busca ou troque de categoria.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* HERO PRODUCT CARD (1º produto em destaque amplo como na referência) */}
            {heroProduct && (
              <div className="rounded-[24px] bg-slate-50 p-3 border border-slate-200/60">
                <div className="relative aspect-[4/3] w-full rounded-[20px] bg-rosa-100 overflow-hidden group">
                  <Link
                    href={`/${store.slug}/${heroProduct.slug}`}
                    className="block w-full h-full"
                  >
                    {heroProduct.image_url ? (
                      <img
                        src={heroProduct.image_url}
                        alt={heroProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ShoppingBag className="w-12 h-12 stroke-[2]" />
                      </div>
                    )}
                  </Link>

                  {/* Botão Favorito Circular no Canto Superior Direito */}
                  <button
                    type="button"
                    onClick={(e) => toggleLike(e, heroProduct.id)}
                    aria-label="Favoritar produto"
                    className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center absolute top-3 right-3 active:scale-90 transition cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 stroke-[2] ${
                        likedIds[heroProduct.id]
                          ? "fill-[#ED70C0] text-rosa-700"
                          : "text-slate-900"
                      }`}
                    />
                  </button>

                  {/* Botão Rápido + no Canto Inferior Direito da Foto */}
                  <div className="absolute bottom-3 right-3">
                    <AddToCartButton
                      product={{
                        id: heroProduct.id,
                        storeSlug: store.slug,
                        name: heroProduct.name,
                        slug: heroProduct.slug,
                        price: Number(heroProduct.price),
                        image_url: heroProduct.image_url,
                        categoryName:
                          heroProduct.category_name ||
                          (heroProduct.category_id &&
                            categoryMap[heroProduct.category_id]) ||
                          "Destaque",
                      }}
                    />
                  </div>
                </div>

                {/* Rodapé do Card Hero: Nome em 2 linhas à esquerda | Label "Preço" + Valor à direita */}
                <Link
                  href={`/${store.slug}/${heroProduct.slug}`}
                  className="mt-3 px-1.5 pb-1 flex items-end justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {heroProduct.name}
                    </h2>
                    <span className="text-[11px] text-slate-600">
                      {heroProduct.category_name ||
                        (heroProduct.category_id &&
                          categoryMap[heroProduct.category_id]) ||
                        "Destaque"}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-[11px] text-slate-600 font-normal">
                      Preço
                    </span>
                    <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                      {formatCurrency(Number(heroProduct.price))}
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* GRID 2 COLUNAS PARA OS DEMAIS PRODUTOS */}
            {gridProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-3.5">
                {gridProducts.map((product) => {
                  const categoryLabel =
                    product.category_name ||
                    (product.category_id && categoryMap[product.category_id]) ||
                    "Destaque";

                  return (
                    <div
                      key={product.id}
                      className="rounded-[22px] bg-slate-50 p-2.5 border border-slate-200/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-square w-full rounded-[18px] bg-rosa-100/70 overflow-hidden mb-2.5 group">
                          <Link
                            href={`/${store.slug}/${product.slug}`}
                            className="block w-full h-full"
                          >
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <ShoppingBag className="w-8 h-8 stroke-[2]" />
                              </div>
                            )}
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => toggleLike(e, product.id)}
                            aria-label="Favoritar"
                            className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center absolute top-2.5 right-2.5 active:scale-90 transition cursor-pointer"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 stroke-[2] ${
                                likedIds[product.id]
                                  ? "fill-[#ED70C0] text-rosa-700"
                                  : "text-slate-900"
                              }`}
                            />
                          </button>
                        </div>

                        <Link
                          href={`/${store.slug}/${product.slug}`}
                          className="px-1 block"
                        >
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {product.name}
                          </h3>
                          <span className="text-[11px] text-slate-600">
                            {categoryLabel}
                          </span>
                        </Link>
                      </div>

                      <div className="px-1 pt-2 flex items-end justify-between">
                        <div>
                          <span className="block text-[10px] text-slate-600 leading-none">
                            Preço
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                            {formatCurrency(Number(product.price))}
                          </span>
                        </div>

                        <AddToCartButton
                          product={{
                            id: product.id,
                            storeSlug: store.slug,
                            name: product.name,
                            slug: product.slug,
                            price: Number(product.price),
                            image_url: product.image_url,
                            categoryName: categoryLabel,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* BLOCO 3: Rodapé Completo (Formas de pagamento, envio, contato com mapa e segurança) */}
      <StoreFooter store={store} />
    </div>
  );
}
