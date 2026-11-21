"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  calculateAnswerScore,
  calculateStreakMultiplier,
  type AnswerScoreBreakdown,
} from "@/lib/scoring";

interface ScoringState {
  score: number;
  currentStreak: number;
  multiplier: number;
  isGodMode: boolean;
  rank: string;
  rankEmoji: string;
  lastAnswer: AnswerScoreBreakdown | null;
}

interface ScoringContextType extends ScoringState {
  submitAnswer: (isCorrect: boolean, timeTaken?: number) => AnswerScoreBreakdown;
  resetScore: () => void;
  getRankInfo: (score: number) => { rank: string; emoji: string };
}

const ScoringContext = createContext<ScoringContextType | undefined>(undefined);

const STORAGE_KEY = "zeos-stats";

const RANKS = [
  { minScore: 0, maxScore: 1000, rank: "متأمل مبتدئ", emoji: "📜" },
  { minScore: 1001, maxScore: 5000, rank: "تلميذ سقراط", emoji: "🦉" },
  { minScore: 5001, maxScore: 20000, rank: "فيلسوف ناشئ", emoji: "🧠" },
  { minScore: 20001, maxScore: Infinity, rank: "حكيم الأطلس", emoji: "💎" },
];

const getRankInfo = (score: number): { rank: string; emoji: string } => {
  for (const rank of RANKS) {
    if (score >= rank.minScore && score <= rank.maxScore) {
      return { rank: rank.rank, emoji: rank.emoji };
    }
  }
  return RANKS[0];
};

const INITIAL_STATE: ScoringState = {
  score: 0,
  currentStreak: 0,
  multiplier: 1,
  isGodMode: false,
  rank: "متأمل مبتدئ",
  rankEmoji: "📜",
  lastAnswer: null,
};

/**
 * Points, answer streaks and rank. Daily activity lives in the game store
 * (`dailyStreak`), so this provider only deals with the current session.
 */
export const ScoringProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ScoringState>(() => {
    if (typeof window === "undefined") return INITIAL_STATE;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return INITIAL_STATE;

      const parsed = JSON.parse(stored) as Partial<ScoringState>;
      const score = typeof parsed.score === "number" ? parsed.score : 0;
      const currentStreak =
        typeof parsed.currentStreak === "number" ? parsed.currentStreak : 0;
      const rankInfo = getRankInfo(score);

      return {
        score,
        currentStreak,
        multiplier: calculateStreakMultiplier(currentStreak),
        isGodMode: currentStreak >= 10,
        rank: rankInfo.rank,
        rankEmoji: rankInfo.emoji,
        lastAnswer: null,
      };
    } catch {
      return INITIAL_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be full or blocked; scoring still works in memory.
    }
  }, [state]);

  const submitAnswer = useCallback(
    (isCorrect: boolean, timeTaken?: number) => {
      const breakdown = calculateAnswerScore({
        isCorrect,
        timeTaken,
        currentStreak: state.currentStreak,
      });

      setState((previous) => {
        if (!isCorrect) {
          const rankInfo = getRankInfo(previous.score);
          return {
            ...previous,
            currentStreak: 0,
            multiplier: 1,
            isGodMode: false,
            rank: rankInfo.rank,
            rankEmoji: rankInfo.emoji,
            lastAnswer: breakdown,
          };
        }

        const newScore = previous.score + breakdown.totalPoints;
        const rankInfo = getRankInfo(newScore);

        return {
          ...previous,
          score: newScore,
          currentStreak: breakdown.nextStreak,
          multiplier: breakdown.multiplier,
          isGodMode: breakdown.nextStreak >= 10,
          rank: rankInfo.rank,
          rankEmoji: rankInfo.emoji,
          lastAnswer: breakdown,
        };
      });

      return breakdown;
    },
    [state.currentStreak],
  );

  const resetScore = useCallback(() => setState(INITIAL_STATE), []);

  const contextValue = useMemo<ScoringContextType>(
    () => ({
      ...state,
      submitAnswer,
      resetScore,
      getRankInfo,
    }),
    [state, submitAnswer, resetScore],
  );

  return (
    <ScoringContext.Provider value={contextValue}>
      {children}
    </ScoringContext.Provider>
  );
};

export const useScoring = (): ScoringContextType => {
  const context = useContext(ScoringContext);
  if (context === undefined) {
    throw new Error("useScoring must be used within a ScoringProvider");
  }
  return context;
};

export const useScoreAnimation = (targetScore: number, duration = 1000) => {
  const [displayScore, setDisplayScore] = useState(0);
  const displayScoreRef = useRef(0);

  useEffect(() => {
    displayScoreRef.current = displayScore;
  }, [displayScore]);

  useEffect(() => {
    let startTime: number | null = null;
    const startScore = displayScoreRef.current;
    let frameId = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayScore(
        Math.round(startScore + (targetScore - startScore) * easeOutQuart),
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [targetScore, duration]);

  return displayScore;
};

export const useStreakAnimation = (targetStreak: number) => {
  const [displayStreak, setDisplayStreak] = useState(0);
  const [isPopping, setIsPopping] = useState(false);
  const displayStreakRef = useRef(0);

  useEffect(() => {
    displayStreakRef.current = displayStreak;
  }, [displayStreak]);

  useEffect(() => {
    const startStreak = displayStreakRef.current;
    let popTimeout: number | undefined;
    let unpopTimeout: number | undefined;
    let frameId = 0;

    if (targetStreak > startStreak) {
      popTimeout = window.setTimeout(() => setIsPopping(true), 0);
      unpopTimeout = window.setTimeout(() => setIsPopping(false), 300);
    }

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / 500, 1);

      const easeOutBack = (x: number) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      };

      setDisplayStreak(
        Math.round(startStreak + (targetStreak - startStreak) * easeOutBack(progress)),
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      if (popTimeout) window.clearTimeout(popTimeout);
      if (unpopTimeout) window.clearTimeout(unpopTimeout);
      cancelAnimationFrame(frameId);
    };
  }, [targetStreak]);

  return { displayStreak, isPopping };
};
