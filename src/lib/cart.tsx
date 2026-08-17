import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type CartItem = {
  key: string;
  type: "product" | "custom" | "giftbox";
  productId?: string | null;
  name: string;
  price: number;
  qty: number;
  image?: string;
  config?: Record<string, unknown>;
  detail?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toast: string | null;
  notify: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "celunor.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = useCallback((message: string) => setToast(message), []);

  const add = useCallback<CartContextValue["add"]>((item) => {
    const qty = item.qty ?? 1;
    setItems((current) => {
      const existing = current.find((i) => i.key === item.key);
      if (existing) {
        return current.map((i) => (i.key === item.key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...current, { ...item, qty }];
    });
    setToast(`${item.name} added to cart`);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((current) =>
      qty <= 0
        ? current.filter((i) => i.key !== key)
        : current.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((current) => current.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((a, i) => a + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((a, i) => a + i.qty * i.price, 0), [items]);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    add,
    setQty,
    remove,
    clear,
    cartOpen,
    setCartOpen,
    toast,
    notify,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
