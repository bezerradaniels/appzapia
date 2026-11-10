"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  X,
} from "lucide-react";
import { useCartStore, formatCurrency } from "@/store/cartStore";
import type { StoreData, ProductData } from "@/utils/demoData";

interface ProductDetailClientProps {
  store: StoreData;
  product: ProductData;
  relatedProducts?: ProductData[];
}

export default function ProductDetailClient({
  store,
  product,
  relatedProducts = [],
}: ProductDetailClientProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [liked, setLiked] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  // Build gallery thumbnails (main image + related product images or variations)
  const galleryImages = [
    product.image_url,
    ...relatedProducts
      .map((p) => p.image_url)
      .filter((url): url is string => Boolean(url && url !== product.image_url)),
  ]
    .filter((url): url is string => Boolean(url))
    .slice(0, 4);

  const [activeImage, setActiveImage] = useState<string | null>(
    product.image_url || null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const storeItems = mounted
    ? items.filter((i) => i.storeSlug === store.slug)
    : [];

  const subtotal = storeItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        storeSlug: store.slug,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        image_url: product.image_url,
        categoryName: product.category_name,
      },
      qty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    setCartSheetOpen(true);
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.id,
        storeSlug: store.slug,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        image_url: product.image_url,
        categoryName: product.category_name,
      },
      qty
    );
    router.push(`/${store.slug}/checkout`);
  };

  return (
    <div className="min-h-screen bg-white pb-28 relative">
      {/* 1. HERO SHOWCASE COLORIDO INTEGRADO (Como na tela central da referência) */}
      <div className="bg-rosa-100 rounded-b-[36px] px-5 pt-4 pb-6 relative overflow-hidden">
        {/* Top Bar integrada sobre o Hero */}
        <header className="flex items-center justify-between relative z-10">
          <Link
            href={`/${store.slug}`}
            aria-label="Voltar para o catálogo"
            className="w-11 h-11 rounded-full bg-white text-slate-900 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </Link>

          <span className="text-sm font-bold text-slate-900">Detalhes</span>

          <button
            type="button"
            onClick={() => setLiked((prev) => !prev)}
            aria-label="Favoritar produto"
            className="w-11 h-11 rounded-full bg-white text-slate-900 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          >
            <Heart
              className={`w-5 h-5 stroke-[2] ${
                liked ? "fill-[#ED70C0] text-rosa-700" : "text-slate-900"
              }`}
            />
          </button>
        </header>

        {/* Foto Principal + Coluna Lateral Direita de Miniaturas */}
        <div className="mt-4 relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-white/50 flex items-center justify-center">
          {activeImage ? (
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ShoppingBag className="w-16 h-16 text-slate-600 stroke-[2]" />
          )}

          {/* Stack vertical de miniaturas à direita (igual à imagem de referência) */}
          {galleryImages.length > 1 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white/85 backdrop-blur-md p-1.5 rounded-[18px]">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-12 h-12 rounded-[14px] overflow-hidden border-2 transition cursor-pointer ${
                    activeImage === imgUrl
                      ? "border-slate-900 scale-105"
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. CORPO DE DETALHES (Título à esquerda + Seletor `- 01 +` à direita) */}
      <div className="px-5 pt-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-extrabold text-slate-900 leading-snug flex-1">
            {product.name}
          </h1>

          {/* Seletor de Quantidade em Pílula (`- 01 +` com `+` em Rosa Zapia) */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full p-1 pl-3 shrink-0">
            <button
              type="button"
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              aria-label="Diminuir quantidade"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2]" />
            </button>
            <span className="text-xs font-extrabold text-slate-900 min-w-[20px] text-center">
              {String(qty).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setQty((prev) => prev + 1)}
              aria-label="Aumentar quantidade"
              className="w-8 h-8 rounded-full bg-rosa-500 text-slate-900 flex items-center justify-center active:scale-90 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Linha de Preço + Indicador de Categoria/Disponibilidade */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-600 font-normal">Valor:</span>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(Number(product.price))}
            </span>
            {product.compare_at_price &&
              product.compare_at_price > product.price && (
                <span className="text-xs text-slate-600 line-through">
                  {formatCurrency(Number(product.compare_at_price))}
                </span>
              )}
          </div>

          {/* Bolinhas decorativas da paleta da marca / status */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-rosa-500 ring-2 ring-offset-2 ring-rosa-500" />
            <span className="w-5 h-5 rounded-full bg-slate-900" />
            <span className="w-5 h-5 rounded-full bg-rosa-100 border border-slate-200" />
          </div>
        </div>

        {/* Seletor de Tamanho ("Selecione o Tamanho: PP P M G GG" igual à referência) */}
        <div>
          <span className="block text-xs font-bold text-slate-900 mb-2.5">
            Selecione o Tamanho
          </span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["PP", "P", "M", "G", "GG", "XG"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center transition cursor-pointer shrink-0 ${
                  selectedSize === size
                    ? "bg-rosa-500 text-slate-900"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-900"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div>
          <h2 className="text-xs font-bold text-slate-900 mb-1.5">Descrição</h2>
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            {product.description ||
              `Produto disponível no catálogo oficial da ${store.name}. Adicione à sua sacolinha e envie seu pedido direto pelo WhatsApp.`}
          </p>
        </div>
      </div>

      {/* 3. BARRA FLUTUANTE EM CÁPSULA ("Add to Cart" | "Buy Now") IGUAL À IMAGEM CENTRAL */}
      <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-5 z-30">
        <div className="bg-slate-50/95 backdrop-blur-md border border-slate-200 rounded-full p-2 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3.5 rounded-full bg-slate-200/80 hover:bg-slate-200 text-slate-900 font-bold text-xs active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-sucesso stroke-[2.5]" />
                <span>Adicionado</span>
              </>
            ) : (
              <span>Adicionar à sacola</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 py-3.5 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 font-bold text-xs active:scale-95 transition cursor-pointer"
          >
            Pedir agora
          </button>
        </div>
      </div>

      {/* 4. BOTTOM SHEET "MY CART" (3ª TELA DA REFERÊNCIA - ABRE AO ADICIONAR ITEM) */}
      {cartSheetOpen && (
        <div className="fixed inset-0 z-50 max-w-md mx-auto flex flex-col justify-end bg-slate-900/40 backdrop-blur-[2px]">
          <div
            className="flex-1"
            onClick={() => setCartSheetOpen(false)}
          />

          <div className="bg-white rounded-t-[32px] p-5 pb-6 border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            {/* Puxador superior do Sheet */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

            {/* Header do Sheet: "Minha Sacola" + pílula "Ir para o Checkout" */}
            <div className="bg-slate-50 rounded-[20px] px-4 py-3 flex items-center justify-between mb-4">
              <span className="text-sm font-extrabold text-slate-900">
                Minha Sacola
              </span>

              <Link
                href={`/${store.slug}/checkout`}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-900 hover:bg-bege-100 transition"
              >
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                <span>Fechar pedido</span>
              </Link>
            </div>

            {/* Lista de Itens no Sheet com Pílula Preta de Preço e botão X */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
              {storeItems.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-slate-50 rounded-[22px] p-3 flex items-center justify-between gap-3 border border-slate-200/70"
                >
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remover item"
                    className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-erro flex items-center justify-center absolute -top-1.5 -right-1 z-10 cursor-pointer"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>

                  <div className="flex items-center gap-3 min-w-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-14 h-14 rounded-[16px] bg-rosa-100 object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-[16px] bg-rosa-100 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-5 h-5 text-slate-900 stroke-[2]" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-bold text-slate-600">
                          Qtd: {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pílula Preta de Preço igual à 3ª tela da imagem */}
                  <span className="bg-slate-900 text-white text-xs font-extrabold px-3.5 py-2 rounded-full shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Resumo Sub-total / Taxa de Entrega / Total Price */}
            <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Sub-total</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Entrega</span>
                <span className="font-bold text-slate-900">A combinar</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-200/60">
                <span className="font-bold text-slate-900">Valor Total</span>
                <span className="font-extrabold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Botão Largo de Checkout em Rosa Zapia */}
            <Link
              href={`/${store.slug}/checkout`}
              className="mt-4 w-full py-4 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 font-bold text-sm flex items-center justify-center active:scale-95 transition"
            >
              Finalizar Pedido
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
