import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { customizationOptionsQuery, settingsQuery } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/customise")({
  head: () => ({
    meta: [
      { title: "Customise Your Chocolate — Célunor" },
      {
        name: "description",
        content:
          "Design your own Célunor chocolate: choose the base, pick your add-ins, add a personal message and order it made to order.",
      },
      { property: "og:title", content: "Customise Your Chocolate — Célunor" },
      {
        property: "og:description",
        content: "Choose your base, add-ins and message — chocolate made exactly your way.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomisePage,
});

const BASE_PRICE = 450;

function CustomisePage() {
  const { data: options = [] } = useQuery(customizationOptionsQuery);
  const { data: settings = {} } = useQuery(settingsQuery);
  const { add, setCartOpen } = useCart();

  const bases = options.filter((o) => o.group_key === "base");
  const addins = options.filter((o) => o.group_key === "addin");

  const [baseId, setBaseId] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState(1);

  const base = bases.find((b) => b.id === baseId) ?? bases[0];
  const chosen = addins.filter((a) => selected.includes(a.id));

  const price = useMemo(
    () =>
      BASE_PRICE +
      Number(base?.price_delta ?? 0) +
      chosen.reduce((sum, a) => sum + Number(a.price_delta), 0),
    [base, chosen],
  );

  const detail = [base?.name, chosen.map((c) => c.name).join(", ") || "no add-ins"]
    .filter(Boolean)
    .join(" · ");

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const addToCart = () => {
    if (!base) return;
    add({
      key: `custom:${base.id}:${[...selected].sort().join("-")}:${message}`,
      type: "custom",
      name: "Custom Chocolate Bar",
      price,
      qty,
      detail,
      config: { base: base.name, addins: chosen.map((c) => c.name), message },
    });
    setCartOpen(true);
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="CUSTOMISE"
        title="Customise your chocolate"
        intro="Pick your base, choose your add-ins and tell us what to write on the sleeve. Every custom bar is tempered and poured to order."
      />

      <div className="mx-auto grid w-[90%] max-w-[1200px] gap-[32px] py-[40px] md:w-[86%] lg:grid-cols-[1fr_340px]">
        <div className="space-y-[34px]">
          <section>
            <h2 className="font-display text-[24px] text-cocoa">1. Choose your base</h2>
            <div className="mt-[16px] grid gap-[12px] sm:grid-cols-3">
              {bases.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBaseId(b.id)}
                  className={`rounded-[4px] border px-[18px] py-[18px] text-left transition-colors ${
                    base?.id === b.id
                      ? "border-rosegold bg-[oklch(0.965_0.012_80)]"
                      : "border-cocoa/20 hover:border-cocoa/45"
                  }`}
                >
                  <p className="font-display text-[18px] text-cocoa">{b.name}</p>
                  <p className="mt-1 font-body text-[12px] text-cocoa/65">
                    {Number(b.price_delta) > 0 ? `+ ${inr(Number(b.price_delta))}` : "Included"}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-[24px] text-cocoa">2. Add your favourites</h2>
            <div className="mt-[16px] grid gap-[12px] sm:grid-cols-2 lg:grid-cols-3">
              {addins.map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  className={`flex items-center justify-between rounded-[4px] border px-[18px] py-[14px] text-left transition-colors ${
                    selected.includes(a.id)
                      ? "border-rosegold bg-[oklch(0.965_0.012_80)]"
                      : "border-cocoa/20 hover:border-cocoa/45"
                  }`}
                >
                  <span className="font-body text-[13.5px] text-cocoa">{a.name}</span>
                  <span className="font-body text-[12px] text-cocoa/65">
                    + {inr(Number(a.price_delta))}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-[24px] text-cocoa">3. Add a message</h2>
            <textarea
              value={message}
              maxLength={140}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="e.g. Happy birthday, Aanya!"
              className="mt-[14px] w-full rounded-[4px] border border-cocoa/25 bg-transparent px-4 py-3 font-body text-[13.5px] text-cocoa placeholder:text-cocoa/40 focus:border-rosegold focus:outline-none"
            />
            <p className="mt-1 font-body text-[11.5px] text-cocoa/50">{message.length}/140</p>
          </section>
        </div>

        <aside className="h-fit rounded-[4px] border border-cocoa/15 bg-[oklch(0.965_0.012_80)] p-[24px] lg:sticky lg:top-[120px]">
          <h3 className="font-display text-[22px] text-cocoa">Your bar</h3>
          <p className="mt-[10px] font-body text-[13px] leading-[1.7] text-cocoa/75">
            {base ? detail : "Choose a base to begin."}
          </p>
          {message ? (
            <p className="mt-2 font-body text-[12.5px] italic text-cocoa/60">“{message}”</p>
          ) : null}

          <div className="mt-[18px] flex items-center gap-3">
            <span className="font-body text-[12.5px] text-cocoa/70">Quantity</span>
            <input
              type="number"
              min={1}
              max={50}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-[70px] rounded-[4px] border border-cocoa/25 bg-transparent px-3 py-1.5 font-body text-[13px] text-cocoa focus:border-rosegold focus:outline-none"
            />
          </div>

          <div className="mt-[18px] flex items-center justify-between border-t border-cocoa/15 pt-[14px] font-body text-[14px] text-cocoa">
            <span>Total</span>
            <span>{inr(price * qty)}</span>
          </div>

          <button
            onClick={addToCart}
            disabled={!base}
            className="mt-[16px] w-full rounded-full bg-espresso py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream hover:bg-cocoa disabled:opacity-40"
          >
            ADD TO CART
          </button>
          {settings["whatsapp"] ? (
            <a
              href={whatsappLink(
                settings["whatsapp"],
                `Hello Célunor, I'd like a custom chocolate bar: ${detail}${
                  message ? ` with the message "${message}"` : ""
                } × ${qty}.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-[10px] block w-full rounded-full border border-cocoa/25 py-[12px] text-center font-body text-[11.5px] tracking-[0.12em] text-cocoa hover:border-cocoa"
            >
              DISCUSS ON WHATSAPP
            </a>
          ) : null}
        </aside>
      </div>
    </SiteLayout>
  );
}
