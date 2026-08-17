import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import logoGold from "@/assets/celunor-logo-gold.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery, productsQuery, settingRowsQuery, type Product } from "@/lib/catalog";
import { inr, slugify } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Célunor" },
      { name: "description", content: "Private Célunor administration dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — Célunor" },
      { property: "og:description", content: "Private Célunor administration dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total: number;
  status: string;
  payment_method: string | null;
  created_at: string;
};

const STATUSES = ["new", "confirmed", "packed", "shipped", "delivered", "cancelled"];

function AdminDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"orders" | "products" | "settings">("orders");

  const roleQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.user.id,
        _role: "admin",
      });
      return Boolean(data);
    },
  });

  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Order[];
    },
    enabled: roleQuery.data === true,
  });

  const products = useQuery(productsQuery);
  const categories = useQuery(categoriesQuery);
  const settings = useQuery(settingRowsQuery);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  if (roleQuery.isLoading) {
    return <Shell onSignOut={signOut}>Checking your access…</Shell>;
  }
  if (!roleQuery.data) {
    return (
      <Shell onSignOut={signOut}>
        This account doesn&apos;t have admin access.
      </Shell>
    );
  }

  const updateOrder = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    void orders.refetch();
  };

  const saveProduct = async (p: Product, patch: Partial<Product>) => {
    await supabase.from("products").update(patch).eq("id", p.id);
    void qc.invalidateQueries({ queryKey: ["products"] });
  };

  const addProduct = async (form: {
    name: string;
    price: number;
    category_id: string;
    image: string;
    description: string;
  }) => {
    await supabase.from("products").insert({
      name: form.name,
      slug: `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}`,
      price: form.price,
      category_id: form.category_id || null,
      images: form.image ? [form.image] : [],
      description: form.description,
    });
    void qc.invalidateQueries({ queryKey: ["products"] });
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    void qc.invalidateQueries({ queryKey: ["products"] });
  };

  const saveSetting = async (key: string, value: string) => {
    await supabase.from("site_settings").update({ value }).eq("key", key);
    void qc.invalidateQueries({ queryKey: ["site_settings"] });
    void qc.invalidateQueries({ queryKey: ["site_settings_rows"] });
  };

  return (
    <Shell onSignOut={signOut}>
      <div className="flex flex-wrap gap-2">
        {(["orders", "products", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-[18px] py-[8px] font-body text-[11.5px] uppercase tracking-[0.12em] ${
              tab === t ? "bg-espresso text-cream" : "border border-cocoa/25 text-cocoa"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "orders" ? (
        <div className="mt-6 space-y-3">
          <p className="font-body text-[12.5px] text-cocoa/65">
            {orders.data?.length ?? 0} orders
          </p>
          {(orders.data ?? []).map((o) => (
            <div key={o.id} className="rounded-[4px] border border-cocoa/15 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-body text-[13.5px] text-cocoa">
                    {o.order_number} — {o.customer_name}
                  </p>
                  <p className="font-body text-[12px] text-cocoa/60">
                    {o.phone} · {o.address}, {o.city}, {o.state} {o.pincode}
                  </p>
                  <p className="font-body text-[12px] text-cocoa/60">
                    {new Date(o.created_at).toLocaleString()} · {o.payment_method ?? "—"} ·{" "}
                    {inr(Number(o.total))}
                  </p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => void updateOrder(o.id, e.target.value)}
                  className="rounded-[4px] border border-cocoa/25 bg-transparent px-3 py-2 font-body text-[12.5px] text-cocoa"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "products" ? (
        <div className="mt-6 space-y-4">
          <NewProductForm categories={categories.data ?? []} onCreate={addProduct} />
          {(products.data ?? []).map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-3 rounded-[4px] border border-cocoa/15 p-3"
            >
              <img
                src={p.images[0] ?? ""}
                alt={p.name}
                className="h-[46px] w-[46px] rounded-[3px] object-cover"
              />
              <p className="min-w-[160px] flex-1 font-body text-[13px] text-cocoa">{p.name}</p>
              <input
                type="number"
                defaultValue={p.price}
                onBlur={(e) => void saveProduct(p, { price: Number(e.target.value) })}
                className="w-[100px] rounded-[4px] border border-cocoa/25 bg-transparent px-2 py-1.5 font-body text-[12.5px] text-cocoa"
              />
              <label className="flex items-center gap-2 font-body text-[12px] text-cocoa/70">
                <input
                  type="checkbox"
                  defaultChecked={p.in_stock}
                  onChange={(e) => void saveProduct(p, { in_stock: e.target.checked })}
                />
                In stock
              </label>
              <label className="flex items-center gap-2 font-body text-[12px] text-cocoa/70">
                <input
                  type="checkbox"
                  defaultChecked={p.is_active}
                  onChange={(e) => void saveProduct(p, { is_active: e.target.checked })}
                />
                Visible
              </label>
              <button
                onClick={() => void deleteProduct(p.id)}
                className="rounded-full border border-cocoa/25 px-3 py-1.5 font-body text-[11.5px] text-cocoa hover:border-destructive hover:text-destructive"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "settings" ? (
        <div className="mt-6 space-y-3">
          {(settings.data ?? []).map((row) => (
            <div key={row.key} className="grid gap-2 sm:grid-cols-[220px_1fr] sm:items-center">
              <label className="font-body text-[12.5px] text-cocoa/70">
                {row.label ?? row.key}
              </label>
              <textarea
                defaultValue={row.value ?? ""}
                rows={(row.value ?? "").length > 90 ? 3 : 1}
                onBlur={(e) => void saveSetting(row.key, e.target.value)}
                className="w-full rounded-[4px] border border-cocoa/25 bg-transparent px-3 py-2 font-body text-[12.5px] text-cocoa focus:border-rosegold focus:outline-none"
              />
            </div>
          ))}
          <p className="font-body text-[11.5px] text-cocoa/55">
            Changes save when you click outside a field.
          </p>
        </div>
      ) : null}
    </Shell>
  );
}

function Shell({ children, onSignOut }: { children: React.ReactNode; onSignOut: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-espresso">
        <div className="mx-auto flex w-[92%] max-w-[1200px] items-center justify-between py-4">
          <img src={logoGold.url} alt="Célunor" className="h-[44px] w-auto" />
          <button
            onClick={onSignOut}
            className="rounded-full border border-cream/30 px-4 py-2 font-body text-[11.5px] tracking-[0.12em] text-cream/85 hover:text-rosegold"
          >
            SIGN OUT
          </button>
        </div>
      </header>
      <main className="mx-auto w-[92%] max-w-[1200px] py-8 font-body text-[13.5px] text-cocoa">
        {children}
      </main>
    </div>
  );
}

function NewProductForm({
  categories,
  onCreate,
}: {
  categories: { id: string; name: string }[];
  onCreate: (f: {
    name: string;
    price: number;
    category_id: string;
    image: string;
    description: string;
  }) => Promise<void>;
}) {
  const [f, setF] = useState({ name: "", price: 0, category_id: "", image: "", description: "" });
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!f.name.trim()) return;
        await onCreate(f);
        setF({ name: "", price: 0, category_id: "", image: "", description: "" });
      }}
      className="grid gap-2 rounded-[4px] border border-cocoa/15 p-4 sm:grid-cols-5"
    >
      <input
        placeholder="Product name"
        value={f.name}
        onChange={(e) => setF({ ...f, name: e.target.value })}
        className="input-line"
      />
      <input
        type="number"
        placeholder="Price"
        value={f.price || ""}
        onChange={(e) => setF({ ...f, price: Number(e.target.value) })}
        className="input-line"
      />
      <select
        value={f.category_id}
        onChange={(e) => setF({ ...f, category_id: e.target.value })}
        className="input-line"
      >
        <option value="">Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        placeholder="Image URL"
        value={f.image}
        onChange={(e) => setF({ ...f, image: e.target.value })}
        className="input-line"
      />
      <button
        type="submit"
        className="rounded-full bg-espresso px-4 py-2 font-body text-[11.5px] tracking-[0.12em] text-cream"
      >
        ADD PRODUCT
      </button>
    </form>
  );
}
