"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyStoreLinkButton({
  storeSlug,
}: {
  storeSlug: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/${storeSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-slate-900 bg-white hover:bg-bege-100 text-slate-900 text-xs font-bold px-5 py-3 active:scale-95 transition-all cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-sucesso stroke-[2.5]" />
          <span>Link copiado!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 stroke-[2]" />
          <span>Compartilhar</span>
        </>
      )}
    </button>
  );
}
