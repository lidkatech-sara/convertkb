/* PDF converters: pdf-to-jpg, pdf-to-word, pdf-to-excel, pdf-to-ppt */
(function () {
  'use strict';
  var root = document.getElementById('ck-tool');
  if (!root || root.dataset.tool !== 'pdfconv') return;
  var cfg = JSON.parse(root.dataset.config || '{}');
  var to = cfg.to; // jpg | word | excel | ppt
  var S = { file: null, doc: null, n: 0 }, results = [];
  var needsOcr = to === 'word' || to === 'excel';
  var label = { jpg: 'Convert to JPG', word: 'Convert to Word', excel: 'Convert to Excel', ppt: 'Convert to PowerPoint' }[to];

  root.innerHTML =
    '<div class="ck-tool ck-pdf"><div class="ck-stage">' +
    '<div class="ck-drop" id="d" tabindex="0" role="button" aria-label="Choose a PDF"><div class="ck-drop-ic">' + CK.icon.upload + '</div>' +
    '<strong>Drop your PDF here</strong><span>or click to browse &middot; processed on your device</span><input type="file" id="f" accept="application/pdf,.pdf" hidden></div>' +
    '<div class="ck-pdfinfo" id="info" hidden><div class="ck-pdfhead"><div><strong id="fn"></strong><span id="fm"></span></div><button type="button" class="ck-chip" id="chg">Change file</button></div></div></div>' +
    '<aside class="ck-panel"><div class="ck-group"><h3>Options</h3>' +
    '<div class="ck-field"><label for="pr">Pages</label><input type="text" id="pr" value="all" placeholder="e.g. 1-3, 5"></div>' +
    (to === 'jpg' ? '<div class="ck-row"><div class="ck-field"><label for="fm2">Format</label><select id="fm2"><option value="jpg">JPG</option><option value="png">PNG</option></select></div>' +
      '<div class="ck-field"><label for="dp">Resolution</label><select id="dp"><option value="72">72 DPI (screen)</option><option value="150" selected>150 DPI (good)</option><option value="200">200 DPI (sharp)</option><option value="300">300 DPI (print)</option></select></div></div>' +
      '<div class="ck-field"><label for="q">JPG quality <b id="qv">90</b>%</label><input type="range" id="q" min="40" max="100" value="90"></div>' : '') +
    (to === 'ppt' ? '<label class="ck-check"><input type="checkbox" id="nt" checked> Put the page text in the speaker notes</label>' : '') +
    (needsOcr ? '<label class="ck-check"><input type="checkbox" id="oc" checked> Read scanned pages with OCR</label><div class="ck-field"><label for="lg">OCR language</label><select id="lg">' + CK.langOptions() + '</select></div>' : '') +
    (to === 'excel' ? '<label class="ck-check"><input type="checkbox" id="sh" checked> One sheet per page</label><label class="ck-check"><input type="checkbox" id="nm" checked> Turn numbers into real numbers</label>' : '') +
    '</div><button type="button" class="ck-btn primary lg" id="go" disabled>' + label + '</button>' + CK.barHtml + '</aside>' +
    '<div class="ck-result" id="res" hidden></div></div>';

  var $ = function (id) { return document.getElementById(id); };
  var bar = CK.bar(root.querySelector('.ck-bar'));
  if ($('q')) $('q').addEventListener('input', function () { $('qv').textContent = this.value; });
  CK.dropzone($('d'), $('f'), load, { filter: CK.isPdf, reject: 'Please choose a PDF file.' });
  $('chg').onclick = function () { $('f').click(); };

  async function load(files) {
    var f = files[0];
    try {
      bar.set(0.3, 'Opening PDF'); var o = await CK.openPdf(f); S.file = f; S.doc = o.doc; S.n = o.doc.numPages;
      $('d').hidden = true; $('info').hidden = false; $('res').hidden = true;
      $('fn').textContent = f.name; $('fm').textContent = S.n + ' page' + (S.n > 1 ? 's' : '') + ' · ' + CK.fmt(f.size);
      $('go').disabled = false; bar.hide();
    } catch (e) { bar.hide(); CK.toast(e.message || 'Could not open this PDF.', 'err'); }
  }

  $('go').addEventListener('click', async function () {
    if (!S.doc) return; var go = $('go'); go.disabled = true; results = [];
    try {
      var pages = CK.parseRange($('pr').value, S.n);
      if (!pages.length) throw new Error('The page range does not match any page.');
      if (to === 'jpg') await toImages(pages); else if (to === 'ppt') await toPpt(pages); else await toText(pages);
      show();
    } catch (e) { CK.toast((e && e.message) || 'Conversion failed.', 'err'); }
    bar.hide(); go.disabled = false;
  });

  async function toImages(pages) {
    var png = $('fm2').value === 'png', sc = +$('dp').value / 72, q = +$('q').value / 100, base = CK.baseName(S.file);
    for (var i = 0; i < pages.length; i++) {
      bar.set(i / pages.length, 'Rendering page ' + pages[i]);
      var p = await S.doc.getPage(pages[i]), c = await CK.renderPage(p, sc, 6000);
      var b = await CK.toBlob(c, png ? 'image/png' : 'image/jpeg', q);
      results.push({ name: base + '-page-' + pages[i] + (png ? '.png' : '.jpg'), blob: b });
    }
  }
  async function toPpt(pages) {
    await CK.lib('pptx'); var pptx = new window.PptxGenJS(), base = CK.baseName(S.file), first = true, H = 5.625;
    for (var i = 0; i < pages.length; i++) {
      bar.set(i / pages.length, 'Building slide ' + (i + 1) + ' of ' + pages.length);
      var p = await S.doc.getPage(pages[i]), v = p.getViewport({ scale: 1 });
      if (first) { H = 10 * v.height / v.width; pptx.defineLayout({ name: 'CK', width: 10, height: H }); pptx.layout = 'CK'; first = false; }
      var c = await CK.renderPage(p, 2, 2400), s = pptx.addSlide();
      s.addImage({ data: c.toDataURL('image/jpeg', 0.88), x: 0, y: 0, w: 10, h: H });
      if ($('nt') && $('nt').checked) { var it = await CK.pageItems(p); s.addNotes(CK.itemsToGrid(it).map(function (r) { return r.filter(Boolean).join(' '); }).join('\n')); }
    }
    results.push({ name: base + '.pptx', blob: await pptx.write({ outputType: 'blob' }) });
  }

  async function pageData(p, ocr, useOcr, ratio) {
    var items = await CK.pageItems(p), chars = items.reduce(function (a, b) { return a + b.s.length; }, 0);
    if (chars >= 15 || !useOcr || !ocr) return { items: items, scanned: false };
    var c = await CK.renderPage(p, 2.2, 3000), o = await ocr.read(c), vp = p.getViewport({ scale: 1 }), k = vp.width / c.width;
    return { items: o.items.map(function (i) { return { s: i.s, x: i.x * k, y: i.y * k, w: i.w * k, h: i.h * k }; }), scanned: true };
  }

  async function toText(pages) {
    var useOcr = $('oc').checked, ocr = null, base = CK.baseName(S.file), out = [];
    try {
      var prog = 0;
      for (var i = 0; i < pages.length; i++) {
        var p = await S.doc.getPage(pages[i]);
        bar.set(i / pages.length, 'Reading page ' + pages[i] + ' of ' + S.n);
        var probe = await CK.pageItems(p);
        if (!ocr && useOcr && probe.reduce(function (a, b) { return a + b.s.length; }, 0) < 15) ocr = await CK.makeOcr($('lg').value, function (pp) { bar.set((i + pp) / pages.length, 'Recognising text on page ' + pages[i]); });
        out.push(await pageData(p, ocr, useOcr));
      }
    } finally { if (ocr) await ocr.end(); }
    var total = out.reduce(function (a, b) { return a + b.items.length; }, 0);
    if (!total) throw new Error('No text could be found. If this is a scan, keep OCR on.');
    bar.set(0.95, 'Writing file');
    if (to === 'word') results.push({ name: base + '.docx', blob: await buildDocx(out) }); else results.push({ name: base + '.xlsx', blob: await buildXlsx(out) });
  }

  async function buildDocx(pages) {
    await CK.lib('docx'); var D = window.docx, kids = [];
    pages.forEach(function (pg, pi) {
      var items = pg.items.slice(), hs = items.map(function (i) { return i.h; }).sort(function (a, b) { return a - b; }), mh = hs[Math.floor(hs.length / 2)] || 10;
      items.sort(function (a, b) { return (a.y + a.h / 2) - (b.y + b.h / 2) || a.x - b.x; });
      var lines = [], cur = null;
      items.forEach(function (it) {
        var cy = it.y + it.h / 2;
        if (cur && Math.abs(cy - cur.cy) <= mh * 0.6) { cur.its.push(it); } else { cur = { cy: cy, its: [it], h: it.h, y: it.y }; lines.push(cur); }
      });
      var prev = null, para = [];
      function flush() { if (para.length) { addPara(para.join(' '), para.h || mh); para = []; } }
      function addPara(text, h) {
        var head = h > mh * 1.35 && text.length < 90;
        kids.push(new D.Paragraph({ spacing: { after: 120 }, heading: head ? D.HeadingLevel.HEADING_2 : undefined, children: [new D.TextRun({ text: text, bold: head })] }));
      }
      lines.forEach(function (ln) {
        ln.its.sort(function (a, b) { return a.x - b.x; });
        var text = ln.its.map(function (i) { return i.s; }).join(' ');
        if (prev && ln.y - prev.y > mh * 2.1) flush();
        if (ln.h > mh * 1.35) { flush(); addPara(text, ln.h); } else { para.h = mh; para.push(text); }
        prev = ln;
      });
      flush();
      if (pi < pages.length - 1) kids.push(new D.Paragraph({ children: [new D.PageBreak()] }));
    });
    return D.Packer.toBlob(new D.Document({ sections: [{ children: kids }] }));
  }

  async function buildXlsx(pages) {
    await CK.lib('xlsx'); var X = window.XLSX, wb = X.utils.book_new(), nm = $('nm').checked, per = $('sh').checked, stack = [];
    function conv(v) { if (!nm) return v; var t = String(v).replace(/[,\s]/g, ''); return /^[-+]?\(?\d+(\.\d+)?\)?%?$/.test(t) && t.length < 16 ? (t.indexOf('%') > -1 ? parseFloat(t) / 100 : parseFloat(t.replace(/[()]/g, ''))) * (/^\(.*\)$/.test(t) ? -1 : 1) : v; }
    pages.forEach(function (pg, i) {
      var rows = CK.itemsToGrid(pg.items).map(function (r) { return r.map(conv); });
      if (per) X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(rows.length ? rows : [['']]), 'Page ' + (i + 1));
      else { stack = stack.concat(rows, [[]]); }
    });
    if (!per) X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(stack), 'Sheet1');
    return new Blob([X.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  function show() {
    var r = $('res'); r.hidden = false;
    r.innerHTML = '<h3 class="ck-res-title">Done &mdash; ' + results.length + ' file' + (results.length > 1 ? 's' : '') + ' ready</h3>' +
      (to === 'jpg' && results.length < 13 ? '<div class="ck-gal">' + results.map(function (x) { return '<img src="' + URL.createObjectURL(x.blob) + '" alt="' + CK.esc(x.name) + '">'; }).join('') + '</div>' : '') +
      '<ul class="ck-files">' + results.map(function (x, i) { return '<li><span class="ck-fn">' + CK.esc(x.name) + '</span><span class="ck-fs">' + CK.fmt(x.blob.size) + '</span><button type="button" class="ck-btn sm" data-d="' + i + '">' + CK.icon.down + ' Download</button></li>'; }).join('') + '</ul>' +
      (results.length > 1 ? '<div class="ck-actions"><button type="button" class="ck-btn primary" id="zip">' + CK.icon.down + ' Download all (.zip)</button></div>' : '') +
      (to === 'word' || to === 'excel' ? '<p class="ck-hint">Check the result: layouts with complex tables, columns or handwriting may need a quick manual tidy.</p>' : '');
    r.onclick = async function (e) {
      var b = e.target.closest('[data-d]'); if (b) { var x = results[+b.dataset.d]; CK.download(x.blob, x.name); return; }
      if (e.target.closest('#zip')) { try { CK.download(await CK.zip(results), CK.baseName(S.file) + '-pages.zip'); } catch (er) { CK.toast('ZIP library failed to load.', 'err'); } }
    };
    r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();
