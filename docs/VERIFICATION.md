# Verification

- Production build: passed (Next.js 16.4.2).
- TypeScript: passed.
- ESLint: passed without warnings.
- Logic checks: 4 passed, covering Philippine midnight, RSVP validation, server delivery and Apps Script persistence/notification behavior.
- Browser checks: passed in Chrome at 320, 390, 768 and 1440 CSS pixels.
- November 3 entourage update: production build and lint passed. The section passed keyboard-navigation, sponsor-name and pairing, reduced-motion, name-overflow and axe checks at 320, 390, 768, 1024 and 1440 pixels, with no runtime errors. All 70 role/name entries across 16 groups were present, including 28 principal sponsors and nine flower girls. Desktop and phone screenshots were reviewed.
- October 26 photo update: all 15 gallery images loaded at each tested viewport. Separate 2× display checks confirmed that the replacement hero meets the pixel resolution needed for its visible crops: 3,840 pixels delivered on desktop, 2,560 on tablet, and 1,600 / 1,200 on the tested phones.
- The enlarged final gallery photo retained its supplied 3,072 × 4,608 dimensions, and the full-resolution link points directly to that file. Replacement-photo contact sheets, desktop gallery, and desktop/phone hero screenshots were visually reviewed.
- The six reference colors passed three-column/two-row alignment checks at 320, 390, 768 and 1440 pixels. Both rows align, circles have equal dimensions, and screenshots confirm the centered phone layout. Full browser regression checks again reported zero runtime errors and zero axe violations.
- Checked entrance opening and replay, menu navigation, gallery arrow/Escape controls, reduced motion, RSVP validation and repeat-preview prevention.
- Calendar: December 23, 2026 all-day event, exclusive end date December 24.
- November 3 RSVP integration: production build, TypeScript, lint and four tests passed. The configured API saved a clearly labeled test response to the private Google Sheet; its notification arrived in the owner's Gmail inbox. Duplicate retries returned success with one saved row. Authenticated health check confirmed the notification retry trigger exists. The local HTTP endpoint passed after setting its explicit localhost origin.
- RSVP browser checks at 390 and 1440 pixels passed validation, failure/retry, stable submission IDs, success state, overflow and axe checks. Screenshots were reviewed. These UI checks intercept submissions; the storage/email test above used the real deployed endpoint.
- A separate real browser submission passed through the local HTTP route to Google and displayed the received state. It reused the existing test ID and did not create another row.
- Unconfigured RSVP remains in preview mode; its API returns 503 without claiming a save.
- Runtime errors: none in the tested journeys.
- axe WCAG A/AA: zero violations on the entrance and main page.
- Earlier mobile Lighthouse baseline, before the full-resolution photo update: performance 85, best practices 100, CLS 0. The baseline accessibility score was 95 before the seal contrast was corrected; the subsequent axe check passes. SEO was 60 with intentional noindex and a modal invitation entrance. These local lab results are not a deployed-site measurement, and performance has not been remeasured for the larger photographs.
- Production dependency audit: zero known vulnerabilities. The documented upstream development lint dependency advisory remains.

Detailed screenshots and machine-readable reports are in .review. These checks ran locally; no Vercel deployment was performed.
