"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Zap, Calendar } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useScoring } from "@/contexts/ScoringProvider";
import { cn } from "@/lib/utils";

export function StatsCard() {
  const { score, currentStreak, highestStreak, dailyStreak, multiplier, isGodMode, rank, rankEmoji } = useScoring();

  const stats = [
    {
      label: "النقاط",
      value: score.toLocaleString(),
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "أعلى سلسلة",
      value: highestStreak.toString(),
      icon: Flame,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "سلسلة يومية",
      value: dailyStreak.toString(),
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "المضاعف",
      value: `x${multiplier.toFixed(1)}`,
      icon: Zap,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <GlassCard className="!p-6 border-cyan-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">إحصائياتك</h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <span className="text-xl">{rankEmoji}</span>
          <span className="text-sm font-bold text-purple-300">{rank}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-3 rounded-xl border",
              stat.bgColor,
              stat.color,
              "border-white/10"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className="w-4 h-4" />
              <span className="text-xs text-gray-400">{stat.label}</span>
            </div>
            <div className="text-xl font-bold">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {isGodMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-purple-300">
            <Flame className="w-5 h-5 animate-pulse" />
            <span className="font-bold">نمط الحكيم مفعل!</span>
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
        </motion.div>
      )}

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">السلسلة الحالية</span>
          <div className="flex items-center gap-2">
            <Flame className={cn("w-4 h-4", currentStreak >= 3 && "animate-pulse text-orange-400")} />
            <span className="font-bold text-white">{currentStreak}</span>
          </div>
        </div>
        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((currentStreak / 10) * 100, 100)}%` }}
            className={cn(
              "h-full rounded-full",
              currentStreak >= 10 ? "bg-gradient-to-r from-purple-500 to-pink-500" :
              currentStreak >= 5 ? "bg-gradient-to-r from-orange-500 to-red-500" :
              currentStreak >= 3 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
              "bg-gray-500"
            )}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500 text-center">
          {currentStreak >= 10 ? "🔥 نمط الحكيم!" : `${10 - currentStreak} إجابات صحيحة للوصول لنمط الحكيم`}
        </div>
      </div>
    </GlassCard>
  );
}
