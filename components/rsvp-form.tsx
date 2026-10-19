"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Check, Heart } from "lucide-react";
import { rsvpSchema, type RsvpResponse } from "@/lib/rsvp";
export function RsvpForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<RsvpResponse | null>(null);
  const form = useRef<HTMLFormElement>(null);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview) return;
    const data = new FormData(event.currentTarget);
    const parsed = rsvpSchema.safeParse({ name: data.get("name"), attendance: data.get("attendance"), message: data.get("message") });
    if (!parsed.success) { const nextErrors: Record<string, string> = {}; parsed.error.issues.forEach(issue => { nextErrors[String(issue.path[0])] = issue.message; }); setErrors(nextErrors); form.current?.querySelector<HTMLInputElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus(); return; }
    setErrors({}); setPreview(parsed.data);
  }
  return <div className="rsvp-form-wrap"><p className="preview-notice"><span>RSVP preview</span> Online responses aren&apos;t open yet. This form lets you preview a reply; it won&apos;t send or save your details.</p>
    <form ref={form} onSubmit={submit} noValidate onChange={() => { setPreview(null); }}>
      <div className="form-field"><label htmlFor="guest-name">Your full name <span>(required)</span></label><input id="guest-name" name="name" autoComplete="name" placeholder="First and last name" maxLength={100} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <p id="name-error" className="form-error">{errors.name}</p>}</div>
      <fieldset className="form-field"><legend>Will you be joining us? <span>(required)</span></legend><div className="attendance-options"><label><input type="radio" name="attendance" value="accept" required aria-describedby={errors.attendance ? "attendance-error" : undefined} /><span><Heart size={17} />Accepts with pleasure</span></label><label><input type="radio" name="attendance" value="decline" aria-describedby={errors.attendance ? "attendance-error" : undefined} /><span>Regretfully declines</span></label></div>{errors.attendance && <p className="form-error" id="attendance-error">{errors.attendance}</p>}</fieldset>
      <div className="form-field"><label htmlFor="guest-count">Number of attendees</label><input id="guest-count" disabled placeholder="To be confirmed with your invitation" aria-describedby="guest-count-help" /><p className="field-help" id="guest-count-help">Your invitation will confirm the number of seats reserved for you.</p></div>
      <div className="form-field"><label htmlFor="guest-message">A little note for us <span>(optional)</span></label><textarea id="guest-message" name="message" rows={3} maxLength={1000} placeholder="We would love to hear from you." aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />{errors.message && <p className="form-error" id="message-error">{errors.message}</p>}</div>
      <button type="submit" className="button primary w-full" disabled={!!preview}>{preview ? "Response previewed" : "Preview response"}{preview ? <Check size={17} /> : <ArrowUpRight size={17} />}</button>
      {preview && <div className="preview-result" role="status"><strong>Thank you, {preview.name}.</strong><p>You selected: {preview.attendance === "accept" ? "Accepts with pleasure" : "Regretfully declines"}.</p><p>This is a preview only. Your RSVP has not been sent. Please contact the couple to confirm your attendance.</p></div>}
    </form>
  </div>;
}
