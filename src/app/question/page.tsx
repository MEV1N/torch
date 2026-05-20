"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getTodaysQuestion, getTodayDateString } from "@/lib/questions";
import { updateStreak } from "@/lib/streaks";
import BottomNav from "@/components/BottomNav";
import GlassCard from "@/components/GlassCard";
import AnimatedButton from "@/components/AnimatedButton";
import LoadingScreen from "@/components/LoadingScreen";

export default function QuestionPage() {
  const { userProfile, partner, couple, loading } = useAuth();
  const [answer, setAnswer] = useState("");
  const [myAnswer, setMyAnswer] = useState<string | null>(null);
  const [partnerAnswer, setPartnerAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const todaysQ = getTodaysQuestion();
  const dateStr = getTodayDateString();

  // Listen for answers
  useEffect(() => {
    if (!couple?.id || !userProfile) return;

    const answerPath = `answers/${couple.id}/responses/${dateStr}`;

    // My answer
    const unsub1 = onSnapshot(doc(db, answerPath, userProfile.uid), (snap) => {
      if (snap.exists()) setMyAnswer(snap.data().answer);
    });

    // Partner answer
    const partnerId = couple.users.find((u) => u !== userProfile.uid);
    if (!partnerId) return unsub1;

    const unsub2 = onSnapshot(doc(db, answerPath, partnerId), (snap) => {
      if (snap.exists()) setPartnerAnswer(snap.data().answer);
    });

    return () => { unsub1(); unsub2(); };
  }, [couple, userProfile, dateStr]);

  if (loading || !userProfile || !couple) return <LoadingScreen />;

  const bothAnswered = myAnswer !== null && partnerAnswer !== null;

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const answerPath = `answers/${couple.id}/responses/${dateStr}`;
      await setDoc(doc(db, answerPath, userProfile.uid), {
        userId: userProfile.uid,
        answer: answer.trim(),
        timestamp: serverTimestamp(),
        revealed: false,
      });
      setMyAnswer(answer.trim());

      // Update streak
      await updateStreak(couple.id);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const categoryColors: Record<string, string> = {
    deep: "bg-blue-500/10 text-blue-400",
    fun: "bg-amber-500/10 text-amber-400",
    romantic: "bg-rose-primary/10 text-rose-primary",
    nostalgic: "bg-purple-500/10 text-purple-400",
    spicy: "bg-red-500/10 text-red-400",
    dream: "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div className="min-h-screen bg-background pb-nav relative">
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      <motion.div
        className="relative z-10 px-5 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.span
            className="text-4xl block mb-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💝
          </motion.span>
          <h1 className="text-xl font-bold text-foreground">Daily Question</h1>
          <p className="text-muted text-xs mt-1">{dateStr}</p>
        </div>

        {/* Question card */}
        <GlassCard className="mb-6 text-center py-8" hoverable={false} glow>
          <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${categoryColors[todaysQ.category] || ""}`}>
            {todaysQ.category}
          </span>
          <p className="text-lg font-medium text-foreground mt-4 leading-relaxed px-2">
            {todaysQ.question}
          </p>
        </GlassCard>

        {/* Answer section */}
        {!myAnswer ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your heartfelt answer..."
              rows={4}
              className="input-romantic resize-none"
            />
            <AnimatedButton onClick={handleSubmit} fullWidth disabled={submitting || !answer.trim()}>
              {submitting ? "Submitting..." : "Submit Answer 💕"}
            </AnimatedButton>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* My answer */}
            <GlassCard hoverable={false}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-rose-primary font-medium">Your Answer</span>
                <span className="text-xs">✨</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{myAnswer}</p>
            </GlassCard>

            {/* Partner answer */}
            {bothAnswered ? (
              !revealed ? (
                <motion.div className="text-center py-4">
                  <p className="text-muted text-sm mb-4">
                    {partner?.displayName} has answered too! 💕
                  </p>
                  <AnimatedButton onClick={() => setRevealed(true)}>
                    Reveal Answer ✨
                  </AnimatedButton>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateX: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <GlassCard hoverable={false} glow>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-lavender font-medium">
                        {partner?.displayName}&apos;s Answer
                      </span>
                      <span className="text-xs">💜</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{partnerAnswer}</p>
                  </GlassCard>
                </motion.div>
              )
            ) : (
              <motion.div
                className="text-center py-8"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-3xl block mb-2">⏳</span>
                <p className="text-muted text-sm">
                  Waiting for {partner?.displayName || "your partner"} to answer...
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      <BottomNav />
    </div>
  );
}
