"use client";

import { useState, useEffect } from "react";
import { Check, Lightbulb } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const AVAILABLE_DELIVERY_METHODS = [
  "Entrega em domicílio",
  "Retirada na loja",
  "Entrega digital",
  "Serviço de Quarto",
];

const MAX_NOTES_LENGTH = 190;

export default function AdminDeliveryMethodsPage() {
  const [storeId, setStoreId] = useState<string>("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([
    "Entrega em domicílio",
    "Retirada na loja",
  ]);
  const [deliveryNotes, setDeliveryNotes] = useState<string>("");
  const [deliveryFee, setDeliveryFee] = useState<string>("0,00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: store } = await supabase
        .from("stores")
        .select("id, delivery_methods, delivery_notes, delivery_fee")
        .eq("owner_id", user.id)
        .single();

      if (store) {
        setStoreId(store.id);
        if (
          Array.isArray(store.delivery_methods) &&
          store.delivery_methods.length > 0
        ) {
          setSelectedMethods(store.delivery_methods);
        }
        setDeliveryNotes(store.delivery_notes || "");
        setDeliveryFee(
          store.delivery_fee !== undefined && store.delivery_fee !== null
            ? String(Number(store.delivery_fee).toFixed(2)).replace(".", ",")
            : "0,00"
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  const toggleMethod = (method: string) => {
    setSelectedMethods((prev) => {
      if (prev.includes(method)) {
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== method);
      }
      return [...prev, method];
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;

    setSaving(true);
    const parsedFee = parseFloat(deliveryFee.replace(",", "."));
    const numericFee = isNaN(parsedFee) || parsedFee < 0 ? 0 : parsedFee;

    const supabase = createClient();
    await supabase
      .from("stores")
      .update({
        delivery_methods: selectedMethods,
        delivery_notes: deliveryNotes.trim(),
        delivery_fee: numericFee,
      })
      .eq("id", storeId);

    setSaving(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const remainingChars = MAX_NOTES_LENGTH - deliveryNotes.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-[28px] border border-slate-200 p-6 md:p-8">
        <div className="text-center pb-5 border-b border-slate-200">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Métodos de entrega
          </h1>
        </div>

        {loading ? (
          <div className="py-10 text-center text-xs text-slate-600">
            Carregando métodos de entrega...
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-6 space-y-6">
            {/* Grid 2 Colunas de Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {AVAILABLE_DELIVERY_METHODS.map((method) => {
                const isChecked = selectedMethods.includes(method);
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => toggleMethod(method)}
                    className="flex items-center gap-3 text-left group cursor-pointer py-1"
                  >
                    <span
                      className={`w-6 h-6 rounded-[6px] flex items-center justify-center transition border ${
                        isChecked
                          ? "bg-rosa-500 border-rosa-500 text-slate-900"
                          : "bg-white border-slate-200 group-hover:border-slate-600"
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {method}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Callout de Configuração de Frete Simples (Igual à 3ª imagem enviada) */}
            <div className="rounded-[20px] border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-rosa-100 text-rosa-700 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 stroke-[2]" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="font-bold text-slate-900">
                    Importante:
                  </strong>{" "}
                  Configure uma taxa de frete fixa abaixo (ou deixe{" "}
                  <strong className="font-bold text-slate-900">0,00</strong>{" "}
                  para combinar no WhatsApp).
                </p>
              </div>

              <div className="sm:w-36 shrink-0">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Taxa de Frete (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-white border border-slate-200 rounded-[14px] px-3 py-2 text-sm font-extrabold text-slate-900 outline-none focus:ring-2 focus:ring-rosa-500"
                />
              </div>
            </div>

            {/* Informações especiais sobre entrega e envio */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Informações especiais sobre entrega e envio
              </label>
              <textarea
                rows={4}
                maxLength={MAX_NOTES_LENGTH}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Insira aqui informações importantes sobre a entrega que você gostaria que seus clientes soubessem. Ex.: Frete Grátis a partir de R$200,00!"
                className="w-full bg-white border border-slate-200 rounded-[18px] p-4 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500 resize-none"
              />
              <span className="block text-xs text-slate-600 mt-1.5">
                {remainingChars} caracteres restantes
              </span>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-10 py-3.5 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {savedToast ? (
                  <>
                    <Check className="w-4 h-4 text-sucesso stroke-[2.5]" />
                    <span>Salvo!</span>
                  </>
                ) : (
                  <span>{saving ? "Salvando..." : "Salvar"}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
