"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronLeft } from "lucide-react";
import { LEVEL_COPY } from "@/i18n/content";
import { LEVELS } from "@/lib/curriculum";
import { useGameStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

/**
 * Every level is free and unlocked. Labels come from the shared locale copy so
 * the level map, the landing pages and the JSON-LD cannot drift apart.
 */
export function LevelMap() {
  const { currentLevel, setLevel } = useGameStore();
  const copy = LEVEL_COPY.ar;

  return (
    <div className="relative mx-auto flex w-full max-w-lg flex-col items-center gap-8 py-10">
      <div className="absolute bottom-12 left-8 top-12 hidden w-1 bg-gradient-to-b from-cyan-900/0 via-cyan-500/30 to-purple-900/0 sm:block" />

      {LEVELS.map((level, index) => {
        const isActive = currentLevel === level.id;

        return (
          <motion.button
            key={level.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setLevel(level.id)}
            aria-pressed={isActive}
            className={cn(
              "group relative flex w-full items-center justify-between overflow-hidden rounded-2xl p-6 transition-all",
              isActive
                ? "glass-panel border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                : "glass-panel border-white/5 hover:bg-white/5",
            )}
          >
            {isActive && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent" />
            )}

            <div className="relative z-10 flex items-center gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold shadow-lg transition-all",
                  isActive
                    ? "scale-110 bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    : "border border-slate-700 bg-slate-800 text-slate-400",
                )}
              >
                {index + 1}
              </div>
              <div className="text-right">
                <h3
                  className={cn(
                    "text-lg font-bold transition-colors",
                    isActive ? "text-cyan-300" : "text-slate-300",
                  )}
                >
                  {copy[level.id].title}
                </h3>
                <p className="text-sm text-slate-400">
                  {copy[level.id].description}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "relative z-10 transition-colors",
                isActive ? "text-cyan-400" : "text-slate-500",
              )}
            >
              {isActive ? (
                <BookOpen aria-hidden="true" className="h-6 w-6" />
              ) : (
                <ChevronLeft aria-hidden="true" className="h-6 w-6" />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
