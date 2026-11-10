import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  storeSlug: string;
  name: string;
  slug: string;
  price: number;
  image_url?: string | null;
  categoryName?: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearStoreCart: (storeSlug: string) => void;
  getStoreItems: (storeSlug: string) => CartItem[];
  getStoreTotalCount: (storeSlug: string) => number;
  getStoreTotalPrice: (storeSlug: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.id === newItem.id && i.storeSlug === newItem.storeSlug
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated };
          }
          return {
            items: [...state.items, { ...newItem, quantity }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearStoreCart: (storeSlug) => {
        set((state) => ({
          items: state.items.filter((i) => i.storeSlug !== storeSlug),
        }));
      },

      getStoreItems: (storeSlug) => {
        return get().items.filter((i) => i.storeSlug === storeSlug);
      },

      getStoreTotalCount: (storeSlug) => {
        return get()
          .items.filter((i) => i.storeSlug === storeSlug)
          .reduce((acc, item) => acc + item.quantity, 0);
      },

      getStoreTotalPrice: (storeSlug) => {
        return get()
          .items.filter((i) => i.storeSlug === storeSlug)
          .reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: "zapia-cart-storage",
    }
  )
);

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
