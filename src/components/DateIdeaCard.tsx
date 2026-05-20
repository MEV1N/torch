// =============================================
// Torch — Date Idea Card Component
// =============================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DateIdea, completeeDateIdea, rateDateIdea } from "@/lib/dateIdeas";

interface DateIdeaCardProps {
  idea: DateIdea & { id: string };
  coupleId: string;
  onComplete?: (ideaId: string) => void;
  onRate?: (ideaId: string, rating: number) => void;
}

const DIFFICULTY_COLORS = {
  easy: "from-green-400 to-emerald-500",
  medium: "from-yellow-400 to-orange-500",
  hard: "from-red-400 to-rose-500",
};

const BUDGET_DISPLAY = {
  free: "🆓 Free",
  cheap: "💰 Cheap",
  $: "💵 Moderate",
  $$: "💵💵 Expensive",
  $$$: "💵💵💵 Very Expensive",
};

export default function DateIdeaCard({
  idea,
  coupleId,
  onComplete,
  onRate,
}: DateIdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const handleRate = async (rating: number) => {
    try {
      await rateDateIdea(coupleId, idea.id!, rating);
      onRate?.(idea.id!, rating);
      setShowRating(false);
    } catch (error) {
      console.error("Error rating date idea:", error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeeDateIdea(coupleId, idea.id!, idea.rating || 0);
      onComplete?.(idea.id!);
    } catch (error) {
      console.error("Error completing date idea:", error);
    }
  };

  const gradientClass =
    DIFFICULTY_COLORS[idea.difficulty as keyof typeof DIFFICULTY_COLORS] ||
    DIFFICULTY_COLORS.medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative p-4 rounded-2xl cursor-pointer border border-white/10 backdrop-blur-xl overflow-hidden group"
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-5`} />

        {/* Completed badge */}
        {idea.completedAt && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-green-500/30 text-green-300 text-xs font-bold">
            ✓ Done
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-2">
            <h3 className="font-bold text-white text-sm leading-tight">
              {idea.idea}
            </h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                {idea.category}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${gradientClass} text-white font-semibold`}
              >
                {idea.difficulty}
              </span>
              {idea.budget && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
                  {BUDGET_DISPLAY[idea.budget as keyof typeof BUDGET_DISPLAY]}
                </span>
              )}
            </div>
          </div>

          {/* Expandable details */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 space-y-3 border-t border-white/10 pt-3"
            >
              {/* Description */}
              {idea.description && (
                <p className="text-xs text-gray-400">{idea.description}</p>
              )}

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating section */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">Rating:</span>
                {!showRating ? (
                  <motion.button
                    onClick={() => setShowRating(true)}
                    className="text-sm text-yellow-300 hover:text-yellow-200"
                  >
                    {idea.rating ? "⭐".repeat(idea.rating) : "Rate this"}
                  </motion.button>
                ) : (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleRate(star)}
                        className={`text-sm cursor-pointer transition-colors ${
                          star <= (idea.rating || 0)
                            ? "text-yellow-300"
                            : "text-gray-500"
                        }`}
                      >
                        ⭐
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action button */}
              {!idea.completedAt && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComplete();
                  }}
                  className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-sm hover:shadow-lg transition-shadow"
                >
                  Go on this date! 🎉
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Expand indicator */}
          <p className="text-xs text-gray-400 mt-2">
            {isExpanded ? "Show less ▲" : "Show more ▼"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
