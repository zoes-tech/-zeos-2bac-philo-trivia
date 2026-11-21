import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Generates robots.txt, sitemap.xml and llms.txt into the static export.
 * Runs after `next build`, so the files are derived from the same data as the
 * pages and can never drift.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");

if (!fs.existsSync(outDir)) {
  console.error("out/ not found — run `next build` first.");
  process.exit(1);
}

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://zoes-philo.pages.dev"
).replace(/\/+$/, "");

/** Must match LEVEL_SLUG in src/lib/curriculum.ts. */
const BANKS = [
  { file: "common-core.json", levelSlug: "tronc-commun" },
  { file: "1st-bac.json", levelSlug: "1bac" },
  { file: "2nd-bac.json", levelSlug: "2bac" },
  { file: "2nd-bac-knowledge.json", levelSlug: "2bac" },
  { file: "2nd-bac-morality.json", levelSlug: "2bac" },
];

const modules = BANKS.flatMap(({ file, levelSlug }) =>
  JSON.parse(
    fs.readFileSync(path.join(root, "src/data/curriculum", file), "utf8"),
  ).map((module) => ({ ...module, levelSlug })),
);

const questionCount = modules.reduce(
  (total, module) => total + (module.quiz?.length ?? 0),
  0,
);

const localePages = [
  { path: "/", priority: "1.0" },
  { path: "/fr/", priority: "0.8" },
  { path: "/en/", priority: "0.8" },
];

const modulePages = modules.map((module) => ({
  path: `/${module.levelSlug}/${module.id}/`,
  priority: "0.7",
}));

const localeAlternates = [
  ["ar-MA", `${siteUrl}/`],
  ["fr", `${siteUrl}/fr/`],
  ["en", `${siteUrl}/en/`],
  ["x-default", `${siteUrl}/`],
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
  ["ar-MA", `${siteUrl}${page.path}`],
  ["x-default", `${siteUrl}${page.path}`],
])}
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `# https://${new URL(siteUrl).host}
User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const llms = `# رحلة الفيلسوف — Philosopher's Journey

> Free, open-source philosophy quiz for Moroccan Baccalaureate students. ${questionCount} interactive questions across ${modules.length} curriculum themes and 3 school levels, in Arabic (RTL), with instant feedback, point streaks and a mistake-review card. No account, no tracking cookies; progress is stored locally.

## Key facts

- Name: رحلة الفيلسوف (Philosopher's Journey)
- Publisher: Zoes Tech
- Licence: MIT (open source)
- Price: free, no ads, no subscription
- Languages: Arabic (app), French and English (overview pages)
- Curriculum: Moroccan Baccalaureate philosophy (tronc commun, 1re and 2e année)
- Questions: ${questionCount}
- Themes: ${modules.map((module) => module.title).join("، ")}
- Offline: yes, installable progressive web app
- Accounts: none; progress is local to the browser

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

- Repository: https://github.com/zoes-tech/-zeos-2bac-philo-trivia
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

console.log(
  `SEO files written: robots.txt, sitemap.xml, llms.txt (${questionCount} questions, ${modules.length} modules, ${modulePages.length} module pages)`,
);
