import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
await mkdir(path.join(root, 'public/images'), { recursive: true });
await mkdir(path.join(root, 'public/decorations'), { recursive: true });
const selection = [
  ['CAMP JOHN HAY - WHITE/IMG_3909.jpg', 'hero', 1600],
  ['BOTANICAL - PINK/IMG_3747-2.jpg', 'garden-walk', 1400],
  ['CAMP JOHN HAY - WHITE/IMG_3906.jpg', 'laughter', 1400],
  ['BOTANICAL - PINK/IMG_3789.jpg', 'pink-portrait', 1200],
  ['CAMP JOHN HAY - BROWN/IMG_4054.jpg', 'forest', 1200],
  ['CAMP JOHN HAY - BLUE/IMG_4127.jpg', 'blue', 1200],
  ['CAMP JOHN HAY - WHITE/IMG_4011-2.jpg', 'together', 1600]
];
const report = [];
for (const [source, name, width] of selection) {
  const output = path.join(root, `public/images/${name}.webp`);
  const info = await sharp(path.join(root, 'WEDDING PICTURES', source)).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 83 }).toFile(output);
  report.push({ source, output: `/images/${name}.webp`, width: info.width, height: info.height, bytes: info.size });
}
const botanical = process.argv[2];
if (botanical) await sharp(botanical).resize({ width: 680 }).webp({ quality: 82 }).toFile(path.join(root, 'public/decorations/botanical.webp'));
const photo = await sharp(path.join(root, 'public/images/hero.webp')).resize(520, 630, { fit: 'cover', position: 'center' }).toBuffer();
const title = Buffer.from(`<svg width="1200" height="630"><rect width="1200" height="630" fill="#fff9f2"/><rect x="30" y="30" width="610" height="570" fill="none" stroke="#a8bba3"/><text x="335" y="170" text-anchor="middle" font-family="Georgia" font-size="18" letter-spacing="4" fill="#65745b">YOU'RE INVITED</text><text x="335" y="290" text-anchor="middle" font-family="Georgia" font-size="70" fill="#35483c">Deo &amp;</text><text x="335" y="375" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="80" fill="#35483c">Romalyn</text><text x="335" y="465" text-anchor="middle" font-family="Georgia" font-size="25" fill="#65745b">December 23, 2026</text><text x="335" y="510" text-anchor="middle" font-family="Georgia" font-size="18" fill="#65745b">Luntian Garden</text></svg>`);
await sharp(title).composite([{ input: photo, left: 680, top: 0 }]).jpeg({ quality: 88 }).toFile(path.join(root, 'public/images/share.jpg'));
await writeFile(path.join(root, '.review/photo-selection.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
