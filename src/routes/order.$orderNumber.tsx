import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { settingsQuery } from "@/lib/catalog";
import { inr } from "@/lib/format";
import { cartMessage, whatsappLink } from "@/lib/whatsapp";
import type { CartItem } from "@/lib/cart";

type StoredOrder = {
  orderNumber: string;
  total: number;
  subtotal: number;
  delivery: number;
  method: string;
  items: CartItem[];
  customer: { customer_name: string; address: string; city: string; state: string; pincode: string };
};

export const Route = createFileRoute("/order/$orderNumber")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Célunor" },
      { name: "description", content: "Thank you for your Célunor order." },
      { property: "og:title", content: "Order Confirmed — Célunor" },
      { property: "og:description", content: "Thank you for your Célunor order." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { orderNumber } = Route.useParams();
  const { data: settings = {} } = useQuery(settingsQuery);
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("celunor.lastOrder");
      if (raw) {
        const parsed = JSON.parse(raw) as StoredOrder;
        if (parsed.orderNumber === orderNumber) setOrder(parsed);
      }
    } catch {
      /* ignore */
    }
  }, [orderNumber]);

  return (
    <SiteLayout>
      <div className="mx-auto w-[90%] max-w-[720px] py-[56px] text-center md:w-[86%]">
        <CheckCircle2 className="mx-auto h-10 w-10 text-rosegold" strokeWidth={1} />
        <h1 className="mt-[16px] font-display text-[32px] leading-[1.2] text-cocoa">
          Thank you — your order is confirmed
        </h1>
        <p className="mt-[10px] font-body text-[13.5px] text-cocoa/75">
          Order number <span className="text-cocoa">{orderNumber}</span>.{" "}
          {settings["delivery_message"]}
        </p>

        {order ? (
          <div className="mt-[28px] rounded-[4px] border border-cocoa/15 bg-[oklch(0.965_0.012_80)] p-[24px] text-left">
            <ul className="space-y-[8px] font-body text-[12.5px] text-cocoa/75">
              {order.items.map((i) => (
                <li key={i.key} className="flex justify-between gap-3">
                  <span>
                    {i.name} × {i.qty}
                  </span>
                  <span>{inr(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-[12px] flex justify-between border-t border-cocoa/15 pt-[12px] font-body text-[14px] text-cocoa">
              <span>Total paid / due</span>
              <span>{inr(order.total)}</span>
            </div>
            <p className="mt-[12px] font-body text-[12.5px] text-cocoa/65">
              Delivering to {order.customer.customer_name}, {order.customer.address},{" "}
              {order.customer.city}, {order.customer.state} {order.customer.pincode}
            </p>
          </div>
        ) : null}

        <div className="mt-[26px] flex flex-wrap justify-center gap-[12px]">
          {settings["whatsapp"] ? (
            <a
              href={whatsappLink(
                settings["whatsapp"],
                order
                  ? cartMessage(order.items, order.total, orderNumber)
                  : `Hello Célunor, I'd like an update on order ${orderNumber}.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-espresso px-[26px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream hover:bg-cocoa"
            >
              SHARE ORDER ON WHATSAPP
            </a>
          ) : null}
          <Link
            to="/shop"
            search={{ q: undefined, cat: undefined }}
            className="rounded-full border border-cocoa/35 px-[26px] py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cocoa hover:border-cocoa"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
