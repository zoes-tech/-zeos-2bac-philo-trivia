import { getModuleById } from "@/lib/curriculum";
import { parseContentKey } from "@/lib/content-key";
import type { QuizQuestion } from "@/types/quiz";

/** Resolve stored mistake keys back to full questions for a review quiz. */
export function questionsForKeys(keys: string[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const key of keys) {
    const ref = parseContentKey(key);
    if (!ref) continue;

    const owner = getModuleById(ref.moduleId);
    const question = owner?.quiz?.find((item) => item.id === ref.questionId);
    if (owner && question) {
      questions.push({ ...question, moduleId: owner.id });
    }
  }

  return questions;
}
