import { createHmac } from "node:crypto";
import { z } from "zod";
import { rsvpSchema } from "./rsvp.ts";

export const submissionSchema = rsvpSchema.extend({
  submissionId: z.uuid(),
  website: z.string().max(0).optional()
});

export function rsvpConfigured() {
  return process.env.RSVP_ENABLED === "true" &&
    /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(process.env.RSVP_SCRIPT_URL ?? "") &&
    (process.env.RSVP_SCRIPT_SECRET?.length ?? 0) >= 32;
}

const reply = (status: number, body: Record<string, unknown>) => Response.json(body, {
  status, headers: { "Cache-Control": "no-store" }
});

export async function handleRsvp(request: Request, send: typeof fetch = fetch) {
  if (!rsvpConfigured()) return reply(503, { error: "Online RSVP is not open yet. Please contact the couple directly." });
  const expectedOrigin = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : new URL(request.url).origin;
  if (request.headers.get("origin") !== expectedOrigin || request.headers.get("sec-fetch-site") === "cross-site") {
    return reply(403, { error: "Please submit your RSVP from the invitation website." });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply(415, { error: "Please use the invitation form." });
  const reader = request.body?.getReader();
  if (!reader) return reply(400, { error: "Please complete the form." });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); return reply(413, { error: "Your response is too long." }); }
      chunks.push(value);
    }
  } catch { return reply(400, { error: "We couldn't read your response. Please try again." }); }
  let input: unknown;
  try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { return reply(400, { error: "Please complete the form and try again." }); }
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return reply(400, { error: "Please check your name, attendance and message." });
  const secret = process.env.RSVP_SCRIPT_SECRET!;
  // Vercel supplies x-real-ip. Other hosts share one conservative rate bucket
  // until their trusted proxy headers are configured; never store raw IPs.
  const address = process.env.VERCEL ? request.headers.get("x-real-ip") ?? "unknown" : "local";
  const clientKey = createHmac("sha256", secret).update(address).digest("hex");
  try {
    const response = await send(process.env.RSVP_SCRIPT_URL!, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, secret, clientKey }),
      redirect: "follow", cache: "no-store", signal: AbortSignal.timeout(25000)
    });
    if (!response.ok) throw new Error("storage unavailable");
    const result = await response.json();
    if (result.ok === true && result.submissionId === parsed.data.submissionId) return reply(200, { ok: true });
    if (result.code === "rate_limit") return reply(429, { error: "Too many responses just now. Please try again in 10 minutes." });
    if (result.code === "conflict") return reply(409, { error: "This submission was already received with different details. Please contact the couple to update it." });
    throw new Error("save not confirmed");
  } catch {
    return reply(503, { error: "We couldn't confirm your RSVP. Please retry with the same details, or contact the couple directly." });
  }
}
