import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  category_id: string | null;
  images: string[];
  ingredients: string | null;
  net_quantity: string | null;
  in_stock: boolean;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

export type CustomizationOption = {
  id: string;
  group_key: string;
  group_label: string;
  name: string;
  price_delta: number;
  is_active: boolean;
  sort_order: number;
};

export type GiftBoxSize = {
  id: string;
  name: string;
  capacity: number;
  price: number;
  is_active: boolean;
  sort_order: number;
};

export type GiftBoxAddon = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  allows_message: boolean;
  is_active: boolean;
  sort_order: number;
};

export type PaymentMethod = {
  id: string;
  code: string;
  name: string;
  instructions: string | null;
  is_active: boolean;
  sort_order: number;
};

export type Settings = Record<string, string>;

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return (data ?? []) as T;
}

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () =>
    unwrap<Category[]>(
      await supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    ),
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async () =>
    unwrap<Product[]>(
      await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ),
});

export const customizationOptionsQuery = queryOptions({
  queryKey: ["customization_options"],
  queryFn: async () =>
    unwrap<CustomizationOption[]>(
      await supabase
        .from("customization_options")
        .select("*")
        .order("sort_order", { ascending: true }),
    ),
});

export const giftBoxSizesQuery = queryOptions({
  queryKey: ["gift_box_sizes"],
  queryFn: async () =>
    unwrap<GiftBoxSize[]>(
      await supabase.from("gift_box_sizes").select("*").order("sort_order", { ascending: true }),
    ),
});

export const giftBoxAddonsQuery = queryOptions({
  queryKey: ["gift_box_addons"],
  queryFn: async () =>
    unwrap<GiftBoxAddon[]>(
      await supabase.from("gift_box_addons").select("*").order("sort_order", { ascending: true }),
    ),
});

export const paymentMethodsQuery = queryOptions({
  queryKey: ["payment_methods"],
  queryFn: async () =>
    unwrap<PaymentMethod[]>(
      await supabase.from("payment_methods").select("*").order("sort_order", { ascending: true }),
    ),
});

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async (): Promise<Settings> => {
    const rows = unwrap<{ key: string; value: string | null }[]>(
      await supabase.from("site_settings").select("key, value"),
    );
    return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
  },
});

export const settingRowsQuery = queryOptions({
  queryKey: ["site_settings_rows"],
  queryFn: async () =>
    unwrap<{ key: string; value: string | null; label: string | null; group_key: string }[]>(
      await supabase.from("site_settings").select("*").order("group_key").order("key"),
    ),
});

export function productImage(p: Pick<Product, "images">) {
  return p.images?.[0] ?? "";
}

export function productPrice(p: Pick<Product, "price" | "sale_price">) {
  return Number(p.sale_price ?? p.price);
}
