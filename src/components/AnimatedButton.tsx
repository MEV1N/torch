"use client";

import { motion } from "framer-motion";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  type = "button",
  fullWidth = false,
}: AnimatedButtonProps) {
  const base = "relative overflow-hidden font-semibold text-base rounded-2xl transition-all duration-300 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-gradient-to-r from-rose-primary to-rose-dark text-white px-7 py-3.5 shadow-lg shadow-rose-glow/20",
    secondary: "glass text-foreground px-7 py-3.5 hover:border-rose-primary/30",
    ghost: "bg-transparent text-rose-primary px-4 py-2 hover:bg-rose-primary/10",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Shimmer effect */}
      {variant === "primary" && !disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-200%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
