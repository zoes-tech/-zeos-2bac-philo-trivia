"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnswerOptions({
  options,
  selectedOption,
  correctIndex,
  isSubmitted,
  onSelect,
}: {
  options: string[];
  selectedOption: number | null;
  correctIndex: number;
  isSubmitted: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        let optionClass =
          "glass-button bg-white/5 border-white/10 text-gray-200 hover:bg-white/10";

        if (selectedOption === index && !isSubmitted) {
          optionClass =
            "bg-cyan-500/20 border-cyan-500 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
        }

        if (isSubmitted) {
          if (index === correctIndex) {
            optionClass =
              "bg-green-500/20 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
          } else if (index === selectedOption) {
            optionClass = "bg-red-500/20 border-red-500 text-red-100";
          } else {
            optionClass = "opacity-40 cursor-default";
          }
        }

        return (
          <motion.button
            key={index}
            whileTap={!isSubmitted ? { scale: 0.98 } : {}}
            onClick={() => onSelect(index)}
            aria-pressed={selectedOption === index}
            className={cn(
              "relative w-full overflow-hidden rounded-xl border p-4 text-right font-medium transition-all",
              optionClass,
              isSubmitted && "cursor-default",
            )}
            disabled={isSubmitted}
          >
            <div className="relative z-10 flex items-center justify-between">
              <span>{option}</span>
              {isSubmitted && index === correctIndex && (
                <Check aria-hidden="true" className="ml-2 h-5 w-5 text-green-400" />
              )}
              {isSubmitted && index === selectedOption && index !== correctIndex && (
                <X aria-hidden="true" className="ml-2 h-5 w-5 text-red-400" />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
