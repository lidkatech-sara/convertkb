# ConvertKB

Astro + Cloudflare site with in-browser image and PDF tools (compress, resize, convert). Files never leave the visitor's device.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
npx wrangler deploy   # or push to your Cloudflare Workers/Pages build
```

## Structure

| Path | What it holds |
|---|---|
| `src/data/sizes.js` | Hand-written content for each size (10 KB … 2 MB): uses, expectations, tips, pitfalls, FAQs, worked examples |
| `src/data/formats.js` | Format facts (JPG, JPEG, PNG, WebP, PDF) used for format-specific sections |
| `src/data/exams.js` | Exam / ID / platform pages with presets, spec tables, mistakes, FAQs |
| `src/data/converters.js` | One entry per converter page + group explanations |
| `src/data/guides.js` | Long-form guides (`/guides`) |
| `src/data/pages.js` | Builds all 115 pages, computed tables, related links, nav |
| `src/pages/[slug].astro` | Renders every tool, exam, converter and hub page |
| `public/js/ck-*.js` | The tools. `ck-core` (helpers), `ck-image`, `ck-pdf`, `ck-convert`, `ck-pdfconv`, `ck-ocr` |

Heavy libraries (pdf.js, pdf-lib, jsPDF, JSZip, heic2any, docx, SheetJS, PptxGenJS, Tesseract, Cropper, pica) load from jsDelivr (unpkg fallback) only when a tool needs them. Versions are pinned in `public/js/ck-core.js`.

## Before launch checklist

1. Create the mailbox in `src/consts.js` (`CONTACT_EMAIL`) or change it.
2. After AdSense approval set `ADSENSE_CLIENT` in `src/consts.js`, replace the line in `public/ads.txt`, and give `AdSlot` real slot ids in `[slug].astro`.
3. Verify every exam page's numbers against the current official notification and add your own "last verified" date.
4. Submit `https://convertkb.com/sitemap-index.xml` in Google Search Console.

## Adding or changing a page

Edit the data files; no template changes are needed. To add a size, add it to `SIZES` and to the matching family in `FAMS` (in `pages.js`).
