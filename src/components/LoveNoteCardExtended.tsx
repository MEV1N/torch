// =============================================
// Torch — Love Note Card Component
// =============================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoveNote, pinLoveNote, unpinLoveNote, reactToLoveNote } from "@/lib/loveNotes";

interface LoveNoteCardProps {
  note: LoveNote & { id: string };
  coupleId: string;
  userId: string;
  onDelete?: (noteId: string) => void;
  onPin?: (noteId: string, isPinned: boolean) => void;
  showReactions?: boolean;
}

const SENTIMENTS_COLORS = {
  romantic: "from-rose-400 to-pink-500",
  funny: "from-yellow-400 to-orange-500",
  supportive: "from-blue-400 to-cyan-500",
  spicy: "from-red-400 to-red-600",
};

const REACTION_EMOJIS = ["❤️", "😂", "😍", "🥰", "✨", "🔥"];

export default function LoveNoteCard({
  note,
  coupleId,
  userId,
  onDelete,
  onPin,
  showReactions = true,
}: LoveNoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(
    note.reactions.find((r) => r.uid === userId)?.emoji || null
  );

  const colorGradient =
    SENTIMENTS_COLORS[note.sentiment as keyof typeof SENTIMENTS_COLORS] ||
    SENTIMENTS_COLORS.romantic;

  const handleReaction = async (emoji: string) => {
    try {
      await reactToLoveNote(coupleId, note.id!, userId, emoji);
      setUserReaction(emoji);
      setShowReactionPicker(false);
    } catch (error) {
      console.error("Error reacting to note:", error);
    }
  };

  const handlePin = async () => {
    try {
      if (note.isPinned) {
        await unpinLoveNote(coupleId, note.id!);
      } else {
        await pinLoveNote(coupleId, note.id!);
      }
      onPin?.(note.id!, !note.isPinned);
    } catch (error) {
      console.error("Error pinning note:", error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative p-4 rounded-2xl cursor-pointer border border-white/10 backdrop-blur-xl overflow-hidden group`}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-5`} />

        {/* Pin indicator */}
        <AnimatePresence>
          {note.isPinned && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-3 right-3 text-xl"
            >
              📌
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{note.emoji}</span>
              <div>
                <p className="text-xs text-gray-400">From {note.fromName}</p>
                <p className="text-xs text-gray-500">
                  {note.sentAt.toDate().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Text */}
          <motion.p
            className={`text-sm leading-relaxed ${
              isExpanded ? "line-clamp-none" : "line-clamp-2"
            } text-white/90 transition-all`}
          >
            {note.text}
          </motion.p>

          {/* Expand indicator */}
          {note.text.length > 100 && (
            <p className="text-xs text-gray-400 mt-2">
              {isExpanded ? "Show less ▲" : "Show more ▼"}
            </p>
          )}

          {/* Reactions and Actions */}
          {isExpanded && showReactions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 space-y-3"
            >
              {/* Existing reactions */}
              {note.reactions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.reactions.map((reaction) => (
                    <motion.button
                      key={`${reaction.uid}-${reaction.emoji}`}
                      whileHover={{ scale: 1.2 }}
                      className="text-lg opacity-75 hover:opacity-100 transition-opacity"
                      title={`${reaction.emoji}`}
                    >
                      {reaction.emoji}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Reaction buttons */}
              <div className="flex gap-2 items-center">
                {!showReactionPicker ? (
                  <>
                    {REACTION_EMOJIS.slice(0, 3).map((emoji) => (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleReaction(emoji)}
                        className={`text-lg p-2 rounded-full transition-all ${
                          userReaction === emoji
                            ? "bg-white/20 scale-110"
                            : "hover:bg-white/10"
                        }`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowReactionPicker(true)}
                      className="text-lg p-2 rounded-full hover:bg-white/10 transition-all"
                    >
                      ➕
                    </motion.button>
                  </>
                ) : (
                  <div className="flex gap-1 flex-wrap">
                    {REACTION_EMOJIS.map((emoji) => (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleReaction(emoji)}
                        className={`text-lg p-1 transition-all ${
                          userReaction === emoji ? "scale-110" : ""
                        }`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                    <button
                      onClick={() => setShowReactionPicker(false)}
                      className="text-lg p-1 opacity-50 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePin}
                  className="text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {note.isPinned ? "Unpin 📌" : "Pin 📍"}
                </motion.button>
                {onDelete && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(note.id!)}
                    className="text-sm px-3 py-1 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-300"
                  >
                    Delete 🗑️
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
