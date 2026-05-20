"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface DaysCounterProps {
  startDate: Date;
  className?: string;
}

export default function DaysCounter({ startDate, className = "" }: DaysCounterProps) {
  const [days, setDays] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const diff = Math.floor((Date.now() - startDate.getTime()) / 86400000);
    setDays(Math.max(0, diff));

    // Trigger animation after mount
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [startDate]);

  return (
    <motion.div
      className={`flex flex-col items-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <motion.div
        className="relative"
        animate={animated ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Heart glow behind */}
        <div className="absolute -inset-4 bg-rose-primary/10 rounded-full blur-2xl" />

        <span className="relative text-5xl font-bold bg-gradient-to-r from-rose-primary via-rose-light to-romantic-purple bg-clip-text text-transparent">
          <AnimatedNumber value={days} />
        </span>
      </motion.div>
      <span className="text-sm text-muted mt-1">days together 💕</span>
    </motion.div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const duration = Math.min(1500, value * 10);
    const start = performance.now();
    const from = ref.current;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / Math.max(duration, 1), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (value - from) * eased);
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        ref.current = value;
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  return <>{display}</>;
}
