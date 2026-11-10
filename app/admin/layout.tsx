import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!store) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar storeName={store.name} storeSlug={store.slug} />
      <main className="md:pl-64">
        <div className="max-w-5xl mx-auto px-5 py-8 md:py-10">{children}</div>
      </main>
    </div>
  );
}
