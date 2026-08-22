/* ===========================================================
   Tyungun Country Retreat — shared chrome + interactions
   =========================================================== */
(function () {
  var PAGE = document.body.getAttribute('data-page') || '';
  var HOME = document.body.getAttribute('data-home') || 'index.html';

  // Normalize header sizing across all pages (home + inner pages).
  var globalHeaderSizing = document.createElement('style');
  globalHeaderSizing.textContent =
    '.site-header{padding:20px var(--gutter);}' +
    '.site-header.is-solid{padding-block:20px;}' +
    '.brand b{font-size:28px;}' +
    '.nav a{font-size:14px;}' +
    '.nav .btn{padding:12px 22px;}' +
    '.nav{display:flex!important;align-items:center;gap:34px;}' +
    '.nav-toggle,.mobile-menu{display:none!important;}' +
    '@media (max-width:900px){.site-header{align-items:flex-start;flex-wrap:wrap;row-gap:12px;padding-block:14px;}.brand b{font-size:22px;}.brand span{font-size:9px;letter-spacing:.26em;}.nav{width:100%;justify-content:space-between;gap:10px 14px;flex-wrap:wrap;}.nav a{font-size:11px;letter-spacing:.1em;padding-block:4px;}.nav .btn{padding:9px 14px;font-size:11px;}}';
  document.head.appendChild(globalHeaderSizing);

  function mapCloudinaryUrlToLocal(url) {
    var value = String(url || '');
    if (!/hipcamp-res\.cloudinary\.com/i.test(value)) return '';
    var lower = value.toLowerCase();

    if (lower.indexOf('pine-chapel') >= 0 || lower.indexOf('mjcumorf') >= 0 || lower.indexOf('zecakdx') >= 0 || lower.indexOf('v0r8dhq') >= 0) {
      return 'gallery-images/photo-04.jpg';
    }
    if (lower.indexOf('silky-oak') >= 0 || lower.indexOf('ixzl6') >= 0 || lower.indexOf('j5u6tb') >= 0 || lower.indexOf('ybf415') >= 0) {
      return 'gallery-images/photo-07.jpg';
    }
    if (lower.indexOf('david-s-dell') >= 0 || lower.indexOf('po2j7g') >= 0 || lower.indexOf('ujyfuu') >= 0 || lower.indexOf('oxgjl9') >= 0) {
      return 'gallery-images/photo-01.jpg';
    }
    if (lower.indexOf('twin-pines') >= 0 || lower.indexOf('ehqgie') >= 0 || lower.indexOf('r4gtn7') >= 0 || lower.indexOf('uwcpkw') >= 0) {
      return 'gallery-images/photo-13.jpg';
    }
    if (lower.indexOf('swimming-hole') >= 0 || lower.indexOf('vhqojb') >= 0 || lower.indexOf('l66lmm') >= 0 || lower.indexOf('nemvhc') >= 0 || lower.indexOf('a2qjxc') >= 0 || lower.indexOf('t3wdhu') >= 0 || lower.indexOf('viiest') >= 0 || lower.indexOf('fhujfx') >= 0) {
      return 'gallery-images/photo-10.jpg';
    }
    if (lower.indexOf('profile/') >= 0) {
      return 'gallery-images/photo-01.jpg';
    }

    return 'gallery-images/photo-11.jpg';
  }

  function localizeCloudinaryMedia() {
    var mediaNodes = document.querySelectorAll('img[src], source[src], [data-full], img[srcset], source[srcset]');

    mediaNodes.forEach(function (node) {
      if (node.hasAttribute('src')) {
        var originalSrc = node.getAttribute('src') || '';
        var localSrc = mapCloudinaryUrlToLocal(originalSrc);
        if (localSrc) {
          node.setAttribute('src', localSrc);
        }
      }

      if (node.hasAttribute('data-full')) {
        var originalFull = node.getAttribute('data-full') || '';
        var localFull = mapCloudinaryUrlToLocal(originalFull);
        if (localFull) {
          node.setAttribute('data-full', localFull);
        }
      }

      if (node.hasAttribute('srcset')) {
        var srcset = node.getAttribute('srcset') || '';
        if (/hipcamp-res\.cloudinary\.com/i.test(srcset)) {
          var rewritten = srcset.split(',').map(function (candidate) {
            var item = candidate.trim();
            if (!item) return item;
            var parts = item.split(/\s+/);
            var url = parts[0] || '';
            var descriptor = parts.slice(1).join(' ');
            var localUrl = mapCloudinaryUrlToLocal(url);
            if (!localUrl) return item;
            return descriptor ? (localUrl + ' ' + descriptor) : localUrl;
          }).join(', ');
          node.setAttribute('srcset', rewritten);
        }
      }
    });
  }

  localizeCloudinaryMedia();

  var NAV = [
    { key: 'sites',   href: 'sites.html',   label: 'The Sites' },
    { key: 'gallery', href: 'gallery.html', label: 'Gallery' },
    { key: 'guide',   href: 'guide.html',   label: 'Guest Guide' }
  ];

  function navLinks() {
    return NAV.map(function (n) {
      var cur = (n.key === PAGE) ? ' aria-current="page"' : '';
      return '<a href="' + n.href + '"' + cur + '>' + n.label + '</a>';
    }).join('') + '<a class="btn" href="booking.html">Reserve <span class="arr">&rarr;</span></a>';
  }

  /* ---------- Header ---------- */
  var header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML =
    '<a class="brand" href="' + HOME + '"><b>Tyungun</b><span>Country Retreat</span></a>' +
    '<nav class="nav">' + navLinks() + '</nav>';
  document.body.insertBefore(header, document.body.firstChild);

  /* ---------- Solid header on scroll / non-hero pages ---------- */
  function onScroll() {
    header.classList.add('is-solid');
  }
  header.classList.add('is-solid');
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Footer ---------- */
  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML =
    '<div class="wrap">' +
      '<div class="foot-top">' +
        '<div class="foot-brand">' +
          '<b>Tyungun</b>' +
          '<p>A family-owned cattle farm of 350 acres along Flying Fox Creek &mdash; five private sites, and not another soul in sight.</p>' +
        '</div>' +
        '<div><h4>Wander</h4><div class="foot-links">' +
          '<a href="sites.html">The Sites</a>' +
          '<a href="gallery.html">Gallery</a>' +
          '<a href="guide.html">Guest Guide</a>' +
          '<a href="booking.html">Reserve a Stay</a>' +
        '</div></div>' +
        '<div><h4>Find Us</h4><div class="foot-links">' +
          '<a>Ferny Glen, Queensland</a>' +
          '<a>40 min &middot; Gold Coast</a>' +
          '<a>60 min &middot; Brisbane</a>' +
          '<a>15 min &middot; Canungra</a>' +
          '<a href="https://www.hipcamp.com/en-AU/land/queensland-tyungun-country-retreat-v1qh2vl8" target="_blank" rel="noopener">Hipcamp Listing &rarr;</a>' +
        '</div></div>' +
      '</div>' +
      '<p class="acknowledge">Tyungun Country Retreat acknowledges the Traditional Custodians of this country and their enduring connection to land, water and community. We pay our respects to Elders past and present.</p>' +
      '<div class="foot-bottom">' +
        '<span>&copy; ' + new Date().getFullYear() + ' Tyungun Country Retreat &middot; Hosted by Bryce</span>' +
        '<span>Ferny Glen &middot; QLD &middot; AU</span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(footer);

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

  /* ---------- Lightbox (any [data-lightbox] img) - only if images exist ---------- */
  if (document.querySelectorAll('[data-lightbox]').length > 0) {
    var lb = document.createElement('div');
    lb.style.cssText = 'position:fixed;inset:0;z-index:90;background:rgba(20,15,10,.92);display:none;align-items:center;justify-content:center;cursor:zoom-out;padding:5vw;';
    lb.innerHTML = '<img style="max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 30px 80px rgba(0,0,0,.5);" alt="">';
    lb.addEventListener('click', function () { lb.style.display = 'none'; });
    document.body.appendChild(lb);
    document.querySelectorAll('[data-lightbox]').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        if (document.body.classList.contains('edit-mode')) return;
        lb.querySelector('img').src = img.getAttribute('data-full') || img.src;
        lb.style.display = 'flex';
      });
    });
  }

  /* ---------- Homepage direction switcher (A / B / C) ---------- */
  if (PAGE === 'home') {
    var file = (location.pathname.split('/').pop() || 'index.html');
    var dirs = [
      { f: 'index.html',   k: 'A', t: 'Editorial' },
      { f: 'index-b.html', k: 'B', t: 'Almanac' },
      { f: 'index-c.html', k: 'C', t: 'Field Study' }
    ];
    var sw = document.createElement('div');
    sw.className = 'dir-switch';
    sw.innerHTML = '<span class="dir-switch__lbl">Direction</span>' +
      dirs.map(function (d) {
        var on = (file === d.f || (file === '' && d.f === 'index.html'));
        return '<a href="' + d.f + '" title="' + d.t + '"' + (on ? ' class="on"' : '') + '>' + d.k + '</a>';
      }).join('');
    document.body.appendChild(sw);
  }

  var ADMIN_EDIT_FLAG_KEY = 'tyungun-admin-edit-enabled:v1';

  function setAdminEditAccess(enabled) {
    try {
      if (enabled) {
        localStorage.setItem(ADMIN_EDIT_FLAG_KEY, '1');
      } else {
        localStorage.removeItem(ADMIN_EDIT_FLAG_KEY);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function hasAdminEditAccess() {
    var isLocalHost = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname || '');

    // Keep authoring deterministic: edit mode is only enabled in localhost workspace mode.
    return isLocalHost;
  }

  /* ---------- Inline edit mode ---------- */
  function insertEditStyles() {
    var css = '.edit-toolbar{position:fixed;top:18px;right:18px;z-index:9999;display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:999px;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);box-shadow:0 18px 48px rgba(10,10,10,.16);font-family:var(--ff-body);font-size:13px;font-weight:500;color:var(--ink);}'+
      '.edit-toolbar button{border:1px solid rgba(43,33,24,.14);background:#fff;color:var(--ink);border-radius:999px;padding:10px 14px;cursor:pointer;transition:transform .2s,background .2s,border-color .2s;}'+
      '.edit-toolbar button:hover{transform:translateY(-1px);border-color:rgba(43,33,24,.25);}'+
      '.edit-toolbar .edit-hint{color:var(--ink-faint);font-size:12px;white-space:nowrap;}'+
      '.edit-toolbar.on{background:rgba(171,79,41,.9);color:#fff;}'+
      '.edit-toolbar.on button{background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.2);}'+
      '.editable{outline:0;}'+
      '.editable-image{position:relative;cursor:pointer;outline:0;}'+
      'body.edit-mode .editable:hover, body.edit-mode .editable-image:hover{outline:2px dashed rgba(171,79,41,.75);outline-offset:4px;background:rgba(171,79,41,.06);}'+
      'body.edit-mode .editable:focus{outline:2px solid rgba(171,79,41,.85);outline-offset:4px;background:rgba(171,79,41,.08);}'+
      'body.edit-mode .edit-hint{display:inline-block;}'+
      '.edit-delete-fab{position:fixed;z-index:10001;display:none;align-items:center;justify-content:center;width:30px;height:30px;border:1px solid rgba(171,79,41,.35);border-radius:999px;background:#fff;color:#ab4f29;font-size:16px;line-height:1;cursor:pointer;box-shadow:0 10px 28px rgba(10,10,10,.18);}'+
      '.edit-delete-fab:hover{background:#ab4f29;color:#fff;border-color:#ab4f29;}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function setupEditMode() {
    var editableSelector = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,dt,dd,strong,em,b,i,span,a,img';
    function normalizePathKey(pathname) {
      var path = String(pathname || '');
      try { path = decodeURIComponent(path); } catch (e) {}
      return path.replace(/\\/g, '/').toLowerCase();
    }

    var normalizedPathname = normalizePathKey(String(location.pathname || ''));
    var stablePageKey = normalizedPathname.split('/').pop() || 'index.html';
    var storageKey = 'tyungun-inline-edits:v2:' + stablePageKey;
    var storageManifestKey = storageKey + '::manifest';
    var legacyStorageKey = 'tyungun-inline-edits:v2:' + normalizedPathname;
    var IMAGE_DB = 'tyungun-inline-edits-media';
    var IMAGE_DB_VERSION = 1;
    var IMAGE_STORE = 'images';
    var IMAGE_REF_PREFIX = 'idb:';
    var SITE_CARD_REF_PREFIX = 'sitecard:';
    var SITE_CARD_IMAGES_KEY = 'tyungun-sites-card-images:v1';
    var IMAGE_PREVIEW_KEY = storageKey + '::image-previews';
    var STORAGE_META_KEY = storageKey + '::meta';
    var EDITOR_STATE_FILE = 'editor-state/' + stablePageKey + '.json';
    var EDITOR_STATE_API = '/__editor/state?page=' + encodeURIComponent(stablePageKey);
    var FILE_PERSIST_DEBOUNCE_MS = 350;
    var EDITABLE_MEDIA_SELECTOR = '.sblock__media,.g-tile,.gallery__tile,.other-card,.other-card__media,.host-row__media,.breg,.breg__media,.crow,.crow__peek,.cland__media,.bplate__media,.carousel-stage,.hero__media,.page-hero__media,.chero__media,.bhero__media,.land-strip__media,.land-night__media,.ph';
    var BANNER_MEDIA_SELECTOR = '.hero,.hero__media,.page-hero,.page-hero__media,.hero-banner,.site-hero,.masthead,.land-strip,.land-strip__media,.chero,.chero__media,.bhero,.bhero__media,.cland,.cland__media,.bplate,.bplate__media,.land-night,.land-night__media';
    var NON_EDITABLE_CONTAINER_SELECTOR = PAGE === 'gallery'
      ? 'header,footer,nav,.mobile-menu,.site-header,.site-footer,.dir-switch,.gallery-manager,.masonry,.gallery,.camps-map__canvas,.camps-map__leaflet,.leaflet-container,.leaflet-pane,.leaflet-control-container,.leaflet-popup-pane,.leaflet-marker-pane,.leaflet-shadow-pane,.leaflet-tooltip-pane,.leaflet-tile-pane'
      : 'header,footer,nav,.mobile-menu,.site-header,.site-footer,.dir-switch,.gallery-manager,.masonry,.camps-map__canvas,.camps-map__leaflet,.leaflet-container,.leaflet-pane,.leaflet-control-container,.leaflet-popup-pane,.leaflet-marker-pane,.leaflet-shadow-pane,.leaflet-tooltip-pane,.leaflet-tile-pane';
    var imageObjectUrls = new Map();
    var filePersistTimer = null;

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    var activeImage = null;
    var activeDeleteTarget = null;
    var deleteFab = document.createElement('button');
    deleteFab.type = 'button';
    deleteFab.className = 'edit-delete-fab';
    deleteFab.setAttribute('aria-label', 'Delete selected element');
    deleteFab.innerHTML = '&times;';
    document.body.appendChild(deleteFab);

    function openImageDb() {
      return new Promise(function (resolve) {
        if (!window.indexedDB) {
          resolve(null);
          return;
        }
        var request = indexedDB.open(IMAGE_DB, IMAGE_DB_VERSION);
        request.onupgradeneeded = function (event) {
          var db = event.target.result;
          if (!db.objectStoreNames.contains(IMAGE_STORE)) {
            db.createObjectStore(IMAGE_STORE);
          }
        };
        request.onsuccess = function (event) { resolve(event.target.result); };
        request.onerror = function () { resolve(null); };
      });
    }

    function dbPutBlob(db, key, blob) {
      return new Promise(function (resolve) {
        if (!db) {
          resolve(false);
          return;
        }
        var tx = db.transaction(IMAGE_STORE, 'readwrite');
        var store = tx.objectStore(IMAGE_STORE);
        var request = store.put(blob, key);
        request.onsuccess = function () { resolve(true); };
        request.onerror = function () { resolve(false); };
      });
    }

    function dbGetBlob(db, key) {
      return new Promise(function (resolve) {
        if (!db) {
          resolve(null);
          return;
        }
        var tx = db.transaction(IMAGE_STORE, 'readonly');
        var store = tx.objectStore(IMAGE_STORE);
        var request = store.get(key);
        request.onsuccess = function (event) { resolve(event.target.result || null); };
        request.onerror = function () { resolve(null); };
      });
    }

    function dbGetValue(db, key) {
      return new Promise(function (resolve) {
        if (!db) {
          resolve(null);
          return;
        }
        var tx = db.transaction(IMAGE_STORE, 'readonly');
        var store = tx.objectStore(IMAGE_STORE);
        var request = store.get(key);
        request.onsuccess = function (event) { resolve(event.target.result || null); };
        request.onerror = function () { resolve(null); };
      });
    }

    function dbPutValue(db, key, value) {
      return new Promise(function (resolve) {
        if (!db) {
          resolve(false);
          return;
        }
        var tx = db.transaction(IMAGE_STORE, 'readwrite');
        var store = tx.objectStore(IMAGE_STORE);
        var request = store.put(value, key);
        request.onsuccess = function () { resolve(true); };
        request.onerror = function () { resolve(false); };
      });
    }

    function dbDeleteBlob(db, key) {
      return new Promise(function (resolve) {
        if (!db) {
          resolve(false);
          return;
        }
        var tx = db.transaction(IMAGE_STORE, 'readwrite');
        var store = tx.objectStore(IMAGE_STORE);
        var request = store.delete(key);
        request.onsuccess = function () { resolve(true); };
        request.onerror = function () { resolve(false); };
      });
    }

    function dbDeleteValue(db, key) {
      return new Promise(function (resolve) {
        if (!db) {
          resolve(false);
          return;
        }
        var tx = db.transaction(IMAGE_STORE, 'readwrite');
        var store = tx.objectStore(IMAGE_STORE);
        var request = store.delete(key);
        request.onsuccess = function () { resolve(true); };
        request.onerror = function () { resolve(false); };
      });
    }

    function makeImageBlobKey(nodeKey) {
      return stablePageKey + '::' + String(nodeKey);
    }

    function makeSiteCardBlobKey(editId) {
      return 'site-card::' + String(editId || '');
    }

    function imageRefToBlobKey(ref) {
      if (typeof ref !== 'string') return '';
      if (ref.indexOf(IMAGE_REF_PREFIX) !== 0) return '';
      return ref.slice(IMAGE_REF_PREFIX.length);
    }

    function imageRefToSiteCardId(ref) {
      if (typeof ref !== 'string') return '';
      if (ref.indexOf(SITE_CARD_REF_PREFIX) !== 0) return '';
      return ref.slice(SITE_CARD_REF_PREFIX.length);
    }

    function revokeImageObjectUrl(nodeKey) {
      if (!imageObjectUrls.has(nodeKey)) return;
      URL.revokeObjectURL(imageObjectUrls.get(nodeKey));
      imageObjectUrls.delete(nodeKey);
    }

    function blobToDataUrl(blob) {
      return new Promise(function (resolve) {
        if (!blob) {
          resolve('');
          return;
        }
        var reader = new FileReader();
        reader.onload = function () {
          resolve(typeof reader.result === 'string' ? reader.result : '');
        };
        reader.onerror = function () {
          resolve('');
        };
        reader.readAsDataURL(blob);
      });
    }

    function loadSiteCardImageMap() {
      try {
        var raw = localStorage.getItem(SITE_CARD_IMAGES_KEY);
        var parsed = raw ? JSON.parse(raw) : null;
        if (!parsed || typeof parsed !== 'object') return {};
        return parsed;
      } catch (e) {
        return {};
      }
    }

    function persistSiteCardImageMap(map) {
      try {
        localStorage.setItem(SITE_CARD_IMAGES_KEY, JSON.stringify(map || {}));
        schedulePersistSavedEditsToFile();
        return true;
      } catch (e) {
        return false;
      }
    }

    function removeSiteCardImage(editId) {
      if (!editId) return;
      var map = loadSiteCardImageMap();
      if (!Object.prototype.hasOwnProperty.call(map, editId)) return;
      delete map[editId];
      persistSiteCardImageMap(map);
    }

    function loadImagePreviewMap() {
      try {
        var raw = localStorage.getItem(IMAGE_PREVIEW_KEY);
        if (!raw && legacyStorageKey !== storageKey) {
          raw = localStorage.getItem(legacyStorageKey + '::image-previews');
        }
        var parsed = raw ? JSON.parse(raw) : null;
        if (!parsed || typeof parsed !== 'object') return {};
        if (!localStorage.getItem(IMAGE_PREVIEW_KEY)) {
          try { localStorage.setItem(IMAGE_PREVIEW_KEY, JSON.stringify(parsed)); } catch (e) {}
        }
        return parsed;
      } catch (e) {
        return {};
      }
    }

    function persistImagePreviewMap(map) {
      try {
        localStorage.setItem(IMAGE_PREVIEW_KEY, JSON.stringify(map || {}));
        schedulePersistSavedEditsToFile();
        return true;
      } catch (e) {
        return false;
      }
    }

    function removeImagePreview(nodeKey) {
      if (!nodeKey) return;
      var map = loadImagePreviewMap();
      if (!Object.prototype.hasOwnProperty.call(map, nodeKey)) return;
      delete map[nodeKey];
      persistImagePreviewMap(map);
    }

    function setImageSource(node, nodeKey, src) {
      if (!node) return;
      if (typeof src === 'string' && src.indexOf('blob:') !== 0) {
        revokeImageObjectUrl(nodeKey);
      }
      node.removeAttribute('srcset');
      node.removeAttribute('sizes');
      node.src = src;
      if (node.hasAttribute('data-lightbox')) {
        node.setAttribute('data-full', src);
      }
    }

    function isPreviewEligibleImage(node) {
      return !!(node && node.closest(EDITABLE_MEDIA_SELECTOR));
    }

    function isBannerLikeImage(node) {
      return !!(node && node.closest(BANNER_MEDIA_SELECTOR));
    }

    function findLegacyStorageKey() {
      var suffix = '/' + stablePageKey;
      if (legacyStorageKey !== storageKey && localStorage.getItem(legacyStorageKey)) {
        return legacyStorageKey;
      }
      try {
        for (var i = 0; i < localStorage.length; i += 1) {
          var key = localStorage.key(i) || '';
          if (key === storageKey || key.indexOf('tyungun-inline-edits:v2:') !== 0) continue;
          if (key.slice(-suffix.length) === suffix) return key;
        }
      } catch (e) {}
      return '';
    }

    function markBannerImagesReady() {
      document.documentElement.classList.remove('ty-prehide-banner');
      document.documentElement.classList.add('ty-banner-ready');
    }

    function canPersistEditsToWorkspace() {
      var protocol = String(location.protocol || '').toLowerCase();
      if (protocol !== 'http:' && protocol !== 'https:') return false;
      var host = String(location.hostname || '').toLowerCase();
      return host === 'localhost' || host === '127.0.0.1';
    }

    function normalizeSavedEditsShape(candidate) {
      var parsed = candidate;
      if (!parsed || typeof parsed !== 'object') parsed = { text: {}, images: {}, deleted: {} };
      if (!parsed.text || typeof parsed.text !== 'object') parsed.text = {};
      if (!parsed.images || typeof parsed.images !== 'object') parsed.images = {};
      if (!parsed.deleted || typeof parsed.deleted !== 'object') parsed.deleted = {};
      return parsed;
    }

    function normalizeStringMap(map) {
      if (!map || typeof map !== 'object') return {};
      var next = {};
      Object.keys(map).forEach(function (key) {
        if (typeof map[key] === 'string') next[key] = map[key];
      });
      return next;
    }

    function parseIsoTime(value) {
      if (!value) return 0;
      var ts = Date.parse(String(value));
      return Number.isFinite(ts) ? ts : 0;
    }

    function hasSavedEditsContent(candidate) {
      var normalized = normalizeSavedEditsShape(candidate);
      return Object.keys(normalized.text).length > 0 ||
        Object.keys(normalized.images).length > 0 ||
        Object.keys(normalized.deleted).length > 0;
    }

    function hasEditorStateContent(payload) {
      if (!payload || typeof payload !== 'object') return false;
      if (hasSavedEditsContent(payload.savedEdits || payload.edits || null)) return true;
      if (Object.keys(normalizeStringMap(payload.imagePreviews)).length > 0) return true;
      if (Object.keys(normalizeStringMap(payload.siteCardImages)).length > 0) return true;
      return false;
    }

    function loadLocalMeta() {
      try {
        var raw = localStorage.getItem(STORAGE_META_KEY);
        var parsed = raw ? JSON.parse(raw) : null;
        if (!parsed || typeof parsed !== 'object') return null;
        return parsed;
      } catch (e) {
        return null;
      }
    }

    function writeLocalMeta(updatedAt) {
      try {
        localStorage.setItem(STORAGE_META_KEY, JSON.stringify({ updatedAt: updatedAt || new Date().toISOString() }));
      } catch (e) {}
    }

    function buildLocalStateSnapshot() {
      return {
        savedEdits: normalizeSavedEditsShape(savedEdits),
        imagePreviews: normalizeStringMap(loadImagePreviewMap()),
        siteCardImages: normalizeStringMap(loadSiteCardImageMap()),
        updatedAt: (loadLocalMeta() || {}).updatedAt || ''
      };
    }

    function shouldApplyWorkspacePayload(payload) {
      if (!payload || typeof payload !== 'object') return false;

      var localSnapshot = buildLocalStateSnapshot();
      var hasWorkspaceContent = hasEditorStateContent(payload);
      var hasLocalContent = hasEditorStateContent(localSnapshot);

      if (!hasLocalContent && hasWorkspaceContent) return true;
      if (hasLocalContent && !hasWorkspaceContent) return false;
      if (!hasLocalContent && !hasWorkspaceContent) return true;

      var workspaceTs = parseIsoTime(payload.updatedAt);
      var localTs = parseIsoTime(localSnapshot.updatedAt);

      if (workspaceTs && localTs) return workspaceTs >= localTs;
      if (workspaceTs && !localTs) return false;
      if (!workspaceTs && localTs) return false;

      try {
        var workspaceFingerprint = JSON.stringify({
          savedEdits: normalizeSavedEditsShape(payload.savedEdits || payload.edits || null),
          imagePreviews: normalizeStringMap(payload.imagePreviews),
          siteCardImages: normalizeStringMap(payload.siteCardImages)
        });
        var localFingerprint = JSON.stringify({
          savedEdits: localSnapshot.savedEdits,
          imagePreviews: localSnapshot.imagePreviews,
          siteCardImages: localSnapshot.siteCardImages
        });
        return workspaceFingerprint === localFingerprint;
      } catch (e) {
        return false;
      }
    }

    function loadEditorStatePayloadFromPath(path) {
      return fetch(path, { cache: 'no-store' }).then(function (response) {
        if (!response.ok) return null;
        return response.json().catch(function () { return null; });
      }).catch(function () {
        return null;
      });
    }

    function loadEditorStatePayload() {
      var stateFilePath = EDITOR_STATE_FILE + '?v=' + Date.now();
      if (canPersistEditsToWorkspace()) {
        return loadEditorStatePayloadFromPath(EDITOR_STATE_API).then(function (payload) {
          if (payload && typeof payload === 'object') return payload;
          return loadEditorStatePayloadFromPath(stateFilePath);
        });
      }
      return loadEditorStatePayloadFromPath(stateFilePath);
    }

    function buildEditorStatePayload() {
      return {
        version: 1,
        page: stablePageKey,
        updatedAt: new Date().toISOString(),
        savedEdits: normalizeSavedEditsShape(savedEdits),
        imagePreviews: normalizeStringMap(loadImagePreviewMap()),
        siteCardImages: normalizeStringMap(loadSiteCardImageMap())
      };
    }

    function applyEditorStatePayload(payload) {
      if (!payload || typeof payload !== 'object') return false;
      savedEdits = normalizeSavedEditsShape(payload.savedEdits || payload.edits || null);
      try { localStorage.setItem(IMAGE_PREVIEW_KEY, JSON.stringify(normalizeStringMap(payload.imagePreviews))); } catch (e) {}
      try { localStorage.setItem(SITE_CARD_IMAGES_KEY, JSON.stringify(normalizeStringMap(payload.siteCardImages))); } catch (e) {}
      persistSavedEdits(false);
      writeLocalMeta(payload.updatedAt || '');
      return true;
    }

    function persistSavedEditsToFileNow() {
      if (!canPersistEditsToWorkspace()) return;
      fetch(EDITOR_STATE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildEditorStatePayload())
      }).catch(function () {});
    }

    function schedulePersistSavedEditsToFile() {
      if (!canPersistEditsToWorkspace()) return;
      if (filePersistTimer !== null) {
        clearTimeout(filePersistTimer);
      }
      filePersistTimer = window.setTimeout(function () {
        filePersistTimer = null;
        persistSavedEditsToFileNow();
      }, FILE_PERSIST_DEBOUNCE_MS);
    }

    function deletePersistedEditorStateFile() {
      if (!canPersistEditsToWorkspace()) return;
      fetch(EDITOR_STATE_API, { method: 'DELETE' }).catch(function () {});
    }

    function loadSavedEdits() {
      try {
        var raw = localStorage.getItem(storageKey);
        if (!raw) {
          var legacyKey = findLegacyStorageKey();
          if (legacyKey) raw = localStorage.getItem(legacyKey);
        }
        var parsed = raw ? JSON.parse(raw) : null;
        if (!parsed || typeof parsed !== 'object') return { text: {}, images: {}, deleted: {} };
        if (!parsed.text || typeof parsed.text !== 'object') parsed.text = {};
        if (!parsed.images || typeof parsed.images !== 'object') parsed.images = {};
        if (!parsed.deleted || typeof parsed.deleted !== 'object') parsed.deleted = {};
        if (!localStorage.getItem(storageKey)) {
          try { localStorage.setItem(storageKey, JSON.stringify(parsed)); } catch (e) {}
        }
        return parsed;
      } catch (e) {
        return { text: {}, images: {}, deleted: {} };
      }
    }

    function loadSavedEditsFromDb() {
      return openImageDb().then(function (db) {
        return dbGetValue(db, storageManifestKey).then(function (raw) {
          if ((!raw || typeof raw !== 'string') && legacyStorageKey !== storageKey) {
            return dbGetValue(db, legacyStorageKey + '::manifest').then(function (legacyRaw) {
              if (typeof legacyRaw !== 'string' || !legacyRaw) return null;
              try {
                var legacyParsed = JSON.parse(legacyRaw);
                if (!legacyParsed || typeof legacyParsed !== 'object') return null;
                if (!legacyParsed.text || typeof legacyParsed.text !== 'object') legacyParsed.text = {};
                if (!legacyParsed.images || typeof legacyParsed.images !== 'object') legacyParsed.images = {};
                if (!legacyParsed.deleted || typeof legacyParsed.deleted !== 'object') legacyParsed.deleted = {};
                dbPutValue(db, storageManifestKey, legacyRaw);
                return legacyParsed;
              } catch (e) {
                return null;
              }
            });
          }
          if (typeof raw !== 'string' || !raw) return null;
          try {
            var parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return null;
            if (!parsed.text || typeof parsed.text !== 'object') parsed.text = {};
            if (!parsed.images || typeof parsed.images !== 'object') parsed.images = {};
            if (!parsed.deleted || typeof parsed.deleted !== 'object') parsed.deleted = {};
            return parsed;
          } catch (e) {
            return null;
          }
        });
      });
    }

    var savedEdits = { text: {}, images: {}, deleted: {} };

    function persistSavedEdits(updateMeta) {
      try {
        var serialized = JSON.stringify(savedEdits);
        localStorage.setItem(storageKey, serialized);
        if (updateMeta !== false) writeLocalMeta();
        return true;
      } catch (e) {
        return false;
      }
    }

    function persistSavedEditsToDb() {
      openImageDb().then(function (db) {
        if (!db) return;
        var serialized = JSON.stringify(savedEdits);
        dbPutValue(db, storageManifestKey, serialized);
      });
    }

    function persistSavedEditsReliable() {
      if (persistSavedEdits()) {
        persistSavedEditsToDb();
        schedulePersistSavedEditsToFile();
        return true;
      }
      if (!window.indexedDB) return false;
      persistSavedEditsToDb();
      schedulePersistSavedEditsToFile();
      return true;
    }

    function normalizeSavedText(value) {
      if (typeof value !== 'string') return '';
      var temp = document.createElement('div');
      temp.innerHTML = value;
      return temp.textContent || temp.innerText || '';
    }

    function clearSavedEdits(shouldReload) {
      var imageRefs = Object.keys(savedEdits.images || {}).map(function (key) {
        return savedEdits.images[key];
      });
      savedEdits = { text: {}, images: {}, deleted: {} };
      localStorage.removeItem(storageKey);
      if (legacyStorageKey !== storageKey) localStorage.removeItem(legacyStorageKey);
      localStorage.removeItem(SITE_CARD_IMAGES_KEY);
      localStorage.removeItem(IMAGE_PREVIEW_KEY);
      localStorage.removeItem(STORAGE_META_KEY);
      if (legacyStorageKey !== storageKey) localStorage.removeItem(legacyStorageKey + '::image-previews');
      imageObjectUrls.forEach(function (url) { URL.revokeObjectURL(url); });
      imageObjectUrls.clear();
      deletePersistedEditorStateFile();

      openImageDb().then(function (db) {
        if (!db) return;
        dbDeleteValue(db, storageManifestKey);
        if (legacyStorageKey !== storageKey) dbDeleteValue(db, legacyStorageKey + '::manifest');
        imageRefs.forEach(function (ref) {
          var blobKey = imageRefToBlobKey(ref);
          if (blobKey) dbDeleteBlob(db, blobKey);
          var siteCardId = imageRefToSiteCardId(ref);
          if (siteCardId) dbDeleteBlob(db, makeSiteCardBlobKey(siteCardId));
        });
      });

      if (shouldReload) location.reload();
    }

    function getEditableNodes() {
      return Array.prototype.filter.call(document.querySelectorAll(editableSelector), function (node) {
        return isEditableElement(node);
      });
    }

    function getElementIndexWithinType(node, includeSiteReviewCarousel) {
      var index = 1;
      var sibling = node;
      while (sibling && sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling;
        if (!includeSiteReviewCarousel && sibling.classList && sibling.classList.contains('site-review-carousel')) continue;
        if (sibling.tagName === node.tagName) index += 1;
      }
      return index;
    }

    function buildAutoEditId(node, includeSiteReviewCarousel, useLegacyPathname) {
      if (!node || !node.tagName) return '';
      var parts = [];
      var current = node;
      while (current && current !== document.body && current.tagName) {
        parts.unshift(current.tagName.toLowerCase() + ':' + getElementIndexWithinType(current, includeSiteReviewCarousel));
        current = current.parentElement;
      }
      return 'auto:' + (useLegacyPathname ? normalizedPathname : stablePageKey) + ':' + parts.join('/');
    }

    function ensureStableEditId(node) {
      if (!node || !node.tagName) return '';
      if (node.dataset.editId) return node.dataset.editId;

      var stableId = buildAutoEditId(node, false, false);
      node.dataset.editId = stableId;
      return stableId;
    }

    function findNodeByAutoEditId(editId) {
      var nodes = getEditableNodes();
      for (var i = 0; i < nodes.length; i += 1) {
        var node = nodes[i];
        if (!node || !node.tagName) continue;
        var currentId = ensureStableEditId(node);
        if (currentId === editId) return node;
        var legacyId = buildAutoEditId(node, true, true);
        if (legacyId === editId) return node;
        var legacyAltId = buildAutoEditId(node, false, true);
        if (legacyAltId === editId) return node;
      }
      return null;
    }

    function moveSavedKey(map, oldKey, newKey) {
      if (!map || !Object.prototype.hasOwnProperty.call(map, oldKey)) return false;
      if (!Object.prototype.hasOwnProperty.call(map, newKey)) {
        map[newKey] = map[oldKey];
      }
      delete map[oldKey];
      return true;
    }

    function migrateSavedAutoKeys() {
      var dirty = false;
      var mergedKeys = {};
      Object.keys(savedEdits.text || {}).forEach(function (k) { mergedKeys[k] = true; });
      Object.keys(savedEdits.images || {}).forEach(function (k) { mergedKeys[k] = true; });
      Object.keys(savedEdits.deleted || {}).forEach(function (k) { mergedKeys[k] = true; });

      Object.keys(mergedKeys).forEach(function (key) {
        if (typeof key !== 'string' || key.indexOf('id:auto:') !== 0) return;
        var node = getNodeByKey(key);
        if (!node) return;
        var canonicalKey = getNodeKey(node);
        if (!canonicalKey || canonicalKey === key) return;
        var changed = false;
        changed = moveSavedKey(savedEdits.text, key, canonicalKey) || changed;
        changed = moveSavedKey(savedEdits.images, key, canonicalKey) || changed;
        changed = moveSavedKey(savedEdits.deleted, key, canonicalKey) || changed;
        if (changed) dirty = true;
      });

      return dirty;
    }

    function getNodeKey(node) {
      if (node.dataset.editKey) return node.dataset.editKey;
      var stableId = ensureStableEditId(node);
      if (stableId) {
        node.dataset.editKey = 'id:' + stableId;
        return node.dataset.editKey;
      }
      var nodes = getEditableNodes();
      var idx = nodes.indexOf(node);
      if (idx < 0) return null;
      node.dataset.editKey = String(idx);
      return node.dataset.editKey;
    }

    function escapeAttributeValue(value) {
      return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    function getNodeByKey(key) {
      if (typeof key === 'string' && key.indexOf('id:') === 0) {
        var editId = key.slice(3);
        if (!editId) return null;
        var direct = document.querySelector('[data-edit-id="' + escapeAttributeValue(editId) + '"]');
        if (direct) return direct;
        if (editId.indexOf('auto:') === 0) {
          return findNodeByAutoEditId(editId);
        }
        return null;
      }
      var idx = parseInt(key, 10);
      if (isNaN(idx)) return null;
      var nodes = getEditableNodes();
      return nodes[idx] || null;
    }

    function isProtectedSiteCardImageKey(key) {
      return typeof key === 'string' && /^id:sites-card-photo-\d+$/.test(key);
    }

    function isProtectedMediaTextNode(node) {
      if (!node || node.tagName !== 'A') return false;
      if (node.classList.contains('site-row')) return true;
      if (node.classList.contains('corner-row')) return true;
      if (node.classList.contains('sblock__media')) return true;
      if (node.classList.contains('g-tile')) return true;
      if (node.classList.contains('gallery__tile')) return true;
      if (node.classList.contains('other-card__media')) return true;
      if (node.classList.contains('hero__media')) return true;
      if (node.classList.contains('page-hero__media')) return true;
      if (node.classList.contains('chero__media')) return true;
      if (node.classList.contains('bhero__media')) return true;
      if (node.classList.contains('land-strip__media')) return true;
      if (node.classList.contains('land-night__media')) return true;
      return !!node.querySelector('img');
    }

    function applySavedEdits() {
      var storageDirty = false;
      var siteCardImageMap = loadSiteCardImageMap();
      var imagePreviewMap = loadImagePreviewMap();

      if (migrateSavedAutoKeys()) {
        storageDirty = true;
      }

      Object.keys(siteCardImageMap).forEach(function (editId) {
        var node = document.querySelector('[data-edit-id="' + escapeAttributeValue(editId) + '"]');
        if (!node || node.tagName !== 'IMG') return;
        var key = 'id:' + editId;
        if (savedEdits.deleted[key]) return;
        var src = siteCardImageMap[editId];
        if (typeof src === 'string' && src.indexOf('data:image/') === 0) {
          setImageSource(node, key, src);
        }
      });

      Object.keys(savedEdits.deleted || {}).forEach(function (key) {
        if (!savedEdits.deleted[key]) return;
        if (!isProtectedSiteCardImageKey(key)) return;
        delete savedEdits.deleted[key];
        storageDirty = true;
      });

      Object.keys(savedEdits.text).forEach(function (key) {
        var node = getNodeByKey(key);
        if (savedEdits.deleted[key]) return;
        if (node && isProtectedMediaTextNode(node)) {
          delete savedEdits.text[key];
          storageDirty = true;
          return;
        }
        if (node && /^\d+$/.test(String(key))) {
          var migratedKey = getNodeKey(node);
          if (migratedKey && migratedKey !== key && !Object.prototype.hasOwnProperty.call(savedEdits.text, migratedKey)) {
            savedEdits.text[migratedKey] = savedEdits.text[key];
          }
          delete savedEdits.text[key];
          key = migratedKey || key;
          storageDirty = true;
        }
        var normalized = normalizeSavedText(savedEdits.text[key]);
        if (savedEdits.text[key] !== normalized) {
          savedEdits.text[key] = normalized;
          storageDirty = true;
        }
        if (node) node.textContent = normalized;
      });

      Object.keys(savedEdits.images).forEach(function (key) {
        var node = getNodeByKey(key);
        if (savedEdits.deleted[key]) return;
        if (!node || node.tagName !== 'IMG') return;
        var imageRef = savedEdits.images[key];
        var previewSrc = imagePreviewMap[key];
        if (typeof previewSrc === 'string' && previewSrc.indexOf('data:image/') === 0) {
          setImageSource(node, key, previewSrc);
        }
        var siteCardId = imageRefToSiteCardId(imageRef);
        if (siteCardId) {
          var siteCardSrc = siteCardImageMap[siteCardId];
          if (typeof siteCardSrc === 'string' && siteCardSrc.indexOf('data:image/') === 0) {
            setImageSource(node, key, siteCardSrc);
          }
          openImageDb().then(function (db) {
            dbGetBlob(db, makeSiteCardBlobKey(siteCardId)).then(function (blob) {
              if (!blob) {
                if (typeof siteCardSrc === 'string' && siteCardSrc.indexOf('data:image/') === 0) return;
                delete savedEdits.images[key];
                removeSiteCardImage(siteCardId);
                if (persistSavedEdits()) setImageSource(node, key, node.getAttribute('src'));
                return;
              }
              revokeImageObjectUrl(key);
              var siteCardUrl = URL.createObjectURL(blob);
              imageObjectUrls.set(key, siteCardUrl);
              setImageSource(node, key, siteCardUrl);
            });
          });
          return;
        }
        var blobKey = imageRefToBlobKey(imageRef);
        if (blobKey) {
          openImageDb().then(function (db) {
            dbGetBlob(db, blobKey).then(function (blob) {
              if (!blob) {
                if (isProtectedSiteCardImageKey(key)) {
                  var protectedEditId = key.slice(3);
                  var protectedFallback = siteCardImageMap[protectedEditId];
                  if (typeof protectedFallback === 'string' && protectedFallback.indexOf('data:image/') === 0) {
                    setImageSource(node, key, protectedFallback);
                    return;
                  }
                }
                if (typeof previewSrc === 'string' && previewSrc.indexOf('data:image/') === 0) {
                  setImageSource(node, key, previewSrc);
                  return;
                }
                delete savedEdits.images[key];
                if (persistSavedEdits()) setImageSource(node, key, node.getAttribute('src'));
                return;
              }
              revokeImageObjectUrl(key);
              var objectUrl = URL.createObjectURL(blob);
              imageObjectUrls.set(key, objectUrl);
              setImageSource(node, key, objectUrl);
            });
          });
          return;
        }
        setImageSource(node, key, imageRef);
      });

      Object.keys(savedEdits.deleted)
        .sort(function (a, b) {
          var aNum = /^\d+$/.test(a);
          var bNum = /^\d+$/.test(b);
          if (aNum && bNum) return Number(b) - Number(a);
          if (aNum) return -1;
          if (bNum) return 1;
          return a.localeCompare(b);
        })
        .forEach(function (key) {
          if (!savedEdits.deleted[key]) return;
          var node = getNodeByKey(key);
          if (node && node.parentNode) {
            node.parentNode.removeChild(node);
          }
        });

      if (storageDirty) persistSavedEdits();
    }

    function blobIsRenderable(blob) {
      return new Promise(function (resolve) {
        if (!blob) {
          resolve(false);
          return;
        }
        if (blob.type && blob.type.indexOf('image/') !== 0) {
          resolve(false);
          return;
        }

        var probeUrl = URL.createObjectURL(blob);
        var probe = new Image();
        probe.onload = function () {
          var ok = (probe.naturalWidth || 0) > 1 && (probe.naturalHeight || 0) > 1;
          URL.revokeObjectURL(probeUrl);
          resolve(ok);
        };
        probe.onerror = function () {
          URL.revokeObjectURL(probeUrl);
          resolve(false);
        };
        probe.src = probeUrl;
      });
    }

    function prepareEditedImage(file, options) {
      return new Promise(function (resolve) {
        var opts = options || {};
        var maxSize = opts.maxSize || 1800;
        var forceJpeg = !!opts.forceJpeg;
        var objectUrl = URL.createObjectURL(file);
        var image = new Image();
        var outputMime = forceJpeg ? 'image/jpeg' : (file.type === 'image/png' ? 'image/png' : 'image/jpeg');

        image.onload = function () {
          var width = image.naturalWidth || image.width;
          var height = image.naturalHeight || image.height;
          var scale = Math.min(1, maxSize / Math.max(width, height));
          var canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(width * scale));
          canvas.height = Math.max(1, Math.round(height * scale));

          var context = canvas.getContext('2d');
          if (!context) {
            URL.revokeObjectURL(objectUrl);
            resolve({ blob: file, dataUrl: null });
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(objectUrl);
          canvas.toBlob(function (blob) {
            if (!blob) {
              resolve(file);
              return;
            }
            resolve(blob);
          }, outputMime, outputMime === 'image/jpeg' ? (forceJpeg ? 0.74 : 0.86) : undefined);
        };

        image.onerror = function () {
          URL.revokeObjectURL(objectUrl);
          resolve(file);
        };

        image.src = objectUrl;
      });
    }

    function prepareImagePreview(blob, options) {
      return new Promise(function (resolve) {
        if (!blob) {
          resolve('');
          return;
        }

        var opts = options || {};
        var maxSize = opts.maxSize || 720;
        var quality = typeof opts.quality === 'number' ? opts.quality : 0.6;
        var objectUrl = URL.createObjectURL(blob);
        var image = new Image();

        image.onload = function () {
          var width = image.naturalWidth || image.width;
          var height = image.naturalHeight || image.height;
          var scale = Math.min(1, maxSize / Math.max(width, height));
          var canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(width * scale));
          canvas.height = Math.max(1, Math.round(height * scale));
          var context = canvas.getContext('2d');
          if (!context) {
            URL.revokeObjectURL(objectUrl);
            resolve('');
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(objectUrl);
          canvas.toBlob(function (previewBlob) {
            if (!previewBlob) {
              resolve('');
              return;
            }
            blobToDataUrl(previewBlob).then(resolve);
          }, 'image/jpeg', quality);
        };

        image.onerror = function () {
          URL.revokeObjectURL(objectUrl);
          resolve('');
        };

        image.src = objectUrl;
      });
    }

    function applyEditedImage(activeImg, blob) {
      var key = getNodeKey(activeImg);
      if (!key) return;
      var protectedSiteCard = isProtectedSiteCardImageKey(key);
      var previewEligible = isPreviewEligibleImage(activeImg);
      var bannerLike = isBannerLikeImage(activeImg);
      if (savedEdits.deleted[key]) delete savedEdits.deleted[key];

      var oldBlobKey = imageRefToBlobKey(savedEdits.images[key]);
      var oldSiteCardId = imageRefToSiteCardId(savedEdits.images[key]);
      var previousImageRef = savedEdits.images[key];

      function finalizeOldBlobCleanup() {
        openImageDb().then(function (db) {
          if (!db) return;
          if (oldBlobKey && oldBlobKey !== makeImageBlobKey(key)) {
            dbDeleteBlob(db, oldBlobKey);
          }
          if (oldSiteCardId) {
            dbDeleteBlob(db, makeSiteCardBlobKey(oldSiteCardId));
          }
        });
      }

      function commitImage(newBlob) {
        var blobKey = makeImageBlobKey(key);

        if (protectedSiteCard) {
          var editId = key.slice(3);
          prepareImagePreview(newBlob, { maxSize: 560, quality: 0.58 }).then(function (previewDataUrl) {
            if (!previewDataUrl) {
              if (previousImageRef) setImageSource(activeImg, key, previousImageRef);
              window.alert('Image change could not be saved. Please use a different image file.');
              return;
            }

            savedEdits.images[key] = SITE_CARD_REF_PREFIX + editId;
            setImageSource(activeImg, key, previewDataUrl);

            var map = loadSiteCardImageMap();
            map[editId] = previewDataUrl;
            persistSiteCardImageMap(map);

            if (!persistSavedEditsReliable()) {
              savedEdits.images[key] = previousImageRef;
              if (previousImageRef) setImageSource(activeImg, key, previousImageRef);
              window.alert('Image change could not be saved. Please use a smaller image file.');
              return;
            }

            finalizeOldBlobCleanup();

            openImageDb().then(function (db) {
              if (!db) return;
              dbPutBlob(db, makeSiteCardBlobKey(editId), newBlob).then(function (saved) {
                if (!saved) {
                  window.alert('Image change could not be saved. Please use a different image file.');
                }
              });
            });
          });
          return;
        }

        openImageDb().then(function (db) {
          if (!db || !newBlob) {
            if (previousImageRef) setImageSource(activeImg, key, previousImageRef);
            window.alert('Image change could not be saved. Please use a different image file.');
            return;
          }

          dbPutBlob(db, blobKey, newBlob).then(function (saved) {
            if (saved) {
              savedEdits.images[key] = IMAGE_REF_PREFIX + blobKey;
              revokeImageObjectUrl(key);
              var objectUrl = URL.createObjectURL(newBlob);
              imageObjectUrls.set(key, objectUrl);
              setImageSource(activeImg, key, objectUrl);

              if (previewEligible) {
                prepareImagePreview(newBlob, {
                  maxSize: bannerLike ? 960 : 520,
                  quality: bannerLike ? 0.68 : 0.58
                }).then(function (previewDataUrl) {
                  if (!previewDataUrl) return;
                  var previewMap = loadImagePreviewMap();
                  previewMap[key] = previewDataUrl;
                  persistImagePreviewMap(previewMap);
                });
              } else {
                removeImagePreview(key);
              }

              if (!persistSavedEditsReliable()) {
                savedEdits.images[key] = previousImageRef;
                if (previousImageRef) setImageSource(activeImg, key, previousImageRef);
                window.alert('Image change could not be saved. Please use a smaller image file.');
              } else {
                finalizeOldBlobCleanup();
              }
              return;
            }

            if (previousImageRef) setImageSource(activeImg, key, previousImageRef);
            window.alert('Image change could not be saved. Please use a different image file.');
            finalizeOldBlobCleanup();
          });
        });
      }

      if (!blob) {
        commitImage(null);
        return;
      }

      blobIsRenderable(blob).then(function (ok) {
        if (ok) {
          commitImage(blob);
          return;
        }
        window.alert('Selected image could not be rendered. Please choose a JPG, PNG, or WEBP file.');
      });
    }

    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file || !activeImage) return;
      var targetImage = activeImage;
      var targetKey = getNodeKey(targetImage);
      var protectedTarget = isProtectedSiteCardImageKey(targetKey);
      var bannerTarget = isBannerLikeImage(targetImage);
      prepareEditedImage(file, {
        maxSize: protectedTarget ? 900 : (bannerTarget ? 1600 : 1200),
        forceJpeg: protectedTarget || isPreviewEligibleImage(targetImage)
      }).then(function (prepared) {
        applyEditedImage(targetImage, prepared || file);
      });
      fileInput.value = '';
    });

    function isEditableElement(el) {
      return !el.closest(NON_EDITABLE_CONTAINER_SELECTOR);
    }

    function applyEditableClasses(enable) {
      var selectors = ['h1','h2','h3','h4','h5','h6','p','li','blockquote','figcaption','dt','dd','strong','em','b','i','span','a'];
      var nodes = document.querySelectorAll(selectors.join(','));
      Array.prototype.forEach.call(nodes, function (node) {
        if (!isEditableElement(node)) return;
        if (isProtectedMediaTextNode(node)) return;
        getNodeKey(node);
        if (enable) {
          node.setAttribute('contenteditable', 'true');
          node.classList.add('editable');
          if (!node.dataset.editOriginal) {
            node.dataset.editOriginal = node.innerHTML;
          }
        } else {
          node.removeAttribute('contenteditable');
          node.classList.remove('editable');
        }
      });
    }

    function applyImageEditableClasses(enable) {
      var images = document.querySelectorAll('img');
      Array.prototype.forEach.call(images, function (img) {
        if (!isEditableElement(img)) return;
        if (enable) {
          img.classList.add('editable-image');
        } else {
          img.classList.remove('editable-image');
        }
      });
    }

    function attachEditListeners() {
      var selectors = ['h1','h2','h3','h4','h5','h6','p','li','blockquote','figcaption','dt','dd','strong','em','b','i','span','a'];
      var nodes = document.querySelectorAll(selectors.join(','));
      Array.prototype.forEach.call(nodes, function (node) {
        if (!isEditableElement(node)) return;
        if (isProtectedMediaTextNode(node)) return;
        function saveTextEdit() {
          var key = getNodeKey(node);
          if (!key) return;
          if (savedEdits.deleted[key]) delete savedEdits.deleted[key];
          savedEdits.text[key] = node.textContent;
          // Keep text edits recoverable even if localStorage is at quota.
          persistSavedEdits();
          persistSavedEditsToDb();
          schedulePersistSavedEditsToFile();
        }

        node.addEventListener('input', saveTextEdit);
        node.addEventListener('blur', function () {
          if (node.innerHTML.trim() === '') {
            node.innerHTML = node.dataset.editOriginal || '';
          }
          saveTextEdit();
        });
      });
    }

    function attachImageEditListeners() {
      var images = document.querySelectorAll('img');
      Array.prototype.forEach.call(images, function (img) {
        if (!isEditableElement(img)) return;
        img.addEventListener('click', function (event) {
          if (!document.body.classList.contains('edit-mode')) return;
          event.preventDefault();
          activeImage = img;
          fileInput.click();
        });
      });

      function findEditableImageFromTarget(target) {
        if (!target) return null;
        var directImage = target.closest('img');
        if (directImage && isEditableElement(directImage)) return directImage;

        var media = target.closest(EDITABLE_MEDIA_SELECTOR);
        if (!media) return null;
        var image = media.matches('img') ? media : media.querySelector('img.cover, img');
        if (!image || !isEditableElement(image)) return null;
        return image;
      }

      function findBannerImage(target) {
        var banner = target.closest(BANNER_MEDIA_SELECTOR);
        if (!banner) return null;
        var img = banner.matches('img') ? banner : banner.querySelector('img.cover, img');
        if (!img || !isEditableElement(img)) return null;
        return img;
      }

      document.addEventListener('click', function (event) {
        if (!document.body.classList.contains('edit-mode')) return;
        if (event.target.closest('.edit-delete-fab')) return;

        var mediaImage = findEditableImageFromTarget(event.target);
        if (mediaImage && event.target !== mediaImage) {
          event.preventDefault();
          activeImage = mediaImage;
          fileInput.click();
          return;
        }

        if (event.target.closest('a,button,input,textarea,select,label,[contenteditable="true"]')) return;

        var bannerImage = findBannerImage(event.target);
        if (!bannerImage) return;
        if (event.target === bannerImage) return;
        event.preventDefault();
        activeImage = bannerImage;
        fileInput.click();
      });
    }

    function preventLinkNavigationWhileEditing() {
      document.addEventListener('click', function (event) {
        if (!document.body.classList.contains('edit-mode')) return;
        if (event.target.closest('.edit-delete-fab')) return;
        var link = event.target.closest('a');
        if (!link) return;
        event.preventDefault();
      }, true);
    }

    function hideDeleteFab() {
      activeDeleteTarget = null;
      deleteFab.style.display = 'none';
    }

    function showDeleteFab(target) {
      if (!target || !isEditableElement(target)) return;
      activeDeleteTarget = target;
      var r = target.getBoundingClientRect();
      deleteFab.style.left = Math.max(8, Math.min(window.innerWidth - 38, r.right - 15)) + 'px';
      deleteFab.style.top = Math.max(8, r.top - 15) + 'px';
      deleteFab.style.display = 'flex';
    }

    function attachHoverDeleteListeners() {
      document.addEventListener('mouseover', function (event) {
        if (!document.body.classList.contains('edit-mode')) return;
        if (event.target.closest('.edit-delete-fab')) return;
        var target = event.target.closest('.editable, .editable-image, [contenteditable]');
        if (!target || !isEditableElement(target)) return;
        showDeleteFab(target);
      });

      document.addEventListener('scroll', function () {
        if (!document.body.classList.contains('edit-mode')) return;
        if (activeDeleteTarget) showDeleteFab(activeDeleteTarget);
      }, { passive: true });

      window.addEventListener('resize', function () {
        if (!document.body.classList.contains('edit-mode')) return;
        if (activeDeleteTarget) showDeleteFab(activeDeleteTarget);
      });

      document.addEventListener('click', function (event) {
        if (!document.body.classList.contains('edit-mode')) return;
        if (event.target.closest('.edit-delete-fab')) return;
        var target = event.target.closest('.editable, .editable-image, [contenteditable]');
        if (!target) hideDeleteFab();
      });

      deleteFab.addEventListener('click', function (event) {
        if (!document.body.classList.contains('edit-mode')) return;
        if (!activeDeleteTarget || !isEditableElement(activeDeleteTarget)) return;
        event.preventDefault();
        event.stopPropagation();
        var key = getNodeKey(activeDeleteTarget);
        if (key && activeDeleteTarget.tagName === 'IMG' && isProtectedSiteCardImageKey(key)) {
          hideDeleteFab();
          return;
        }
        if (key) {
          var existingBlobKey = imageRefToBlobKey(savedEdits.images[key]);
          var existingSiteCardId = imageRefToSiteCardId(savedEdits.images[key]);
          if (existingBlobKey) {
            openImageDb().then(function (db) { dbDeleteBlob(db, existingBlobKey); });
          }
          if (existingSiteCardId) {
            openImageDb().then(function (db) { dbDeleteBlob(db, makeSiteCardBlobKey(existingSiteCardId)); });
          }
          revokeImageObjectUrl(key);
          savedEdits.deleted[key] = true;
          delete savedEdits.text[key];
          delete savedEdits.images[key];
          removeImagePreview(key);
          if (typeof key === 'string' && key.indexOf('id:') === 0) {
            removeSiteCardImage(key.slice(3));
          }
          persistSavedEdits();
          schedulePersistSavedEditsToFile();
        }
        activeDeleteTarget.remove();
        hideDeleteFab();
      });
    }

    function sanitizeHtml(source) {
      var clone = source.cloneNode(true);
      clone.querySelectorAll('[contenteditable]').forEach(function (el) { el.removeAttribute('contenteditable'); });
      clone.querySelectorAll('.editable, .editable-image').forEach(function (el) { el.classList.remove('editable', 'editable-image'); });
      return '<!DOCTYPE html>\n' + clone.outerHTML;
    }

    function downloadPage() {
      var html = sanitizeHtml(document.documentElement);
      var blob = new Blob([html], { type: 'text/html' });
      var url = URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = (location.pathname.split('/').pop() || 'page.html');
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    function toggleEditMode() {
      var active = document.body.classList.toggle('edit-mode');
      if (active) {
        applyEditableClasses(true);
        applyImageEditableClasses(true);
      } else {
        applyEditableClasses(false);
        applyImageEditableClasses(false);
        hideDeleteFab();
      }
    }

    function toggleAdminAccessAndReload() {
      var enabled = !hasAdminEditAccess();
      if (!setAdminEditAccess(enabled)) return;
      window.location.reload();
    }

    window.addEventListener('keydown', function (event) {
      if (event.ctrlKey && event.altKey && !event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        toggleAdminAccessAndReload();
        return;
      }

      if (event.altKey && event.key.toLowerCase() === 'e') {
        event.preventDefault();
        toggleEditMode();
      }

      if ((event.ctrlKey || event.metaKey) && event.altKey && !event.shiftKey && event.key.toLowerCase() === 'z') {
        if (!document.body.classList.contains('edit-mode')) return;
        event.preventDefault();
        clearSavedEdits(true);
      }
    });

    savedEdits = loadSavedEdits();
    applySavedEdits();
    markBannerImagesReady();

    loadSavedEditsFromDb().then(function (dbEdits) {
      if (hasSavedEditsContent(savedEdits)) return;
      if (!hasSavedEditsContent(dbEdits)) return;
      savedEdits = normalizeSavedEditsShape(dbEdits);
      persistSavedEdits(false);
      writeLocalMeta();
      applySavedEdits();
      markBannerImagesReady();
    });

    loadEditorStatePayload().then(function (fileLoaded) {
      if (!fileLoaded) return;

      if (shouldApplyWorkspacePayload(fileLoaded)) {
        if (!applyEditorStatePayload(fileLoaded)) return;
        applySavedEdits();
        markBannerImagesReady();
        return;
      }

      // Local edits are newer than workspace state; sync them back to disk.
      schedulePersistSavedEditsToFile();
    });
    attachEditListeners();
    attachImageEditListeners();
    attachHoverDeleteListeners();
    preventLinkNavigationWhileEditing();
  }

  if (hasAdminEditAccess()) {
    document.body.classList.add('admin-edit-enabled');
    insertEditStyles();
    setupEditMode();
  }
})();
