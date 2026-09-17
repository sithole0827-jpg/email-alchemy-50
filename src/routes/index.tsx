import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Check, Copy, Loader2, Mail, RefreshCw, Sparkle, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { generateEmail } from "@/lib/email.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Write Professional Emails Fast" },
      {
        name: "description",
        content:
          "Turn rough notes into polished emails. Pick a formal, friendly or persuasive tone, then improve, shorten or copy in one click.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content:
          "Turn rough notes into polished, professional emails with a formal, friendly or persuasive tone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tone = "formal" | "friendly" | "persuasive";
type Action =
  | "generate"
  | "improve"
  | "shorter"
  | "more_professional"
  | "change_tone"
  | "regenerate";

const tones: { value: Tone; label: string; blurb: string }[] = [
  { value: "formal", label: "Formal", blurb: "Official and respectful" },
  { value: "friendly", label: "Friendly", blurb: "Warm but professional" },
  { value: "persuasive", label: "Persuasive", blurb: "Confident and convincing" },
];

function Index() {
  const run = useServerFn(generateEmail);

  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [senderName, setSenderName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<Action | null>(null);
  const [copied, setCopied] = useState(false);

  async function handle(action: Action) {
    if (!message.trim()) {
      toast.error("Tell me what you want to say first.");
      return;
    }
    setBusy(action);
    try {
      const result = await run({
        data: {
          message,
          tone,
          recipient,
          purpose,
          senderName,
          action,
          previousEmail: action === "generate" ? "" : email,
        },
      });
      setEmail(result.email);
      setCopied(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Email copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  }

  const disabled = busy !== null;

  return (
    <main className="min-h-screen bg-background">
      <Toaster />
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
        <header className="mb-8 flex items-start gap-3">
          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Smart Email Generator
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Rough notes in, a polished email out — in your chosen tone.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="message">What do you want to say?</Label>
                <Textarea
                  id="message"
                  value={message}
                  maxLength={4000}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. ask my manager for leave on the 12th, I'll hand over my tasks to Sipho"
                  className="min-h-36 resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {tones.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTone(t.value)}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-left transition-colors",
                        tone === t.value
                          ? "border-primary bg-accent text-accent-foreground"
                          : "bg-background hover:bg-muted",
                      )}
                    >
                      <span className="block text-sm font-medium">{t.label}</span>
                      <span className="block text-xs text-muted-foreground">{t.blurb}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient name or organisation</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  maxLength={200}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Mrs Dlamini / Absa HR"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender">Your name</Label>
                <Input
                  id="sender"
                  value={senderName}
                  maxLength={120}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Thabiso Sithole"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">What is this email about?</Label>
                <Textarea
                  id="about"
                  value={purpose}
                  maxLength={1000}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Requesting a meeting to discuss month-end reports"
                  className="min-h-24 resize-y"
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={disabled}
                onClick={() => handle("generate")}
              >
                {busy === "generate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkle className="h-4 w-4" />
                )}
                Generate email
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Your email</h2>
              <Button variant="outline" size="sm" onClick={copy} disabled={!email}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            {email ? (
              <Textarea
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-80 resize-y whitespace-pre-wrap font-medium leading-relaxed"
              />
            ) : (
              <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed px-6 text-center text-sm text-muted-foreground">
                {busy ? "Writing your email…" : "Your generated email will appear here."}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {(
                [
                  ["improve", "Improve", Wand2],
                  ["shorter", "Make shorter", Wand2],
                  ["more_professional", "More professional", Wand2],
                  ["change_tone", "Apply tone", Wand2],
                  ["regenerate", "Regenerate", RefreshCw],
                ] as const
              ).map(([action, label, Icon]) => (
                <Button
                  key={action}
                  variant="secondary"
                  size="sm"
                  disabled={!email || disabled}
                  onClick={() => handle(action)}
                >
                  {busy === action ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  {label}
                </Button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Anything in [brackets] is a placeholder — replace it with your real details before
              sending.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
