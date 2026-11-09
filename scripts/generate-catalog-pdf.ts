import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage } from "pdf-lib";
import { categoryCatalogs } from "../app/data/categories";
import fs from "fs";
import path from "path";

const DARK = rgb(0.043, 0.043, 0.062); // #0a0a0f
const DARK2 = rgb(0.063, 0.063, 0.086); // #101016
const CARD = rgb(0.075, 0.075, 0.105);
const RED = rgb(0.89, 0.106, 0.173); // #e31b2c
const RED_DARK = rgb(0.64, 0, 0.07);
const WHITE = rgb(0.98, 0.98, 0.98);
const GREY = rgb(0.62, 0.62, 0.66);
const LINE = rgb(0.16, 0.16, 0.2);

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

function sanitize(text: string): string {
  return text
    .replace(/[\u2013\u2014]/g, " - ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2026]/g, "...")
    .replace(/[^\x00-\x7F]/g, "");
}

function wrap(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  const clean = sanitize(text);
  const words = clean.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Project root = two levels up from this script (scripts/). */
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "quantam wear");

function loadImage(doc: PDFDocument, imgPath: string): PDFImage | null {
  try {
    const abs = path.join(PROJECT_ROOT, "public", imgPath.replace(/^\//, ""));
    const bytes = fs.readFileSync(abs);
    if (abs.toLowerCase().endsWith(".png")) return doc.embedPng(bytes);
    return doc.embedJpg(bytes);
  } catch {
    return null;
  }
}

async function main() {
  const doc = await PDFDocument.create();
  doc.setTitle("QuantumWear X - B2B Product Manufacturing Catalog");
  doc.setAuthor("QuantumWear X");
  doc.setSubject("B2B Custom Apparel, Leather Goods & Bags Manufacturing Catalog");
  doc.setProducer("QuantumWear X");

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const oblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const cache = new Map<string, PDFImage>();
  function image(src: string): PDFImage | null {
    if (!cache.has(src)) cache.set(src, loadImage(doc, src));
    return cache.get(src) || null;
  }

  /* ------------------------------- COVER ------------------------------- */
  {
    const page = doc.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: DARK });
    page.drawRectangle({ x: 0, y: PAGE_H - 8, width: PAGE_W, height: 8, color: RED });
    page.drawRectangle({ x: 0, y: 0, width: 10, height: PAGE_H, color: RED });

    const hero = image("/images/hero_factory_sewing.jpg");
    if (hero) {
      const w = CONTENT_W + 0;
      const h = (hero.height / hero.width) * w;
      const clipped = Math.min(h, 300);
      page.drawRectangle({ x: MARGIN, y: PAGE_H - 72 - clipped, width: w, height: clipped, color: DARK2 });
      page.drawImage(hero, {
        x: MARGIN,
        y: PAGE_H - 72 - clipped,
        width: w,
        height: (hero.height / hero.width) * w,
        ySkew: ((hero.height / hero.width) * w - clipped) / (((hero.height / hero.width) * w) || 1) * 0,
      });
    }

    page.drawText("QUANTUMWEAR X", {
      x: MARGIN,
      y: 470,
      size: 42,
      font: bold,
      color: WHITE,
    });
    const xb = helv.widthOfTextAtSize("QUANTUMWEAR", 42);
    page.drawText("X", { x: MARGIN + xb + 10, y: 470, size: 42, font: bold, color: RED });

    page.drawRectangle({ x: MARGIN, y: 440, width: 120, height: 3, color: RED });
    page.drawText("B2B PRODUCT MANUFACTURING CATALOG", {
      x: MARGIN,
      y: 410,
      size: 15,
      font: bold,
      color: RED,
    });

    const coverLines = wrap(
      "Custom Activewear • Sportswear • Streetwear • Safety Wear • Leather Goods • Bags. Engineered from prototype to bulk production in Sialkot, Pakistan - serving fitness, sports, streetwear and industrial brands worldwide.",
      helv,
      11,
      CONTENT_W - 40
    );
    coverLines.forEach((l, i) =>
      page.drawText(l, { x: MARGIN, y: 372 - i * 17, size: 11, font: helv, color: GREY })
    );

    const stats = [
      ["EST. 2020", "Family-owned manufacturing"],
      ["OEKO-TEX 100", "Certified materials"],
      ["B2B / PRIVATE", "OEM, ODM & private label"],
    ];
    stats.forEach((s, i) => {
      const x = MARGIN + i * 180;
      page.drawRectangle({ x, y: 250, width: 160, height: 70, color: DARK2, borderColor: LINE, borderWidth: 1 });
      page.drawText(s[0], { x: x + 12, y: 296, size: 13, font: bold, color: RED });
      const sl = wrap(s[1], helv, 8.5, 136);
      sl.slice(0, 2).forEach((line, j) =>
        page.drawText(line, { x: x + 12, y: 278 - j * 11, size: 8.5, font: helv, color: GREY })
      );
    });

    page.drawText("www.quantumwearx.com", {
      x: MARGIN,
      y: 96,
      size: 11,
      font: bold,
      color: WHITE,
    });
    page.drawText("SIALKOT, PAKISTAN - EXPORTING WORLDWIDE", {
      x: MARGIN,
      y: 74,
      size: 9,
      font: helv,
      color: GREY,
    });
    page.drawText("PREPARED FOR B2B PARTNERS - 2026 EDITION", {
      x: MARGIN,
      y: 40,
      size: 8,
      font: oblique,
      color: GREY,
    });
  }

  /* ---------------------------- CATEGORIES ----------------------------- */
  categoryCatalogs.forEach((cat) => {
    const page = doc.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: DARK });
    // top band
    page.drawRectangle({ x: 0, y: PAGE_H - 42, width: PAGE_W, height: 42, color: DARK2 });
    page.drawRectangle({ x: 0, y: PAGE_H - 42, width: PAGE_W, height: 1, color: LINE });
    page.drawText("QUANTUMWEAR X", { x: MARGIN, y: PAGE_H - 27, size: 11, font: bold, color: WHITE });
    page.drawText("MANUFACTURING CATALOG", { x: MARGIN + 118, y: PAGE_H - 27, size: 9, font: helv, color: GREY });
    page.drawRectangle({ x: 0, y: PAGE_H - 43, width: 210, height: 1, color: RED });

    let y = PAGE_H - 78;
    page.drawText(sanitize(cat.eyebrow), { x: MARGIN, y, size: 9, font: bold, color: RED });
    y -= 18;
    const title = sanitize(cat.headingTitle);
    const titleSize = bold.widthOfTextAtSize(title, 26) > CONTENT_W ? 22 : 26;
    page.drawText(title, { x: MARGIN, y, size: titleSize, font: bold, color: WHITE });
    y -= 14;
    // divider under category header
    page.drawRectangle({ x: MARGIN, y, width: CONTENT_W, height: 0.8, color: LINE });
    page.drawRectangle({ x: MARGIN, y, width: 90, height: 0.8, color: RED });
    y -= 24;

    // intro block
    const introTitleLines = wrap(cat.introTitle, bold, 13, CONTENT_W);
    introTitleLines.forEach((l) => {
      page.drawText(l, { x: MARGIN, y, size: 13, font: bold, color: WHITE });
      y -= 16;
    });
    const introLines = wrap(cat.intro, helv, 10, CONTENT_W);
    introLines.forEach((l, i) => {
      if (i >= 5) return;
      page.drawText(l, { x: MARGIN, y, size: 10, font: helv, color: GREY });
      y -= 14;
    });
    y -= 4;

    // subcategories chips
    page.drawText("CAPABILITIES", { x: MARGIN, y, size: 8.5, font: bold, color: RED });
    y -= 14;
    let cx = MARGIN;
    cat.subItems.slice(0, 6).forEach((s) => {
      const label = sanitize(s);
      const w = helv.widthOfTextAtSize(label, 8.5) + 16;
      if (cx + w > PAGE_W - MARGIN) { cx = MARGIN; y -= 18; }
      page.drawRectangle({ x: cx, y: y - 4, width: w, height: 15, color: DARK2, borderColor: LINE, borderWidth: 0.7 });
      page.drawText(label, { x: cx + 8, y: y, size: 8.5, font: helv, color: GREY });
      cx += w + 6;
    });
    y -= 26;

    // product cards grid: 2 cols
    page.drawText("PRODUCT RANGE", { x: MARGIN, y, size: 8.5, font: bold, color: RED });
    y -= 12;

    const COL_GAP = 14;
    const COL_W = (CONTENT_W - COL_GAP) / 2;
    const CARD_H = 172;
    cat.products.forEach((prod, idx) => {
      const col = idx % 2;
      const placingRow = Math.floor(idx / 2);
      const x = MARGIN + col * (COL_W + COL_GAP);
      const yTop = y - placingRow * (CARD_H + 14) - CARD_H;

      if (yTop < MARGIN + 30) return; // safety: skip overflow (one page per cat is designed-to-fit)

      // card bg
      page.drawRectangle({ x, y: yTop, width: COL_W, height: CARD_H, color: CARD, borderColor: LINE, borderWidth: 0.7 });
      page.drawRectangle({ x, y: yTop + CARD_H - 2, width: COL_W, height: 2, color: RED_DARK });

      // image
      const img = prod.image ? image(prod.image) : null;
      const imgX = x + 10;
      const imgY = yTop + CARD_H - 14 - 92;
      if (img) {
        const w = COL_W - 20;
        const h = Math.min((img.height / img.width) * w, 92);
        page.drawImage(img, { x: imgX, y: imgY, width: w, height: h });
      } else {
        page.drawRectangle({ x: imgX, y: imgY, width: COL_W - 20, height: 92, color: DARK2 });
      }

      // tag
      if (prod.tag) {
        page.drawText(sanitize(prod.tag), {
          x: imgX,
          y: imgY - 14,
          size: 7,
          font: bold,
          color: RED,
        });
      }
      // name
      let ny = imgY - 28;
      wrap(prod.name, bold, 10.5, COL_W - 20)
        .slice(0, 2)
        .forEach((l) => {
          page.drawText(l, { x: imgX, y: ny, size: 10.5, font: bold, color: WHITE });
          ny -= 13;
        });
      // description 2 lines
      const desc = prod.description || prod.alt || "";
      wrap(desc, helv, 8, COL_W - 20)
        .slice(0, 2)
        .forEach((line) => {
          page.drawText(line, { x: imgX, y: ny - 1, size: 8, font: helv, color: GREY });
          ny -= 10.5;
        });

      // category footer note
      page.drawText(sanitize(`QUOTE CATEGORY: ${prod.quoteCategory}`), {
        x: imgX,
        y: yTop + 6,
        size: 6.5,
        font: helv,
        color: rgb(0.45, 0.45, 0.5),
      });
    });
  });

  /* ---------------------------- BACK PAGE ------------------------------ */
  {
    const page = doc.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: DARK });
    page.drawRectangle({ x: 0, y: PAGE_H - 8, width: PAGE_W, height: 8, color: RED });
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 10, color: RED });

    page.drawText("LET'S BUILD YOUR COLLECTION", {
      x: MARGIN, y: 600, size: 24, font: bold, color: RED,
    });
    page.drawText("From prototype approval to container-scale production.", {
      x: MARGIN, y: 570, size: 12, font: helv, color: WHITE,
    });

    const info: [string, string][] = [
      ["HEAD OFFICE", "Sialkot, Punjab, Pakistan"],
      ["EXPORT REGIONS", "USA  -  Europe  -  UAE  -  Asia"],
      ["CORE SERVICES", "OEM  /  ODM  /  Private Label Manufacturing"],
      ["MOQ FLEXIBILITY", "Single-sample proofs to container-scale bulk runs"],
      ["QUALITY", "OEKO-TEX Standard 100 certified materials"],
      ["WEBSITE", "www.quantumwearx.com"],
    ];
    info.forEach((row, i) => {
      const y = 500 - i * 40;
      page.drawText(row[0], { x: MARGIN, y, size: 8.5, font: bold, color: RED });
      page.drawText(row[1], { x: MARGIN + 160, y, size: 10, font: helv, color: WHITE });
      page.drawRectangle({ x: MARGIN, y: y - 12, width: CONTENT_W, height: 0.5, color: LINE });
    });

    page.drawText("This catalog is a general representation of our manufacturing capabilities.", {
      x: MARGIN, y: 80, size: 8, font: oblique, color: GREY,
    });
    page.drawText("Reach out for the latest samples, pricing and lead times.", {
      x: MARGIN, y: 66, size: 8, font: oblique, color: GREY,
    });
  }

  const bytes = await doc.save();
  const out = path.join(PROJECT_ROOT, "public", "catalog", "QuantumWearX-Catalog.pdf");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, bytes);
  console.log("PDF written:", out, bytes.length, "bytes,", doc.getPageCount(), "pages");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
