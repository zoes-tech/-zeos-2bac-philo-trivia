export interface AnswerScoreInput {
  isCorrect: boolean;
  timeTaken?: number;
  currentStreak: number;
}

export interface AnswerScoreBreakdown {
  basePoints: number;
  speedBonus: number;
  streakBonus: number;
  totalPoints: number;
  nextStreak: number;
  multiplier: number;
  speedTier: 'instant' | 'quick' | 'steady' | 'missed';
}

export const BASE_POINTS = 100;

export const calculateStreakMultiplier = (streak: number): number => {
  if (streak >= 15) return 2.5;
  if (streak >= 10) return 2.0;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.2;
  return 1.0;
};

export const calculateSpeedBonus = (timeTaken?: number): { bonus: number; tier: AnswerScoreBreakdown['speedTier'] } => {
  if (timeTaken === undefined || timeTaken === null) return { bonus: 0, tier: 'steady' };
  if (timeTaken <= 4) return { bonus: 50, tier: 'instant' };
  if (timeTaken <= 8) return { bonus: 25, tier: 'quick' };
  return { bonus: 0, tier: 'steady' };
};

export const calculateAnswerScore = ({ isCorrect, timeTaken, currentStreak }: AnswerScoreInput): AnswerScoreBreakdown => {
  if (!isCorrect) {
    return {
      basePoints: 0,
      speedBonus: 0,
      streakBonus: 0,
      totalPoints: 0,
      nextStreak: 0,
      multiplier: 1,
      speedTier: 'missed',
    };
  }

  const nextStreak = currentStreak + 1;
  const multiplier = calculateStreakMultiplier(nextStreak);
  const { bonus: speedBonus, tier: speedTier } = calculateSpeedBonus(timeTaken);
  const streakBonus = Math.round(BASE_POINTS * (multiplier - 1));
  const totalPoints = BASE_POINTS + speedBonus + streakBonus;

  return {
    basePoints: BASE_POINTS,
    speedBonus,
    streakBonus,
    totalPoints,
    nextStreak,
    multiplier,
    speedTier,
  };
};

export const getMasteryLabel = (accuracy: number): { label: string; emoji: string; tone: string } => {
  if (accuracy >= 90) return { label: 'إتقان ممتاز', emoji: '🏆', tone: 'text-yellow-300' };
  if (accuracy >= 75) return { label: 'فهم قوي', emoji: '🧠', tone: 'text-cyan-300' };
  if (accuracy >= 50) return { label: 'في طور التحسن', emoji: '📚', tone: 'text-purple-300' };
  return { label: 'تحتاج مراجعة', emoji: '📝', tone: 'text-orange-300' };
};
