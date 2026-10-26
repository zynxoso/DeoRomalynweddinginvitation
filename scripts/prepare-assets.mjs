import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
await mkdir(path.join(root, 'public/images'), { recursive: true });
await mkdir(path.join(root, 'public/images/high-resolution'), { recursive: true });
await mkdir(path.join(root, 'public/decorations'), { recursive: true });
await mkdir(path.join(root, '.review'), { recursive: true });
const selection = [
  ['It was always you.jpg', 'hero-v2'],
  ['Hand in hand..CR2', 'garden-walk-v2'],
  ['The little moments.jpg', 'laughter-v2'],
  ['Right here with you.jpg', 'pink-portrait-v2'],
  ['Our kind of afternoon.jpg', 'forest-v2'],
  ['A moment for us.jpg', 'blue-v2'],
  ['MEITU_20261025_085532158.jpg', 'together-v2'],
  ['HOME PAGE BG.jpg', 'forest-wedding-v2'],
  ['CAMP JOHN HAY - WHITE/IMG_3956.jpg', 'ring-detail', 'WEDDING PICTURES'],
  ['MEITU_20261025_073432262.jpg', 'veil-v2'],
  ['CLOSE TO YOU.jpg', 'pink-embrace-v2'],
  ['BOTANICAL - PINK/IMG_3683.jpg', 'pink-garden', 'WEDDING PICTURES'],
  ['MY FAVORITE PERSON.jpg', 'forest-embrace-v2'],
  ['WITH ALL MY LOVE.jpg', 'blue-handkiss-v2'],
  ['MEITU_20261020_135731873.jpg', 'bamboo-portrait'],
  ['MEITU_20261025_073307475.jpg', 'white-bouquet'],
  ['MEITU_20261025_084642306.jpg', 'pine-bench']
];

async function readPhoto(sourcePath) {
  const input = await readFile(sourcePath);
  if (!sourcePath.toLowerCase().endsWith('.cr2')) return input;
  // This Canon file includes a full-size camera JPEG in its first TIFF IFD.
  // Extract it losslessly rather than treating the RAW sensor data as an image.
  if (input.toString('ascii', 0, 2) !== 'II' || input.toString('ascii', 8, 10) !== 'CR') throw new Error('Unsupported RAW format');
  const offset = input.readUInt32LE(4);
  const count = input.readUInt16LE(offset);
  const tags = new Map();
  for (let index = 0; index < count; index++) {
    const entry = offset + 2 + index * 12;
    if (input.readUInt32LE(entry + 4) === 1) tags.set(input.readUInt16LE(entry), input.readUInt32LE(entry + 8));
  }
  const start = tags.get(273), length = tags.get(279);
  if (tags.get(274) !== 1 || !start || !length || start + length > input.length) throw new Error('Unsupported RAW preview layout');
  const jpeg = input.subarray(start, start + length);
  const metadata = await sharp(jpeg).metadata();
  if (metadata.format !== 'jpeg' || metadata.width !== tags.get(256) || metadata.height !== tags.get(257)) throw new Error('RAW preview is not full resolution');
  return jpeg;
}

const report = [];
for (const [source, name, folder = 'public/PICTURES TO BE REPLACED'] of selection) {
  const output = path.join(root, `public/images/high-resolution/${name}.webp`);
  // Preserve the original pixel dimensions. Next.js generates smaller delivery
  // sizes for the page; the photo viewer loads this full-resolution file.
  const info = await sharp(await readPhoto(path.join(root, folder, source))).rotate().webp({ quality: 96, effort: 4 }).toFile(output);
  report.push({ source: `${folder}/${source}`, output: `/images/high-resolution/${name}.webp`, width: info.width, height: info.height, bytes: info.size });
  console.log(`${name}: ${info.width} x ${info.height}, ${(info.size / 1024 / 1024).toFixed(2)} MB`);
}
const botanical = process.argv[2];
if (botanical) await sharp(botanical).resize({ width: 680 }).webp({ quality: 82 }).toFile(path.join(root, 'public/decorations/botanical.webp'));
const photo = await sharp(path.join(root, 'public/images/high-resolution/hero-v2.webp')).resize(520, 630, { fit: 'cover', position: 'center' }).toBuffer();
const title = Buffer.from(`<svg width="1200" height="630"><rect width="1200" height="630" fill="#fff9f2"/><rect x="30" y="30" width="610" height="570" fill="none" stroke="#a8bba3"/><text x="335" y="170" text-anchor="middle" font-family="Georgia" font-size="18" letter-spacing="4" fill="#65745b">YOU'RE INVITED</text><text x="335" y="290" text-anchor="middle" font-family="Georgia" font-size="70" fill="#35483c">Deo &amp;</text><text x="335" y="375" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="80" fill="#35483c">Romalyn</text><text x="335" y="465" text-anchor="middle" font-family="Georgia" font-size="25" fill="#65745b">December 23, 2026</text><text x="335" y="510" text-anchor="middle" font-family="Georgia" font-size="18" fill="#65745b">Luntian Garden</text></svg>`);
await sharp(title).composite([{ input: photo, left: 680, top: 0 }]).jpeg({ quality: 88 }).toFile(path.join(root, 'public/images/share.jpg'));
await writeFile(path.join(root, '.review/photo-selection.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
