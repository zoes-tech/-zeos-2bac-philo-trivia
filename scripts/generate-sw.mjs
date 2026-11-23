import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const readJson = (relative) =>
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));

const locales = readJson("src/data/locales.json");
const template = fs.readFileSync(
  path.join(root, "scripts/sw.template.js"),
  "utf8",
);

const version = (
  process.env.GITHUB_SHA ??
  process.env.CF_PAGES_COMMIT_SHA ??
  `local-${Date.now()}`
).slice(0, 12);

const precache = [...locales.map((locale) => locale.path), "/manifest.json"];
const fallbacks = locales
  .filter((locale) => locale.path !== "/")
  .map((locale) => [locale.path, locale.path]);

const output = template
  .replaceAll("__CACHE_VERSION__", `zoes-philo-${version}`)
  .replaceAll("__PRECACHE_PAGES__", JSON.stringify(precache))
  .replaceAll("__FALLBACK_RULES__", JSON.stringify(fallbacks));

fs.writeFileSync(path.join(outDir, "sw.js"), output);
console.log(`Service worker written (cache zoes-philo-${version})`);
