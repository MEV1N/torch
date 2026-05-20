"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

interface LoveNoteProps {
  from: string;
  text: string;
  timestamp?: Date;
  isNew?: boolean;
}

export default function LoveNoteCardComponent({
  from,
  text,
  timestamp,
  isNew = false,
}: LoveNoteProps) {
  const formatTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="relative overflow-hidden">
        {isNew && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            className="absolute top-4 right-4 w-3 h-3 bg-rose-primary rounded-full"
          />
        )}

        <motion.div
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-4xl mb-3"
        >
          💌
        </motion.div>

        <p className="text-sm text-muted mb-4">From {from}</p>
        <p className="text-foreground leading-relaxed mb-4">{text}</p>

        {timestamp && (
          <p className="text-xs text-muted">{formatTime(timestamp)}</p>
        )}
      </GlassCard>
    </motion.div>
  );
}
