"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Flame,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LevelMap } from "@/components/LevelMap";
import { QuizCard } from "@/components/QuizCard";
import { QuizResultCard } from "@/components/QuizResultCard";
import { PhilosopherProfile } from "@/components/PhilosopherProfile";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { useScoring, useScoreAnimation } from "@/contexts/ScoringProvider";
import { useGameStore, type QuizReviewItem } from "@/store/useStore";
import { ALL_MODULES, MODULES_BY_LEVEL } from "@/lib/curriculum";
import { cn } from "@/lib/utils";
import type { Module, Philosopher, QuizQuestion } from "@/types";

/**
 * The interactive quiz. Kept as a client island so the rest of the page can be
 * server-rendered static HTML (better for crawlers and first paint).
 */
export function GameShell() {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const unlockedPhilosophers = useGameStore((state) => state.unlockedPhilosophers);
  const currentQuiz = useGameStore((state) => state.currentQuiz);
  const lastQuizResult = useGameStore((state) => state.lastQuizResult);
  const dailyStreak = useGameStore((state) => state.dailyStreak);
  const quizMode = useGameStore((state) => state.quizMode);
  const startQuiz = useGameStore((state) => state.startQuiz);
  const startDailyChallenge = useGameStore((state) => state.startDailyChallenge);
  const startMistakeReview = useGameStore((state) => state.startMistakeReview);
  const answerQuiz = useGameStore((state) => state.answerQuiz);
  const nextQuizQuestion = useGameStore((state) => state.nextQuizQuestion);
  const endQuiz = useGameStore((state) => state.endQuiz);
  const discardQuiz = useGameStore((state) => state.discardQuiz);
  const clearLastQuizResult = useGameStore((state) => state.clearLastQuizResult);
  const setQuizMode = useGameStore((state) => state.setQuizMode);

  const { score, currentStreak, multiplier, rank, rankEmoji } = useScoring();
  const displayScore = useScoreAnimation(score);
  const [viewingPhilosopher, setViewingPhilosopher] = useState<Philosopher | null>(
    null,
  );
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [showResume, setShowResume] = useState(() => {
    const quiz = useGameStore.getState().currentQuiz;
    return Boolean(
      quiz && (quiz.currentIndex > 0 || quiz.reviewItems.length > 0),
    );
  });

  const levelData = MODULES_BY_LEVEL[currentLevel];

  useEffect(() => {
    if (!confirmEnd) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setConfirmEnd(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [confirmEnd]);

  const focusQuiz = () => {
    requestAnimationFrame(() => {
      document
        .getElementById("play")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // `/2bac/human-condition/` links here with `?module=human-condition`, so a
  // shared module page opens the matching quiz directly.
  useEffect(() => {
    const moduleId = new URLSearchParams(window.location.search).get("module");
    if (!moduleId) return;

    const store = useGameStore.getState();
    if (store.currentQuiz) return;

    const target = ALL_MODULES.find((item) => item.id === moduleId);
    if (target?.quiz?.length) {
      store.startQuiz({
        kind: "module",
        moduleId: target.id,
        moduleTitle: target.title,
        questions: target.quiz,
      });
      focusQuiz();
    }
  }, []);

  const calculateTimeLimit = (totalQuestions: number): number => {
    if (totalQuestions <= 10) return 20;
    if (totalQuestions <= 25) return 18;
    return 15;
  };

  const handleQuizStart = (module: Module) => {
    if (!module.quiz?.length) return;
    startQuiz({
      kind: "module",
      moduleId: module.id,
      moduleTitle: module.title,
      questions: module.quiz,
    });
  };

  /** Records the answer only. Advancing is handled by QuizCard once. */
  const handleAnswer = (answer: QuizReviewItem) => {
    answerQuiz(answer);
  };

  /** Single advance path, shared by the quiz card timer and the exit button. */
  const handleAdvance = () => {
    const store = useGameStore.getState();
    if (!store.currentQuiz) return;
    if (store.currentQuiz.currentIndex < store.currentQuiz.total - 1) {
      nextQuizQuestion();
    } else {
      endQuiz();
    }
  };

  const handleRetryLastQuiz = () => {
    if (!lastQuizResult) return;

    if (lastQuizResult.kind === "daily") {
      startDailyChallenge();
      focusQuiz();
      return;
    }
    if (lastQuizResult.kind === "review") {
      startMistakeReview();
      focusQuiz();
      return;
    }

    const owner = ALL_MODULES.find(
      (item) => item.id === lastQuizResult.moduleId,
    );
    if (owner?.quiz?.length) {
      startQuiz({
        kind: "module",
        moduleId: owner.id,
        moduleTitle: owner.title,
        questions: owner.quiz,
      });
      focusQuiz();
    }
  };

  const handleReviewLastMistakes = () => {
    if (!lastQuizResult) return;

    const questions: QuizQuestion[] = [];
    for (const item of lastQuizResult.reviewItems) {
      if (item.isCorrect) continue;
      const owner = ALL_MODULES.find((module) => module.id === item.moduleId);
      const question = owner?.quiz?.find((entry) => entry.id === item.questionId);
      if (owner && question) {
        questions.push({ ...question, moduleId: owner.id });
      }
    }

    if (questions.length === 0) return;
    startQuiz({
      kind: "review",
      moduleId: "review",
      moduleTitle: "مراجعة أخطاء الاختبار",
      questions,
    });
    focusQuiz();
  };

  return (
    <section
      id="play"
      aria-label="الاختبار التفاعلي"
      className="relative z-10 mx-auto w-full max-w-md scroll-mt-4 px-4 pb-6"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5">
            <Trophy aria-hidden="true" className="h-5 w-5 text-yellow-400" />
            <span className="font-bold text-white">{displayScore}</span>
            <span className="sr-only">نقطة</span>
          </div>

          {currentStreak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
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
              <span>
                {currentStreak}
                <span className="sr-only"> إجابة صحيحة متتالية</span>
              </span>
            </motion.div>
          )}

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

          {dailyStreak > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-orange-500/25 bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-200">
              <Flame aria-hidden="true" className="h-3 w-3" />
              {dailyStreak} يوم
            </span>
          )}
        </div>

        <p className="flex items-center gap-1 text-xs text-gray-400">
          <span aria-hidden="true">{rankEmoji}</span>
          <span>{rank}</span>
        </p>
      </header>

      {currentQuiz ? (
        <div className="relative z-20 flex flex-col items-center justify-center space-y-4">
          {showResume && (
            <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
              <span>تم استئناف اختبارك المحفوظ.</span>
              <button
                type="button"
                onClick={() => {
                  discardQuiz();
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
                {currentQuiz.currentIndex + 1} / {currentQuiz.total}
              </span>
              <span>
                {Math.round((currentQuiz.score / currentQuiz.total) * 100)}%
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs opacity-75">
                {currentQuiz.moduleTitle}
                {currentQuiz.questions[currentQuiz.currentIndex].category
                  ? ` · ${currentQuiz.questions[currentQuiz.currentIndex].category}`
                  : ""}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuizMode(quizMode === "timed" ? "study" : "timed")
                }
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-zinc-300 transition-colors hover:bg-white/10"
                aria-pressed={quizMode === "study"}
              >
                {quizMode === "timed" ? (
                  <Timer aria-hidden="true" className="h-3 w-3" />
                ) : (
                  <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
                )}
                {quizMode === "timed" ? "مؤقت" : "دراسة"}
              </button>
            </div>
          </div>

          <QuizCard
            key={`${currentQuiz.moduleId}-${currentQuiz.currentIndex}-${quizMode}`}
            question={currentQuiz.questions[currentQuiz.currentIndex]}
            moduleId={currentQuiz.questions[currentQuiz.currentIndex].moduleId}
            mode={quizMode}
            onAnswer={handleAnswer}
            onNext={handleAdvance}
            currentIndex={currentQuiz.currentIndex}
            total={currentQuiz.total}
            score={currentQuiz.score}
            category={
              currentQuiz.questions[currentQuiz.currentIndex].category || ""
            }
            timeLimit={calculateTimeLimit(currentQuiz.total)}
          />

          <LiquidButton
            onClick={() => setConfirmEnd(true)}
            variant="danger"
            className="w-full"
          >
            إنهاء الاختبار
          </LiquidButton>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
          {lastQuizResult && (
            <QuizResultCard
              result={lastQuizResult}
              totalPoints={score}
              onClose={clearLastQuizResult}
              onRetry={handleRetryLastQuiz}
              onReviewMistakes={handleReviewLastMistakes}
            />
          )}

          <section>
            <h2 className="mb-4 text-center font-serif text-2xl font-bold text-white/90 drop-shadow-md">
              خريطة التعلم
            </h2>
            <LevelMap />
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-bold text-cyan-400">
              دروس{" "}
              {currentLevel === "common-core"
                ? "الجذع المشترك"
                : currentLevel === "1st-bac"
                  ? "الأولى باك"
                  : "الثانية باك"}
            </h2>

            <div className="space-y-4">
              {levelData.map((module) => (
                <GlassCard
                  key={module.id}
                  className="group transition-colors hover:border-cyan-500/30"
                  hoverEffect
                >
                  <div className="absolute right-0 top-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
                  <h3 className="mb-2 text-lg font-bold text-cyan-300 transition-colors group-hover:text-cyan-200">
                    {module.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-gray-300">
                    {module.description}
                  </p>
                  {module.quiz && module.quiz.length > 0 && (
                    <LiquidButton
                      onClick={() => handleQuizStart(module)}
                      className="relative w-full overflow-hidden"
                      variant="primary"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>
                          اختبار المعلومات ({module.quiz.length} سؤال)
                        </span>
                        <ChevronRight
                          aria-hidden="true"
                          className="h-4 w-4 rotate-180"
                        />
                      </span>
                    </LiquidButton>
                  )}
                </GlassCard>
              ))}
            </div>
          </section>

          {unlockedPhilosophers.length > 0 && (
            <section>
              <h2 className="mb-4 font-serif text-xl font-bold text-purple-400">
                الفلاسفة المكتشفون
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {ALL_MODULES.filter(
                  (module) =>
                    module.philosopher &&
                    unlockedPhilosophers.includes(module.philosopher.id),
                ).map((module) => (
                  <motion.button
                    key={module.philosopher!.id}
                    onClick={() => setViewingPhilosopher(module.philosopher!)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative rounded-xl"
                  >
                    <GlassCard className="!rounded-xl !p-4 transition-colors group-hover:border-purple-500/50">
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all group-hover:shadow-[0_0_25px_rgba(139,92,246,0.8)]">
                          <span className="text-xl font-bold text-white">
                            {module.philosopher!.name[0]}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-200 transition-colors group-hover:text-white">
                          {module.philosopher!.name}
                        </h3>
                      </div>
                    </GlassCard>
                  </motion.button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <AnimatePresence>
        {viewingPhilosopher && (
          <PhilosopherProfile
            philosopher={viewingPhilosopher}
            onClose={() => setViewingPhilosopher(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmEnd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="end-quiz-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setConfirmEnd(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm"
            >
              <GlassCard className="!p-6 border-red-500/20">
                <h2
                  id="end-quiz-title"
                  className="font-serif text-xl font-bold text-white"
                >
                  إنهاء الاختبار؟
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  ستظهر نتيجتك بناءً على الأسئلة التي أجبت عنها. يبقى تقدمك
                  محفوظاً ويمكنك العودة لاحقاً من لوحتك.
                </p>
                <div className="mt-5 grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmEnd(false);
                      endQuiz();
                    }}
                    className="rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2.5 text-sm font-bold text-white"
                  >
                    إنهاء وعرض النتيجة
                  </button>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setConfirmEnd(false)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-zinc-200 transition-colors hover:bg-white/10"
                  >
                    متابعة الاختبار
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
