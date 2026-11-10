import Link from "next/link";
import {
  ShoppingBag,
  Check,
  ExternalLink,
  Plus,
  Search,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bege-100 text-slate-900">
      {/* Navbar Principal */}
      <header className="sticky top-0 z-30 bg-bege-100/90 backdrop-blur-md border-b border-bege-200">
        <div className="max-w-6xl mx-auto px-5 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center py-2">
            <img
              src="/logos/zapia-horizontal.svg"
              alt="Zapia"
              className="h-9 w-auto min-w-[96px]"
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:bg-bege-200 px-4 py-2.5 rounded-full transition"
            >
              <span>Ver catálogo demo</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold text-slate-900 border border-slate-900 hover:bg-slate-900 hover:text-white px-5 py-2.5 rounded-full transition"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="bg-rosa-500 hover:opacity-95 text-slate-900 text-xs font-bold px-6 py-3 rounded-full active:scale-95 transition-all"
            >
              Comece agora
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section com Recorte Curvo Assinatura */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Grafismo-chave: Faixa rosa com canto em grande curva */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-0 left-0 w-[44%] h-[420px] bg-rosa-500 rounded-br-[140px] pointer-events-none"
          />

          <div className="relative max-w-6xl mx-auto px-5 pt-12 pb-20 md:pt-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 bg-white rounded-[28px] p-8 sm:p-11 border border-bege-200 space-y-6">
              <div className="inline-flex items-center gap-2 bg-rosa-100 text-rosa-700 text-xs font-bold px-4 py-1.5 rounded-full">
                <span>01 · UMA MARCA QUE VENDE COM SORRISO</span>
              </div>

              {/* Assinatura Tipográfica: Light 300 + ExtraBold 800 na mesma manchete */}
              <h1 className="text-4xl sm:text-5xl text-slate-900 tracking-tight leading-[1.12]">
                <span className="font-light">Crie seu </span>
                <span className="font-extrabold text-rosa-700">catálogo</span>
                <br />
                <span className="font-light">online </span>
                <span className="font-extrabold text-rosa-700">grátis</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
                Coloque a vitrine da sua loja no bolso do cliente. Catálogos
                bonitos, prontos para mandar no WhatsApp, sem loja virtual
                complicada.
              </p>

              {/* Trio de botões oficial do Manual (pág. 14) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-rosa-500 hover:opacity-95 text-slate-900 font-bold text-sm px-8 py-4 rounded-full active:scale-95 transition-all"
                >
                  <span>Comece agora</span>
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-8 py-4 rounded-full active:scale-95 transition"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2]" />
                  <span>Ver catálogo</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rosa-700 stroke-[2.5]" /> Seu
                  link .zapia.app em 3 min
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rosa-700 stroke-[2.5]" />{" "}
                  Pedido confirmado no WhatsApp
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-rosa-700 stroke-[2.5]" /> Zero
                  taxa por venda
                </span>
              </div>
            </div>

            {/* Mockup do Catálogo no Celular seguindo o novo Layout Storefront (Loja de Roupas) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-slate-50 rounded-[32px] border border-bege-200 p-3 space-y-2.5">
                {/* Bloco 1 do Mockup */}
                <div className="bg-white rounded-[24px] p-4 border border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Aura Boutique"
                      className="w-9 h-9 rounded-full object-cover border border-bege-200"
                    />
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-900">
                      AURA BOUTIQUE
                    </span>
                    <div className="w-9 h-9 rounded-full bg-slate-200/60 flex items-center justify-center relative">
                      <ShoppingBag className="w-4 h-4 text-slate-900 stroke-[2]" />
                      <span className="bg-slate-900 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center absolute -top-1 -right-1">
                        2
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-lg text-slate-900 leading-tight">
                      <span className="font-light">Olá, </span>
                      <span className="font-extrabold">bem-vinda!</span>
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Moda autoral que valoriza seu estilo todos os dias.
                    </p>
                  </div>

                  {/* Search + Filter Pill */}
                  <div className="mt-3.5 bg-slate-50 border border-slate-200/80 rounded-full p-1 pl-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Search className="w-3.5 h-3.5 text-slate-600 stroke-[2]" />
                      <span>Buscar peças...</span>
                    </div>
                    <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                      Filtrar
                    </span>
                  </div>
                </div>

                {/* Bloco 2 do Mockup: Pílulas + Hero Card */}
                <div className="bg-white rounded-[24px] p-3.5 border border-slate-200/60">
                  <div className="flex items-center gap-2 overflow-hidden pb-3">
                    <span className="bg-rosa-500 text-slate-900 text-[10px] font-bold px-3.5 py-1.5 rounded-full">
                      Destaques
                    </span>
                    <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-3.5 py-1.5 rounded-full">
                      Vestidos
                    </span>
                    <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-3.5 py-1.5 rounded-full">
                      Conjuntos
                    </span>
                    <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-3.5 py-1.5 rounded-full">
                      Tricot
                    </span>
                  </div>

                  {/* Hero Card */}
                  <div className="rounded-[20px] bg-slate-50 p-2.5 border border-slate-200/60">
                    <div className="aspect-[4/3] rounded-[16px] bg-rosa-100 overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
                        alt="Moletom Oversized Essential"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-2.5 px-1 flex items-end justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Moletom Oversized Essential
                        </p>
                        <p className="text-[10px] text-slate-600">
                          Tricot & Casacos
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="block text-[9px] text-slate-600">
                          Preço
                        </span>
                        <span className="text-sm font-extrabold text-slate-900">
                          R$ 189,90
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Link
                      href="/demo"
                      className="w-full block text-center bg-rosa-500 hover:opacity-95 text-slate-900 text-xs font-bold py-3 rounded-full transition"
                    >
                      Pedir no WhatsApp
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Personalidade: Amigável, Confiável, Ousada (Pág. 3 do Manual) */}
        <section className="max-w-6xl mx-auto px-5 pb-24">
          <div className="mb-8">
            <p className="text-xs font-bold text-rosa-700 tracking-wider uppercase">
              02 · COMO FUNCIONA
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Do catálogo ao pedido confirmado, na conversa que o cliente já
              usa.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Rosa-500 com texto Slate-900 */}
            <div className="bg-rosa-500 text-slate-900 rounded-[28px] p-7">
              <span className="inline-block text-xs font-bold bg-white/80 text-slate-900 px-3 py-1 rounded-full mb-4">
                1. Amigável e próxima
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Sua loja pronta em 3 minutos
              </h3>
              <p className="text-sm text-slate-900 font-normal leading-relaxed mt-2">
                Escolha o nome da sua loja, suba as fotos dos produtos pelo
                celular e seu catálogo já está no ar. Bora vender?
              </p>
            </div>

            {/* Card 2: Slate-900 com texto Branco */}
            <div className="bg-slate-900 text-white rounded-[28px] p-7">
              <span className="inline-block text-xs font-bold bg-white/15 text-white px-3 py-1 rounded-full mb-4">
                2. Confiável e clara
              </span>
              <h3 className="text-xl font-extrabold text-white">
                Preços e pedidos sem confusão
              </h3>
              <p className="text-sm text-slate-200 font-normal leading-relaxed mt-2">
                O cliente monta a sacolinha sozinho, escolhe entrega ou retirada
                e manda o pedido completo no seu WhatsApp.
              </p>
            </div>

            {/* Card 3: Rosa-100 com texto Slate-900 */}
            <div className="bg-rosa-100 text-slate-900 rounded-[28px] p-7">
              <span className="inline-block text-xs font-bold bg-white text-rosa-700 px-3 py-1 rounded-full mb-4">
                3. Ousada e atual
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Feita para o Instagram e Google
              </h3>
              <p className="text-sm text-slate-600 font-normal leading-relaxed mt-2">
                Link exclusivo para colocar na bio e páginas otimizadas para sua
                loja aparecer nas buscas da sua cidade.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé Escuro Oficial com Recorte Curvo Rosa (Pág. 15 do Manual) */}
      <footer className="bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-md">
            <img
              src="/logos/zapia-horizontal-negativo.svg"
              alt="Zapia"
              className="h-9 w-auto min-w-[96px]"
            />
            <p className="text-sm text-slate-200 font-normal">
              Colocar a vitrine do pequeno lojista no bolso do cliente.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-200 font-bold pt-2">
              <Link href="/demo" className="hover:text-rosa-500 transition">
                Ver catálogo demo
              </Link>
              <Link href="/login" className="hover:text-rosa-500 transition">
                Painel do lojista
              </Link>
              <span className="font-normal text-slate-400">
                © {new Date().getFullYear()} Zapia.app
              </span>
            </div>
          </div>

          {/* Bloco Rosa com Grande Curva (Assinatura da pág. 15, logo mono-slate sobre rosa-500) */}
          <div className="bg-rosa-500 text-slate-900 rounded-tl-[48px] rounded-[28px] px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src="/logos/zapia-horizontal-mono-slate.svg"
              alt="Zapia"
              className="h-8 w-auto min-w-[96px]"
            />
            <Link
              href="/login"
              className="bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-full active:scale-95 transition"
            >
              Criar catálogo grátis
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
