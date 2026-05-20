"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BottomNav from "@/components/BottomNav";
import GlassCard from "@/components/GlassCard";
import Avatar from "@/components/Avatar";
import AnimatedButton from "@/components/AnimatedButton";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";
import { HiLogout, HiHeart, HiCalendar, HiMail, HiUser, HiCog } from "react-icons/hi";

export default function SettingsPage() {
  const { userProfile, partner, couple, loading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  if (loading || !userProfile) return <LoadingScreen />;

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOutUser();
    router.replace("/auth");
  };

  const startDate = couple?.startDate?.toDate?.() || new Date();
  const daysCount = Math.floor((Date.now() - startDate.getTime()) / 86400000);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background pb-nav relative">
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      <motion.div
        className="relative z-10 px-5 pt-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Profile header */}
        <motion.div variants={item} className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Avatar
              src={userProfile.photoURL}
              name={userProfile.displayName}
              size="xl"
              glow
            />
          </div>
          <h1 className="text-xl font-bold text-foreground">{userProfile.displayName}</h1>
          <p className="text-muted text-xs mt-1">{userProfile.email}</p>
          {userProfile.mood && (
            <span className="text-lg mt-1 block">{userProfile.mood}</span>
          )}
        </motion.div>

        {/* Partner info */}
        {partner && couple && (
          <motion.div variants={item}>
            <GlassCard hoverable={false} className="mb-6">
              <div className="flex items-center gap-4">
                <Avatar src={partner.photoURL} name={partner.displayName} size="lg" glow />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Paired with</p>
                  <p className="text-base font-bold text-rose-light">{partner.displayName}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted flex items-center gap-1">
                      <HiHeart className="text-rose-primary text-[10px]" />
                      {daysCount} days
                    </span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <span className="text-[10px]">🔥</span>
                      {couple.streakCount || 0} streak
                    </span>
                  </div>
                </div>
                <span className="text-2xl">{partner.mood || "💕"}</span>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Settings list */}
        <motion.div variants={item} className="space-y-2 mb-6">
          <p className="text-xs text-muted mb-2 px-1 uppercase tracking-wider">Settings</p>

          {[
            { icon: HiUser, label: "Edit Profile", desc: "Change your name & photo", action: () => {} },
            { icon: HiCalendar, label: "Relationship Date", desc: startDate.toLocaleDateString(), action: () => {} },
            { icon: HiMail, label: "Invite Code", desc: userProfile.inviteCode, action: () => {} },
            { icon: HiCog, label: "Notifications", desc: "Manage push notifications", action: () => {} },
          ].map((setting) => (
            <GlassCard
              key={setting.label}
              onClick={setting.action}
              className="flex items-center gap-3 py-3.5"
            >
              <div className="w-9 h-9 rounded-xl bg-surface-lighter flex items-center justify-center">
                <setting.icon className="text-muted" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{setting.label}</p>
                <p className="text-xs text-muted">{setting.desc}</p>
              </div>
              <span className="text-muted text-xs">→</span>
            </GlassCard>
          ))}
        </motion.div>

        {/* About section */}
        <motion.div variants={item} className="mb-6">
          <GlassCard hoverable={false} className="text-center py-5">
            <span className="text-3xl block mb-2">🕯️</span>
            <p className="text-sm font-bold text-foreground">Torch</p>
            <p className="text-xs text-muted mt-1">Version 1.0.0</p>
            <p className="text-xs text-muted mt-0.5">Keep your love glowing</p>
          </GlassCard>
        </motion.div>

        {/* Logout */}
        <motion.div variants={item} className="mb-8">
          <AnimatedButton
            onClick={handleLogout}
            variant="secondary"
            fullWidth
            disabled={loggingOut}
          >
            <HiLogout className="text-red-400" />
            <span className="text-red-400">{loggingOut ? "Signing out..." : "Sign Out"}</span>
          </AnimatedButton>
        </motion.div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
