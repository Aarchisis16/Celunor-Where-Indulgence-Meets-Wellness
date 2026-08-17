import { Link } from "@tanstack/react-router";
import logoGold from "@/assets/celunor-logo-gold.png.asset.json";
import { navLinks } from "@/components/site/SiteHeader";
import type { Settings } from "@/lib/catalog";

export function SiteFooter({ settings }: { settings: Settings }) {
  const address = [settings["address"], settings["city"], settings["state"], settings["pincode"]]
    .filter(Boolean)
    .join(", ");

  return (
    <footer className="bg-cocoa py-[36px]">
      <div className="mx-auto grid w-[90%] max-w-[1200px] gap-[26px] md:w-[86%] md:grid-cols-3">
        <div>
          <img src={logoGold.url} alt="Célunor" className="h-[54px] w-auto" loading="lazy" />
          <p className="mt-[14px] max-w-[280px] font-body text-[12.5px] leading-[1.7] text-cream/70">
            {settings["footer_note"] || "Luxury handcrafted chocolates, delivered across India."}
          </p>
        </div>
        <div>
          <p className="font-body text-[11.5px] tracking-[0.13em] text-rosegold">EXPLORE</p>
          <ul className="mt-[12px] grid grid-cols-2 gap-[8px] md:grid-cols-1">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="font-body text-[12.5px] text-cream/75 hover:text-rosegold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-body text-[11.5px] tracking-[0.13em] text-rosegold">CONTACT</p>
          <ul className="mt-[12px] space-y-[8px] font-body text-[12.5px] text-cream/75">
            {settings["email"] ? (
              <li>
                <a href={`mailto:${settings["email"]}`} className="hover:text-rosegold">
                  {settings["email"]}
                </a>
              </li>
            ) : null}
            {settings["phone"] ? (
              <li>
                <a
                  href={`tel:${settings["phone"].replace(/\s/g, "")}`}
                  className="hover:text-rosegold"
                >
                  {settings["phone"]}
                </a>
              </li>
            ) : null}
            {address ? <li>{address}</li> : null}
            {settings["business_hours"] ? <li>{settings["business_hours"]}</li> : null}
            {settings["instagram"] ? (
              <li>
                <a
                  href={settings["instagram"]}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-rosegold"
                >
                  Instagram
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-[28px] flex w-[90%] max-w-[1200px] flex-wrap items-center justify-between gap-3 border-t border-cream/10 pt-[16px] font-body text-[11.5px] text-cream/50 md:w-[86%]">
        <p>© {new Date().getFullYear()} Célunor. All rights reserved.</p>
        <Link to="/admin/login" className="hover:text-rosegold">
          Admin
        </Link>
      </div>
    </footer>
  );
}
