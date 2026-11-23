import { ALL_MODULES, MODULES_BY_LEVEL, type LevelId } from "@/lib/curriculum";
import type { Module } from "@/types";

function smallestUnfinished(modules: Module[], completed: string[]) {
  return [...modules]
    .filter((module) => !completed.includes(module.id))
    .sort((a, b) => (a.quiz?.length ?? 0) - (b.quiz?.length ?? 0))[0];
}

/** Suggest the smallest unfinished module, staying in the current level first. */
export function recommendedModule(
  level: LevelId,
  completed: string[],
): Module {
  return (
    smallestUnfinished(MODULES_BY_LEVEL[level], completed) ??
    smallestUnfinished(ALL_MODULES, completed) ??
    MODULES_BY_LEVEL[level][0]
  );
}
