"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getGreeting } from "@/lib/notifications";
import { getRandomQuote } from "@/lib/questions";
import { getStreakEmoji, getStreakMessage } from "@/lib/streaks";
import { MOODS } from "@/lib/types";
import BottomNav from "@/components/BottomNav";
import DaysCounter from "@/components/DaysCounter";
import GlassCard from "@/components/GlassCard";
import Avatar from "@/components/Avatar";
import LoadingScreen from "@/components/LoadingScreen";
import { HiChat, HiHeart, HiPhotograph, HiPencil, HiSparkles, HiFire } from "react-icons/hi";
import { BsEnvelopeHeartFill } from "react-icons/bs";

export default function HomePage() {
  const { userProfile, partner, couple, loading } = useAuth();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState("");

  useEffect(() => {
    if (!loading && !couple) router.replace("/pair");
  }, [couple, loading, router]);

  useEffect(() => {
    if (userProfile?.mood) setSelectedMood(userProfile.mood);
  }, [userProfile]);

  if (loading || !userProfile || !couple) return <LoadingScreen />;

  const startDate = couple.startDate?.toDate?.() || new Date();
  const greeting = getGreeting(userProfile.displayName.split(" ")[0]);
  const quote = getRandomQuote();

  const handleMood = async (emoji: string) => {
    setSelectedMood(emoji);
    await updateDoc(doc(db, "users", userProfile.uid), { mood: emoji });
  };

  const quickActions = [
    { icon: HiHeart, label: "Daily Q", path: "/question", color: "from-rose-primary to-rose-dark" },
    { icon: HiChat, label: "Chat", path: "/chat", color: "from-purple-soft to-romantic-purple" },
    { icon: HiPhotograph, label: "Memories", path: "/memories", color: "from-pink-500 to-rose-primary" },
    { icon: BsEnvelopeHeartFill, label: "Love Note", path: "/notes", color: "from-amber-500 to-orange-500" },
    { icon: HiSparkles, label: "Thumb Kiss", path: "/thumbkiss", color: "from-lavender to-romantic-purple" },
    { icon: HiFire, label: "Streaks", path: "/streak", color: "from-orange-500 to-red-500" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background pb-nav relative">
      {/* Ambient background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      <motion.div
        className="relative z-10 px-5 pt-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-6" variants={item}>
          <div>
            <h1 className="text-xl font-bold text-foreground">{greeting}</h1>
            <p className="text-muted text-xs mt-0.5">Keep your love glowing 🕯️</p>
          </div>
          <div className="flex items-center gap-2">
            {partner && (
              <Avatar
                src={partner.photoURL}
                name={partner.displayName}
                size="sm"
                glow
              />
            )}
            <Avatar
              src={userProfile.photoURL}
              name={userProfile.displayName}
              size="sm"
              glow
            />
          </div>
        </motion.div>

        {/* Days Counter */}
        <motion.div variants={item}>
          <GlassCard className="text-center py-8 mb-5" hoverable={false} glow>
            <DaysCounter startDate={startDate} />
            {partner && (
              <motion.div
                className="flex items-center justify-center gap-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-xs text-muted">with</span>
                <span className="text-sm font-medium text-rose-light">{partner.displayName}</span>
                <span className="text-xs">{partner.mood || "💕"}</span>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        {/* Mood selector */}
        <motion.div variants={item} className="mb-5">
          <p className="text-xs text-muted mb-2.5 px-1">How are you feeling?</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {MOODS.map((mood) => (
              <motion.button
                key={mood.emoji}
                onClick={() => handleMood(mood.emoji)}
                className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl min-w-[60px] transition-all ${
                  selectedMood === mood.emoji
                    ? "glass border-rose-primary/30"
                    : "bg-surface/50 border border-transparent"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-xl">{mood.emoji}</span>
                <span className="text-[9px] text-muted">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick actions grid */}
        <motion.div variants={item} className="mb-5">
          <p className="text-xs text-muted mb-2.5 px-1">Quick Actions</p>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.path}
                onClick={() => router.push(action.path)}
                className="card-romantic p-4 flex flex-col items-center gap-2.5"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="text-white text-lg" />
                </div>
                <span className="text-xs text-muted">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Streak preview */}
        <motion.div variants={item} className="mb-5">
          <GlassCard
            onClick={() => router.push("/streak")}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getStreakEmoji(couple.streakCount || 0)}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {couple.streakCount || 0} day streak
                </p>
                <p className="text-xs text-muted">
                  {getStreakMessage(couple.streakCount || 0)}
                </p>
              </div>
            </div>
            <div className="text-muted text-xs">→</div>
          </GlassCard>
        </motion.div>

        {/* Daily quote */}
        <motion.div variants={item} className="mb-8">
          <GlassCard hoverable={false} className="text-center py-6">
            <span className="text-2xl mb-3 block">💬</span>
            <p className="text-sm text-foreground/80 italic leading-relaxed px-4">
              &ldquo;{quote}&rdquo;
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
