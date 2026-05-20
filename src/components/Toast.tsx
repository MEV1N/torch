"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  visible: boolean;
  onClose: () => void;
}

const icons = { success: "✨", error: "💔", info: "💌" };
const colors = {
  success: "border-green-500/30 bg-green-900/20",
  error: "border-red-500/30 bg-red-900/20",
  info: "border-rose-primary/30 bg-rose-primary/10",
};

export default function Toast({ message, type = "info", visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed top-12 left-1/2 z-[100] max-w-sm w-[90%] glass rounded-2xl px-5 py-3.5 border ${colors[type]} flex items-center gap-3`}
          initial={{ opacity: 0, y: -30, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          transition={{ type: "spring", damping: 20 }}
        >
          <span className="text-xl">{icons[type]}</span>
          <p className="text-sm text-foreground flex-1">{message}</p>
          <button onClick={onClose} className="text-muted text-xs hover:text-foreground ml-2">✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy toast usage
export function useToast() {
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" as "success" | "error" | "info" });
  const show = (message: string, type: "success" | "error" | "info" = "info") => setToast({ visible: true, message, type });
  const hide = () => setToast((t) => ({ ...t, visible: false }));
  return { toast, show, hide };
}
