import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Célunor" },
      { name: "description", content: "Review your Célunor cart before checking out." },
      { property: "og:title", content: "Your Cart — Célunor" },
      { property: "og:description", content: "Review your Célunor cart before checking out." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();

  return (
    <SiteLayout>
      <PageHeader eyebrow="CART" title="Your cart" />
      <div className="mx-auto grid w-[90%] max-w-[1200px] gap-[30px] py-[40px] md:w-[86%] lg:grid-cols-[1fr_320px]">
        <div>
          {items.length === 0 ? (
            <div>
              <p className="font-body text-[13.5px] text-cocoa/70">Your cart is empty.</p>
              <Link
                to="/shop"
                search={{ q: undefined, cat: undefined }}
                className="mt-5 inline-flex rounded-full bg-espresso px-6 py-3 font-body text-[11.5px] tracking-[0.12em] text-cream"
              >
                START SHOPPING
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-cocoa/12">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-[18px]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[84px] w-[84px] shrink-0 rounded-[3px] object-cover"
                    />
                  ) : (
                    <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-[3px] bg-sand font-display text-[22px] text-cocoa/60">
                      ✦
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[18px] text-cocoa">{item.name}</p>
                    {item.detail ? (
                      <p className="mt-1 font-body text-[12px] leading-snug text-cocoa/60">
                        {item.detail}
                      </p>
                    ) : null}
                    <p className="mt-1 font-body text-[13px] text-cocoa/75">{inr(item.price)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.key, item.qty - 1)}
                        className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-cocoa/25 text-cocoa"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-body text-[13px] text-cocoa">{item.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.key, item.qty + 1)}
                        className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-cocoa/25 text-cocoa"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        aria-label="Remove item"
                        onClick={() => remove(item.key)}
                        className="ml-3 text-cocoa/55 hover:text-cocoa"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.2} />
                      </button>
                    </div>
                  </div>
                  <p className="font-body text-[13.5px] text-cocoa">
                    {inr(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="h-fit rounded-[4px] border border-cocoa/15 bg-[oklch(0.965_0.012_80)] p-[24px]">
          <h2 className="font-display text-[22px] text-cocoa">Summary</h2>
          <div className="mt-[14px] flex items-center justify-between font-body text-[13.5px] text-cocoa">
            <span>Subtotal</span>
            <span>{inr(subtotal)}</span>
          </div>
          <p className="mt-2 font-body text-[11.5px] text-cocoa/60">
            Delivery is calculated at checkout.
          </p>
          <Link
            to="/checkout"
            className={`mt-[18px] block w-full rounded-full bg-espresso py-[14px] text-center font-body text-[11.5px] tracking-[0.12em] text-cream hover:bg-cocoa ${
              items.length === 0 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            PROCEED TO CHECKOUT
          </Link>
        </aside>
      </div>
    </SiteLayout>
  );
}
