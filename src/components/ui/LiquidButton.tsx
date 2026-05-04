"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

type LiquidButtonProps = React.ComponentProps<typeof motion.button> & {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "danger";
};

export function LiquidButton({ children, className, variant = "primary", ...props }: LiquidButtonProps) {
    const getGradient = () => {
        switch (variant) {
            case "primary": return "from-cyan-500 via-blue-500 to-purple-600";
            case "secondary": return "from-slate-700 via-slate-600 to-slate-500";
            case "danger": return "from-red-500 via-orange-500 to-yellow-500";
            default: return "from-cyan-500 via-blue-500 to-purple-600";
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative px-6 py-3 rounded-xl font-bold text-white overflow-hidden group",
                "shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]",
                "transition-shadow duration-300",
                className
            )}
            {...props}
        >
            <div className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-90 transition-opacity duration-300",
                getGradient()
            )} />

            {/* Liquid overlay effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[url('/noise.png')] mix-blend-overlay transition-opacity" />

            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
