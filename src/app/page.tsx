"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { firebaseUser, userProfile, loading } = useAuth();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => {
        if (firebaseUser && userProfile) {
          if (userProfile.coupleId) {
            router.replace("/home");
          } else {
            router.replace("/pair");
          }
        } else {
          router.replace("/onboarding");
        }
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [loading, firebaseUser, userProfile, router]);

  if (!mounted) {
    return <div className="fixed inset-0 bg-[#0a0a0f]" />;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Ambient background glow */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-primary/8 rounded-full blur-[100px] animate-pulse-soft" />
            <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-romantic-purple/6 rounded-full blur-[80px] animate-pulse-soft" />
          </div>

          {/* Torch animation */}
          <div className="relative z-10 flex flex-col items-center animate-fade-in">
            {/* Flame */}
            <motion.div
              className="relative mb-1"
              animate={{
                scaleY: [1, 1.12, 0.94, 1.06, 1],
                scaleX: [1, 0.94, 1.06, 0.97, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-8 h-14 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-500 via-yellow-400 to-white opacity-90 blur-[2px]" />
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-6 rounded-full bg-gradient-to-t from-orange-300 to-white opacity-80" />
              </div>
              <div className="absolute -inset-6 rounded-full bg-orange-400/15 blur-2xl" />
              <div className="absolute -inset-10 rounded-full bg-amber-400/8 blur-3xl" />
            </motion.div>

            {/* Candle body */}
            <div className="w-10 h-20 bg-gradient-to-b from-rose-100 via-rose-50 to-rose-100 rounded-b-xl rounded-t-sm relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-gray-600 rounded-full" />
              <div className="absolute top-2 -right-0.5 w-2 h-4 bg-rose-100 rounded-full" />
            </div>

            {/* App name */}
            <div className="mt-10 text-center animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-light via-rose-primary to-romantic-purple bg-clip-text text-transparent">
                Candle
              </h1>
              <p className="text-muted text-sm mt-2 tracking-wide opacity-0 animate-fade-in" style={{ animationDelay: "1s" }}>
                Keep your love glowing
              </p>
            </div>

            {/* Loading shimmer */}
            <div className="mt-10 w-16 h-0.5 rounded-full overflow-hidden bg-surface-light opacity-0 animate-fade-in" style={{ animationDelay: "1.2s" }}>
              <motion.div
                className="h-full w-8 rounded-full bg-gradient-to-r from-rose-primary to-romantic-purple"
                animate={{ x: [-32, 64, -32] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
