import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import {
  giftBoxAddonsQuery,
  giftBoxSizesQuery,
  productImage,
  productPrice,
  productsQuery,
} from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/gift-box")({
  head: () => ({
    meta: [
      { title: "Build Your Gift Box — Célunor" },
      {
        name: "description",
        content:
          "Create a Célunor gift box: pick a box size, fill it with chocolates and dry fruits, then finish it with premium packaging and a handwritten note.",
      },
      { property: "og:title", content: "Build Your Gift Box — Célunor" },
      {
        property: "og:description",
        content: "Choose a box, fill it with favourites and add a handwritten note.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GiftBoxPage,
});

function GiftBoxPage() {
  const { data: sizes = [] } = useQuery(giftBoxSizesQuery);
  const { data: addons = [] } = useQuery(giftBoxAddonsQuery);
  const { data: products = [] } = useQuery(productsQuery);
  const { add, setCartOpen } = useCart();

  const [sizeId, setSizeId] = useState<string>("");
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const capacity = size?.capacity ?? 0;
  const filled = Object.values(picks).reduce((a, b) => a + b, 0);
  const chosenAddons = addons.filter((a) => addonIds.includes(a.id));
  const needsMessage = chosenAddons.some((a) => a.allows_message);

  const contents = useMemo(
    () =>
      Object.entries(picks)
        .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
        .filter((c) => c.product && c.qty > 0),
    [picks, products],
  );

  const total = useMemo(
    () =>
      Number(size?.price ?? 0) +
      contents.reduce((sum, c) => sum + productPrice(c.product!) * c.qty, 0) +
      chosenAddons.reduce((sum, a) => sum + Number(a.price), 0),
    [size, contents, chosenAddons],
  );

  const bump = (id: string, delta: number) =>
    setPicks((current) => {
      const next = { ...current };
      const value = (next[id] ?? 0) + delta;
      if (delta > 0 && filled >= capacity) return current;
      if (value <= 0) delete next[id];
      else next[id] = value;
      return next;
    });

  const addToCart = () => {
    if (!size || filled === 0) return;
    const detail = [
      `${size.name}`,
      contents.map((c) => `${c.product!.name} ×${c.qty}`).join(", "),
      chosenAddons.map((a) => a.name).join(", "),
    ]
      .filter(Boolean)
      .join(" · ");
    add({
      key: `giftbox:${size.id}:${JSON.stringify(picks)}:${addonIds.join("-")}:${message}`,
      type: "giftbox",
      name: `Gift Box — ${size.name}`,
      price: total,
      detail,
      config: {
        size: size.name,
        items: contents.map((c) => ({ name: c.product!.name, qty: c.qty })),
        addons: chosenAddons.map((a) => a.name),
        message,
      },
    });
    setCartOpen(true);
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="GIFTING"
        title="Build your gift box"
        intro="Choose a box, fill it with the pieces they love and finish it with packaging and a handwritten note."
      />

      <div className="mx-auto grid w-[90%] max-w-[1200px] gap-[32px] py-[40px] md:w-[86%] lg:grid-cols-[1fr_340px]">
        <div className="space-y-[34px]">
          <section>
            <h2 className="font-display text-[24px] text-cocoa">1. Choose your box</h2>
            <div className="mt-[16px] grid gap-[12px] sm:grid-cols-3">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSizeId(s.id);
                    setPicks({});
                  }}
                  className={`rounded-[4px] border px-[18px] py-[18px] text-left transition-colors ${
                    size?.id === s.id
                      ? "border-rosegold bg-[oklch(0.965_0.012_80)]"
                      : "border-cocoa/20 hover:border-cocoa/45"
                  }`}
                >
                  <p className="font-display text-[20px] text-cocoa">{s.name}</p>
                  <p className="mt-1 font-body text-[12px] text-cocoa/65">{inr(Number(s.price))}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-[24px] text-cocoa">2. Fill your box</h2>
              <p className="font-body text-[12.5px] text-cocoa/65">
                {filled} of {capacity} slots filled
              </p>
            </div>
            <div className="mt-[16px] grid gap-[12px] sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-[4px] border border-cocoa/20 p-[10px]"
                >
                  <img
                    src={productImage(p)}
                    alt={p.name}
                    className="h-[52px] w-[52px] shrink-0 rounded-[3px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-[13px] text-cocoa">{p.name}</p>
                    <p className="font-body text-[11.5px] text-cocoa/60">
                      {inr(productPrice(p))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label={`Remove one ${p.name}`}
                      onClick={() => bump(p.id, -1)}
                      className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-cocoa/25 text-cocoa"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-[14px] text-center font-body text-[13px] text-cocoa">
                      {picks[p.id] ?? 0}
                    </span>
                    <button
                      aria-label={`Add one ${p.name}`}
                      onClick={() => bump(p.id, 1)}
                      disabled={filled >= capacity}
                      className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-cocoa/25 text-cocoa disabled:opacity-35"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-[24px] text-cocoa">3. Finishing touches</h2>
            <div className="mt-[16px] grid gap-[12px] sm:grid-cols-3">
              {addons.map((a) => (
                <button
                  key={a.id}
                  onClick={() =>
                    setAddonIds((ids) =>
                      ids.includes(a.id) ? ids.filter((x) => x !== a.id) : [...ids, a.id],
                    )
                  }
                  className={`rounded-[4px] border px-[16px] py-[14px] text-left transition-colors ${
                    addonIds.includes(a.id)
                      ? "border-rosegold bg-[oklch(0.965_0.012_80)]"
                      : "border-cocoa/20 hover:border-cocoa/45"
                  }`}
                >
                  <p className="font-body text-[13.5px] text-cocoa">{a.name}</p>
                  {a.description ? (
                    <p className="mt-1 font-body text-[11.5px] leading-snug text-cocoa/60">
                      {a.description}
                    </p>
                  ) : null}
                  <p className="mt-1 font-body text-[12px] text-cocoa/70">
                    + {inr(Number(a.price))}
                  </p>
                </button>
              ))}
            </div>
            {needsMessage ? (
              <textarea
                value={message}
                maxLength={200}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Write the note we should include…"
                className="mt-[14px] w-full rounded-[4px] border border-cocoa/25 bg-transparent px-4 py-3 font-body text-[13.5px] text-cocoa placeholder:text-cocoa/40 focus:border-rosegold focus:outline-none"
              />
            ) : null}
          </section>
        </div>

        <aside className="h-fit rounded-[4px] border border-cocoa/15 bg-[oklch(0.965_0.012_80)] p-[24px] lg:sticky lg:top-[120px]">
          <h3 className="font-display text-[22px] text-cocoa">Your gift box</h3>
          <p className="mt-[8px] font-body text-[12.5px] text-cocoa/65">
            {size ? `${size.name} — ${filled}/${capacity} filled` : "Choose a box size"}
          </p>
          <ul className="mt-[14px] space-y-[6px] font-body text-[12.5px] text-cocoa/75">
            {contents.map((c) => (
              <li key={c.product!.id} className="flex justify-between gap-3">
                <span className="truncate">
                  {c.product!.name} × {c.qty}
                </span>
                <span>{inr(productPrice(c.product!) * c.qty)}</span>
              </li>
            ))}
            {chosenAddons.map((a) => (
              <li key={a.id} className="flex justify-between gap-3">
                <span className="truncate">{a.name}</span>
                <span>{inr(Number(a.price))}</span>
              </li>
            ))}
          </ul>
          <div className="mt-[16px] flex items-center justify-between border-t border-cocoa/15 pt-[14px] font-body text-[14px] text-cocoa">
            <span>Total</span>
            <span>{inr(total)}</span>
          </div>
          <button
            onClick={addToCart}
            disabled={!size || filled === 0}
            className="mt-[16px] w-full rounded-full bg-espresso py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream hover:bg-cocoa disabled:opacity-40"
          >
            ADD GIFT BOX TO CART
          </button>
        </aside>
      </div>
    </SiteLayout>
  );
}
