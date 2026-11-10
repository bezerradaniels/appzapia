"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { authenticateAction } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [state, formAction, isPending] = useActionState(
    authenticateAction,
    null
  );

  return (
    <div className="min-h-screen bg-bege-100 flex flex-col justify-center items-center px-5 py-12 relative overflow-hidden">
      {/* Grafismo-chave: Faixa rosa com canto em grande curva */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute top-0 left-0 w-72 h-72 bg-rosa-500 rounded-br-[120px] pointer-events-none"
      />

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 bg-white/90 px-4 py-2 rounded-full border border-bege-200 hover:bg-white transition"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
            <span>Voltar</span>
          </Link>

          <Link href="/">
            <img
              src="/logos/zapia-horizontal.svg"
              alt="Zapia"
              className="h-9 w-auto min-w-[96px]"
            />
          </Link>
        </div>

        <div className="bg-white rounded-[28px] border border-bege-200 p-7">
          {/* Seletor Login vs Criar Conta */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-bege-100 rounded-full mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Entrar na conta
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-rosa-500 text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Criar loja grátis
            </button>
          </div>

          <h1 className="text-2xl text-slate-900 tracking-tight">
            {mode === "login" ? (
              <>
                <span className="font-light">Que bom te ver </span>
                <span className="font-extrabold text-rosa-700">de volta</span>
              </>
            ) : (
              <>
                <span className="font-light">Crie seu </span>
                <span className="font-extrabold text-rosa-700">
                  catálogo grátis
                </span>
              </>
            )}
          </h1>
          <p className="text-xs text-slate-600 font-normal mt-1 mb-6">
            {mode === "login"
              ? "Entre para cuidar dos produtos e pedidos da sua loja."
              : "Do catálogo ao pedido confirmado, na conversa que seu cliente já usa."}
          </p>

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="mode" value={mode} />

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Seu e-mail
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="voce@sualoja.com"
                className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Sua senha
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="Pelo menos 6 caracteres"
                className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500 transition"
              />
            </div>

            {state?.error && (
              <div className="bg-rosa-100 text-erro text-xs font-bold px-4 py-3 rounded-[20px]">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 font-bold text-sm active:scale-95 transition disabled:opacity-60 cursor-pointer"
            >
              {isPending
                ? "Entrando..."
                : mode === "login"
                ? "Entrar na minha loja"
                : "Comece agora"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-center gap-4 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-rosa-700 stroke-[2.5]" /> Sem
              cartão de crédito
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-rosa-700 stroke-[2.5]" /> No ar
              em 3 minutos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
