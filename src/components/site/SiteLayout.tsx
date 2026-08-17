import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { settingsQuery } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { data: settings = {} } = useQuery(settingsQuery);
  const { toast } = useCart();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <SiteHeader announcement={settings["announcement"] || undefined} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-espresso px-5 py-3 font-body text-[12px] text-cream shadow-[var(--shadow-soft)]">
          {toast}
        </div>
      )}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="border-b border-[oklch(0.88_0.022_76)] bg-[oklch(0.965_0.012_80)] py-[40px] md:py-[54px]">
      <div className="mx-auto w-[90%] max-w-[1200px] md:w-[86%]">
        <p className="flex items-center gap-[8px] font-body text-[11.5px] tracking-[0.13em] text-rosegold">
          <span className="text-[13px]">✦</span> {eyebrow}
        </p>
        <h1 className="mt-[12px] font-display text-[30px] leading-[1.2] text-cocoa md:text-[38px]">
          {title}
        </h1>
        {intro ? (
          <p className="mt-[14px] max-w-[620px] font-body text-[13.5px] leading-[1.7] text-cocoa/75">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
