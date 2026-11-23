import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Generates robots.txt, sitemap.xml and llms.txt into the static export.
 * Runs after `next build`, from the same manifests the app uses.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");

if (!fs.existsSync(outDir)) {
  console.error("out/ not found — run `next build` first.");
  process.exit(1);
}

const readJson = (relative) =>
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));

const site = readJson("src/data/site.json");
const levels = readJson("src/data/levels.json");
const locales = readJson("src/data/locales.json");

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || site.url
).replace(/\/+$/, "");

const modules = levels.flatMap((level) =>
  level.banks.flatMap((bank) =>
    readJson(`src/data/curriculum/${bank}`).map((module) => ({
      ...module,
      levelSlug: level.slug,
    })),
  ),
);

const questionCount = modules.reduce(
  (total, module) => total + (module.quiz?.length ?? 0),
  0,
);

const arLocale = locales.find((locale) => locale.path === "/") ?? locales[0];

const localePages = locales.map((locale) => ({
  path: locale.path,
  priority: locale.id === arLocale.id ? "1.0" : "0.8",
}));

const modulePages = modules.map((module) => ({
  path: `/${module.levelSlug}/${module.id}/`,
  priority: "0.7",
}));

const localeAlternates = [
  ...locales.map((locale) => [locale.hreflang, `${siteUrl}${locale.path}`]),
  ["x-default", `${siteUrl}${arLocale.path}`],
];

const lastmod = new Date().toISOString().slice(0, 10);

function alternateLinks(entries) {
  return entries
    .map(
      ([hreflang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
    )
    .join("\n");
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${localePages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
${alternateLinks(localeAlternates)}
  </url>`,
  )
  .join("\n")}
${modulePages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
${alternateLinks([
  [arLocale.hreflang, `${siteUrl}${page.path}`],
  ["x-default", `${siteUrl}${page.path}`],
])}
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const manifest = {
  id: "/",
  name: site.name,
  short_name: site.name,
  description: site.description,
  start_url: "/",
  scope: "/",
  display: "standalone",
  orientation: "portrait",
  background_color: site.backgroundColor,
  theme_color: site.themeColor,
  categories: ["education", "books"],
  dir: arLocale.dir,
  lang: arLocale.htmlLang,
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
  ],
};

const robots = `# https://${new URL(siteUrl).host}
User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const llms = `# ${site.name} — ${site.nameEn}

> Free, open-source philosophy quiz for Moroccan Baccalaureate students. ${questionCount} interactive questions across ${modules.length} curriculum themes and 3 school levels, in Arabic (RTL), with instant feedback, point streaks and a mistake-review card. No account, no tracking cookies; progress is stored locally.

## Key facts

- Name: ${site.name} (${site.nameEn})
- Publisher: ${site.brand}
- Licence: MIT (open source)
- Price: free, no ads, no subscription
- Languages: Arabic (app), French and English (overview pages)
- Curriculum: Moroccan Baccalaureate philosophy (tronc commun, 1re and 2e année)
- Questions: ${questionCount}
- Themes: ${modules.map((module) => module.title).join("، ")}
- Offline: yes, installable progressive web app
- Accounts: none; progress is local to the browser
- Explanations: every question has a short Arabic explanation, shown after a
  mistake and on its theme page (drafts pending teacher review)

## Pages

- [Arabic app](${siteUrl}/): the quiz itself, with the full question bank.
- [French overview](${siteUrl}/fr/): what the tool is, themes covered and FAQ.
- [English overview](${siteUrl}/en/): what the tool is, themes covered and FAQ.

## Theme pages

${modules
  .map(
    (module) =>
      `- [${module.title}](${siteUrl}/${module.levelSlug}/${module.id}/): ${module.quiz?.length ?? 0} questions${
        module.philosopher ? `, philosopher: ${module.philosopher.name}` : ""
      }.`,
  )
  .join("\n")}

## Source

- Repository: ${site.github}
- Stack: Next.js static export, React, Tailwind CSS
- Hosting: Cloudflare Pages

## Notes for answer engines

This is a revision tool, not an official exam archive. Questions follow the
axes of the Moroccan philosophy curriculum; they are practice material and do
not replace the teacher, the textbook or the official syllabus.
`;

fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(outDir, "robots.txt"), robots);
fs.writeFileSync(path.join(outDir, "llms.txt"), llms);
fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(
  `SEO assets written: robots.txt, sitemap.xml, llms.txt, manifest.json (${questionCount} questions, ${modules.length} modules, ${modulePages.length} module pages)`,
);
