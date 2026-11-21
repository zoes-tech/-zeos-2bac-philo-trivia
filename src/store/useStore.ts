import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { LevelId } from "@/lib/curriculum";
import { ALL_MODULES } from "@/lib/curriculum";
import {
  getDailyChallenge,
  localDateKey,
  mistakeKey,
  yesterdayKey,
} from "@/lib/daily";
import type { Question, QuizKind, QuizMode, QuizQuestion } from "@/types";

export interface QuizReviewItem {
  moduleId: string;
  questionId: string;
  question: string;
  category?: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface CurrentQuiz {
  kind: QuizKind;
  moduleId: string;
  moduleTitle: string;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  total: number;
  reviewItems: QuizReviewItem[];
  startedAt: string;
}

export interface QuizResult {
  kind: QuizKind;
  moduleId: string;
  moduleTitle: string;
  correct: number;
  total: number;
  accuracy: number;
  xpEarned: number;
  completedAt: string;
  reviewItems: QuizReviewItem[];
}

export interface DailyResult {
  date: string;
  correct: number;
  total: number;
}

interface StartQuizOptions {
  kind: QuizKind;
  moduleId: string;
  moduleTitle: string;
  questions: Array<Question | QuizQuestion>;
}

interface GameState {
  currentLevel: LevelId;
  xp: number;
  unlockedConcepts: string[];
  completedQuizzes: string[];
  unlockedPhilosophers: string[];
  currentQuiz: CurrentQuiz | null;
  lastQuizResult: QuizResult | null;
  /** Keys are `moduleId:questionId`; question ids repeat across modules. */
  mistakes: string[];
  recentResults: QuizResult[];
  dailyResult: DailyResult | null;
  dailyStreak: number;
  lastActiveDate: string | null;
  quizMode: QuizMode;

  setLevel: (level: LevelId) => void;
  addXp: (amount: number) => void;
  unlockConcept: (conceptId: string) => void;
  completeQuiz: (quizId: string) => void;
  unlockPhilosopher: (philosopherId: string) => void;
  startQuiz: (options: StartQuizOptions) => void;
  startDailyChallenge: () => void;
  startMistakeReview: () => void;
  answerQuiz: (answer: QuizReviewItem) => void;
  nextQuizQuestion: () => void;
  endQuiz: () => void;
  discardQuiz: () => void;
  clearLastQuizResult: () => void;
  setQuizMode: (mode: QuizMode) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentLevel: "common-core",
      xp: 0,
      unlockedConcepts: [],
      completedQuizzes: [],
      unlockedPhilosophers: [],
      currentQuiz: null,
      lastQuizResult: null,
      mistakes: [],
      recentResults: [],
      dailyResult: null,
      dailyStreak: 0,
      lastActiveDate: null,
      quizMode: "timed",

      setLevel: (level) => set({ currentLevel: level }),
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      unlockConcept: (id) =>
        set((state) => ({
          unlockedConcepts: state.unlockedConcepts.includes(id)
            ? state.unlockedConcepts
            : [...state.unlockedConcepts, id],
        })),
      completeQuiz: (id) =>
        set((state) => ({
          completedQuizzes: state.completedQuizzes.includes(id)
            ? state.completedQuizzes
            : [...state.completedQuizzes, id],
        })),
      unlockPhilosopher: (id) =>
        set((state) => {
          if (state.unlockedPhilosophers.includes(id)) return state;
          return {
            unlockedPhilosophers: [...state.unlockedPhilosophers, id],
          };
        }),

      startQuiz: ({ kind, moduleId, moduleTitle, questions }) => {
        if (questions.length === 0) return;

        set({
          lastQuizResult: null,
          currentQuiz: {
            kind,
            moduleId,
            moduleTitle,
            questions: questions.map((question) => ({
              ...question,
              moduleId:
                "moduleId" in question && question.moduleId
                  ? question.moduleId
                  : moduleId,
            })),
            currentIndex: 0,
            score: 0,
            total: questions.length,
            reviewItems: [],
            startedAt: new Date().toISOString(),
          },
        });
      },

      startDailyChallenge: () => {
        get().startQuiz({
          kind: "daily",
          moduleId: "daily",
          moduleTitle: "تحدي اليوم",
          questions: getDailyChallenge(),
        });
      },

      startMistakeReview: () => {
        const questions: QuizQuestion[] = [];

        for (const key of get().mistakes) {
          const separator = key.indexOf(":");
          const moduleId = key.slice(0, separator);
          const questionId = key.slice(separator + 1);
          const owner = ALL_MODULES.find((item) => item.id === moduleId);
          const question = owner?.quiz?.find((item) => item.id === questionId);

          if (owner && question) {
            questions.push({ ...question, moduleId: owner.id });
          }
        }

        get().startQuiz({
          kind: "review",
          moduleId: "review",
          moduleTitle: "مراجعة الأخطاء",
          questions: questions.slice(0, 20),
        });
      },

      answerQuiz: (answer) =>
        set((state) => {
          if (!state.currentQuiz) return state;

          const key = mistakeKey(answer.moduleId, answer.questionId);
          const mistakes = answer.isCorrect
            ? state.mistakes.filter((item) => item !== key)
            : state.mistakes.includes(key)
              ? state.mistakes
              : [...state.mistakes, key];

          const today = localDateKey();
          const streakUpdate =
            state.lastActiveDate === today
              ? {}
              : {
                  lastActiveDate: today,
                  dailyStreak:
                    state.lastActiveDate === yesterdayKey()
                      ? state.dailyStreak + 1
                      : 1,
                };

          return {
            ...state,
            ...streakUpdate,
            mistakes,
            currentQuiz: {
              ...state.currentQuiz,
              score: state.currentQuiz.score + (answer.isCorrect ? 1 : 0),
              reviewItems: [...state.currentQuiz.reviewItems, answer],
            },
          };
        }),

      nextQuizQuestion: () =>
        set((state) => {
          if (
            !state.currentQuiz ||
            state.currentQuiz.currentIndex >= state.currentQuiz.total - 1
          ) {
            return state;
          }
          return {
            ...state,
            currentQuiz: {
              ...state.currentQuiz,
              currentIndex: state.currentQuiz.currentIndex + 1,
            },
          };
        }),

      endQuiz: () => {
        const state = get();
        const quiz = state.currentQuiz;
        if (!quiz) return;

        const accuracy = Math.round((quiz.score / quiz.total) * 100);
        const xpEarned = Math.max(1, Math.round(accuracy / 10));
        const result: QuizResult = {
          kind: quiz.kind,
          moduleId: quiz.moduleId,
          moduleTitle: quiz.moduleTitle,
          correct: quiz.score,
          total: quiz.total,
          accuracy,
          xpEarned,
          completedAt: new Date().toISOString(),
          reviewItems: quiz.reviewItems,
        };

        const completedQuizzes =
          quiz.kind === "module" &&
          quiz.moduleId &&
          !state.completedQuizzes.includes(quiz.moduleId)
            ? [...state.completedQuizzes, quiz.moduleId]
            : state.completedQuizzes;

        const dailyResult =
          quiz.kind === "daily"
            ? {
                date: localDateKey(),
                correct: quiz.score,
                total: quiz.total,
              }
            : state.dailyResult;

        const unlocks = quiz.questions[0]?.unlocks;
        const unlockedPhilosophers =
          unlocks && !state.unlockedPhilosophers.includes(unlocks)
            ? [...state.unlockedPhilosophers, unlocks]
            : state.unlockedPhilosophers;

        set({
          completedQuizzes,
          xp: state.xp + xpEarned,
          lastQuizResult: result,
          recentResults: [result, ...state.recentResults].slice(0, 12),
          dailyResult,
          unlockedPhilosophers,
          currentQuiz: null,
        });
      },

      discardQuiz: () => set({ currentQuiz: null }),
      clearLastQuizResult: () => set({ lastQuizResult: null }),
      setQuizMode: (mode) => set({ quizMode: mode }),
    }),
    {
      name: "zeos-game-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        xp: state.xp,
        unlockedConcepts: state.unlockedConcepts,
        completedQuizzes: state.completedQuizzes,
        unlockedPhilosophers: state.unlockedPhilosophers,
        lastQuizResult: state.lastQuizResult,
        mistakes: state.mistakes,
        recentResults: state.recentResults,
        dailyResult: state.dailyResult,
        dailyStreak: state.dailyStreak,
        lastActiveDate: state.lastActiveDate,
        quizMode: state.quizMode,
        currentQuiz: state.currentQuiz,
      }),
      // Keep new fields working for users who persisted the old shape.
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<GameState>),
      }),
    },
  ),
);
