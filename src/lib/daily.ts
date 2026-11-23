import { LEVELS, MODULES_BY_LEVEL } from "@/lib/curriculum";
import type { QuizQuestion } from "@/types/quiz";

export const DAILY_SIZE = 10;

/** Local (not UTC) date key, so the "day" matches the student's day. */
export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function yesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return localDateKey(date);
}

/** Small deterministic PRNG so the daily set is identical for everyone. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

/**
 * Ten questions for the given day: one shuffled pool per level, then a
 * round-robin draw so every level is represented. Same input, same quiz.
 */
export function getDailyChallenge(dateKey = localDateKey()): QuizQuestion[] {
  const seed = Number(dateKey.replace(/-/g, "")) || 1;
  const random = mulberry32(seed);

  const pools = LEVELS.map((level) =>
    shuffle(
      MODULES_BY_LEVEL[level.id].flatMap((item) =>
        (item.quiz ?? []).map((question) => ({
          ...question,
          moduleId: item.id,
        })),
      ),
      random,
    ),
  );

  const picked: QuizQuestion[] = [];
  while (picked.length < DAILY_SIZE && pools.some((pool) => pool.length > 0)) {
    for (const pool of pools) {
      if (picked.length >= DAILY_SIZE) break;
      const next = pool.shift();
      if (next) picked.push(next);
    }
  }

  return shuffle(picked, random);
}
