import introPhilosophy from "@/data/explanations/intro-philosophy.json";
import humanity from "@/data/explanations/humanity.json";
import effectiveness from "@/data/explanations/effectiveness.json";
import humanCondition from "@/data/explanations/human-condition.json";
import politics from "@/data/explanations/politics.json";
import knowledge from "@/data/explanations/knowledge.json";
import morality from "@/data/explanations/morality.json";

/**
 * Explanations live outside the question banks so they can be reviewed,
 * corrected or replaced without touching the quizzes. Keys are
 * `moduleId:questionId` because question ids repeat across modules.
 */
const EXPLANATIONS: Record<string, string> = {
  ...(introPhilosophy as Record<string, string>),
  ...(humanity as Record<string, string>),
  ...(effectiveness as Record<string, string>),
  ...(humanCondition as Record<string, string>),
  ...(politics as Record<string, string>),
  ...(knowledge as Record<string, string>),
  ...(morality as Record<string, string>),
};

export function getExplanation(
  moduleId: string,
  questionId: string,
): string | undefined {
  return EXPLANATIONS[`${moduleId}:${questionId}`];
}

export const EXPLANATION_COUNT = Object.keys(EXPLANATIONS).length;
