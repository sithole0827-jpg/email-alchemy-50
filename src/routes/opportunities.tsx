import { createFileRoute } from "@tanstack/react-router";

import { PageShell, SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Business Opportunities — Mzansi Problem to Business" },
      { name: "description", content: "See which services are in demand and could become a business." },
      { property: "og:title", content: "Business Opportunities — Mzansi Problem to Business" },
      { property: "og:description", content: "See which services are in demand and could become a business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageShell title="Business Opportunities" subtitle="See which services are in demand and could become a business.">
        <div className="rounded-xl border bg-muted/40 p-6 text-sm text-muted-foreground">
          This section is coming next. The sign-in and registration flow is ready — create an
          account to get started.
        </div>
      </PageShell>
      <SiteFooter />
    </div>
  );
}
