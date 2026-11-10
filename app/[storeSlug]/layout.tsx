import FloatingCart from "@/components/FloatingCart";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;

  return (
    <div className="min-h-screen bg-bege-100">
      <div className="max-w-md mx-auto min-h-screen bg-slate-50 border-x border-bege-200 relative pb-28 overflow-x-hidden">
        {children}
        <FloatingCart storeSlug={storeSlug} />
      </div>
    </div>
  );
}
