"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Plus,
  ExternalLink,
  Check,
  Copy,
} from "lucide-react";
import { useState } from "react";
import { signOutAction } from "@/app/login/actions";

interface AdminSidebarProps {
  storeName: string;
  storeSlug: string;
}

export default function AdminSidebar({
  storeName,
  storeSlug,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const navItems = [
    { href: "/admin", label: "Visão Geral" },
    { href: "/admin/produtos", label: "Produtos" },
    { href: "/admin/categorias", label: "Categorias" },
    { href: "/admin/pagamentos", label: "Formas de Pagamento" },
    { href: "/admin/entrega", label: "Formas de Entrega" },
    { href: "/admin/configuracoes", label: "Configurações" },
  ];

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${storeSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 p-6 justify-between">
        <div>
          <div className="flex items-center justify-between mb-8">
            <Link href="/admin" className="block">
              <img
                src="/logos/zapia-horizontal.svg"
                alt="Zapia"
                className="h-8 w-auto min-w-[96px]"
              />
            </Link>
          </div>

          {/* Store Pill */}
          <div className="bg-bege-100 rounded-[20px] p-4 mb-6 border border-bege-200">
            <p className="text-[11px] text-slate-600 font-normal">Sua loja</p>
            <p className="text-sm font-extrabold text-slate-900 truncate">
              {storeName}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-900 rounded-full py-1.5 px-3 text-[11px] font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-sucesso stroke-[2.5]" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 stroke-[2]" />
                    <span>Compartilhar</span>
                  </>
                )}
              </button>
              <Link
                href={`/${storeSlug}`}
                target="_blank"
                aria-label="Ver catálogo"
                className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-rosa-500 hover:text-slate-900 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
              </Link>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-bege-100 hover:text-slate-900"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6">
            <Link
              href="/admin/produtos/novo"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 text-xs font-bold transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Novo produto</span>
            </Link>
          </div>
        </div>

        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-bege-100 hover:text-slate-900 transition cursor-pointer"
          >
            Sair da conta
          </button>
        </form>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-5 py-3.5">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img
              src="/logos/zapia-simbolo.svg"
              alt="Zapia"
              className="w-8 h-8"
            />
            <div>
              <p className="text-xs font-extrabold text-slate-900 leading-none">
                {storeName}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {storeSlug}.zapia.app
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/${storeSlug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-bege-100 text-slate-900 text-xs font-bold px-3.5 py-2 rounded-full"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
              <span>Ver catálogo</span>
            </Link>
            <Link
              href="/admin/produtos/novo"
              aria-label="Novo Produto"
              className="w-9 h-9 rounded-full bg-rosa-500 text-slate-900 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mt-3 pt-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-bege-100 text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>
    </>
  );
}
