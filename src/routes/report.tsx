import { createFileRoute } from "@tanstack/react-router";

import { PageShell, SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a Problem — Mzansi Problem to Business" },
      { name: "description", content: "Describe the problem you need solved and we'll point you to the right service." },
      { property: "og:title", content: "Report a Problem — Mzansi Problem to Business" },
      { property: "og:description", content: "Describe the problem you need solved and we'll point you to the right service." },
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
      <PageShell title="Report a Problem" subtitle="Describe the problem you need solved and we'll point you to the right service.">
        <div className="rounded-xl border bg-muted/40 p-6 text-sm text-muted-foreground">
          This section is coming next. The sign-in and registration flow is ready — create an
          account to get started.
        </div>
      </PageShell>
      <SiteFooter />
    </div>
  );
}
