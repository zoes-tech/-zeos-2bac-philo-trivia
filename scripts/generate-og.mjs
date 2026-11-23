import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Renders the social card from an SVG so it can be regenerated without a
 * browser. Counts and dimensions come from the same manifests as the app.
 *
 * `node scripts/generate-og.mjs [output]` — default `public/og.png`.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const readJson = (relative) =>
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));

const site = readJson("src/data/site.json");
const levels = readJson("src/data/levels.json");
const modules = levels.flatMap((level) =>
  level.banks.flatMap((bank) =>
    readJson(`src/data/curriculum/${bank}`),
  ),
);
const questions = modules.reduce(
  (total, module) => total + (module.quiz?.length ?? 0),
  0,
);

const host = (
  process.env.NEXT_PUBLIC_SITE_URL || site.url
).replace(/^https?:\/\//, "").replace(/\/+$/, "");

const output = process.argv[2]
  ? path.resolve(root, process.argv[2])
  : path.join(root, "public", site.ogImage.replace(/^\//, ""));

const FONT = "Noto Naskh Arabic, Amiri, serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${site.ogWidth}" height="${site.ogHeight}" viewBox="0 0 ${site.ogWidth} ${site.ogHeight}">
  <defs>
    <radialGradient id="glowA" cx="0.15" cy="0.15" r="0.55">
      <stop offset="0" stop-color="#06b6d4" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#06b6d4" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.85" cy="0.8" r="0.6">
      <stop offset="0" stop-color="#a855f7" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#67e8f9"/>
      <stop offset="0.55" stop-color="#bae6fd"/>
      <stop offset="1" stop-color="#d8b4fe"/>
    </linearGradient>
  </defs>

  <rect width="${site.ogWidth}" height="${site.ogHeight}" fill="${site.backgroundColor}"/>
  <rect width="${site.ogWidth}" height="${site.ogHeight}" fill="url(#glowA)"/>
  <rect width="${site.ogWidth}" height="${site.ogHeight}" fill="url(#glowB)"/>
  <rect x="44" y="44" width="${site.ogWidth - 88}" height="${site.ogHeight - 88}" rx="36" fill="#ffffff" fill-opacity="0.035" stroke="#ffffff" stroke-opacity="0.14"/>

  <g text-anchor="middle" font-family="${FONT}">
    <text x="${site.ogWidth / 2}" y="196" font-size="30" fill="#a5f3fc">مجاني · مفتوح المصدر · بدون حساب</text>
    <text x="${site.ogWidth / 2}" y="330" font-size="104" font-weight="700" fill="url(#title)">${site.name}</text>
    <text x="${site.ogWidth / 2}" y="400" font-size="42" fill="#e5e7eb">اختبار الفلسفة للباكالوريا المغربية</text>
    <text x="${site.ogWidth / 2}" y="462" font-size="27" fill="#9ca3af">${questions} سؤالاً · ${modules.length} محاور · ${levels.length} مستويات · يعمل دون إنترنت</text>
  </g>

  <g font-family="${FONT}" font-size="24" fill="#cffafe">
    <rect x="70" y="500" width="150" height="52" rx="26" fill="#06b6d4" fill-opacity="0.14" stroke="#67e8f9" stroke-opacity="0.35"/>
    <text x="145" y="534" text-anchor="middle">${questions} سؤالاً</text>
    <rect x="238" y="500" width="140" height="52" rx="26" fill="#06b6d4" fill-opacity="0.14" stroke="#67e8f9" stroke-opacity="0.35"/>
    <text x="308" y="534" text-anchor="middle">${modules.length} محاور</text>
    <rect x="396" y="500" width="150" height="52" rx="26" fill="#06b6d4" fill-opacity="0.14" stroke="#67e8f9" stroke-opacity="0.35"/>
    <text x="471" y="534" text-anchor="middle">${levels.length} مستويات</text>
  </g>

  <text x="74" y="${site.ogHeight - 36}" font-family="Arial, sans-serif" font-size="28" fill="#94a3b8">${host}</text>
</svg>`;

fs.mkdirSync(path.dirname(output), { recursive: true });
await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(`${path.relative(root, output)} written (${site.ogWidth}×${site.ogHeight})`);
