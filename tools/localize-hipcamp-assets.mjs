import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const files = [
  'about.html',
  'booking.html',
  'gallery.html',
  'guide.html',
  'index.html',
  'index-b.html',
  'index-c.html',
  'index-print.html',
  'sites.html',
  'site-swimming-hole.html',
  'site-silky-oak.html',
  'site-davids-dell.html',
  'site-twin-pines.html',
  'site-pine-chapel.html'
];

const outDirRel = 'local-assets/remote-media';
const outDirAbs = path.join(root, outDirRel);
fs.mkdirSync(outDirAbs, { recursive: true });

const urlRegex = /https:\/\/hipcamp-res\.cloudinary\.com[^"'\s<)]+/g;
const urlSet = new Set();

for (const file of files) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) continue;
  const raw = fs.readFileSync(abs, 'utf8');
  const matches = raw.match(urlRegex) || [];
  for (const m of matches) {
    urlSet.add(m.replace(/,+$/, ''));
  }
}

const urls = Array.from(urlSet).sort();
const replacementMap = new Map();
const failed = [];
let downloaded = 0;
let reused = 0;

for (const url of urls) {
  let ext = path.extname(new URL(url).pathname) || '.jpg';
  if (!ext.startsWith('.')) ext = '.jpg';
  const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 16);
  const fileName = `${hash}${ext.toLowerCase()}`;
  const localRel = `${outDirRel}/${fileName}`;
  const localAbs = path.join(root, localRel);

  if (!fs.existsSync(localAbs)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(localAbs, buffer);
      downloaded += 1;
    } catch (error) {
      failed.push({ url, reason: String(error && error.message ? error.message : error) });
      continue;
    }
  } else {
    reused += 1;
  }

  replacementMap.set(url, localRel.replace(/\\/g, '/'));
}

let filesUpdated = 0;
for (const file of files) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) continue;
  let raw = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [from, to] of replacementMap.entries()) {
    if (raw.includes(from)) {
      raw = raw.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(abs, raw, 'utf8');
    filesUpdated += 1;
  }
}

console.log(`URLS_FOUND=${urls.length}`);
console.log(`URLS_MAPPED=${replacementMap.size}`);
console.log(`DOWNLOADED=${downloaded}`);
console.log(`REUSED=${reused}`);
console.log(`FILES_UPDATED=${filesUpdated}`);
if (failed.length) {
  console.log(`FAILED=${failed.length}`);
  for (const item of failed.slice(0, 20)) {
    console.log(`FAIL ${item.url} :: ${item.reason}`);
  }
}
