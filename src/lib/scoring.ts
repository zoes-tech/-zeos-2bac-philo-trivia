interface AnswerScoreInput {
  isCorrect: boolean;
  timeTaken?: number;
  currentStreak: number;
}

export interface AnswerScoreBreakdown {
  totalPoints: number;
  nextStreak: number;
}

const BASE_POINTS = 100;

export const calculateStreakMultiplier = (streak: number): number => {
  if (streak >= 15) return 2.5;
  if (streak >= 10) return 2.0;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.2;
  return 1.0;
};

const calculateSpeedBonus = (
  timeTaken?: number,
): { bonus: number; tier: 'instant' | 'quick' | 'steady' } => {
  if (timeTaken === undefined || timeTaken === null) return { bonus: 0, tier: 'steady' };
  if (timeTaken <= 4) return { bonus: 50, tier: 'instant' };
  if (timeTaken <= 8) return { bonus: 25, tier: 'quick' };
  return { bonus: 0, tier: 'steady' };
};

export const calculateAnswerScore = ({
  isCorrect,
  timeTaken,
  currentStreak,
}: AnswerScoreInput): AnswerScoreBreakdown => {
  if (!isCorrect) {
    return { totalPoints: 0, nextStreak: 0 };
  }

  const nextStreak = currentStreak + 1;
  const multiplier = calculateStreakMultiplier(nextStreak);
  const speedBonus = calculateSpeedBonus(timeTaken).bonus;
  const streakBonus = Math.round(BASE_POINTS * (multiplier - 1));

  return {
    totalPoints: BASE_POINTS + speedBonus + streakBonus,
    nextStreak,
  };
};

const RANKS = [
  { min: 0, max: 1000, rank: "متأمل مبتدئ", emoji: "📜" },
  { min: 1001, max: 5000, rank: "تلميذ سقراط", emoji: "🦉" },
  { min: 5001, max: 20000, rank: "فيلسوف ناشئ", emoji: "🧠" },
  { min: 20001, max: Infinity, rank: "حكيم الأطلس", emoji: "💎" },
] as const;

export function getRankInfo(points: number): { rank: string; emoji: string } {
  return (
    RANKS.find((item) => points >= item.min && points <= item.max) ?? RANKS[0]
  );
}

export function accuracyOf(correct: number, answered: number): number {
  return answered > 0 ? Math.round((correct / answered) * 100) : 0;
}

export const getMasteryLabel = (accuracy: number): { label: string; emoji: string; tone: string } => {
  if (accuracy >= 90) return { label: 'إتقان ممتاز', emoji: '🏆', tone: 'text-yellow-300' };
  if (accuracy >= 75) return { label: 'فهم قوي', emoji: '🧠', tone: 'text-cyan-300' };
  if (accuracy >= 50) return { label: 'في طور التحسن', emoji: '📚', tone: 'text-purple-300' };
  return { label: 'تحتاج مراجعة', emoji: '📝', tone: 'text-orange-300' };
};
