import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getModuleById, type LevelId } from "@/lib/curriculum";
import { contentKey } from "@/lib/content-key";
import {
  getDailyChallenge,
  localDateKey,
  yesterdayKey,
} from "@/lib/daily";
import { questionsForKeys } from "@/lib/questions";
import {
  accuracyOf,
  calculateAnswerScore,
  type AnswerScoreBreakdown,
} from "@/lib/scoring";
import type {
  CurrentAttempt,
  DailyResult,
  MistakeMap,
  QuizKind,
  QuizMode,
  QuizQuestion,
  QuizResult,
  QuizReviewItem,
} from "@/types/quiz";

interface GameState {
  currentLevel: LevelId;
  points: number;
  currentStreak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  dailyStreak: number;
  lastActiveDate: string | null;
  completedModules: string[];
  mistakes: MistakeMap;
  lastQuizResult: QuizResult | null;
  dailyResult: DailyResult | null;
  currentAttempt: CurrentAttempt | null;
  quizMode: QuizMode;
  onboardingDismissed: boolean;

  setLevel: (level: LevelId) => void;
  setQuizMode: (mode: QuizMode) => void;
  dismissOnboarding: () => void;
  startModuleQuiz: (moduleId: string) => void;
  startDailyChallenge: () => void;
  startReview: (keys?: string[]) => void;
  startReviewFromResult: (result: QuizResult) => void;
  submitAnswer: (
    answer: QuizReviewItem,
    timeTaken?: number,
  ) => AnswerScoreBreakdown | null;
  advanceOrEnd: () => void;
  endAttempt: () => void;
  discardAttempt: () => void;
  clearLastResult: () => void;
}

const REVIEW_TITLE = "مراجعة الأخطاء";
const MAX_REVIEW = 20;

function readLegacyScore() {
  if (typeof window === "undefined") {
    return { points: 0, currentStreak: 0, bestStreak: 0 };
  }

  try {
    const parsed = JSON.parse(localStorage.getItem("zeos-stats") ?? "null");
    if (!parsed) return { points: 0, currentStreak: 0, bestStreak: 0 };

    return {
      points: Number(parsed.score) || 0,
      currentStreak: Number(parsed.currentStreak) || 0,
      bestStreak: Number(parsed.highestStreak) || 0,
    };
  } catch {
    return { points: 0, currentStreak: 0, bestStreak: 0 };
  }
}

function readLegacyOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("zoes-onboarding") === "1";
  } catch {
    return false;
  }
}

const legacyScore = readLegacyScore();

const INITIAL_DATA = {
  currentLevel: "common-core" as LevelId,
  points: legacyScore.points,
  currentStreak: legacyScore.currentStreak,
  bestStreak: legacyScore.bestStreak,
  totalAnswered: 0,
  totalCorrect: 0,
  dailyStreak: 0,
  lastActiveDate: null,
  completedModules: [],
  mistakes: {},
  lastQuizResult: null,
  dailyResult: null,
  currentAttempt: null,
  quizMode: "timed" as QuizMode,
  onboardingDismissed: readLegacyOnboarding(),
};

function normalizeAttempt(value: unknown): CurrentAttempt | null {
  if (!value || typeof value !== "object") return null;
  const attempt = value as Partial<CurrentAttempt> & {
    questions?: QuizQuestion[];
  };
  if (!attempt.questions?.length) return null;

  return {
    kind: attempt.kind ?? "module",
    moduleId: attempt.moduleId ?? "module",
    moduleTitle: attempt.moduleTitle ?? "اختبار",
    questions: attempt.questions,
    currentIndex: attempt.currentIndex ?? 0,
    score: attempt.score ?? 0,
    points: attempt.points ?? 0,
    total: attempt.total ?? attempt.questions.length,
    reviewItems: attempt.reviewItems ?? [],
    startedAt: attempt.startedAt ?? new Date().toISOString(),
  };
}

function normalizeResult(value: unknown): QuizResult | null {
  if (!value || typeof value !== "object") return null;
  const result = value as Partial<QuizResult> & {
    xpEarned?: number;
    reviewItems?: QuizReviewItem[];
  };
  const answered = result.answered ?? result.reviewItems?.length ?? 0;

  return {
    kind: result.kind ?? "module",
    moduleId: result.moduleId ?? "module",
    moduleTitle: result.moduleTitle ?? "اختبار",
    correct: result.correct ?? 0,
    total: result.total ?? 0,
    answered,
    accuracy:
      result.accuracy ?? accuracyOf(result.correct ?? 0, answered),
    pointsEarned: result.pointsEarned ?? 0,
    reviewItems: result.reviewItems ?? [],
  };
}

function normalizeMistakes(saved: Record<string, unknown>): MistakeMap | null {
  const mistakes = saved.mistakes;
  if (Array.isArray(mistakes)) {
    const counts = (saved.mistakeCounts ?? {}) as Record<string, number>;
    const lastMissedAt =
      typeof saved.lastActiveDate === "string"
        ? saved.lastActiveDate
        : localDateKey();

    return Object.fromEntries(
      mistakes.map((key) => [
        String(key),
        { count: counts[String(key)] ?? 1, lastMissedAt },
      ]),
    );
  }

  if (mistakes && typeof mistakes === "object") {
    return mistakes as MistakeMap;
  }

  return null;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => {
      const begin = (
        kind: QuizKind,
        moduleId: string,
        moduleTitle: string,
        questions: QuizQuestion[],
      ) => {
        if (questions.length === 0) return;

        set({
          lastQuizResult: null,
          currentAttempt: {
            kind,
            moduleId,
            moduleTitle,
            questions,
            currentIndex: 0,
            score: 0,
            points: 0,
            total: questions.length,
            reviewItems: [],
            startedAt: new Date().toISOString(),
          },
        });
      };

      return {
        ...INITIAL_DATA,

        setLevel: (level) => set({ currentLevel: level }),
        setQuizMode: (mode) => set({ quizMode: mode }),
        dismissOnboarding: () => {
          set({ onboardingDismissed: true });
          try {
            localStorage.setItem("zoes-onboarding", "1");
          } catch {
            // The flag is also in the store; storage failure is harmless.
          }
        },

        startModuleQuiz: (moduleId) => {
          const owner = getModuleById(moduleId);
          if (!owner?.quiz?.length) return;

          begin(
            "module",
            owner.id,
            owner.title,
            owner.quiz.map((question) => ({
              ...question,
              moduleId: owner.id,
            })),
          );
        },

        startDailyChallenge: () => {
          begin("daily", "daily", "تحدي اليوم", getDailyChallenge());
        },

        startReview: (keys) => {
          const state = get();
          const selected =
            keys ??
            Object.entries(state.mistakes)
              .sort(([, a], [, b]) => b.count - a.count)
              .map(([key]) => key);

          begin(
            "review",
            "review",
            REVIEW_TITLE,
            questionsForKeys(selected.slice(0, MAX_REVIEW)),
          );
        },

        startReviewFromResult: (result) => {
          const keys = result.reviewItems
            .filter((item) => !item.isCorrect)
            .map((item) => contentKey(item.moduleId, item.questionId));
          get().startReview(keys);
        },

        submitAnswer: (answer, timeTaken) => {
          const state = get();
          const attempt = state.currentAttempt;
          if (!attempt) return null;

          const key = contentKey(answer.moduleId, answer.questionId);
          const breakdown = calculateAnswerScore({
            isCorrect: answer.isCorrect,
            timeTaken,
            currentStreak: state.currentStreak,
          });
          const today = localDateKey();
          const dayUpdate =
            state.lastActiveDate === today
              ? {}
              : {
                  lastActiveDate: today,
                  dailyStreak:
                    state.lastActiveDate === yesterdayKey()
                      ? state.dailyStreak + 1
                      : 1,
                };

          const mistakes = { ...state.mistakes };
          if (answer.isCorrect) {
            delete mistakes[key];
          } else {
            mistakes[key] = {
              count: (mistakes[key]?.count ?? 0) + 1,
              lastMissedAt: today,
            };
          }

          set({
            ...dayUpdate,
            points: state.points + breakdown.totalPoints,
            currentStreak: breakdown.nextStreak,
            bestStreak: Math.max(state.bestStreak, breakdown.nextStreak),
            totalAnswered: state.totalAnswered + 1,
            totalCorrect: state.totalCorrect + (answer.isCorrect ? 1 : 0),
            mistakes,
            currentAttempt: {
              ...attempt,
              score: attempt.score + (answer.isCorrect ? 1 : 0),
              points: attempt.points + breakdown.totalPoints,
              reviewItems: [...attempt.reviewItems, answer],
            },
          });

          return breakdown;
        },

        advanceOrEnd: () => {
          const attempt = get().currentAttempt;
          if (!attempt) return;

          if (attempt.currentIndex < attempt.total - 1) {
            set({
              currentAttempt: {
                ...attempt,
                currentIndex: attempt.currentIndex + 1,
              },
            });
          } else {
            get().endAttempt();
          }
        },

        endAttempt: () => {
          const state = get();
          const attempt = state.currentAttempt;
          if (!attempt) return;

          const answered = attempt.reviewItems.length;
          const result: QuizResult = {
            kind: attempt.kind,
            moduleId: attempt.moduleId,
            moduleTitle: attempt.moduleTitle,
            correct: attempt.score,
            total: attempt.total,
            answered,
            accuracy: accuracyOf(attempt.score, answered),
            pointsEarned: attempt.points,
            reviewItems: attempt.reviewItems,
          };

          const completedModules =
            attempt.kind === "module" &&
            answered > 0 &&
            !state.completedModules.includes(attempt.moduleId)
              ? [...state.completedModules, attempt.moduleId]
              : state.completedModules;

          set({
            completedModules,
            lastQuizResult: result,
            dailyResult:
              attempt.kind === "daily"
                ? {
                    date: localDateKey(),
                    correct: attempt.score,
                    total: attempt.total,
                  }
                : state.dailyResult,
            currentAttempt: null,
          });
        },

        discardAttempt: () => set({ currentAttempt: null }),
        clearLastResult: () => set({ lastQuizResult: null }),
      };
    },
    {
      name: "zeos-game-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        points: state.points,
        currentStreak: state.currentStreak,
        bestStreak: state.bestStreak,
        totalAnswered: state.totalAnswered,
        totalCorrect: state.totalCorrect,
        dailyStreak: state.dailyStreak,
        lastActiveDate: state.lastActiveDate,
        completedModules: state.completedModules,
        mistakes: state.mistakes,
        lastQuizResult: state.lastQuizResult,
        dailyResult: state.dailyResult,
        currentAttempt: state.currentAttempt,
        quizMode: state.quizMode,
        onboardingDismissed: state.onboardingDismissed,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Record<string, unknown>;
        const rest = { ...saved };
        const completedQuizzes = rest.completedQuizzes;
        const currentQuiz = rest.currentQuiz;
        delete rest.xp;
        delete rest.mistakeCounts;
        delete rest.completedQuizzes;
        delete rest.currentQuiz;
        delete rest.unlockedPhilosophers;

        return {
          ...current,
          ...rest,
          points:
            typeof saved.points === "number" ? saved.points : current.points,
          completedModules:
            (saved.completedModules as string[] | undefined) ??
            (completedQuizzes as string[] | undefined) ??
            current.completedModules,
          mistakes: normalizeMistakes(saved) ?? current.mistakes,
          currentAttempt:
            normalizeAttempt(saved.currentAttempt ?? currentQuiz) ??
            current.currentAttempt,
          lastQuizResult:
            normalizeResult(saved.lastQuizResult) ?? current.lastQuizResult,
          onboardingDismissed:
            saved.onboardingDismissed === true ||
            current.onboardingDismissed,
        };
      },
    },
  ),
);

