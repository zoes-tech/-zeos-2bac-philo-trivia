export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  unlocks?: string;
  category?: string;
}

export interface Philosopher {
  id: string;
  name: string;
  era: string;
  bio: string;
  quote: string;
}

interface Concept {
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
