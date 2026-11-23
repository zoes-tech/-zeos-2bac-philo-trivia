import { CheckCircle2 } from "lucide-react";
import { MODULE_PAGE_COPY } from "@/i18n/labels";
import { GENERAL_CATEGORY } from "@/lib/curriculum";
import { getExplanation } from "@/lib/explanations";
import type { Question } from "@/types";

export function SampleQuestionCard({
  moduleId,
  question,
  index,
}: {
  moduleId: string;
  question: Question;
  index: number;
}) {
  const explanation = getExplanation(moduleId, question.id);

  return (
    <article className="glass-panel rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-zinc-500">
        <span>{MODULE_PAGE_COPY.questionOf(index)}</span>
        <span>{question.category || GENERAL_CATEGORY}</span>
      </div>
      <h3 className="text-base font-bold leading-relaxed text-white">
        {question.question}
      </h3>
      <ul className="mt-3 space-y-2">
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.correctAnswer;

          return (
            <li
              key={option}
              className={
                isCorrect
                  ? "flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-100"
                  : "flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-zinc-400"
              }
            >
              {isCorrect ? (
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-400"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600"
                />
              )}
              <span>{option}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs font-bold text-green-300">
        {MODULE_PAGE_COPY.correctAnswer}:{" "}
        <span className="font-normal text-green-100">
          {question.options[question.correctAnswer]}
        </span>
      </p>
      {explanation && (
        <p className="mt-2 rounded-lg bg-white/[0.03] p-2.5 text-xs leading-relaxed text-zinc-300">
          <span className="font-bold text-cyan-200">
            {MODULE_PAGE_COPY.explanationLabel}:{" "}
          </span>
          {explanation}
        </p>
      )}
    </article>
  );
}
