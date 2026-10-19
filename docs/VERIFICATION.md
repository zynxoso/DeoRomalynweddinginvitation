# Verification

- Production build: passed (Next.js 16.4.2).
- TypeScript: passed.
- ESLint: passed without warnings.
- Logic checks: 2 passed, covering Philippine midnight and RSVP validation.
- Browser checks: passed in Chrome at 320, 390, 768 and 1440 CSS pixels.
- Checked entrance opening and replay, menu navigation, gallery arrow/Escape controls, reduced motion, RSVP validation and repeat-preview prevention.
- Calendar: December 23, 2026 all-day event, exclusive end date December 24.
- RSVP API: returns 503 and never claims to store a response.
- Runtime errors: none in the tested journeys.
- axe WCAG A/AA: zero violations on the entrance and main page.
- Mobile Lighthouse baseline: performance 85, best practices 100, CLS 0. The baseline accessibility score was 95 before the seal contrast was corrected; the subsequent axe check passes. SEO was 60 with intentional noindex and a modal invitation entrance. These local lab results are not a deployed-site measurement.
- Production dependency audit: zero known vulnerabilities. The documented upstream development lint dependency advisory remains.

Detailed screenshots and machine-readable reports are in .review. These checks ran locally; no Vercel deployment was performed.
