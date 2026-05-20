/**
 * Torch — Boop Feature (Neon PostgreSQL)
 * Migrated from Firebase to PostgreSQL
 */

import { query, queryOne } from "@/lib/db";

export interface BoopEvent {
  id: string;
  couple_id: string;
  from_user_id: string;
  from_name: string;
  to_user_id: string;
  emoji: string;
  created_at: Date;
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
    // Insert boop record
    await query(
      `INSERT INTO boops (couple_id, from_user_id, from_name, to_user_id, emoji)
       VALUES ($1, $2, $3, $4, $5)`,
      [coupleId, fromUid, fromName, toUid, emoji]
    );

    // Create notification (would be sent via push notification service)
    console.log(`Boop notification: ${fromName} booped ${toUid}`);
  } catch (error) {
    console.error("Error sending boop:", error);
    throw error;
  }
}

/**
 * Get total boop count for couple
 */
export async function getBoopCount(coupleId: string): Promise<number> {
  try {
    const result = await query<{ count: number }>(
      "SELECT COUNT(*) as count FROM boops WHERE couple_id = $1",
      [coupleId]
    );
    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error getting boop count:", error);
    return 0;
  }
}

/**
 * Get boop history
 */
export async function getBoopHistory(
  coupleId: string,
  limit: number = 20
): Promise<BoopEvent[]> {
  try {
    const boops = await query<BoopEvent>(
      `SELECT id, couple_id, from_user_id, from_name, to_user_id, emoji, created_at
       FROM boops
       WHERE couple_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [coupleId, limit]
    );
    return boops;
  } catch (error) {
    console.error("Error getting boop history:", error);
    return [];
  }
}

/**
 * Get last boop
 */
export async function getLastBoop(coupleId: string): Promise<BoopEvent | null> {
  try {
    const boop = await queryOne<BoopEvent>(
      `SELECT id, couple_id, from_user_id, from_name, to_user_id, emoji, created_at
       FROM boops
       WHERE couple_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [coupleId]
    );
    return boop;
  } catch (error) {
    console.error("Error getting last boop:", error);
    return null;
  }
}

/**
 * Get boop statistics
 */
export async function getBoopStats(coupleId: string) {
  try {
    const total = await getBoopCount(coupleId);
    const history = await getBoopHistory(coupleId, 100);

    // Count by user
    const counts: { [key: string]: number } = {};
    history.forEach((boop) => {
      counts[boop.from_user_id] = (counts[boop.from_user_id] || 0) + 1;
    });

    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBoops = history.filter((b) => {
      const boopDate = new Date(b.created_at);
      boopDate.setHours(0, 0, 0, 0);
      return boopDate.getTime() === today.getTime();
    }).length;

    return {
      totalBoops: total,
      todayBoops,
      byUser: counts,
      lastBoop: history.length > 0 ? history[0] : null,
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
 * Get boop streak for user
 */
export async function getBoopStreak(
  coupleId: string,
  userUid: string
): Promise<number> {
  try {
    const history = await getBoopHistory(coupleId, 100);
    const userBoops = history.filter((b) => b.from_user_id === userUid);

    if (userBoops.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < userBoops.length; i++) {
      const boopDate = new Date(userBoops[i].created_at);
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

    const firstBoopDate = new Date(history[history.length - 1].created_at);
    const lastBoopDate = new Date(history[0].created_at);

    const daysDiff = Math.ceil(
      (lastBoopDate.getTime() - firstBoopDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysDiff > 0 ? Math.round((history.length / daysDiff) * 10) / 10 : history.length;
  } catch (error) {
    console.error("Error calculating boops per day:", error);
    return 0;
  }
}

export default {
  sendBoop,
  getBoopCount,
  getBoopHistory,
  getLastBoop,
  getBoopStats,
  getBoopStreak,
  getBoopsPerDay,
};
