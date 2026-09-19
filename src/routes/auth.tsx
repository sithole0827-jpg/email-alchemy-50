import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isValidSaPhone } from "@/lib/sa-data";
import { useStore, type AccountRole } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or register — Mzansi Problem to Business" },
      {
        name: "description",
        content:
          "Create a customer, service provider or entrepreneur account, or sign in to your existing Mzansi Problem to Business account.",
      },
      { property: "og:title", content: "Sign in or register — Mzansi Problem to Business" },
      {
        property: "og:description",
        content:
          "Separate accounts for customers, service providers and entrepreneurs on Mzansi Problem to Business.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const ROLES: { id: AccountRole; label: string; blurb: string; emoji: string; home: string }[] = [
  {
    id: "customer",
    label: "Customer",
    blurb: "I need a service done",
    emoji: "🏠",
    home: "/customer",
  },
  {
    id: "provider",
    label: "Service Provider",
    blurb: "I offer a service",
    emoji: "🧰",
    home: "/provider",
  },
  {
    id: "entrepreneur",
    label: "Entrepreneur",
    blurb: "I'm looking for business ideas",
    emoji: "📈",
    home: "/entrepreneur",
  },
];

function RolePicker({
  value,
  onChange,
  idPrefix,
}: {
  value: AccountRole;
  onChange: (r: AccountRole) => void;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-2">
      <Label>Account type</Label>
      <div className="grid gap-2 sm:grid-cols-3">
        {ROLES.map((r) => (
          <button
            key={r.id}
            id={`${idPrefix}-role-${r.id}`}
            type="button"
            aria-pressed={value === r.id}
            onClick={() => onChange(r.id)}
            className={cn(
              "rounded-xl border p-3 text-left transition-colors",
              value === r.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "hover:bg-muted/60",
            )}
          >
            <span className="text-lg">{r.emoji}</span>
            <span className="mt-1 block text-sm font-semibold">{r.label}</span>
            <span className="block text-xs text-muted-foreground">{r.blurb}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Each account type is separate. You can register the same email address once per account
        type.
      </p>
    </div>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { account, register, login, signOut } = useStore();

  const [mode, setMode] = useState<"login" | "register">("login");

  // Sign in
  const [loginRole, setLoginRole] = useState<AccountRole>("customer");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register
  const [regRole, setRegRole] = useState<AccountRole>("customer");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);

  function goHome(role: AccountRole) {
    const target = ROLES.find((r) => r.id === role)?.home ?? "/";
    void navigate({ to: target as "/customer" | "/provider" | "/entrepreneur" });
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!loginEmail.trim() || !loginPassword) {
      setError("Enter your email address and password.");
      return;
    }
    const res = login({ email: loginEmail, password: loginPassword, role: loginRole });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast.success(`Welcome back, ${res.account.name}`);
    goHome(res.account.role);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!regName.trim()) {
      setError("Enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (regPhone.trim() && !isValidSaPhone(regPhone)) {
      setError("Enter a valid South African phone number, for example 082 123 4567.");
      return;
    }
    if (regPassword.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }
    if (regPassword !== regConfirm) {
      setError("The two passwords do not match.");
      return;
    }
    const res = register({
      name: regName,
      email: regEmail,
      phone: regPhone.trim() || undefined,
      password: regPassword,
      role: regRole,
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast.success(`Account created. Welcome, ${res.account.name}`);
    goHome(res.account.role);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
        {account ? (
          <Card>
            <CardHeader>
              <CardTitle>You are signed in</CardTitle>
              <CardDescription>
                {account.name} · {ROLES.find((r) => r.id === account.role)?.label} account
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-sm text-muted-foreground">{account.email}</p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => goHome(account.role)}>Go to my dashboard</Button>
                <Button variant="outline" onClick={signOut}>
                  Sign out
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </CardTitle>
              <CardDescription>
                Customers, service providers and entrepreneurs each get their own account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={mode}
                onValueChange={(v) => {
                  setMode(v as "login" | "register");
                  setError(null);
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign in</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="pt-4">
                  <form className="grid gap-4" onSubmit={handleLogin}>
                    <RolePicker value={loginRole} onChange={setLoginRole} idPrefix="login" />
                    <div className="grid gap-2">
                      <Label htmlFor="login-email">Email address</Label>
                      <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@example.co.za"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full">
                      Sign in
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      New here?{" "}
                      <button
                        type="button"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                        onClick={() => {
                          setMode("register");
                          setError(null);
                        }}
                      >
                        Create an account
                      </button>
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="pt-4">
                  <form className="grid gap-4" onSubmit={handleRegister}>
                    <RolePicker value={regRole} onChange={setRegRole} idPrefix="register" />
                    <div className="grid gap-2">
                      <Label htmlFor="reg-name">Full name</Label>
                      <Input
                        id="reg-name"
                        autoComplete="name"
                        placeholder="Thabiso Sithole"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reg-email">Email address</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@example.co.za"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reg-phone">
                        Phone / WhatsApp number{" "}
                        <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="reg-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="082 123 4567"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reg-confirm">Confirm password</Label>
                      <Input
                        id="reg-confirm"
                        type="password"
                        autoComplete="new-password"
                        value={regConfirm}
                        onChange={(e) => setRegConfirm(e.target.value)}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full">
                      Create account
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      By registering you agree to our{" "}
                      <Link to="/terms" className="underline underline-offset-4">
                        Terms &amp; Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="underline underline-offset-4">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <p className="mt-4 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
          Demonstration prototype: accounts are saved in this browser only and are not a secure,
          hosted login system. Please do not use a password you use anywhere else.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
