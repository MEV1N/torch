"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BottomNav from "@/components/BottomNav";
import LoveNoteCard from "@/components/LoveNoteCard";
import AnimatedButton from "@/components/AnimatedButton";
import EmptyState from "@/components/EmptyState";
import LoadingScreen from "@/components/LoadingScreen";
import { HiArrowLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";

const NOTE_EMOJIS = ["💌", "💕", "🌹", "✨", "🦋", "🌙", "💗", "🔥"];

export default function NotesPage() {
  const { userProfile, partner, couple, loading } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💌");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!couple?.id) return;
    const q = query(collection(db, `love_notes/${couple.id}/notes`), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const notesList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotes(notesList);
      // Mark received notes as read
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data.senderId !== userProfile?.uid && !data.read) {
          updateDoc(doc(db, `love_notes/${couple.id}/notes`, d.id), { read: true });
        }
      });
    });
    return unsub;
  }, [couple?.id, userProfile?.uid]);

  if (loading || !userProfile || !couple) return <LoadingScreen />;

  const handleSend = async () => {
    if (!noteText.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, `love_notes/${couple.id}/notes`), {
        senderId: userProfile.uid,
        text: noteText.trim(),
        timestamp: serverTimestamp(),
        read: false,
        emoji: selectedEmoji,
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setShowCompose(false);
        setNoteText("");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background pb-nav relative">
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      <div className="relative z-10 px-5 pt-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/home")} className="p-2 -ml-2 rounded-xl hover:bg-surface-lighter">
              <HiArrowLeft className="text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Love Notes</h1>
              <p className="text-muted text-xs mt-0.5">Sweet messages from the heart 💌</p>
            </div>
          </div>
          <AnimatedButton variant="ghost" onClick={() => setShowCompose(true)}>
            Write ✍️
          </AnimatedButton>
        </motion.div>

        {/* Notes list */}
        {notes.length === 0 ? (
          <EmptyState
            emoji="💌"
            title="No Love Notes Yet"
            subtitle="Send a sweet little note to make your partner smile"
            action={<AnimatedButton onClick={() => setShowCompose(true)}>Write a Note 💕</AnimatedButton>}
          />
        ) : (
          <div className="space-y-3">
            {notes.map((note, i) => (
              <LoveNoteCard
                key={note.id}
                text={note.text}
                emoji={note.emoji || "💌"}
                timestamp={note.timestamp?.toDate?.() || new Date()}
                isMine={note.senderId === userProfile.uid}
                read={note.read}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Compose modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !sent && setShowCompose(false)}
          >
            <motion.div
              className="w-full max-w-lg bg-surface rounded-t-3xl p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {sent ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1.5 }}
                  >
                    {selectedEmoji}
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground">Note Sent!</h3>
                  <p className="text-muted text-sm mt-1">
                    {partner?.displayName} will love this 💕
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-foreground mb-4">Write a Love Note</h3>

                  {/* Emoji picker */}
                  <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                    {NOTE_EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => setSelectedEmoji(e)}
                        className={`text-2xl p-2 rounded-xl transition-all ${
                          selectedEmoji === e ? "bg-rose-primary/10 scale-110" : "opacity-50"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write something sweet..."
                    rows={4}
                    maxLength={300}
                    className="input-romantic resize-none mb-2"
                  />
                  <p className="text-muted text-xs text-right mb-4">{noteText.length}/300</p>

                  <AnimatedButton onClick={handleSend} fullWidth disabled={!noteText.trim() || sending}>
                    {sending ? "Sending..." : `Send Note ${selectedEmoji}`}
                  </AnimatedButton>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
