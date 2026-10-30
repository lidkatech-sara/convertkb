/* Image to Word / Excel using in-browser OCR (Tesseract.js) */
(function () {
  'use strict';
  var root = document.getElementById('ck-tool');
  if (!root || root.dataset.tool !== 'ocr') return;
  var cfg = JSON.parse(root.dataset.config || '{}');
  var to = cfg.to; // word | excel
  var S = { files: [], text: '', grids: [], base: 'document' };

  root.innerHTML =
    '<div class="ck-tool ck-conv"><div class="ck-stage">' +
    '<div class="ck-drop" id="d" tabindex="0" role="button" aria-label="Choose images"><div class="ck-drop-ic">' + CK.icon.upload + '</div>' +
    '<strong>Drop ' + CK.esc(cfg.fromLabel || 'images') + ' here</strong><span>photos of documents, tables, receipts &middot; several pages allowed</span>' +
    '<input type="file" id="f" accept="image/*,.heic,.heif" multiple hidden></div><ul class="ck-files" id="list" hidden></ul></div>' +
    '<aside class="ck-panel"><div class="ck-group"><h3>Text recognition</h3><div class="ck-field"><label for="lg">Language in the image</label><select id="lg">' + CK.langOptions() + '</select></div>' +
    '<p class="ck-hint">The language pack (a few MB) downloads once, then the text is read on your device. Straight, well-lit photos give the best result.</p></div>' +
    '<button type="button" class="ck-btn primary lg" id="go" disabled>Read text &amp; build ' + (to === 'word' ? 'Word file' : 'Excel file') + '</button>' + CK.barHtml + '</aside>' +
    '<div class="ck-result" id="res" hidden></div></div>';

  var $ = function (id) { return document.getElementById(id); };
  var bar = CK.bar(root.querySelector('.ck-bar'));
  CK.dropzone($('d'), $('f'), function (fs) { S.files = S.files.concat(fs); renderList(); }, { multiple: true, paste: true, filter: function (f) { return /^image\//.test(f.type) || CK.isHeic(f); }, reject: 'Please choose image files.' });
  function renderList() {
    var ul = $('list'); ul.hidden = !S.files.length; $('go').disabled = !S.files.length;
    ul.innerHTML = S.files.map(function (f, i) { return '<li data-i="' + i + '"><span class="ck-fn">' + CK.esc(f.name) + '</span><span class="ck-fs">' + CK.fmt(f.size) + '</span><button type="button" class="ck-ib" aria-label="Remove">&times;</button></li>'; }).join('') + '<li class="ck-add"><button type="button" class="ck-chip" id="more">+ Add more</button></li>';
    $('more').onclick = function () { $('f').click(); };
  }
  $('list').addEventListener('click', function (e) { var b = e.target.closest('.ck-ib'); if (b) { S.files.splice(+b.closest('li').dataset.i, 1); renderList(); } });

  $('go').addEventListener('click', async function () {
    var go = $('go'); go.disabled = true; var ocr = null; S.text = ''; S.grids = [];
    try {
      var texts = [];
      for (var i = 0; i < S.files.length; i++) {
        bar.set(i / S.files.length, 'Preparing image ' + (i + 1));
        var c = await CK.fileToCanvas(S.files[i], { maxSide: 2600 });
        if (Math.max(c.width, c.height) < 1100) c = await CK.resizeCanvas(c, c.width * 2, c.height * 2);
        if (!ocr) ocr = await CK.makeOcr($('lg').value, function (p) { bar.set((i + p) / S.files.length, 'Recognising text in image ' + (i + 1) + ' of ' + S.files.length); });
        var o = await ocr.read(c); texts.push(o.text); S.grids.push(CK.itemsToGrid(o.items));
      }
      S.text = texts.join('\n\n'); S.base = CK.baseName(S.files[0]);
      if (!S.text.trim()) throw new Error('No readable text was found. Try a sharper, straighter photo or another language.');
      show();
    } catch (e) { CK.toast((e && e.message) || 'Text recognition failed.', 'err'); }
    if (ocr) await ocr.end();
    bar.hide(); go.disabled = !S.files.length;
  });

  function show() {
    var r = $('res'); r.hidden = false;
    if (to === 'word') {
      r.innerHTML = '<h3 class="ck-res-title">Review the text, then download</h3><textarea id="tx" class="ck-text" rows="12"></textarea><div class="ck-actions"><button type="button" class="ck-btn primary" id="dl">' + CK.icon.down + ' Download .docx</button></div>';
      $('tx').value = S.text;
      $('dl').onclick = async function () {
        try {
          await CK.lib('docx'); var D = window.docx;
          var paras = $('tx').value.split(/\n{2,}/).map(function (t) { return new D.Paragraph({ spacing: { after: 160 }, children: t.split('\n').map(function (ln, i) { return new D.TextRun({ text: ln, break: i ? 1 : 0 }); }) }); });
          CK.download(await D.Packer.toBlob(new D.Document({ sections: [{ children: paras }] })), S.base + '.docx');
        } catch (e) { CK.toast('Could not build the Word file: ' + e.message, 'err'); }
      };
    } else {
      var rows = [].concat.apply([], S.grids.map(function (g) { return g.concat([[]]); }));
      var prev = rows.slice(0, 40);
      r.innerHTML = '<h3 class="ck-res-title">Preview (' + rows.filter(function (x) { return x.length; }).length + ' rows)</h3><div class="ck-tablewrap"><table class="ck-prev">' + prev.map(function (row) { return '<tr>' + row.map(function (c) { return '<td>' + CK.esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div><div class="ck-actions"><button type="button" class="ck-btn primary" id="dl">' + CK.icon.down + ' Download .xlsx</button></div><p class="ck-hint">Columns are guessed from the spacing between words. Check totals and merged cells after opening.</p>';
      $('dl').onclick = async function () {
        try {
          await CK.lib('xlsx'); var X = window.XLSX, wb = X.utils.book_new();
          S.grids.forEach(function (g, i) {
            var aoa = g.map(function (row) { return row.map(function (c) { var t = String(c).replace(/[,\s]/g, ''); return /^[-+]?\d+(\.\d+)?$/.test(t) && t.length < 16 ? parseFloat(t) : c; }); });
            X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(aoa.length ? aoa : [['']]), 'Image ' + (i + 1));
          });
          CK.download(new Blob([X.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' }), S.base + '.xlsx');
        } catch (e) { CK.toast('Could not build the Excel file: ' + e.message, 'err'); }
      };
    }
    r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();
