import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Heart,
  Leaf,
  Nut,
  HandHeart,
  ShieldCheck,
  Truck,
  Package,
  Headphones,
} from "lucide-react";
import hero from "@/assets/hero-chocolate.jpg.asset.json";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery, settingsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Célunor — Luxury Handcrafted Chocolates & Dry Fruits" },
      {
        name: "description",
        content:
          "Célunor makes luxury handcrafted chocolates and hand-sorted dry fruits — custom chocolate, gift boxes and PAN India delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Célunor — Luxury Handcrafted Chocolates & Dry Fruits" },
      {
        property: "og:description",
        content: "Crafted for the moments worth savouring. Small-batch chocolate, made by hand.",
      },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Nut, title: "Finest Ingredients", text: "We use premium quality ingredients." },
  { icon: HandHeart, title: "Handcrafted", text: "Every piece is handmade with care." },
  { icon: Leaf, title: "No Preservatives", text: "Pure indulgence without compromise." },
  { icon: Heart, title: "Made with Love", text: "Crafted to bring joy to your moments." },
];

const trust = [
  { icon: Truck, title: "PAN India Delivery", text: "Safe & secure delivery" },
  { icon: ShieldCheck, title: "Secure Payments", text: "100% secure checkout" },
  { icon: Package, title: "Premium Packaging", text: "Beautifully packed" },
  { icon: Headphones, title: "Customer Support", text: "We're here to help" },
];

function Index() {
  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: settings = {} } = useQuery(settingsQuery);

  const catId = (slug: string) => categories.find((c) => c.slug === slug)?.id;
  const chocolates = products.filter((p) => p.category_id === catId("chocolates")).slice(0, 4);
  const dryFruits = products.filter((p) => p.category_id === catId("dry-fruits")).slice(0, 4);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={hero.url}
          alt="Dark chocolate bar on kraft paper with walnuts and dried flowers"
          className="absolute inset-y-0 right-0 h-full w-full object-cover object-[60%_center] md:w-[64%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.855_0.045_74)] via-[oklch(0.855_0.045_74)]/85 to-transparent md:inset-y-0 md:left-0 md:right-auto md:w-[62%] md:bg-gradient-to-r md:from-45%" />
        <div className="relative mx-auto w-[92%] max-w-[1320px]">
          <div className="max-w-[470px] py-[54px] md:py-[60px] md:pl-[40px] lg:pb-[130px] lg:pl-[55px] lg:pt-[46px]">
            <h1 className="font-display text-[32px] leading-[1.15] tracking-[-0.01em] text-cocoa sm:text-[38px] lg:text-[46px]">
              {settings["tagline"] || "Crafted for the moments worth savouring."}
            </h1>
            <div className="mt-[18px] flex items-center gap-[10px]">
              <span className="h-px w-[74px] bg-rosegold/55" />
              <span className="font-display text-[13px] text-rosegold">✦</span>
              <span className="h-px w-[52px] bg-rosegold/55" />
            </div>
            <p className="mt-[18px] max-w-[300px] font-body text-[14px] leading-[1.6] text-cocoa/85">
              Luxury handcrafted chocolates made with the finest ingredients and a whole lot of
              love.
            </p>
            <div className="mt-[26px] flex flex-wrap items-center gap-[14px] sm:gap-[18px]">
              <Link
                to="/shop"
                search={{ q: undefined, cat: undefined }}
                className="inline-flex items-center gap-[14px] rounded-full bg-espresso px-[24px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream transition-colors hover:bg-cocoa lg:px-[26px] lg:py-[15px]"
              >
                SHOP ALL <ArrowRight className="h-[15px] w-[15px]" strokeWidth={1.3} />
              </Link>
              <Link
                to="/gift-box"
                className="inline-flex items-center rounded-full border border-cocoa/45 px-[26px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cocoa transition-colors hover:border-cocoa lg:px-[28px] lg:py-[15px]"
              >
                BUILD A GIFT BOX
              </Link>
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
              <p className="mt-[6px] font-body text-[12.5px] leading-[1.5] text-cocoa/75">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chocolates */}
      <section className="pt-[46px]">
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
            <Link
              to="/chocolates"
              className="mt-[24px] inline-flex items-center gap-[14px] rounded-full bg-espresso px-[26px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream transition-colors hover:bg-cocoa"
            >
              VIEW ALL CHOCOLATES <ArrowRight className="h-[15px] w-[15px]" strokeWidth={1.3} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[19px] xl:grid-cols-4">
            {chocolates.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Dry fruits */}
      <section className="pb-[42px] pt-[46px]">
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
            <Link
              to="/dry-fruits"
              className="mt-[24px] inline-flex items-center gap-[14px] rounded-full bg-espresso px-[26px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream transition-colors hover:bg-cocoa"
            >
              VIEW ALL DRY FRUITS <ArrowRight className="h-[15px] w-[15px]" strokeWidth={1.3} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[19px] xl:grid-cols-4">
            {dryFruits.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Make it yours */}
      <section className="pb-[48px]">
        <div className="mx-auto grid w-[90%] max-w-[1200px] gap-[18px] md:w-[86%] md:grid-cols-2">
          {[
            {
              eyebrow: "CUSTOMISE",
              title: "Your chocolate, your way",
              text: "Choose the base, pick your add-ins, add a message and we'll make it to order.",
              to: "/customise" as const,
              cta: "START CUSTOMISING",
            },
            {
              eyebrow: "GIFTING",
              title: "Build your gift box",
              text: "Pick a box size, fill it with your favourites and finish it with a handwritten note.",
              to: "/gift-box" as const,
              cta: "BUILD A BOX",
            },
          ].map((c) => (
            <div key={c.title} className="surface-card rounded-[4px] px-[28px] py-[32px]">
              <p className="font-body text-[11.5px] tracking-[0.13em] text-rosegold">
                ✦ {c.eyebrow}
              </p>
              <h3 className="mt-[12px] font-display text-[26px] leading-[1.2] text-cocoa">
                {c.title}
              </h3>
              <p className="mt-[12px] max-w-[420px] font-body text-[13.5px] leading-[1.7] text-cocoa/75">
                {c.text}
              </p>
              <Link
                to={c.to}
                className="mt-[20px] inline-flex items-center gap-[12px] rounded-full border border-cocoa/35 px-[24px] py-[12px] font-body text-[11.5px] tracking-[0.12em] text-cocoa hover:border-cocoa"
              >
                {c.cta} <ArrowRight className="h-[14px] w-[14px]" strokeWidth={1.3} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Story teaser */}
      <section className="pb-[48px] pt-[10px]">
        <div className="mx-auto w-[90%] max-w-[820px] text-center md:w-[86%]">
          <p className="font-body text-[11.5px] tracking-[0.13em] text-rosegold">✦ OUR STORY</p>
          <h2 className="mt-[14px] font-display text-[28px] leading-[1.22] text-cocoa lg:text-[32px]">
            {settings["story_intro"] || "Small batches, slow craft, honest ingredients"}
          </h2>
          <p className="mx-auto mt-[16px] max-w-[620px] font-body text-[13.5px] leading-[1.75] text-cocoa/75">
            {settings["story_body"]}
          </p>
          <Link
            to="/story"
            className="mt-[22px] inline-flex items-center gap-[12px] rounded-full border border-cocoa/35 px-[24px] py-[12px] font-body text-[11.5px] tracking-[0.12em] text-cocoa hover:border-cocoa"
          >
            READ OUR STORY <ArrowRight className="h-[14px] w-[14px]" strokeWidth={1.3} />
          </Link>
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
    </SiteLayout>
  );
}
