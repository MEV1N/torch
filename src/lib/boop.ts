// =============================================
// Torch — Boop Feature (Cute Interaction)
// =============================================

import {
  doc,
  updateDoc,
  Timestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface BoopEvent {
  id?: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  boopedat: Timestamp;
  type: "boop" | "counter-boop";
  emoji?: string;
}

/**
 * Send a boop to partner
 */
export async function sendBoop(
  coupleId: string,
  fromUid: string,
  fromName: string,
  toUid: string,
  emoji: string = "👆"
): Promise<void> {
  try {
    // Record the boop
    const boopsRef = collection(db, `couples/${coupleId}/boops`);
    const boop: BoopEvent = {
      fromUid,
      fromName,
      toUid,
      boopedat: Timestamp.now(),
      type: "boop",
      emoji,
    };

    await addDoc(boopsRef, boop);

    // Update boop counter
    const statsRef = doc(db, `couples/${coupleId}/stats/boop-counter`);
    const snap = await getDoc(statsRef);
    const currentCount = snap.data()?.totalBoops || 0;

    await updateDoc(statsRef, {
      totalBoops: currentCount + 1,
      lastBoopAt: Timestamp.now(),
      lastBoopFrom: fromUid,
    });

    // Send notification
    await createBoopNotification(coupleId, toUid, fromName);
  } catch (error) {
    console.error("Error sending boop:", error);
  }
}

/**
 * Get total boop count
 */
export async function getBoopCount(coupleId: string): Promise<number> {
  try {
    const statsRef = doc(db, `couples/${coupleId}/stats/boop-counter`);
    const snap = await getDoc(statsRef);
    return snap.data()?.totalBoops || 0;
  } catch (error) {
    console.error("Error getting boop count:", error);
    return 0;
  }
}

/**
 * Get boop history
 */
export async function getBoopHistory(coupleId: string, limitCount: number = 20) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/boops`),
      where("type", "==", "boop")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.boopedat.toMillis() - a.boopedat.toMillis())
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error getting boop history:", error);
    return [];
  }
}

/**
 * Listen to boops in real-time
 */
export function listenToBoops(
  coupleId: string,
  callback: (boops: any[]) => void
) {
  const q = query(
    collection(db, `couples/${coupleId}/boops`),
    where("type", "==", "boop")
  );

  return onSnapshot(q, (snapshot) => {
    const boops = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.boopedat.toMillis() - a.boopedat.toMillis());

    callback(boops);
  });
}

/**
 * Get last boop info
 */
export async function getLastBoop(coupleId: string) {
  try {
    const boops = await getBoopHistory(coupleId, 1);
    return boops[0] || null;
  } catch (error) {
    console.error("Error getting last boop:", error);
    return null;
  }
}

/**
 * Get boop stats
 */
export async function getBoopStats(coupleId: string) {
  try {
    const total = await getBoopCount(coupleId);
    const history = await getBoopHistory(coupleId, 100);

    // Count by user
    const counts: { [key: string]: number } = {};
    history.forEach((boop: any) => {
      counts[boop.fromUid] = (counts[boop.fromUid] || 0) + 1;
    });

    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBoops = history.filter((b: any) => {
      const boopDate = b.boopedat.toDate();
      boopDate.setHours(0, 0, 0, 0);
      return boopDate.getTime() === today.getTime();
    }).length;

    return {
      totalBoops: total,
      todayBoops,
      byUser: counts,
      lastBoop: await getLastBoop(coupleId),
    };
  } catch (error) {
    console.error("Error getting boop stats:", error);
    return {
      totalBoops: 0,
      todayBoops: 0,
      byUser: {},
      lastBoop: null,
    };
  }
}

/**
 * Create boop notification
 */
async function createBoopNotification(
  coupleId: string,
  toUid: string,
  fromName: string
) {
  try {
    const notificationsRef = collection(
      db,
      `couples/${coupleId}/notifications`
    );
    await addDoc(notificationsRef, {
      type: "boop",
      recipientUid: toUid,
      title: `${fromName} booped you! 👆`,
      body: "Quick, boop them back! 😄",
      createdAt: Timestamp.now(),
      isRead: false,
    });
  } catch (error) {
    console.error("Error creating boop notification:", error);
  }
}

/**
 * Get boop streak
 */
export async function getBoopStreak(
  coupleId: string,
  userUid: string
): Promise<number> {
  try {
    const history = await getBoopHistory(coupleId, 100);

    let streak = 0;
    const userBoops = history.filter((b: any) => b.fromUid === userUid);

    if (userBoops.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < userBoops.length; i++) {
      const boopDate = userBoops[i].boopedat.toDate();
      boopDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (boopDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Error getting boop streak:", error);
    return 0;
  }
}

/**
 * Get boops per day average
 */
export async function getBoopsPerDay(coupleId: string): Promise<number> {
  try {
    const history = await getBoopHistory(coupleId, 100);
    if (history.length === 0) return 0;

    const firstBoopDate = history[history.length - 1].boopedat.toDate();
    const lastBoopDate = history[0].boopedat.toDate();

    const daysDiff = Math.ceil(
      (lastBoopDate.getTime() - firstBoopDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysDiff > 0 ? Math.round(history.length / daysDiff * 10) / 10 : history.length;
  } catch (error) {
    console.error("Error calculating boops per day:", error);
    return 0;
  }
}

export default {
  sendBoop,
  getBoopCount,
  getBoopHistory,
  listenToBoops,
  getLastBoop,
  getBoopStats,
  getBoopStreak,
  getBoopsPerDay,
};
