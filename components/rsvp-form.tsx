"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Check, Heart } from "lucide-react";
import { rsvpSchema, type RsvpResponse } from "@/lib/rsvp";
export function RsvpForm({ enabled = false }: { enabled?: boolean }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<RsvpResponse | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const pendingId = useRef<string | null>(null);
  const submitting = useRef(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [saved, setSaved] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview || submitting.current || saved) return;
    const data = new FormData(event.currentTarget);
    const parsed = rsvpSchema.safeParse({ name: data.get("name"), attendance: data.get("attendance"), message: data.get("message") });
    if (!parsed.success) { const nextErrors: Record<string, string> = {}; parsed.error.issues.forEach(issue => { nextErrors[String(issue.path[0])] = issue.message; }); setErrors(nextErrors); form.current?.querySelector<HTMLInputElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus(); return; }
    setErrors({});
    if (!enabled) { setPreview(parsed.data); return; }
    setSendError(""); submitting.current = true; setSending(true);
    pendingId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, submissionId: pendingId.current, website: data.get("website") ?? "" }),
        signal: AbortSignal.timeout(30000)
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || "We couldn't confirm your RSVP. Please try again.");
      setPreview(parsed.data); setSaved(true);
    } catch (error) {
      setSendError(error instanceof Error && error.name !== "TimeoutError" ? error.message : "We couldn't confirm your RSVP. Please retry with the same details.");
    } finally { submitting.current = false; setSending(false); }
  }
  return <div className="rsvp-form-wrap">{enabled ? <p className="preview-notice">Your name, attendance and message will be shared privately with the couple to manage wedding RSVPs.</p> : <p className="preview-notice"><span>RSVP preview</span> Online responses aren&apos;t open yet. This form lets you preview a reply; it won&apos;t send or save your details.</p>}
    <form ref={form} onSubmit={submit} noValidate onChange={() => { if (!saved) setPreview(null); }} aria-busy={sending}>
      <fieldset className="rsvp-fields" disabled={sending || saved}>
      <div hidden aria-hidden="true"><label htmlFor="rsvp-website">Website</label><input id="rsvp-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="form-field"><label htmlFor="guest-name">Your full name <span>(required)</span></label><input id="guest-name" name="name" autoComplete="name" placeholder="First and last name" maxLength={100} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <p id="name-error" className="form-error">{errors.name}</p>}</div>
      <fieldset className="form-field"><legend>Will you be joining us? <span>(required)</span></legend><div className="attendance-options"><label><input type="radio" name="attendance" value="accept" required aria-describedby={errors.attendance ? "attendance-error" : undefined} /><span><Heart size={17} />Accepts with pleasure</span></label><label><input type="radio" name="attendance" value="decline" aria-describedby={errors.attendance ? "attendance-error" : undefined} /><span>Regretfully declines</span></label></div>{errors.attendance && <p className="form-error" id="attendance-error">{errors.attendance}</p>}</fieldset>
      <div className="form-field"><label htmlFor="guest-count">Number of attendees</label><input id="guest-count" disabled placeholder="To be confirmed with your invitation" aria-describedby="guest-count-help" /><p className="field-help" id="guest-count-help">Your invitation will confirm the number of seats reserved for you.</p></div>
      <div className="form-field"><label htmlFor="guest-message">A little note for us <span>(optional)</span></label><textarea id="guest-message" name="message" rows={3} maxLength={1000} placeholder="We would love to hear from you." aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />{errors.message && <p className="form-error" id="message-error">{errors.message}</p>}</div>
      </fieldset>
      <button type="submit" className="button primary w-full" disabled={!!preview || sending || saved}>{sending ? "Sending your RSVP…" : saved ? "RSVP received" : enabled ? "Send RSVP" : preview ? "Response previewed" : "Preview response"}{preview ? <Check size={17} /> : <ArrowUpRight size={17} />}</button>
      {sendError && <p className="form-error" role="alert">{sendError}</p>}
      {preview && <div className="preview-result" role="status"><strong>Thank you, {preview.name}.</strong><p>You selected: {preview.attendance === "accept" ? "Accepts with pleasure" : "Regretfully declines"}.</p><p>{saved ? "Your RSVP has been received. Please contact the couple if you need to change your response." : "This is a preview only. Your RSVP has not been sent. Please contact the couple to confirm your attendance."}</p></div>}
    </form>
  </div>;
}
