// =============================================
// Torch — Relationship Stats & Tracking
// =============================================

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface RelationshipStats {
  daysTogether: number;
  relationshipStartDate: Timestamp;
  anniversaryDate?: Timestamp;
  nextAnniversary?: Timestamp;
  daysUntilAnniversary: number;
  totalMessages: number;
  totalPhotos: number;
  totalDrawings: number;
  totalGamesSessions: number;
  updatedAt: Timestamp;
  milestones: {
    daysMilestones: number[];
    achieved: number[];
  };
}

/**
 * Create or initialize relationship stats
 */
export async function initializeRelationshipStats(
  coupleId: string,
  relationshipStartDate: Timestamp,
  anniversaryDate?: Timestamp
): Promise<void> {
  try {
    const statsRef = doc(db, `couples/${coupleId}/stats/overview`);

    const stats: RelationshipStats = {
      daysTogether: calculateDaysTogether(relationshipStartDate),
      relationshipStartDate,
      anniversaryDate,
      nextAnniversary: calculateNextAnniversary(anniversaryDate),
      daysUntilAnniversary: calculateDaysUntilAnniversary(anniversaryDate),
      totalMessages: 0,
      totalPhotos: 0,
      totalDrawings: 0,
      totalGamesSessions: 0,
      updatedAt: Timestamp.now(),
      milestones: {
        daysMilestones: [30, 100, 365, 1000],
        achieved: [],
      },
    };

    await setDoc(statsRef, stats);
  } catch (error) {
    console.error("Error initializing relationship stats:", error);
    throw error;
  }
}

/**
 * Calculate days together from start date
 */
export function calculateDaysTogether(startDate: Timestamp): number {
  const now = new Date();
  const start = startDate.toDate();
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Calculate next anniversary
 */
export function calculateNextAnniversary(
  anniversaryDate?: Timestamp
): Timestamp | null {
  if (!anniversaryDate) return null;

  const anniversary = anniversaryDate.toDate();
  const now = new Date();

  // Check if anniversary has already passed this year
  const thisYearAnniversary = new Date(
    now.getFullYear(),
    anniversary.getMonth(),
    anniversary.getDate()
  );

  let nextAnniversary: Date;

  if (thisYearAnniversary > now) {
    nextAnniversary = thisYearAnniversary;
  } else {
    nextAnniversary = new Date(
      now.getFullYear() + 1,
      anniversary.getMonth(),
      anniversary.getDate()
    );
  }

  return Timestamp.fromDate(nextAnniversary);
}

/**
 * Calculate days until anniversary
 */
export function calculateDaysUntilAnniversary(
  anniversaryDate?: Timestamp
): number {
  if (!anniversaryDate) return 0;

  const nextAnniversary = calculateNextAnniversary(anniversaryDate);
  if (!nextAnniversary) return 0;

  const now = new Date();
  const next = nextAnniversary.toDate();

  const diffTime = next.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Get relationship stats
 */
export async function getRelationshipStats(
  coupleId: string
): Promise<RelationshipStats | null> {
  try {
    const statsRef = doc(db, `couples/${coupleId}/stats/overview`);
    const snap = await getDoc(statsRef);

    if (!snap.exists()) return null;

    const stats = snap.data() as RelationshipStats;

    // Update calculated values
    stats.daysTogether = calculateDaysTogether(stats.relationshipStartDate);
    stats.daysUntilAnniversary = calculateDaysUntilAnniversary(
      stats.anniversaryDate
    );
    stats.nextAnniversary = calculateNextAnniversary(stats.anniversaryDate);

    return stats;
  } catch (error) {
    console.error("Error fetching relationship stats:", error);
    return null;
  }
}

/**
 * Update stats counter (messages, photos, etc.)
 */
export async function updateStatsCounter(
  coupleId: string,
  counterName: "totalMessages" | "totalPhotos" | "totalDrawings" | "totalGamesSessions",
  increment: number = 1
): Promise<void> {
  try {
    const statsRef = doc(db, `couples/${coupleId}/stats/overview`);
    const snap = await getDoc(statsRef);

    if (!snap.exists()) {
      // Initialize if doesn't exist
      await initializeRelationshipStats(coupleId, Timestamp.now());
    }

    const current = snap.data()?.[counterName] || 0;

    await updateDoc(statsRef, {
      [counterName]: current + increment,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error updating ${counterName}:`, error);
  }
}

/**
 * Check and unlock milestones
 */
export async function checkAndUnlockMilestones(coupleId: string) {
  try {
    const stats = await getRelationshipStats(coupleId);
    if (!stats) return;

    const { daysTogether, milestones } = stats;
    const achieved = [...(milestones.achieved || [])];
    let updated = false;

    for (const milestone of milestones.daysMilestones) {
      if (daysTogether >= milestone && !achieved.includes(milestone)) {
        achieved.push(milestone);
        updated = true;
      }
    }

    if (updated) {
      const statsRef = doc(db, `couples/${coupleId}/stats/overview`);
      await updateDoc(statsRef, {
        "milestones.achieved": achieved,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error checking milestones:", error);
  }
}

/**
 * Get milestone emoji based on days
 */
export function getMilestoneEmoji(days: number): string {
  if (days >= 1000) return "👑";
  if (days >= 365) return "💍";
  if (days >= 100) return "✨";
  if (days >= 30) return "🌟";
  return "💕";
}

/**
 * Format relationship duration
 */
export function formatRelationshipDuration(days: number): string {
  if (days < 1) return "Just started 💕";
  if (days === 1) return "1 day together";

  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;

  let duration = "";

  if (years > 0) {
    duration += `${years} year${years > 1 ? "s" : ""}`;
  }

  if (months > 0) {
    if (duration) duration += ", ";
    duration += `${months} month${months > 1 ? "s" : ""}`;
  }

  if (remainingDays > 0 && years === 0) {
    if (duration) duration += ", ";
    duration += `${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
  }

  return duration;
}

/**
 * Get formatted stats for display
 */
export async function getFormattedStats(coupleId: string) {
  const stats = await getRelationshipStats(coupleId);
  if (!stats) return null;

  return {
    daysTogether: stats.daysTogether,
    formattedDuration: formatRelationshipDuration(stats.daysTogether),
    emoji: getMilestoneEmoji(stats.daysTogether),
    daysUntilAnniversary: stats.daysUntilAnniversary,
    anniversaryDate: stats.anniversaryDate?.toDate(),
    totalMessages: stats.totalMessages,
    totalPhotos: stats.totalPhotos,
    totalDrawings: stats.totalDrawings,
    totalGamesSessions: stats.totalGamesSessions,
    milestonesAchieved: stats.milestones.achieved,
  };
}

/**
 * Get milestone message
 */
export function getMilestoneMessage(milestone: number): string {
  const messages: { [key: number]: string } = {
    30: "🌟 1 month together! You're doing great!",
    100: "✨ 100 days! Your love is strong!",
    365: "💍 1 year anniversary! Celebrate your love!",
    1000: "👑 1000 days! Forever starts here!",
  };

  return messages[milestone] || `🎉 Day ${milestone} together!`;
}

export default {
  initializeRelationshipStats,
  calculateDaysTogether,
  calculateNextAnniversary,
  calculateDaysUntilAnniversary,
  getRelationshipStats,
  updateStatsCounter,
  checkAndUnlockMilestones,
  getMilestoneEmoji,
  formatRelationshipDuration,
  getFormattedStats,
  getMilestoneMessage,
};
