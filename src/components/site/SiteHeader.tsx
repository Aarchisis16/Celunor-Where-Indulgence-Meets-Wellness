import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import logoGold from "@/assets/celunor-logo-gold.png.asset.json";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";

export const navLinks = [
  { label: "HOME", to: "/" },
  { label: "SHOP", to: "/shop" },
  { label: "CHOCOLATES", to: "/chocolates" },
  { label: "DRY FRUITS", to: "/dry-fruits" },
  { label: "CUSTOMISE", to: "/customise" },
  { label: "GIFT BOX", to: "/gift-box" },
  { label: "OUR STORY", to: "/story" },
  { label: "CONTACT", to: "/contact" },
] as const;

export function SiteHeader({ announcement }: { announcement?: string | undefined }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count, items, subtotal, setQty, remove, cartOpen, setCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const open = menuOpen || cartOpen;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate({ to: "/shop", search: { q: query.trim() || undefined, cat: undefined } });
  };

  return (
    <>
      {announcement ? (
        <div className="bg-cocoa py-[7px] text-center font-body text-[11px] tracking-[0.12em] text-cream/85">
          {announcement}
        </div>
      ) : null}

      <header className="sticky top-0 z-40 bg-espresso">
        <div className="mx-auto flex h-[72px] w-[92%] max-w-[1320px] items-center md:h-[88px] lg:h-[104px]">
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="mr-4 text-cream/85 hover:text-rosegold lg:hidden"
          >
            <Menu className="h-6 w-6" strokeWidth={1.2} />
          </button>

          <Link to="/" className="flex shrink-0 items-center">
            <img
              src={logoGold.url}
              alt="Célunor"
              className="block h-[48px] w-auto object-contain md:h-[60px] lg:h-[68px]"
              loading="eager"
            />
          </Link>

          <nav className="ml-[42px] hidden items-center gap-[22px] lg:flex xl:ml-[60px] xl:gap-[30px]">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="relative font-body text-[12px] leading-none tracking-[0.09em] text-cream/85 transition-colors hover:text-rosegold"
                activeProps={{ className: "text-cream" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive ? (
                      <span className="absolute -bottom-[7px] left-0 h-px w-full bg-rosegold" />
                    ) : null}
                  </>
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-[20px] text-cream/85 md:gap-[26px] lg:gap-[30px]">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((s) => !s)}
              className="hover:text-rosegold"
            >
              <Search className="h-[21px] w-[21px] lg:h-[23px] lg:w-[23px]" strokeWidth={1.1} />
            </button>
            <button
              aria-label={`Cart, ${count} items`}
              onClick={() => setCartOpen(true)}
              className="relative hover:text-rosegold"
            >
              <ShoppingBag className="h-[21px] w-[21px] lg:h-[23px] lg:w-[23px]" strokeWidth={1.1} />
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
            <form onSubmit={submitSearch} className="mx-auto w-[92%] max-w-[1320px] py-3">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chocolates, dry fruits…"
                className="w-full rounded-full border border-cream/20 bg-transparent px-5 py-2.5 font-body text-[13px] text-cream placeholder:text-cream/45 focus:border-rosegold focus:outline-none"
              />
            </form>
          </div>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-espresso/60"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-[78%] max-w-[320px] flex-col overflow-y-auto bg-espresso px-7 py-6">
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
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-left font-body text-[14px] tracking-[0.12em] text-cream/85 hover:text-rosegold"
                  activeProps={{ className: "text-rosegold" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

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
              {items.length === 0 ? (
                <p className="font-body text-[13.5px] text-cocoa/70">
                  Your cart is empty. Add something sweet.
                </p>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[68px] w-[68px] shrink-0 rounded-[3px] object-cover"
                        />
                      ) : (
                        <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-[3px] bg-sand font-display text-[20px] text-cocoa/60">
                          ✦
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[16px] leading-snug text-cocoa">
                          {item.name}
                        </p>
                        {item.detail ? (
                          <p className="mt-0.5 font-body text-[11.5px] leading-snug text-cocoa/60">
                            {item.detail}
                          </p>
                        ) : null}
                        <p className="mt-1 font-body text-[13px] text-cocoa/75">
                          {inr(item.price)}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => setQty(item.key, item.qty - 1)}
                            className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-cocoa/25 text-cocoa"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-body text-[13px] text-cocoa">{item.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => setQty(item.key, item.qty + 1)}
                            className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-cocoa/25 text-cocoa"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            aria-label="Remove item"
                            onClick={() => remove(item.key)}
                            className="ml-auto text-cocoa/55 hover:text-cocoa"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.2} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-cocoa/15 px-6 py-5">
              <div className="flex items-center justify-between font-body text-[14px] text-cocoa">
                <span>Subtotal</span>
                <span>{inr(subtotal)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setCartOpen(false)}
                className={`mt-4 block w-full rounded-full bg-espresso py-[14px] text-center font-body text-[11.5px] tracking-[0.12em] text-cream transition-colors hover:bg-cocoa ${
                  items.length === 0 ? "pointer-events-none opacity-40" : ""
                }`}
              >
                CHECKOUT
              </Link>
              <Link
                to="/cart"
                onClick={() => setCartOpen(false)}
                className="mt-2 block w-full rounded-full border border-cocoa/25 py-[12px] text-center font-body text-[11.5px] tracking-[0.12em] text-cocoa hover:border-cocoa"
              >
                VIEW CART
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
