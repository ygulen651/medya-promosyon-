const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '../..');
  const categories = JSON.parse(await fs.readFile(path.join(__dirname, 'prompts.json'), 'utf8'));
  const report = [];
  const tiles = [];
  for (const item of categories) {
    const filename = path.join(root, 'public', item.file);
    try { await fs.access(filename); } catch { continue; }
    const source = await fs.readFile(filename);
    const resized = await sharp(source).resize(1024, 1024, { fit: 'contain', background: '#EEEAE2' }).png().toBuffer();
    await fs.writeFile(filename, resized);
    const metadata = await sharp(resized).metadata();
    report.push({ no: item.no, category: item.category, file: item.file, width: metadata.width, height: metadata.height, bytes: resized.length });
    const thumb = await sharp(resized).resize(240, 240).toBuffer();
    const label = Buffer.from(`<svg width="240" height="36"><rect width="240" height="36" fill="#ffffff"/><text x="12" y="24" font-family="Arial,sans-serif" font-size="15" fill="#242424">${item.no}. ${item.category}</text></svg>`);
    tiles.push(await sharp({ create: { width: 240, height: 276, channels: 3, background: '#ffffff' } }).composite([{ input: thumb, top: 0, left: 0 }, { input: label, top: 240, left: 0 }]).png().toBuffer());
  }
  const cols = 5, rows = Math.ceil(tiles.length / cols);
  await sharp({ create: { width: cols * 240, height: rows * 276, channels: 3, background: '#ffffff' } }).composite(tiles.map((input, i) => ({ input, left: (i % cols) * 240, top: Math.floor(i / cols) * 276 }))).jpeg({ quality: 90 }).toFile(path.join(__dirname, 'onizleme.jpg'));
  await fs.writeFile(path.join(__dirname, 'manifest.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ count: report.length, all1024: report.every(i => i.width === 1024 && i.height === 1024), totalBytes: report.reduce((n, i) => n + i.bytes, 0) }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
