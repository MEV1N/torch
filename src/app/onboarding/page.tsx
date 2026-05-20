"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AnimatedButton from "@/components/AnimatedButton";

const slides = [
  {
    emoji: "🕯️",
    title: "Keep Your Love Glowing",
    subtitle: "Torch helps couples nurture their bond with daily rituals, shared memories, and intimate conversations.",
    gradient: "from-rose-primary/20 to-romantic-purple/10",
  },
  {
    emoji: "💕",
    title: "Daily Questions & Streaks",
    subtitle: "Answer romantic questions together, build your love streak, and discover new things about each other every day.",
    gradient: "from-romantic-purple/20 to-rose-primary/10",
  },
  {
    emoji: "✨",
    title: "Your Private Love Space",
    subtitle: "Share memories, send love notes, chat privately, and even feel each other's touch from anywhere in the world.",
    gradient: "from-rose-light/15 to-lavender/10",
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const next = () => {
    if (current === slides.length - 1) {
      router.push("/auth");
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const skip = () => router.push("/auth");

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background orbs */}
      <motion.div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[120px] bg-gradient-to-br ${slides[current].gradient}`}
        key={current}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Skip button */}
      <div className="flex justify-end p-6 relative z-10">
        <button onClick={skip} className="text-sm text-muted hover:text-foreground transition-colors">
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {/* Emoji illustration */}
            <motion.div
              className="text-8xl mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {slides[current].emoji}
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground mb-4 leading-tight">
              {slides[current].title}
            </h2>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              {slides[current].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="px-8 pb-12 relative z-10">
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full ${i === current ? "bg-rose-primary w-6" : "bg-surface-lighter w-2"}`}
              layout
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          ))}
        </div>

        <AnimatedButton onClick={next} fullWidth>
          {current === slides.length - 1 ? "Get Started ✨" : "Continue"}
        </AnimatedButton>
      </div>
    </div>
  );
}
