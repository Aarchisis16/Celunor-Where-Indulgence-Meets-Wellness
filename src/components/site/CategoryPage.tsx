import { useQuery } from "@tanstack/react-query";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/catalog";

export function CategoryPage({
  slug,
  eyebrow,
  title,
  intro,
}: {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
}) {
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const category = categories.find((c) => c.slug === slug);
  const visible = category ? products.filter((p) => p.category_id === category.id) : [];

  return (
    <SiteLayout>
      <PageHeader eyebrow={eyebrow} title={title} intro={category?.description || intro} />
      <div className="mx-auto w-[90%] max-w-[1200px] py-[40px] md:w-[86%]">
        {isLoading ? (
          <p className="font-body text-[13.5px] text-cocoa/70">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="font-body text-[13.5px] text-cocoa/70">
            Nothing in this collection yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[19px] xl:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
