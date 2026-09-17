import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ToneEnum = z.enum(["formal", "friendly", "persuasive"]);

const GenerateInput = z.object({
  message: z.string().trim().min(1).max(4000),
  tone: ToneEnum,
  recipient: z.string().trim().max(200).default(""),
  purpose: z.string().trim().max(1000).default(""),
  senderName: z.string().trim().max(120).default(""),
  action: z
    .enum(["generate", "improve", "shorter", "more_professional", "change_tone", "regenerate"])
    .default("generate"),
  previousEmail: z.string().trim().max(8000).default(""),
});

const toneGuide: Record<z.infer<typeof ToneEnum>, string> = {
  formal:
    "Formal: professional, respectful, suited to companies, managers, government departments and schools.",
  friendly: "Friendly: warm, polite, natural and approachable, while still professional.",
  persuasive:
    "Persuasive: confident and convincing, focused on encouraging the recipient to take a clear action.",
};

const actionGuide: Record<string, string> = {
  generate: "Write the email.",
  regenerate: "Write a fresh alternative version of the email below, same meaning, new wording.",
  improve: "Improve the clarity, grammar and flow of the email below without changing its meaning.",
  shorter: "Rewrite the email below to be noticeably shorter while keeping every key point.",
  more_professional: "Rewrite the email below to sound more polished and professional.",
  change_tone: "Rewrite the email below in the newly selected tone.",
};

const SYSTEM = `You are a Smart Email Generator. You turn rough notes into complete, professional emails.

Rules:
- Never change the user's intended meaning.
- Never invent personal information, qualifications, dates, prices, attachments or promises.
- If essential information is missing, use a neutral placeholder in square brackets, e.g. [Position Title].
- Professional formatting, concise, no repetition or filler.
- Job applications: clear subject line naming the position.
- Follow-ups: polite, never demanding. Complaints: respectful, factual, solution-focused.

Reply with the email only, in exactly this format and nothing else:

Subject: <professional subject line>

Dear <recipient>,

<email body>

Kind regards,
<sender name or [Your Name]>`;

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this app.");

    const parts = [
      actionGuide[data.action],
      `Tone — ${toneGuide[data.tone]}`,
      data.recipient ? `Recipient: ${data.recipient}` : "Recipient: unknown, use [Recipient Name]",
      data.purpose ? `Purpose: ${data.purpose}` : "",
      data.senderName ? `Sender name: ${data.senderName}` : "Sender name: unknown, use [Your Name]",
      `What the user wants to say:\n${data.message}`,
      data.previousEmail && data.action !== "generate"
        ? `Existing email to work from:\n${data.previousEmail}`
        : "",
    ].filter(Boolean);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: SYSTEM,
        input: parts.join("\n\n"),
        stream: true,
        store: false,
        reasoning: { effort: "low" },
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      if (res.status === 429)
        throw new Error("Too many requests right now — please try again in a moment.");
      if (res.status === 402)
        throw new Error("AI credits are used up. Add credits in Lovable to keep generating.");
      throw new Error(detail || `Email generation failed (${res.status}).`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload);
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            text += evt.delta;
          } else if (evt.type === "response.completed" && !text) {
            text = evt.response?.output_text ?? "";
          }
        } catch {
          /* ignore partial frames */
        }
      }
    }

    if (!text.trim()) throw new Error("The model returned an empty email. Please try again.");
    return { email: text.trim() };
  });
