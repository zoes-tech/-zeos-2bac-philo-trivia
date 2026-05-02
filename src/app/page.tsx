"use client";

import { LevelMap } from "@/components/LevelMap";
import { QuizCard } from "@/components/QuizCard";
import { PhilosopherProfile } from "@/components/PhilosopherProfile";
import { useGameStore } from "@/store/useStore";
import { useScoring, useScoreAnimation } from "@/contexts/ScoringProvider";
import commonCoreData from "@/data/curriculum/common-core.json";
import firstBacData from "@/data/curriculum/1st-bac.json";
import secondBacData from "@/data/curriculum/2nd-bac.json";
import secondBacKnowledgeData from "@/data/curriculum/2nd-bac-knowledge.json";
import secondBacMoralityData from "@/data/curriculum/2nd-bac-morality.json";
import { useState } from "react";
import { Trophy, ChevronRight, BarChart3, Flame, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import type { Module, Question, Philosopher } from "@/types";

export default function Home() {
  const { currentLevel, xp, unlockedPhilosophers, currentQuiz, startQuiz, answerQuiz, endQuiz } = useGameStore();
  const { score, currentStreak, highestStreak, multiplier, isGodMode, rank, rankEmoji } = useScoring();
  const displayScore = useScoreAnimation(score);
  const [viewingPhilosopher, setViewingPhilosopher] = useState<Philosopher | null>(null);

  const getDataForLevel = (): Module[] => {
    switch (currentLevel) {
      case 'common-core': return commonCoreData as Module[];
      case '1st-bac': return firstBacData as Module[];
      case '2nd-bac': return [...secondBacData, ...secondBacKnowledgeData, ...secondBacMoralityData] as Module[];

      default: return commonCoreData as Module[];
    }
  };

  const levelData = getDataForLevel();

  const calculateTimeLimit = (totalQuestions: number): number => {
    if (totalQuestions <= 10) return 10;
    if (totalQuestions <= 25) return 8;
    return 5;
  };

  const handleQuizStart = (module: Module) => {
    if (module.quiz && module.quiz.length > 0) {
      startQuiz(module.id, module.quiz);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    answerQuiz(isCorrect);
    // Auto next after delay instead of endQuiz
    setTimeout(() => {
      const store = useGameStore.getState();
      if (store.currentQuiz && store.currentQuiz.currentIndex < store.currentQuiz.total - 1) {
        useGameStore.getState().nextQuizQuestion();
      } else {
        endQuiz();
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen pb-20 px-4 max-w-md mx-auto relative overflow-hidden">
      <header className="flex justify-between items-center py-6 relative z-20">
        <div className="flex items-center gap-3">
          <GlassCard className="!p-2 flex items-center gap-2 !rounded-full">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-white">{displayScore}</span>
          </GlassCard>
          {currentStreak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold",
                currentStreak >= 10 ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50" :
                currentStreak >= 5 ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50" :
                currentStreak >= 3 ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50" :
                "bg-gray-700 text-gray-300"
              )}
            >
              <Flame className={cn("w-4 h-4", currentStreak >= 3 && "animate-pulse")} />
              <span>{currentStreak}</span>
            </motion.div>
          )}
          {multiplier > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
            >
              <Zap className="w-3 h-3" />
              <span>x{multiplier.toFixed(1)}</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>{rankEmoji}</span>
            <span className="hidden sm:inline">{rank}</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            رحلة الفيلسوف
          </h1>
        </div>
      </header>

      {currentQuiz ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-20 space-y-4 p-4">
          <div className="w-full text-center text-sm text-gray-400 mb-4">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>{currentQuiz.currentIndex + 1} / {currentQuiz.total}</span>
              <span>{Math.round((currentQuiz.score / currentQuiz.total * 100))}%</span>
            </div>
            <span className="text-xs opacity-75">({currentQuiz.questions[currentQuiz.currentIndex].category})</span>
          </div>
          <QuizCard
            question={currentQuiz.questions[currentQuiz.currentIndex]}
            onAnswer={handleAnswer}
            currentIndex={currentQuiz.currentIndex}
            total={currentQuiz.total}
            score={currentQuiz.score}
            category={currentQuiz.questions[currentQuiz.currentIndex].category || ''}
            timeLimit={calculateTimeLimit(currentQuiz.total)}
          />
          <LiquidButton onClick={() => {
            const store = useGameStore.getState();
            if (store.currentQuiz && store.currentQuiz.currentIndex < store.currentQuiz.total - 1) {
              useGameStore.getState().nextQuizQuestion();
            } else {
              endQuiz();
            }
          }} variant="secondary">
            التالي
          </LiquidButton>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
          <section>
            <h2 className="text-2xl font-bold font-serif mb-4 text-center text-white/90 drop-shadow-md">خريطة التعلم</h2>
            <LevelMap />
          </section>

          <section>
            <h2 className="text-xl font-bold font-serif mb-4 text-cyan-400">
              دروس {currentLevel === 'common-core' ? 'الجذع المشترك' : currentLevel === '1st-bac' ? 'الأولى باك' : 'الثانية باك'}
            </h2>
            <div className="space-y-4">
              {levelData.map((module) => (
                <GlassCard key={module.id} className="hover:border-cyan-500/30 transition-colors group" hoverEffect={true}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all duration-500" />
                  <h3 className="font-bold text-lg mb-2 text-cyan-300 group-hover:text-cyan-200 transition-colors">{module.title}</h3>
                  <p className="text-sm text-gray-300 mb-6 leading-relaxed">{module.description}</p>
                  {module.quiz && module.quiz.length > 0 && (
                    <LiquidButton
                      onClick={() => handleQuizStart(module)}
                      className="w-full relative overflow-hidden"
                      variant="primary"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>اختبار المعلومات ({module.quiz.length} سؤال)</span>
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </span>
                    </LiquidButton>
                  )}
                </GlassCard>
              ))}
            </div>
          </section>

          {unlockedPhilosophers.length > 0 && (
            <section>
              <h2 className="text-xl font-bold font-serif mb-4 text-purple-400">الفلاسفة المكتشفون</h2>
              <div className="grid grid-cols-2 gap-4">
                {[...(commonCoreData as Module[]), ...(firstBacData as Module[]), ...(secondBacData as Module[])]
                  .filter((m) => m.philosopher && unlockedPhilosophers.includes(m.philosopher!.id))
                  .map((m) => (
                    <motion.button
                      key={m.philosopher!.id}
                      onClick={() => setViewingPhilosopher(m.philosopher!)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group"
                    >
                      <GlassCard className="flex flex-col items-center !p-4 !rounded-xl group-hover:border-purple-500/50 transition-colors">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-3 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] transition-all">
                          <span className="font-bold text-xl text-white">{m.philosopher!.name[0]}</span>
                        </div>
                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{m.philosopher!.name}</h3>
                      </GlassCard>
                    </motion.button>
                  ))}
              </div>
            </section>
          )}
        </div>
      )}
      <AnimatePresence>
        {viewingPhilosopher && (
          <PhilosopherProfile
            philosopher={viewingPhilosopher}
            onClose={() => setViewingPhilosopher(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
