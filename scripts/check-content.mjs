import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Content integrity check, run after the build.
 *
 * Every question in the curriculum must have a non-empty Arabic explanation,
 * and the explanation files must not contain orphans or Latin text. Failing
 * here is intentional: a question without an explanation is a content bug.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const curriculumDir = path.join(root, "src/data/curriculum");
const explanationsDir = path.join(root, "src/data/explanations");

const levels = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/levels.json"), "utf8"),
);

const questions = [];
for (const level of levels) {
  for (const bank of level.banks) {
    const modules = JSON.parse(
      fs.readFileSync(path.join(curriculumDir, bank), "utf8"),
    );
    for (const entry of modules) {
      for (const question of entry.quiz ?? []) {
        questions.push({
          key: `${entry.id}:${question.id}`,
          module: entry.id,
        });
      }
    }
  }
}

if (!fs.existsSync(explanationsDir)) {
  console.error(
    `Missing ${path.relative(root, explanationsDir)}. Explanations are required.`,
  );
  process.exit(1);
}

const explanationFiles = fs
  .readdirSync(explanationsDir)
  .filter((file) => file.endsWith(".json"));

const appIndex = fs.readFileSync(
  path.join(root, "src/lib/explanations.ts"),
  "utf8",
);
const unimported = explanationFiles.filter(
  (file) => !appIndex.includes(`explanations/${file}`),
);

const entries = {};
for (const file of explanationFiles) {
  const parsed = JSON.parse(
    fs.readFileSync(path.join(explanationsDir, file), "utf8"),
  );
  for (const [key, value] of Object.entries(parsed)) {
    if (entries[key] !== undefined) {
      console.error(`Duplicate explanation key: ${key} (in ${file})`);
      process.exit(1);
    }
    entries[key] = value;
  }
}

const missing = questions.filter((question) => !entries[question.key]);
const known = new Set(questions.map((question) => question.key));
const orphans = Object.keys(entries).filter((key) => !known.has(key));

const invalid = [];
for (const [key, value] of Object.entries(entries)) {
  if (typeof value !== "string") {
    invalid.push(`${key}: not a string`);
    continue;
  }
  const text = value.trim();
  if (text.length < 20) invalid.push(`${key}: too short`);
  if (text.length > 420) invalid.push(`${key}: too long (${text.length})`);
  if (/[A-Za-z]/.test(text)) invalid.push(`${key}: contains Latin text`);
}

const total = questions.length;
const covered = total - missing.length;

console.log(
  `Content check: ${covered}/${total} questions explained, ${orphans.length} orphan keys, ${invalid.length} invalid entries, ${unimported.length} unimported files`,
);

if (missing.length > 0) {
  console.error(`Missing explanations (${missing.length}):`);
  for (const item of missing.slice(0, 20)) console.error(`  - ${item.key}`);
  if (missing.length > 20) console.error("  …");
}

if (orphans.length > 0) {
  console.error("Orphan explanation keys (question no longer exists):");
  for (const key of orphans.slice(0, 20)) console.error(`  - ${key}`);
}

if (invalid.length > 0) {
  console.error("Invalid explanations:");
  for (const issue of invalid.slice(0, 20)) console.error(`  - ${issue}`);
}

if (unimported.length > 0) {
  console.error("Explanation files exist but are not imported by the app:");
  for (const file of unimported) console.error(`  - ${file}`);
}

if (
  missing.length > 0 ||
  orphans.length > 0 ||
  invalid.length > 0 ||
  unimported.length > 0
) {
  process.exit(1);
}
