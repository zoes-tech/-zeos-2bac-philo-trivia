"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Flame, Trophy, X, Zap } from "lucide-react";
import { cn, shuffleArray } from "@/lib/utils";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { GlassCard } from "@/components/ui/GlassCard";
import type { QuizMode, QuizQuestion } from "@/types";
import {
  useScoring,
  useScoreAnimation,
  useStreakAnimation,
} from "@/contexts/ScoringProvider";
import type { QuizReviewItem } from "@/store/useStore";

interface QuizCardProps {
  question: QuizQuestion;
  moduleId?: string;
  mode?: QuizMode;
  onAnswer: (answer: QuizReviewItem) => void;
  /** Called once, ~1.4s after an answer, so the parent can advance. */
  onNext?: () => void;
  currentIndex?: number;
  total?: number;
  score?: number;
  category?: string;
  timeLimit?: number;
}

/**
 * Rendered with `key={questionIndex}` by the parent, so every question gets a
 * fresh component. That keeps per-question state local instead of resetting it
 * in an effect.
 */
export function QuizCard({
  question,
  moduleId,
  mode = "timed",
  onAnswer,
  onNext,
  currentIndex,
  total,
  score,
  category,
  timeLimit = 20,
}: QuizCardProps) {
  const timed = mode === "timed";
  const resolvedModuleId = moduleId ?? question.moduleId;

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  const questionStartRef = useRef(0);
  const deadlineRef = useRef(0);
  const answeredRef = useRef(false);
  const nextTimeoutRef = useRef<number | null>(null);

  const shuffledOptions = useMemo(
    () => shuffleArray(question.options),
    [question],
  );
  const shuffledCorrectIndex = useMemo(
    () =>
      shuffledOptions.findIndex(
        (option) => option === question.options[question.correctAnswer],
      ),
    [question, shuffledOptions],
  );

  const { submitAnswer, currentStreak, multiplier, isGodMode, rank, rankEmoji } =
    useScoring();
  const displayScore = useScoreAnimation(score || 0);
  const { displayStreak, isPopping } = useStreakAnimation(currentStreak);

  // Refs are initialised in an effect: Date.now() is impure and must not run
  // during render (the component remounts per question via `key`).
  useEffect(() => {
    if (!timed) return;
    questionStartRef.current = Date.now();
    deadlineRef.current = Date.now() + timeLimit * 1000;
  }, [timed, timeLimit]);

  const buildReviewItem = useCallback(
    (selectedIndex: number | null, isCorrect: boolean): QuizReviewItem => ({
      moduleId: resolvedModuleId,
      questionId: question.id,
      question: question.question,
      category: question.category,
      selectedAnswer:
        selectedIndex === null ? null : shuffledOptions[selectedIndex],
      correctAnswer: shuffledOptions[shuffledCorrectIndex],
      isCorrect,
    }),
    [resolvedModuleId, question, shuffledCorrectIndex, shuffledOptions],
  );

  const scheduleNext = useCallback(() => {
    if (nextTimeoutRef.current) window.clearTimeout(nextTimeoutRef.current);
    nextTimeoutRef.current = window.setTimeout(() => onNext?.(), 1400);
  }, [onNext]);

  useEffect(
    () => () => {
      if (nextTimeoutRef.current) window.clearTimeout(nextTimeoutRef.current);
    },
    [],
  );

  // Countdown. The timeout handling lives in the interval callback (an
  // external event), not in the effect body.
  useEffect(() => {
    if (!timed || isSubmitted) return;

    let timerId = 0;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000),
      );
      setTimeLeft(remaining);

      if (remaining > 0 || answeredRef.current) return;
      window.clearInterval(timerId);
      answeredRef.current = true;
      submitAnswer(false, timeLimit);
      onAnswer(buildReviewItem(selectedOption, false));
      setTimedOut(true);
      setIsSubmitted(true);
      scheduleNext();
    };

    timerId = window.setInterval(tick, 250);
    return () => window.clearInterval(timerId);
  }, [
    timed,
    isSubmitted,
    selectedOption,
    submitAnswer,
    onAnswer,
    timeLimit,
    buildReviewItem,
    scheduleNext,
  ]);

  const handleSelect = useCallback(
    (index: number) => {
      if (isSubmitted) return;
      setSelectedOption(index);
    },
    [isSubmitted],
  );

  const handleSubmit = useCallback(() => {
    if (isSubmitted || selectedOption === null) return;

    answeredRef.current = true;
    const timeTaken = timed
      ? (Date.now() - questionStartRef.current) / 1000
      : undefined;
    const isCorrect = selectedOption === shuffledCorrectIndex;

    if (isCorrect) {
      const breakdown = submitAnswer(true, timeTaken);
      setEarnedPoints(breakdown.totalPoints);
      if (timed) {
        // Reward fast, correct answers with extra time for the next question.
        deadlineRef.current += 3000;
        setTimeLeft((prev) => prev + 3);
      }
    } else {
      submitAnswer(false, timeTaken);
    }

    setTimedOut(false);
    setIsSubmitted(true);
    onAnswer(buildReviewItem(selectedOption, isCorrect));
    scheduleNext();
  }, [
    isSubmitted,
    selectedOption,
    shuffledCorrectIndex,
    timed,
    submitAnswer,
    onAnswer,
    buildReviewItem,
    scheduleNext,
  ]);

  const handleSkip = () => {
    if (isSubmitted || answeredRef.current) return;

    answeredRef.current = true;
    const timeTaken = timed
      ? (Date.now() - questionStartRef.current) / 1000
      : undefined;
    submitAnswer(false, timeTaken);
    setIsSubmitted(true);
    setTimedOut(false);
    onAnswer(buildReviewItem(null, false));
    scheduleNext();
  };

  // Keyboard shortcuts: 1-4 selects, Enter confirms. Refs keep the listener
  // from re-subscribing on every render.
  const actionRef = useRef({ select: handleSelect, submit: handleSubmit });

  useEffect(() => {
    actionRef.current = { select: handleSelect, submit: handleSubmit };
  }, [handleSelect, handleSubmit]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isSubmitted) return;

      if (event.key >= "1" && event.key <= "4") {
        const index = Number(event.key) - 1;
        if (index < shuffledOptions.length) actionRef.current.select(index);
        return;
      }

      if (event.key === "Enter") {
        const target = event.target as HTMLElement | null;
        if (target && (target.tagName === "BUTTON" || target.tagName === "A")) {
          return;
        }
        actionRef.current.submit();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSubmitted, shuffledOptions.length]);

  const timerPercent = Math.min(100, Math.round((timeLeft / timeLimit) * 100));
  const isCorrectAnswer = selectedOption === shuffledCorrectIndex;
  const progress =
    currentIndex !== undefined && total
      ? Math.round(((currentIndex + 1) / total) * 100)
      : null;

  return (
    <GlassCard
      className="mx-auto w-full max-w-md !p-8 border-cyan-500/20"
      hoverEffect={false}
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {progress !== null && (
          <div
            role="progressbar"
            aria-label="تقدم الاختبار"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {currentIndex !== undefined && total !== undefined && (
          <p className="mb-4 text-center text-sm text-gray-400">
            س {currentIndex + 1} / {total} | {category} | الإجابات الصحيحة:{" "}
            {displayScore}
          </p>
        )}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={isPopping ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold",
                currentStreak >= 10
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : currentStreak >= 5
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50"
                    : currentStreak >= 3
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50"
                      : "bg-gray-700 text-gray-300",
              )}
            >
              <Flame
                aria-hidden="true"
                className={cn("h-4 w-4", currentStreak >= 3 && "animate-pulse")}
              />
              <span>{displayStreak}</span>
            </motion.div>
            {multiplier > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2 py-1 text-xs font-bold text-cyan-300"
              >
                <Zap aria-hidden="true" className="h-3 w-3" />
                <span>x{multiplier.toFixed(1)}</span>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Trophy aria-hidden="true" className="h-3 w-3" />
            <span>
              {rankEmoji} {rank}
            </span>
          </div>
        </div>

        {timed ? (
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">الوقت المتبقي</span>
              <span
                className={cn(
                  "text-sm font-bold",
                  timeLeft <= 3
                    ? "text-red-400 animate-pulse"
                    : timeLeft <= 5
                      ? "text-yellow-400"
                      : "text-cyan-400",
                )}
              >
                {timeLeft}ث
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="الوقت المتبقي"
              aria-valuemin={0}
              aria-valuemax={Math.max(timeLimit, timeLeft)}
              aria-valuenow={timeLeft}
              className="h-2 overflow-hidden rounded-full bg-gray-700"
            >
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${timerPercent}%` }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "h-full rounded-full",
                  timeLeft <= 3
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : timeLeft <= 5
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500",
                )}
              />
            </div>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-200">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            وضع الدراسة: بدون مؤقت وبدون مكافأة سرعة
          </div>
        )}

        <AnimatePresence>
          {isGodMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 text-center"
            >
              <div className="inline-block rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-purple-500/50">
                🔥 نمط الحكيم مفعل! 🔥
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <h3 className="mb-8 text-center text-xl font-bold leading-relaxed text-white drop-shadow-md">
          {question.question}
        </h3>

        <div className="space-y-4">
          {shuffledOptions.map((option, index) => {
            let optionClass =
              "glass-button bg-white/5 border-white/10 text-gray-200 hover:bg-white/10";

            if (selectedOption === index && !isSubmitted) {
              optionClass =
                "bg-cyan-500/20 border-cyan-500 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
            }

            if (isSubmitted) {
              if (index === shuffledCorrectIndex) {
                optionClass =
                  "bg-green-500/20 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
              } else if (
                index === selectedOption &&
                index !== shuffledCorrectIndex
              ) {
                optionClass = "bg-red-500/20 border-red-500 text-red-100";
              } else {
                optionClass = "opacity-40 cursor-default";
              }
            }

            return (
              <motion.button
                key={index}
                whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(index)}
                aria-pressed={selectedOption === index}
                className={cn(
                  "relative w-full overflow-hidden rounded-xl border p-4 text-right font-medium transition-all",
                  optionClass,
                  isSubmitted && "cursor-default",
                )}
                disabled={isSubmitted}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span>{option}</span>
                  {isSubmitted && index === shuffledCorrectIndex && (
                    <Check
                      aria-hidden="true"
                      className="ml-2 h-5 w-5 text-green-400"
                    />
                  )}
                  {isSubmitted &&
                    index === selectedOption &&
                    index !== shuffledCorrectIndex && (
                      <X
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 text-red-400"
                      />
                    )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <p aria-live="polite" className="sr-only">
          {isSubmitted
            ? isCorrectAnswer
              ? "إجابة صحيحة"
              : `إجابة خاطئة. الإجابة الصحيحة هي: ${shuffledOptions[shuffledCorrectIndex]}`
            : ""}
        </p>

        <div className="mt-8 flex gap-2">
          <LiquidButton
            onClick={handleSubmit}
            disabled={selectedOption === null || isSubmitted}
            className={cn(
              "flex-1",
              (selectedOption === null || isSubmitted) &&
                "cursor-not-allowed opacity-50 grayscale",
            )}
            variant="primary"
          >
            {isSubmitted ? "النتيجة..." : "تأكيد الإجابة"}
          </LiquidButton>

          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitted}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-zinc-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            تخطي
          </button>
        </div>

        <p className="mt-3 hidden text-center text-[10px] text-zinc-600 sm:block">
          اختصارات: 1–4 للاختيار، Enter للتأكيد
        </p>

        <AnimatePresence>
          {isSubmitted && earnedPoints > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 text-center"
            >
              <div className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-green-500/50">
                +{earnedPoints} نقطة!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {timedOut && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-4 text-center"
            >
              <div className="inline-block rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/50">
                ⏰ انتهى الوقت!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </GlassCard>
  );
}
