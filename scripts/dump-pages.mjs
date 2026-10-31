// Usage: node scripts/dump-pages.mjs && python3 scripts/gen_img.py
// Writes /tmp/pages.json from the page data, then gen_img.py draws public/img/<slug>.png and src/data/images.js.
import { writeFileSync } from 'node:fs';
import { PAGES } from '../src/data/pages.js';
const out = PAGES.map((p) => ({ slug: p.slug, kind: p.kind, h1: p.h1, title: p.title, tool: p.tool, fmt: p.fmt || null, kb: p.kb || 0, family: p.family || null, nav: p.nav,
  cfg: p.cfg ? { w: p.cfg.w, h: p.cfg.h, dpi: p.cfg.dpi, targetKb: p.cfg.targetKb, minKb: p.cfg.minKb, mode: p.cfg.mode } : null }));
writeFileSync('/tmp/pages.json', JSON.stringify(out));
