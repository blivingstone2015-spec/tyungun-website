const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { URL } = require('url');

const ROOT = process.cwd();
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 5500);
const STATE_DIR = path.join(ROOT, 'editor-state');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function normalizePageName(page) {
  const raw = String(page || '').trim().toLowerCase();
  if (!raw) return '';
  const fileName = path.basename(raw);
  if (!/^[a-z0-9._-]+\.html$/.test(fileName)) return '';
  return fileName;
}

function toPublicPath(relativePath) {
  return relativePath.split(path.sep).join('/');
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

async function ensureStateDir() {
  await fsp.mkdir(STATE_DIR, { recursive: true });
}

async function readJsonIfExists(filePath) {
  try {
    const text = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function writeJson(filePath, payload) {
  await ensureStateDir();
  await fsp.writeFile(filePath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
}

function decodeDataUrl(dataUrl) {
  const match = String(dataUrl || '').match(/^data:([^;,]+)?;base64,(.+)$/);
  if (!match) return null;
  const mime = (match[1] || 'image/jpeg').toLowerCase();
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  return { mime, buffer };
}

function extensionForMime(mime) {
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  if (mime === 'image/gif') return '.gif';
  return '.jpg';
}

function safeWorkspacePath(targetPath) {
  const resolved = path.resolve(ROOT, targetPath);
  if (!resolved.startsWith(ROOT)) return null;
  return resolved;
}

async function handleEditorApi(req, res, urlObj) {
  if (urlObj.pathname === '/__editor/state') {
    const page = normalizePageName(urlObj.searchParams.get('page'));
    if (!page) {
      sendJson(res, 400, { error: 'Invalid page parameter' });
      return true;
    }

    const statePath = path.join(STATE_DIR, page + '.json');

    if (req.method === 'GET') {
      const payload = await readJsonIfExists(statePath);
      if (!payload) {
        sendJson(res, 404, { error: 'No state file found' });
        return true;
      }
      sendJson(res, 200, payload);
      return true;
    }

    if (req.method === 'POST') {
      const bodyText = await readBody(req);
      let payload;
      try {
        payload = JSON.parse(bodyText || '{}');
      } catch {
        sendJson(res, 400, { error: 'Invalid JSON body' });
        return true;
      }
      await writeJson(statePath, payload || {});
      sendJson(res, 200, { ok: true, file: toPublicPath(path.relative(ROOT, statePath)) });
      return true;
    }

    if (req.method === 'DELETE') {
      try {
        await fsp.unlink(statePath);
      } catch {}
      sendJson(res, 200, { ok: true });
      return true;
    }
  }

  if (urlObj.pathname === '/__editor/gallery') {
    const statePath = path.join(STATE_DIR, 'gallery-photos.json');

    if (req.method === 'GET') {
      const payload = await readJsonIfExists(statePath);
      if (payload) {
        sendJson(res, 200, payload);
        return true;
      }
      const fallback = await readJsonIfExists(path.join(ROOT, 'gallery_photos.json'));
      if (fallback) {
        sendJson(res, 200, { version: 1, updatedAt: new Date().toISOString(), photos: fallback });
        return true;
      }
      sendJson(res, 404, { error: 'No gallery state found' });
      return true;
    }

    if (req.method === 'POST') {
      const bodyText = await readBody(req);
      let payload;
      try {
        payload = JSON.parse(bodyText || '{}');
      } catch {
        sendJson(res, 400, { error: 'Invalid JSON body' });
        return true;
      }

      const photos = Array.isArray(payload.photos) ? payload.photos : [];
      const statePayload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        photos
      };

      await writeJson(statePath, statePayload);
      await writeJson(path.join(ROOT, 'gallery_photos.json'), photos);
      const jsManifest = 'window.TYUNGUN_GALLERY_PHOTOS = ' + JSON.stringify(photos, null, 2) + ';\n';
      await fsp.writeFile(path.join(ROOT, 'gallery_photos.js'), jsManifest, 'utf8');

      sendJson(res, 200, { ok: true });
      return true;
    }
  }

  if (urlObj.pathname === '/__editor/bake' && req.method === 'POST') {
    const bodyText = await readBody(req);
    let payload;
    try {
      payload = JSON.parse(bodyText || '{}');
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON body' });
      return true;
    }

    const page = normalizePageName(payload.page);
    if (!page) {
      sendJson(res, 400, { error: 'Invalid page parameter' });
      return true;
    }

    let html = String(payload.html || '');
    if (!html) {
      sendJson(res, 400, { error: 'Missing html' });
      return true;
    }

    const bakedDir = path.join(ROOT, 'local-assets', 'baked');
    await fsp.mkdir(bakedDir, { recursive: true });

    const images = Array.isArray(payload.images) ? payload.images : [];
    for (let i = 0; i < images.length; i += 1) {
      const image = images[i];
      const data = decodeDataUrl(image && image.dataUrl);
      if (!data || !data.buffer || !data.buffer.length) continue;
      const ext = extensionForMime(data.mime);
      const fileName = path.basename(page, '.html') + '-' + i + ext;
      await fsp.writeFile(path.join(bakedDir, fileName), data.buffer);
      const publicPath = 'local-assets/baked/' + fileName;
      html = html.split(image.placeholder).join(publicPath);
    }

    const targetPath = path.join(ROOT, page);
    await fsp.writeFile(targetPath, html, 'utf8');
    sendJson(res, 200, { ok: true, file: page, imageCount: images.length });
    return true;
  }

  if (urlObj.pathname === '/__editor/upload-image' && req.method === 'POST') {
    const bodyText = await readBody(req);
    let payload;
    try {
      payload = JSON.parse(bodyText || '{}');
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON body' });
      return true;
    }

    const folder = String(payload.folder || 'gallery-images').replace(/\\/g, '/').replace(/^\/+/, '');
    const safeFolder = safeWorkspacePath(folder);
    if (!safeFolder) {
      sendJson(res, 400, { error: 'Invalid folder' });
      return true;
    }

    const data = decodeDataUrl(payload.dataUrl);
    if (!data || !data.buffer || !data.buffer.length) {
      sendJson(res, 400, { error: 'Invalid image data' });
      return true;
    }

    const ext = extensionForMime(data.mime);
    const baseNameRaw = String(payload.name || 'image').toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
    const baseName = path.basename(baseNameRaw, path.extname(baseNameRaw)) || 'image';
    const fileName = baseName.endsWith(ext) ? baseName : baseName + ext;

    await fsp.mkdir(safeFolder, { recursive: true });
    const targetPath = path.join(safeFolder, fileName);
    await fsp.writeFile(targetPath, data.buffer);

    const publicPath = toPublicPath(path.relative(ROOT, targetPath));
    sendJson(res, 200, { ok: true, path: publicPath });
    return true;
  }

  return false;
}

function serveStatic(req, res, urlObj) {
  const requestPath = decodeURIComponent(urlObj.pathname || '/');
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const absolutePath = safeWorkspacePath(relativePath);
  if (!absolutePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(absolutePath, function (error, stat) {
    if (error || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(absolutePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  if (urlObj.pathname.startsWith('/__editor/')) {
    const handled = await handleEditorApi(req, res, urlObj);
    if (handled) return;
  }
  serveStatic(req, res, urlObj);
});

server.listen(PORT, HOST, () => {
  console.log(`Editor server running at http://${HOST}:${PORT}`);
  console.log('Use this URL while editing so changes are written into editor-state files.');
});
