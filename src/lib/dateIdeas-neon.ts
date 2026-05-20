/**
 * Date Ideas System (Neon)
 * File: src/lib/dateIdeas-neon.ts
 */

import { query } from '@/lib/db'

export const DATE_IDEA_TEMPLATES = [
  { title: 'Sunrise Picnic', category: 'outdoor', difficulty: 'easy' },
  { title: 'Cooking Class Together', category: 'indoor', difficulty: 'medium' },
  { title: 'Couples Massage', category: 'spa', difficulty: 'easy' },
  { title: 'Road Trip Adventure', category: 'outdoor', difficulty: 'hard' },
  { title: 'Movie Marathon Night', category: 'indoor', difficulty: 'easy' },
  { title: 'Wine Tasting Experience', category: 'food', difficulty: 'medium' },
  { title: 'Beach Day', category: 'outdoor', difficulty: 'easy' },
  { title: 'Couples Photoshoot', category: 'creative', difficulty: 'medium' },
  { title: 'Hiking Adventure', category: 'outdoor', difficulty: 'hard' },
  { title: 'Dinner Cruise', category: 'romantic', difficulty: 'hard' },
]

/**
 * Suggest a date idea
 */
export async function suggestDateIdea(coupleId: string): Promise<any> {
  try {
    const idea = DATE_IDEA_TEMPLATES[Math.floor(Math.random() * DATE_IDEA_TEMPLATES.length)]

    const result = await query(
      `INSERT INTO date_ideas (couple_id, title, category, difficulty, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, category, difficulty, created_at`,
      [coupleId, idea.title, idea.category, idea.difficulty, '']
    )

    return result[0]
  } catch (error) {
    console.error('Error suggesting date idea:', error)
    throw error
  }
}

/**
 * Create custom date idea
 */
export async function createDateIdea(
  coupleId: string,
  title: string,
  category: string,
  difficulty: string,
  description: string
): Promise<string> {
  try {
    const result = await query(
      `INSERT INTO date_ideas (couple_id, title, category, difficulty, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [coupleId, title, category, difficulty, description]
    )

    return result[0].id
  } catch (error) {
    console.error('Error creating date idea:', error)
    throw error
  }
}

/**
 * Get date ideas
 */
export async function getDateIdeas(coupleId: string, category?: string) {
  try {
    let sql = `SELECT id, couple_id, title, category, difficulty, description, completed_at, created_at
               FROM date_ideas
               WHERE couple_id = $1`
    const params: any[] = [coupleId]

    if (category) {
      sql += ` AND category = $2`
      params.push(category)
    }

    sql += ` ORDER BY created_at DESC`

    return await query(sql, params)
  } catch (error) {
    console.error('Error getting date ideas:', error)
    return []
  }
}

/**
 * Mark date as completed
 */
export async function markDateAsCompleted(coupleId: string, dateId: string): Promise<void> {
  try {
    await query(
      `UPDATE date_ideas SET completed_at = NOW() WHERE couple_id = $1 AND id = $2`,
      [coupleId, dateId]
    )
  } catch (error) {
    console.error('Error marking date as completed:', error)
    throw error
  }
}

/**
 * Delete date idea
 */
export async function deleteDateIdea(coupleId: string, dateId: string): Promise<void> {
  try {
    await query(`DELETE FROM date_ideas WHERE couple_id = $1 AND id = $2`, [coupleId, dateId])
  } catch (error) {
    console.error('Error deleting date idea:', error)
    throw error
  }
}

/**
 * Get completed dates
 */
export async function getCompletedDates(coupleId: string, limitCount: number = 10) {
  try {
    return await query(
      `SELECT id, title, category, difficulty, completed_at
       FROM date_ideas
       WHERE couple_id = $1 AND completed_at IS NOT NULL
       ORDER BY completed_at DESC
       LIMIT $2`,
      [coupleId, limitCount]
    )
  } catch (error) {
    console.error('Error getting completed dates:', error)
    return []
  }
}

/**
 * Get date statistics
 */
export async function getDateStats(coupleId: string) {
  try {
    const result = await query(
      `SELECT
        COUNT(*) as total_ideas,
        COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed_dates,
        COUNT(DISTINCT category) as categories
       FROM date_ideas
       WHERE couple_id = $1`,
      [coupleId]
    )

    return result[0]
  } catch (error) {
    console.error('Error getting date stats:', error)
    return null
  }
}
