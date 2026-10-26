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

`config/entourage.ts` contains the confirmed entourage names and roles. The homepage shows this section between the venue details and dress code, with a direct `#entourage` menu link. Keep sponsor pairs together and retain people in every role they hold. Groomsmen and bridesmaids are separate lists, not procession pairings. Parent labels can be edited alongside their names. The section has no database or separate route.

Photographs are in `public/images`. Original sources stay in `WEDDING PICTURES` and `public/PICTURES TO BE REPLACED`, both excluded from Git and deployment. The latest selection follows the owner's ten filename labels and includes three additional poses chosen after reviewing all 40 replacement files. There are 15 gallery photographs, plus the homepage and closing photos. The homepage uses `HOME PAGE BG.jpg` at its supplied 4,608 × 3,072 resolution. Desktop, phone and portrait tablet layouts use separate framing to keep both people visible. The complete source mapping is in `scripts/prepare-assets.mjs`, which preserves source dimensions in quality-96 WebP files. The labeled CR2 uses its embedded full-size 6,000 × 4,000 camera JPEG; it is not a new RAW development. Responsive page images use quality 95, and the viewer loads full-resolution files. No additional facial retouching or generative changes are applied to the supplied images.

The dress palette follows the owner's six-color reference: blush pink, soft peach, butter yellow, lavender, sky blue and mint cream. The swatches use a balanced three-column, two-row grid on desktop and mobile. Their hex values are editable in `config/wedding.ts`.

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

Run `node scripts/check-photos.mjs` to check image delivery at 2× pixel density on desktop, tablet and phone layouts. It verifies crop resolution, all 15 gallery images, full-resolution viewer dimensions, horizontal overflow, and the six swatches' row alignment and equal circle sizes.

Run `node scripts/check-entourage.mjs` to verify the section and keyboard navigation at 320, 390, 768, 1024 and 1440 pixels, including sponsor pairs, name wrapping, reduced motion and accessibility.

## Repository and deployment

The source repository is [zynxoso/DeoRomalynweddinginvitation](https://github.com/zynxoso/DeoRomalynweddinginvitation). Vercel deployment has not been configured.

To publish the website, import the repository into Vercel as a Next.js project. Use `npm run build` and the default output directory. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin and redeploy to update social image URLs. A custom domain can be attached through Vercel's project settings. `.env.example` lists the current environment setting. No secrets are required for preview mode.

The invitation uses `noindex` because it contains personal photos and event details. This is a search-engine preference, not access control. The social sharing preview still works when the link is shared. There are no analytics, audio autoplay, remote stock photos or invented venue map links.

## Dependency audit

The production dependency audit reported zero known vulnerabilities during implementation. The development lint dependency tree reports an upstream `braces` advisory through Next.js's ESLint plugin. Do not apply npm's proposed major downgrade of the Next.js lint configuration. Review the upstream fix before updating that chain; these development tools are not included in the guest-facing runtime.
