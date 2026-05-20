// =============================================
// Torch — Boop Button Component
// =============================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { sendBoop, getBoopCount } from "@/lib/boop";

interface BoopButtonProps {
  coupleId: string;
  userId: string;
  userName: string;
  partnerId: string;
  partnerName: string;
  onBoopSent?: () => void;
}

export default function BoopButton({
  coupleId,
  userId,
  userName,
  partnerId,
  partnerName,
  onBoopSent,
}: BoopButtonProps) {
  const [isBooping, setIsBooping] = useState(false);
  const [boopCount, setBoopCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);

  React.useEffect(() => {
    async function loadBoopCount() {
      const count = await getBoopCount(coupleId);
      setBoopCount(count);
    }
    loadBoopCount();
  }, [coupleId]);

  const handleBoop = async () => {
    if (isBooping) return;

    setIsBooping(true);

    // Create floating hearts
    const heartIds = Array.from({ length: 5 }, (_, i) => i);
    setFloatingHearts(heartIds);

    try {
      await sendBoop(coupleId, userId, userName, partnerId, "👆");
      setBoopCount((prev) => prev + 1);

      // Haptic feedback (if available)
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100]);
      }

      onBoopSent?.();
    } catch (error) {
      console.error("Boop failed:", error);
    }

    setTimeout(() => setIsBooping(false), 500);
    setTimeout(() => setFloatingHearts([]), 2000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-4">
      {/* Floating Hearts */}
      {floatingHearts.map((id) => (
        <motion.div
          key={id}
          className="absolute text-pink-400"
          animate={{
            y: -100,
            opacity: [1, 0],
            x: (Math.random() - 0.5) * 100,
          }}
          transition={{ duration: 1.5, delay: id * 0.05 }}
          initial={{ y: 0, opacity: 1 }}
        >
          💕
        </motion.div>
      ))}

      {/* Main Boop Button */}
      <motion.button
        onClick={handleBoop}
        disabled={isBooping}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg flex items-center justify-center text-5xl cursor-pointer disabled:opacity-50 transition-all"
      >
        {/* Pulse animation background */}
        <motion.div
          className="absolute inset-0 rounded-full bg-rose-300 opacity-0"
          animate={{
            scale: isBooping ? [1, 1.5, 1] : 1,
            opacity: isBooping ? [0.5, 0, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Button content */}
        <motion.span
          animate={isBooping ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          👆
        </motion.span>
      </motion.button>

      {/* Stats */}
      <div className="text-center">
        <p className="text-sm text-gray-400">Boop {partnerName}!</p>
        <p className="text-lg font-bold text-white">
          {boopCount}
          <span className="text-xs ml-1 text-gray-400">total boops</span>
        </p>
      </div>
    </div>
  );
}
