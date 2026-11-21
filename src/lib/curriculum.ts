import commonCore from "@/data/curriculum/common-core.json";
import firstBac from "@/data/curriculum/1st-bac.json";
import secondBac from "@/data/curriculum/2nd-bac.json";
import secondBacKnowledge from "@/data/curriculum/2nd-bac-knowledge.json";
import secondBacMorality from "@/data/curriculum/2nd-bac-morality.json";
import type { Module, Question } from "@/types";

export type LevelId = "common-core" | "1st-bac" | "2nd-bac";

/** Ordered levels, used by the level map, the landing pages and the sitemap. */
export const LEVELS: ReadonlyArray<{ id: LevelId }> = [
  { id: "common-core" },
  { id: "1st-bac" },
  { id: "2nd-bac" },
];

export const MODULES_BY_LEVEL: Record<LevelId, Module[]> = {
  "common-core": commonCore as unknown as Module[],
  "1st-bac": firstBac as unknown as Module[],
  "2nd-bac": [
    ...secondBac,
    ...secondBacKnowledge,
    ...secondBacMorality,
  ] as unknown as Module[],
};

export const ALL_MODULES: Module[] = LEVELS.flatMap(
  (level) => MODULES_BY_LEVEL[level.id],
);

export const TOTAL_QUESTIONS = ALL_MODULES.reduce(
  (total, module) => total + (module.quiz?.length ?? 0),
  0,
);

export const TOTAL_MODULES = ALL_MODULES.length;

export const TOTAL_PHILOSOPHERS = new Set(
  ALL_MODULES.filter((module) => module.philosopher).map(
    (module) => module.philosopher!.id,
  ),
).size;

export function getModuleById(id: string): Module | undefined {
  return ALL_MODULES.find((module) => module.id === id);
}

export function getLevelOfModule(id: string): LevelId | undefined {
  return LEVELS.find((level) =>
    MODULES_BY_LEVEL[level.id].some((module) => module.id === id),
  )?.id;
}

/** URL slugs for the level segment. Latin slugs keep shared links readable. */
export const LEVEL_SLUG: Record<LevelId, string> = {
  "common-core": "tronc-commun",
  "1st-bac": "1bac",
  "2nd-bac": "2bac",
};

export const LEVEL_FROM_SLUG: Record<string, LevelId> = {
  "tronc-commun": "common-core",
  "1bac": "1st-bac",
  "2bac": "2nd-bac",
};

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

export interface CategoryCount {
  name: string;
  count: number;
}

export function getCategoryCounts(module: Module): CategoryCount[] {
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

/** Every module page, used by generateStaticParams and the sitemap script. */
export const MODULE_PAGES = LEVELS.flatMap((level) =>
  MODULES_BY_LEVEL[level.id].map((module) => ({
    level: level.id,
    moduleId: module.id,
    path: modulePath(level.id, module.id),
  })),
);
