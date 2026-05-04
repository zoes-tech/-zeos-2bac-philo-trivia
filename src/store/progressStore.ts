"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface QuizProgress {
  moduleId: string;
  completedQuestions: string[];
  lastQuestionIndex: number;
  attempts: number;
  bestScore: number;
}

interface UserProgress {
  xp: number;
  level: string;
  unlockedModules: string[];
  completedModules: string[];
  quizProgress: Record<string, QuizProgress>;
  philosophersUnlocked: string[];
  lastPlayed: string | null;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  studyStreak: number;
  lastStudyDate: string | null;
}

interface ProgressStore extends UserProgress {
  addXp: (amount: number) => void;
  unlockModule: (moduleId: string) => void;
  completeModule: (moduleId: string) => void;
  saveQuizProgress: (moduleId: string, questionId: string, isCorrect: boolean, score: number) => void;
  unlockPhilosopher: (philosopherId: string) => void;
  updateStudyStreak: () => void;
  resetProgress: () => void;
}

const getToday = () => new Date().toISOString().split('T')[0];

const checkConsecutiveDays = (lastDate: string | null): { streak: number; shouldReset: boolean } => {
  if (!lastDate) return { streak: 0, shouldReset: false };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = lastDate === getToday();
  const isYesterday = lastDate === yesterday.toISOString().split('T')[0];

  if (isToday) return { streak: 0, shouldReset: false };
  if (isYesterday) return { streak: 0, shouldReset: false };

  return { streak: 0, shouldReset: true };
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      xp: 0,
      level: 'common-core',
      unlockedModules: ['common-core'],
      completedModules: [],
      quizProgress: {},
      philosophersUnlocked: [],
      lastPlayed: null,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      studyStreak: 0,
      lastStudyDate: null,

      addXp: (amount: number) => set((state) => ({ xp: state.xp + amount })),

      unlockModule: (moduleId: string) => set((state) => {
        if (state.unlockedModules.includes(moduleId)) return state;
        return { unlockedModules: [...state.unlockedModules, moduleId] };
      }),

      completeModule: (moduleId: string) => set((state) => {
        if (state.completedModules.includes(moduleId)) return state;
        return { completedModules: [...state.completedModules, moduleId] };
      }),

      saveQuizProgress: (moduleId: string, questionId: string, isCorrect: boolean, score: number) => set((state) => {
        const existingProgress = state.quizProgress[moduleId] || {
          moduleId,
          completedQuestions: [],
          lastQuestionIndex: 0,
          attempts: 0,
          bestScore: 0,
        };

        const completedQuestions = isCorrect && !existingProgress.completedQuestions.includes(questionId)
          ? [...existingProgress.completedQuestions, questionId]
          : existingProgress.completedQuestions;

        const newAttempts = existingProgress.attempts + 1;
        const newBestScore = Math.max(existingProgress.bestScore, score);

        return {
          quizProgress: {
            ...state.quizProgress,
            [moduleId]: {
              ...existingProgress,
              completedQuestions,
              attempts: newAttempts,
              bestScore: newBestScore,
            },
          },
          totalQuestionsAnswered: state.totalQuestionsAnswered + 1,
          totalCorrectAnswers: state.totalCorrectAnswers + (isCorrect ? 1 : 0),
          lastPlayed: getToday(),
        };
      }),

      unlockPhilosopher: (philosopherId: string) => set((state) => {
        if (state.philosophersUnlocked.includes(philosopherId)) return state;
        return { philosophersUnlocked: [...state.philosophersUnlocked, philosopherId] };
      }),

      updateStudyStreak: () => set((state) => {
        const { streak, shouldReset } = checkConsecutiveDays(state.lastStudyDate);
        const newStreak = shouldReset ? 1 : streak + 1;

        return {
          studyStreak: newStreak,
          lastStudyDate: getToday(),
        };
      }),

      resetProgress: () => set({
        xp: 0,
        level: 'common-core',
        unlockedModules: ['common-core'],
        completedModules: [],
        quizProgress: {},
        philosophersUnlocked: [],
        lastPlayed: null,
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        studyStreak: 0,
        lastStudyDate: null,
      }),
    }),
    {
      name: 'zeos-progress-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        unlockedModules: state.unlockedModules,
        completedModules: state.completedModules,
        quizProgress: state.quizProgress,
        philosophersUnlocked: state.philosophersUnlocked,
        lastPlayed: state.lastPlayed,
        totalQuestionsAnswered: state.totalQuestionsAnswered,
        totalCorrectAnswers: state.totalCorrectAnswers,
        studyStreak: state.studyStreak,
        lastStudyDate: state.lastStudyDate,
      }),
    }
  )
);

export const useModuleProgress = (moduleId: string) => {
  const progress = useProgressStore((state) => state.quizProgress[moduleId]);
  const saveProgress = useProgressStore((state) => state.saveQuizProgress);
  const completeModule = useProgressStore((state) => state.completeModule);

  return {
    progress,
    saveProgress,
    completeModule,
    isCompleted: useProgressStore((state) => state.completedModules.includes(moduleId)),
    isUnlocked: useProgressStore((state) => state.unlockedModules.includes(moduleId)),
  };
};

export const useStats = () => {
  const state = useProgressStore();
  
  return {
    xp: state.xp,
    totalQuestionsAnswered: state.totalQuestionsAnswered,
    totalCorrectAnswers: state.totalCorrectAnswers,
    accuracyRate: state.totalQuestionsAnswered > 0 
      ? Math.round((state.totalCorrectAnswers / state.totalQuestionsAnswered) * 100) 
      : 0,
    studyStreak: state.studyStreak,
    modulesCompleted: state.completedModules.length,
    philosophersUnlocked: state.philosophersUnlocked.length,
  };
};
