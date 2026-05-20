"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { doc, onSnapshot, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LoadingScreen from "@/components/LoadingScreen";
import { HiArrowLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function ThumbKissPage() {
  const { userProfile, partner, couple, loading } = useAuth();
  const [holding, setHolding] = useState(false);
  const [partnerHolding, setPartnerHolding] = useState(false);
  const [kissing, setKissing] = useState(false);
  const [totalKisses, setTotalKisses] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const router = useRouter();
  const holdTimeoutRef = useRef<NodeJS.Timeout>(null);

  const myIndex = couple?.users?.[0] === userProfile?.uid ? "user1Holding" : "user2Holding";
  const partnerIndex = myIndex === "user1Holding" ? "user2Holding" : "user1Holding";

  // Listen to thumb kiss state
  useEffect(() => {
    if (!couple?.id) return;
    const unsub = onSnapshot(doc(db, "thumb_kiss", couple.id), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPartnerHolding(data[partnerIndex] || false);
        setTotalKisses(data.totalKisses || 0);
      }
    });
    return unsub;
  }, [couple?.id, partnerIndex]);

  // Check if both are holding
  useEffect(() => {
    const bothHolding = holding && partnerHolding;
    setKissing(bothHolding);
    if (bothHolding && !showCelebration) {
      setShowCelebration(true);
      // Increment total kisses
      if (couple?.id) {
        updateDoc(doc(db, "thumb_kiss", couple.id), {
          totalKisses: increment(1),
          lastSync: serverTimestamp(),
        }).catch(() => {});
      }
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [holding, partnerHolding, couple?.id]);

  if (loading || !userProfile || !couple) return <LoadingScreen />;

  const handleHoldStart = async () => {
    setHolding(true);
    try {
      await setDoc(doc(db, "thumb_kiss", couple.id), { [myIndex]: true, lastSync: serverTimestamp() }, { merge: true });
    } catch {}
  };

  const handleHoldEnd = async () => {
    setHolding(false);
    try {
      await setDoc(doc(db, "thumb_kiss", couple.id), { [myIndex]: false, lastSync: serverTimestamp() }, { merge: true });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[150px] transition-all duration-1000"
        animate={{
          backgroundColor: kissing ? "rgba(232, 84, 124, 0.25)" : holding ? "rgba(232, 84, 124, 0.1)" : "rgba(168, 85, 247, 0.05)",
          scale: kissing ? 1.5 : 1,
        }}
      />

      {/* Header */}
      <div className="px-5 pt-8 flex items-center gap-3 relative z-10">
        <button onClick={() => router.push("/home")} className="p-2 -ml-2 rounded-xl hover:bg-surface-lighter">
          <HiArrowLeft className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Thumb Kiss</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        {/* Status */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {kissing ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <p className="text-rose-light text-lg font-semibold mb-1">You&apos;re connected! 💕</p>
              <p className="text-muted text-xs">Feel the warmth of your partner</p>
            </motion.div>
          ) : partnerHolding ? (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
              <p className="text-lavender text-sm font-medium">{partner?.displayName} is waiting...</p>
              <p className="text-muted text-xs mt-1">Hold the heart to connect 💜</p>
            </motion.div>
          ) : holding ? (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
              <p className="text-rose-light text-sm font-medium">Waiting for {partner?.displayName}...</p>
              <p className="text-muted text-xs mt-1">Keep holding 🤞</p>
            </motion.div>
          ) : (
            <div>
              <p className="text-foreground text-sm">Hold the heart button together</p>
              <p className="text-muted text-xs mt-1">Both must hold at the same time</p>
            </div>
          )}
        </motion.div>

        {/* Heart button */}
        <motion.button
          className={`relative w-40 h-40 rounded-full flex items-center justify-center select-none touch-none ${
            kissing
              ? "bg-gradient-to-br from-rose-primary to-rose-dark"
              : holding
              ? "bg-gradient-to-br from-rose-primary/60 to-rose-dark/60"
              : "bg-surface-lighter border-2 border-border-light"
          }`}
          animate={
            kissing
              ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px rgba(232,84,124,0)", "0 0 60px rgba(232,84,124,0.5)", "0 0 0px rgba(232,84,124,0)"] }
              : holding
              ? { scale: [1, 1.03, 1] }
              : {}
          }
          transition={{ duration: kissing ? 0.8 : 1.5, repeat: Infinity }}
          onPointerDown={handleHoldStart}
          onPointerUp={handleHoldEnd}
          onPointerLeave={handleHoldEnd}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow rings */}
          {(holding || kissing) && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-rose-primary/30"
                animate={{ scale: [1, 1.3, 1.5], opacity: [0.5, 0.2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-rose-primary/20"
                animate={{ scale: [1, 1.5, 1.8], opacity: [0.3, 0.1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}

          <motion.span
            className="text-5xl relative z-10"
            animate={kissing ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            {kissing ? "💗" : holding ? "💓" : "🤍"}
          </motion.span>
        </motion.button>

        {/* Total kisses counter */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-3xl font-bold text-foreground">{totalKisses}</p>
          <p className="text-muted text-xs mt-1">total thumb kisses 💋</p>
        </motion.div>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Floating hearts */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                style={{ left: `${15 + Math.random() * 70}%` }}
                initial={{ bottom: "40%", opacity: 1, scale: 0 }}
                animate={{
                  bottom: "90%",
                  opacity: 0,
                  scale: [0, 1.5, 1, 0.5],
                  x: (Math.random() - 0.5) * 100,
                }}
                transition={{ duration: 2 + Math.random(), delay: i * 0.1 }}
              >
                {["💕", "💗", "💖", "✨", "💞"][Math.floor(Math.random() * 5)]}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
