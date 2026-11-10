"use client";

import { useState, useEffect } from "react";
import { Check, Image as ImageIcon, Link2, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { checkSlugAvailability } from "@/app/actions/checkSlug";
import { normalizeSlug } from "@/utils/slug";
import {
  formatWhatsappMask,
  validateWhatsapp,
  normalizeWhatsappForStorage,
  formatCepMask,
  composeFullAddress,
  parseFullAddress,
} from "@/utils/masks";

export default function AdminSettingsPage() {
  const [storeId, setStoreId] = useState("");
  const [name, setName] = useState("");

  // URL / Slug da loja
  const [slug, setSlug] = useState("");
  const [initialSlug, setInitialSlug] = useState("");
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{
    available: boolean;
    reason?: string;
  } | null>(null);

  // Contato
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [email, setEmail] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Endereço separado: CEP, Estado (sigla), Cidade, Bairro, Endereço, Número
  const [zipCode, setZipCode] = useState("");
  const [stateUf, setStateUf] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (!store) return;
      setStoreId(store.id);
      setName(store.name || "");
      setSlug(store.slug || "");
      setInitialSlug(store.slug || "");
      setWhatsapp(formatWhatsappMask(store.whatsapp || ""));
      setEmail(store.email || "");
      setWelcomeMessage(store.welcome_message || "");
      setLogoUrl(store.logo_url || null);

      // Se já houver campos separados no banco, usa eles; caso contrário, separa do campo address
      if (store.neighborhood || store.address_number || store.zip_code) {
        setStreetAddress(store.address || "");
        setAddressNumber(store.address_number || "");
        setNeighborhood(store.neighborhood || "");
        setCity(store.city || "");
        setStateUf((store.state || "").toUpperCase());
        setZipCode(formatCepMask(store.zip_code || ""));
      } else {
        const parsed = parseFullAddress(
          store.address,
          store.city,
          store.state
        );
        setStreetAddress(parsed.address);
        setAddressNumber(parsed.address_number);
        setNeighborhood(parsed.neighborhood);
        setCity(parsed.city);
        setStateUf(parsed.state);
        setZipCode(parsed.zip_code);
      }
    }
    load();
  }, []);

  // Verificação em tempo real da disponibilidade da nova URL da loja
  useEffect(() => {
    if (!storeId) return;
    const clean = normalizeSlug(slug);
    if (!clean) {
      setSlugStatus({
        available: false,
        reason: "Informe um endereço válido para a loja.",
      });
      return;
    }

    if (clean === initialSlug) {
      setSlugStatus({ available: true });
      setCheckingSlug(false);
      return;
    }

    setCheckingSlug(true);
    const timer = setTimeout(async () => {
      const result = await checkSlugAvailability(clean, storeId);
      setSlugStatus({
        available: result.available,
        reason: result.reason,
      });
      setCheckingSlug(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [slug, initialSlug, storeId]);

  const handleCepChange = async (rawValue: string) => {
    const masked = formatCepMask(rawValue);
    setZipCode(masked);

    const digits = masked.replace(/\D/g, "");
    if (digits.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        if (res.ok) {
          const data = await res.json();
          if (!data.erro) {
            if (data.logradouro) setStreetAddress(data.logradouro);
            if (data.bairro) setNeighborhood(data.bairro);
            if (data.localidade) setCity(data.localidade);
            if (data.uf) setStateUf(String(data.uf).toUpperCase());
          }
        }
      } catch {
        // Silencia erro de rede no preenchimento automático de CEP
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) return;

    const supabase = createClient();
    const ext = file.name.split(".").pop() || "png";
    const filePath = `${storeId}/logo-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("store-assets")
      .upload(filePath, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage
        .from("store-assets")
        .getPublicUrl(filePath);
      setLogoUrl(data.publicUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setWhatsappError("");

    if (!storeId) return;

    const finalSlug = normalizeSlug(slug);
    if (!finalSlug || finalSlug.length < 3) {
      setFormError("A URL da loja deve ter pelo menos 3 caracteres.");
      return;
    }

    if (slugStatus && !slugStatus.available) {
      setFormError(slugStatus.reason || "Esta URL não está disponível.");
      return;
    }

    const phoneCheck = validateWhatsapp(whatsapp);
    if (!phoneCheck.valid) {
      setWhatsappError(
        phoneCheck.reason || "Informe um WhatsApp válido com DDD."
      );
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const composedAddress = composeFullAddress({
      address: streetAddress,
      address_number: addressNumber,
      neighborhood,
      city,
      state: stateUf,
      zip_code: zipCode,
    });

    const normalizedWhatsapp = normalizeWhatsappForStorage(whatsapp);

    // Tenta salvar incluindo as colunas separadas; se o schema ainda não tiver as colunas opcionais, salva no campo address composto
    const { error: fullError } = await supabase
      .from("stores")
      .update({
        name: name.trim(),
        slug: finalSlug,
        whatsapp: normalizedWhatsapp,
        email: email.trim(),
        welcome_message: welcomeMessage.trim(),
        address: streetAddress.trim() || composedAddress,
        address_number: addressNumber.trim(),
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        state: stateUf.trim().toUpperCase(),
        zip_code: formatCepMask(zipCode),
        logo_url: logoUrl,
      })
      .eq("id", storeId);

    if (fullError) {
      const { error: fallbackError } = await supabase
        .from("stores")
        .update({
          name: name.trim(),
          slug: finalSlug,
          whatsapp: normalizedWhatsapp,
          email: email.trim(),
          welcome_message: welcomeMessage.trim(),
          address: composedAddress,
          city: city.trim(),
          state: stateUf.trim().toUpperCase(),
          logo_url: logoUrl,
        })
        .eq("id", storeId);

      if (fallbackError) {
        setSaving(false);
        setFormError(
          fallbackError.message || "Não foi possível salvar as alterações."
        );
        return;
      }
    }

    setInitialSlug(finalSlug);
    setSlug(finalSlug);
    setSaving(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Configurações da sua loja
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Personalize a URL da loja, o WhatsApp de pedidos e o endereço exibido
          no rodapé.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-[28px] border border-slate-200 p-6 md:p-7 space-y-5"
      >
        {/* Logo da Loja */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-rosa-100 border border-bege-200 overflow-hidden flex items-center justify-center shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-900 stroke-[2]" />
            )}
          </div>
          <div>
            <label className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-bold px-4 py-2.5 cursor-pointer transition">
              <span>Trocar foto ou logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-600 mt-1">
              Fica redondinha no topo do seu catálogo.
            </p>
          </div>
        </div>

        {/* Nome da Loja */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Nome da sua loja
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
          />
        </div>

        {/* URL / Link Exclusivo da Loja */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            URL da sua loja (endereço do catálogo)
          </label>
          <div className="flex items-center bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 focus-within:ring-2 focus-within:ring-rosa-500 focus-within:border-rosa-500">
            <Link2 className="w-4 h-4 text-slate-600 mr-2.5 shrink-0" />
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(normalizeSlug(e.target.value))}
              placeholder="sualoja"
              className="flex-1 bg-transparent text-sm font-extrabold text-slate-900 outline-none min-w-0"
            />
            <span className="text-xs font-bold text-slate-600 select-none">
              .zapia.app
            </span>
          </div>

          <div className="mt-1.5 min-h-[18px]">
            {checkingSlug && (
              <span className="text-[11px] text-slate-600 font-medium">
                Verificando disponibilidade da URL...
              </span>
            )}
            {!checkingSlug &&
              slug &&
              slug === initialSlug &&
              slugStatus?.available && (
                <span className="text-[11px] text-slate-600">
                  URL ativa atual: <strong>/{slug}</strong> ({slug}.zapia.app)
                </span>
              )}
            {!checkingSlug &&
              slug &&
              slug !== initialSlug &&
              slugStatus?.available && (
                <span className="text-[11px] text-sucesso font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Nova URL
                  disponível: {slug}.zapia.app
                </span>
              )}
            {!checkingSlug && slug && slugStatus && !slugStatus.available && (
              <span className="text-[11px] text-erro font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 stroke-[2.2]" />
                {slugStatus.reason}
              </span>
            )}
          </div>
        </div>

        {/* WhatsApp com máscara e validação */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            WhatsApp dos pedidos (com DDD)
          </label>
          <input
            type="tel"
            required
            inputMode="numeric"
            maxLength={15}
            value={whatsapp}
            onChange={(e) => {
              const masked = formatWhatsappMask(e.target.value);
              setWhatsapp(masked);
              if (whatsappError) {
                const check = validateWhatsapp(masked);
                if (check.valid) setWhatsappError("");
              }
            }}
            onBlur={() => {
              if (whatsapp) {
                const check = validateWhatsapp(whatsapp);
                setWhatsappError(check.valid ? "" : check.reason || "");
              }
            }}
            placeholder="(11) 99999-9999"
            className={`w-full bg-white border rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 ${
              whatsappError
                ? "border-erro focus:ring-erro focus:border-erro"
                : "border-slate-200 focus:ring-rosa-500 focus:border-rosa-500"
            }`}
          />
          {whatsappError ? (
            <p className="text-[11px] text-erro font-bold mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>{whatsappError}</span>
            </p>
          ) : (
            <p className="text-[11px] text-slate-600 mt-1">
              Formato: (DDD) 90000-0000
            </p>
          )}
        </div>

        {/* E-mail de contato */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            E-mail de contato (exibido no rodapé)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex.: contato@sualoja.com.br"
            className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
          />
        </div>

        {/* Recado de boas-vindas */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Recado de boas-vindas na vitrine
          </label>
          <textarea
            rows={2}
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Ex.: Moda feminina autoral! Escolha seus favoritos e mande no zap."
            className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500 resize-none"
          />
        </div>

        {/* Seção de Endereço Separado */}
        <div className="pt-2 border-t border-slate-100 space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              Endereço físico e localização no mapa
            </h2>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Preencha os campos abaixo para exibir o endereço e o Google Maps
              no rodapé da loja.
            </p>
          </div>

          {/* Linha 1: CEP + Estado (Sigla) + Cidade */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-5 sm:col-span-4">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                CEP {loadingCep && <span className="font-normal">(...)</span>}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={9}
                value={zipCode}
                onChange={(e) => handleCepChange(e.target.value)}
                placeholder="00000-000"
                className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
              />
            </div>

            <div className="col-span-3 sm:col-span-3">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Estado (UF)
              </label>
              <input
                type="text"
                maxLength={2}
                value={stateUf}
                onChange={(e) =>
                  setStateUf(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
                }
                placeholder="SP"
                className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 uppercase placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500 text-center font-bold"
              />
            </div>

            <div className="col-span-12 sm:col-span-5">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex.: São Paulo"
                className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
              />
            </div>
          </div>

          {/* Linha 2: Bairro */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Bairro
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Ex.: Jardim Paulista"
              className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
            />
          </div>

          {/* Linha 3: Endereço (Logradouro) + Número */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-8 sm:col-span-9">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Endereço (Rua / Avenida / Quadra)
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="Ex.: Rua Oscar Freire"
                className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
              />
            </div>

            <div className="col-span-4 sm:col-span-3">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Número
              </label>
              <input
                type="text"
                value={addressNumber}
                onChange={(e) => setAddressNumber(e.target.value)}
                placeholder="850"
                className="w-full bg-white border border-slate-200 rounded-[20px] px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rosa-500 focus:border-rosa-500"
              />
            </div>
          </div>
        </div>

        {formError && (
          <div className="bg-rosa-100 text-erro text-xs font-bold px-4 py-3 rounded-[20px]">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={
            saving ||
            checkingSlug ||
            Boolean(slugStatus && !slugStatus.available)
          }
          className="w-full py-4 rounded-full bg-rosa-500 hover:opacity-95 text-slate-900 font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {savedToast ? (
            <>
              <Check className="w-4 h-4 text-sucesso stroke-[2.5]" />
              <span>Tudo salvo!</span>
            </>
          ) : (
            <span>{saving ? "Salvando..." : "Salvar alterações"}</span>
          )}
        </button>
      </form>
    </div>
  );
}
