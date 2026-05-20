"use client";

import React from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function AnimatedButton({
  children,
  onClick,
  className = "",
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
}: Props) {
  const variants = {
    primary: "bg-gradient-to-r from-rose-primary to-romantic-pink text-white shadow-lg shadow-rose-primary/30",
    secondary: "bg-romantic-purple/20 text-romantic-purple hover:bg-romantic-purple/30",
    ghost: "text-rose-primary hover:bg-white/5",
    outline: "border border-rose-primary/50 text-rose-primary hover:bg-rose-primary/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        rounded-2xl font-medium transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        {children}
      </div>
    </motion.button>
  );
}
