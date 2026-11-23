"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuizTimer({
  timed,
  timeLeft,
  timeLimit,
}: {
  timed: boolean;
  timeLeft: number;
  timeLimit: number;
}) {
  if (!timed) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-200">
        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
        وضع الدراسة: بدون مؤقت وبدون مكافأة سرعة
      </div>
    );
  }

  const percent = Math.min(100, Math.round((timeLeft / timeLimit) * 100));

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">الوقت المتبقي</span>
        <span
          className={cn(
            "text-sm font-bold",
            timeLeft <= 3
              ? "text-red-400 animate-pulse"
              : timeLeft <= 5
                ? "text-yellow-400"
                : "text-cyan-400",
          )}
        >
          {timeLeft}ث
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="الوقت المتبقي"
        aria-valuemin={0}
        aria-valuemax={Math.max(timeLimit, timeLeft)}
        aria-valuenow={timeLeft}
        className="h-2 overflow-hidden rounded-full bg-gray-700"
      >
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.3 }}
          className={cn(
            "h-full rounded-full",
            timeLeft <= 3
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : timeLeft <= 5
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : "bg-gradient-to-r from-cyan-500 to-blue-500",
          )}
        />
      </div>
    </div>
  );
}
