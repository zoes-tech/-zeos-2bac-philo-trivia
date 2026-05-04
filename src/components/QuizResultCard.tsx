"use client";

import { motion } from "framer-motion";
import { BookOpenCheck, RotateCcw, Star, Target, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { getMasteryLabel } from "@/lib/scoring";
import type { QuizReviewItem } from "@/store/useStore";

interface QuizResultCardProps {
  result: {
    correct: number;
    total: number;
    accuracy: number;
    xpEarned: number;
    reviewItems: QuizReviewItem[];
  };
  totalPoints: number;
  onClose: () => void;
  onRetry: () => void;
}

export function QuizResultCard({ result, totalPoints, onClose, onRetry }: QuizResultCardProps) {
  const mastery = getMasteryLabel(result.accuracy);
  const mistakes = result.reviewItems.filter((item) => !item.isCorrect);

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

        <div className="space-y-3 text-right">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <BookOpenCheck className="h-4 w-4 text-cyan-300" />
              مراجعة الأخطاء
            </h3>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
              {mistakes.length} خطأ
            </span>
          </div>

          {mistakes.length === 0 ? (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-100">
              ممتاز! لم ترتكب أي خطأ في هذا الاختبار.
            </div>
          ) : (
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {mistakes.map((item, index) => (
                <div key={`${item.questionId}-${index}`} className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                  <div className="mb-2 text-xs text-cyan-200/80">{item.category || "بدون تصنيف"}</div>
                  <p className="mb-3 text-sm font-semibold leading-relaxed text-white">{item.question}</p>
                  <div className="space-y-2 text-xs">
                    <div className="rounded-lg bg-red-950/40 p-2 text-red-100">
                      إجابتك: <span className="font-bold">{item.selectedAnswer || "لم تختر إجابة"}</span>
                    </div>
                    <div className="rounded-lg bg-green-950/40 p-2 text-green-100">
                      الإجابة الصحيحة: <span className="font-bold">{item.correctAnswer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <LiquidButton onClick={onRetry} variant="primary" className="w-full">
            <RotateCcw className="h-4 w-4" />
            أعد المحاولة
          </LiquidButton>
          <LiquidButton onClick={onClose} variant="secondary" className="w-full">
            العودة للدروس
          </LiquidButton>
        </div>
      </motion.div>
    </GlassCard>
  );
}
