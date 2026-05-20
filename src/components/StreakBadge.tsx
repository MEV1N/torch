"use client";

import React from "react";
import { motion } from "framer-motion";

interface StreakBadgeProps {
  count: number;
  className?: string;
}

export default function StreakBadge({ count, className = "" }: StreakBadgeProps) {
  const getEmoji = (streak: number) => {
    if (streak >= 365) return "⭐";
    if (streak >= 200) return "🔥";
    if (streak >= 100) return "💯";
    if (streak >= 50) return "🌟";
    if (streak >= 30) return "🌙";
    if (streak >= 14) return "💞";
    if (streak >= 7) return "💕";
    if (streak >= 3) return "✨";
    return "🕯️";
  };

  const getColor = (streak: number) => {
    if (streak >= 365) return "from-yellow-400 to-yellow-600";
    if (streak >= 100) return "from-orange-400 to-red-600";
    if (streak >= 30) return "from-rose-400 to-pink-600";
    return "from-amber-400 to-orange-500";
  };

  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`
        flex flex-col items-center justify-center
        rounded-2xl p-4 bg-gradient-to-br ${getColor(count)}
        text-white font-bold shadow-lg
        ${className}
      `}
    >
      <span className="text-4xl mb-2">{getEmoji(count)}</span>
      <span className="text-3xl">{count}</span>
      <span className="text-xs mt-1">day streak</span>
    </motion.div>
  );
}
