"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { checkSlugAvailability } from "@/app/actions/checkSlug";
import { normalizeSlug } from "@/utils/slug";
import {
  formatWhatsappMask,
  validateWhatsapp,
  normalizeWhatsappForStorage,
} from "@/utils/masks";

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [stateUf, setStateUf] = useState("");

  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{
    available: boolean;
    reason?: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!slugTouched) {
      setSlug(normalizeSlug(name));
    }
  }, [name, slugTouched]);

  useEffect(() => {
    const clean = normalizeSlug(slug);
    if (!clean) {
      setSlugStatus(null);
      return;
    }

    setCheckingSlug(true);
    const timer = setTimeout(async () => {
      const result = await checkSlugAvailability(clean);
      setSlugStatus({
        available: result.available,
        reason: result.reason,
      });
      setCheckingSlug(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const finalSlug = normalizeSlug(slug);
    if (!name.trim() || !finalSlug || !whatsapp.trim()) {
      setErrorMsg("Faltou preencher o nome da loja, o link ou o WhatsApp.");
      return;
    }

    if (slugStatus && !slugStatus.available) {
      setErrorMsg(slugStatus.reason || "Escolha outro link para sua loja.");
      return;
    }

    const phoneCheck = validateWhatsapp(whatsapp);
    if (!phoneCheck.valid) {
      setErrorMsg(
        phoneCheck.reason || "Informe um WhatsApp válido com DDD."
      );
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: newStore, error } = await supabase
        .from("stores")
        .insert({
          owner_id: user.id,
          name: name.trim(),
          slug: finalSlug,
          whatsapp: normalizeWhatsappForStorage(whatsapp),
          city: city.trim(),
          state: stateUf.trim().toUpperCase(),
        })
        .select()
        .single();

      if (error || !newStore) {
        setErrorMsg(
          error?.message || "Não conseguimos criar a loja. Tente outro link."
        );
        setSubmitting(false);
        return;
      }

      await supabase.from("categories").insert([
        {
          store_id: newStore.id,
          name: "Destaques",
          slug: "destaques",
          sort_order: 1,
        },
        {
          store_id: newStore.id,
          name: "Novidades",
          slug: "novidades",
          sort_order: 2,
        },
      ]);

      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMsg("Ocorreu um imprevisto ao colocar sua loja no ar.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bege-100 flex flex-col justify-center items-center px-5 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center mb-8">
          <img
            src="/logos/zapia-horizontal.svg"
            alt="Zapia"
            className="h-9 w-auto min-w-[96px]"
          />
        </div>

        <div className="bg-white rounded-[28px] border border-bege-200 p-7">
          <div className="inline-flex items-center gap-2 bg-rosa-100 text-rosa-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
            <span>Sua vitrine pronta em 3 minutos</span>
          </div>

          <h1 className="text-2xl text-slate-900 tracking-tight">
            <span className="font-light">Vamos colocar sua </span>
            <span className="font-extrabold text-rosa-700">loja no ar?</span>
          </h1>
          <p className="text-xs text-slate-600 font-normal mt-1 mb-6">
            Escolha o nome, o link para mandar no Instagram e o WhatsApp que vai
            receber os pedidos.
          </p>

          <form onSubmit={handleCreateStore} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Nome da sua loja
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Aura Boutique"
                className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Link exclusivo da sua loja
              </label>
              <div className="flex items-center bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 focus-within:ring-2 focus-within:ring-rosa-500 focus-within:border-rosa-500">
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(normalizeSlug(e.target.value));
                  }}
                  placeholder="auraboutique"
                  className="flex-1 bg-transparent text-sm font-extrabold text-slate-900 outline-none"
                />
                <span className="text-xs font-bold text-slate-600 select-none">
                  .zapia.app
                </span>
              </div>

              <div className="mt-1.5 min-h-[20px]">
                {checkingSlug && (
                  <span className="text-[11px] text-slate-600 font-medium">
                    Conferindo se o link está livre...
                  </span>
                )}
                {!checkingSlug && slug && slugStatus?.available && (
                  <span className="text-[11px] text-sucesso font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Link
                    disponível: {slug}.zapia.app
                  </span>
                )}
                {!checkingSlug && slug && slugStatus && !slugStatus.available && (
                  <span className="text-[11px] text-erro font-bold">
                    {slugStatus.reason}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                WhatsApp que recebe os pedidos (com DDD)
              </label>
              <input
                type="tel"
                required
                inputMode="numeric"
                maxLength={15}
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatWhatsappMask(e.target.value))}
                placeholder="(11) 99999-9999"
                className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Sua cidade
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex.: São Paulo"
                  className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  UF
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={stateUf}
                  onChange={(e) => setStateUf(e.target.value.toUpperCase())}
                  placeholder="SP"
                  className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 uppercase placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rosa-100 text-erro text-xs font-bold px-4 py-3 rounded-[20px]">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={
                submitting ||
                checkingSlug ||
                Boolean(slugStatus && !slugStatus.available)
              }
              className="w-full py-4 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 font-bold text-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              {submitting
                ? "Colocando sua loja no ar..."
                : "Colocar meu catálogo no ar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
