/**
 * Milestones System (Neon)
 * File: src/lib/milestones-neon.ts
 */

import { query } from '@/lib/db'

export const MILESTONE_TEMPLATES = [
  { title: 'First Kiss', icon: '💋', daysAfter: 0 },
  { title: 'First Date Anniversary', icon: '🎂', daysAfter: 365 },
  { title: 'First Vacation Together', icon: '✈️', daysAfter: null },
  { title: 'Meeting Parents', icon: '👨‍👩‍👧', daysAfter: null },
  { title: 'Living Together', icon: '🏠', daysAfter: null },
  { title: 'Said "I Love You"', icon: '💕', daysAfter: null },
  { title: 'Engagement', icon: '💍', daysAfter: null },
  { title: 'Marriage', icon: '💒', daysAfter: null },
]

/**
 * Create a milestone
 */
export async function createMilestone(
  coupleId: string,
  title: string,
  description: string,
  icon: string,
  achievedAt: Date
): Promise<string> {
  try {
    const result = await query(
      `INSERT INTO milestones (couple_id, title, description, icon, achieved_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [coupleId, title, description, icon, achievedAt]
    )

    return result[0].id
  } catch (error) {
    console.error('Error creating milestone:', error)
    throw error
  }
}

/**
 * Get all milestones
 */
export async function getMilestones(coupleId: string) {
  try {
    return await query(
      `SELECT id, couple_id, title, description, icon, achieved_at, created_at
       FROM milestones
       WHERE couple_id = $1
       ORDER BY achieved_at DESC`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error getting milestones:', error)
    return []
  }
}

/**
 * Get next upcoming milestone
 */
export async function getNextMilestone(coupleId: string) {
  try {
    const result = await query(
      `SELECT id, title, icon, achieved_at
       FROM milestones
       WHERE couple_id = $1 AND achieved_at > NOW()
       ORDER BY achieved_at ASC
       LIMIT 1`,
      [coupleId]
    )

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error('Error getting next milestone:', error)
    return null
  }
}

/**
 * Update milestone
 */
export async function updateMilestone(
  coupleId: string,
  milestoneId: string,
  updates: Record<string, any>
): Promise<void> {
  try {
    const { title, description, icon, achieved_at } = updates

    await query(
      `UPDATE milestones
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           icon = COALESCE($3, icon),
           achieved_at = COALESCE($4, achieved_at)
       WHERE couple_id = $5 AND id = $6`,
      [title, description, icon, achieved_at, coupleId, milestoneId]
    )
  } catch (error) {
    console.error('Error updating milestone:', error)
    throw error
  }
}

/**
 * Delete milestone
 */
export async function deleteMilestone(coupleId: string, milestoneId: string): Promise<void> {
  try {
    await query(`DELETE FROM milestones WHERE couple_id = $1 AND id = $2`, [coupleId, milestoneId])
  } catch (error) {
    console.error('Error deleting milestone:', error)
    throw error
  }
}

/**
 * Get milestone timeline
 */
export async function getMilestoneTimeline(coupleId: string) {
  try {
    return await query(
      `SELECT
        EXTRACT(YEAR FROM achieved_at) as year,
        COUNT(*) as count
       FROM milestones
       WHERE couple_id = $1
       GROUP BY EXTRACT(YEAR FROM achieved_at)
       ORDER BY year DESC`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error getting milestone timeline:', error)
    return []
  }
}

/**
 * Get milestone statistics
 */
export async function getMilestoneStats(coupleId: string) {
  try {
    const result = await query(
      `SELECT
        COUNT(*) as total_milestones,
        COUNT(CASE WHEN achieved_at <= NOW() THEN 1 END) as completed
       FROM milestones
       WHERE couple_id = $1`,
      [coupleId]
    )

    return result[0]
  } catch (error) {
    console.error('Error getting milestone stats:', error)
    return null
  }
}
