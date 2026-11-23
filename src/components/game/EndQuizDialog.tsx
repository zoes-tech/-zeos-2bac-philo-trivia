"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

export function EndQuizDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="end-quiz-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm"
          >
            <GlassCard className="!p-6 border-red-500/20">
              <h2
                id="end-quiz-title"
                className="font-serif text-xl font-bold text-white"
              >
                إنهاء الاختبار؟
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                ستظهر نتيجتك بناءً على الأسئلة التي أجبت عنها. يبقى تقدمك محفوظاً
                ويمكنك العودة لاحقاً من لوحتك.
              </p>
              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  onClick={onConfirm}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2.5 text-sm font-bold text-white"
                >
                  إنهاء وعرض النتيجة
                </button>
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={onCancel}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-zinc-200 transition-colors hover:bg-white/10"
                >
                  متابعة الاختبار
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
