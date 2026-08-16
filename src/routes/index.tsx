import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Heart,
  Leaf,
  Nut,
  HandHeart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShieldCheck,
  Trash2,
  Truck,
  Package,
  Headphones,
  User,
  X,
} from "lucide-react";
import logoGold from "@/assets/celunor-logo-gold.png.asset.json";
import hero from "@/assets/hero-chocolate.jpg.asset.json";
import nutBar from "@/assets/nut-chocolate.jpg.asset.json";
import almondBar from "@/assets/almond-bar.jpg.asset.json";
import riceBar from "@/assets/rice-bar.jpg.asset.json";
import truffleBox from "@/assets/truffle-box.jpg.asset.json";
import whiteChocolates from "@/assets/white-chocolates.jpg.asset.json";
import almonds from "@/assets/almonds.webp.asset.json";
import cashews from "@/assets/cashews.webp.asset.json";
import walnuts from "@/assets/walnuts.webp.asset.json";
import raisins from "@/assets/raisins.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Célunor — Luxury Handcrafted Chocolates" },
      {
        name: "description",
        content:
          "Célunor makes luxury handcrafted chocolates with the finest ingredients — dark, milk and truffle collections, delivered across India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Célunor — Luxury Handcrafted Chocolates" },
      {
        property: "og:description",
        content:
          "Crafted for the moments worth savouring. Luxury handcrafted chocolates made with the finest ingredients.",
      },
    ],
  }),
  component: Index,
});

const navLinks = [
  { label: "HOME", href: "#top" },
  { label: "CHOCOLATES", href: "#chocolates" },
  { label: "DRY FRUITS", href: "#dry-fruits" },
  { label: "OUR STORY", href: "#story" },
  { label: "CONTACT", href: "#contact" },
];

const features = [
  { icon: Nut, title: "Finest Ingredients", text: "We use premium quality\ningredients." },
  { icon: HandHeart, title: "Handcrafted", text: "Every piece is\nhandmade with care." },
  { icon: Leaf, title: "No Preservatives", text: "Pure indulgence\nwithout compromise." },
  { icon: Heart, title: "Made with Love", text: "Crafted to bring joy to\nyour moments." },
];

type Product = {
  id: string;
  name: string;
  price: number;
  img: string;
  category: "chocolate" | "dryfruit";
};

const products: Product[] = [
  {
    id: "walnut",
    name: "Dark Chocolate\nWith Walnuts",
    price: 450,
    img: nutBar.url,
    category: "chocolate",
  },
  {
    id: "almond",
    name: "Milk Chocolate\nWith Almonds",
    price: 450,
    img: almondBar.url,
    category: "chocolate",
  },
  {
    id: "rice",
    name: "Crispy Rice\nChocolate Bar",
    price: 450,
    img: riceBar.url,
    category: "chocolate",
  },
  {
    id: "truffle",
    name: "Chocolate\nTruffle Box",
    price: 650,
    img: truffleBox.url,
    category: "chocolate",
  },
  {
    id: "white-truffles",
    name: "White & Dark\nTruffle Blossoms",
    price: 750,
    img: whiteChocolates.url,
    category: "chocolate",
  },
  {
    id: "almonds",
    name: "Premium\nWhole Almonds",
    price: 520,
    img: almonds.url,
    category: "dryfruit",
  },
  {
    id: "cashews",
    name: "Jumbo\nWhole Cashews",
    price: 620,
    img: cashews.url,
    category: "dryfruit",
  },
  {
    id: "walnuts",
    name: "California\nWalnut Halves",
    price: 680,
    img: walnuts.url,
    category: "dryfruit",
  },
  {
    id: "raisins",
    name: "Golden\nSeedless Raisins",
    price: 340,
    img: raisins.url,
    category: "dryfruit",
  },
];

const trust = [
  { icon: Truck, title: "PAN India Delivery", text: "Safe & secure delivery" },
  { icon: ShieldCheck, title: "Secure Payments", text: "100% secure checkout" },
  { icon: Package, title: "Premium Packaging", text: "Beautifully packed" },
  { icon: Headphones, title: "Customer Support", text: "We're here to help" },
];

const inr = (n: number) => `₹ ${n.toLocaleString("en-IN")}`;

function ProductCard({ p, onAdd }: { p: Product; onAdd: (p: Product) => void }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[3px] bg-[oklch(0.965_0.012_80)] shadow-[var(--shadow-soft)]">
      <img
        src={p.img}
        alt={p.name.replace("\n", " ")}
        className="aspect-[205/155] w-full object-cover"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col px-[18px] pb-[18px] pt-[16px]">
        <h3 className="whitespace-pre-line font-display text-[18px] leading-[1.28] text-cocoa">
          {p.name}
        </h3>
        <p className="mt-[14px] font-body text-[14px] text-cocoa">{inr(p.price)}</p>
        <div className="mt-auto pt-[16px]">
          <button
            onClick={() => onAdd(p)}
            className="flex w-full items-center justify-between rounded-full border border-cocoa/25 py-[5px] pl-[20px] pr-[5px] font-body text-[10.5px] tracking-[0.13em] text-cocoa transition-colors hover:border-cocoa"
          >
            ADD TO CART
            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-cocoa/25">
              <ShoppingBag className="h-[13px] w-[13px]" strokeWidth={1.2} />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);

  const count = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const total = useMemo(
    () =>
      Object.entries(cart).reduce(
        (sum, [id, qty]) => sum + qty * (products.find((p) => p.id === id)?.price ?? 0),
        0,
      ),
    [cart],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  const chocolates = useMemo(() => visible.filter((p) => p.category === "chocolate"), [visible]);
  const dryFruits = useMemo(() => visible.filter((p) => p.category === "dryfruit"), [visible]);

  const add = (p: Product) => {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
    setToast(`${p.name.replace("\n", " ")} added to cart`);
  };
  const setQty = (id: string, qty: number) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const open = menuOpen || cartOpen;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  const go = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-background scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-espresso">
        <div className="mx-auto flex h-[72px] w-[92%] max-w-[1320px] items-center md:h-[88px] lg:h-[104px]">
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="mr-4 text-cream/85 hover:text-rosegold lg:hidden"
          >
            <Menu className="h-6 w-6" strokeWidth={1.2} />
          </button>

          <a href="#top" onClick={() => go("#top")} className="flex shrink-0 items-center">
            <img
              src={logoGold.url}
              alt="Célunor"
              className="block h-[48px] w-auto object-contain md:h-[60px] lg:h-[72px]"
              loading="eager"
            />
          </a>

          <nav className="ml-[70px] hidden items-center gap-[32px] lg:flex xl:gap-[52px]">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.href)}
                className={`relative font-body text-[13px] leading-none tracking-[0.09em] transition-colors hover:text-rosegold ${
                  activeSection === l.href ? "text-cream" : "text-cream/85"
                }`}
              >
                {l.label}
                {activeSection === l.href && (
                  <span className="absolute -bottom-[7px] left-0 h-px w-full bg-rosegold" />
                )}
              </button>
            ))}
          </nav>


          <div className="ml-auto flex items-center gap-[20px] text-cream/85 md:gap-[28px] lg:gap-[38px]">
            <button
              aria-label="Search"
              onClick={() => {
                setSearchOpen((s) => !s);
                go("#collections");
              }}
              className="hover:text-rosegold"
            >
              <Search className="h-[21px] w-[21px] lg:h-[23px] lg:w-[23px]" strokeWidth={1.1} />
            </button>
            <button
              aria-label="Account"
              onClick={() => setToast("Accounts are coming soon")}
              className="hidden hover:text-rosegold sm:block"
            >
              <User className="h-[21px] w-[21px] lg:h-[23px] lg:w-[23px]" strokeWidth={1.1} />
            </button>
            <button
              aria-label={`Cart, ${count} items`}
              onClick={() => setCartOpen(true)}
              className="relative hover:text-rosegold"
            >
              <ShoppingBag
                className="h-[21px] w-[21px] lg:h-[23px] lg:w-[23px]"
                strokeWidth={1.1}
              />
              {count > 0 && (
                <span className="absolute -right-[7px] -top-[7px] flex h-[17px] w-[17px] items-center justify-center rounded-full bg-rosegold font-body text-[10px] text-espresso">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-cream/10 bg-espresso">
            <div className="mx-auto w-[92%] max-w-[1320px] py-3">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chocolates…"
                className="w-full rounded-full border border-cream/20 bg-transparent px-5 py-2.5 font-body text-[13px] text-cream placeholder:text-cream/45 focus:border-rosegold focus:outline-none"
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-espresso/60"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-[78%] max-w-[320px] flex-col bg-espresso px-7 py-6">
            <div className="flex items-center justify-between">
              <img src={logoGold.url} alt="Célunor" className="h-[46px] w-auto" />
              <button
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="text-cream/85 hover:text-rosegold"
              >
                <X className="h-6 w-6" strokeWidth={1.2} />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-6">
              {navLinks.map((l) => (
                <button
                  key={l.label}
                  onClick={() => go(l.href)}
                  className="text-left font-body text-[14px] tracking-[0.12em] text-cream/85 hover:text-rosegold"
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-espresso/60"
            onClick={() => setCartOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col bg-[oklch(0.965_0.012_80)]">
            <div className="flex items-center justify-between border-b border-cocoa/15 px-6 py-5">
              <h2 className="font-display text-[24px] text-cocoa">Your Cart</h2>
              <button
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
                className="text-cocoa/70 hover:text-cocoa"
              >
                <X className="h-5 w-5" strokeWidth={1.2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {count === 0 ? (
                <p className="font-body text-[13.5px] text-cocoa/70">
                  Your cart is empty. Add something sweet.
                </p>
              ) : (
                <ul className="space-y-5">
                  {Object.entries(cart).map(([id, qty]) => {
                    const p = products.find((x) => x.id === id)!;
                    return (
                      <li key={id} className="flex gap-4">
                        <img
                          src={p.img}
                          alt={p.name.replace("\n", " ")}
                          className="h-[68px] w-[68px] shrink-0 rounded-[3px] object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[16px] leading-snug text-cocoa">
                            {p.name.replace("\n", " ")}
                          </p>
                          <p className="mt-1 font-body text-[13px] text-cocoa/75">
                            {inr(p.price)}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => setQty(id, qty - 1)}
                              className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-cocoa/25 text-cocoa"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-body text-[13px] text-cocoa">{qty}</span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => setQty(id, qty + 1)}
                              className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-cocoa/25 text-cocoa"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              aria-label="Remove item"
                              onClick={() => setQty(id, 0)}
                              className="ml-auto text-cocoa/55 hover:text-cocoa"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.2} />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-t border-cocoa/15 px-6 py-5">
              <div className="flex items-center justify-between font-body text-[14px] text-cocoa">
                <span>Subtotal</span>
                <span>{inr(total)}</span>
              </div>
              <button
                disabled={count === 0}
                onClick={() => {
                  setCart({});
                  setCartOpen(false);
                  setToast("Order placed — we'll be in touch soon");
                }}
                className="mt-4 w-full rounded-full bg-espresso py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream transition-colors hover:bg-cocoa disabled:opacity-40"
              >
                CHECKOUT
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={hero.url}
          alt="Dark chocolate bar on kraft paper with walnuts and dried flowers"
          className="absolute inset-y-0 right-0 h-full w-full object-cover object-[60%_center] md:w-[64%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.855_0.045_74)] via-[oklch(0.855_0.045_74)]/85 to-transparent md:inset-y-0 md:left-0 md:right-auto md:w-[62%] md:bg-gradient-to-r md:from-45%" />
        <div className="relative mx-auto w-[92%] max-w-[1320px]">
          <div className="max-w-[470px] py-[54px] md:py-[60px] md:pl-[40px] lg:pl-[55px] lg:pb-[130px] lg:pt-[46px]">
            <h1 className="font-display text-[32px] leading-[1.15] tracking-[-0.01em] text-cocoa sm:text-[38px] lg:text-[46px]">
              Crafted for the moments worth savouring.
            </h1>
            <div className="mt-[18px] flex items-center gap-[10px]">
              <span className="h-px w-[74px] bg-rosegold/55" />
              <span className="font-display text-[13px] text-rosegold">✦</span>
              <span className="h-px w-[52px] bg-rosegold/55" />
            </div>
            <p className="mt-[18px] max-w-[280px] font-body text-[14px] leading-[1.6] text-cocoa/85">
              Luxury handcrafted chocolates made with the finest ingredients and a whole lot of
              love.
            </p>
            <div className="mt-[26px] flex flex-wrap items-center gap-[14px] sm:gap-[22px]">
              <button
                onClick={() => go("#collections")}
                className="inline-flex items-center gap-[14px] rounded-full bg-espresso px-[24px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream transition-colors hover:bg-cocoa lg:px-[26px] lg:py-[15px]"
              >
                SHOP CHOCOLATES <ArrowRight className="h-[15px] w-[15px]" strokeWidth={1.3} />
              </button>
              <button
                onClick={() => go("#story")}
                className="inline-flex items-center rounded-full border border-cocoa/45 px-[26px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cocoa transition-colors hover:border-cocoa lg:px-[28px] lg:py-[15px]"
              >
                OUR STORY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <div className="relative z-10 mt-[34px] lg:-mt-[87px]">
        <div className="mx-auto grid w-[90%] max-w-[1200px] grid-cols-1 rounded-[4px] bg-[oklch(0.955_0.016_80)] shadow-[var(--shadow-soft)] sm:grid-cols-2 md:w-[86%] md:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`px-[26px] py-[24px] text-center ${
                i > 0 ? "md:border-l md:border-[oklch(0.88_0.022_76)]" : ""
              }`}
            >
              <f.icon className="mx-auto h-[30px] w-[30px] text-rosegold" strokeWidth={1} />
              <h3 className="mt-[12px] font-display text-[18px] text-rosegold">{f.title}</h3>
              <p className="mt-[6px] font-body text-[12.5px] leading-[1.5] text-cocoa/75 md:whitespace-pre-line">
                {f.text.replace("\n", " ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chocolate collection */}
      <section id="collections" className="scroll-mt-[90px] pt-[40px]">
        <div id="chocolates" className="scroll-mt-[90px]">
          <div className="mx-auto grid w-[90%] max-w-[1200px] grid-cols-1 gap-[32px] md:w-[86%] lg:grid-cols-[248px_1fr] lg:gap-[38px]">
            <div className="lg:pt-[26px]">
              <p className="flex items-center gap-[8px] font-body text-[11.5px] tracking-[0.13em] text-rosegold">
                <span className="text-[13px]">✦</span> THE CHOCOLATE COLLECTION
              </p>
              <h2 className="mt-[14px] font-display text-[28px] leading-[1.22] text-cocoa lg:text-[32px]">
                Indulge in our finest creations
              </h2>
              <p className="mt-[16px] max-w-[420px] font-body text-[13.5px] leading-[1.65] text-cocoa/75 lg:max-w-[228px]">
                From rich and smooth chocolate bars to delightful truffles, find your perfect
                indulgence.
              </p>
              <button
                onClick={() => setQuery("")}
                className="mt-[24px] inline-flex items-center gap-[14px] rounded-full bg-espresso px-[26px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream transition-colors hover:bg-cocoa"
              >
                VIEW ALL PRODUCTS <ArrowRight className="h-[15px] w-[15px]" strokeWidth={1.3} />
              </button>
            </div>

            <div className="relative">
              {chocolates.length === 0 ? (
                <p className="font-body text-[13.5px] text-cocoa/70">
                  No chocolates match “{query}”.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-[19px]">
                  {chocolates.map((p) => (
                    <ProductCard key={p.id} p={p} onAdd={add} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dry fruit collection */}
      <section id="dry-fruits" className="scroll-mt-[90px] pb-[42px] pt-[46px]">
        <div className="mx-auto w-[90%] max-w-[1200px] md:w-[86%]">
          <div className="h-px w-full bg-[oklch(0.88_0.022_76)]" />
        </div>
        <div className="mx-auto mt-[40px] grid w-[90%] max-w-[1200px] grid-cols-1 gap-[32px] md:w-[86%] lg:grid-cols-[248px_1fr] lg:gap-[38px]">
          <div className="lg:pt-[26px]">
            <p className="flex items-center gap-[8px] font-body text-[11.5px] tracking-[0.13em] text-rosegold">
              <span className="text-[13px]">✦</span> PREMIUM DRY FRUITS
            </p>
            <h2 className="mt-[14px] font-display text-[28px] leading-[1.22] text-cocoa lg:text-[32px]">
              Hand-sorted nuts &amp; dried fruit
            </h2>
            <p className="mt-[16px] max-w-[420px] font-body text-[13.5px] leading-[1.65] text-cocoa/75 lg:max-w-[228px]">
              Sourced in small lots, sun-dried and packed fresh — perfect on their own or in a
              gifting hamper.
            </p>
          </div>

          <div className="relative">
            {dryFruits.length === 0 ? (
              <p className="font-body text-[13.5px] text-cocoa/70">
                No dry fruits match “{query}”.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-[19px]">
                {dryFruits.map((p) => (
                  <ProductCard key={p.id} p={p} onAdd={add} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Story */}
      <section id="story" className="scroll-mt-[90px] pb-[48px] pt-[10px]">
        <div className="mx-auto w-[90%] max-w-[820px] text-center md:w-[86%]">
          <p className="font-body text-[11.5px] tracking-[0.13em] text-rosegold">✦ OUR STORY</p>
          <h2 className="mt-[14px] font-display text-[28px] leading-[1.22] text-cocoa lg:text-[32px]">
            Small batches, slow craft, honest ingredients
          </h2>
          <p className="mx-auto mt-[16px] max-w-[620px] font-body text-[13.5px] leading-[1.75] text-cocoa/75">
            Célunor began in a small kitchen with a simple belief — that chocolate should be made
            slowly, with real ingredients and a lot of patience. Every bar is tempered by hand and
            finished the same day it is poured.
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-espresso py-[26px]">
        <div className="mx-auto grid w-[90%] max-w-[1200px] grid-cols-1 gap-[22px] sm:grid-cols-2 md:w-[86%] md:grid-cols-4 md:gap-[24px]">
          {trust.map((t) => (
            <div key={t.title} className="flex items-center gap-[16px]">
              <t.icon className="h-[30px] w-[30px] shrink-0 text-rosegold" strokeWidth={1} />
              <div>
                <p className="font-body text-[13.5px] text-rosegold">{t.title}</p>
                <p className="mt-[2px] font-body text-[12.5px] text-cream/70">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / footer */}
      <footer id="contact" className="scroll-mt-[90px] bg-cocoa py-[36px]">
        <div className="mx-auto grid w-[90%] max-w-[1200px] gap-[26px] md:w-[86%] md:grid-cols-3">
          <div>
            <img src={logoGold.url} alt="Célunor" className="h-[54px] w-auto" loading="lazy" />
            <p className="mt-[14px] max-w-[280px] font-body text-[12.5px] leading-[1.7] text-cream/70">
              Luxury handcrafted chocolates, delivered across India.
            </p>
          </div>
          <div>
            <p className="font-body text-[11.5px] tracking-[0.13em] text-rosegold">EXPLORE</p>
            <ul className="mt-[12px] space-y-[8px]">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => go(l.href)}
                    className="font-body text-[12.5px] text-cream/75 hover:text-rosegold"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-body text-[11.5px] tracking-[0.13em] text-rosegold">CONTACT</p>
            <ul className="mt-[12px] space-y-[8px] font-body text-[12.5px] text-cream/75">
              <li>
                <a href="mailto:hello@celunor.com" className="hover:text-rosegold">
                  hello@celunor.com
                </a>
              </li>
              <li>
                <a href="tel:+919000000000" className="hover:text-rosegold">
                  +91 90000 00000
                </a>
              </li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-[28px] w-[90%] max-w-[1200px] border-t border-cream/10 pt-[16px] font-body text-[11.5px] text-cream/50 md:w-[86%]">
          © {new Date().getFullYear()} Célunor. All rights reserved.
        </p>
      </footer>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-espresso px-5 py-3 font-body text-[12px] text-cream shadow-[var(--shadow-soft)]">
          {toast}
        </div>
      )}
    </div>
  );
}
