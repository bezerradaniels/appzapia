"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  X,
} from "lucide-react";
import { useCartStore, formatCurrency } from "@/store/cartStore";

interface CheckoutClientProps {
  storeSlug: string;
  storeName: string;
  storeWhatsapp: string;
  paymentMethods: string[];
  deliveryMethods: string[];
  deliveryNotes?: string | null;
  deliveryFee?: number;
}

export default function CheckoutClient({
  storeSlug,
  storeName,
  storeWhatsapp,
  paymentMethods,
  deliveryMethods,
  deliveryNotes,
  deliveryFee = 0,
}: CheckoutClientProps) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [customerName, setCustomerName] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<string>(
    deliveryMethods[0] || "Entrega em domicílio"
  );
  const [address, setAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string>(
    paymentMethods[0] || "PIX"
  );
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const storeItems = mounted
    ? items.filter((i) => i.storeSlug === storeSlug)
    : [];

  const subtotalPrice = storeItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const requiresAddress =
    selectedDelivery.toLowerCase().includes("entrega em domicílio") ||
    selectedDelivery.toLowerCase().includes("servico de quarto") ||
    selectedDelivery.toLowerCase().includes("serviço de quarto");

  const activeDeliveryFee =
    selectedDelivery.toLowerCase().includes("entrega em domicílio") &&
    deliveryFee > 0
      ? deliveryFee
      : 0;

  const totalPrice = subtotalPrice + activeDeliveryFee;

  const handleSendWhatsApp = () => {
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Faltou colocar o seu nome.");
      return;
    }

    if (requiresAddress && !address.trim()) {
      setErrorMsg("Faltou informar o endereço ou quarto de entrega.");
      return;
    }

    const cleanPhone = storeWhatsapp.replace(/\D/g, "");
    const phoneWithCountry = cleanPhone.startsWith("55")
      ? cleanPhone
      : `55${cleanPhone}`;

    const itemLines = storeItems
      .map(
        (item) =>
          `• ${item.quantity}x *${item.name}* — ${formatCurrency(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const messageParts = [
      `Olá, *${storeName}*! 👋`,
      `Gostaria de confirmar meu pedido pelo catálogo Zapia:`,
      ``,
      `*ITENS DO PEDIDO:*`,
      itemLines,
      ``,
      `*Sub-total:* ${formatCurrency(subtotalPrice)}`,
      ...(activeDeliveryFee > 0
        ? [`*Taxa de Entrega:* ${formatCurrency(activeDeliveryFee)}`]
        : []),
      `*Total:* ${formatCurrency(totalPrice)}`,
      `------------------------------`,
      `*Cliente:* ${customerName.trim()}`,
      `*Método de Entrega:* ${selectedDelivery}`,
      ...(requiresAddress ? [`*Endereço:* ${address.trim()}`] : []),
      `*Forma de Pagamento:* ${selectedPayment}`,
      ...(notes.trim() ? [`*Observações:* ${notes.trim()}`] : []),
    ];

    const encodedText = encodeURIComponent(messageParts.join("\n"));
    const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodedText}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Hero Header suave com Sheet branco logo abaixo */}
      <div className="bg-rosa-100 px-5 pt-4 pb-10">
        <header className="flex items-center justify-between">
          <Link
            href={`/${storeSlug}`}
            aria-label="Voltar para a vitrine"
            className="w-11 h-11 rounded-full bg-white text-slate-900 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </Link>
          <span className="text-sm font-bold text-slate-900">{storeName}</span>
          <div className="w-11 h-11" />
        </header>
      </div>

      {/* Sheet Principal Arredondado sobrepondo o topo */}
      <div className="-mt-6 bg-white rounded-t-[32px] px-5 pt-4 pb-8 border-t border-slate-200/70">
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

        <div className="bg-slate-50 rounded-[20px] px-4 py-3 flex items-center justify-between mb-5 border border-slate-200/60">
          <h1 className="text-base font-extrabold text-slate-900">
            Minha Sacola
          </h1>

          <Link
            href={`/${storeSlug}`}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-900 hover:bg-bege-100 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
            <span>+ Produtos</span>
          </Link>
        </div>

        {storeItems.length === 0 ? (
          <div className="py-14 text-center">
            <div className="w-16 h-16 rounded-full bg-rosa-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-7 h-7 text-slate-900 stroke-[2]" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">
              Sua sacola está vazia
            </h2>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Escolha seus produtos favoritos na vitrine para pedir pelo zap.
            </p>
            <Link
              href={`/${storeSlug}`}
              className="inline-flex items-center justify-center bg-rosa-500 text-slate-900 text-xs font-bold px-6 py-3.5 rounded-full active:scale-95 transition-transform"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            {/* 1. Lista de Itens */}
            <div className="space-y-3 mb-6">
              {storeItems.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-slate-50 p-3.5 rounded-[22px] border border-slate-200/70 flex items-center justify-between gap-3"
                >
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remover item"
                    className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-erro flex items-center justify-center absolute -top-1.5 -right-1 z-10 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  <div className="flex items-center gap-3.5 min-w-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 rounded-[18px] bg-rosa-100 object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-[18px] bg-rosa-100 flex items-center justify-center flex-shrink-0 text-slate-600">
                        <ShoppingBag className="w-6 h-6 stroke-[2]" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {formatCurrency(item.price)} / un.
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Diminuir quantidade"
                          className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 cursor-pointer"
                        >
                          <Minus className="w-3 h-3 stroke-[2]" />
                        </button>
                        <span className="text-xs font-extrabold text-slate-900 min-w-[18px] text-center">
                          {String(item.quantity).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Aumentar quantidade"
                          className="w-6 h-6 rounded-full bg-rosa-500 text-slate-900 flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <span className="bg-slate-900 text-white text-xs font-extrabold px-4 py-2 rounded-full shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Banner de informações especiais sobre entrega configurado pelo lojista */}
            {deliveryNotes && (
              <div className="bg-rosa-100 text-slate-900 rounded-[18px] px-4 py-3 text-xs font-medium mb-5">
                {deliveryNotes}
              </div>
            )}

            {/* 2. Bloco de Dados de Entrega e Pagamento Dinâmicos */}
            <div className="space-y-4 pt-2 border-t border-slate-200/70">
              <h2 className="text-sm font-extrabold text-slate-900">
                Dados para envio no WhatsApp
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Seu nome
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex.: Mariana Silva"
                  className="w-full bg-white border border-slate-200 rounded-[18px] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Método de entrega
                </label>
                <div className="flex flex-wrap gap-2">
                  {deliveryMethods.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedDelivery(method)}
                      className={`py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedDelivery === method
                          ? "bg-rosa-500 text-slate-900"
                          : "bg-white border border-slate-200 text-slate-600"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {requiresAddress && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Endereço completo
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, bairro e complemento"
                    className="w-full bg-white border border-slate-200 rounded-[18px] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Forma de pagamento
                </label>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedPayment(method)}
                      className={`py-2.5 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedPayment === method
                          ? "bg-slate-900 text-white"
                          : "bg-white border border-slate-200 text-slate-600"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Observações (opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex.: Troco para R$ 50, entregar na portaria..."
                  className="w-full bg-white border border-slate-200 rounded-[18px] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
                />
              </div>

              {errorMsg && (
                <div className="bg-rosa-100 text-erro text-xs font-bold px-4 py-3 rounded-[18px]">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* 3. Resumo Sub-total / Taxa de Entrega / Valor Total + Botão Largo Rosa Zapia */}
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Sub-total</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(subtotalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Taxa de Entrega</span>
                <span className="font-bold text-slate-900">
                  {!requiresAddress
                    ? "Grátis"
                    : activeDeliveryFee > 0
                    ? formatCurrency(activeDeliveryFee)
                    : "A combinar"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
                <span className="text-sm font-bold text-slate-900">
                  Valor Total
                </span>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="mt-4 w-full py-4 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Pedir no WhatsApp</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
