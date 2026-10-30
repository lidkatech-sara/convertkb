/* Batch converters: image format conversion, HEIC conversion, images to PDF. */
(function () {
  'use strict';
  var root = document.getElementById('ck-tool');
  if (!root || root.dataset.tool !== 'convert') return;
  var cfg = JSON.parse(root.dataset.config || '{}');
  var kind = cfg.kind; // imgconv | heic | imgpdf
  var to = cfg.to; // jpg | jpeg | png | webp | pdf
  var items = [], results = [];
  var isPdf = to === 'pdf', lossy = to === 'jpg' || to === 'jpeg' || to === 'webp';
  var MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
  var accept = kind === 'heic' ? 'image/heic,image/heif,.heic,.heif' : 'image/*,.heic,.heif';
  var verb = isPdf ? 'Create PDF' : 'Convert to ' + to.toUpperCase();
  var keepOpt = cfg.keepBytes;

  root.innerHTML =
    '<div class="ck-tool ck-conv"><div class="ck-stage">' +
    '<div class="ck-drop" id="d" tabindex="0" role="button" aria-label="Choose files"><div class="ck-drop-ic">' + CK.icon.upload + '</div>' +
    '<strong>Drop ' + CK.esc(cfg.fromLabel || 'images') + ' here</strong><span>or click to browse &middot; several files at once' + (kind === 'heic' ? '' : ' &middot; HEIC accepted') + '</span>' +
    '<input type="file" id="f" accept="' + accept + '" multiple hidden></div>' +
    '<ul class="ck-files" id="list" hidden></ul></div>' +
    '<aside class="ck-panel"><div class="ck-group"><h3>Options</h3>' +
    (lossy ? '<div class="ck-field"><label for="q">Quality <b id="qv">90</b>%</label><input type="range" id="q" min="40" max="100" value="90"></div>' : '') +
    (to === 'jpg' || to === 'jpeg' || isPdf ? '<div class="ck-field"><label for="bg">Background for transparent areas</label><select id="bg"><option value="#ffffff">White</option><option value="#000000">Black</option></select></div>' : '') +
    (keepOpt ? '<label class="ck-check"><input type="checkbox" id="keep" checked> Keep original bytes (just rename; nothing is re-encoded)</label>' : '') +
    (isPdf ? '<div class="ck-row"><div class="ck-field"><label for="ps">Page size</label><select id="ps"><option value="a4">A4</option><option value="letter">US Letter</option><option value="fit">Match each image</option></select></div>' +
      '<div class="ck-field"><label for="mg">Margin</label><select id="mg"><option value="0">None</option><option value="18" selected>Small</option><option value="40">Large</option></select></div></div>' +
      '<p class="ck-hint">Images appear in the order listed. Use the arrows to reorder.</p>' : '') +
    '</div><button type="button" class="ck-btn primary lg" id="go" disabled>' + verb + '</button>' + CK.barHtml + '</aside>' +
    '<div class="ck-result" id="res" hidden></div></div>';

  var $ = function (id) { return document.getElementById(id); };
  var bar = CK.bar(root.querySelector('.ck-bar'));
  if ($('q')) $('q').addEventListener('input', function () { $('qv').textContent = this.value; });
  CK.dropzone($('d'), $('f'), addFiles, { multiple: true, paste: true, filter: function (f) { return /^image\//.test(f.type) || CK.isHeic(f) || /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name); }, reject: 'Please choose image files.' });

  function addFiles(files) {
    files.forEach(function (f) { items.push({ file: f, id: Math.random().toString(36).slice(2) }); });
    render();
  }
  function render() {
    var ul = $('list'); ul.hidden = !items.length; $('go').disabled = !items.length;
    ul.innerHTML = items.map(function (it, i) {
      return '<li data-i="' + i + '"><span class="ck-fn">' + CK.esc(it.file.name) + '</span><span class="ck-fs">' + CK.fmt(it.file.size) + '</span>' +
        (isPdf ? '<button type="button" class="ck-ib" data-m="-1" aria-label="Move up">&uarr;</button><button type="button" class="ck-ib" data-m="1" aria-label="Move down">&darr;</button>' : '') +
        '<button type="button" class="ck-ib" data-m="x" aria-label="Remove">&times;</button></li>';
    }).join('') + '<li class="ck-add"><button type="button" class="ck-chip" id="more">+ Add more files</button></li>';
    $('more').onclick = function () { $('f').click(); };
  }
  $('list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-m]'); if (!b) return;
    var i = +b.closest('li').dataset.i, m = b.dataset.m;
    if (m === 'x') items.splice(i, 1);
    else { var j = i + +m; if (j >= 0 && j < items.length) { var t = items[i]; items[i] = items[j]; items[j] = t; } }
    render();
  });

  async function toCanvas(file) { return CK.fileToCanvas(file, { maxSide: isPdf ? 3000 : 8000, bg: (MIME[to] === 'image/jpeg' || isPdf) ? ($('bg') ? $('bg').value : '#ffffff') : null }); }
  function outName(file, ext) { return CK.baseName(file) + '.' + ext; }

  $('go').addEventListener('click', async function () {
    var go = $('go'); go.disabled = true; results = [];
    try {
      if (isPdf) await makePdf(); else await convertAll();
      showResults();
    } catch (e) { CK.toast((e && e.message) || 'Conversion failed.', 'err'); }
    bar.hide(); go.disabled = !items.length;
  });

  async function convertAll() {
    for (var i = 0; i < items.length; i++) {
      var f = items[i].file; bar.set(i / items.length, 'Converting ' + (i + 1) + ' of ' + items.length);
      var blob;
      if (keepOpt && $('keep') && $('keep').checked && /jpe?g$/i.test(f.name) && (to === 'jpg' || to === 'jpeg')) blob = f;
      else if (kind === 'heic' && !lossy && to === 'png') blob = await CK.heicToBlob(f, 'image/png');
      else if (kind === 'heic' && lossy && CK.isHeic(f)) blob = await CK.heicToBlob(f, 'image/jpeg', ($('q') ? +$('q').value : 92) / 100);
      else { var c = await toCanvas(f); blob = await CK.toBlob(c, MIME[to], lossy && $('q') ? +$('q').value / 100 : undefined); }
      var ext = to === 'jpeg' ? 'jpeg' : to;
      results.push({ name: outName(f, ext), blob: new Blob([blob], { type: MIME[to] }), from: f.size });
    }
  }

  async function makePdf() {
    await CK.lib('jspdf'); var jsPDF = window.jspdf.jsPDF, doc = null;
    var ps = $('ps').value, mg = +$('mg').value;
    for (var i = 0; i < items.length; i++) {
      bar.set(i / items.length, 'Adding image ' + (i + 1) + ' of ' + items.length);
      var c = await toCanvas(items[i].file), iw = c.width, ih = c.height, land = iw > ih, pw, ph;
      if (ps === 'fit') { var k = Math.min(1, 842 / Math.max(iw, ih)); pw = iw * k * 0.75; ph = ih * k * 0.75; }
      else { var base = ps === 'a4' ? [595.28, 841.89] : [612, 792]; pw = land ? base[1] : base[0]; ph = land ? base[0] : base[1]; }
      var m = ps === 'fit' ? 0 : mg, aw = pw - 2 * m, ah = ph - 2 * m, s = Math.min(aw / iw, ah / ih), dw = iw * s, dh = ih * s;
      var data = c.toDataURL('image/jpeg', 0.9), o = pw > ph ? 'landscape' : 'portrait';
      if (!doc) doc = new jsPDF({ unit: 'pt', format: [pw, ph], orientation: o, compress: true }); else doc.addPage([pw, ph], o);
      doc.addImage(data, 'JPEG', (pw - dw) / 2, (ph - dh) / 2, dw, dh, undefined, 'FAST');
    }
    results.push({ name: items.length === 1 ? CK.baseName(items[0].file) + '.pdf' : 'convertkb-images.pdf', blob: doc.output('blob'), from: items.reduce(function (a, b) { return a + b.file.size; }, 0) });
  }

  function showResults() {
    var r = $('res'); r.hidden = false;
    r.innerHTML = '<h3 class="ck-res-title">Done &mdash; ' + results.length + ' file' + (results.length > 1 ? 's' : '') + ' ready</h3><ul class="ck-files">' +
      results.map(function (x, i) { return '<li><span class="ck-fn">' + CK.esc(x.name) + '</span><span class="ck-fs">' + CK.fmt(x.from) + ' &rarr; ' + CK.fmt(x.blob.size) + '</span><button type="button" class="ck-btn sm" data-d="' + i + '">' + CK.icon.down + ' Download</button></li>'; }).join('') + '</ul>' +
      (results.length > 1 ? '<div class="ck-actions"><button type="button" class="ck-btn primary" id="zip">' + CK.icon.down + ' Download all (.zip)</button></div>' : '');
    r.onclick = async function (e) {
      var b = e.target.closest('[data-d]'); if (b) { var x = results[+b.dataset.d]; CK.download(x.blob, x.name); return; }
      if (e.target.closest('#zip')) { try { CK.download(await CK.zip(results), 'convertkb-files.zip'); } catch (er) { CK.toast('ZIP library failed to load; download files one by one.', 'err'); } }
    };
    r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();
