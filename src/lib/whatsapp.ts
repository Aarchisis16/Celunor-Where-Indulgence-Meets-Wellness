import type { CartItem } from "@/lib/cart";
import { inr } from "@/lib/format";

export function whatsappLink(number: string, message: string) {
  const digits = (number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message.slice(0, 1800))}`;
}

export function productEnquiryMessage(name: string, price: number) {
  return `Hello Célunor, I'd like to know more about "${name}" (${inr(price)}).`;
}

export function cartMessage(items: CartItem[], total: number, orderNumber?: string) {
  const lines = items.map(
    (i) => `• ${i.name}${i.detail ? ` (${i.detail})` : ""} × ${i.qty} — ${inr(i.price * i.qty)}`,
  );
  return [
    orderNumber
      ? `Hello Célunor, I've just placed order ${orderNumber}.`
      : "Hello Célunor, I'd like to place this order:",
    "",
    ...lines,
    "",
    `Total: ${inr(total)}`,
  ].join("\n");
}
