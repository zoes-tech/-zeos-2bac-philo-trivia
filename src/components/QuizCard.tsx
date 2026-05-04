"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Flame, Zap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { shuffleArray } from "@/lib/utils";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Question } from "@/types";
import { useScoring, useScoreAnimation, useStreakAnimation } from "@/contexts/ScoringProvider";

interface QuizCardProps {
    question: Question;
    onAnswer: (isCorrect: boolean) => void;
    currentIndex?: number;
    total?: number;
    score?: number;
    category?: string;
    timeLimit?: number;
}

export function QuizCard({ question, onAnswer, currentIndex, total, score, category, timeLimit = 8 }: QuizCardProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const shuffledOptions = useMemo(() => shuffleArray(question.options), [question]);
    const shuffledCorrectIndex = useMemo(
        () => shuffledOptions.findIndex((option) => option === question.options[question.correctAnswer]),
        [question, shuffledOptions]
    );
    const [questionStartTime, setQuestionStartTime] = useState<number>(() => Date.now());
    const [earnedPoints, setEarnedPoints] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

    const { submitAnswer, currentStreak, multiplier, isGodMode, rank, rankEmoji } = useScoring();
    const displayScore = useScoreAnimation(score || 0);
    const { displayStreak, isPopping } = useStreakAnimation(currentStreak);

    useEffect(() => {
        const resetQuestionState = window.setTimeout(() => {
            setSelectedOption(null);
            setIsSubmitted(false);
            setQuestionStartTime(Date.now());
            setEarnedPoints(0);
            setTimeLeft(timeLimit);
            setIsTimeUp(false);
        }, 0);

        return () => window.clearTimeout(resetQuestionState);
    }, [question, timeLimit]);

    useEffect(() => {
        if (isSubmitted || isTimeUp) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsTimeUp(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitted, isTimeUp]);

    useEffect(() => {
        if (isTimeUp && !isSubmitted) {
            const submitTimeout = window.setTimeout(() => {
                const isCorrect = selectedOption === shuffledCorrectIndex;
                submitAnswer(false, timeLimit);
                onAnswer(isCorrect);
                setIsSubmitted(true);
            }, 0);
            const resetTimeout = window.setTimeout(() => {
                setIsSubmitted(false);
                setSelectedOption(null);
            }, 1500);

            return () => {
                window.clearTimeout(submitTimeout);
                window.clearTimeout(resetTimeout);
            };
        }
    }, [isTimeUp, isSubmitted, selectedOption, shuffledCorrectIndex, submitAnswer, onAnswer, timeLimit]);

    const handleSelect = (index: number) => {
        if (isSubmitted || isTimeUp) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (isSubmitted || isTimeUp || selectedOption === null) return;

        const timeTaken = (Date.now() - questionStartTime) / 1000;
        const isCorrect = selectedOption === shuffledCorrectIndex;

        if (isCorrect) {
            const breakdown = submitAnswer(true, timeTaken);
            setEarnedPoints(breakdown.totalPoints);
            setTimeLeft((prev) => prev + 3);
        } else {
            setEarnedPoints(0);
            submitAnswer(false, timeTaken);
        }

        setIsSubmitted(true);
        onAnswer(isCorrect);

        setTimeout(() => {
            setIsSubmitted(false);
            setSelectedOption(null);
        }, 1500);
    };

    return (
        <GlassCard
            className="w-full max-w-md mx-auto !p-8 border-cyan-500/20"
            hoverEffect={false}
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {currentIndex !== undefined && total !== undefined && (
                    <div className="text-center mb-4 text-sm text-gray-400">
                        س {currentIndex + 1} / {total} | {category} | الإجابات الصحيحة: {displayScore}
                    </div>
                )}

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={isPopping ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold",
                                currentStreak >= 10 ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50" :
                                currentStreak >= 5 ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50" :
                                currentStreak >= 3 ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50" :
                                "bg-gray-700 text-gray-300"
                            )}
                        >
                            <Flame className={cn("w-4 h-4", currentStreak >= 3 && "animate-pulse")} />
                            <span>{displayStreak}</span>
                        </motion.div>
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
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Trophy className="w-3 h-3" />
                        <span>{rankEmoji} {rank}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400">الوقت المتبقي</span>
                        <span className={cn(
                            "text-sm font-bold",
                            timeLeft <= 3 ? "text-red-400 animate-pulse" :
                            timeLeft <= 5 ? "text-yellow-400" :
                            "text-cyan-400"
                        )}>
                            {timeLeft}ث
                        </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: `${(timeLeft / timeLimit) * 100}%` }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "h-full rounded-full",
                                timeLeft <= 3 ? "bg-gradient-to-r from-red-500 to-red-600" :
                                timeLeft <= 5 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                                "bg-gradient-to-r from-cyan-500 to-blue-500"
                            )}
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {isGodMode && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-4 text-center"
                        >
                            <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold shadow-lg shadow-purple-500/50">
                                🔥 نمط الحكيم مفعل! 🔥
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <h3 className="text-xl font-bold mb-8 text-center leading-relaxed text-white drop-shadow-md">
                    {question.question}
                </h3>

                <div className="space-y-4">
                    {shuffledOptions.map((option, index) => {
                        let optionClass = "glass-button bg-white/5 border-white/10 text-gray-200 hover:bg-white/10";

                        if (selectedOption === index && !isSubmitted) {
                            optionClass = "bg-cyan-500/20 border-cyan-500 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
                        }

                        if (isSubmitted) {
                            if (index === shuffledCorrectIndex) {
                                optionClass = "bg-green-500/20 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                            } else if (index === selectedOption && index !== shuffledCorrectIndex) {
                                optionClass = "bg-red-500/20 border-red-500 text-red-100";
                            } else {
                                optionClass = "opacity-40 cursor-default";
                            }
                        }

                        return (
                            <motion.button
                                key={index}
                                whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                                onClick={() => handleSelect(index)}
                                className={cn(
                                    "w-full p-4 rounded-xl text-right transition-all relative overflow-hidden font-medium border",
                                    optionClass,
                                    isSubmitted && "cursor-default"
                                )}
                                disabled={isSubmitted}
                            >
                                <div className="flex justify-between items-center relative z-10">
                                    <span>{option}</span>
                                    {isSubmitted && index === shuffledCorrectIndex && (
                                        <Check className="w-5 h-5 ml-2 text-green-400" />
                                    )}
                                    {isSubmitted && index === selectedOption && index !== shuffledCorrectIndex && (
                                        <X className="w-5 h-5 ml-2 text-red-400" />
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-center">
                    <LiquidButton
                        onClick={handleSubmit}
                        disabled={selectedOption === null || isSubmitted}
                        className={cn(
                            "w-full",
                            (selectedOption === null || isSubmitted) && "opacity-50 grayscale cursor-not-allowed"
                        )}
                        variant="primary"
                    >
                        {isSubmitted ? "النتيجة..." : "تأكيد الإجابة"}
                    </LiquidButton>
                </div>

                <AnimatePresence>
                    {isSubmitted && earnedPoints > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-4 text-center"
                        >
                            <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold shadow-lg shadow-green-500/50">
                                +{earnedPoints} نقطة!
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isTimeUp && !isSubmitted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-4 text-center"
                        >
                            <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold shadow-lg shadow-red-500/50">
                                ⏰ انتهى الوقت!
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </GlassCard>
    );
}
