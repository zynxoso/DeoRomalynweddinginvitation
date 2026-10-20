import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
await mkdir(path.join(root, 'public/images'), { recursive: true });
await mkdir(path.join(root, 'public/images/high-resolution'), { recursive: true });
await mkdir(path.join(root, 'public/decorations'), { recursive: true });
await mkdir(path.join(root, '.review'), { recursive: true });
const selection = [
  ['CAMP JOHN HAY - WHITE/IMG_3909.jpg', 'hero'],
  ['BOTANICAL - PINK/IMG_3747-2.jpg', 'garden-walk'],
  ['CAMP JOHN HAY - WHITE/IMG_3906.jpg', 'laughter'],
  ['BOTANICAL - PINK/IMG_3789.jpg', 'pink-portrait'],
  ['CAMP JOHN HAY - BROWN/IMG_4054.jpg', 'forest'],
  ['CAMP JOHN HAY - BLUE/IMG_4127.jpg', 'blue'],
  ['CAMP JOHN HAY - WHITE/IMG_4011-2.jpg', 'together'],
  ['CAMP JOHN HAY - WHITE/IMG_3929.jpg', 'forest-wedding'],
  ['CAMP JOHN HAY - WHITE/IMG_3956.jpg', 'ring-detail'],
  ['CAMP JOHN HAY - WHITE/IMG_3970.jpg', 'veil'],
  ['BOTANICAL - PINK/IMG_3736.jpg', 'bamboo-walk'],
  ['BOTANICAL - PINK/IMG_3660.jpg', 'flower-garden'],
  ['CAMP JOHN HAY - BROWN/IMG_4094.jpg', 'forest-embrace'],
  ['CAMP JOHN HAY - BLUE/IMG_4105.jpg', 'blue-handkiss']
];
const report = [];
for (const [source, name] of selection) {
  const output = path.join(root, `public/images/high-resolution/${name}.webp`);
  // Preserve the original pixel dimensions. Next.js generates smaller delivery
  // sizes for the page; the photo viewer loads this full-resolution file.
  const info = await sharp(path.join(root, 'WEDDING PICTURES', source)).rotate().webp({ quality: 96, effort: 4 }).toFile(output);
  report.push({ source, output: `/images/high-resolution/${name}.webp`, width: info.width, height: info.height, bytes: info.size });
  console.log(`${name}: ${info.width} x ${info.height}, ${(info.size / 1024 / 1024).toFixed(2)} MB`);
}
const botanical = process.argv[2];
if (botanical) await sharp(botanical).resize({ width: 680 }).webp({ quality: 82 }).toFile(path.join(root, 'public/decorations/botanical.webp'));
const photo = await sharp(path.join(root, 'public/images/high-resolution/hero.webp')).resize(520, 630, { fit: 'cover', position: 'center' }).toBuffer();
const title = Buffer.from(`<svg width="1200" height="630"><rect width="1200" height="630" fill="#fff9f2"/><rect x="30" y="30" width="610" height="570" fill="none" stroke="#a8bba3"/><text x="335" y="170" text-anchor="middle" font-family="Georgia" font-size="18" letter-spacing="4" fill="#65745b">YOU'RE INVITED</text><text x="335" y="290" text-anchor="middle" font-family="Georgia" font-size="70" fill="#35483c">Deo &amp;</text><text x="335" y="375" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="80" fill="#35483c">Romalyn</text><text x="335" y="465" text-anchor="middle" font-family="Georgia" font-size="25" fill="#65745b">December 23, 2026</text><text x="335" y="510" text-anchor="middle" font-family="Georgia" font-size="18" fill="#65745b">Luntian Garden</text></svg>`);
await sharp(title).composite([{ input: photo, left: 680, top: 0 }]).jpeg({ quality: 88 }).toFile(path.join(root, 'public/images/share.jpg'));
await writeFile(path.join(root, '.review/photo-selection.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
