"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection, addDoc, query, orderBy, limit, onSnapshot,
  serverTimestamp, doc, updateDoc, where, getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import ChatBubble, { TypingIndicator, DateSeparator } from "@/components/ChatBubble";
import Avatar from "@/components/Avatar";
import LoadingScreen from "@/components/LoadingScreen";
import { HiArrowLeft, HiPaperAirplane } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { format, isToday, isYesterday } from "date-fns";

export default function ChatPage() {
  const { userProfile, partner, couple, loading } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Listen for messages
  useEffect(() => {
    if (!couple?.id) return;
    const q = query(
      collection(db, `messages/${couple.id}/chat`),
      orderBy("timestamp", "asc"),
      limit(200)
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      // Mark unread messages as read
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data.senderId !== userProfile?.uid && !data.read) {
          updateDoc(doc(db, `messages/${couple.id}/chat`, d.id), { read: true });
        }
      });
    });
    return unsub;
  }, [couple?.id, userProfile?.uid]);

  // Listen for typing indicator
  useEffect(() => {
    if (!couple?.id || !userProfile) return;
    const partnerId = couple.users.find((u) => u !== userProfile.uid);
    if (!partnerId) return;

    const unsub = onSnapshot(doc(db, `typing/${couple.id}`), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPartnerTyping(data[partnerId] === true);
      }
    });
    return unsub;
  }, [couple, userProfile]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partnerTyping]);

  if (loading || !userProfile || !couple) return <LoadingScreen />;

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    const msgText = text.trim();
    setText("");

    try {
      await addDoc(collection(db, `messages/${couple.id}/chat`), {
        senderId: userProfile.uid,
        text: msgText,
        timestamp: serverTimestamp(),
        read: false,
        type: "text",
      });
      // Clear typing indicator
      await updateDoc(doc(db, `typing/${couple.id}`), { [userProfile.uid]: false }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  const handleTyping = async () => {
    try {
      const { setDoc: setDocFn } = await import("firebase/firestore");
      await setDocFn(doc(db, `typing/${couple.id}`), { [userProfile.uid]: true }, { merge: true });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(async () => {
        await setDocFn(doc(db, `typing/${couple.id}`), { [userProfile.uid]: false }, { merge: true });
      }, 2000);
    } catch {}
  };

  // Group messages by date
  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  let lastDateLabel = "";

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="glass-strong px-4 py-3 flex items-center gap-3 shrink-0 z-10">
        <button onClick={() => router.push("/home")} className="p-2 -ml-2 rounded-xl hover:bg-surface-lighter transition-colors">
          <HiArrowLeft className="text-foreground text-lg" />
        </button>
        {partner && (
          <>
            <Avatar src={partner.photoURL} name={partner.displayName} size="sm" glow />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{partner.displayName}</p>
              <p className="text-[10px] text-muted">
                {partnerTyping ? "typing..." : partner.mood || "❤️"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
        {messages.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-5xl mb-3">💌</span>
            <p className="text-muted text-sm">Send your first message!</p>
            <p className="text-muted/50 text-xs mt-1">Say something sweet...</p>
          </motion.div>
        )}

        {messages.map((msg, i) => {
          const msgDate = msg.timestamp?.toDate?.() || new Date();
          const dateLabel = getDateLabel(msgDate);
          const showDate = dateLabel !== lastDateLabel;
          lastDateLabel = dateLabel;

          return (
            <div key={msg.id}>
              {showDate && <DateSeparator date={dateLabel} />}
              <ChatBubble
                text={msg.text}
                isMine={msg.senderId === userProfile.uid}
                timestamp={msgDate}
                read={msg.read}
                index={i}
              />
            </div>
          );
        })}

        {partnerTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="glass-strong px-3 py-3 shrink-0" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}>
        <div className="flex items-end gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => { setText(e.target.value); handleTyping(); }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="input-romantic flex-1 py-3"
          />
          <motion.button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className={`p-3 rounded-2xl transition-all ${
              text.trim()
                ? "bg-gradient-to-r from-rose-primary to-rose-dark text-white"
                : "bg-surface-lighter text-muted"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <HiPaperAirplane className="text-lg rotate-90" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
