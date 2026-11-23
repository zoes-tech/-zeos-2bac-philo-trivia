import levelsData from "@/data/levels.json";
import commonCore from "@/data/curriculum/common-core.json";
import firstBac from "@/data/curriculum/1st-bac.json";
import secondBac from "@/data/curriculum/2nd-bac.json";
import secondBacKnowledge from "@/data/curriculum/2nd-bac-knowledge.json";
import secondBacMorality from "@/data/curriculum/2nd-bac-morality.json";
import type { Module, Question } from "@/types";

export type LevelId = "common-core" | "1st-bac" | "2nd-bac";

type LevelConfig = { id: LevelId; slug: string; banks: string[] };

const LEVEL_CONFIG = levelsData as LevelConfig[];

const BANK_MODULES: Record<string, Module[]> = {
  "common-core.json": commonCore as unknown as Module[],
  "1st-bac.json": firstBac as unknown as Module[],
  "2nd-bac.json": secondBac as unknown as Module[],
  "2nd-bac-knowledge.json": secondBacKnowledge as unknown as Module[],
  "2nd-bac-morality.json": secondBacMorality as unknown as Module[],
};

const missingBanks = LEVEL_CONFIG.flatMap((level) => level.banks).filter(
  (bank) => !BANK_MODULES[bank],
);

if (missingBanks.length > 0) {
  throw new Error(`Unknown curriculum bank(s): ${missingBanks.join(", ")}`);
}

export const LEVELS = LEVEL_CONFIG.map(({ id }) => ({ id }));

export const MODULES_BY_LEVEL = Object.fromEntries(
  LEVEL_CONFIG.map((level) => [
    level.id,
    level.banks.flatMap((bank) => BANK_MODULES[bank]),
  ]),
) as Record<LevelId, Module[]>;

export const ALL_MODULES: Module[] = LEVELS.flatMap(
  (level) => MODULES_BY_LEVEL[level.id],
);

export const TOTAL_QUESTIONS = ALL_MODULES.reduce(
  (total, module) => total + (module.quiz?.length ?? 0),
  0,
);

export const TOTAL_MODULES = ALL_MODULES.length;

const LEVEL_SLUG = Object.fromEntries(
  LEVEL_CONFIG.map((level) => [level.id, level.slug]),
) as Record<LevelId, string>;

const LEVEL_FROM_SLUG = Object.fromEntries(
  LEVEL_CONFIG.map((level) => [level.slug, level.id]),
) as Record<string, LevelId>;

const MODULE_BY_ID = new Map(
  ALL_MODULES.map((module) => [module.id, module] as const),
);

export function getModuleById(id: string): Module | undefined {
  return MODULE_BY_ID.get(id);
}

function getLevelOfModule(id: string): LevelId | undefined {
  return LEVELS.find((level) =>
    MODULES_BY_LEVEL[level.id].some((module) => module.id === id),
  )?.id;
}

export function modulePath(level: LevelId, moduleId: string): string {
  return `/${LEVEL_SLUG[level]}/${moduleId}/`;
}

export function getModulePath(moduleId: string): string | undefined {
  const level = getLevelOfModule(moduleId);
  return level ? modulePath(level, moduleId) : undefined;
}

export function findModule(
  levelSlug: string,
  moduleId: string,
): { level: LevelId; module: Module } | undefined {
  const level = LEVEL_FROM_SLUG[levelSlug];
  if (!level) return undefined;
  const match = MODULES_BY_LEVEL[level].find((item) => item.id === moduleId);
  return match ? { level, module: match } : undefined;
}

export function getCategoryCounts(
  module: Module,
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();

  for (const question of module.quiz ?? []) {
    const name = question.category?.trim() || "بدون تصنيف";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Deterministic spread of sample questions, so the build output is stable. */
export function getSampleQuestions(module: Module, limit = 4): Question[] {
  const quiz = module.quiz ?? [];
  if (quiz.length <= limit) return quiz;

  const step = quiz.length / limit;
  return Array.from(
    { length: limit },
    (_, index) => quiz[Math.floor(index * step)],
  );
}

/** Every module page; also used by `generateStaticParams`. */
export const MODULE_PAGES = LEVELS.flatMap((level) =>
  MODULES_BY_LEVEL[level.id].map((module) => ({
    level: level.id,
    levelSlug: LEVEL_SLUG[level.id],
    moduleId: module.id,
    path: modulePath(level.id, module.id),
  })),
);
