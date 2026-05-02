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

    setLevel: (level: 'common-core' | '1st-bac' | '2nd-bac') => void;
    addXp: (amount: number) => void;
    unlockConcept: (conceptId: string) => void;
    completeQuiz: (quizId: string) => void;
    unlockPhilosopher: (philosopherId: string) => void;
    startQuiz: (moduleId: string, questions: Question[]) => void;
    answerQuiz: (correct: boolean) => void;
    nextQuizQuestion: () => void;
    endQuiz: () => void;
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
                    set({ completedQuizzes: [...get().completedQuizzes, state.currentQuiz.moduleId] });
                    const scorePercent = Math.round((state.currentQuiz.score / state.currentQuiz.total) * 10);
                    set((s) => ({ xp: s.xp + scorePercent }));
                    const unlocks = state.currentQuiz.questions[0]?.unlocks;
                    if (unlocks) {
                        set((s) => ({
                            unlockedPhilosophers: [...s.unlockedPhilosophers, unlocks]
                        }));
                    }
                }
                set({ currentQuiz: null });
            },
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
            }),
        }
    )
);
