import commonCore from "@/data/curriculum/common-core.json";
import firstBac from "@/data/curriculum/1st-bac.json";
import secondBac from "@/data/curriculum/2nd-bac.json";
import secondBacKnowledge from "@/data/curriculum/2nd-bac-knowledge.json";
import secondBacMorality from "@/data/curriculum/2nd-bac-morality.json";
import type { Module } from "@/types";

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
