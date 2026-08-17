import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { settingsQuery } from "@/lib/catalog";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Célunor — Orders, Gifting & Bulk Enquiries" },
      {
        name: "description",
        content:
          "Get in touch with Célunor for orders, corporate gifting and bulk enquiries — by WhatsApp, phone or email.",
      },
      { property: "og:title", content: "Contact Célunor" },
      {
        property: "og:description",
        content: "Reach the Célunor team by WhatsApp, phone or email.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255).or(z.literal("")),
  message: z.string().trim().min(1, "Please write a message").max(1000),
});

function ContactPage() {
  const { data: s = {} } = useQuery(settingsQuery);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState<string | null>(null);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setError(null);
    const text = `Hello Célunor, I'm ${parsed.data.name}${
      parsed.data.email ? ` (${parsed.data.email})` : ""
    }.\n\n${parsed.data.message}`;
    if (s["whatsapp"]) {
      window.open(whatsappLink(s["whatsapp"], text), "_blank", "noopener");
    } else if (s["email"]) {
      window.location.href = `mailto:${s["email"]}?subject=${encodeURIComponent(
        "Célunor enquiry",
      )}&body=${encodeURIComponent(text)}`;
    }
  };

  const address = [s["address"], s["city"], s["state"], s["pincode"]].filter(Boolean).join(", ");

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="CONTACT"
        title="We'd love to hear from you"
        intro="Questions about an order, corporate gifting or a bulk request? Send us a note and we'll reply the same working day."
      />

      <div className="mx-auto grid w-[90%] max-w-[1200px] gap-[32px] py-[42px] md:w-[86%] md:grid-cols-2">
        <div className="space-y-[18px]">
          {s["whatsapp"] ? (
            <a
              href={whatsappLink(s["whatsapp"], "Hello Célunor!")}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-4 rounded-[4px] border border-cocoa/15 bg-[oklch(0.965_0.012_80)] p-[20px] hover:border-cocoa/40"
            >
              <MessageCircle className="mt-0.5 h-5 w-5 text-rosegold" strokeWidth={1.2} />
              <div>
                <p className="font-body text-[13.5px] text-cocoa">WhatsApp</p>
                <p className="font-body text-[12.5px] text-cocoa/65">
                  Fastest way to reach us — tap to chat.
                </p>
              </div>
            </a>
          ) : null}
          {s["phone"] ? (
            <a
              href={`tel:${s["phone"].replace(/\s/g, "")}`}
              className="flex items-start gap-4 rounded-[4px] border border-cocoa/15 bg-[oklch(0.965_0.012_80)] p-[20px] hover:border-cocoa/40"
            >
              <Phone className="mt-0.5 h-5 w-5 text-rosegold" strokeWidth={1.2} />
              <div>
                <p className="font-body text-[13.5px] text-cocoa">{s["phone"]}</p>
                <p className="font-body text-[12.5px] text-cocoa/65">{s["business_hours"]}</p>
              </div>
            </a>
          ) : null}
          {s["email"] ? (
            <a
              href={`mailto:${s["email"]}`}
              className="flex items-start gap-4 rounded-[4px] border border-cocoa/15 bg-[oklch(0.965_0.012_80)] p-[20px] hover:border-cocoa/40"
            >
              <Mail className="mt-0.5 h-5 w-5 text-rosegold" strokeWidth={1.2} />
              <div>
                <p className="font-body text-[13.5px] text-cocoa">{s["email"]}</p>
                <p className="font-body text-[12.5px] text-cocoa/65">Email us anytime</p>
              </div>
            </a>
          ) : null}
          {address ? (
            <div className="flex items-start gap-4 rounded-[4px] border border-cocoa/15 bg-[oklch(0.965_0.012_80)] p-[20px]">
              <MapPin className="mt-0.5 h-5 w-5 text-rosegold" strokeWidth={1.2} />
              <p className="font-body text-[13.5px] text-cocoa">{address}</p>
            </div>
          ) : null}
        </div>

        <form onSubmit={send} className="rounded-[4px] border border-cocoa/15 p-[24px]">
          <h2 className="font-display text-[24px] text-cocoa">Send a message</h2>
          <div className="mt-[16px] space-y-[12px]">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              maxLength={100}
              className="w-full rounded-[4px] border border-cocoa/25 bg-transparent px-4 py-3 font-body text-[13.5px] text-cocoa placeholder:text-cocoa/40 focus:border-rosegold focus:outline-none"
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email (optional)"
              maxLength={255}
              className="w-full rounded-[4px] border border-cocoa/25 bg-transparent px-4 py-3 font-body text-[13.5px] text-cocoa placeholder:text-cocoa/40 focus:border-rosegold focus:outline-none"
            />
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              maxLength={1000}
              placeholder="How can we help?"
              className="w-full rounded-[4px] border border-cocoa/25 bg-transparent px-4 py-3 font-body text-[13.5px] text-cocoa placeholder:text-cocoa/40 focus:border-rosegold focus:outline-none"
            />
          </div>
          {error ? <p className="mt-3 font-body text-[12.5px] text-destructive">{error}</p> : null}
          <button
            type="submit"
            className="mt-[16px] w-full rounded-full bg-espresso py-[14px] font-body text-[11.5px] tracking-[0.12em] text-cream hover:bg-cocoa"
          >
            SEND MESSAGE
          </button>
        </form>
      </div>
    </SiteLayout>
  );
}
