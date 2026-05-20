"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiHome, HiChat, HiPhotograph, HiUser } from "react-icons/hi";
import { BsHeartFill } from "react-icons/bs";

const tabs = [
  { path: "/home", icon: HiHome, label: "Home" },
  { path: "/chat", icon: HiChat, label: "Chat" },
  { path: "/question", icon: BsHeartFill, label: "Daily Q", isCenter: true },
  { path: "/memories", icon: HiPhotograph, label: "Memories" },
  { path: "/settings", icon: HiUser, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient fade above nav */}
      <div className="h-6 bg-gradient-to-t from-[#0a0a0f] to-transparent" />

      <div className="glass-strong mx-3 mb-3 rounded-2xl px-2 py-2 flex items-center justify-around"
           style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}>
        {tabs.map((tab) => {
          const active = pathname === tab.path;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                className="relative -mt-6"
              >
                <motion.div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    active
                      ? "bg-gradient-to-br from-rose-primary to-rose-dark shadow-lg shadow-rose-glow/40"
                      : "bg-gradient-to-br from-rose-primary/80 to-rose-dark/80"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  animate={active ? { scale: [1, 1.05, 1] } : {}}
                  transition={active ? { duration: 2, repeat: Infinity } : { type: "spring" }}
                >
                  <Icon className="text-white text-xl" />
                </motion.div>
                {active && (
                  <motion.div
                    className="absolute -inset-2 rounded-full bg-rose-primary/20 blur-md"
                    layoutId="nav-glow"
                    initial={false}
                  />
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="relative flex flex-col items-center py-1.5 px-3 min-w-[48px]"
            >
              <motion.div
                animate={active ? { y: -2 } : { y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon className={`text-xl ${active ? "text-rose-primary" : "text-muted"}`} />
              </motion.div>
              <span className={`text-[10px] mt-0.5 ${active ? "text-rose-primary font-medium" : "text-muted"}`}>
                {tab.label}
              </span>
              {active && (
                <motion.div
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-rose-primary"
                  layoutId="nav-dot"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
