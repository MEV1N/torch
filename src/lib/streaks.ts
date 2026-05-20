// Streak management utilities
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getTodayDateString } from "./questions";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  milestones: string[];
  history: Record<string, boolean>;
}

export const STREAK_MILESTONES = [
  { days: 3, label: "First Spark ✨", message: "3 days of love!" },
  { days: 7, label: "Week of Love 💕", message: "One beautiful week together!" },
  { days: 14, label: "Two Hearts 💞", message: "Two weeks of dedication!" },
  { days: 30, label: "Month of Magic 🌙", message: "A whole month of love!" },
  { days: 50, label: "Golden Bond 🌟", message: "50 days strong!" },
  { days: 100, label: "Century of Love 💯", message: "100 days of pure love!" },
  { days: 200, label: "Eternal Flame 🔥", message: "200 days and counting!" },
  { days: 365, label: "Anniversary Star ⭐", message: "A full year of devotion!" },
];

export function getStreakEmoji(streak: number): string {
  if (streak >= 365) return "⭐";
  if (streak >= 200) return "🔥";
  if (streak >= 100) return "💯";
  if (streak >= 50) return "🌟";
  if (streak >= 30) return "🌙";
  if (streak >= 14) return "💞";
  if (streak >= 7) return "💕";
  if (streak >= 3) return "✨";
  return "🕯️";
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your love streak today!";
  if (streak === 1) return "A beautiful beginning! 🌱";
  if (streak < 7) return "Keep the flame alive! 🕯️";
  if (streak < 14) return "A week of love! Growing stronger 💪";
  if (streak < 30) return "Your love is blooming! 🌸";
  if (streak < 100) return "Incredible dedication to each other! 💎";
  if (streak < 365) return "Your love is legendary! 👑";
  return "A timeless love story! ♾️";
}

export async function getStreakData(coupleId: string): Promise<StreakData> {
  const ref = doc(db, "streaks", coupleId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as StreakData;
  return { currentStreak: 0, longestStreak: 0, lastActivityDate: null, milestones: [], history: {} };
}

export async function updateStreak(coupleId: string): Promise<StreakData> {
  const today = getTodayDateString();
  const ref = doc(db, "streaks", coupleId);
  const current = await getStreakData(coupleId);

  if (current.lastActivityDate === today) return current;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  let newStreak = current.lastActivityDate === yesterdayStr ? current.currentStreak + 1 : 1;
  const newLongest = Math.max(newStreak, current.longestStreak);

  const earnedMilestones = [...current.milestones];
  for (const m of STREAK_MILESTONES) {
    if (newStreak >= m.days && !earnedMilestones.includes(m.label)) {
      earnedMilestones.push(m.label);
    }
  }

  const updated: StreakData = {
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActivityDate: today,
    milestones: earnedMilestones,
    history: { ...current.history, [today]: true },
  };

  await setDoc(ref, { ...updated, updatedAt: serverTimestamp() });
  return updated;
}
