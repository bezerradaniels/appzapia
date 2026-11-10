"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const AVAILABLE_PAYMENT_METHODS = [
  "Dinheiro",
  "PIX",
  "Transferência",
  "Boleto",
  "Cartão de crédito",
  "Link de pagamento",
  "Cartão de débito",
];

export default function AdminPaymentMethodsPage() {
  const [storeId, setStoreId] = useState<string>("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([
    "Dinheiro",
    "PIX",
    "Cartão de crédito",
    "Cartão de débito",
  ]);
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
        .select("id, payment_methods")
        .eq("owner_id", user.id)
        .single();

      if (store) {
        setStoreId(store.id);
        if (
          Array.isArray(store.payment_methods) &&
          store.payment_methods.length > 0
        ) {
          setSelectedMethods(store.payment_methods);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const toggleMethod = (method: string) => {
    setSelectedMethods((prev) => {
      if (prev.includes(method)) {
        // Keep at least 1 payment method active
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
    const supabase = createClient();
    await supabase
      .from("stores")
      .update({ payment_methods: selectedMethods })
      .eq("id", storeId);

    setSaving(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-[28px] border border-slate-200 p-6 md:p-8">
        <div className="text-center pb-5 border-b border-slate-200">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Métodos de Pagamento
          </h1>
        </div>

        <p className="text-sm text-slate-600 font-normal mt-5 leading-relaxed">
          Elas estarão disponíveis para os seus clientes escolherem como
          gostariam de pagar pelo pedido.
        </p>

        {loading ? (
          <div className="py-10 text-center text-xs text-slate-600">
            Carregando métodos de pagamento...
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-6 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {AVAILABLE_PAYMENT_METHODS.map((method) => {
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
