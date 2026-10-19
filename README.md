# Deo & Romalyn's wedding invitation

A local, responsive wedding invitation built with Next.js App Router, React, TypeScript, Tailwind CSS and Motion. The invitation opens with an animated envelope and includes a curated photo gallery, Philippine-time countdown, calendar download, venue details, dress palette and an explicitly labeled RSVP preview.

## Run locally

Use Node.js 22.18 or later (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). For the production version:

```sh
npm run build
npm start
```

## Edit wedding details

`config/wedding.ts` contains the names, date, timezone, venue names, event times, verified map links, invitation messages, selected photographs, dress palette and RSVP settings. Event times and maps remain `null` until confirmed. The calendar intentionally creates an all-day event. The countdown targets the start of December 23, 2026 in Asia/Manila, not an invented ceremony time.

Photographs are in `public/images`. Original full-resolution photos stay in `WEDDING PICTURES` and are excluded from Git and deployment. All 65 provided images were reviewed using the four contact sheets in `.review`. Seven photos were selected across the four shoots. The hero uses `IMG_3909.jpg`; the gallery includes `IMG_3747-2.jpg`, `IMG_3906.jpg`, `IMG_3789.jpg`, `IMG_4054.jpg` and `IMG_4127.jpg`; the closing uses `IMG_4011-2.jpg`. Resizing preserves orientation and natural colors; no faces were generated or retouched.

`scripts/prepare-assets.mjs` creates optimized WebP derivatives and the social sharing image from those originals. The generated botanical illustration lives in `public/decorations/botanical.webp`; see `docs/ASSETS.md` for its source and prompt. Typography is bundled locally with `next/font/local`, so guests do not need to connect to Google Fonts.

## RSVP status

The RSVP is a preview. It validates names and attendance, previews a response, and prevents repeat preview submissions until the guest edits the form. It sends no requests and stores no guest information in a browser or database. The attendee count remains unavailable because invitation allowances have not been supplied. `POST /api/rsvp` always returns HTTP 503 with an explicit not-sent message.

To accept real RSVPs, implement persistent storage before changing the interface:

1. Create private invitation records in a hosted database such as Supabase. Use opaque invitation tokens and a server-owned maximum guest count for each invitation.
2. Validate request bodies on the server, reusing and extending `lib/rsvp.ts`. Derive invitation limits from the database; do not trust a count or identity sent by the browser.
3. Add durable duplicate handling using a unique invitation key and a transactional upsert, distributed rate limiting, request size limits, same-origin checks and spam protection.
4. Keep database credentials in server environment variables. Deny anonymous reads and writes to guest tables. Avoid logging names, notes or tokens.
5. Connect the form to the route handler with loading, failure and success states. Report success only after the database confirms a save. Require explicit configuration and a health check before enabling live mode.
6. Test accepted and declined responses, seat limits, duplicate submissions, invalid tokens, database failures and rate limits before removing the preview notice.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

With the production server running and Google Chrome installed, run `node scripts/check-browser.mjs`. It checks desktop and mobile layouts, opening and replaying the envelope, reduced motion, gallery keyboard navigation, RSVP validation, duplicate preview protection, calendar dates, the disabled RSVP API and automated accessibility. Screenshots and the result JSON go into `.review`, which is excluded from Git.

## Repository and deployment

The source repository is [zynxoso/DeoRomalynweddinginvitation](https://github.com/zynxoso/DeoRomalynweddinginvitation). Vercel deployment has not been configured.

To publish the website, import the repository into Vercel as a Next.js project. Use `npm run build` and the default output directory. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin and redeploy to update social image URLs. A custom domain can be attached through Vercel's project settings. `.env.example` lists the current environment setting. No secrets are required for preview mode.

The invitation uses `noindex` because it contains personal photos and event details. This is a search-engine preference, not access control. The social sharing preview still works when the link is shared. There are no analytics, audio autoplay, remote stock photos or invented venue map links.

## Dependency audit

The production dependency audit reported zero known vulnerabilities during implementation. The development lint dependency tree reports an upstream `braces` advisory through Next.js's ESLint plugin. Do not apply npm's proposed major downgrade of the Next.js lint configuration. Review the upstream fix before updating that chain; these development tools are not included in the guest-facing runtime.
