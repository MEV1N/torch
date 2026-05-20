"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
  hoverable?: boolean;
}

export default function GlassCard({ children, className = "", onClick, glow = false, hoverable = true }: GlassCardProps) {
  return (
    <motion.div
      className={`glass rounded-2xl p-5 ${glow ? "glow-rose" : ""} ${hoverable ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.01, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
