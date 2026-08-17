import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/dry-fruits")({
  head: () => ({
    meta: [
      { title: "Premium Dry Fruits — Almonds, Cashews & More | Célunor" },
      {
        name: "description",
        content:
          "Hand-sorted almonds, cashews, walnuts and golden raisins from Célunor — sourced in small lots and packed fresh.",
      },
      { property: "og:title", content: "Premium Dry Fruits — Célunor" },
      {
        property: "og:description",
        content: "Hand-sorted nuts and dried fruit, sourced in small lots and packed fresh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CategoryPage
      slug="dry-fruits"
      eyebrow="PREMIUM DRY FRUITS"
      title="Hand-sorted nuts & dried fruit"
      intro="Sourced in small lots, sun-dried and packed fresh — perfect on their own or in a gifting hamper."
    />
  ),
});
