import { SIZES, SIZE_KEYS } from './sizes.js';
import { FORMATS } from './formats.js';
import { EXAMS, CHECK } from './exams.js';
import { CONVERTERS, G } from './converters.js';

export const NAV_ORDER = ['Image', 'PDF', 'Image Formats', 'Resize', 'Convert', 'Tools', 'Exams'];
export const HUB_OF = { Image: 'image-tools', 'Image Formats': 'image-tools', PDF: 'pdf-tools', Resize: 'resize-tools', Convert: 'converters', Tools: 'photo-tools', Exams: 'photo-tools' };

const Ls = (kb) => (kb >= 1024 ? kb / 1024 + 'MB' : kb + 'KB'); // 1MB, 20KB
const Lt = (kb) => (kb >= 1024 ? kb / 1024 + ' MB' : kb + ' KB'); // 1 MB, 20 KB
const slugKb = (kb) => (kb >= 1024 ? kb / 1024 + 'mb' : kb + 'kb');
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const p = (x) => ({ t: 'p', x }); const ul = (items) => ({ t: 'ul', items }); const ol = (items) => ({ t: 'ol', items });
const table = (head, rows) => ({ t: 'table', head, rows }); const note = (x) => ({ t: 'note', x });
const sec = (h2, blocks) => ({ id: slugify(h2), h2, blocks });
const cut = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:.]$/, '') + '…');
const PRIVACY = ['Is my file uploaded anywhere?', 'No. Everything runs inside your browser tab using your own device. Nothing is sent to a ConvertKB server, and closing the tab clears the memory used.'];

/* ---------- computed tables ---------- */
const round10 = (n) => Math.max(10, Math.round(n / 10) * 10);
function dimsTable(kb, fmt) {
  const b = FORMATS[fmt].bpp, bits = kb * 1000 * 8, asp = [['Square 1:1', 1, 1], ['Passport 3.5:4.5', 3.5, 4.5], ['Landscape 4:3', 4, 3], ['Signature 2:1', 2, 1]];
  const cell = (bpp, a, c) => { const P = bits / bpp, w = Math.sqrt(P * a / c); return round10(w) + ' × ' + round10(w * c / a); };
  return table(['Shape', 'Portrait photo', 'Document or signature', 'Detailed photo'], asp.map(([n, a, c]) => [n, cell(b.portrait, a, c), cell(b.doc, a, c), cell(b.photo, a, c)]));
}
function reductionTable(kb, inputs) {
  return table(['Starting file', 'Starting size', 'Result at ' + Lt(kb)], inputs.map(([n, s]) => [n, s >= 1024 ? (s / 1024).toFixed(1) + ' MB' : s + ' KB', s > kb ? 'about ' + Math.round((1 - kb / s) * 100) + '% smaller' : 'already under the limit']));
}
const IMG_INPUTS = [['Typical phone photo', 3200], ['Cropped passport photo', 650], ['Scanned certificate (JPG)', 1400], ['Small web image', 120]];
const PDF_INPUTS = [['Four-page colour scan', 9000], ['Two-page greyscale scan', 1600], ['Exported text document', 450], ['Single signed page', 220]];
function pdfBudget(kb) {
  const rows = [1, 2, 4, 8, 16].map((n) => {
    const Bp = Math.max(0, kb * 1000 / n - 700), dt = Math.sqrt(Bp / 4.2), dc = Math.sqrt(Bp / 12.1);
    const v = (d) => (d >= 150 ? 'sharp' : d >= 100 ? 'readable' : d >= 70 ? 'tight' : 'too soft');
    return [n + (n === 1 ? ' page' : ' pages'), (kb / n).toFixed(kb / n < 10 ? 1 : 0) + ' KB', Math.round(dt) + ' DPI (' + v(dt) + ')', Math.round(dc) + ' DPI (' + v(dc) + ')'];
  });
  return table(['Pages kept', 'Budget per page', 'Black-and-white text scan', 'Colour photo scan'], rows);
}
function cmPxTable(kb) {
  const sets = {
    tiny: [['4.0 × 2.0 cm', 4, 2], ['3.5 × 1.5 cm', 3.5, 1.5], ['5 × 2 cm', 5, 2], ['6 × 3 cm', 6, 3]],
    small: [['3.5 × 4.5 cm', 3.5, 4.5], ['2.5 × 3.5 cm', 2.5, 3.5], ['4.5 × 3.5 cm', 4.5, 3.5], ['2 × 2 in', 5.08, 5.08]],
    large: [['2 × 2 in', 5.08, 5.08], ['6 × 4 in', 15.24, 10.16], ['5 × 7 in', 12.7, 17.78], ['A4 (21 × 29.7 cm)', 21, 29.7]]
  }, phys = sets[!kb || kb > 200 ? 'large' : kb <= 30 ? 'tiny' : 'small'], d = [72, 150, 200, 300];
  return table(['Physical size'].concat(d.map((x) => x + ' DPI')), phys.map(([n, w, h]) => [n].concat(d.map((x) => Math.round(w / 2.54 * x) + ' × ' + Math.round(h / 2.54 * x)))));
}
function pageSizeTable() {
  const s = [['A3', 297, 420], ['A4', 210, 297], ['A5', 148, 210], ['US Letter', 215.9, 279.4], ['US Legal', 215.9, 355.6]];
  return table(['Page size', 'Millimetres', 'Points', 'Pixels at 150 DPI'], s.map(([n, w, h]) => [n, w + ' × ' + h, Math.round(w / 25.4 * 72) + ' × ' + Math.round(h / 25.4 * 72), Math.round(w / 25.4 * 150) + ' × ' + Math.round(h / 25.4 * 150)]));
}

/* ---------- size page definitions ---------- */
const FAMS = [
  { id: 'compress-image', tool: 'img-compress', fmt: 'image', noun: 'image', verb: 'compress', nav: 'Image', sizes: [10, 20, 30, 40, 50, 100, 150, 200, 500, 1024] },
  { id: 'compress-pdf', tool: 'pdf-compress', fmt: 'pdf', noun: 'pdf', verb: 'compress', nav: 'PDF', sizes: [20, 50, 100, 200, 300, 400, 500, 1024, 2048] },
  { id: 'compress-jpeg', tool: 'img-compress', fmt: 'jpeg', noun: 'jpeg', verb: 'compress', nav: 'Image Formats', sizes: [10, 20, 30, 40, 50, 100, 150, 200, 500] },
  { id: 'compress-jpg', tool: 'img-compress', fmt: 'jpg', noun: 'jpg', verb: 'compress', nav: 'Image Formats', sizes: [10, 20, 30, 40, 50, 100, 150, 200, 500] },
  { id: 'compress-webp', tool: 'img-compress', fmt: 'webp', noun: 'webp', verb: 'compress', nav: 'Image Formats', sizes: [100] },
  { id: 'compress-png', tool: 'img-compress', fmt: 'png', noun: 'png', verb: 'compress', nav: 'Image Formats', sizes: [10, 20, 30, 40, 50, 100, 150, 200, 500, 1024] },
  { id: 'resize-image', tool: 'img-resize', fmt: 'image', noun: 'image', verb: 'resize', nav: 'Resize', sizes: [10, 20, 30, 40, 50, 100, 150, 200, 500, 1024] },
  { id: 'resize-pdf', tool: 'pdf-resize', fmt: 'pdf', noun: 'pdf', verb: 'resize', nav: 'Resize', sizes: [10, 20, 30, 40, 50, 100, 150, 200, 500, 1024] }
];
const NOUN = { image: 'Image', pdf: 'PDF', jpeg: 'JPEG', jpg: 'JPG', webp: 'WebP', png: 'PNG' };
const BASE_META = {
  'compress-image': ['Compress Image Online – Reduce Size in KB or MB | ConvertKB', 'Compress JPG, PNG, WebP or HEIC photos to a size you choose. Auto quality search, optional crop, DPI and greyscale. Private: nothing is uploaded.'],
  'compress-pdf': ['Compress PDF Online – Reduce PDF Size to Any KB | ConvertKB', 'Reduce a PDF to the KB or MB limit you need. Keeps text when possible, rebuilds scans at the best resolution that fits. Private and free.'],
  'compress-jpeg': ['Compress JPEG Online – Set the Exact Size in KB | ConvertKB', 'Compress JPEG photos to a precise size limit. Automatic quality search, crop and enhance tools, with no upload and no signup.'],
  'compress-jpg': ['Compress JPG Online – Reduce JPG Size in KB | ConvertKB', 'Compress JPG files to a size you choose, with a clean .jpg extension for strict upload forms. Quality search, crop, DPI. Private in-browser tool.'],
  'compress-webp': ['Compress WebP Online – Reduce WebP Size in KB | ConvertKB', 'Shrink WebP images to a target size while keeping them sharp. Choose a limit, convert to JPG if needed, and keep files on your device.'],
  'compress-png': ['Compress PNG Online – Reduce PNG Size in KB | ConvertKB', 'Compress PNG files with smart colour reduction and optional resizing. Set a KB limit and keep transparency where possible. Private in-browser tool.'],
  'resize-image': ['Resize Image Online – Pixels, cm or Inches, with KB Limit | ConvertKB', 'Resize photos to exact pixel, centimetre or inch dimensions, set DPI and optionally a KB limit. Crop, rotate and download as JPG, PNG or WebP.'],
  'resize-pdf': ['Resize PDF Online – Change Page Size and File Size | ConvertKB', 'Resize PDF pages to A4, A3, A5, Letter or Legal and keep the file under a KB limit. Vector text is preserved when possible. Private and free.']
};

function stepsFor(f, L) {
  if (f.tool === 'img-compress') return ['Add your image: drop it in the box, click to browse, or paste with Ctrl+V.', `Crop or rotate if you need to. Keep “Fit to a maximum size” ticked and the maximum set to ${Lt(L)}.`, 'Press Compress image. The tool searches for the best quality that fits and shrinks dimensions only if it has to.', 'Check the preview and the size badge, then download your file.'];
  if (f.tool === 'img-resize') return ['Add your image.', 'Enter the width and height in pixels, centimetres or inches and pick the DPI. The crop box locks to those proportions.', `Leave the maximum at ${Lt(L)}; the tool fits the file size inside the dimensions you set.`, 'Press Resize image, check the preview and download.'];
  if (f.tool === 'pdf-compress') return ['Add your PDF. Password-protected files ask for the password.', `Keep the target at ${Lt(L)}. “Smart” keeps text when it can and rebuilds pages only when it must.`, 'Enter the pages you need, and tick greyscale for text scans.', 'Press Compress PDF, read the note about the resolution used, then download.'];
  return ['Add your PDF.', 'Choose the new page size (A4, A3, A5, Letter or Legal) and a margin.', `Set the maximum to ${Lt(L)}.`, 'Press Resize PDF. Pages are scaled to fit; download the result.'];
}
function engineSection(f, L) {
  const T = L ? Lt(L) : 'your limit';
  if (f.tool === 'img-compress') return sec('How the size search works', [p(`ConvertKB does not guess a quality number. It encodes the picture at several qualities, keeps the highest one that is under ${T}, and only reduces pixel dimensions if even the lowest acceptable quality (40%) is still too big.`), p('The target is set slightly under the limit (we use 1 KB = 1000 bytes) so portals that count 1024 bytes per KB also accept the file. The DPI value you choose is written into the file header, and for JPG you can pad up to a minimum size.')]);
  if (f.tool === 'img-resize') return sec('Resizing and file size are linked', [p(`Changing dimensions changes file size, because a smaller picture has fewer pixels to store. When you set exact dimensions and a ${T} limit, ConvertKB keeps your dimensions fixed and lowers quality to fit; it will not silently change your pixel size.`), p('If the limit cannot be reached at those exact dimensions, the result is flagged so you can reduce the dimensions or allow shrinking.')]);
  if (f.tool === 'pdf-compress') return sec('Two ways ConvertKB shrinks a PDF', [p(`First it tries a text-preserving pass that drops metadata and duplicates but leaves the page content untouched. If that already fits ${T}, you keep selectable text and sharp vectors.`), p('If not, pages are rendered, re-encoded as JPEG images at the highest resolution that fits, and reassembled. That gives big savings on scans, but text in the result is no longer selectable. The result note tells you which method ran.')]);
  return sec('Resizing pages without losing text', [p('When you change the page size, ConvertKB scales the original page onto a new page of the size you choose. Text and vector graphics stay sharp because the page is placed, not re-drawn as a picture.'), p(`If the file is still over ${T}, pages are rebuilt as images at the best resolution that fits, and you are told that this happened.`)]);
}

const FI = { 'compress-image': 0, 'compress-jpg': 1, 'compress-jpeg': 2, 'compress-png': 3, 'compress-webp': 4, 'resize-image': 5, 'compress-pdf': 0, 'resize-pdf': 1 };
const win = (arr, start, n) => { if (arr.length <= n) return arr; const o = []; for (let i = 0; i < n; i++) o.push(arr[(start + i) % arr.length]); return o; };
function tier(fmt, bpp) {
  if (fmt === 'png') return bpp < 0.8 ? 'Needs very few colours or far smaller dimensions' : bpp < 2 ? 'Heavy colour reduction (about 16 levels)' : bpp < 4 ? 'Moderate colour reduction (about 48 levels)' : bpp < 8 ? 'Light or no colour reduction' : 'Lossless PNG fits as it is';
  const e = fmt === 'webp' ? bpp * 1.3 : bpp;
  return e < 0.25 ? 'Blocky: shrink the dimensions instead' : e < 0.5 ? 'Heavy compression, visible softness' : e < 0.9 ? 'Moderate: fine for ID-style photos' : e < 1.5 ? 'Good quality' : e < 2.5 ? 'High quality' : 'Near-original quality';
}
function qualityTable(kb, fmt) {
  const rows = [[300, 400], [600, 800], [1200, 1600], [2400, 3200]].map(([w, h]) => { const bpp = kb * 1000 * 8 / (w * h); return [w + ' × ' + h, bpp.toFixed(2), tier(fmt, bpp)]; });
  return table(['Pixel size', 'Bits per pixel you can spend', 'What that means for ' + FORMATS[fmt].label], rows);
}
const dimOf = (kb, fmt, key, a, c) => { const P = kb * 8000 / FORMATS[fmt].bpp[key], w = Math.sqrt(P * a / c); return round10(w) + ' × ' + round10(w * c / a); };

function sizeContent(f, kb) {
  const S = SIZES[kb], F = FORMATS[f.fmt], isPdf = f.fmt === 'pdf', L = Lt(kb), noun = NOUN[f.noun], fi = FI[f.id], gen = f.id === 'compress-image' || f.id === 'compress-pdf';
  const bracket = kb <= 30 ? 'tiny' : kb <= 200 ? 'small' : 'large', resizing = f.verb === 'resize';
  const usesAll = isPdf ? S.pdfUses : S.imgUses, faqBase = isPdf ? S.pdfFaq : S.faq;
  const uses = gen ? usesAll : win(usesAll, fi, resizing ? 3 : 2);
  const tips = gen ? S.tips : [S.tips[fi % 2]], pit = gen ? S.pitfalls : [S.pitfalls[(fi + 1) % 2]];
  const faq0 = gen ? faqBase : [faqBase[fi % faqBase.length]];
  const leadTool = resizing ? (isPdf ? 'Change the page size and fit the file under the limit.' : 'Set the exact dimensions and fit the file under the limit.') : F.lead;
  const out = [];
  if (!gen && !isPdf) {
    const portrait = dimOf(kb, f.fmt, 'portrait', 3.5, 4.5), doc = dimOf(kb, f.fmt, 'doc', 2, 1);
    out.push(sec(`What a ${L} ${noun} can hold`, [p(`${leadTool} At ${L}, expect roughly ${portrait} pixels for a plain portrait and ${doc} pixels for a signature or document with mostly white background, before quality has to drop noticeably.`), qualityTable(kb, f.fmt), p(F.atSize[bracket]), note('These are planning estimates. ConvertKB shows the real size and dimensions after processing.')]));
    out.push(sec(`Where a ${L} ${noun} is used`, [ul(uses)]));
  } else {
    out.push(sec(`When you need a ${L} ${noun}`, [p(`${leadTool} These are the situations where a ${L} limit usually appears:`), ul(uses)]));
    const exp = gen ? (isPdf ? S.pdfExpect : S.imgExpect) : `At ${L}, a single A4 page gets about ${(kb - 1.5).toFixed(0)} KB of image data, and four pages about ${((kb - 1.5) / 4).toFixed(1)} KB each. The table shows the scan resolution that budget supports.`;
    out.push(sec(`What to expect at ${L}`, [p(exp), isPdf ? pdfBudget(kb) : dimsTable(kb, f.fmt), note(isPdf ? 'The DPI figures are planning estimates for typical A4 scans. ConvertKB reports the resolution it actually used.' : 'Dimensions are planning estimates. ConvertKB shows the real size and dimensions after processing.')]));
  }
  const exT = isPdf ? S.exPdf : S.exImg;
  if (exT) out.push(sec(`A real example at ${L}`, [p(exT)]));
  out.push(sec(`How to ${f.verb} ${isPdf ? 'a PDF' : 'a ' + noun} to ${L}`, [ol(stepsFor(f, kb)), ul(tips)]));
  out.push(sec('How the target is set', [p(`For a ${L} limit the tool aims at ${(kb * 1000 - 24).toLocaleString('en-US')} bytes, counting 1 KB as 1000 bytes. That is also under ${(kb * 1024).toLocaleString('en-US')} bytes, so the file passes whether a portal counts 1000 or 1024 bytes per KB.`), { t: 'link', href: '/' + f.id, label: 'How the size search works' }]));
  if (f.tool === 'img-resize') out.push(sec('Pixels, centimetres and DPI', [p('Forms mix units: some ask for pixels, others for centimetres at a given DPI. Pixels equal centimetres divided by 2.54, times the DPI. These sizes are the ones people at this file size ask for most:'), cmPxTable(kb)]));
  if (f.tool === 'pdf-resize') out.push(sec('Standard page sizes', [p('These are the sizes offered in the page-size menu, in the units portals usually quote:'), pageSizeTable()]));
  out.push(sec(`${F.label} notes for ${L}`, [ul(win(F.section.list, SIZE_KEYS.indexOf(kb), 2)), { t: 'link', href: '/' + f.id, label: `More about ${F.label} compression` }]));
  out.push(sec(`Typical results at ${L}`, [p(`How much a file shrinks depends on where it starts. These examples show what a ${L} limit means in practice:`), reductionTable(kb, isPdf ? PDF_INPUTS : IMG_INPUTS)]));
  out.push(sec(`Problems at ${L} and how to avoid them`, [ul(pit.concat([F.pitfall]))]));
  const toolFaq = f.tool === 'img-compress' ? ['Will the tool shrink my image dimensions?', 'Only if quality alone cannot reach the limit and “Allow shrinking” is ticked. Otherwise it keeps the pixel size you set.'] : f.tool === 'img-resize' ? ['Does resizing change the file size?', `Yes. Fewer pixels means a smaller file, and the tool then fits the result under ${L}.`] : f.tool === 'pdf-compress' ? ['Will my PDF text stay selectable?', 'Only if the text-preserving pass fits the limit. When pages are rebuilt as images, the result note says so.'] : ['Will my text stay sharp after resizing pages?', 'Yes when the page is scaled as a vector. If the file also needs shrinking to fit the limit, pages may be rebuilt as images.'];
  return { sections: out, faqs: faq0.concat(gen ? F.faq : [F.faq[fi % 2]], [toolFaq, PRIVACY]) };
}

function baseContent(f) {
  const isPdf = f.fmt === 'pdf', F = FORMATS[f.fmt], fam = FAMS.find((x) => x.id === f.id), out = [];
  const what = { 'img-compress': 'compress', 'img-resize': 'resize', 'pdf-compress': 'compress', 'pdf-resize': 'resize' }[f.tool];
  out.push(sec(`Pick a target size for your ${NOUN[f.noun]}`, [p(`Every common limit has its own page with tips and expectations for that size. Choose the one that matches your form, or use the size box above for any value.`), { t: 'chips', slugs: fam.sizes.map((k) => `${fam.id}-to-${slugKb(k)}`), labels: fam.sizes.map((k) => Lt(k)) }]));
  out.push(sec(`How to ${what} ${isPdf ? 'a PDF' : 'an image'}`, [ol(stepsFor(f, fam.sizes[Math.floor(fam.sizes.length / 2)])), engineSection(f, 0).blocks[0]]));
  out.push(engineSection(f, 0));
  if (f.tool === 'img-resize') out.push(sec('Pixels, centimetres and DPI', [p('Pixels equal centimetres divided by 2.54, times the DPI. These conversions come up most often:'), cmPxTable(0)]));
  if (f.tool === 'pdf-resize') out.push(sec('Standard page sizes', [p('These are the sizes available in the page-size menu:'), pageSizeTable()]));
  out.push(sec(F.section.h2, [].concat(F.section.ps.map(p), [ul(F.section.list)])));
  const guide = isPdf ? ['See our guide', 'Read “How to Make a PDF Smaller Without Making It Unreadable” for a plain-language walkthrough of resolution and readability.'] : ['See our guide', 'Read “Why Application Portals Reject Photos and Signatures” for the usual causes and fixes.'];
  out.push(sec('Before you upload', [ul(isPdf ? ['Open the result and scroll through every page.', 'Confirm the pages are in the order the portal expects.', 'Zoom to 100% on small print to check it is legible.', 'Keep the original PDF in case a higher-quality copy is requested later.'] : ['Open the result at 100% zoom to check detail.', 'Confirm the pixel dimensions and size against the form.', 'Check the file extension matches the instructions.', 'Keep your original photo; do not compress a compressed copy again.']), p(guide[1])]));
  const faqs = isPdf ? [['What is the best way to shrink a scanned PDF?', 'Lower the resolution, use greyscale for text pages and keep only the pages you need. ConvertKB does this automatically to fit your limit.'], ['Can I keep text selectable?', 'Only if the PDF already contains real text and the text-preserving pass reaches your limit.']] : [['What size should I choose?', 'Use the number printed on the form you are filling in. If none is given, 100 KB is a good general-purpose target.'], ['Which format is smallest?', 'WebP, then JPG, then PNG for photographs. JPG is the safest for official uploads.']];
  return { sections: out, faqs: faqs.concat(F.faq.slice(0, 1), [PRIVACY]) };
}

/* ---------- assemble pages ---------- */
export const PAGES = [];
const add = (o) => PAGES.push(o);

for (const f of FAMS) {
  const mode = f.verb;
  const cfgFmt = f.fmt === 'png' ? 'png' : f.fmt === 'webp' ? 'webp' : 'jpeg';
  const isPdf = f.fmt === 'pdf';
  const toolName = isPdf ? 'pdf' : 'image';
  // base page
  {
    const [title, desc] = BASE_META[f.id], c = baseContent(f);
    add({ slug: f.id, kind: 'tool', nav: f.nav, tool: toolName, family: f.id, fmt: f.fmt, kb: 0, title, desc, h1: `${NOUN[f.noun] === 'Image' ? 'Image' : NOUN[f.noun]} ${f.verb === 'compress' ? 'Compressor' : 'Resizer'}`, lead: f.verb === 'compress' ? `Choose a size limit and let ConvertKB find the best quality that fits. ${FORMATS[f.fmt].lead}` : `Set exact dimensions and an optional size limit. ${FORMATS[f.fmt].lead}`,
      cfg: isPdf ? { mode, targetKb: f.verb === 'compress' ? 200 : 500 } : { mode, targetKb: f.verb === 'compress' ? 100 : 0, format: cfgFmt }, sections: c.sections, faqs: c.faqs });
  }
  for (const kb of f.sizes) {
    const S = SIZES[kb], c = sizeContent(f, kb), slug = `${f.id}-to-${slugKb(kb)}`;
    const verbT = f.verb === 'compress' ? 'Compress' : 'Resize';
    const title = f.verb === 'compress' ? `Compress ${NOUN[f.noun]} to ${Ls(kb)} Online – Free & Private | ConvertKB` : isPdf ? `Resize PDF to ${Ls(kb)} – Page Size & File Size | ConvertKB` : `Resize Image to ${Ls(kb)} Online – Set Size in KB | ConvertKB`;
    const hookTxt = isPdf ? cut(S.pdfUses[0].replace(/\.$/, '').replace(/^./, (m) => m.toLowerCase()), 80) : S.hook;
    const tail = f.tool === 'pdf-resize' ? 'Pages are scaled, not redrawn.' : f.tool === 'img-resize' ? 'Set exact pixels, cm or inches.' : FORMATS[f.fmt].tail;
    const desc = cut(`${verbT} ${isPdf ? 'a PDF' : /^[aeiou]/i.test(NOUN[f.noun]) ? 'an ' + NOUN[f.noun] : 'a ' + NOUN[f.noun]} to under ${Lt(kb)} for ${hookTxt}. ${tail} Private, free, no upload.`, 158);
    add({ slug, kind: 'tool', nav: f.nav, tool: toolName, family: f.id, fmt: f.fmt, kb, title, desc, h1: `${verbT} ${NOUN[f.noun]} to ${Lt(kb)}`, lead: `${verbT} your ${isPdf ? 'PDF' : NOUN[f.noun] === 'Image' ? 'image' : NOUN[f.noun]} so it stays under ${Lt(kb)}, ready for ${hookTxt}.`,
      cfg: isPdf ? { mode, targetKb: kb } : { mode, targetKb: kb, format: cfgFmt }, sections: c.sections, faqs: c.faqs, relatedSlugs: S.related });
  }
}

for (const e of EXAMS) {
  add({ slug: e.slug, kind: 'exam', nav: e.nav, tool: 'image', title: e.title, desc: e.desc, h1: e.h1, lead: e.lead, cfg: e.cfg, official: e.official, relatedSlugs: e.related, faqs: e.faq.concat([PRIVACY]),
    sections: [
      sec('Specifications at a glance', [p('Use this table as a checklist. The presets in the tool set most of these values for you.'), table(e.specHead, e.specRows), note(CHECK)]),
      sec('How to prepare your file', [ol(e.steps)]),
      sec('Common mistakes to avoid', [ul(e.mistakes)]),
      sec('Not sure why uploads fail?', [p('Most rejections come down to size, pixel dimensions, format or the quality of the original photo. Our guide “Why Application Portals Reject Photos and Signatures” walks through each case with a fix.'), { t: 'link', href: '/guides/why-upload-photos-get-rejected', label: 'Read the guide' }])
    ].concat(e.official ? [sec('Official source', [p(`For the final word, read the instructions published by the organisation: ${e.official.label}.`), { t: 'link', href: e.official.url, label: e.official.label, ext: true }])] : [])
  });
}

const FACTS = {
  JPG: ['Lossy', 'No', '1x (baseline)', 'Photos, forms, email', 'Almost always'], JPEG: ['Lossy', 'No', '1x (baseline)', 'Photos, forms, email', 'Almost always'],
  PNG: ['Lossless', 'Yes', '3–8x larger than JPG for photos', 'Logos, screenshots, editing', 'Usually'], WebP: ['Lossy or lossless', 'Yes', 'About 0.7x of JPG', 'Websites and apps', 'Often rejected'],
  HEIC: ['Lossy (video-based)', 'Yes', 'About 0.5x of JPG', 'iPhone camera storage', 'Rarely']
};
const FACT_ROWS = ['Compression', 'Transparency', 'Typical file size', 'Best for', 'Accepted by upload forms'];
const PDF_TARGET = {
  word: ['Real text', 'Scanned page', 'Tables', 'Pictures', 'Fonts and layout'],
};
const PDFOUT = {
  jpg: [['Real text', 'Drawn into the page image'], ['Scanned page', 'Kept as is'], ['Tables', 'Part of the image'], ['Pictures', 'Included'], ['Output size', 'Set by DPI: 150 DPI A4 is about 1240 × 1754 px']],
  word: [['Real text', 'Extracted as editable paragraphs'], ['Scanned page', 'Read with OCR if enabled'], ['Tables', 'Become plain lines of text'], ['Pictures', 'Not carried over'], ['Output size', 'Small, text only']],
  excel: [['Real text', 'Placed into cells by position'], ['Scanned page', 'Read with OCR if enabled'], ['Tables', 'Rebuilt as rows and columns'], ['Pictures', 'Not carried over'], ['Output size', 'Small, values only']],
  ppt: [['Real text', 'Shown in the slide image and copied to notes'], ['Scanned page', 'Shown as an image'], ['Tables', 'Part of the slide image'], ['Pictures', 'Included in the slide image'], ['Output size', 'Grows with page count']]
};
const LANG_ROWS = [['English', 'Latin'], ['Hindi', 'Devanagari'], ['Marathi', 'Devanagari'], ['Tamil', 'Tamil'], ['Telugu', 'Telugu'], ['Kannada', 'Kannada'], ['Malayalam', 'Malayalam'], ['Bengali', 'Bengali'], ['Gujarati', 'Gujarati'], ['English + Hindi', 'Latin and Devanagari']];
function converterTable(c) {
  if (c.group === 'imgfmt' || c.group === 'heic') {
    const a = FACTS[c.from], b = FACTS[c.to]; if (!a || !b) return null;
    return sec(`${c.from} compared with ${c.to}`, [table(['Property', c.from, c.to], FACT_ROWS.map((r, i) => [r, a[i], b[i]]))]);
  }
  if (c.group === 'pdfout') return sec(`How each part of a PDF is handled`, [table(['In your PDF', `Converted to ${c.to}`], PDFOUT[c.cfg.to])]);
  if (c.group === 'ocr') return sec('Languages the text reader supports', [table(['Language', 'Script'], LANG_ROWS)]);
  if (c.group === 'toPdf') return sec('Page sizes available', [pageSizeTable()]);
  return null;
}
const SCRIPT = { image: 'ck-image.js', pdf: 'ck-pdf.js', convert: 'ck-convert.js', pdfconv: 'ck-pdfconv.js', ocr: 'ck-ocr.js' };
export { SCRIPT };
for (const c of CONVERTERS) {
  const g = G[c.group], blocks = [];
  const sections = [
    sec(`How to convert ${c.from} to ${c.to}`, [ol(c.how)]),
    sec('What to know before you convert', [ul(c.limits)]),
    sec(`What ${c.from} to ${c.to} is best for`, [ul(c.best)]),
    sec(g.h2, [].concat(g.ps.map(p), [ul(g.list)]))
  ];
  const ct = converterTable(c); if (ct) sections.splice(3, 0, ct);
  if (c.extra && G[c.extra]) sections.push(sec(G[c.extra].h2, [].concat(G[c.extra].ps.map(p), [ul(G[c.extra].list)])));
  const guideLink = c.group === 'heic' || c.extra === 'heic' ? ['/guides/heic-explained', 'Read: HEIC explained'] : c.group === 'pdfout' ? ['/guides/compress-pdf-without-losing-readability', 'Read: PDF size and readability'] : c.group === 'imgfmt' ? ['/guides/jpeg-vs-png-vs-webp', 'Read: JPEG vs PNG vs WebP'] : ['/guides/why-upload-photos-get-rejected', 'Read: why uploads get rejected'];
  sections.push(sec('Learn more', [p('Want the background on formats and sizes before you convert?'), { t: 'link', href: guideLink[0], label: guideLink[1] }]));
  const kind = c.tool;
  add({ slug: c.slug, kind: 'convert', nav: 'Convert', tool: kind, title: c.title, desc: c.desc, h1: c.h1, lead: c.lead, cfg: c.cfg, group: c.group, sections, faqs: c.faq.concat([PRIVACY]) });
}

/* ---------- hubs ---------- */
export const HUBS = [
  { slug: 'image-tools', navs: ['Image', 'Image Formats'], h1: 'Image Compression Tools', title: 'Image Compression Tools – Compress to Any KB | ConvertKB', desc: 'Every ConvertKB image compressor in one place: generic, by size (10 KB to 1 MB) and by format (JPG, JPEG, PNG, WebP).', lead: 'Compress photos and scans to the exact size an upload form asks for.',
    sections: [sec('Common size limits at a glance', [table(['Limit', 'Where it usually appears'], SIZE_KEYS.filter((k) => SIZES[k].imgUses.length).map((k) => [Lt(k), SIZES[k].hook]))]), sec('Which image compressor should you use?', [p('Start with the size on your form. If it says 20 KB, open the 20 KB page; each size page explains who typically needs it and what dimensions it comfortably holds. If your form names a format, use the JPG, JPEG, PNG or WebP page so the output matches.'), p('Not sure of the limit? The general Compress Image page lets you type any maximum, or turn off the limit and set a quality manually.')])],
    faqs: [['What is the difference between the size pages?', 'The tool is the same; each page has guidance and presets for that size, such as typical dimensions and who asks for it.'], PRIVACY] },
  { slug: 'pdf-tools', navs: ['PDF'], h1: 'PDF Compression Tools', title: 'PDF Compression Tools – Reduce PDF to Any Size | ConvertKB', desc: 'Compress PDFs to 20 KB, 50 KB, 100 KB, 200 KB, 500 KB, 1 MB, 2 MB or any size you type. Text-preserving when possible, private in your browser.', lead: 'Shrink scanned and digital PDFs for portals, email and sharing.',
    sections: [sec('What each PDF limit typically holds', [table(['Limit', 'Pages that typically fit (greyscale text scan)'], SIZE_KEYS.map((k) => [Lt(k), SIZES[k].pdfUses[0]]))]), sec('How PDF compression works here', [p('Digital PDFs are usually small already; scans are the problem because each page is a photograph. ConvertKB first tries to keep your text and vectors, and rebuilds pages as images only when needed to meet your size.'), p('Pick the size page that matches your limit for guidance on how many pages fit and what resolution to expect.')])],
    faqs: [['Which PDF size page should I open?', 'Open the one matching your portal’s limit; the page explains how many pages typically fit.'], PRIVACY] },
  { slug: 'resize-tools', navs: ['Resize'], h1: 'Image and PDF Resizers', title: 'Resize Image and PDF Tools – Dimensions and KB | ConvertKB', desc: 'Resize images to exact pixels, cm or inches, and PDFs to A4, A3, A5, Letter or Legal, with an optional KB limit. Free and private.', lead: 'Change dimensions or page size, then fit the file under a size limit.',
    sections: [sec('Page sizes and pixel sizes', [pageSizeTable(), cmPxTable(60)]), sec('Resize versus compress', [p('Resizing changes the dimensions of a picture or the page size of a PDF. Compressing changes how much data is used to store it. Forms often need both: the right pixel size and a file under a limit. The resize tools do both in one step.')])],
    faqs: [['Do resized files lose quality?', 'Shrinking uses a high-quality resampling method, so results stay sharp. Enlarging adds no new detail.'], PRIVACY] },
  { slug: 'converters', navs: ['Convert'], h1: 'Image and PDF Converters', title: 'Free Converters – PDF to Word, HEIC to JPG, JPG to PDF | ConvertKB', desc: 'Convert PDF to Word, Excel, JPG and PowerPoint; images to Word, Excel and PDF; HEIC to JPG, PNG and PDF; JPG, PNG and WebP. Private and in-browser.', lead: 'Working converters for the formats people actually need, all processed on your device.',
    sections: [sec('What converts to what', [table(['From', 'To', 'Runs on'], CONVERTERS.map((c) => [c.from, c.to, c.tool === 'ocr' ? 'Text recognition (OCR)' : c.tool === 'pdfconv' ? 'PDF reader' : c.group === 'heic' ? 'HEIC decoder' : 'Browser image engine']))]), sec('How the converters work', [p('Format conversions use your browser’s own image engine. HEIC uses an in-browser decoder. PDF to Word and Excel read the text layer (or use OCR for scans). Nothing is uploaded.')])],
    faqs: [['Are the converters really free?', 'Yes, with no signup or watermark.'], PRIVACY] },
  { slug: 'photo-tools', navs: ['Tools', 'Exams'], h1: 'Photo and Signature Tools', title: 'Exam, Passport and Platform Photo Tools | ConvertKB', desc: 'Photo and signature resizers for UPSC, SSC, IBPS, NEET, GATE, PAN, passport, US visa, YouTube and Instagram, with presets for size, pixels and DPI.', lead: 'One-click presets for the photo, signature and thumbnail uploads that exam and ID portals ask for.',
    sections: [sec('Presets at a glance', [table(['Page', 'What it prepares'], EXAMS.map((e) => [e.h1, e.cfg.presets.map((x) => x.label).join(' · ')]))]), sec('Using the presets', [p('Choose your exam or document, pick the preset for the upload (photo, signature, thumb impression) and press Prepare photo. Presets set pixel size, size range and DPI. Always compare them with the instructions in your own notification.')])],
    faqs: [['Are the sizes always up to date?', 'Portals can change limits between cycles, so each page reminds you to confirm against your notification. You can edit any value after choosing a preset.'], PRIVACY] }
].map((h) => ({ ...h, kind: 'hub', tool: null, nav: null, cfg: null }));

for (const h of HUBS) PAGES.push(h);

export const PAGE_MAP = Object.fromEntries(PAGES.map((x) => [x.slug, x]));
export const NAV = NAV_ORDER.map((name) => ({ name, hub: HUB_OF[name], items: PAGES.filter((x) => x.nav === name) }));

export function relatedFor(page, max = 8) {
  const out = [], seen = new Set([page.slug]), push = (s) => { if (s && PAGE_MAP[s] && !seen.has(s)) { seen.add(s); out.push(PAGE_MAP[s]); } };
  if (page.kind === 'tool' && page.kb) {
    const fam = PAGES.filter((x) => x.family === page.family && x.kb).sort((a, b) => a.kb - b.kb), i = fam.findIndex((x) => x.slug === page.slug);
    push(fam[i - 1] && fam[i - 1].slug); push(fam[i + 1] && fam[i + 1].slug); push(fam[i - 2] && fam[i - 2].slug); push(fam[i + 2] && fam[i + 2].slug);
    const sib = page.family.startsWith('compress') ? page.family.replace('compress', 'resize') : page.family.replace('resize', 'compress');
    push(`${sib}-to-${page.kb >= 1024 ? page.kb / 1024 + 'mb' : page.kb + 'kb'}`);
    const alt = page.fmt === 'pdf' ? null : ['compress-image', 'compress-jpg', 'compress-png'].find((f) => f !== page.family && !page.family.startsWith('resize'));
    if (alt) push(`${alt}-to-${page.kb >= 1024 ? page.kb / 1024 + 'mb' : page.kb + 'kb'}`);
  }
  (page.relatedSlugs || []).forEach(push);
  if (page.kind === 'convert') PAGES.filter((x) => x.kind === 'convert' && x.group === page.group).forEach((x) => push(x.slug));
  if (page.kind === 'exam') PAGES.filter((x) => x.kind === 'exam' && x.nav === page.nav).forEach((x) => push(x.slug));
  if (page.kind === 'tool' && !page.kb) PAGES.filter((x) => x.family === page.family && x.kb).slice(0, 8).forEach((x) => push(x.slug));
  return out.slice(0, max);
}
export const hubOf = (page) => (page.nav ? PAGE_MAP[HUB_OF[page.nav]] : null);
