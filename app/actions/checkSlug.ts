"use server";

import { createClient } from "@/utils/supabase/server";
import { RESERVED_SLUGS, normalizeSlug } from "@/utils/slug";

export async function checkSlugAvailability(
  rawSlug: string,
  excludeStoreId?: string
): Promise<{
  available: boolean;
  normalized: string;
  reason?: string;
}> {
  const normalized = normalizeSlug(rawSlug);

  if (!normalized || normalized.length < 3) {
    return {
      available: false,
      normalized,
      reason: "O endereço deve ter pelo menos 3 caracteres.",
    };
  }

  if (RESERVED_SLUGS.includes(normalized) || normalized === "demo") {
    return {
      available: false,
      normalized,
      reason: "Este endereço é reservado pelo sistema.",
    };
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("stores")
      .select("id")
      .eq("slug", normalized);

    if (excludeStoreId) {
      query = query.neq("id", excludeStoreId);
    }

    const { data } = await query.maybeSingle();

    if (data) {
      return {
        available: false,
        normalized,
        reason: "Este endereço já está em uso por outra loja.",
      };
    }

    return {
      available: true,
      normalized,
    };
  } catch {
    return {
      available: true,
      normalized,
    };
  }
}
