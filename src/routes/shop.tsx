import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/catalog";

type ShopSearch = { q?: string | undefined; cat?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    q: typeof search["q"] === "string" && search["q"] ? String(search["q"]) : undefined,
    cat: typeof search["cat"] === "string" && search["cat"] ? String(search["cat"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All — Célunor Chocolates & Dry Fruits" },
      {
        name: "description",
        content:
          "Browse the full Célunor range: handcrafted chocolate bars, truffles, gift boxes and premium dry fruits.",
      },
      { property: "og:title", content: "Shop All — Célunor" },
      {
        property: "og:description",
        content: "The full Célunor range of handcrafted chocolate and premium dry fruits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { q, cat } = Route.useSearch();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);

  const term = (q ?? "").trim().toLowerCase();
  const category = categories.find((c) => c.slug === cat);
  const visible = products.filter((p) => {
    if (category && p.category_id !== category.id) return false;
    if (!term) return true;
    return `${p.name} ${p.short_description ?? ""} ${p.description ?? ""}`
      .toLowerCase()
      .includes(term);
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="SHOP"
        title="All products"
        intro="Everything we make, in one place — chocolate bars, truffles, gift boxes and hand-sorted dry fruits."
      />

      <div className="mx-auto w-[90%] max-w-[1200px] py-[34px] md:w-[86%]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <button
            onClick={() => navigate({ to: "/shop", search: { q, cat: undefined } })}
            className={`rounded-full border px-[18px] py-[8px] font-body text-[11.5px] tracking-[0.12em] transition-colors ${
              !cat ? "border-cocoa bg-espresso text-cream" : "border-cocoa/25 text-cocoa"
            }`}
          >
            ALL
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate({ to: "/shop", search: { q, cat: c.slug } })}
              className={`rounded-full border px-[18px] py-[8px] font-body text-[11.5px] tracking-[0.12em] uppercase transition-colors ${
                cat === c.slug ? "border-cocoa bg-espresso text-cream" : "border-cocoa/25 text-cocoa"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {term ? (
          <p className="mt-[18px] font-body text-[12.5px] text-cocoa/70">
            Showing results for “{q}”.{" "}
            <Link
              to="/shop"
              search={{ q: undefined, cat }}
              className="text-rosegold hover:underline"
            >
              Clear search
            </Link>
          </p>
        ) : null}

        <div className="mt-[26px]">
          {isLoading ? (
            <p className="font-body text-[13.5px] text-cocoa/70">Loading products…</p>
          ) : visible.length === 0 ? (
            <p className="font-body text-[13.5px] text-cocoa/70">
              Nothing matches that just yet. Try another search.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[19px] xl:grid-cols-4">
              {visible.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
