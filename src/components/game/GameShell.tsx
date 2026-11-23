"use client";

import { useEffect, useRef } from "react";
import { GameHeader } from "@/components/game/GameHeader";
import { LevelBrowser } from "@/components/game/LevelBrowser";
import { QuizSession } from "@/components/game/QuizSession";
import { QuizResultCard } from "@/components/QuizResultCard";
import { MODULE_QUERY_PARAM, PLAY_ANCHOR } from "@/lib/routes";
import { useGameStore } from "@/store/useStore";

/**
 * The quiz island: header, attempt view, result card and level browser.
 * State and quiz transitions live in the store; this component only composes.
 */
export function GameShell() {
  const attempt = useGameStore((state) => state.currentAttempt);
  const lastResult = useGameStore((state) => state.lastQuizResult);
  const points = useGameStore((state) => state.points);
  const startModuleQuiz = useGameStore((state) => state.startModuleQuiz);
  const startDailyChallenge = useGameStore(
    (state) => state.startDailyChallenge,
  );
  const startReview = useGameStore((state) => state.startReview);
  const startReviewFromResult = useGameStore(
    (state) => state.startReviewFromResult,
  );
  const clearLastResult = useGameStore((state) => state.clearLastResult);
  const sectionRef = useRef<HTMLElement>(null);
  const startedAt = attempt?.startedAt;

  useEffect(() => {
    const moduleId = new URLSearchParams(window.location.search).get(
      MODULE_QUERY_PARAM,
    );
    if (!moduleId) return;

    if (!useGameStore.getState().currentAttempt) {
      startModuleQuiz(moduleId);
    }
  }, [startModuleQuiz]);

  useEffect(() => {
    if (!startedAt) return;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [startedAt]);

  const handleRetry = () => {
    if (!lastResult) return;

    if (lastResult.kind === "daily") {
      startDailyChallenge();
      return;
    }
    if (lastResult.kind === "review") {
      startReview();
      return;
    }
    startModuleQuiz(lastResult.moduleId);
  };

  const handleReviewMistakes = () => {
    if (lastResult) startReviewFromResult(lastResult);
  };

  return (
    <section
      id={PLAY_ANCHOR}
      ref={sectionRef}
      aria-label="الاختبار التفاعلي"
      className="relative z-10 mx-auto w-full max-w-md scroll-mt-4 px-4 pb-6"
    >
      <GameHeader />

      {attempt ? (
        <QuizSession />
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
          {lastResult && (
            <QuizResultCard
              result={lastResult}
              totalPoints={points}
              onClose={clearLastResult}
              onRetry={handleRetry}
              onReviewMistakes={handleReviewMistakes}
            />
          )}
          <LevelBrowser />
        </div>
      )}
    </section>
  );
}
