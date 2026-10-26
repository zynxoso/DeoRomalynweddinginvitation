import { chromium } from '@playwright/test';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('.review', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
try {
  for (const [width, height] of [[1440, 800], [768, 1024], [390, 844], [320, 740]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'View invitation', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await page.waitForTimeout(1800);
    const hero = await page.locator('.hero-backdrop img').evaluate(img => ({
      src: img.currentSrc,
      width: img.clientWidth,
      height: img.clientHeight
    }));
    const response = await page.request.get(hero.src);
    assert.equal(response.ok(), true);
    const image = await sharp(await response.body()).metadata();
    const requiredWidth = Math.ceil(Math.max(hero.width, hero.height * image.width / image.height) * 2);
    assert.ok(image.width >= requiredWidth - 2, `Hero undersampled at ${width}px: ${image.width} < ${requiredWidth}`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `.review/photo-hero-${width}-${height}.png` });

    const photos = page.locator('.gallery-item button');
    assert.equal(await photos.count(), 15);
    for (let i = 0; i < await photos.count(); i++) {
      await photos.nth(i).scrollIntoViewIfNeeded();
      await photos.nth(i).locator('img').evaluate(img => img.decode());
    }
    await photos.last().click();
    await page.locator('.lightbox-image img').evaluate(img => img.decode());
    const enlarged = await page.locator('.lightbox-image img').evaluate(img => ({
      width: img.naturalWidth, height: img.naturalHeight, src: img.currentSrc
    }));
    assert.equal(enlarged.width, 3072);
    assert.equal(enlarged.height, 4608);
    assert.equal(await page.getByRole('link', { name: 'View full-resolution photo' }).getAttribute('href'), '/images/high-resolution/pine-bench.webp');
    report.push({ viewport: { width, height }, deviceScaleFactor: 2, deliveredHero: { width: image.width, height: image.height }, requiredHeroWidth: requiredWidth, galleryPhotos: 15, enlarged });
    await page.keyboard.press('Escape');
    if (width === 1440) await page.locator('#our-moments').screenshot({ path: '.review/expanded-gallery.png' });
    await page.locator('.swatches').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const swatches = await page.locator('.swatches > div').evaluateAll(items => items.map(item => {
      const circle = item.querySelector('span').getBoundingClientRect();
      return { x: circle.x, y: circle.y, width: circle.width, height: circle.height, label: item.textContent };
    }));
    assert.deepEqual(swatches.map(s => s.label), ['Blush pink', 'Soft peach', 'Butter yellow', 'Lavender', 'Sky blue', 'Mint cream']);
    for (let i = 0; i < 3; i++) {
      assert.ok(Math.abs(swatches[i].x - swatches[i + 3].x) < 1, 'Palette columns must align');
      assert.ok(Math.abs(swatches[i].y - swatches[0].y) < 1, 'Top palette row must align');
      assert.ok(Math.abs(swatches[i + 3].y - swatches[3].y) < 1, 'Bottom palette row must align');
    }
    for (const swatch of swatches) {
      assert.ok(Math.abs(swatch.width - swatches[0].width) < 1, 'Swatches must have equal sizes');
      assert.ok(Math.abs(swatch.width - swatch.height) < 1, 'Swatches must remain circular');
    }
    assert.ok(swatches[3].y > swatches[0].y);
    await page.locator('.dress-copy').screenshot({ path: `.review/palette-${width}.png` });
    await context.close();
  }
  await writeFile('.review/photo-quality-results.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
