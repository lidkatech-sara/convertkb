/* PDF compressor / resizer. mode: compress | resize */
(function () {
  'use strict';
  var root = document.getElementById('ck-tool');
  if (!root || root.dataset.tool !== 'pdf') return;
  var cfg = JSON.parse(root.dataset.config || '{}');
  var mode = cfg.mode || 'compress';
  var S = { file: null, doc: null, bytes: null, n: 0, out: null };
  var SIZES = { a4: [595.28, 841.89], a3: [841.89, 1190.55], a5: [419.53, 595.28], letter: [612, 792], legal: [612, 1008] };

  root.innerHTML =
    '<div class="ck-tool ck-pdf"><div class="ck-stage">' +
    '<div class="ck-drop" id="d" tabindex="0" role="button" aria-label="Choose a PDF"><div class="ck-drop-ic">' + CK.icon.upload + '</div>' +
    '<strong>Drop your PDF here</strong><span>or click to browse &middot; scanned or digital &middot; password-protected files will ask for the password</span>' +
    '<input type="file" id="f" accept="application/pdf,.pdf" hidden></div>' +
    '<div class="ck-pdfinfo" id="info" hidden><div class="ck-pdfhead"><div><strong id="fn"></strong><span id="fm"></span></div><button type="button" class="ck-chip" id="chg">Change file</button></div><div class="ck-thumbs" id="th"></div></div></div>' +
    '<aside class="ck-panel"><div class="ck-group"><h3>Target file size</h3><div class="ck-row">' +
    '<div class="ck-field"><label for="tv">Maximum</label><input type="number" id="tv" min="5" value="' + (cfg.targetKb && cfg.targetKb >= 1024 && cfg.targetKb % 1024 === 0 ? cfg.targetKb / 1024 : cfg.targetKb || 200) + '"></div>' +
    '<div class="ck-field"><label for="tu">Unit</label><select id="tu"><option>KB</option><option>MB</option></select></div></div>' +
    '<div class="ck-field"><label for="md">Method</label><select id="md"><option value="auto">Smart (keep text if possible)</option><option value="raster">Rebuild pages as images (smallest)</option><option value="light">Keep text only (no rebuild)</option></select></div>' +
    '<p class="ck-hint">Rebuilding pages as images gives the biggest savings on scans, but text can no longer be selected.</p></div>' +
    (mode === 'resize' ? '<div class="ck-group"><h3>Page size</h3><div class="ck-row"><div class="ck-field"><label for="ps">Resize pages to</label><select id="ps"><option value="orig">Keep original size</option><option value="a4">A4</option><option value="a3">A3</option><option value="a5">A5</option><option value="letter">US Letter</option><option value="legal">US Legal</option></select></div>' +
      '<div class="ck-field"><label for="mg">Margin (mm)</label><input type="number" id="mg" min="0" max="40" value="0"></div></div></div>' : '') +
    '<div class="ck-group"><h3>Pages &amp; colour</h3><div class="ck-field"><label for="pr">Pages to keep</label><input type="text" id="pr" value="all" placeholder="e.g. 1-3, 5"></div>' +
    '<label class="ck-check"><input type="checkbox" id="gr"> Convert to greyscale (smaller for text scans)</label></div>' +
    '<button type="button" class="ck-btn primary lg" id="go" disabled>' + (mode === 'resize' ? 'Resize PDF' : 'Compress PDF') + '</button>' + CK.barHtml + '</aside>' +
    '<div class="ck-result" id="res" hidden></div></div>';

  var $ = function (id) { return document.getElementById(id); };
  var bar = CK.bar(root.querySelector('.ck-bar'));
  $('tu').value = cfg.targetKb && cfg.targetKb >= 1024 && cfg.targetKb % 1024 === 0 ? 'MB' : 'KB';
  CK.dropzone($('d'), $('f'), load, { filter: CK.isPdf, reject: 'Please choose a PDF file.' });
  $('chg').onclick = function () { $('f').click(); };
  $('f').addEventListener('change', function () { /* handled by dropzone */ });

  async function load(files) {
    var f = files[0];
    try {
      bar.set(0.2, 'Opening PDF');
      var o = await CK.openPdf(f); S.file = f; S.doc = o.doc; S.bytes = o.bytes; S.n = o.doc.numPages;
      $('d').hidden = true; $('info').hidden = false; $('res').hidden = true;
      $('fn').textContent = f.name; $('fm').textContent = S.n + ' page' + (S.n > 1 ? 's' : '') + ' · ' + CK.fmt(f.size);
      var th = $('th'); th.innerHTML = '';
      for (var i = 1; i <= Math.min(S.n, 8); i++) {
        var p = await S.doc.getPage(i), c = await CK.renderPage(p, 0.3, 220); c.className = 'ck-thumb'; c.title = 'Page ' + i; th.appendChild(c);
      }
      if (S.n > 100) CK.toast('Large file: processing more than 100 pages may be slow on phones.', 'warn');
      $('go').disabled = false; bar.hide();
    } catch (e) { bar.hide(); CK.toast(e.message || 'Could not open this PDF.', 'err'); }
  }

  function layoutFor(pw, ph) {
    var ps = $('ps') ? $('ps').value : 'orig', mg = ($('mg') ? +$('mg').value : 0) * 2.8346;
    if (ps === 'orig') return { W: pw, H: ph, x: 0, y: 0, w: pw, h: ph };
    var t = SIZES[ps], land = pw > ph, W = land ? t[1] : t[0], H = land ? t[0] : t[1];
    var s = Math.min((W - 2 * mg) / pw, (H - 2 * mg) / ph);
    return { W: W, H: H, w: pw * s, h: ph * s, x: (W - pw * s) / 2, y: (H - ph * s) / 2 };
  }

  async function light(pages, gray) {
    await CK.lib('pdflib'); var P = window.PDFLib;
    var src = await P.PDFDocument.load(S.bytes, { ignoreEncryption: true, updateMetadata: false });
    var out = await P.PDFDocument.create();
    var resizing = $('ps') && $('ps').value !== 'orig';
    if (!resizing) {
      var cp = await out.copyPages(src, pages.map(function (n) { return n - 1; }));
      cp.forEach(function (p) { out.addPage(p); });
    } else {
      for (var i = 0; i < pages.length; i++) {
        var sp = src.getPage(pages[i] - 1), sz = sp.getSize(), L = layoutFor(sz.width, sz.height);
        var emb = (await out.embedPdf(src, [pages[i] - 1]))[0], np = out.addPage([L.W, L.H]);
        np.drawPage(emb, { x: L.x, y: L.y, width: L.w, height: L.h });
      }
    }
    out.setTitle(''); out.setAuthor(''); out.setSubject(''); out.setKeywords([]); out.setProducer('ConvertKB'); out.setCreator('ConvertKB');
    return new Blob([await out.save({ useObjectStreams: true })], { type: 'application/pdf' });
  }

  async function raster(pages, T, gray) {
    await CK.lib('pdflib'); var P = window.PDFLib;
    var dpi = pages.length <= 8 ? 170 : pages.length <= 25 ? 130 : 100, bases = [];
    for (var i = 0; i < pages.length; i++) {
      bar.set(0.1 + 0.3 * i / pages.length, 'Reading page ' + (i + 1) + ' of ' + pages.length);
      var pg = await S.doc.getPage(pages[i]), v = pg.getViewport({ scale: 1 }), c = await CK.renderPage(pg, dpi / 72, 3200);
      if (gray) CK.toGray(c); bases.push({ c: c, pw: v.width, ph: v.height });
    }
    var scaled = { f: 0, cs: null };
    async function getScaled(f) {
      if (scaled.f === f) return scaled.cs; var cs = [];
      for (var k = 0; k < bases.length; k++) cs.push(f === 1 ? bases[k].c : await CK.resizeCanvas(bases[k].c, Math.max(8, bases[k].c.width * f), Math.max(8, bases[k].c.height * f)));
      scaled = { f: f, cs: cs }; return cs;
    }
    async function enc(cs, q) { var t = 1500, bl = []; for (var k = 0; k < cs.length; k++) { var b = await CK.toBlob(cs[k], 'image/jpeg', q); t += b.size + 700; bl.push(b); } return { t: t, blobs: bl }; }
    var pick = null, info = '';
    if (!T) { var cs0 = await getScaled(1); pick = await enc(cs0, 0.75); info = 'about ' + dpi + ' DPI'; }
    else {
      var fs = [1, 0.8, 0.64, 0.5, 0.4, 0.32, 0.25, 0.2];
      for (var a = 0; a < fs.length && !pick; a++) {
        bar.set(0.45 + 0.4 * a / fs.length, 'Finding the best quality');
        var cs = await getScaled(fs[a]), low = await enc(cs, 0.35);
        if (low.t <= T) {
          var lo = 0.35, hi = 0.9, best = low, bq = 0.35, top = await enc(cs, hi);
          if (top.t <= T) { best = top; bq = hi; } else for (var j = 0; j < 5; j++) { var mid = (lo + hi) / 2, r = await enc(cs, mid); if (r.t <= T) { best = r; bq = mid; lo = mid; } else hi = mid; }
          pick = best; info = 'about ' + Math.round(dpi * fs[a]) + ' DPI, JPEG quality ' + Math.round(bq * 100) + '%';
        }
      }
      if (!pick) { var csl = await getScaled(0.2); pick = await enc(csl, 0.25); info = 'about ' + Math.round(dpi * 0.2) + ' DPI (minimum)'; pick.over = true; }
    }
    bar.set(0.92, 'Building PDF');
    var out = await P.PDFDocument.create();
    for (var m = 0; m < pick.blobs.length; m++) {
      var im = await out.embedJpg(new Uint8Array(await pick.blobs[m].arrayBuffer())), L = layoutFor(bases[m].pw, bases[m].ph), pgo = out.addPage([L.W, L.H]);
      pgo.drawImage(im, { x: L.x, y: L.y, width: L.w, height: L.h });
    }
    out.setProducer('ConvertKB'); out.setCreator('ConvertKB');
    return { blob: new Blob([await out.save({ useObjectStreams: true })], { type: 'application/pdf' }), info: info };
  }

  $('go').addEventListener('click', async function () {
    if (!S.doc) return; var go = $('go'); go.disabled = true;
    try {
      var pages = CK.parseRange($('pr').value, S.n);
      if (!pages.length) { CK.toast('The page range does not match any page.', 'err'); go.disabled = false; return; }
      var v = parseFloat($('tv').value), T = v ? Math.round(v * ($('tu').value === 'MB' ? 1e6 : 1e3)) - 400 : 0;
      var md = $('md').value, gray = $('gr').checked, blob = null, method = '', info = '';
      var resizing = $('ps') && $('ps').value !== 'orig';
      if (md !== 'raster' && !gray) {
        bar.set(0.1, 'Optimising without changing text');
        try { blob = await light(pages, gray); method = 'Text and vector content preserved.'; } catch (e) { blob = null; }
        if (blob && md === 'auto' && T && blob.size > T) blob = null;
        if (blob && !resizing && pages.length === S.n && blob.size >= S.file.size && md === 'light') { blob = S.file; method = 'The file was already as compact as it can be without rebuilding pages.'; }
      }
      if (!blob) { var r = await raster(pages, T, gray); blob = r.blob; info = r.info; method = 'Pages were rebuilt as images (' + info + '). Text is no longer selectable.'; if (r.over) method += ' Could not reach the target; this is the smallest readable result.'; }
      show(blob, T, method);
    } catch (e) { CK.toast((e && e.message) || 'Could not process this PDF.', 'err'); }
    bar.hide(); go.disabled = false;
  });

  function show(blob, T, method) {
    S.out = blob; var ok = !T || blob.size <= T + 400, red = Math.round((1 - blob.size / S.file.size) * 100), r = $('res'); r.hidden = false;
    r.innerHTML = '<div class="ck-res-info solo"><span class="ck-badge ' + (ok ? 'good' : 'warn') + '">' + (ok ? 'Within your limit' : 'Above your limit') + '</span>' +
      '<h3>' + CK.fmt(blob.size) + ' <small>from ' + CK.fmt(S.file.size) + (red > 0 ? ' &middot; ' + red + '% smaller' : '') + '</small></h3><p class="ck-stats">' + CK.esc(method) + '</p>' +
      (ok ? '' : '<ul class="ck-notes"><li>Try a smaller page range, greyscale, or a slightly higher limit.</li></ul>') +
      '<div class="ck-actions"><button type="button" class="ck-btn primary" id="dl">' + CK.icon.down + ' Download PDF</button></div></div>';
    $('dl').onclick = function () { CK.download(S.out, CK.baseName(S.file) + '-convertkb.pdf'); };
    r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();
