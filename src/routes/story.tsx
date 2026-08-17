import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { settingsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Célunor" },
      {
        name: "description",
        content:
          "How Célunor began: small batches, slow craft and honest ingredients, tempered by hand in our own kitchen.",
      },
      { property: "og:title", content: "Our Story — Célunor" },
      {
        property: "og:description",
        content: "Small batches, slow craft and honest ingredients — the Célunor story.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  const { data: s = {} } = useQuery(settingsQuery);
  const sections = [1, 2, 3]
    .map((n) => ({
      title: s[`story_section_${n}_title`] ?? "",
      body: s[`story_section_${n}_body`] ?? "",
    }))
    .filter((sec) => sec.title || sec.body);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="OUR STORY"
        title={s["story_intro"] || "Small batches, slow craft, honest ingredients"}
        intro={s["story_body"] ?? ""}
      />
      <div className="mx-auto w-[90%] max-w-[820px] space-y-[34px] py-[46px] md:w-[86%]">
        {sections.map((sec) => (
          <section key={sec.title}>
            <h2 className="font-display text-[26px] leading-[1.2] text-cocoa">{sec.title}</h2>
            <p className="mt-[12px] whitespace-pre-line font-body text-[13.5px] leading-[1.8] text-cocoa/75">
              {sec.body}
            </p>
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
