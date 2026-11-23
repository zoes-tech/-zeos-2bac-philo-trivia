"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpenCheck,
  RotateCcw,
  Share2,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { getMasteryLabel } from "@/lib/scoring";
import { mistakeCountLabel, questionCountLabel } from "@/i18n/labels";
import { getModulePath } from "@/lib/curriculum";
import { cn } from "@/lib/utils";
import type { QuizResult } from "@/types/quiz";

interface QuizResultCardProps {
  result: QuizResult;
  totalPoints: number;
  onClose: () => void;
  onRetry: () => void;
  onReviewMistakes: () => void;
}

export function QuizResultCard({
  result,
  totalPoints,
  onClose,
  onRetry,
  onReviewMistakes,
}: QuizResultCardProps) {
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  const mastery = getMasteryLabel(result.accuracy);
  const mistakes = result.reviewItems.filter((item) => !item.isCorrect);
  const skipped = result.reviewItems.filter(
    (item) => item.selectedAnswer === null,
  );
  const answered = result.reviewItems.length;
  const unanswered = Math.max(0, result.total - answered);
  const finishedAll = answered >= result.total;
  const title = result.moduleTitle ?? "اختبار الفلسفة";

  const wrongByCategory = new Map<string, number>();
  for (const item of mistakes) {
    const key = item.category?.trim() || "عام";
    wrongByCategory.set(key, (wrongByCategory.get(key) ?? 0) + 1);
  }
  const weakest = [...wrongByCategory.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0];
  const reviewPath =
    result.kind === "module" ? getModulePath(result.moduleId) : undefined;

  const shareResult = async () => {
    const text = `حصلت على ${result.correct}/${result.total} في ${title} — رحلة الفيلسوف`;
    const path =
      result.kind === "module" ? getModulePath(result.moduleId) : undefined;
    const url = `${window.location.origin}${path ?? "/"}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "رحلة الفيلسوف", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 2000);
    } catch {
      // Sharing was cancelled or is unavailable; nothing to do.
    }
  };

  return (
    <GlassCard className="border-cyan-500/30 bg-cyan-500/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-5 text-center"
      >
        <div>
          <div className="mb-2 text-5xl">{mastery.emoji}</div>
          <h2 className={`font-serif text-2xl font-bold ${mastery.tone}`}>
            {mastery.label}
          </h2>
          <p className="mt-1 text-xs font-bold text-cyan-300">{title}</p>
          <p className="mt-1 text-sm text-gray-400">نتيجة الاختبار الأخيرة</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <Target className="mx-auto mb-1 h-3 w-3 text-green-300" />
            <div className="text-sm font-bold text-white">
              {result.correct}/{result.total}
            </div>
            <div className="text-xs text-gray-400">صحيح</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <Star className="mx-auto mb-1 h-3 w-3 text-yellow-300" />
            <div className="text-sm font-bold text-white">
              {result.accuracy}%
            </div>
            <div className="text-xs text-gray-400">الدقة</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <Zap className="mx-auto mb-1 h-3 w-3 text-cyan-300" />
            <div className="text-sm font-bold text-white">
              +{result.pointsEarned}
            </div>
            <div className="text-xs text-gray-400">نقطة</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <BookOpenCheck className="mx-auto mb-1 h-3 w-3 text-red-300" />
            <div className="text-sm font-bold text-white">{skipped.length}</div>
            <div className="text-xs text-gray-400">متجاوز</div>
          </div>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-sm text-purple-100">
          مجموع نقاطك الآن:{" "}
          <span className="font-bold text-white">
            {totalPoints.toLocaleString()}
          </span>
        </div>

        {weakest && result.correct < result.total && (
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-right text-sm">
            <p className="text-xs text-orange-200">
              أكثر ما يحتاج مراجعة في هذه الجلسة
            </p>
            <p className="mt-1 font-bold text-white">
              {weakest[0]}{" "}
              <span className="text-xs font-normal text-orange-200">
                ({mistakeCountLabel(weakest[1])})
              </span>
            </p>
            {reviewPath && (
              <Link
                href={reviewPath}
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-orange-200 transition-colors hover:text-white"
              >
                راجع المحور كاملاً
                <ArrowLeft aria-hidden="true" className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}

        <div className="space-y-3 text-right">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <BookOpenCheck className="h-4 w-4 text-cyan-300" />
              مراجعة الإجابات
            </h3>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
              {mistakeCountLabel(mistakes.length)} | {skipped.length} متجاوز |{" "}
              {unanswered} دون إجابة
            </span>
          </div>

          {answered === 0 ? (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-100">
              لم يتم تسجيل أي إجابات. يرجى المحاولة مرة أخرى.
            </div>
          ) : result.correct === result.total ? (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-100">
              ممتاز! أجبت على جميع الأسئلة بشكل صحيح.
            </div>
          ) : (
            <>
              {unanswered > 0 && (
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
                  أجبت على {answered} من {result.total}{" "}
                  {questionCountLabel("ar", result.total)}. أكمل بقية الأسئلة
                  أو أعد المحاولة لتحسين نتيجتك.
                </div>
              )}

              {finishedAll && mistakes.length === 0 && skipped.length === 0 && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-100">
                  لا توجد أخطاء لمراجعتها.
                </div>
              )}

              {result.reviewItems.length > 0 && (
                <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                  {result.reviewItems.map((item, index) => (
                    <div
                      key={`${item.moduleId}-${item.questionId}-${index}`}
                      className={cn(
                        "rounded-xl border p-3",
                        item.isCorrect
                          ? "border-green-500/20 bg-green-500/10"
                          : item.selectedAnswer === null
                            ? "border-yellow-500/20 bg-yellow-500/10"
                            : "border-red-500/20 bg-red-500/10",
                      )}
                    >
                      <div className="mb-2 text-xs text-cyan-200/80">
                        {item.category || "بدون تصنيف"}
                      </div>
                      <p className="mb-3 text-sm font-semibold leading-relaxed text-white">
                        {item.question}
                      </p>
                      <div className="space-y-2 text-xs">
                        {item.selectedAnswer === null ? (
                          <div className="rounded-lg bg-yellow-950/40 p-2 text-yellow-100">
                            لم تختر إجابة (تم تجاوز السؤال)
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "rounded-lg p-2",
                              item.isCorrect
                                ? "bg-green-950/40 text-green-100"
                                : "bg-red-950/40 text-red-100",
                            )}
                          >
                            إجابتك:{" "}
                            <span className="font-bold">
                              {item.selectedAnswer}
                            </span>
                          </div>
                        )}
                        {!item.isCorrect && (
                          <div className="rounded-lg bg-green-950/40 p-2 text-green-100">
                            الإجابة الصحيحة:{" "}
                            <span className="font-bold">
                              {item.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <LiquidButton onClick={onRetry} variant="primary" className="w-full">
            <RotateCcw className="h-4 w-4" />
            أعد المحاولة
          </LiquidButton>

          {mistakes.length > 0 ? (
            <LiquidButton
              onClick={onReviewMistakes}
              variant="secondary"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4" />
              راجع أخطاءك ({mistakes.length})
            </LiquidButton>
          ) : (
            <LiquidButton onClick={onClose} variant="secondary" className="w-full">
              العودة للدروس
            </LiquidButton>
          )}

          <button
            type="button"
            onClick={shareResult}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-zinc-200 transition-colors hover:bg-white/10 sm:col-span-2"
          >
            <Share2 aria-hidden="true" className="h-4 w-4" />
            {shareState === "copied" ? "تم نسخ الرابط" : "شارك نتيجتك"}
          </button>
        </div>
      </motion.div>
    </GlassCard>
  );
}
