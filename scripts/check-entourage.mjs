import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('.review', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
const errors = [];
try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: width === 1440 ? 'no-preference' : 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'View invitation', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    if (width <= 1050) {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Entourage', exact: true }).focus();
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('button', { name: 'Open menu' }).evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Enter');
    }
    const nav = page.getByRole('navigation', { name: width <= 1050 ? 'Mobile navigation' : 'Main navigation', exact: true });
    await nav.getByRole('link', { name: 'Entourage', exact: true }).focus();
    await page.keyboard.press('Enter');
    await page.waitForURL('**/#entourage');
    if (width <= 1050) assert.equal(await page.getByRole('button', { name: 'Open menu' }).isVisible(), true);
    await page.waitForTimeout(width === 1440 ? 1200 : 100);
    const section = page.locator('#entourage');
    assert.equal(await section.locator('.entourage-name').count(), 39);
    assert.equal(await section.getByRole('heading', { level: 3 }).count(), 14);
    assert.deepEqual(await section.evaluate(el => [el.previousElementSibling?.id, el.nextElementSibling?.id]), ['the-day', 'dress-code']);
    for (const [role, names] of [
      ['Candle Sponsors', ['Rosemarie Sabatin', 'Michael Santiago']],
      ['Veil Sponsors', ['Jhigie Magbalot', 'Jan Harry Madrona']],
      ['Cord Sponsors', ['Melody Grace Pacheco', 'Kevin Genzola']]
    ]) assert.deepEqual(await section.getByRole('region', { name: role, exact: true }).locator('.entourage-name').allTextContents(), names);
    for (const group of await section.locator('.entourage-group').all()) {
      await group.scrollIntoViewIfNeeded();
      await expect(group).toHaveCSS('opacity', '1');
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Page overflow at ${width}px`);
    const clippedNames = await section.locator('.entourage-name').evaluateAll(names => names.filter(el => el.scrollWidth > el.clientWidth + 1 || parseFloat(getComputedStyle(el).fontSize) < 22).map(el => el.textContent));
    assert.deepEqual(clippedNames, [], `Clipped or undersized names at ${width}px`);
    if (width <= 760) assert.equal(await section.locator('.entourage-two').first().evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 1);
    await section.screenshot({ path: `.review/entourage-${width}.png` });
    const audit = await new AxeBuilder({ page }).include('#entourage').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.equal(audit.violations.length, 0, JSON.stringify(audit.violations));
    results.push({ width, names: 39, roleGroups: 14, accessibilityViolations: 0, keyboardNavigation: 'passed', nameOverflow: false });
    await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile('.review/entourage-results.json', JSON.stringify({ results, errors }, null, 2));
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally { await browser.close(); }
