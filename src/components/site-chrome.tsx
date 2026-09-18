import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report a Problem" },
  { to: "/services", label: "Find a Service" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/demand-map", label: "Demand Map" },
  { to: "/entrepreneur", label: "Entrepreneur" },
  { to: "/customer", label: "My Requests" },
  { to: "/provider", label: "Provider" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { account, signOut } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            M
          </span>
          <span className="text-sm leading-tight font-semibold sm:text-base">
            Mzansi <span className="text-primary">Problem to Business</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-muted text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {account ? (
            <Button variant="outline" size="sm" onClick={signOut} className="hidden sm:inline-flex">
              Sign out
            </Button>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-md border p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t px-4 pb-4 lg:hidden">
          <div className="grid gap-1 pt-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "bg-muted text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {account ? "Account" : "Sign in / Register"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
        <div>
          <p className="text-sm font-semibold">Mzansi Problem to Business</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Turning everyday South African service problems into local business opportunities.
          </p>
        </div>
        <div className="grid gap-1 text-xs">
          <span className="font-semibold text-foreground">Platform</span>
          <Link to="/about" className="text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link to="/help" className="text-muted-foreground hover:text-foreground">
            Help
          </Link>
          <Link to="/opportunities" className="text-muted-foreground hover:text-foreground">
            Business opportunities
          </Link>
        </div>
        <div className="grid gap-1 text-xs">
          <span className="font-semibold text-foreground">Legal</span>
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-muted-foreground hover:text-foreground">
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        Demonstration prototype. Provider listings and demand figures shown here are sample data,
        not an official measurement of South African demand.
      </div>
    </footer>
  );
}

export function PageShell({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-10", className)}>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </main>
  );
}
