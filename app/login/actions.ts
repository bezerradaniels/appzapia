"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function authenticateAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const mode = (formData.get("mode") as string) || "login";
  const email = ((formData.get("email") as string) || "").trim();
  const password = (formData.get("password") as string) || "";

  if (!email || !password) {
    return { error: "Preencha seu e-mail e senha." };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();

  if (mode === "signup") {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (!data.session) {
      // Attempt immediate sign in if email confirmation is off
      const signInRes = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInRes.error) {
        return {
          error:
            "Conta criada! Verifique seu e-mail para confirmar o acesso ou faça login.",
        };
      }
    }

    redirect("/onboarding");
  }

  // Login mode
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "E-mail ou senha inválidos." };
  }

  // Smart redirect: check if user already owns a store
  const { data: existingStore } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", data.user.id)
    .maybeSingle();

  if (existingStore) {
    redirect("/admin");
  } else {
    redirect("/onboarding");
  }
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
