"use client";

import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Flame,
  ListChecks,
  Play,
  RotateCcw,
  Target,
  Timer,
  X,
} from "lucide-react";
import { DAILY_SIZE, localDateKey } from "@/lib/daily";
import { TOTAL_MODULES, TOTAL_QUESTIONS } from "@/lib/curriculum";
import { questionCountLabel } from "@/i18n/labels";
import { recommendedModule } from "@/lib/recommendation";
import { scrollToId } from "@/lib/scroll";
import { useGameStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

/**
 * The return-visit surface: daily challenge, mistake review, resume and the
 * numbers that make progress feel real.
 */
export function RetentionDashboard() {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const currentAttempt = useGameStore((state) => state.currentAttempt);
  const dailyResult = useGameStore((state) => state.dailyResult);
  const dailyStreak = useGameStore((state) => state.dailyStreak);
  const mistakes = useGameStore((state) => state.mistakes);
  const completedModules = useGameStore((state) => state.completedModules);
  const totalAnswered = useGameStore((state) => state.totalAnswered);
  const totalCorrect = useGameStore((state) => state.totalCorrect);
  const quizMode = useGameStore((state) => state.quizMode);
  const onboardingDismissed = useGameStore(
    (state) => state.onboardingDismissed,
  );
  const startDailyChallenge = useGameStore(
    (state) => state.startDailyChallenge,
  );
  const startReview = useGameStore((state) => state.startReview);
  const startModuleQuiz = useGameStore((state) => state.startModuleQuiz);
  const setQuizMode = useGameStore((state) => state.setQuizMode);
  const dismissOnboarding = useGameStore((state) => state.dismissOnboarding);

  const today = localDateKey();
  const dailyDone = dailyResult?.date === today;
  const mistakeCount = Object.keys(mistakes).length;
  const accuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const isReturning =
    dailyStreak > 0 || totalAnswered > 0 || completedModules.length > 0;
  const showIntro = !isReturning && !onboardingDismissed;
  const recommended = recommendedModule(currentLevel, completedModules);

  return (
    <section
      id="dashboard"
      aria-label="لوحة التقدم"
      className="relative z-10 mx-auto w-full max-w-3xl scroll-mt-4 px-4 pb-8"
    >
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-cyan-300">
              {isReturning ? "مرحباً بعودتك" : "ابدأ رحلتك"}
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold text-white sm:text-2xl">
              لوحتك اليومية
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold",
                dailyStreak > 0
                  ? "border-orange-500/30 bg-orange-500/10 text-orange-200"
                  : "border-white/10 bg-white/5 text-zinc-400",
              )}
            >
              <Flame
                aria-hidden="true"
                className={cn("h-4 w-4", dailyStreak > 0 && "text-orange-300")}
              />
              {dailyStreak > 0
                ? `${dailyStreak} يوم متتالي`
                : "لا سلسلة بعد"}
            </span>

            <button
              type="button"
              onClick={() =>
                setQuizMode(quizMode === "timed" ? "study" : "timed")
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-300 transition-colors hover:bg-white/10"
              aria-pressed={quizMode === "study"}
            >
              {quizMode === "timed" ? (
                <Timer aria-hidden="true" className="h-4 w-4" />
              ) : (
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              )}
              {quizMode === "timed" ? "وضع المؤقت" : "وضع الدراسة"}
            </button>
          </div>
        </div>

        {showIntro && (
          <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  كيف تستعمل التطبيق؟
                </h3>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-xs leading-relaxed text-zinc-400">
                  <li>ابدأ بتحدي اليوم أو بالمحور المقترح.</li>
                  <li>أجب على الأسئلة؛ كل خطأ يُحفظ في بنك الأخطاء.</li>
                  <li>راجع أخطاءك لاحقاً، وحافظ على سلسلتك اليومية.</li>
                </ol>
              </div>
              <button
                type="button"
                onClick={() => dismissOnboarding()}
                aria-label="إغلاق الشرح"
                className="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <article className="flex flex-col justify-between gap-3 rounded-xl border border-cyan-500/25 bg-cyan-500/[0.06] p-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <CalendarCheck
                  aria-hidden="true"
                  className="h-4 w-4 text-cyan-300"
                />
                تحدي اليوم
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {dailyDone
                  ? `أكملت تحدي اليوم بنتيجة ${dailyResult.correct}/${dailyResult.total}. عد غداً لتحافظ على السلسلة.`
                  : `${DAILY_SIZE} أسئلة مختارة من كل المستويات. نفس التحدي لكل التلاميذ اليوم.`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => startDailyChallenge()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-[0_0_18px_rgba(6,182,212,0.3)] transition-shadow hover:shadow-[0_0_26px_rgba(6,182,212,0.5)]"
            >
              {dailyDone ? (
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Play aria-hidden="true" className="h-4 w-4" />
              )}
              {dailyDone ? "أعد التحدي" : "ابدأ التحدي"}
            </button>
          </article>

          <article className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <ListChecks
                  aria-hidden="true"
                  className="h-4 w-4 text-purple-300"
                />
                راجع أخطاءك
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {mistakeCount > 0
                  ? `بنك أخطائك: ${mistakeCount}. تخرج الأسئلة منه عندما تجيب صحيحاً.`
                  : "لا توجد أخطاء محفوظة بعد. كل خطأ في أي اختبار سيُضاف هنا تلقائياً."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => startReview()}
              disabled={mistakeCount === 0}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold transition-colors",
                mistakeCount > 0
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-100 hover:bg-purple-500/20"
                  : "cursor-not-allowed border-white/5 bg-white/[0.02] text-zinc-600",
              )}
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              {mistakeCount > 0
                ? `راجع أخطاءك (${Math.min(mistakeCount, 20)})`
                : "لا أخطاء للمراجعة"}
            </button>
          </article>

          <article className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <Target aria-hidden="true" className="h-4 w-4 text-green-300" />
                {currentAttempt ? "اختبار غير مكتمل" : "التالي المقترح"}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {currentAttempt
                  ? `${currentAttempt.moduleTitle} — السؤال ${currentAttempt.currentIndex + 1} من ${currentAttempt.total}. تقدمك محفوظ.`
                  : `${recommended.title} — ${questionCountLabel("ar", recommended.quiz?.length ?? 0)}.`}
              </p>
            </div>

            {currentAttempt ? (
              <button
                type="button"
                onClick={() => scrollToId("play")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white"
              >
                متابعة الاختبار
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startModuleQuiz(recommended.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-500/25 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-100 transition-colors hover:bg-green-500/20"
              >
                <Play aria-hidden="true" className="h-4 w-4" />
                ابدأ الآن
              </button>
            )}
          </article>

          <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <Flame aria-hidden="true" className="h-4 w-4 text-yellow-300" />
              أرقامك
            </h3>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-black/20 p-2">
                <dt className="text-[10px] text-zinc-500">دقة</dt>
                <dd className="mt-1 text-sm font-bold text-white">
                  {accuracy}%
                </dd>
              </div>
              <div className="rounded-lg bg-black/20 p-2">
                <dt className="text-[10px] text-zinc-500">أجوبة</dt>
                <dd className="mt-1 text-sm font-bold text-white">
                  {totalAnswered}
                </dd>
              </div>
              <div className="rounded-lg bg-black/20 p-2">
                <dt className="text-[10px] text-zinc-500">محاور</dt>
                <dd className="mt-1 text-sm font-bold text-white">
                  {completedModules.length}
                </dd>
              </div>
            </dl>
            <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
              {TOTAL_QUESTIONS} سؤالاً · {TOTAL_MODULES} محاور · تُحفظ أرقامك
              على جهازك فقط.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
