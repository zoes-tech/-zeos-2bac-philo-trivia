export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  unlocks?: string;
  category?: string;
}

/** A question with the module it came from (ids are only unique per module). */
export interface QuizQuestion extends Question {
  moduleId: string;
}

export type QuizKind = "module" | "daily" | "review";

export type QuizMode = "timed" | "study";

export interface Philosopher {
  id: string;
  name: string;
  era: string;
  bio: string;
  quote: string;
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  content: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  concepts: Concept[];
  quiz?: Question[];
  philosopher?: Philosopher;
  unlocks?: string;
}
