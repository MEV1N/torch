"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signUp, signIn, signInWithGoogle } from "@/lib/auth";
import AnimatedButton from "@/components/AnimatedButton";
import { FcGoogle } from "react-icons/fc";
import { HiMail, HiLockClosed, HiUser } from "react-icons/hi";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name.trim()) { setError("Please enter your name"); setLoading(false); return; }
        await signUp(email, password, name);
      }
      router.replace("/pair");
    } catch (err: any) {
      const msg = err.code?.replace("auth/", "").replace(/-/g, " ") || "Something went wrong";
      setError(msg.charAt(0).toUpperCase() + msg.slice(1));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/pair");
    } catch (err: any) {
      setError("Google sign-in failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-primary/6 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-romantic-purple/5 rounded-full blur-[100px]" />

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="text-5xl mb-3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🕯️
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted text-sm mt-1">
            {isLogin ? "Sign in to continue your love story" : "Start your romantic journey together"}
          </p>
        </div>

        {/* Form card */}
        <motion.div
          className="glass rounded-3xl p-6"
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Google sign-in */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white/5 border border-border-light hover:bg-white/10 transition-all text-sm font-medium text-foreground mb-5"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-border flex-1" />
            <span className="text-muted text-xs">or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-romantic pl-11"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-romantic pl-11"
              />
            </div>

            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-romantic pl-11"
              />
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-red-400 text-xs text-center bg-red-400/10 rounded-xl py-2 px-3"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatedButton type="submit" fullWidth disabled={loading}>
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : isLogin ? (
                "Sign In 💕"
              ) : (
                "Create Account ✨"
              )}
            </AnimatedButton>
          </form>
        </motion.div>

        {/* Toggle */}
        <motion.p className="text-center mt-6 text-sm text-muted" layout>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-rose-primary font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}
