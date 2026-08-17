import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/chocolates")({
  head: () => ({
    meta: [
      { title: "Chocolates — Handcrafted Bars & Truffles | Célunor" },
      {
        name: "description",
        content:
          "Small-batch Célunor chocolate: dark and milk bars, ganache truffles and truffle blossoms, tempered by hand.",
      },
      { property: "og:title", content: "Chocolates — Célunor" },
      {
        property: "og:description",
        content: "Dark and milk bars, ganache truffles and blossoms, tempered by hand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CategoryPage
      slug="chocolates"
      eyebrow="THE CHOCOLATE COLLECTION"
      title="Indulge in our finest creations"
      intro="From rich and smooth chocolate bars to delightful truffles, find your perfect indulgence."
    />
  ),
});
