"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";

interface MemoryCardProps {
  imageURL: string;
  caption: string;
  timestamp: Date;
  index?: number;
  onClick?: () => void;
}

export default function MemoryCard({ imageURL, caption, timestamp, index = 0, onClick }: MemoryCardProps) {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="aspect-square bg-surface">
        <img
          src={imageURL}
          alt={caption}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Caption overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-xs font-medium leading-snug line-clamp-2">{caption}</p>
        <p className="text-white/50 text-[10px] mt-1">{format(timestamp, "MMM d, yyyy")}</p>
      </div>

      {/* Date badge */}
      <div className="absolute top-2 right-2 glass rounded-lg px-2 py-1">
        <span className="text-[10px] text-white/80">{format(timestamp, "MMM d")}</span>
      </div>
    </motion.div>
  );
}
