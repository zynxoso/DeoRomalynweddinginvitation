import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

// UI checks intercept submissions: no test guest data is sent to Google.
await mkdir('.review', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(process.env.RSVP_TEST_URL ?? 'http://localhost:3000');
  await page.getByRole('button', { name: 'View invitation', exact: true }).click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.locator('#rsvp').scrollIntoViewIfNeeded();
  const submit = page.getByRole('button', { name: 'Send RSVP', exact: true });
  assert.equal(await submit.isVisible(), true, 'Run with configured RSVP enabled');
  await submit.click();
  await page.getByText('Please enter your full name.', { exact: true }).waitFor();
  await page.getByLabel('Your full name').fill('Browser Test Guest');
  await page.getByLabel('Regretfully declines').check();
  await page.getByLabel('A little note for us').fill('Mock UI test; never sent to Google.');
  const ids = [];
  await page.route('**/api/rsvp', async route => {
    ids.push(route.request().postDataJSON().submissionId);
    await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Temporary test failure. Please retry.' }) });
  });
  await submit.click();
  await page.locator('#rsvp').getByRole('alert').waitFor();
  assert.equal(await page.getByRole('status').count(), 0);
  assert.equal(await submit.isEnabled(), true);
  await page.unroute('**/api/rsvp');
  await page.route('**/api/rsvp', async route => {
    ids.push(route.request().postDataJSON().submissionId);
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await submit.click();
  await page.getByRole('status').waitFor();
  assert.equal(ids[0], ids[1], 'Retry must preserve the submission ID');
  assert.equal(await page.getByRole('button', { name: 'RSVP received' }).isDisabled(), true);
  assert.match(await page.getByRole('status').innerText(), /has been received/);
  const audit = await new AxeBuilder({ page }).include('#rsvp').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(audit.violations, []);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.locator('.rsvp-form-wrap').screenshot({ path: '.review/rsvp-success-mobile.png' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('.rsvp-form-wrap').screenshot({ path: '.review/rsvp-success-desktop.png' });
  console.log('RSVP validation, failure, retry ID, success, mobile layout and accessibility passed; requests mocked.');
} finally { await browser.close(); }
