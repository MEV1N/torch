"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc, updateDoc, query, collection, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AnimatedButton from "@/components/AnimatedButton";
import GlassCard from "@/components/GlassCard";
import LoadingScreen from "@/components/LoadingScreen";
import { HiClipboardCopy, HiCheck } from "react-icons/hi";
import { v4 as uuidv4 } from "uuid";

export default function PairPage() {
  const { userProfile, couple, loading } = useAuth();
  const [partnerCode, setPartnerCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [pairing, setPairing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && couple) router.replace("/home");
  }, [couple, loading, router]);

  if (loading || !userProfile) return <LoadingScreen />;

  const copyCode = () => {
    navigator.clipboard.writeText(userProfile.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePair = async () => {
    if (!partnerCode.trim()) return;
    setError("");
    setPairing(true);

    try {
      // Find the partner by invite code
      const q = query(collection(db, "users"), where("inviteCode", "==", partnerCode.toUpperCase().trim()));
      const snap = await getDocs(q);

      if (snap.empty) { setError("No user found with this code"); setPairing(false); return; }

      const partnerDoc = snap.docs[0];
      const partnerData = partnerDoc.data();

      if (partnerData.uid === userProfile.uid) { setError("You can't pair with yourself 😅"); setPairing(false); return; }
      if (partnerData.coupleId) { setError("This person is already paired"); setPairing(false); return; }

      // Create couple document
      const coupleId = uuidv4();
      await setDoc(doc(db, "couples", coupleId), {
        users: [userProfile.uid, partnerData.uid],
        startDate: serverTimestamp(),
        streakCount: 0,
        lastStreakDate: null,
        createdAt: serverTimestamp(),
        status: "active",
      });

      // Update both users
      await updateDoc(doc(db, "users", userProfile.uid), { coupleId });
      await updateDoc(doc(db, "users", partnerData.uid), { coupleId });

      setSuccess(true);
      setTimeout(() => router.replace("/home"), 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setPairing(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            💕
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Connected!</h2>
          <p className="text-muted text-sm">Your hearts are now linked forever</p>
          <motion.div
            className="mt-4 flex gap-1 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-rose-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-romantic-purple/6 rounded-full blur-[120px]" />

      <motion.div
        className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <motion.div
          className="text-6xl mb-4"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🔗
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Connect with Partner</h1>
        <p className="text-muted text-sm text-center mb-10">
          Share your code or enter your partner&apos;s code to link your hearts
        </p>

        {/* Your invite code */}
        <GlassCard className="w-full mb-6" hoverable={false}>
          <p className="text-xs text-muted mb-3 uppercase tracking-wider">Your Invite Code</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold tracking-[0.3em] text-foreground font-mono">
              {userProfile.inviteCode}
            </span>
            <button
              onClick={copyCode}
              className="p-3 rounded-xl bg-surface-lighter hover:bg-rose-primary/10 transition-colors"
            >
              {copied ? (
                <HiCheck className="text-green-400 text-lg" />
              ) : (
                <HiClipboardCopy className="text-muted text-lg" />
              )}
            </button>
          </div>
          {copied && (
            <motion.p
              className="text-green-400 text-xs mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Copied to clipboard! ✨
            </motion.p>
          )}
        </GlassCard>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full mb-6">
          <div className="h-px bg-border flex-1" />
          <span className="text-muted text-xs">or enter partner&apos;s code</span>
          <div className="h-px bg-border flex-1" />
        </div>

        {/* Partner code input */}
        <div className="w-full space-y-4">
          <input
            type="text"
            placeholder="Enter partner's code"
            value={partnerCode}
            onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="input-romantic text-center text-xl tracking-[0.3em] font-mono uppercase"
          />

          {error && (
            <motion.p
              className="text-red-400 text-xs text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <AnimatedButton onClick={handlePair} fullWidth disabled={pairing || partnerCode.length < 6}>
            {pairing ? "Connecting..." : "Link Hearts 💕"}
          </AnimatedButton>
        </div>
      </motion.div>
    </div>
  );
}
