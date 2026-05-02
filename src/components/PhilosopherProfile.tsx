"use client";

import { motion } from "framer-motion";
import { X, Quote, User } from "lucide-react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Philosopher } from "@/types";

interface PhilosopherProfileProps {
    philosopher: Philosopher;
    onClose: () => void;
}

export function PhilosopherProfile({ philosopher, onClose }: PhilosopherProfileProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <GlassCard className="!p-0 overflow-hidden border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
                    {/* Header Image/Banner */}
                    <div className="relative h-40 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

                        <div className="relative z-10 w-24 h-24 rounded-full p-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                <User className="w-12 h-12 text-purple-300" />
                                {/* Image would go here */}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 left-4 p-2 bg-black/40 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="text-center -mt-4 mb-6 relative z-10">
                            <div className="inline-block px-4 py-1.5 bg-purple-600/50 backdrop-blur-md border border-purple-500/30 text-purple-100 text-xs font-bold rounded-full shadow-lg mb-3">
                                {philosopher.era}
                            </div>
                            <h2 className="text-3xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 drop-shadow-sm">
                                {philosopher.name}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="glass-panel p-5 rounded-xl border border-yellow-500/20 bg-yellow-900/10 relative">
                                <Quote className="w-8 h-8 text-yellow-500/40 absolute -top-3 -right-2 transform rotate-12" />
                                <p className="text-lg font-serif text-center italic leading-relaxed text-yellow-100/90 text-shadow-sm">
                                    &quot;{philosopher.quote}&quot;
                                </p>
                            </div>

                            <div className="prose prose-sm prose-invert rtl:text-right text-gray-300 leading-relaxed max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                                <p>{philosopher.bio}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <LiquidButton
                                onClick={onClose}
                                className="w-full"
                                variant="secondary"
                            >
                                إغلاق
                            </LiquidButton>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
}
