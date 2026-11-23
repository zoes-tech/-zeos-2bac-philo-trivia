import type { Question } from "@/types";

/** A question with the module it belongs to (ids are only unique per module). */
export interface QuizQuestion extends Question {
  moduleId: string;
}

export type QuizKind = "module" | "daily" | "review";

export type QuizMode = "timed" | "study";

export interface QuizReviewItem {
  moduleId: string;
  questionId: string;
  question: string;
  category?: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface CurrentAttempt {
  kind: QuizKind;
  moduleId: string;
  moduleTitle: string;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  points: number;
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
  answered: number;
  accuracy: number;
  pointsEarned: number;
  completedAt: string;
  reviewItems: QuizReviewItem[];
}

export interface DailyResult {
  date: string;
  correct: number;
  total: number;
}

interface MistakeRecord {
  count: number;
  lastMissedAt: string;
}

export type MistakeMap = Record<string, MistakeRecord>;
