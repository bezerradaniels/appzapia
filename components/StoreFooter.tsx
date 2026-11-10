"use client";

import { useState } from "react";
import {
  Landmark,
  Banknote,
  CreditCard,
  FileText,
  Link2,
  Truck,
  Store,
  Smartphone,
  Bell,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Lock,
  Share,
  Check,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { composeFullAddress } from "@/utils/masks";
import type { StoreData } from "@/utils/demoData";

interface StoreFooterProps {
  store: StoreData;
}

function formatPhoneDisplay(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55") && digits.length >= 12) {
    const ddd = digits.slice(2, 4);
    const number = digits.slice(4);
    return `+55 ${ddd}${number}`;
  }
  return `+${digits}`;
}

function PixIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.999 2.25c.6 0 1.2.23 1.658.688l2.796 2.796a2.25 2.25 0 0 1-3.182 3.182l-1.272-1.273-1.273 1.273a2.25 2.25 0 0 1-3.182-3.182l2.796-2.796A2.337 2.337 0 0 1 12 2.25ZM6.546 7.704a2.25 2.25 0 0 1 3.182 0l1.272 1.272 1.273-1.272a2.25 2.25 0 1 1 3.182 3.182L14.182 12l1.273 1.114a2.25 2.25 0 1 1-3.182 3.182L11 15.023l-1.273 1.273a2.25 2.25 0 1 1-3.182-3.182L7.818 12 6.546 10.886a2.25 2.25 0 0 1 0-3.182Zm5.453 7.38 1.273 1.272a2.25 2.25 0 0 1 3.182 3.182l-2.796 2.796a2.345 2.345 0 0 1-3.317 0l-2.796-2.796a2.25 2.25 0 0 1 3.182-3.182l1.272 1.273Z" />
    </svg>
  );
}

function WhatsAppOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

export default function StoreFooter({ store }: StoreFooterProps) {
  const [copiedShare, setCopiedShare] = useState(false);
  const items = useCartStore((state) => state.items);
  const storeCartCount = items
    .filter((i) => i.storeSlug === store.slug)
    .reduce((acc, i) => acc + i.quantity, 0);

  // Process payment methods to match screenshot labels & icons
  const rawPayments =
    store.payment_methods && store.payment_methods.length > 0
      ? store.payment_methods
      : [
          "Transferência",
          "Dinheiro",
          "Cartão de crédito",
          "Cartão de débito",
          "PIX",
        ];

  const hasCredit = rawPayments.some(
    (m) => m.toLowerCase() === "cartão de crédito"
  );
  const hasDebit = rawPayments.some(
    (m) => m.toLowerCase() === "cartão de débito"
  );

  const formattedPayments: { key: string; label: string; icon: React.ReactNode }[] = [];

  if (rawPayments.some((m) => m.toLowerCase().includes("transfer"))) {
    formattedPayments.push({
      key: "transferencia",
      label: "Transferência bancária",
      icon: <Landmark className="w-5 h-5 text-slate-600 stroke-[1.8]" />,
    });
  }

  if (rawPayments.some((m) => m.toLowerCase() === "dinheiro")) {
    formattedPayments.push({
      key: "dinheiro",
      label: "Dinheiro",
      icon: <Banknote className="w-5 h-5 text-slate-600 stroke-[1.8]" />,
    });
  }

  if (hasCredit && hasDebit) {
    formattedPayments.push({
      key: "cartao-ambos",
      label: "Cartão de crédito e débito",
      icon: <CreditCard className="w-5 h-5 text-slate-600 stroke-[1.8]" />,
    });
  } else if (hasCredit) {
    formattedPayments.push({
      key: "cartao-credito",
      label: "Cartão de crédito",
      icon: <CreditCard className="w-5 h-5 text-slate-600 stroke-[1.8]" />,
    });
  } else if (hasDebit) {
    formattedPayments.push({
      key: "cartao-debito",
      label: "Cartão de débito",
      icon: <CreditCard className="w-5 h-5 text-slate-600 stroke-[1.8]" />,
    });
  }

  if (rawPayments.some((m) => m.toLowerCase() === "pix")) {
    formattedPayments.push({
      key: "pix",
      label: "Pix",
      icon: <PixIcon className="w-5 h-5 text-slate-600" />,
    });
  }

  if (rawPayments.some((m) => m.toLowerCase() === "boleto")) {
    formattedPayments.push({
      key: "boleto",
      label: "Boleto",
      icon: <FileText className="w-5 h-5 text-slate-600 stroke-[1.8]" />,
    });
  }

  if (rawPayments.some((m) => m.toLowerCase().includes("link"))) {
    formattedPayments.push({
      key: "link",
      label: "Link de pagamento",
      icon: <Link2 className="w-5 h-5 text-slate-600 stroke-[1.8]" />,
    });
  }

  // Process delivery methods
  const rawDeliveries =
    store.delivery_methods && store.delivery_methods.length > 0
      ? store.delivery_methods
      : ["Entrega em domicílio", "Retirada na loja"];

  const getDeliveryIcon = (method: string) => {
    const lower = method.toLowerCase();
    if (lower.includes("domicílio") || lower.includes("domicilio")) {
      return <Truck className="w-5 h-5 text-slate-600 stroke-[1.8]" />;
    }
    if (lower.includes("retirada") || lower.includes("loja")) {
      return <Store className="w-5 h-5 text-slate-600 stroke-[1.8]" />;
    }
    if (lower.includes("digital")) {
      return <Smartphone className="w-5 h-5 text-slate-600 stroke-[1.8]" />;
    }
    return <Bell className="w-5 h-5 text-slate-600 stroke-[1.8]" />;
  };

  const getDeliveryLabel = (method: string) => {
    if (method.toLowerCase() === "retirada na loja") return "Retirada na Loja";
    return method;
  };

  // Contact details
  const cleanWhatsapp = (store.whatsapp || "").replace(/\D/g, "");
  const formattedPhone = formatPhoneDisplay(cleanWhatsapp);
  const storeEmail = store.email || `contato@${store.slug}.com.br`;

  const hasSeparatedFields = Boolean(
    store.address_number || store.neighborhood || store.zip_code
  );
  const fullAddress = hasSeparatedFields
    ? composeFullAddress({
        address: store.address || "",
        address_number: store.address_number || "",
        neighborhood: store.neighborhood || "",
        city: store.city || "",
        state: store.state || "",
        zip_code: store.zip_code || "",
      })
    : store.address && store.address.trim().length > 0
    ? store.address.trim()
    : [store.city, store.state].filter(Boolean).join(" - ");

  const mapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        fullAddress
      )}`
    : null;

  const mapsEmbedUrl = fullAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        fullAddress
      )}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : null;

  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          text: store.welcome_message || `Confira o catálogo da ${store.name}`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard && shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const whatsappDirectUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Olá! Vim pelo catálogo da *${store.name}* e gostaria de tirar uma dúvida.`
  )}`;

  return (
    <>
      <footer className="bg-white rounded-[28px] px-5 pt-6 pb-8 border border-slate-200/70 space-y-6">
        {/* 1. Formas de pagamento */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-600 mb-3.5">
            Formas de pagamento
          </h3>
          <ul className="space-y-3">
            {formattedPayments.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-3.5 text-[15px] text-slate-600"
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-slate-100" />

        {/* 2. Formas de envio */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-600 mb-3.5">
            Formas de envio
          </h3>
          <ul className="space-y-3">
            {rawDeliveries.map((method) => (
              <li
                key={method}
                className="flex items-center gap-3.5 text-[15px] text-slate-600"
              >
                <span className="shrink-0">{getDeliveryIcon(method)}</span>
                <span>{getDeliveryLabel(method)}</span>
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-slate-100" />

        {/* 3. Contato + Mapa */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-600 mb-3.5">
            Contato
          </h3>
          <ul className="space-y-3.5">
            {storeEmail && (
              <li>
                <a
                  href={`mailto:${storeEmail}`}
                  className="flex items-center gap-3.5 text-[15px] text-slate-600 hover:text-slate-900 transition"
                >
                  <Mail className="w-5 h-5 text-slate-600 stroke-[1.8] shrink-0" />
                  <span className="truncate">{storeEmail}</span>
                </a>
              </li>
            )}

            {formattedPhone && (
              <li>
                <a
                  href={`tel:${cleanWhatsapp}`}
                  className="flex items-center gap-3.5 text-[15px] text-slate-600 hover:text-slate-900 transition"
                >
                  <Phone className="w-5 h-5 text-slate-600 stroke-[1.8] shrink-0" />
                  <span>{formattedPhone}</span>
                </a>
              </li>
            )}

            {formattedPhone && (
              <li>
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 text-[15px] text-slate-600 hover:text-slate-900 transition"
                >
                  <WhatsAppOutlineIcon className="w-5 h-5 text-slate-600 shrink-0" />
                  <span>{formattedPhone}</span>
                </a>
              </li>
            )}

            {fullAddress && (
              <li className="flex items-start gap-3.5 text-[15px] text-slate-600 leading-relaxed">
                <MapPin className="w-5 h-5 text-slate-600 stroke-[1.8] shrink-0 mt-0.5" />
                <span>{fullAddress}</span>
              </li>
            )}
          </ul>

          {/* Card de Mapa Google Maps */}
          {mapsEmbedUrl && mapsUrl && (
            <div className="mt-4 relative rounded-[16px] overflow-hidden border border-slate-200 bg-slate-100 h-36">
              <iframe
                title={`Localização de ${store.name}`}
                src={mapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2.5 left-2.5 bg-white hover:bg-slate-50 text-[#1A73E8] text-xs font-bold px-3 py-1.5 rounded-md border border-slate-200/90 inline-flex items-center gap-1.5 shadow-xs transition"
              >
                <span>Maps</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.2]" />
              </a>
            </div>
          )}
        </div>

        <hr className="border-slate-100" />

        {/* 4. Segurança */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-600 mb-3.5">
            Segurança
          </h3>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Selo SSL 256 BITS */}
            <div className="inline-flex flex-col rounded-md border border-slate-300 overflow-hidden bg-white">
              <div className="bg-slate-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 text-center">
                SITE SEGURO
              </div>
              <div className="px-2.5 py-1 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-600 stroke-[2.2]" />
                <div className="leading-none">
                  <span className="block text-xs font-extrabold text-slate-700 tracking-tight">
                    SSL
                  </span>
                  <span className="block text-[8px] font-bold text-slate-600 uppercase">
                    256 BITS
                  </span>
                </div>
              </div>
            </div>

            {/* Selo Google Safe Browsing */}
            <div className="inline-flex items-center gap-1.5 py-1">
              <div className="w-6 h-7 rounded-b-full rounded-t-sm bg-[#34A853] flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-bold text-slate-600">
                  Google
                </span>
                <span className="block text-[10px] text-slate-600">
                  Safe Browsing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Copyright */}
        <div className="pt-2 text-center">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()}. {store.name}. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>

      {/* Botões Flutuantes Inferiores (Compartilhar à esquerda | WhatsApp à direita) */}
      <div
        className={`fixed left-0 right-0 max-w-md mx-auto px-4 z-30 pointer-events-none flex items-center justify-between transition-all ${
          storeCartCount > 0 ? "bottom-20" : "bottom-4"
        }`}
      >
        <button
          type="button"
          onClick={handleShare}
          aria-label="Compartilhar loja"
          title="Compartilhar catálogo"
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#7C8BA1] hover:bg-slate-600 text-white flex items-center justify-center shadow-md active:scale-95 transition cursor-pointer"
        >
          {copiedShare ? (
            <Check className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <Share className="w-5 h-5 stroke-[2]" />
          )}
        </button>

        {cleanWhatsapp && (
          <a
            href={whatsappDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar no WhatsApp"
            title="Conversar no WhatsApp"
            className="pointer-events-auto w-12 h-12 rounded-full bg-[#25D366] hover:opacity-95 text-white flex items-center justify-center shadow-md active:scale-95 transition"
          >
            <WhatsAppOutlineIcon className="w-6 h-6" />
          </a>
        )}
      </div>
    </>
  );
}
