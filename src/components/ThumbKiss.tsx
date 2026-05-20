"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ThumbKissProps {
  coupleId: string;
  userId: string;
  partnerId: string;
  isPartnerActive?: boolean;
}

export default function ThumbKissComponent({
  coupleId,
  userId,
  partnerId,
  isPartnerActive = false,
}: ThumbKissProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // When both press, show heart animation
  useEffect(() => {
    if (isPressed && isPartnerActive) {
      setShowHeart(true);
      const timer = setTimeout(() => setShowHeart(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isPressed, isPartnerActive]);

  return (
    <div className="relative flex flex-col items-center justify-center gap-8 py-12">
      {/* Thumb button */}
      <motion.div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        animate={isPressed ? { scale: 0.85 } : { scale: 1 }}
        className={`
          cursor-pointer p-8 rounded-full transition-all duration-200
          ${
            isPressed
              ? "bg-rose-primary/40 ring-2 ring-rose-primary"
              : "bg-rose-primary/20 hover:bg-rose-primary/30"
          }
        `}
      >
        <span className="text-6xl">👍</span>
      </motion.div>

      {/* Status */}
      <div className="text-center">
        <p className="text-muted text-sm mb-2">Hold to connect</p>
        <div className="flex justify-center gap-3">
          <motion.div
            animate={isPressed ? { scale: [1, 1.2, 1] } : {}}
            className={`
              w-3 h-3 rounded-full ${
                isPressed ? "bg-rose-primary" : "bg-white/20"
              }
            `}
          />
          <motion.div
            animate={isPartnerActive ? { scale: [1, 1.2, 1] } : {}}
            className={`
              w-3 h-3 rounded-full ${
                isPartnerActive ? "bg-romantic-pink" : "bg-white/20"
              }
            `}
          />
        </div>
      </div>

      {/* Heart animation */}
      {showHeart && (
        <motion.div
          initial={{ opacity: 1, scale: 0, y: 0 }}
          animate={{ opacity: 0, scale: 2, y: -100 }}
          transition={{ duration: 1 }}
          className="absolute text-5xl pointer-events-none"
        >
          💕
        </motion.div>
      )}

      {isPressed && isPartnerActive && (
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <p className="text-rose-primary font-bold">Connection made! 💋</p>
        </motion.div>
      )}
    </div>
  );
}
