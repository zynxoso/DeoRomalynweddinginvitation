# Verification

- Production build: passed (Next.js 16.4.2).
- TypeScript: passed.
- ESLint: passed without warnings.
- Logic checks: 4 passed, covering Philippine midnight, RSVP validation, server delivery and Apps Script persistence/notification behavior.
- Browser checks: passed in Chrome at 320, 390, 768 and 1440 CSS pixels.
- November 3 entourage update: production build and lint passed. The section passed keyboard-navigation, sponsor-name and pairing, reduced-motion, name-overflow and axe checks at 320, 390, 768, 1024 and 1440 pixels, with no runtime errors. All 70 role/name entries across 16 groups were present, including 28 principal sponsors and nine flower girls. Desktop and phone screenshots were reviewed.
- October 26 photo update: all 15 gallery images loaded at each tested viewport. Separate 2× display checks confirmed that the replacement hero meets the pixel resolution needed for its visible crops: 3,840 pixels delivered on desktop, 2,560 on tablet, and 1,600 / 1,200 on the tested phones.
- November 4 gallery replacement: all 24 supplied photos are present exactly once, replacing the previous gallery selection. Quality-96 WebP derivatives retain the source dimensions; source originals remain untouched. Build and lint passed. All 24 images loaded at 320, 390, 768 and 1440 pixels with 2× display density. The viewer preserved the final image's 4,608 × 3,072 resolution, and next/previous wraparound and Escape passed. Source contact sheets and desktop/phone gallery screenshots were reviewed; the final desktop row is centered.
- The enlarged final gallery photo retained its supplied 3,072 × 4,608 dimensions, and the full-resolution link points directly to that file. Replacement-photo contact sheets, desktop gallery, and desktop/phone hero screenshots were visually reviewed.
- The six reference colors passed three-column/two-row alignment checks at 320, 390, 768 and 1440 pixels. Both rows align, circles have equal dimensions, and screenshots confirm the centered phone layout. Full browser regression checks again reported zero runtime errors and zero axe violations.
- Checked entrance opening and replay, menu navigation, gallery arrow/Escape controls, reduced motion, RSVP validation and repeat-preview prevention.
- November 3 envelope animation fix: production build and lint passed. Frame sampling at 320×568, 390×844, 768×1024, 1440×900 and 844×390 confirmed the letter stays clear of the heading, rises without reversing, and the envelope remains open through the exit fade. Replay, keyboard controls and reduced-motion dismissal passed; entrance axe checks reported zero violations. Phone and desktop open-state screenshots were reviewed.
- November 4 envelope rendering fix: the front pocket and flap now use SVG panels, with a flat flap transform and explicit layers. Pixel checks confirm the letter remains visible through the open pocket at all five viewport sizes; timing checks ensure the flap opens before the letter rises. Build, lint, replay, keyboard, reduced-motion and entrance accessibility checks passed.
- Calendar: December 23, 2026 all-day event, exclusive end date December 24.
- November 4 reception map: production build and lint passed. The supplied Google Maps embed loaded with the Luntiang Oasis Farm and Resort pin. The map panel and external directions link passed overflow and layout checks at 320, 390, 768 and 1440 pixels; phone and desktop screenshots were reviewed. Host-page accessibility checks passed, including the iframe title; Google's internal map controls were excluded from the audit.
- November 3 RSVP integration: production build, TypeScript, lint and four tests passed. The configured API saved a clearly labeled test response to the private Google Sheet; its notification arrived in the owner's Gmail inbox. Duplicate retries returned success with one saved row. Authenticated health check confirmed the notification retry trigger exists. The local HTTP endpoint passed after setting its explicit localhost origin.
- RSVP browser checks at 390 and 1440 pixels passed validation, failure/retry, stable submission IDs, success state, overflow and axe checks. Screenshots were reviewed. These UI checks intercept submissions; the storage/email test above used the real deployed endpoint.
- A separate real browser submission passed through the local HTTP route to Google and displayed the received state. It reused the existing test ID and did not create another row.
- Unconfigured RSVP remains in preview mode; its API returns 503 without claiming a save.
- Runtime errors: none in the tested journeys.
- axe WCAG A/AA: zero violations on the entrance and main page.
- Earlier mobile Lighthouse baseline, before the full-resolution photo update: performance 85, best practices 100, CLS 0. The baseline accessibility score was 95 before the seal contrast was corrected; the subsequent axe check passes. SEO was 60 with intentional noindex and a modal invitation entrance. These local lab results are not a deployed-site measurement, and performance has not been remeasured for the larger photographs.
- Production dependency audit: zero known vulnerabilities. The documented upstream development lint dependency advisory remains.

Detailed screenshots and machine-readable reports are in .review. These checks ran locally; no Vercel deployment was performed.
