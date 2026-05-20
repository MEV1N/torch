"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

interface QuestionCardProps {
  question: string;
  category: "deep" | "fun" | "romantic" | "nostalgic" | "spicy" | "dream";
  hasAnswered?: boolean;
  partnerAnswered?: boolean;
  onAnswer?: () => void;
  onReveal?: () => void;
}

const categoryColors = {
  deep: "text-violet-400",
  fun: "text-amber-400",
  romantic: "text-rose-400",
  nostalgic: "text-blue-400",
  spicy: "text-red-400",
  dream: "text-cyan-400",
};

export default function QuestionCard({
  question,
  category,
  hasAnswered = false,
  partnerAnswered = false,
  onAnswer,
  onReveal,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard>
        <div className="mb-4">
          <span
            className={`
              inline-block px-3 py-1 rounded-full text-xs font-medium
              bg-white/10 ${categoryColors[category]}
            `}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-6 leading-tight">
          {question}
        </h3>

        <div className="flex gap-3 mt-6">
          {!hasAnswered && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAnswer}
              className="flex-1 bg-rose-primary/30 text-rose-primary hover:bg-rose-primary/40 rounded-2xl py-3 font-medium transition-all"
            >
              Your Answer
            </motion.button>
          )}

          {hasAnswered && partnerAnswered && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReveal}
              className="flex-1 bg-romantic-purple/30 text-romantic-purple hover:bg-romantic-purple/40 rounded-2xl py-3 font-medium transition-all"
            >
              Reveal Partner's Answer
            </motion.button>
          )}

          {hasAnswered && !partnerAnswered && (
            <div className="flex-1 bg-white/10 text-muted rounded-2xl py-3 font-medium text-center">
              Waiting for partner...
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          {hasAnswered && (
            <div className="flex-1 text-center py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">
              ✓ You answered
            </div>
          )}
          {partnerAnswered && (
            <div className="flex-1 text-center py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm">
              ✓ Partner answered
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
