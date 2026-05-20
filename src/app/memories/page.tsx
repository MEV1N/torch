"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import BottomNav from "@/components/BottomNav";
import MemoryCard from "@/components/MemoryCard";
import AnimatedButton from "@/components/AnimatedButton";
import EmptyState from "@/components/EmptyState";
import LoadingScreen from "@/components/LoadingScreen";
import { HiPlus, HiX, HiPhotograph } from "react-icons/hi";
import { v4 as uuidv4 } from "uuid";

export default function MemoriesPage() {
  const { userProfile, couple, loading } = useAuth();
  const [memories, setMemories] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!couple?.id) return;
    const q = query(collection(db, `memories/${couple.id}/items`), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setMemories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [couple?.id]);

  if (loading || !userProfile || !couple) return <LoadingScreen />;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${couple.id}/${uuidv4()}_${file.name}`;
      const storageRef = ref(storage, `memories/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, `memories/${couple.id}/items`), {
        imageURL: url,
        caption: caption.trim() || "A beautiful memory ✨",
        uploadedBy: userProfile.uid,
        timestamp: serverTimestamp(),
        likes: 0,
      });

      setFile(null);
      setPreview("");
      setCaption("");
      setShowUpload(false);
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
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
          <div>
            <h1 className="text-xl font-bold text-foreground">Shared Memories</h1>
            <p className="text-muted text-xs mt-0.5">{memories.length} memories together 📸</p>
          </div>
          <motion.button
            onClick={() => setShowUpload(true)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-primary to-rose-dark flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <HiPlus className="text-white text-lg" />
          </motion.button>
        </motion.div>

        {/* Memories grid */}
        {memories.length === 0 ? (
          <EmptyState
            emoji="📷"
            title="No Memories Yet"
            subtitle="Upload your first photo together and start building your love timeline!"
            action={
              <AnimatedButton onClick={() => setShowUpload(true)}>
                Add Memory 📸
              </AnimatedButton>
            }
          />
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {memories.map((m, i) => (
              <MemoryCard
                key={m.id}
                imageURL={m.imageURL}
                caption={m.caption}
                timestamp={m.timestamp?.toDate?.() || new Date()}
                index={i}
                onClick={() => setSelected(m)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Upload modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              className="w-full max-w-lg bg-surface rounded-t-3xl p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground">Add Memory</h3>
                <button onClick={() => setShowUpload(false)}><HiX className="text-muted text-xl" /></button>
              </div>

              {/* Photo preview/upload */}
              {preview ? (
                <div className="relative rounded-2xl overflow-hidden mb-4 aspect-video">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setFile(null); setPreview(""); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    <HiX className="text-white text-sm" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full aspect-video rounded-2xl border-2 border-dashed border-border-light flex flex-col items-center justify-center gap-2 mb-4 hover:border-rose-primary/30 transition-colors"
                >
                  <HiPhotograph className="text-3xl text-muted" />
                  <span className="text-sm text-muted">Tap to select photo</span>
                </button>
              )}

              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

              <input
                type="text"
                placeholder="Add a caption... 💕"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="input-romantic mb-4"
              />

              <AnimatedButton onClick={handleUpload} fullWidth disabled={!file || uploading}>
                {uploading ? "Uploading..." : "Save Memory ✨"}
              </AnimatedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen viewer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <div className="flex items-center justify-between p-4">
              <p className="text-white/70 text-xs">
                {selected.timestamp?.toDate ? new Date(selected.timestamp.toDate()).toLocaleDateString() : ""}
              </p>
              <button onClick={() => setSelected(null)}>
                <HiX className="text-white text-xl" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <motion.img
                src={selected.imageURL}
                alt={selected.caption}
                className="max-w-full max-h-full object-contain rounded-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              />
            </div>
            <div className="p-4 text-center">
              <p className="text-white text-sm">{selected.caption}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
