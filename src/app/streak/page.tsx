"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getStreakData, getStreakEmoji, getStreakMessage, STREAK_MILESTONES, StreakData } from "@/lib/streaks";
import BottomNav from "@/components/BottomNav";
import GlassCard from "@/components/GlassCard";
import LoadingScreen from "@/components/LoadingScreen";
import { HiArrowLeft, HiFire } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function StreakPage() {
  const { couple, loading } = useAuth();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!couple?.id) return;
    getStreakData(couple.id).then(setStreak);
  }, [couple?.id]);

  if (loading || !couple) return <LoadingScreen />;

  const current = streak?.currentStreak || 0;
  const longest = streak?.longestStreak || 0;
  const milestones = streak?.milestones || [];

  // Generate last 30 days for heatmap
  const today = new Date();
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { date: d, key, active: streak?.history?.[key] || false };
  });

  return (
    <div className="min-h-screen bg-background pb-nav relative">
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      <motion.div
        className="relative z-10 px-5 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.push("/home")} className="p-2 -ml-2 rounded-xl hover:bg-surface-lighter">
            <HiArrowLeft className="text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Love Streak</h1>
        </div>

        {/* Main streak display */}
        <GlassCard className="text-center py-10 mb-6" hoverable={false} glow>
          <motion.div
            className="text-6xl mb-3"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {getStreakEmoji(current)}
          </motion.div>
          <motion.span
            className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-rose-primary to-romantic-purple bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {current}
          </motion.span>
          <p className="text-sm text-muted mt-2">day streak</p>
          <p className="text-xs text-foreground/60 mt-3 px-6">
            {getStreakMessage(current)}
          </p>
        </GlassCard>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <GlassCard hoverable={false} className="text-center py-4">
            <p className="text-2xl font-bold text-foreground">{current}</p>
            <p className="text-xs text-muted mt-1">Current</p>
          </GlassCard>
          <GlassCard hoverable={false} className="text-center py-4">
            <p className="text-2xl font-bold text-foreground">{longest}</p>
            <p className="text-xs text-muted mt-1">Longest</p>
          </GlassCard>
        </div>

        {/* 30-day heatmap */}
        <GlassCard hoverable={false} className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">Last 30 Days</p>
          <div className="grid grid-cols-10 gap-1.5">
            {last30.map((d) => (
              <motion.div
                key={d.key}
                className={`aspect-square rounded-md ${
                  d.active ? "bg-gradient-to-br from-rose-primary to-orange-500" : "bg-surface-lighter"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: Math.random() * 0.3 }}
                title={d.key}
              />
            ))}
          </div>
        </GlassCard>

        {/* Milestones */}
        <GlassCard hoverable={false} className="mb-8">
          <p className="text-sm font-semibold text-foreground mb-4">Milestones</p>
          <div className="space-y-3">
            {STREAK_MILESTONES.map((m) => {
              const earned = milestones.includes(m.label);
              return (
                <motion.div
                  key={m.label}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    earned ? "bg-rose-primary/5 border border-rose-primary/20" : "bg-surface-lighter/30 opacity-40"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: earned ? 1 : 0.4, x: 0 }}
                >
                  <span className="text-2xl">{earned ? "🏆" : "🔒"}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{m.label}</p>
                    <p className="text-xs text-muted">{m.days} days — {m.message}</p>
                  </div>
                  {earned && <span className="text-green-400 text-xs">Earned ✓</span>}
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      <BottomNav />
    </div>
  );
}
