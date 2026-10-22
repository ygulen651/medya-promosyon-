const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '../../..');
  const categories = JSON.parse(await fs.readFile(path.join(__dirname, '../prompts.json'), 'utf8'));
  const report = [], tiles = [];
  for (const item of categories) {
    const base = path.join(root, 'public/categories/meday', item.slug);
    let source;
    try { source = await fs.readFile(base + '.png'); } catch { continue; }
    const resized = await sharp(source).resize(1024, 1024, { fit: 'contain', background: '#EEEAE2' }).png().toBuffer();
    await fs.writeFile(base + '.png', resized);
    const webp = await sharp(resized).webp({ quality: 90, effort: 6 }).toBuffer();
    await fs.writeFile(base + '.webp', webp);
    const meta = await sharp(webp).metadata();
    report.push({ no: item.no, category: item.category, file: '/categories/meday/' + item.slug + '.webp', png: '/categories/meday/' + item.slug + '.png', width: meta.width, height: meta.height, bytes: webp.length });
    const thumb = await sharp(resized).resize(240, 240).toBuffer();
    const label = Buffer.from(`<svg width="240" height="36"><rect width="240" height="36" fill="#fff"/><text x="12" y="24" font-family="Arial,sans-serif" font-size="15" fill="#242424">${item.no}. ${item.category}</text></svg>`);
    tiles.push(await sharp({ create: { width: 240, height: 276, channels: 3, background: '#fff' } }).composite([{ input: thumb, top: 0, left: 0 }, { input: label, top: 240, left: 0 }]).png().toBuffer());
  }
  if (tiles.length) {
    await sharp({ create: { width: 1200, height: Math.ceil(tiles.length / 5) * 276, channels: 3, background: '#fff' } }).composite(tiles.map((input, i) => ({ input, left: (i % 5) * 240, top: Math.floor(i / 5) * 276 }))).jpeg({ quality: 92 }).toFile(path.join(__dirname, 'onizleme.jpg'));
  }
  await fs.writeFile(path.join(__dirname, 'manifest.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ count: report.length, all1024: report.every(i => i.width === 1024 && i.height === 1024), totalWebpBytes: report.reduce((n, i) => n + i.bytes, 0) }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
