import { createFileRoute } from "@tanstack/react-router";

import { PageShell, SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Mzansi Problem to Business" },
      { name: "description", content: "How to use the platform, and how to stay safe." },
      { property: "og:title", content: "Help — Mzansi Problem to Business" },
      { property: "og:description", content: "How to use the platform, and how to stay safe." },
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
      <PageShell title="Help" subtitle="How to use the platform, and how to stay safe.">
        <div className="rounded-xl border bg-muted/40 p-6 text-sm text-muted-foreground">
          This section is coming next. The sign-in and registration flow is ready — create an
          account to get started.
        </div>
      </PageShell>
      <SiteFooter />
    </div>
  );
}
