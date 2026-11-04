import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { galleryPhotos } from '../config/gallery.ts';

const source = 'public/picture replace now';
const files = (await readdir(source)).filter(name => /\.(jpe?g|png|webp)$/i.test(name)).sort();
if (JSON.stringify(files) !== JSON.stringify(galleryPhotos.map(photo => photo.source).sort())) {
  throw new Error('Gallery configuration must include every supplied photograph exactly once.');
}
await mkdir('public/images/gallery', { recursive: true });
for (const photo of galleryPhotos) {
  // Preserve supplied dimensions and appearance; only encode for web delivery.
  const result = await sharp(`${source}/${photo.source}`).rotate().webp({ quality: 96, effort: 4 }).toFile(`public${photo.src}`);
  if (result.width !== photo.width || result.height !== photo.height) throw new Error(`Unexpected dimensions: ${photo.source}`);
  console.log(`${photo.source}: ${result.width} × ${result.height}, ${(result.size / 1048576).toFixed(2)} MB`);
}
