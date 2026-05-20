// =============================================
// Torch — TypeScript Type Definitions
// =============================================

import { Timestamp } from "firebase/firestore";

/** User profile stored in Firestore */
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  coupleId: string | null;
  inviteCode: string;
  mood: string;
  createdAt: Timestamp;
  fcmToken: string;
}

/** Couple pairing document */
export interface Couple {
  id: string;
  users: [string, string];
  startDate: Timestamp;
  streakCount: number;
  lastStreakDate: Timestamp | null;
  createdAt: Timestamp;
  status: "active" | "paused";
}

/** Chat message */
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
  type: "text" | "image" | "note";
}

/** Daily question template */
export interface DailyQuestion {
  id: string;
  question: string;
  category: "deep" | "fun" | "romantic" | "nostalgic" | "spicy" | "dream";
  date: string; // YYYY-MM-DD
}

/** User's answer to a daily question */
export interface Answer {
  userId: string;
  answer: string;
  timestamp: Timestamp;
  revealed: boolean;
}

/** Streak tracking data */
export interface Streak {
  coupleId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Timestamp | null;
  milestones: string[];
  history: Record<string, boolean>; // date -> completed
}

/** Shared memory (photo + caption) */
export interface Memory {
  id: string;
  imageURL: string;
  caption: string;
  uploadedBy: string;
  timestamp: Timestamp;
  likes: number;
}

/** Love note between partners */
export interface LoveNote {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
  emoji: string;
}

/** Thumb kiss realtime state */
export interface ThumbKissState {
  user1Holding: boolean;
  user2Holding: boolean;
  lastSync: Timestamp;
  totalKisses: number;
}

/** Push notification */
export interface AppNotification {
  id: string;
  type: "question" | "streak" | "note" | "memory" | "chat" | "thumbkiss";
  title: string;
  body: string;
  timestamp: Timestamp;
  read: boolean;
  data: Record<string, string>;
}

/** Mood option */
export interface MoodOption {
  emoji: string;
  label: string;
  color: string;
}

/** Available moods */
export const MOODS: MoodOption[] = [
  { emoji: "😊", label: "Happy", color: "#fbbf24" },
  { emoji: "🥰", label: "In Love", color: "#f472b6" },
  { emoji: "😌", label: "Peaceful", color: "#a78bfa" },
  { emoji: "🤗", label: "Grateful", color: "#fb923c" },
  { emoji: "😢", label: "Missing You", color: "#60a5fa" },
  { emoji: "😴", label: "Sleepy", color: "#94a3b8" },
  { emoji: "🥺", label: "Needy", color: "#fda4af" },
  { emoji: "🔥", label: "Passionate", color: "#ef4444" },
];
