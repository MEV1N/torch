"use client";

import { motion } from "framer-motion";

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function EmptyState({ emoji, title, subtitle, action }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        className="text-6xl mb-4"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {emoji}
      </motion.span>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-xs">{subtitle}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
