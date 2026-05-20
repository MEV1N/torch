// =============================================
// Torch — Milestone Card Component
// =============================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Milestone, calculateDaysUntil, getMilestoneMessage } from "@/lib/milestones";

interface MilestoneCardProps {
  milestone: Milestone & { id: string };
  coupleId: string;
  onComplete?: (milestoneId: string) => void;
  onClick?: () => void;
}

export default function MilestoneCard({
  milestone,
  coupleId,
  onComplete,
  onClick,
}: MilestoneCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const daysUntil = milestone.isCompleted
    ? 0
    : calculateDaysUntil(milestone.date.toDate());
  const message = getMilestoneMessage(milestone);
  const progressPercent =
    daysUntil <= 0 ? 100 : Math.max(0, (1 - daysUntil / 365) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={onClick}
      className="relative p-4 rounded-2xl cursor-pointer border border-white/10 backdrop-blur-xl overflow-hidden group"
    >
      {/* Background gradient based on importance */}
      <div
        className={`absolute inset-0 ${
          milestone.importance === "high"
            ? "bg-gradient-to-br from-red-500/10 to-rose-500/10"
            : milestone.importance === "medium"
            ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
            : "bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
        }`}
      />

      {/* Completion indicator */}
      {milestone.isCompleted && (
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-bl-2xl flex items-center justify-center text-xl">
          ✓
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{milestone.emoji}</span>
            <div>
              <h3 className="font-bold text-white text-sm">{milestone.title}</h3>
              <p className="text-xs text-gray-400">{milestone.type}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-white/80 mb-3 font-medium">{message}</p>

        {/* Description if available */}
        {milestone.description && (
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">
            {milestone.description}
          </p>
        )}

        {/* Progress bar */}
        <div className="mb-3">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              layoutId={`progress-${milestone.id}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, progressPercent)}%` }}
              transition={{ duration: 0.6 }}
              className={`h-full ${
                milestone.isCompleted
                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                  : daysUntil <= 7
                  ? "bg-gradient-to-r from-red-400 to-rose-500"
                  : "bg-gradient-to-r from-purple-400 to-pink-500"
              }`}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span className="font-mono">
            {milestone.isCompleted
              ? "✓ Completed"
              : `${daysUntil} days away`}
          </span>
          {milestone.importance === "high" && (
            <span className="text-red-400 font-bold">★ Important</span>
          )}
        </div>

        {/* Action button */}
        {!milestone.isCompleted && isHovering && onComplete && (
          <motion.button
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onComplete(milestone.id!);
            }}
            className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold text-sm hover:shadow-lg transition-shadow"
          >
            Mark as Complete 🎉
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
