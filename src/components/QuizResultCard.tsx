"use client";

import { motion } from "framer-motion";
import { RotateCcw, Star, Target, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { getMasteryLabel } from "@/lib/scoring";

interface QuizResultCardProps {
  result: {
    correct: number;
    total: number;
    accuracy: number;
    xpEarned: number;
  };
  totalPoints: number;
  onClose: () => void;
}

export function QuizResultCard({ result, totalPoints, onClose }: QuizResultCardProps) {
  const mastery = getMasteryLabel(result.accuracy);

  return (
    <GlassCard className="border-cyan-500/30 bg-cyan-500/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-5 text-center"
      >
        <div>
          <div className="text-5xl mb-2">{mastery.emoji}</div>
          <h2 className={`text-2xl font-bold font-serif ${mastery.tone}`}>{mastery.label}</h2>
          <p className="mt-2 text-sm text-gray-400">نتيجة الاختبار الأخيرة</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <Target className="mx-auto mb-1 h-4 w-4 text-green-300" />
            <div className="text-lg font-bold text-white">{result.correct}/{result.total}</div>
            <div className="text-xs text-gray-400">صحيح</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <Star className="mx-auto mb-1 h-4 w-4 text-yellow-300" />
            <div className="text-lg font-bold text-white">{result.accuracy}%</div>
            <div className="text-xs text-gray-400">الدقة</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <Zap className="mx-auto mb-1 h-4 w-4 text-cyan-300" />
            <div className="text-lg font-bold text-white">+{result.xpEarned}</div>
            <div className="text-xs text-gray-400">XP</div>
          </div>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-sm text-purple-100">
          مجموع نقاطك الآن: <span className="font-bold text-white">{totalPoints.toLocaleString()}</span>
        </div>

        <LiquidButton onClick={onClose} variant="secondary" className="w-full">
          <RotateCcw className="h-4 w-4" />
          العودة للدروس
        </LiquidButton>
      </motion.div>
    </GlassCard>
  );
}
