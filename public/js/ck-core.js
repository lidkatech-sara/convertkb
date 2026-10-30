/* ConvertKB core: lazy library loader + shared helpers. Everything runs in the browser. */
(function () {
  'use strict';
  var CK = (window.CK = window.CK || {});
  var J = 'https://cdn.jsdelivr.net/npm/', U = 'https://unpkg.com/';
  function both(p) { return [J + p, U + p]; }
  var LIBS = {
    cropper: { js: both('cropperjs@1.6.1/dist/cropper.min.js'), css: J + 'cropperjs@1.6.1/dist/cropper.min.css', ok: function () { return window.Cropper; } },
    pica: { js: both('pica@9.0.1/dist/pica.min.js'), ok: function () { return window.pica; } },
    pdfjs: { js: both('pdfjs-dist@3.11.174/build/pdf.min.js'), ok: function () { return window.pdfjsLib; } },
    pdflib: { js: both('pdf-lib@1.17.1/dist/pdf-lib.min.js'), ok: function () { return window.PDFLib; } },
    jspdf: { js: both('jspdf@2.5.1/dist/jspdf.umd.min.js'), ok: function () { return window.jspdf; } },
    jszip: { js: both('jszip@3.10.1/dist/jszip.min.js'), ok: function () { return window.JSZip; } },
    heic: { js: both('heic2any@0.0.4/dist/heic2any.min.js'), ok: function () { return window.heic2any; } },
    docx: { js: both('docx@7.8.2/build/index.js'), ok: function () { return window.docx; } },
    xlsx: { js: both('xlsx@0.18.5/dist/xlsx.full.min.js'), ok: function () { return window.XLSX; } },
    pptx: { js: both('pptxgenjs@3.12.0/dist/pptxgen.bundle.js'), ok: function () { return window.PptxGenJS; } },
    tess: { js: both('tesseract.js@5.1.1/dist/tesseract.min.js'), ok: function () { return window.Tesseract; } }
  };
  var cache = {};
  function addScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = res; s.onerror = function () { s.remove(); rej(new Error('load failed: ' + src)); };
      document.head.appendChild(s);
    });
  }
  CK.lib = function (name) {
    var L = LIBS[name];
    if (!L) return Promise.reject(new Error('Unknown library ' + name));
    if (L.ok()) return Promise.resolve(L.ok());
    if (cache[name]) return cache[name];
    if (L.css && !document.querySelector('link[data-ck="' + name + '"]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = L.css; l.dataset.ck = name; document.head.appendChild(l);
    }
    cache[name] = (async function () {
      var err;
      for (var i = 0; i < L.js.length; i++) {
        try { await addScript(L.js[i]); if (L.ok()) break; } catch (e) { err = e; }
      }
      if (!L.ok()) { delete cache[name]; throw err || new Error('Could not load ' + name); }
      if (name === 'pdfjs') window.pdfjsLib.GlobalWorkerOptions.workerSrc = J + 'pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      return L.ok();
    })();
    return cache[name];
  };
  CK.libs = function (names) { return Promise.all(names.map(CK.lib)); };

  CK.$ = function (s, r) { return (r || document).querySelector(s); };
  CK.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  CK.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  CK.fmt = function (b) { return b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB'; };
  CK.baseName = function (f) { return (f.name || 'file').replace(/\.[^.]+$/, ''); };
  CK.isHeic = function (f) { return /heic|heif/i.test(f.type || '') || /\.(heic|heif)$/i.test(f.name || ''); };
  CK.isPdf = function (f) { return f.type === 'application/pdf' || /\.pdf$/i.test(f.name || ''); };
  CK.sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  CK.toast = function (msg, type) {
    var box = CK.$('#ckToasts');
    if (!box) { box = document.createElement('div'); box.id = 'ckToasts'; box.className = 'ck-toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    var t = document.createElement('div'); t.className = 'ck-toast ' + (type || ''); t.textContent = msg; box.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 300); }, 4200);
  };

  CK.bar = function (el) {
    var fill = CK.$('.ck-bar-fill', el), lab = CK.$('.ck-bar-label', el);
    return {
      set: function (p, text) { el.hidden = false; fill.style.width = Math.max(2, Math.min(100, Math.round(p * 100))) + '%'; if (text != null) lab.textContent = text; },
      hide: function () { el.hidden = true; fill.style.width = '0%'; }
    };
  };
  CK.barHtml = '<div class="ck-bar" hidden><div class="ck-bar-track"><div class="ck-bar-fill"></div></div><div class="ck-bar-label" aria-live="polite"></div></div>';

  CK.download = function (blob, name) {
    var a = document.createElement('a'); var u = URL.createObjectURL(blob);
    a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 20000);
  };

  CK.dropzone = function (zone, input, onFiles, opts) {
    opts = opts || {};
    function accept(files) {
      files = Array.prototype.slice.call(files || []);
      if (opts.filter) files = files.filter(opts.filter);
      if (!opts.multiple) files = files.slice(0, 1);
      if (files.length) onFiles(files); else CK.toast(opts.reject || 'That file type is not supported here.', 'err');
    }
    zone.addEventListener('click', function (e) { if (!e.target.closest('[data-nodrop]')) input.click(); });
    zone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    ['dragenter', 'dragover'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('over'); }); });
    zone.addEventListener('drop', function (e) { accept(e.dataTransfer && e.dataTransfer.files); });
    input.addEventListener('change', function () { accept(input.files); input.value = ''; });
    if (opts.paste) document.addEventListener('paste', function (e) {
      var fs = []; var items = (e.clipboardData && e.clipboardData.items) || [];
      for (var i = 0; i < items.length; i++) if (items[i].kind === 'file') { var f = items[i].getAsFile(); if (f) fs.push(f); }
      if (fs.length) accept(fs);
    });
  };

  CK.toBlob = function (canvas, mime, q) {
    return new Promise(function (res, rej) { canvas.toBlob(function (b) { b ? res(b) : rej(new Error('Encoding failed')); }, mime, q); });
  };
  CK.newCanvas = function (w, h, bg) {
    var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
    if (bg) { var x = c.getContext('2d'); x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height); }
    return c;
  };
  CK.loadImage = function (blob) {
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(blob), im = new Image();
      im.onload = function () { res({ img: im, url: u }); };
      im.onerror = function () { URL.revokeObjectURL(u); rej(new Error('This image could not be read.')); };
      im.src = u;
    });
  };
  CK.heicToBlob = async function (file, mime, q) {
    await CK.lib('heic');
    var out = await window.heic2any({ blob: file, toType: mime || 'image/jpeg', quality: q == null ? 0.92 : q });
    return Array.isArray(out) ? out[0] : out;
  };
  // Decode any supported image file (HEIC included) into a canvas capped at maxSide.
  CK.fileToCanvas = async function (file, opts) {
    opts = opts || {};
    var blob = CK.isHeic(file) ? await CK.heicToBlob(file, 'image/jpeg', 0.95) : file;
    var li = await CK.loadImage(blob);
    var w = li.img.naturalWidth, h = li.img.naturalHeight, max = opts.maxSide || 6000, s = Math.min(1, max / Math.max(w, h));
    var c = CK.newCanvas(w * s, h * s, opts.bg === undefined ? '#ffffff' : opts.bg);
    var x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(li.img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(li.url);
    return c;
  };
  CK.resizeCanvas = async function (src, w, h) {
    w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
    if (src.width === w && src.height === h) return src;
    var dst = CK.newCanvas(w, h);
    try { await CK.lib('pica'); await window.pica({ features: ['js', 'wasm', 'ww'] }).resize(src, dst, { quality: 3, alpha: true }); return dst; }
    catch (e) { var x = dst.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, w, h); return dst; }
  };
  CK.toGray = function (canvas) {
    var x = canvas.getContext('2d', { willReadFrequently: true }), id = x.getImageData(0, 0, canvas.width, canvas.height), d = id.data;
    for (var i = 0; i < d.length; i += 4) { var l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; d[i] = d[i + 1] = d[i + 2] = l; }
    x.putImageData(id, 0, 0);
  };

  /* ---- file metadata helpers (DPI + padding) ---- */
  var crcT;
  function crc32(u8) {
    if (!crcT) { crcT = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; } }
    var crc = 0xffffffff; for (var i = 0; i < u8.length; i++) crc = crcT[(crc ^ u8[i]) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  function concat(parts) {
    var n = 0, i; for (i = 0; i < parts.length; i++) n += parts[i].length;
    var o = new Uint8Array(n), p = 0; for (i = 0; i < parts.length; i++) { o.set(parts[i], p); p += parts[i].length; } return o;
  }
  CK.setDpi = async function (blob, dpi) {
    if (!dpi) return blob;
    var u8 = new Uint8Array(await blob.arrayBuffer());
    if (u8[0] === 0xff && u8[1] === 0xd8) {
      if (u8[2] === 0xff && u8[3] === 0xe0 && u8[6] === 0x4a && u8[7] === 0x46) {
        u8[13] = 1; u8[14] = dpi >> 8; u8[15] = dpi & 255; u8[16] = dpi >> 8; u8[17] = dpi & 255;
        return new Blob([u8], { type: 'image/jpeg' });
      }
      var jf = new Uint8Array([0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 1, dpi >> 8, dpi & 255, dpi >> 8, dpi & 255, 0, 0]);
      return new Blob([concat([u8.subarray(0, 2), jf, u8.subarray(2)])], { type: 'image/jpeg' });
    }
    if (u8[0] === 0x89 && u8[1] === 0x50) {
      var ppm = Math.round(dpi / 0.0254), ch = new Uint8Array(21), dv = new DataView(ch.buffer);
      dv.setUint32(0, 9); ch.set([0x70, 0x48, 0x59, 0x73], 4); dv.setUint32(8, ppm); dv.setUint32(12, ppm); ch[16] = 1; dv.setUint32(17, crc32(ch.subarray(4, 17)));
      return new Blob([concat([u8.subarray(0, 33), ch, u8.subarray(33)])], { type: 'image/png' });
    }
    return blob;
  };
  // Grow a JPEG to at least minBytes using harmless COM (comment) segments.
  CK.padJpeg = async function (blob, minBytes) {
    if (blob.size >= minBytes) return blob;
    var u8 = new Uint8Array(await blob.arrayBuffer());
    if (u8[0] !== 0xff || u8[1] !== 0xd8) return blob;
    var at = 2; if (u8[2] === 0xff && u8[3] === 0xe0) at = 4 + ((u8[4] << 8) | u8[5]);
    var need = minBytes - blob.size, segs = [];
    while (need > 0) {
      var data = Math.min(65533, Math.max(1, need - 4)), seg = new Uint8Array(4 + data);
      seg[0] = 0xff; seg[1] = 0xfe; seg[2] = (data + 2) >> 8; seg[3] = (data + 2) & 255; seg.fill(0x20, 4);
      segs.push(seg); need -= seg.length;
    }
    return new Blob([concat([u8.subarray(0, at)].concat(segs, [u8.subarray(at)]))], { type: 'image/jpeg' });
  };

  /* ---- layout helpers ---- */
  CK.parseRange = function (str, max) {
    str = (str || '').trim().toLowerCase();
    if (!str || str === 'all') { var a = []; for (var i = 1; i <= max; i++) a.push(i); return a; }
    var set = {};
    str.split(',').forEach(function (part) {
      var m = part.trim().match(/^(\d+)\s*(?:-\s*(\d+))?$/); if (!m) return;
      var s = +m[1], e = m[2] ? +m[2] : s; if (s > e) { var t = s; s = e; e = t; }
      for (var k = Math.max(1, s); k <= Math.min(max, e); k++) set[k] = 1;
    });
    return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
  };
  // items: [{s,x,y,w,h}] (y = top). Returns array of rows (array of cell strings), columns aligned.
  CK.itemsToGrid = function (items) {
    items = items.filter(function (i) { return i.s && String(i.s).trim(); });
    if (!items.length) return [];
    var hs = items.map(function (i) { return i.h || 10; }).sort(function (a, b) { return a - b; });
    var mh = hs[Math.floor(hs.length / 2)] || 10;
    items.sort(function (a, b) { return (a.y + a.h / 2) - (b.y + b.h / 2) || a.x - b.x; });
    var rows = [], cur = null;
    items.forEach(function (it) {
      var cy = it.y + it.h / 2;
      if (cur && Math.abs(cy - cur.cy) <= mh * 0.6) { cur.items.push(it); cur.cy = (cur.cy * (cur.items.length - 1) + cy) / cur.items.length; }
      else { cur = { cy: cy, items: [it] }; rows.push(cur); }
    });
    var gap = mh * 1.6;
    var cellRows = rows.map(function (r) {
      r.items.sort(function (a, b) { return a.x - b.x; });
      var cells = [], c = null;
      r.items.forEach(function (it) {
        if (c && it.x - c.x1 <= gap) { c.s += (it.x - c.x1 > mh * 0.15 ? ' ' : '') + it.s; c.x1 = it.x + it.w; }
        else { c = { s: it.s, x0: it.x, x1: it.x + it.w }; cells.push(c); }
      });
      return cells;
    });
    var xs = []; cellRows.forEach(function (cs) { cs.forEach(function (c) { xs.push(c.x0); }); });
    xs.sort(function (a, b) { return a - b; });
    var anchors = [], tol = mh * 1.8;
    xs.forEach(function (x) { var l = anchors[anchors.length - 1]; if (l && x - l.max <= tol) { l.sum += x; l.n++; l.max = x; } else anchors.push({ sum: x, n: 1, max: x }); });
    var cols = anchors.map(function (a) { return a.sum / a.n; });
    return cellRows.map(function (cs) {
      var row = new Array(cols.length).fill('');
      cs.forEach(function (c) {
        var best = 0, bd = 1e12; cols.forEach(function (cx, i) { var d = Math.abs(cx - c.x0); if (d < bd) { bd = d; best = i; } });
        row[best] = row[best] ? row[best] + ' ' + c.s : c.s;
      });
      return row;
    });
  };

  /* ---- PDF + OCR helpers ---- */
  CK.openPdf = async function (file) {
    await CK.lib('pdfjs');
    var data = new Uint8Array(await file.arrayBuffer()), pw;
    for (var tries = 0; tries < 3; tries++) {
      try { return { doc: await window.pdfjsLib.getDocument({ data: data.slice(), password: pw }).promise, bytes: data }; }
      catch (e) {
        if (e && e.name === 'PasswordException') { pw = window.prompt('This PDF is password protected. Enter the password:'); if (pw == null) throw new Error('Password required.'); }
        else throw e;
      }
    }
    throw new Error('Wrong password.');
  };
  CK.renderPage = async function (page, scale, maxSide) {
    var vp = page.getViewport({ scale: scale });
    if (maxSide && Math.max(vp.width, vp.height) > maxSide) vp = page.getViewport({ scale: scale * maxSide / Math.max(vp.width, vp.height) });
    var c = CK.newCanvas(vp.width, vp.height, '#ffffff');
    await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
    return c;
  };
  CK.pageItems = async function (page) {
    var vp = page.getViewport({ scale: 1 }), tc = await page.getTextContent(), out = [];
    tc.items.forEach(function (it) {
      if (!it.str || !it.str.trim()) return;
      var h = Math.abs(it.height) || Math.abs(it.transform[3]) || 10;
      out.push({ s: it.str, x: it.transform[4], y: vp.height - it.transform[5] - h, w: it.width, h: h });
    });
    return out;
  };
  CK.makeOcr = async function (lang, onProg) {
    await CK.lib('tess');
    var worker = await window.Tesseract.createWorker(lang || 'eng', 1, { logger: function (m) { if (onProg && m.status === 'recognizing text') onProg(m.progress); } });
    return {
      read: async function (src) {
        var data = (await worker.recognize(src)).data;
        var words = data.words || (data.blocks || []).flatMap(function (b) { return (b.paragraphs || []).flatMap(function (p) { return (p.lines || []).flatMap(function (l) { return l.words || []; }); }); });
        return {
          text: (data.text || '').trim(),
          items: words.map(function (w) { return { s: w.text, x: w.bbox.x0, y: w.bbox.y0, w: w.bbox.x1 - w.bbox.x0, h: w.bbox.y1 - w.bbox.y0 }; })
        };
      },
      end: function () { return worker.terminate(); }
    };
  };
  CK.OCR_LANGS = [['eng', 'English'], ['hin', 'Hindi'], ['tam', 'Tamil'], ['tel', 'Telugu'], ['ben', 'Bengali'], ['mar', 'Marathi'], ['guj', 'Gujarati'], ['kan', 'Kannada'], ['mal', 'Malayalam'], ['eng+hin', 'English + Hindi']];
  CK.langOptions = function () { return CK.OCR_LANGS.map(function (l) { return '<option value="' + l[0] + '">' + l[1] + '</option>'; }).join(''); };
  CK.zip = async function (files) {
    await CK.lib('jszip'); var z = new window.JSZip();
    files.forEach(function (f) { z.file(f.name, f.blob); });
    return z.generateAsync({ type: 'blob' });
  };
  CK.icon = {
    upload: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>',
    down: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12m0 0 5-5m-5 5-5-5"/><path d="M5 20h14"/></svg>'
  };
})();
