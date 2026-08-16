import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  Leaf,
  Nut,
  HandHeart,
  Search,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Package,
  Headphones,
  User,
} from "lucide-react";
import logoGold from "@/assets/celunor-logo-gold.png.asset.json";
import hero from "@/assets/hero-chocolate.jpg.asset.json";
import nutBar from "@/assets/nut-chocolate.jpg.asset.json";
import almondBar from "@/assets/almond-bar.jpg.asset.json";
import riceBar from "@/assets/rice-bar.jpg.asset.json";
import truffleBox from "@/assets/truffle-box.jpg.asset.json";

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

const navLinks = ["HOME", "SHOP", "COLLECTIONS", "OUR STORY", "CONTACT"];

const features = [
  { icon: Nut, title: "Finest Ingredients", text: "We use premium quality\ningredients." },
  { icon: HandHeart, title: "Handcrafted", text: "Every piece is\nhandmade with care." },
  { icon: Leaf, title: "No Preservatives", text: "Pure indulgence\nwithout compromise." },
  { icon: Heart, title: "Made with Love", text: "Crafted to bring joy to\nyour moments." },
];

const products = [
  { name: "Dark Chocolate\nWith Walnuts", price: "₹ 450", img: nutBar.url },
  { name: "Milk Chocolate\nWith Almonds", price: "₹ 450", img: almondBar.url },
  { name: "Crispy Rice\nChocolate Bar", price: "₹ 450", img: riceBar.url },
  { name: "Chocolate\nTruffle Box", price: "₹ 650", img: truffleBox.url },
];

const trust = [
  { icon: Truck, title: "PAN India Delivery", text: "Safe & secure delivery" },
  { icon: ShieldCheck, title: "Secure Payments", text: "100% secure checkout" },
  { icon: Package, title: "Premium Packaging", text: "Beautifully packed" },
  { icon: Headphones, title: "Customer Support", text: "We're here to help" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-espresso">
        <div className="mx-auto flex h-[104px] w-[93%] max-w-[1320px] items-center">
          <a href="/" className="shrink-0">
            <img src={logoGold.url} alt="Célunor" className="h-[72px] w-auto" loading="eager" />
          </a>

          <nav className="ml-[70px] hidden items-center gap-[52px] lg:flex">
            {navLinks.map((l, i) => (
              <a
                key={l}
                href="#"
                className={`font-body text-[13px] tracking-[0.09em] transition-colors hover:text-rosegold ${
                  i === 0
                    ? "border-b border-rosegold pb-[6px] text-cream"
                    : "text-cream/85"
                }`}
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-[38px] text-cream/85">
            <button aria-label="Search" className="hover:text-rosegold">
              <Search className="h-[23px] w-[23px]" strokeWidth={1.1} />
            </button>
            <button aria-label="Account" className="hover:text-rosegold">
              <User className="h-[23px] w-[23px]" strokeWidth={1.1} />
            </button>
            <button aria-label="Cart" className="relative hover:text-rosegold">
              <ShoppingBag className="h-[23px] w-[23px]" strokeWidth={1.1} />
              <span className="absolute -right-[7px] -top-[7px] flex h-[17px] w-[17px] items-center justify-center rounded-full bg-rosegold font-body text-[10px] text-espresso">
                2
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[516px] overflow-hidden">
        <img
          src={hero.url}
          alt="Dark chocolate bar on kraft paper with walnuts and dried flowers"
          className="absolute inset-y-0 right-0 h-full w-[64%] object-cover object-[60%_center]"
        />
        <div className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-[oklch(0.855_0.045_74)] from-45% to-transparent" />
        <div className="relative mx-auto h-full w-[93%] max-w-[1320px]">
          <div className="max-w-[470px] pl-[55px] pt-[46px]">
            <h1 className="font-display text-[46px] leading-[1.15] tracking-[-0.01em] text-cocoa">
              Crafted for the moments worth savouring.
            </h1>
            <div className="mt-[18px] flex items-center gap-[10px]">
              <span className="h-px w-[74px] bg-rosegold/55" />
              <span className="font-display text-[13px] text-rosegold">✦</span>
              <span className="h-px w-[52px] bg-rosegold/55" />
            </div>
            <p className="mt-[18px] max-w-[250px] font-body text-[14px] leading-[1.6] text-cocoa/85">
              Luxury handcrafted chocolates made with the finest ingredients and
              a whole lot of love.
            </p>
            <div className="mt-[26px] flex flex-wrap items-center gap-[22px]">
              <a
                href="#collections"
                className="inline-flex items-center gap-[14px] rounded-full bg-espresso px-[26px] py-[15px] font-body text-[11.5px] tracking-[0.12em] text-cream transition-colors hover:bg-cocoa"
              >
                SHOP CHOCOLATES <ArrowRight className="h-[15px] w-[15px]" strokeWidth={1.3} />
              </a>
              <a
                href="#story"
                className="inline-flex items-center rounded-full border border-cocoa/45 px-[28px] py-[15px] font-body text-[11.5px] tracking-[0.12em] text-cocoa transition-colors hover:border-cocoa"
              >
                OUR STORY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <div className="relative z-10 -mt-[87px]">
        <div className="mx-auto grid w-[86%] max-w-[1200px] grid-cols-2 rounded-[4px] bg-[oklch(0.955_0.016_80)] shadow-[var(--shadow-soft)] md:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`px-[26px] py-[26px] text-center ${
                i > 0 ? "md:border-l md:border-[oklch(0.88_0.022_76)]" : ""
              }`}
            >
              <f.icon className="mx-auto h-[30px] w-[30px] text-rosegold" strokeWidth={1} />
              <h3 className="mt-[12px] font-display text-[18px] text-rosegold">{f.title}</h3>
              <p className="mt-[6px] whitespace-pre-line font-body text-[12.5px] leading-[1.5] text-cocoa/75">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Collections */}
      <section id="collections" className="pb-[42px] pt-[40px]">
        <div className="mx-auto grid w-[86%] max-w-[1200px] grid-cols-1 gap-[38px] lg:grid-cols-[248px_1fr]">
          <div className="pt-[26px]">
            <p className="flex items-center gap-[8px] font-body text-[11.5px] tracking-[0.13em] text-rosegold">
              <span className="text-[13px]">✦</span> SHOP OUR COLLECTIONS
            </p>
            <h2 className="mt-[14px] font-display text-[32px] leading-[1.22] text-cocoa">
              Indulge in our finest creations
            </h2>
            <p className="mt-[16px] max-w-[228px] font-body text-[13.5px] leading-[1.65] text-cocoa/75">
              From rich and smooth chocolate bars to delightful truffles, find
              your perfect indulgence.
            </p>
            <a
              href="#collections"
              className="mt-[26px] inline-flex items-center gap-[14px] rounded-full bg-espresso px-[26px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream transition-colors hover:bg-cocoa"
            >
              VIEW ALL PRODUCTS <ArrowRight className="h-[15px] w-[15px]" strokeWidth={1.3} />
            </a>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-[19px] lg:grid-cols-4">
              {products.map((p) => (
                <article
                  key={p.name}
                  className="overflow-hidden rounded-[3px] bg-[oklch(0.965_0.012_80)] shadow-[var(--shadow-soft)]"
                >
                  <img
                    src={p.img}
                    alt={p.name.replace("\n", " ")}
                    className="aspect-[205/155] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="px-[18px] pb-[18px] pt-[16px]">
                    <h3 className="whitespace-pre-line font-display text-[18px] leading-[1.28] text-cocoa">
                      {p.name}
                    </h3>
                    <p className="mt-[14px] font-body text-[14px] text-cocoa">{p.price}</p>
                    <button className="mt-[16px] flex w-full items-center justify-between rounded-full border border-cocoa/25 py-[5px] pl-[20px] pr-[5px] font-body text-[10.5px] tracking-[0.13em] text-cocoa transition-colors hover:border-cocoa">
                      ADD TO CART
                      <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-cocoa/25">
                        <ShoppingBag className="h-[13px] w-[13px]" strokeWidth={1.2} />
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <button
              aria-label="Next products"
              className="absolute -right-[16px] top-1/2 hidden h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full bg-espresso text-cream lg:flex"
            >
              <ChevronRight className="h-[17px] w-[17px]" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-espresso py-[26px]">
        <div className="mx-auto grid w-[86%] max-w-[1200px] grid-cols-2 gap-[24px] md:grid-cols-4">
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
    </div>
  );
}
