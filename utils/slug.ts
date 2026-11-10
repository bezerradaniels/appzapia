export const RESERVED_SLUGS = [
  "admin",
  "api",
  "login",
  "cadastro",
  "onboarding",
  "checkout",
  "termos",
  "privacidade",
  "www",
  "app",
  "zapia",
];

export function normalizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
