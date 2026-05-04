"use client";

import { motion } from "framer-motion";
import { Lock, Unlock, BookOpen } from "lucide-react";
import { useGameStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const LEVELS = [
    { id: 'common-core', label: 'الجذع المشترك', description: 'نشأة الفلسفة' },
    { id: '1st-bac', label: 'الأولى باك', description: 'الإنسان والفاعلية' },
    { id: '2nd-bac', label: 'الثانية باك', description: 'الوضع البشري' },
] as const;

export function LevelMap() {
    const { currentLevel, setLevel, xp, completedQuizzes } = useGameStore();

    const hasCompleted = (moduleIds: string[]) =>
        completedQuizzes.some((quizId) => moduleIds.includes(quizId));

    return (
        <div className="flex flex-col items-center gap-8 py-10 w-full max-w-lg mx-auto relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-12 bottom-12 w-1 bg-gradient-to-b from-cyan-900/0 via-cyan-500/30 to-purple-900/0 hidden sm:block" />

            {LEVELS.map((level, index) => {
                const isActive = currentLevel === level.id;
                const isLocked =
                    level.id === '1st-bac'
                        ? xp < 5 && !hasCompleted(['intro-philosophy'])
                        : level.id === '2nd-bac'
                          ? xp < 10 && !hasCompleted(['humanity', 'effectiveness'])
                          : false;

                return (
                    <motion.button
                        key={level.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                        onClick={() => !isLocked && setLevel(level.id)}
                        className={cn(
                            "relative w-full p-6 rounded-2xl flex items-center justify-between transition-all group overflow-hidden",
                            isActive
                                ? "glass-panel border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                                : "glass-panel border-white/5 hover:bg-white/5",
                            isLocked && "opacity-50 grayscale cursor-not-allowed hover:bg-transparent"
                        )}
                        disabled={isLocked}
                    >
                        {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
                        )}

                        <div className="flex items-center gap-4 relative z-10">
                            <div className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-all",
                                isActive
                                    ? "bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-110"
                                    : "bg-slate-800 text-slate-400 border border-slate-700"
                            )}>
                                {index + 1}
                            </div>
                            <div className="text-right">
                                <h3 className={cn(
                                    "font-bold text-lg transition-colors",
                                    isActive ? "text-cyan-300" : "text-slate-300"
                                )}>{level.label}</h3>
                                <p className="text-sm text-slate-400">{level.description}</p>
                                {isLocked && (
                                    <p className="mt-1 text-xs text-cyan-300/80">
                                        أكمل المرحلة السابقة لفتح هذا المستوى
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={cn(
                            "transition-colors relative z-10",
                            isActive ? "text-cyan-400" : "text-slate-500"
                        )}>
                            {isLocked ? <Lock className="w-6 h-6" /> : isActive ? <BookOpen className="w-6 h-6" /> : <Unlock className="w-6 h-6 opacity-50" />}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
