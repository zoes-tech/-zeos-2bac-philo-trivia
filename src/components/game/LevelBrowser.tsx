"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { LevelMap } from "@/components/LevelMap";
import { PhilosopherProfile } from "@/components/PhilosopherProfile";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { getLevelCopy } from "@/i18n/curriculum-copy";
import { ALL_MODULES, MODULES_BY_LEVEL } from "@/lib/curriculum";
import { useGameStore } from "@/store/useStore";
import type { Philosopher } from "@/types";

export function LevelBrowser() {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const unlockedPhilosophers = useGameStore(
    (state) => state.unlockedPhilosophers,
  );
  const startModuleQuiz = useGameStore((state) => state.startModuleQuiz);
  const [viewingPhilosopher, setViewingPhilosopher] =
    useState<Philosopher | null>(null);

  const levelCopy = getLevelCopy("ar", currentLevel);
  const modules = MODULES_BY_LEVEL[currentLevel];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-center font-serif text-2xl font-bold text-white/90 drop-shadow-md">
          خريطة التعلم
        </h2>
        <LevelMap />
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl font-bold text-cyan-400">
          دروس {levelCopy.title}
        </h2>

        <div className="space-y-4">
          {modules.map((module) => (
            <GlassCard
              key={module.id}
              className="group transition-colors hover:border-cyan-500/30"
              hoverEffect
            >
              <div className="absolute right-0 top-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
              <h3 className="mb-2 text-lg font-bold text-cyan-300 transition-colors group-hover:text-cyan-200">
                {module.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-300">
                {module.description}
              </p>
              {module.quiz?.length ? (
                <LiquidButton
                  onClick={() => startModuleQuiz(module.id)}
                  className="relative w-full overflow-hidden"
                  variant="primary"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>اختبار المعلومات ({module.quiz.length} سؤال)</span>
                    <ChevronRight
                      aria-hidden="true"
                      className="h-4 w-4 rotate-180"
                    />
                  </span>
                </LiquidButton>
              ) : null}
            </GlassCard>
          ))}
        </div>
      </section>

      {unlockedPhilosophers.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-xl font-bold text-purple-400">
            الفلاسفة المكتشفون
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {ALL_MODULES.filter(
              (module) =>
                module.philosopher &&
                unlockedPhilosophers.includes(module.philosopher.id),
            ).map((module) => (
              <motion.button
                key={module.philosopher!.id}
                onClick={() => setViewingPhilosopher(module.philosopher!)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative rounded-xl"
              >
                <GlassCard className="!rounded-xl !p-4 transition-colors group-hover:border-purple-500/50">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all group-hover:shadow-[0_0_25px_rgba(139,92,246,0.8)]">
                      <span className="text-xl font-bold text-white">
                        {module.philosopher!.name[0]}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-200 transition-colors group-hover:text-white">
                      {module.philosopher!.name}
                    </h3>
                  </div>
                </GlassCard>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {viewingPhilosopher && (
          <PhilosopherProfile
            philosopher={viewingPhilosopher}
            onClose={() => setViewingPhilosopher(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
