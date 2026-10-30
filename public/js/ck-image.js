/* Image compressor / resizer / exam-photo tool. mode: compress | resize | photo */
(function () {
  'use strict';
  var root = document.getElementById('ck-tool');
  if (!root || root.dataset.tool !== 'image') return;
  var cfg = JSON.parse(root.dataset.config || '{}');
  var mode = cfg.mode || 'compress';
  var S = { file: null, url: null, cropper: null, img: null, natW: 0, natH: 0, outUrl: null, outBlob: null };
  var presets = cfg.presets || [];
  var fmtVal = cfg.format === 'png' ? 'image/png' : cfg.format === 'webp' ? 'image/webp' : 'image/jpeg';
  var tKb = cfg.targetKb || (mode === 'resize' ? '' : 100);
  var cta = mode === 'resize' ? 'Resize image' : mode === 'photo' ? 'Prepare photo' : 'Compress image';

  root.innerHTML =
    '<div class="ck-tool ck-img">' +
    '<div class="ck-stage">' +
    '<div class="ck-drop" id="d" tabindex="0" role="button" aria-label="Choose an image file">' +
    '<div class="ck-drop-ic">' + CK.icon.upload + '</div><strong>Drop your image here</strong>' +
    '<span>or click to browse &middot; paste with Ctrl+V &middot; JPG, PNG, WebP, HEIC</span>' +
    '<input type="file" id="f" accept="image/*,.heic,.heif" hidden></div>' +
    '<div class="ck-crop" id="cr" hidden><div class="ck-crop-wrap"><img id="im" alt="Image being edited"></div>' +
    '<div class="ck-tools" id="tb">' +
    '<button type="button" class="ck-chip on" data-a="0">Free</button><button type="button" class="ck-chip" data-a="1">1:1</button>' +
    '<button type="button" class="ck-chip" data-a="0.7778">3.5:4.5</button><button type="button" class="ck-chip" data-a="0.8">4:5</button>' +
    '<button type="button" class="ck-chip" data-a="2">2:1</button><button type="button" class="ck-chip" data-a="1.7778">16:9</button>' +
    '<span class="ck-sep"></span>' +
    '<button type="button" class="ck-chip" data-op="rl" title="Rotate left">&#8634;</button><button type="button" class="ck-chip" data-op="rr" title="Rotate right">&#8635;</button>' +
    '<button type="button" class="ck-chip" data-op="fh" title="Flip horizontally">&#8646;</button><button type="button" class="ck-chip" data-op="fv" title="Flip vertically">&#8645;</button>' +
    '<button type="button" class="ck-chip" data-op="new">Change image</button></div>' +
    '<p class="ck-meta" id="meta"></p></div></div>' +
    '<aside class="ck-panel">' +
    (presets.length ? '<div class="ck-group"><h3>Quick presets</h3><div class="ck-chips" id="pr">' + presets.map(function (p, i) { return '<button type="button" class="ck-chip" data-p="' + i + '">' + CK.esc(p.label) + '</button>'; }).join('') + '</div></div>' : '') +
    '<div class="ck-group"><h3>Target file size</h3>' +
    '<label class="ck-check"><input type="checkbox" id="fit" checked> Fit to a maximum size</label>' +
    '<div class="ck-row" id="szr"><div class="ck-field"><label for="tv">Maximum</label><input type="number" id="tv" min="1" step="1" value="' + tKb + '"></div>' +
    '<div class="ck-field"><label for="tu">Unit</label><select id="tu"><option>KB</option><option>MB</option></select></div>' +
    '<div class="ck-field"><label for="tm">Minimum KB <i>(optional)</i></label><input type="number" id="tm" min="0" placeholder="none" value="' + (cfg.minKb || '') + '"></div></div>' +
    '<div class="ck-field" id="qr" hidden><label for="q">Quality <b id="qv">80</b>%</label><input type="range" id="q" min="5" max="100" value="80"></div>' +
    '<label class="ck-check"><input type="checkbox" id="pad"' + (cfg.minKb ? ' checked' : '') + '> Pad JPG up to the minimum size if it ends up smaller</label></div>' +
    '<div class="ck-group"><h3>Dimensions</h3><div class="ck-row">' +
    '<div class="ck-field"><label for="w">Width</label><input type="number" id="w" min="1" placeholder="auto" value="' + (cfg.w || '') + '"></div>' +
    '<div class="ck-field"><label for="h">Height</label><input type="number" id="h" min="1" placeholder="auto" value="' + (cfg.h || '') + '"></div>' +
    '<div class="ck-field"><label for="u">Unit</label><select id="u"><option value="px">px</option><option value="cm">cm</option><option value="in">inch</option></select></div></div>' +
    '<div class="ck-row"><div class="ck-field"><label for="dpi">DPI written to file</label><select id="dpi"><option value="">Leave as is</option><option>72</option><option>96</option><option>150</option><option' + (mode === 'photo' ? ' selected' : '') + '>200</option><option>300</option></select></div>' +
    '<div class="ck-field"><label for="fmt">Output format</label><select id="fmt"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div></div>' +
    '<label class="ck-check"><input type="checkbox" id="lock" checked> Keep the crop proportions when only one side is set</label>' +
    '<label class="ck-check"><input type="checkbox" id="shr" checked> Allow shrinking dimensions if quality alone cannot reach the size</label></div>' +
    '<details class="ck-group" id="adv"><summary>Enhance (optional)</summary>' +
    '<div class="ck-field"><label for="br">Brightness <b id="brv">100</b>%</label><input type="range" id="br" min="50" max="160" value="100"></div>' +
    '<div class="ck-field"><label for="co">Contrast <b id="cov">100</b>%</label><input type="range" id="co" min="50" max="180" value="100"></div>' +
    '<div class="ck-field"><label for="sa">Saturation <b id="sav">100</b>%</label><input type="range" id="sa" min="0" max="200" value="100"></div>' +
    '<div class="ck-field"><label for="md">Colour mode</label><select id="md"><option value="none">Original colours</option><option value="gray">Greyscale</option><option value="whiten">Document whiten (white paper, dark ink)</option></select></div></details>' +
    '<button type="button" class="ck-btn primary lg" id="go" disabled>' + cta + '</button>' + CK.barHtml +
    '</aside>' +
    '<div class="ck-result" id="res" hidden></div></div>';

  var $ = function (id) { return document.getElementById(id); };
  var bar = CK.bar(root.querySelector('.ck-bar'));
  $('fmt').value = fmtVal; $('tu').value = tKb >= 1024 && tKb % 1024 === 0 ? 'MB' : 'KB';
  if ($('tu').value === 'MB') $('tv').value = tKb / 1024;
  if (cfg.dpi) $('dpi').value = String(cfg.dpi);
  if (!tKb) { $('fit').checked = false; $('szr').hidden = true; $('qr').hidden = false; $('q').value = 85; $('qv').textContent = '85'; }

  CK.dropzone($('d'), $('f'), load, { paste: true, filter: function (f) { return /^image\//.test(f.type) || CK.isHeic(f) || /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name); }, reject: 'Please choose an image file (JPG, PNG, WebP, HEIC).' });

  async function load(files) {
    var f = files[0];
    try {
      bar.set(0.15, 'Reading image');
      var blob = CK.isHeic(f) ? await CK.heicToBlob(f, 'image/jpeg', 0.95) : f;
      if (S.cropper) { S.cropper.destroy(); S.cropper = null; }
      if (S.url) URL.revokeObjectURL(S.url);
      S.file = f; S.url = URL.createObjectURL(blob);
      var im = $('im'); im.removeAttribute('src');
      await new Promise(function (res, rej) { im.onload = res; im.onerror = function () { rej(new Error('This image could not be read.')); }; im.src = S.url; });
      S.natW = im.naturalWidth; S.natH = im.naturalHeight;
      $('d').hidden = true; $('cr').hidden = false; $('res').hidden = true;
      $('meta').textContent = f.name + ' · ' + S.natW + '×' + S.natH + ' px · ' + CK.fmt(f.size);
      try {
        await CK.lib('cropper');
        S.cropper = new window.Cropper(im, { viewMode: 1, autoCropArea: 1, background: false, responsive: true, aspectRatio: ratioFromInputs() });
      } catch (e) { CK.toast('Crop tool could not load; the full image will be used.', 'warn'); }
      $('go').disabled = false; bar.hide();
    } catch (e) { bar.hide(); CK.toast(e.message || 'Could not open that image.', 'err'); }
  }

  function toPx(v, unit, dpi) { v = parseFloat(v); if (!v) return 0; return Math.round(unit === 'cm' ? v / 2.54 * dpi : unit === 'in' ? v * dpi : v); }
  function dpiNow() { return parseInt($('dpi').value, 10) || 96; }
  function ratioFromInputs() {
    var w = parseFloat($('w').value), h = parseFloat($('h').value);
    return w && h ? w / h : NaN;
  }
  function syncAspect() { if (S.cropper) { var r = ratioFromInputs(); S.cropper.setAspectRatio(r); markChip(isNaN(r) ? '0' : null); } }
  function markChip(a) { CK.$$('[data-a]', $('tb')).forEach(function (b) { b.classList.toggle('on', a !== null && b.dataset.a === a); }); }

  $('tb').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !S.cropper) { if (b && b.dataset.op === 'new') reset(); return; }
    if (b.dataset.a != null) { S.cropper.setAspectRatio(parseFloat(b.dataset.a) || NaN); markChip(b.dataset.a); }
    var op = b.dataset.op;
    if (op === 'rl') S.cropper.rotate(-90); else if (op === 'rr') S.cropper.rotate(90);
    else if (op === 'fh') S.cropper.scaleX(-(S.cropper.getData().scaleX || 1)); else if (op === 'fv') S.cropper.scaleY(-(S.cropper.getData().scaleY || 1));
    else if (op === 'new') reset();
  });
  function reset() {
    if (S.cropper) { S.cropper.destroy(); S.cropper = null; }
    $('cr').hidden = true; $('d').hidden = false; $('res').hidden = true; $('go').disabled = true; S.file = null;
  }
  ['w', 'h'].forEach(function (id) { $(id).addEventListener('change', syncAspect); });
  $('fit').addEventListener('change', function () { $('szr').hidden = !this.checked; $('qr').hidden = this.checked; });
  $('q').addEventListener('input', function () { $('qv').textContent = this.value; });
  [['br', 'brv'], ['co', 'cov'], ['sa', 'sav']].forEach(function (p) { $(p[0]).addEventListener('input', function () { $(p[1]).textContent = this.value; }); });

  var pr = $('pr');
  if (pr) pr.addEventListener('click', function (e) {
    var b = e.target.closest('[data-p]'); if (!b) return;
    var p = presets[+b.dataset.p];
    CK.$$('[data-p]', pr).forEach(function (x) { x.classList.toggle('on', x === b); });
    var hasKb = !!p.maxKb; $('fit').checked = hasKb; $('szr').hidden = !hasKb; $('qr').hidden = hasKb;
    $('u').value = 'px'; $('w').value = p.w || ''; $('h').value = p.h || '';
    $('tu').value = 'KB'; $('tv').value = p.maxKb || ''; $('tm').value = p.minKb || '';
    $('pad').checked = !!p.minKb;
    if (p.dpi) $('dpi').value = String(p.dpi);
    if (p.fmt) $('fmt').value = p.fmt === 'png' ? 'image/png' : 'image/jpeg';
    syncAspect();
  });

  function adjust(c, o) {
    if (o.b === 100 && o.c === 100 && o.s === 100 && o.m === 'none') return c;
    var x = c.getContext('2d', { willReadFrequently: true }), id = x.getImageData(0, 0, c.width, c.height), d = id.data;
    var bf = o.b / 100, cf = o.c / 100, sf = o.s / 100;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i], g = d[i + 1], b = d[i + 2], l;
      if (sf !== 1) { l = 0.299 * r + 0.587 * g + 0.114 * b; r = l + (r - l) * sf; g = l + (g - l) * sf; b = l + (b - l) * sf; }
      r = ((r - 128) * cf + 128) * bf; g = ((g - 128) * cf + 128) * bf; b = ((b - 128) * cf + 128) * bf;
      if (o.m !== 'none') {
        l = 0.299 * r + 0.587 * g + 0.114 * b;
        if (o.m === 'whiten') l = Math.max(0, Math.min(255, (l - 70) * 255 / 120));
        r = g = b = l;
      }
      d[i] = r < 0 ? 0 : r > 255 ? 255 : r; d[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g; d[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    }
    x.putImageData(id, 0, 0); return c;
  }
  function quantize(c, L) {
    var o = CK.newCanvas(c.width, c.height); var x = o.getContext('2d', { willReadFrequently: true }); x.drawImage(c, 0, 0);
    var id = x.getImageData(0, 0, o.width, o.height), d = id.data, st = 255 / (L - 1);
    for (var i = 0; i < d.length; i += 4) { d[i] = Math.round(d[i] / st) * st; d[i + 1] = Math.round(d[i + 1] / st) * st; d[i + 2] = Math.round(d[i + 2] / st) * st; }
    x.putImageData(id, 0, 0); return o;
  }
  function source() {
    if (S.cropper) {
      var c = S.cropper.getCroppedCanvas({ maxWidth: 4096, maxHeight: 4096, fillColor: '#ffffff', imageSmoothingQuality: 'high' });
      if (c) return c;
    }
    var im = $('im'), k = Math.min(1, 4096 / Math.max(im.naturalWidth, im.naturalHeight)), c2 = CK.newCanvas(im.naturalWidth * k, im.naturalHeight * k, '#fff');
    c2.getContext('2d').drawImage(im, 0, 0, c2.width, c2.height); return c2;
  }
  var enc = function (c, mime, q) { return CK.toBlob(c, mime, q); };

  async function fitLossy(work, T, mime, shrink) {
    var QMIN = 0.4, QHI = 0.92, cur = work, f = 1;
    for (var step = 0; step < 10; step++) {
      bar.set(0.35 + step * 0.05, 'Finding the best quality');
      var low = await enc(cur, mime, QMIN);
      if (low.size <= T) {
        var top = await enc(cur, mime, QHI); if (top.size <= T) return { blob: top, canvas: cur, q: QHI };
        var lo = QMIN, hi = QHI, best = low, bq = QMIN;
        for (var i = 0; i < 6; i++) { var mid = (lo + hi) / 2, b = await enc(cur, mime, mid); if (b.size <= T) { best = b; bq = mid; lo = mid; } else hi = mid; }
        return { blob: best, canvas: cur, q: bq };
      }
      if (!shrink) break;
      f *= Math.max(0.35, Math.min(0.93, Math.sqrt(T / low.size) * 0.97));
      var w = Math.round(work.width * f), h = Math.round(work.height * f);
      if (Math.min(w, h) < 40) break;
      cur = await CK.resizeCanvas(work, w, h);
    }
    var lo2 = 0.02, hi2 = QMIN, best2 = null;
    for (var j = 0; j < 7; j++) { var m = (lo2 + hi2) / 2, bb = await enc(cur, mime, m); if (bb.size <= T) { best2 = bb; lo2 = m; } else hi2 = m; }
    if (!best2) best2 = await enc(cur, mime, 0.02);
    return { blob: best2, canvas: cur, q: lo2, over: best2.size > T };
  }
  async function fitPng(work, T, shrink) {
    var last, fs = shrink ? [1, 0.85, 0.7, 0.55, 0.42, 0.32, 0.24, 0.18, 0.13, 0.1] : [1];
    for (var a = 0; a < fs.length; a++) {
      var cur = fs[a] === 1 ? work : await CK.resizeCanvas(work, work.width * fs[a], work.height * fs[a]);
      if (Math.min(cur.width, cur.height) < 32) break;
      for (var L of [256, 48, 16, 8]) {
        bar.set(0.3 + a * 0.06, 'Reducing PNG size');
        var c = L === 256 ? cur : quantize(cur, L), b = await enc(c, 'image/png');
        last = { blob: b, canvas: c, L: L }; if (b.size <= T) return last;
      }
    }
    last.over = true; return last;
  }

  $('go').addEventListener('click', run);
  async function run() {
    if (!S.file) return;
    var go = $('go'); go.disabled = true;
    try {
      bar.set(0.1, 'Preparing image');
      var src = source(), dpi = dpiNow(), unit = $('u').value;
      var W = toPx($('w').value, unit, dpi), H = toPx($('h').value, unit, dpi), ratio = src.width / src.height;
      if (W && !H) H = Math.round(W / ratio); else if (H && !W) W = Math.round(H * ratio);
      if (!W) { W = src.width; H = src.height; }
      var userDims = !!($('w').value || $('h').value);
      var mime = $('fmt').value;
      bar.set(0.2, 'Resizing');
      var work = CK.newCanvas(W, H, mime === 'image/png' ? null : '#ffffff');
      if (mime !== 'image/png') { var big = await CK.resizeCanvas(src, W, H); work.getContext('2d').drawImage(big, 0, 0); } else work = await CK.resizeCanvas(src, W, H);
      adjust(work, { b: +$('br').value, c: +$('co').value, s: +$('sa').value, m: $('md').value });
      var res, T = 0;
      if ($('fit').checked) {
        var v = parseFloat($('tv').value);
        if (!v) { CK.toast('Enter a maximum size, or untick "Fit to a maximum size".', 'err'); go.disabled = false; bar.hide(); return; }
        T = Math.round(v * ($('tu').value === 'MB' ? 1000 * 1000 : 1000)) - 24;
        res = mime === 'image/png' ? await fitPng(work, T, $('shr').checked && !userDims) : await fitLossy(work, T, mime, $('shr').checked && !userDims);
      } else {
        var blob0 = await enc(work, mime, +$('q').value / 100); res = { blob: blob0, canvas: work };
      }
      var blob = res.blob;
      bar.set(0.92, 'Finalising');
      if (dpi && $('dpi').value) blob = await CK.setDpi(blob, parseInt($('dpi').value, 10));
      var minKb = parseFloat($('tm').value), padded = false;
      if (minKb && mime === 'image/jpeg' && $('pad').checked && blob.size < minKb * 1024 + 64) { blob = await CK.padJpeg(blob, Math.round(minKb * 1024 + 64)); padded = true; }
      show(blob, res, { T: T, minKb: minKb, padded: padded, mime: mime, userDims: userDims });
    } catch (e) { CK.toast((e && e.message) || 'Something went wrong while processing.', 'err'); }
    bar.hide(); go.disabled = false;
  }

  function show(blob, res, o) {
    if (S.outUrl) URL.revokeObjectURL(S.outUrl);
    S.outBlob = blob; S.outUrl = URL.createObjectURL(blob);
    var ext = o.mime === 'image/png' ? 'png' : o.mime === 'image/webp' ? 'webp' : 'jpg';
    var kb = blob.size / 1024, ok = true, msgs = [];
    if (o.T && blob.size > o.T + 24) { ok = false; msgs.push('Could not get under the limit' + (o.userDims ? ' at these exact dimensions. Reduce the width/height or allow shrinking.' : '. Try a smaller crop or JPG output.')); }
    if (o.minKb && blob.size < o.minKb * 1024) { ok = false; msgs.push('Below the ' + o.minKb + ' KB minimum. Use a larger source image, or tick the padding option for JPG.'); }
    if (o.padded) msgs.push('Padded with comment data to reach the minimum size (visually identical).');
    if (res.L && res.L < 256) msgs.push('PNG colours were reduced to ' + res.L + ' levels per channel to save space.');
    var red = S.file ? Math.round((1 - blob.size / S.file.size) * 100) : 0;
    var r = $('res');
    r.hidden = false;
    r.innerHTML = '<div class="ck-res-grid"><div class="ck-res-img"><img src="' + S.outUrl + '" alt="Processed result preview"></div><div class="ck-res-info">' +
      '<span class="ck-badge ' + (ok ? 'good' : 'warn') + '">' + (ok ? 'Ready to upload' : 'Check the notes') + '</span>' +
      '<h3>' + kb.toFixed(1) + ' KB <small>' + res.canvas.width + '&times;' + res.canvas.height + ' px</small></h3>' +
      '<p class="ck-stats">Original ' + CK.fmt(S.file.size) + ' (' + S.natW + '&times;' + S.natH + ')' + (red > 0 ? ' &middot; <b>' + red + '% smaller</b>' : '') + '</p>' +
      (msgs.length ? '<ul class="ck-notes">' + msgs.map(function (m) { return '<li>' + CK.esc(m) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="ck-actions"><button type="button" class="ck-btn primary" id="dl">' + CK.icon.down + ' Download .' + ext + '</button></div></div></div>';
    $('dl').onclick = function () { CK.download(S.outBlob, CK.baseName(S.file) + '-convertkb.' + ext); };
    r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();
