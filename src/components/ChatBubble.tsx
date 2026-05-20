"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";

interface ChatBubbleProps {
  text: string;
  isMine: boolean;
  timestamp: Date;
  read?: boolean;
  index?: number;
}

export default function ChatBubble({ text, isMine, timestamp, read, index = 0 }: ChatBubbleProps) {
  return (
    <motion.div
      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2 px-1`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
    >
      <div
        className={`max-w-[78%] px-4 py-2.5 ${
          isMine
            ? "bg-gradient-to-br from-rose-primary to-rose-dark text-white rounded-2xl rounded-br-md"
            : "glass text-foreground rounded-2xl rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{text}</p>
        <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] opacity-60">
            {format(timestamp, "h:mm a")}
          </span>
          {isMine && (
            <span className="text-[10px] opacity-60">
              {read ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      className="flex justify-start mb-2 px-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="glass rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-rose-primary/60"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="h-px bg-border flex-1" />
      <span className="px-3 text-xs text-muted">{date}</span>
      <div className="h-px bg-border flex-1" />
    </div>
  );
}
