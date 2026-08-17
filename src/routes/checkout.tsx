import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { paymentMethodsQuery, settingsQuery } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import { cartMessage, whatsappLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Célunor" },
      { name: "description", content: "Complete your Célunor order with delivery details." },
      { property: "og:title", content: "Checkout — Célunor" },
      { property: "og:description", content: "Complete your Célunor order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  customer_name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255).or(z.literal("")),
  address: z.string().trim().min(5, "Enter your address").max(300),
  city: z.string().trim().min(2, "Enter your city").max(80),
  state: z.string().trim().min(2, "Enter your state").max(80),
  pincode: z.string().trim().regex(/^[0-9]{4,10}$/, "Enter a valid pincode"),
  notes: z.string().trim().max(500),
});

const empty = {
  customer_name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { data: settings = {} } = useQuery(settingsQuery);
  const { data: methods = [] } = useQuery(paymentMethodsQuery);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [method, setMethod] = useState("cod");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const freeAbove = Number(settings["free_delivery_above"] || 0);
  const baseDelivery = Number(settings["delivery_charge"] || 0);
  const delivery = subtotal > 0 && (freeAbove <= 0 || subtotal < freeAbove) ? baseDelivery : 0;
  const total = subtotal + delivery;

  const field = (key: keyof typeof empty) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setError(null);
    setBusy(true);
    const orderId = crypto.randomUUID();
    const orderNumber = `CEL-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      order_number: orderNumber,
      ...parsed.data,
      email: parsed.data.email || null,
      subtotal,
      delivery_charge: delivery,
      total,
      payment_method: method,
      payment_status: method === "cod" ? "pending" : "awaiting",
      status: "new",
    });

    if (orderError) {
      setBusy(false);
      setError("We couldn't place your order. Please try again.");
      return;
    }

    await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: orderId,
        product_id: i.productId ?? null,
        item_type: i.type,
        name: i.name,
        unit_price: i.price,
        quantity: i.qty,
        line_total: i.price * i.qty,
        config: JSON.parse(JSON.stringify(i.config ?? {})),
      })),
    );

    try {
      window.localStorage.setItem(
        "celunor.lastOrder",
        JSON.stringify({
          orderNumber,
          total,
          delivery,
          subtotal,
          method,
          items,
          customer: parsed.data,
          placedAt: new Date().toISOString(),
        }),
      );
    } catch {
      /* ignore */
    }

    if (method === "whatsapp" && settings["whatsapp"]) {
      window.open(
        whatsappLink(settings["whatsapp"], cartMessage(items, total, orderNumber)),
        "_blank",
        "noopener",
      );
    }

    clear();
    setBusy(false);
    navigate({ to: "/order/$orderNumber", params: { orderNumber } });
  };

  return (
    <SiteLayout>
      <PageHeader eyebrow="CHECKOUT" title="Delivery details" />
      <form
        onSubmit={placeOrder}
        className="mx-auto grid w-[90%] max-w-[1200px] gap-[30px] py-[40px] md:w-[86%] lg:grid-cols-[1fr_340px]"
      >
        <div className="space-y-[24px]">
          <div className="grid gap-[12px] sm:grid-cols-2">
            <input
              {...field("customer_name")}
              placeholder="Full name"
              className="input-line"
              maxLength={100}
            />
            <input {...field("phone")} placeholder="Phone" className="input-line" maxLength={15} />
            <input
              {...field("email")}
              placeholder="Email (optional)"
              className="input-line sm:col-span-2"
              maxLength={255}
            />
            <textarea
              {...field("address")}
              placeholder="Address"
              rows={3}
              maxLength={300}
              className="input-line sm:col-span-2"
            />
            <input {...field("city")} placeholder="City" className="input-line" maxLength={80} />
            <input {...field("state")} placeholder="State" className="input-line" maxLength={80} />
            <input
              {...field("pincode")}
              placeholder="Pincode"
              className="input-line"
              maxLength={10}
            />
            <textarea
              {...field("notes")}
              placeholder="Order notes (optional)"
              rows={2}
              maxLength={500}
              className="input-line sm:col-span-2"
            />
          </div>

          <div>
            <h2 className="font-display text-[22px] text-cocoa">Payment</h2>
            <div className="mt-[12px] space-y-[10px]">
              {methods.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-[4px] border px-[18px] py-[14px] ${
                    method === m.code ? "border-rosegold" : "border-cocoa/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={method === m.code}
                    onChange={() => setMethod(m.code)}
                    className="mt-1 accent-[oklch(0.66_0.1_47)]"
                  />
                  <span>
                    <span className="block font-body text-[13.5px] text-cocoa">{m.name}</span>
                    {m.instructions ? (
                      <span className="block font-body text-[12px] text-cocoa/60">
                        {m.instructions}
                      </span>
                    ) : null}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[4px] border border-cocoa/15 bg-[oklch(0.965_0.012_80)] p-[24px]">
          <h2 className="font-display text-[22px] text-cocoa">Order summary</h2>
          <ul className="mt-[14px] space-y-[8px] font-body text-[12.5px] text-cocoa/75">
            {items.map((i) => (
              <li key={i.key} className="flex justify-between gap-3">
                <span className="truncate">
                  {i.name} × {i.qty}
                </span>
                <span>{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-[14px] space-y-[6px] border-t border-cocoa/15 pt-[12px] font-body text-[13px] text-cocoa">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{inr(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{delivery === 0 ? "Free" : inr(delivery)}</span>
            </div>
            <div className="flex justify-between border-t border-cocoa/15 pt-[8px] text-[15px]">
              <span>Total</span>
              <span>{inr(total)}</span>
            </div>
          </div>
          {error ? <p className="mt-3 font-body text-[12.5px] text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={busy || items.length === 0}
            className="mt-[16px] w-full rounded-full bg-espresso py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream hover:bg-cocoa disabled:opacity-40"
          >
            {busy ? "PLACING ORDER…" : "PLACE ORDER"}
          </button>
        </aside>
      </form>
    </SiteLayout>
  );
}
