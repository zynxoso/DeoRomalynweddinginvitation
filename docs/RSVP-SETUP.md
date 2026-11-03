# Google Sheets RSVP

The RSVP uses Google Sheets and Google Apps Script under the owner's Google account. No billing account, paid API, Supabase or email subscription is required. Google service quotas still apply. The website hosting setup remains separate.

## Owner configuration

The private spreadsheet has an `RSVP` tab with these columns, in order:

`Submission ID`, `Received at (Manila)`, `Full name`, `Attendance`, `Message`, `Notification status`, `Notification sent at (Manila)`.

Keep these headers and the tab name unchanged. Use filter views when reviewing responses. Do not sort or delete rows while submissions or notification retries are running. This is a response log, not a verified invitation list; typed names do not establish identity. No guest email is collected, and attendee counts stay disabled until seat allowances are supplied.

The Apps Script source is `integrations/google-apps-script/Code.gs`. Set `SHEET_ID` and `NOTIFY_EMAIL` for the owner. Run `setup` once in Apps Script and authorize the requested spreadsheet, send-mail and trigger permissions. It creates a server secret in Script Properties and one hourly notification retry trigger. It does not read the Gmail inbox or send a setup message.

Deploy as a web app, executing as the owner, accessible to Anyone. The script requires the server secret for every request and exposes no guest-list read endpoint. Keep the spreadsheet sharing restricted to the owner. When changing the script, update the deployed version; saving the editor alone does not update the public endpoint.

## Website environment

Set these server-only variables in `.env.local` for local use and in the hosting project's environment for deployment:

- `RSVP_SCRIPT_URL`: the deployed Apps Script URL ending in `/exec`.
- `RSVP_SCRIPT_SECRET`: the `RSVP_SECRET` value from Script Properties.
- `RSVP_ENABLED`: keep `false` until the authenticated health check and a real save/email verification pass; then set `true` and restart the server.
- `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000` locally; replace with the final HTTPS site origin when publishing. The form's browser origin must match this value.

Never commit `.env.local` or expose the script secret in client code. Preview mode remains available when configuration is absent. The homepage reads the enabled flag at request time.

## Delivery behavior

The server validates the origin, request size, names and attendance before forwarding to Apps Script. A honeypot rejects simple automated form filling. Script Properties enforce 15 new submissions per rate bucket per 10 minutes across executions. On Vercel, the bucket uses an HMAC of the platform's `x-real-ip`; outside Vercel all clients share one bucket until a trusted proxy is configured. Raw IP addresses are not stored. Expired buckets are pruned. This limits basic abuse; it is not identity verification or a CAPTCHA.

A script lock serializes writes. A random submission ID makes retries idempotent, including after an uncertain network result. Reusing an ID with different content returns a conflict rather than claiming the changes were saved. Reloading the page starts a new response, so the system does not merge people solely by matching names. Guest text is stored as text, including values starting with spreadsheet formula characters.

An RSVP is acknowledged only after its row is saved. Email is sent to the configured owner, and the row is marked `Sent`. If mail fails or its daily quota is exhausted, the row stays `Pending`; the hourly trigger retries up to 25 notifications per run. Google's consumer-account Apps Script quota currently allows 100 email recipients per day and may change. A rare interruption between sending mail and recording `Sent` can produce a repeated notification; the stable submission reference identifies the same RSVP.

Sources: [Apps Script web apps](https://developers.google.com/apps-script/guides/web), [service quotas](https://developers.google.com/apps-script/guides/services/quotas), [MailApp](https://developers.google.com/apps-script/reference/mail/mail-app).

## Checks

`npm test` covers validation, upstream failures, duplicate IDs, conflicts, formula escaping, notification retry, and rate limiting with isolated mocks. Live verification must separately confirm a row in the private Sheet and notification delivery. Test records must be clearly labeled so they are not counted as real guests.

On November 3, 2026, the deployed Apps Script passed its authenticated health check, saved one clearly labeled test response, and delivered its notification to the owner. Repeated submissions with the same ID kept one spreadsheet row. Drive permissions were verified as owner-only. The local website is configured for live RSVP; the public website still needs hosting and its own environment settings. The Sheet retains one `RSVP Integration Test - Not a Guest` record; exclude it from guest counts.
