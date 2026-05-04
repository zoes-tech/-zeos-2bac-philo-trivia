import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Question } from '@/types';

interface GameState {
    currentLevel: 'common-core' | '1st-bac' | '2nd-bac';
    xp: number;
    unlockedConcepts: string[];
    completedQuizzes: string[];
    unlockedPhilosophers: string[];
    currentQuiz: {
      moduleId: string;
      questions: Question[];
      currentIndex: number;
      score: number;
      total: number;
    } | null;
    lastQuizResult: {
      moduleId: string;
      correct: number;
      total: number;
      accuracy: number;
      xpEarned: number;
      completedAt: string;
    } | null;

    setLevel: (level: 'common-core' | '1st-bac' | '2nd-bac') => void;
    addXp: (amount: number) => void;
    unlockConcept: (conceptId: string) => void;
    completeQuiz: (quizId: string) => void;
    unlockPhilosopher: (philosopherId: string) => void;
    startQuiz: (moduleId: string, questions: Question[]) => void;
    answerQuiz: (correct: boolean) => void;
    nextQuizQuestion: () => void;
    endQuiz: () => void;
    clearLastQuizResult: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            currentLevel: 'common-core',
            xp: 0,
            unlockedConcepts: [],
            completedQuizzes: [],
            unlockedPhilosophers: [],
            currentQuiz: null,
            lastQuizResult: null,

            setLevel: (level) => set({ currentLevel: level }),
            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
            unlockConcept: (id) => set((state) => ({
                unlockedConcepts: [...state.unlockedConcepts, id]
            })),
            completeQuiz: (id) => set((state) => ({
                completedQuizzes: [...state.completedQuizzes, id]
            })),
            unlockPhilosopher: (id) => set((state) => {
                if (state.unlockedPhilosophers.includes(id)) return state;
                return {
                    unlockedPhilosophers: [...state.unlockedPhilosophers, id]
                };
            }),
            startQuiz: (moduleId, questions) => set({
                lastQuizResult: null,
                currentQuiz: {
                    moduleId,
                    questions,
                    currentIndex: 0,
                    score: 0,
                    total: questions.length
                }
            }),
            answerQuiz: (correct) => set((state) => {
                if (!state.currentQuiz) return state;
                const newScore = state.currentQuiz.score + (correct ? 1 : 0);
                return {
                    ...state,
                    currentQuiz: {
                        ...state.currentQuiz,
                        score: newScore
                    }
                };
            }),
            nextQuizQuestion: () => set((state) => {
                if (!state.currentQuiz || state.currentQuiz.currentIndex >= state.currentQuiz.total - 1) return state;
                return {
                    ...state,
                    currentQuiz: {
                        ...state.currentQuiz,
                        currentIndex: state.currentQuiz.currentIndex + 1
                    }
                };
            }),
            endQuiz: () => {
                const state = get();
                if (state.currentQuiz) {
                    const alreadyCompleted = get().completedQuizzes.includes(state.currentQuiz.moduleId);
                    const completedQuizzes = alreadyCompleted
                        ? get().completedQuizzes
                        : [...get().completedQuizzes, state.currentQuiz.moduleId];
                    const accuracy = Math.round((state.currentQuiz.score / state.currentQuiz.total) * 100);
                    const xpEarned = Math.max(1, Math.round(accuracy / 10));
                    set((s) => ({
                        completedQuizzes,
                        xp: s.xp + xpEarned,
                        lastQuizResult: {
                            moduleId: state.currentQuiz!.moduleId,
                            correct: state.currentQuiz!.score,
                            total: state.currentQuiz!.total,
                            accuracy,
                            xpEarned,
                            completedAt: new Date().toISOString(),
                        },
                    }));
                    const unlocks = state.currentQuiz.questions[0]?.unlocks;
                    if (unlocks) {
                        set((s) => ({
                            unlockedPhilosophers: s.unlockedPhilosophers.includes(unlocks)
                                ? s.unlockedPhilosophers
                                : [...s.unlockedPhilosophers, unlocks]
                        }));
                    }
                }
                set({ currentQuiz: null });
            },
            clearLastQuizResult: () => set({ lastQuizResult: null }),
        }),
        {
            name: 'zeos-game-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                currentLevel: state.currentLevel,
                xp: state.xp,
                unlockedConcepts: state.unlockedConcepts,
                completedQuizzes: state.completedQuizzes,
                unlockedPhilosophers: state.unlockedPhilosophers,
                lastQuizResult: state.lastQuizResult,
            }),
        }
    )
);
