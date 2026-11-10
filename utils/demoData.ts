export interface StoreData {
  id: string;
  name: string;
  slug: string;
  whatsapp: string;
  email?: string | null;
  address?: string | null;
  address_number?: string | null;
  neighborhood?: string | null;
  zip_code?: string | null;
  logo_url: string | null;
  welcome_message: string | null;
  city?: string | null;
  state?: string | null;
  payment_methods?: string[];
  delivery_methods?: string[];
  delivery_notes?: string | null;
  delivery_fee?: number | null;
  is_active: boolean;
}

export interface CategoryData {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface ProductData {
  id: string;
  store_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  is_active: boolean;
  category_name?: string;
}

export const DEMO_STORE: StoreData = {
  id: "demo-store-01",
  name: "Aura Boutique",
  slug: "demo",
  whatsapp: "5511999999999",
  email: "contato@auraboutique.com",
  address: "Rua Oscar Freire",
  address_number: "850",
  neighborhood: "Jardim Paulista",
  zip_code: "01426-001",
  logo_url:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  welcome_message:
    "Moda feminina autoral e looks versáteis. Escolha o tamanho e peça pelo WhatsApp!",
  city: "São Paulo",
  state: "SP",
  payment_methods: [
    "Dinheiro",
    "PIX",
    "Transferência",
    "Cartão de crédito",
    "Cartão de débito",
  ],
  delivery_methods: ["Entrega em domicílio", "Retirada na loja"],
  delivery_notes: "Frete Grátis a partir de R$ 250,00!",
  delivery_fee: 15,
  is_active: true,
};

export const DEMO_CATEGORIES: CategoryData[] = [
  { id: "cat-1", store_id: "demo-store-01", name: "Vestidos", slug: "vestidos", sort_order: 1 },
  { id: "cat-2", store_id: "demo-store-01", name: "Conjuntos", slug: "conjuntos", sort_order: 2 },
  { id: "cat-3", store_id: "demo-store-01", name: "Tricot & Casacos", slug: "tricot-casacos", sort_order: 3 },
  { id: "cat-4", store_id: "demo-store-01", name: "Bolsas", slug: "bolsas", sort_order: 4 },
];

export const DEMO_PRODUCTS: ProductData[] = [
  {
    id: "prod-1",
    store_id: "demo-store-01",
    category_id: "cat-3",
    category_name: "Tricot & Casacos",
    name: "Moletom Oversized Essential Peach",
    slug: "moletom-oversized-essential-peach",
    description:
      "Confeccionado em algodão peluciado 100% premium com modelagem confortavelmente ampla, capuz estruturado e punhos canelados.",
    price: 189.9,
    compare_at_price: 229.9,
    image_url:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
  {
    id: "prod-2",
    store_id: "demo-store-01",
    category_id: "cat-1",
    category_name: "Vestidos",
    name: "Vestido Midi Linho Puro Off-White",
    slug: "vestido-midi-linho-off-white",
    description:
      "Caimento leve em linho misto com viscose, alças reguláveis, decote reto e fenda lateral discreta. Ideal para dias ensolarados.",
    price: 249.0,
    compare_at_price: 289.0,
    image_url:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
  {
    id: "prod-3",
    store_id: "demo-store-01",
    category_id: "cat-2",
    category_name: "Conjuntos",
    name: "Conjunto Alfaiataria Linho Rose",
    slug: "conjunto-alfaiataria-linho-rose",
    description:
      "Coletinho estruturado com botões forrados acompanhado de calça pantalona de cintura alta com pregas frontais.",
    price: 319.9,
    compare_at_price: null,
    image_url:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
  {
    id: "prod-4",
    store_id: "demo-store-01",
    category_id: "cat-3",
    category_name: "Tricot & Casacos",
    name: "Cardigan Tricot Trama Artesanal",
    slug: "cardigan-tricot-trama-artesanal",
    description:
      "Toque macio de fio mousse, mangas bufantes e modelagem soltinha perfeita para sobreposições meia-estação.",
    price: 169.9,
    compare_at_price: 199.9,
    image_url:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
  {
    id: "prod-5",
    store_id: "demo-store-01",
    category_id: "cat-1",
    category_name: "Vestidos",
    name: "Camisa Oversized Algodão Egípcio",
    slug: "camisa-oversized-algodao-egipcio",
    description:
      "Peça coringa do guarda-roupa cápsula: corte de alfaiataria, botões madrepérola e tecido respirável que quase não amassa.",
    price: 159.0,
    compare_at_price: null,
    image_url:
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
  {
    id: "prod-6",
    store_id: "demo-store-01",
    category_id: "cat-4",
    category_name: "Bolsas",
    name: "Bolsa Tiracolo Couro Minimal",
    slug: "bolsa-tiracolo-couro-minimal",
    description:
      "Design geométrico contemporâneo com alça ajustável, fecho magnético invisível e forro em camurça suave.",
    price: 219.0,
    compare_at_price: 259.0,
    image_url:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
];
