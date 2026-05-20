// =============================================
// Torch — Milestones System
// =============================================

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
  orderBy,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Milestone {
  id?: string;
  type: "anniversary" | "birthday" | "goal" | "bucket-list" | "custom";
  title: string;
  description?: string;
  date: Timestamp;
  daysUntil?: number;
  isCompleted: boolean;
  completedAt?: Timestamp;
  emoji: string;
  importance: "low" | "medium" | "high";
  celebrationSettings?: {
    notifyDays: number;
    sendReminder: boolean;
  };
  createdAt: Timestamp;
  createdBy: string;
}

/**
 * Create a milestone
 */
export async function createMilestone(
  coupleId: string,
  type: "anniversary" | "birthday" | "goal" | "bucket-list" | "custom",
  title: string,
  date: Date,
  createdBy: string,
  description: string = "",
  emoji: string = "⭐",
  importance: "low" | "medium" | "high" = "high"
): Promise<string> {
  try {
    const milestone: Milestone = {
      type,
      title,
      description,
      date: Timestamp.fromDate(date),
      isCompleted: false,
      emoji,
      importance,
      createdAt: Timestamp.now(),
      createdBy,
      celebrationSettings: {
        notifyDays: 7,
        sendReminder: true,
      },
    };

    const milestonesRef = collection(db, `couples/${coupleId}/milestones`);
    const docRef = await addDoc(milestonesRef, milestone);

    return docRef.id;
  } catch (error) {
    console.error("Error creating milestone:", error);
    throw error;
  }
}

/**
 * Get all milestones
 */
export async function getMilestones(coupleId: string) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/milestones`),
      orderBy("date", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Milestone & { id: string })[];
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return [];
  }
}

/**
 * Get upcoming milestones
 */
export async function getUpcomingMilestones(
  coupleId: string,
  limitDays: number = 365
) {
  try {
    const today = new Date();
    const future = new Date(today.getTime() + limitDays * 24 * 60 * 60 * 1000);

    const milestones = await getMilestones(coupleId);
    return milestones
      .filter(
        (m) =>
          !m.isCompleted &&
          m.date.toDate() > today &&
          m.date.toDate() < future
      )
      .sort(
        (a, b) =>
          a.date.toDate().getTime() - b.date.toDate().getTime()
      );
  } catch (error) {
    console.error("Error getting upcoming milestones:", error);
    return [];
  }
}

/**
 * Get next milestone
 */
export async function getNextMilestone(coupleId: string) {
  try {
    const upcoming = await getUpcomingMilestones(coupleId, 365);
    return upcoming.length > 0 ? upcoming[0] : null;
  } catch (error) {
    console.error("Error getting next milestone:", error);
    return null;
  }
}

/**
 * Calculate days until milestone
 */
export function calculateDaysUntil(milestoneDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(milestoneDate);
  target.setHours(0, 0, 0, 0);

  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Update milestone
 */
export async function updateMilestone(
  coupleId: string,
  milestoneId: string,
  updates: Partial<Milestone>
): Promise<void> {
  try {
    const milestoneRef = doc(
      db,
      `couples/${coupleId}/milestones/${milestoneId}`
    );
    await updateDoc(milestoneRef, updates);
  } catch (error) {
    console.error("Error updating milestone:", error);
  }
}

/**
 * Complete a milestone
 */
export async function completeMilestone(
  coupleId: string,
  milestoneId: string
): Promise<void> {
  try {
    const milestoneRef = doc(
      db,
      `couples/${coupleId}/milestones/${milestoneId}`
    );
    await updateDoc(milestoneRef, {
      isCompleted: true,
      completedAt: Timestamp.now(),
    });

    // Send celebration notification
    await sendMilestoneCelebration(coupleId, milestoneId);
  } catch (error) {
    console.error("Error completing milestone:", error);
  }
}

/**
 * Delete a milestone
 */
export async function deleteMilestone(
  coupleId: string,
  milestoneId: string
): Promise<void> {
  try {
    const milestoneRef = doc(
      db,
      `couples/${coupleId}/milestones/${milestoneId}`
    );
    await deleteDoc(milestoneRef);
  } catch (error) {
    console.error("Error deleting milestone:", error);
  }
}

/**
 * Listen to milestones in real-time
 */
export function listenToMilestones(
  coupleId: string,
  callback: (milestones: (Milestone & { id: string })[]) => void
) {
  const q = query(
    collection(db, `couples/${coupleId}/milestones`),
    orderBy("date", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const milestones = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Milestone & { id: string })[];

    callback(milestones);
  });
}

/**
 * Get milestone statistics
 */
export async function getMilestoneStats(coupleId: string) {
  try {
    const milestones = await getMilestones(coupleId);
    const upcoming = await getUpcomingMilestones(coupleId);

    const completed = milestones.filter((m) => m.isCompleted).length;
    const byType: { [key: string]: number } = {};

    milestones.forEach((m) => {
      byType[m.type] = (byType[m.type] || 0) + 1;
    });

    return {
      total: milestones.length,
      completed,
      upcoming: upcoming.length,
      byType,
      nextMilestone: upcoming.length > 0 ? upcoming[0] : null,
    };
  } catch (error) {
    console.error("Error getting milestone stats:", error);
    return {
      total: 0,
      completed: 0,
      upcoming: 0,
      byType: {},
      nextMilestone: null,
    };
  }
}

/**
 * Send milestone celebration notification
 */
async function sendMilestoneCelebration(coupleId: string, milestoneId: string) {
  try {
    const milestoneRef = doc(
      db,
      `couples/${coupleId}/milestones/${milestoneId}`
    );
    const snap = await getDoc(milestoneRef);
    const milestone = snap.data() as Milestone;

    const notificationsRef = collection(
      db,
      `couples/${coupleId}/notifications`
    );

    await addDoc(notificationsRef, {
      type: "milestone-celebration",
      title: `Milestone: ${milestone.title} ${milestone.emoji}`,
      body: `You've reached an important milestone! 🎉`,
      createdAt: Timestamp.now(),
      isRead: false,
    });
  } catch (error) {
    console.error("Error sending milestone celebration:", error);
  }
}

/**
 * Get milestone message
 */
export function getMilestoneMessage(milestone: Milestone): string {
  const daysUntil = calculateDaysUntil(milestone.date.toDate());

  if (daysUntil === 0) return `Today is ${milestone.title}!`;
  if (daysUntil === 1) return `${milestone.title} is tomorrow!`;
  if (daysUntil < 7) return `${milestone.title} in ${daysUntil} days`;
  if (daysUntil < 30) {
    const weeks = Math.floor(daysUntil / 7);
    return `${milestone.title} in ${weeks} weeks`;
  }
  if (daysUntil < 365) {
    const months = Math.floor(daysUntil / 30);
    return `${milestone.title} in ${months} months`;
  }

  return `${milestone.title} coming up`;
}

/**
 * Get milestone emoji based on type
 */
export function getMilestoneEmoji(type: string): string {
  const emojis: { [key: string]: string } = {
    anniversary: "💍",
    birthday: "🎂",
    goal: "🎯",
    "bucket-list": "✅",
    custom: "⭐",
  };

  return emojis[type] || "⭐";
}

export default {
  createMilestone,
  getMilestones,
  getUpcomingMilestones,
  getNextMilestone,
  calculateDaysUntil,
  updateMilestone,
  completeMilestone,
  deleteMilestone,
  listenToMilestones,
  getMilestoneStats,
  getMilestoneMessage,
  getMilestoneEmoji,
};
