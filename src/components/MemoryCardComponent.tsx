"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import Image from "next/image";

interface MemoryCardProps {
  imageUrl: string;
  caption: string;
  uploadedBy: string;
  uploadedAt?: Date;
  onClick?: () => void;
}

export default function MemoryCardComponent({
  imageUrl,
  caption,
  uploadedBy,
  uploadedAt,
  onClick,
}: MemoryCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <GlassCard className="overflow-hidden cursor-pointer">
        <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4">
          <Image
            src={imageUrl}
            alt={caption}
            fill
            className="object-cover"
          />
        </div>

        <p className="text-foreground font-medium mb-2">{caption}</p>
        <div className="flex justify-between items-center text-xs text-muted">
          <span>by {uploadedBy}</span>
          {uploadedAt && <span>{formatDate(uploadedAt)}</span>}
        </div>
      </GlassCard>
    </motion.div>
  );
}
