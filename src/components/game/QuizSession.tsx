"use client";

import { useState } from "react";
import { BarChart3, CheckCircle2, Timer } from "lucide-react";
import { EndQuizDialog } from "@/components/game/EndQuizDialog";
import { QuizCard } from "@/components/QuizCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { useGameStore } from "@/store/useStore";
import { timeLimitFor } from "@/lib/quiz-rules";
import { cn } from "@/lib/utils";

export function QuizSession() {
  const attempt = useGameStore((state) => state.currentAttempt);
  const quizMode = useGameStore((state) => state.quizMode);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const advanceOrEnd = useGameStore((state) => state.advanceOrEnd);
  const endAttempt = useGameStore((state) => state.endAttempt);
  const discardAttempt = useGameStore((state) => state.discardAttempt);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [showResume, setShowResume] = useState(() => {
    const current = useGameStore.getState().currentAttempt;
    return Boolean(
      current && (current.currentIndex > 0 || current.reviewItems.length > 0),
    );
  });

  if (!attempt) return null;

  const question = attempt.questions[attempt.currentIndex];
  return (
    <div className="relative z-20 flex flex-col items-center justify-center space-y-4">
      {showResume && (
        <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
          <span>تم استئناف اختبارك المحفوظ.</span>
          <button
            type="button"
            onClick={() => {
              discardAttempt();
              setShowResume(false);
            }}
            className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 font-bold text-cyan-100 transition-colors hover:bg-black/40"
          >
            ابدأ من جديد
          </button>
        </div>
      )}

      <div className="mb-2 w-full text-center text-sm text-gray-400">
        <div className="mb-2 flex items-center justify-between gap-2">
          <BarChart3 aria-hidden="true" className="h-4 w-4" />
          <span>
            {attempt.currentIndex + 1} / {attempt.total}
          </span>
          <span>{Math.round((attempt.score / attempt.total) * 100)}%</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs opacity-75">
            {attempt.moduleTitle}
            {question.category ? ` · ${question.category}` : ""}
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold",
              quizMode === "timed"
                ? "border-white/10 bg-white/5 text-zinc-300"
                : "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
            )}
          >
            {quizMode === "timed" ? (
              <Timer aria-hidden="true" className="h-3 w-3" />
            ) : (
              <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
            )}
            {quizMode === "timed" ? "مؤقت" : "دراسة"}
          </span>
        </div>
      </div>

      <QuizCard
        key={`${attempt.moduleId}-${attempt.currentIndex}`}
        question={question}
        mode={quizMode}
        onAnswer={(answer, timeTaken) => submitAnswer(answer, timeTaken)}
        onNext={advanceOrEnd}
        currentIndex={attempt.currentIndex}
        total={attempt.total}
        score={attempt.score}
        category={question.category ?? ""}
        timeLimit={timeLimitFor(attempt.total)}
      />

      <LiquidButton
        onClick={() => setConfirmEnd(true)}
        variant="danger"
        className="w-full"
      >
        إنهاء الاختبار
      </LiquidButton>

      <EndQuizDialog
        open={confirmEnd}
        onCancel={() => setConfirmEnd(false)}
        onConfirm={() => {
          setConfirmEnd(false);
          endAttempt();
        }}
      />
    </div>
  );
}
