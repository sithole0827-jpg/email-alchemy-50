import { createFileRoute } from "@tanstack/react-router";

import { PageShell, SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/customer")({
  head: () => ({
    meta: [
      { title: "My Requests — Mzansi Problem to Business" },
      { name: "description", content: "Track the problems you reported and the quotes you requested." },
      { property: "og:title", content: "My Requests — Mzansi Problem to Business" },
      { property: "og:description", content: "Track the problems you reported and the quotes you requested." },
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
      <PageShell title="My Requests" subtitle="Track the problems you reported and the quotes you requested.">
        <div className="rounded-xl border bg-muted/40 p-6 text-sm text-muted-foreground">
          This section is coming next. The sign-in and registration flow is ready — create an
          account to get started.
        </div>
      </PageShell>
      <SiteFooter />
    </div>
  );
}
