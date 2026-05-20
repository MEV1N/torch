"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      {/* Torch flame animation */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Flame */}
        <motion.div
          className="relative mb-2"
          animate={{ scaleY: [1, 1.1, 0.95, 1.05, 1], scaleX: [1, 0.95, 1.05, 0.98, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 rounded-full bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-500 via-yellow-400 to-white opacity-80 blur-sm" />
          </div>
          {/* Glow */}
          <div className="absolute -inset-4 rounded-full bg-orange-400/20 blur-xl" />
        </motion.div>

        {/* Candle body */}
        <div className="w-8 h-16 bg-gradient-to-b from-rose-100 to-rose-200 rounded-b-lg rounded-t-sm" />

        {/* App name */}
        <motion.h1
          className="mt-8 text-3xl font-bold bg-gradient-to-r from-rose-primary to-romantic-purple bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Candle
        </motion.h1>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-rose-primary"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
