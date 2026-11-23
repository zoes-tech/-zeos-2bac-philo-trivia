export const NEXT_DELAY_MS = 1400;
export const TIME_BONUS_SECONDS = 3;
export const BASE_TIME_LIMIT = 20;

export function timeLimitFor(totalQuestions: number): number {
  if (totalQuestions <= 10) return 20;
  if (totalQuestions <= 25) return 18;
  return 15;
}
