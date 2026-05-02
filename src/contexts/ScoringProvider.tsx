"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

interface ScoringState {
  score: number;
  currentStreak: number;
  highestStreak: number;
  dailyStreak: number;
  lastPlayedDate: string | null;
  rank: string;
  rankEmoji: string;
  multiplier: number;
  isGodMode: boolean;
  totalTimeBonus: number;
}

interface ScoringContextType extends ScoringState {
  submitAnswer: (isCorrect: boolean, timeTaken?: number) => void;
  resetScore: () => void;
  getRankInfo: (score: number) => { rank: string; emoji: string };
}

const ScoringContext = createContext<ScoringContextType | undefined>(undefined);

const STORAGE_KEY = 'zeos-stats';

const RANKS = [
  { minScore: 0, maxScore: 1000, rank: 'Novice Philosophe', emoji: '📜' },
  { minScore: 1001, maxScore: 5000, rank: 'Géologue Amateur', emoji: '🏔️' },
  { minScore: 5001, maxScore: 20000, rank: 'Savant de l\'Atlas', emoji: '🦁' },
  { minScore: 20001, maxScore: Infinity, rank: 'Maître de l\'Anatexie', emoji: '💎' },
];

const getRankInfo = (score: number): { rank: string; emoji: string } => {
  for (const rank of RANKS) {
    if (score >= rank.minScore && score <= rank.maxScore) {
      return { rank: rank.rank, emoji: rank.emoji };
    }
  }
  return RANKS[0];
};

const calculateMultiplier = (streak: number): number => {
  if (streak >= 10) return 2.0;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.2;
  return 1.0;
};

const checkDailyStreak = (lastPlayedDate: string | null): { dailyStreak: number; shouldReset: boolean } => {
  if (!lastPlayedDate) return { dailyStreak: 0, shouldReset: false };

  const lastDate = new Date(lastPlayedDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = lastDate.toDateString() === today.toDateString();
  const isYesterday = lastDate.toDateString() === yesterday.toDateString();

  if (isToday) return { dailyStreak: 0, shouldReset: false };
  if (isYesterday) return { dailyStreak: 0, shouldReset: false };

  return { dailyStreak: 0, shouldReset: true };
};

interface ScoringProviderProps {
  children: React.ReactNode;
}

export const ScoringProvider: React.FC<ScoringProviderProps> = ({ children }) => {
  const [state, setState] = useState<ScoringState>(() => {
    if (typeof window === 'undefined') {
      return {
        score: 0,
        currentStreak: 0,
        highestStreak: 0,
        dailyStreak: 0,
        lastPlayedDate: null,
        rank: 'Novice Philosophe',
        rankEmoji: '📜',
        multiplier: 1.0,
        isGodMode: false,
        totalTimeBonus: 0,
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const { dailyStreak, shouldReset } = checkDailyStreak(parsed.lastPlayedDate);
        const rankInfo = getRankInfo(parsed.score);
        const multiplier = calculateMultiplier(parsed.currentStreak);

        return {
          ...parsed,
          dailyStreak: shouldReset ? 0 : parsed.dailyStreak,
          rank: rankInfo.rank,
          rankEmoji: rankInfo.emoji,
          multiplier,
          isGodMode: parsed.currentStreak >= 10,
          totalTimeBonus: parsed.totalTimeBonus || 0,
        };
      }
    } catch (error) {
      console.error('Failed to load scoring state:', error);
    }

    return {
      score: 0,
      currentStreak: 0,
      highestStreak: 0,
      dailyStreak: 0,
      lastPlayedDate: null,
      rank: 'Novice Philosophe',
      rankEmoji: '📜',
      multiplier: 1.0,
      isGodMode: false,
      totalTimeBonus: 0,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save scoring state:', error);
    }
  }, [state]);

  const submitAnswer = useCallback((isCorrect: boolean, timeTaken?: number) => {
    setState((prevState) => {
      const today = new Date().toISOString();
      const { dailyStreak, shouldReset } = checkDailyStreak(prevState.lastPlayedDate);

      if (!isCorrect) {
        const newDailyStreak = shouldReset ? 0 : prevState.dailyStreak;
        const newMultiplier = calculateMultiplier(0);
        const rankInfo = getRankInfo(prevState.score);

        return {
          ...prevState,
          currentStreak: 0,
          dailyStreak: newDailyStreak,
          lastPlayedDate: today,
          multiplier: newMultiplier,
          isGodMode: false,
          rank: rankInfo.rank,
          rankEmoji: rankInfo.emoji,
        };
      }

      let points = 100;
      let speedMultiplier = 1.0;

      if (timeTaken !== undefined && timeTaken !== null && timeTaken < 5) {
        speedMultiplier = 1.5;
      }

      const newCurrentStreak = prevState.currentStreak + 1;
      const newHighestStreak = Math.max(prevState.highestStreak, newCurrentStreak);
      const streakMultiplier = calculateMultiplier(newCurrentStreak);
      const totalMultiplier = speedMultiplier * streakMultiplier;
      const earnedPoints = Math.round(points * totalMultiplier);
      const newScore = prevState.score + earnedPoints;
      const newDailyStreak = shouldReset ? 1 : prevState.dailyStreak + 1;
      const newTotalTimeBonus = prevState.totalTimeBonus + 3;
      const rankInfo = getRankInfo(newScore);

      return {
        ...prevState,
        score: newScore,
        currentStreak: newCurrentStreak,
        highestStreak: newHighestStreak,
        dailyStreak: newDailyStreak,
        lastPlayedDate: today,
        multiplier: totalMultiplier,
        isGodMode: newCurrentStreak >= 10,
        rank: rankInfo.rank,
        rankEmoji: rankInfo.emoji,
        totalTimeBonus: newTotalTimeBonus,
      };
    });
  }, []);

  const resetScore = useCallback(() => {
    setState({
      score: 0,
      currentStreak: 0,
      highestStreak: 0,
      dailyStreak: 0,
      lastPlayedDate: null,
      rank: 'Novice Philosophe',
      rankEmoji: '📜',
      multiplier: 1.0,
      isGodMode: false,
      totalTimeBonus: 0,
    });
  }, []);

  const contextValue = useMemo<ScoringContextType>(
    () => ({
      ...state,
      submitAnswer,
      resetScore,
      getRankInfo,
    }),
    [state, submitAnswer, resetScore]
  );

  return <ScoringContext.Provider value={contextValue}>{children}</ScoringContext.Provider>;
};

export const useScoring = (): ScoringContextType => {
  const context = useContext(ScoringContext);
  if (context === undefined) {
    throw new Error('useScoring must be used within a ScoringProvider');
  }
  return context;
};

export const useScoreAnimation = (targetScore: number, duration: number = 1000) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startScore = displayScore;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayScore(Math.round(startScore + (targetScore - startScore) * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetScore, duration]);

  return displayScore;
};

export const useStreakAnimation = (targetStreak: number) => {
  const [displayStreak, setDisplayStreak] = useState(0);
  const [isPopping, setIsPopping] = useState(false);

  useEffect(() => {
    if (targetStreak > displayStreak) {
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 300);
    }

    let startTime: number | null = null;
    const startStreak = displayStreak;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / 500, 1);

      const easeOutBack = (x: number) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      };

      setDisplayStreak(Math.round(startStreak + (targetStreak - startStreak) * easeOutBack(progress)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetStreak, displayStreak]);

  return { displayStreak, isPopping };
};
