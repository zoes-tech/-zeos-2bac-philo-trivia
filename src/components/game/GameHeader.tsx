"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Zap } from "lucide-react";
import { useScoreAnimation } from "@/hooks/use-animations";
import { calculateStreakMultiplier, getRankInfo } from "@/lib/scoring";
import { useGameStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export function GameHeader() {
  const points = useGameStore((state) => state.points);
  const currentStreak = useGameStore((state) => state.currentStreak);
  const dailyStreak = useGameStore((state) => state.dailyStreak);
  const displayScore = useScoreAnimation(points);
  const multiplier = calculateStreakMultiplier(currentStreak);
  const rank = getRankInfo(points);

  return (
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
        <span aria-hidden="true">{rank.emoji}</span>
        <span>{rank.rank}</span>
      </p>
    </header>
  );
}
