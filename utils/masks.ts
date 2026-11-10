/**
 * Remove o DDI 55 caso o número salvo tenha 12 ou 13 dígitos (ex: 5511999999999 -> 11999999999)
 */
export function extractLocalPhoneDigits(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return digits.slice(2);
  }
  return digits.slice(0, 11);
}

/**
 * Aplica máscara brasileira de WhatsApp/Telefone: (11) 99999-9999 ou (11) 3333-4444
 */
export function formatWhatsappMask(raw: string): string {
  const digits = extractLocalPhoneDigits(raw);
  if (!digits) return "";

  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Valida se o WhatsApp possui DDD válido (11..99) + 8 ou 9 dígitos
 */
export function validateWhatsapp(value: string): {
  valid: boolean;
  reason?: string;
} {
  const digits = extractLocalPhoneDigits(value);
  if (digits.length < 10 || digits.length > 11) {
    return {
      valid: false,
      reason: "Informe o DDD + número completo no formato (11) 99999-9999.",
    };
  }
  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) {
    return {
      valid: false,
      reason: "Informe um DDD válido (ex.: 11, 21, 61).",
    };
  }
  return { valid: true };
}

/**
 * Converte o valor com máscara para o padrão internacional com DDI 55 (ex: 5511999999999)
 */
export function normalizeWhatsappForStorage(value: string): string {
  const localDigits = extractLocalPhoneDigits(value);
  if (!localDigits) return "";
  return `55${localDigits}`;
}

/**
 * Aplica máscara de CEP: 00000-000
 */
export function formatCepMask(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

export interface SeparatedAddress {
  address: string;
  address_number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

/**
 * Monta o endereço completo legível para o rodapé e Google Maps
 * Ex.: "Rua Oscar Freire, 850 - Jardim Paulista, São Paulo - SP, 01426-001"
 */
export function composeFullAddress(parts: Partial<SeparatedAddress>): string {
  const street = (parts.address || "").trim();
  const number = (parts.address_number || "").trim();
  const neighborhood = (parts.neighborhood || "").trim();
  const city = (parts.city || "").trim();
  const state = (parts.state || "").trim().toUpperCase();
  const zip = formatCepMask(parts.zip_code || "");

  const streetPart = [street, number].filter(Boolean).join(", ");
  const neighborhoodPart = neighborhood ? `${neighborhood}` : "";
  const leftSide = [streetPart, neighborhoodPart].filter(Boolean).join(" - ");

  const cityStatePart = [city, state].filter(Boolean).join(" - ");
  const combined = [leftSide, cityStatePart, zip].filter(Boolean).join(", ");
  return combined;
}

/**
 * Extrai rua, número, bairro e CEP caso o endereço esteja salvo como string única no banco
 * Formato esperado: "Rua X, 123 - Bairro Y, Cidade - UF, 00000-000"
 */
export function parseFullAddress(
  fullAddress?: string | null,
  fallbackCity?: string | null,
  fallbackState?: string | null
): SeparatedAddress {
  const raw = (fullAddress || "").trim();
  if (!raw) {
    return {
      address: "",
      address_number: "",
      neighborhood: "",
      city: fallbackCity || "",
      state: fallbackState || "",
      zip_code: "",
    };
  }

  let working = raw;
  let zip_code = "";

  // Extrai CEP no final se existir (00000-000 ou 8 dígitos)
  const cepMatch = working.match(/(\d{5}-?\d{3})\s*$/);
  if (cepMatch) {
    zip_code = formatCepMask(cepMatch[1]);
    working = working.slice(0, cepMatch.index).replace(/,\s*$/, "").trim();
  }

  let city = fallbackCity || "";
  let state = (fallbackState || "").toUpperCase();

  // Remove ", Cidade - UF" do final se presente
  const cityStateMatch = working.match(/,\s*([^,-]+?)\s*-\s*([A-Za-z]{2})\s*$/);
  if (cityStateMatch) {
    if (!city) city = cityStateMatch[1].trim();
    if (!state) state = cityStateMatch[2].trim().toUpperCase();
    working = working.slice(0, cityStateMatch.index).trim();
  }

  let neighborhood = "";
  const dashIndex = working.lastIndexOf(" - ");
  if (dashIndex !== -1) {
    neighborhood = working.slice(dashIndex + 3).trim();
    working = working.slice(0, dashIndex).trim();
  }

  let address = working;
  let address_number = "";
  const commaIndex = working.lastIndexOf(",");
  if (commaIndex !== -1) {
    address = working.slice(0, commaIndex).trim();
    address_number = working.slice(commaIndex + 1).trim();
  }

  return {
    address,
    address_number,
    neighborhood,
    city,
    state,
    zip_code,
  };
}
