"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";

interface LoveNoteCardProps {
  text: string;
  emoji: string;
  timestamp: Date;
  isMine: boolean;
  read: boolean;
  index?: number;
}

export default function LoveNoteCard({ text, emoji, timestamp, isMine, read, index = 0 }: LoveNoteCardProps) {
  return (
    <motion.div
      className="card-romantic p-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Decorative hearts */}
      <div className="absolute -top-2 -right-2 text-3xl opacity-10">{emoji}</div>
      <div className="absolute -bottom-1 -left-1 text-2xl opacity-5">💕</div>

      {/* Sender badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-3 py-1 rounded-full ${
          isMine ? "bg-rose-primary/10 text-rose-primary" : "bg-romantic-purple/10 text-lavender"
        }`}>
          {isMine ? "You sent" : "Received"} {emoji}
        </span>
        {!isMine && !read && (
          <span className="w-2 h-2 rounded-full bg-rose-primary animate-pulse-soft" />
        )}
      </div>

      {/* Note content */}
      <p className="text-foreground text-sm leading-relaxed">{text}</p>

      {/* Timestamp */}
      <p className="text-muted text-[11px] mt-3">
        {format(timestamp, "MMM d, yyyy · h:mm a")}
      </p>
    </motion.div>
  );
}
