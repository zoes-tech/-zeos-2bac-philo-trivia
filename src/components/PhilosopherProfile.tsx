"use client";

import { useId, useRef } from "react";
import { useDialog } from "@/hooks/use-dialog";
import { motion } from "framer-motion";
import { X, Quote, User } from "lucide-react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Philosopher } from "@/types";

interface PhilosopherProfileProps {
  philosopher: Philosopher;
  onClose: () => void;
}

export function PhilosopherProfile({
  philosopher,
  onClose,
}: PhilosopherProfileProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialog(true, onClose, closeRef);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        <GlassCard className="!overflow-hidden !p-0 border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
          <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
            <div className="relative z-10 h-24 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 p-[2px] shadow-[0_0_30px_rgba(139,92,246,0.6)]">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-black">
                <User aria-hidden="true" className="h-12 w-12 text-purple-300" />
              </div>
            </div>

            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="relative z-10 -mt-4 mb-6 text-center">
              <div className="mb-3 inline-block rounded-full border border-purple-500/30 bg-purple-600/50 px-4 py-1.5 text-xs font-bold text-purple-100 shadow-lg backdrop-blur-md">
                {philosopher.era}
              </div>
              <h2
                id={titleId}
                className="bg-gradient-to-r from-white to-purple-200 bg-clip-text font-serif text-3xl font-bold text-transparent drop-shadow-sm"
              >
                {philosopher.name}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="glass-panel relative rounded-xl border border-yellow-500/20 bg-yellow-900/10 p-5">
                <Quote
                  aria-hidden="true"
                  className="absolute -right-2 -top-3 h-8 w-8 rotate-12 text-yellow-500/40"
                />
                <p className="text-center font-serif text-lg italic leading-relaxed text-yellow-100/90">
                  &quot;{philosopher.quote}&quot;
                </p>
              </div>

              <div className="max-h-[30vh] overflow-y-auto pr-2 text-sm leading-relaxed text-gray-300">
                <p>{philosopher.bio}</p>
              </div>
            </div>

            <div className="mt-8">
              <LiquidButton onClick={onClose} className="w-full" variant="secondary">
                إغلاق
              </LiquidButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
