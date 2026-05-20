/**
 * Streaks System (Neon)
 * File: src/lib/streaks-neon.ts
 */

import { query } from '@/lib/db'

export const STREAK_MILESTONES = [
  { days: 3, label: 'First Spark ✨', message: '3 days of love!' },
  { days: 7, label: 'Week of Love 💕', message: 'One beautiful week together!' },
  { days: 14, label: 'Two Hearts 💞', message: 'Two weeks of dedication!' },
  { days: 30, label: 'Month of Magic 🌙', message: 'A whole month of love!' },
  { days: 50, label: 'Golden Bond 🌟', message: '50 days strong!' },
  { days: 100, label: 'Century of Love 💯', message: '100 days of pure love!' },
  { days: 200, label: 'Eternal Flame 🔥', message: '200 days and counting!' },
  { days: 365, label: 'Anniversary Star ⭐', message: 'A full year of devotion!' },
]

/**
 * Get streak data for a couple
 */
export async function getStreakData(coupleId: string) {
  try {
    const result = await query(
      `SELECT id, couple_id, current_streak, longest_streak, last_activity_date, created_at
       FROM streaks
       WHERE couple_id = $1`,
      [coupleId]
    )

    if (result.length === 0) {
      // Create initial streak
      const newStreak = await query(
        `INSERT INTO streaks (couple_id, current_streak, longest_streak, last_activity_date)
         VALUES ($1, 0, 0, NULL)
         RETURNING id, couple_id, current_streak, longest_streak, last_activity_date, created_at`,
        [coupleId]
      )
      return newStreak[0]
    }

    return result[0]
  } catch (error) {
    console.error('Error getting streak data:', error)
    throw error
  }
}

/**
 * Update streak (called when user interacts)
 */
export async function updateStreak(coupleId: string) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const current = await getStreakData(coupleId)

    // Already updated today
    if (current.last_activity_date === today) {
      return current
    }

    // Calculate new streak
    const lastDate = current.last_activity_date ? new Date(current.last_activity_date) : null
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let newStreak = 1
    if (lastDate && yesterday.toISOString().split('T')[0] === current.last_activity_date) {
      newStreak = current.current_streak + 1
    }

    const newLongest = Math.max(newStreak, current.longest_streak)

    // Get earned milestones
    const earnedMilestones: string[] = []
    for (const m of STREAK_MILESTONES) {
      if (newStreak >= m.days) {
        earnedMilestones.push(m.label)
      }
    }

    // Update database
    const updated = await query(
      `UPDATE streaks
       SET current_streak = $1, longest_streak = $2, last_activity_date = $3
       WHERE couple_id = $4
       RETURNING id, couple_id, current_streak, longest_streak, last_activity_date, created_at`,
      [newStreak, newLongest, today, coupleId]
    )

    return updated[0]
  } catch (error) {
    console.error('Error updating streak:', error)
    throw error
  }
}

/**
 * Get streak emoji
 */
export function getStreakEmoji(streak: number): string {
  if (streak >= 365) return '⭐'
  if (streak >= 200) return '🔥'
  if (streak >= 100) return '💯'
  if (streak >= 50) return '🌟'
  if (streak >= 30) return '🌙'
  if (streak >= 14) return '💞'
  if (streak >= 7) return '💕'
  if (streak >= 3) return '✨'
  return '🕯️'
}

/**
 * Get streak message
 */
export function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Start your love streak today!'
  if (streak === 1) return 'A beautiful beginning! 🌱'
  if (streak < 7) return 'Keep the flame alive! 🕯️'
  if (streak < 14) return 'A week of love! Growing stronger 💪'
  if (streak < 30) return 'Your love is blooming! 🌸'
  if (streak < 100) return 'Incredible dedication to each other! 💎'
  if (streak < 365) return 'Your love is legendary! 👑'
  return 'A timeless love story! ♾️'
}

/**
 * Record activity
 */
export async function recordActivity(coupleId: string, activityType: string): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0]

    await query(
      `INSERT INTO streak_activities (couple_id, activity_type, activity_date)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [coupleId, activityType, today]
    )

    // Update streak
    await updateStreak(coupleId)
  } catch (error) {
    console.error('Error recording activity:', error)
    throw error
  }
}

/**
 * Get activity history
 */
export async function getActivityHistory(coupleId: string, days: number = 30) {
  try {
    return await query(
      `SELECT activity_type, activity_date, COUNT(*) as count
       FROM streak_activities
       WHERE couple_id = $1 AND activity_date >= NOW() - INTERVAL '${days} days'
       GROUP BY activity_type, activity_date
       ORDER BY activity_date DESC`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error getting activity history:', error)
    return []
  }
}

/**
 * Reset streak (if broken)
 */
export async function resetStreak(coupleId: string): Promise<void> {
  try {
    await query(
      `UPDATE streaks
       SET current_streak = 0, last_activity_date = NULL
       WHERE couple_id = $1`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error resetting streak:', error)
    throw error
  }
}
