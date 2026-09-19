import { createFileRoute } from "@tanstack/react-router";

import { PageShell, SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/provider")({
  head: () => ({
    meta: [
      { title: "Provider Dashboard — Mzansi Problem to Business" },
      { name: "description", content: "Manage your listing, quote requests and completed jobs." },
      { property: "og:title", content: "Provider Dashboard — Mzansi Problem to Business" },
      { property: "og:description", content: "Manage your listing, quote requests and completed jobs." },
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
      <PageShell title="Provider Dashboard" subtitle="Manage your listing, quote requests and completed jobs.">
        <div className="rounded-xl border bg-muted/40 p-6 text-sm text-muted-foreground">
          This section is coming next. The sign-in and registration flow is ready — create an
          account to get started.
        </div>
      </PageShell>
      <SiteFooter />
    </div>
  );
}
