import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { productImage, productPrice, productsQuery, settingsQuery } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import { productEnquiryMessage, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({
    meta: [
      { title: "Product — Célunor" },
      { name: "description", content: "Handcrafted chocolate and premium dry fruits by Célunor." },
      { property: "og:title", content: "Product — Célunor" },
      {
        property: "og:description",
        content: "Handcrafted chocolate and premium dry fruits by Célunor.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: settings = {} } = useQuery(settingsQuery);
  const { add, setCartOpen } = useCart();

  const p = products.find((x) => x.slug === slug);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto w-[90%] max-w-[1200px] py-[60px] font-body text-[13.5px] text-cocoa/70">
          Loading…
        </div>
      </SiteLayout>
    );
  }

  if (!p) {
    return (
      <SiteLayout>
        <div className="mx-auto w-[90%] max-w-[1200px] py-[70px] text-center">
          <h1 className="font-display text-[30px] text-cocoa">Product not found</h1>
          <Link
            to="/shop"
            search={{ q: undefined, cat: undefined }}
            className="mt-6 inline-flex rounded-full bg-espresso px-6 py-3 font-body text-[11.5px] tracking-[0.12em] text-cream"
          >
            BACK TO SHOP
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const price = productPrice(p);
  const related = products.filter((x) => x.category_id === p.category_id && x.id !== p.id).slice(0, 4);

  return (
    <SiteLayout>
      <div className="mx-auto grid w-[90%] max-w-[1200px] gap-[34px] py-[38px] md:w-[86%] md:grid-cols-2 md:py-[52px]">
        <div className="overflow-hidden rounded-[4px] bg-[oklch(0.965_0.012_80)] shadow-[var(--shadow-soft)]">
          <img
            src={productImage(p)}
            alt={p.name}
            className="aspect-[4/3] w-full object-cover md:aspect-square"
          />
        </div>
        <div>
          <p className="font-body text-[11.5px] tracking-[0.13em] text-rosegold">✦ CÉLUNOR</p>
          <h1 className="mt-[10px] font-display text-[30px] leading-[1.2] text-cocoa md:text-[38px]">
            {p.name}
          </h1>
          <p className="mt-[12px] font-body text-[18px] text-cocoa">
            {inr(price)}
            {p.sale_price ? (
              <span className="ml-3 text-[14px] text-cocoa/45 line-through">{inr(p.price)}</span>
            ) : null}
          </p>
          <p className="mt-[16px] max-w-[520px] font-body text-[13.5px] leading-[1.75] text-cocoa/75">
            {p.description || p.short_description}
          </p>

          <dl className="mt-[22px] space-y-[10px] font-body text-[12.5px] text-cocoa/75">
            {p.net_quantity ? (
              <div className="flex gap-3">
                <dt className="w-[110px] text-cocoa/55">Net quantity</dt>
                <dd>{p.net_quantity}</dd>
              </div>
            ) : null}
            {p.ingredients ? (
              <div className="flex gap-3">
                <dt className="w-[110px] shrink-0 text-cocoa/55">Ingredients</dt>
                <dd>{p.ingredients}</dd>
              </div>
            ) : null}
            <div className="flex gap-3">
              <dt className="w-[110px] text-cocoa/55">Availability</dt>
              <dd>{p.in_stock ? "In stock" : "Sold out"}</dd>
            </div>
            {settings["delivery_message"] ? (
              <div className="flex gap-3">
                <dt className="w-[110px] shrink-0 text-cocoa/55">Delivery</dt>
                <dd>{settings["delivery_message"]}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-[26px] flex flex-wrap gap-[12px]">
            <button
              disabled={!p.in_stock}
              onClick={() => {
                add({
                  key: `product:${p.id}`,
                  type: "product",
                  productId: p.id,
                  name: p.name,
                  price,
                  image: productImage(p),
                });
                setCartOpen(true);
              }}
              className="inline-flex items-center gap-[12px] rounded-full bg-espresso px-[26px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream hover:bg-cocoa disabled:opacity-40"
            >
              <ShoppingBag className="h-[15px] w-[15px]" strokeWidth={1.3} />
              {p.in_stock ? "ADD TO CART" : "SOLD OUT"}
            </button>
            {settings["whatsapp"] ? (
              <a
                href={whatsappLink(settings["whatsapp"], productEnquiryMessage(p.name, price))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-[10px] rounded-full border border-cocoa/35 px-[24px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cocoa hover:border-cocoa"
              >
                <MessageCircle className="h-[15px] w-[15px]" strokeWidth={1.3} /> ENQUIRE ON
                WHATSAPP
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mx-auto w-[90%] max-w-[1200px] pb-[52px] md:w-[86%]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[24px] text-cocoa">You may also like</h2>
            <Link
              to="/shop"
              search={{ q: undefined, cat: undefined }}
              className="inline-flex items-center gap-2 font-body text-[11.5px] tracking-[0.12em] text-rosegold"
            >
              SHOP ALL <ArrowRight className="h-[14px] w-[14px]" strokeWidth={1.3} />
            </Link>
          </div>
          <div className="mt-[20px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </div>
      ) : null}
    </SiteLayout>
  );
}
