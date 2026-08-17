import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import { productImage, productPrice, type Product } from "@/lib/catalog";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const price = productPrice(p);

  return (
    <article className="flex flex-col overflow-hidden rounded-[3px] bg-[oklch(0.965_0.012_80)] shadow-[var(--shadow-soft)]">
      <Link to="/product/$slug" params={{ slug: p.slug }} className="block">
        <img
          src={productImage(p)}
          alt={p.name}
          className="aspect-[205/155] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col px-[18px] pb-[18px] pt-[16px]">
        <Link to="/product/$slug" params={{ slug: p.slug }}>
          <h3 className="font-display text-[18px] leading-[1.28] text-cocoa hover:text-rosegold">
            {p.name}
          </h3>
        </Link>
        {p.net_quantity ? (
          <p className="mt-[4px] font-body text-[11.5px] text-cocoa/55">{p.net_quantity}</p>
        ) : null}
        <p className="mt-[12px] font-body text-[14px] text-cocoa">
          {inr(price)}
          {p.sale_price ? (
            <span className="ml-2 text-[12px] text-cocoa/45 line-through">{inr(p.price)}</span>
          ) : null}
        </p>
        <div className="mt-auto pt-[16px]">
          <button
            disabled={!p.in_stock}
            onClick={() =>
              add({
                key: `product:${p.id}`,
                type: "product",
                productId: p.id,
                name: p.name,
                price,
                image: productImage(p),
              })
            }
            className="flex w-full items-center justify-between rounded-full border border-cocoa/25 py-[5px] pl-[20px] pr-[5px] font-body text-[10.5px] tracking-[0.13em] text-cocoa transition-colors hover:border-cocoa disabled:opacity-45"
          >
            {p.in_stock ? "ADD TO CART" : "SOLD OUT"}
            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-cocoa/25">
              <ShoppingBag className="h-[13px] w-[13px]" strokeWidth={1.2} />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
