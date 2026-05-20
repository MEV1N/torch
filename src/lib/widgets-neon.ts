/**
 * Widgets System (Neon)
 * File: src/lib/widgets-neon.ts
 */

import { query } from '@/lib/db'

export interface Widget {
  id: string
  coupleId: string
  type: 'photo' | 'text' | 'counter' | 'timer' | 'quote' | 'drawing' | 'game' | 'streak'
  title: string
  content?: string
  createdByUid: string
  createdAt: Date
  updatedAt: Date
  position: number
  isVisible: boolean
  metadata?: Record<string, any>
}

/**
 * Create a new widget
 */
export async function createWidget(
  coupleId: string,
  type: string,
  title: string,
  createdByUid: string,
  content?: string,
  metadata?: Record<string, any>
): Promise<string> {
  try {
    // Get highest position
    const maxPos = await query(
      `SELECT COALESCE(MAX(position), 0) as max_pos FROM widgets WHERE couple_id = $1`,
      [coupleId]
    )

    const nextPosition = (maxPos[0].max_pos || 0) + 1

    const result = await query(
      `INSERT INTO widgets (couple_id, type, title, created_by_uid, content, position, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [coupleId, type, title, createdByUid, content, nextPosition, JSON.stringify(metadata || {})]
    )

    return result[0].id
  } catch (error) {
    console.error('Error creating widget:', error)
    throw error
  }
}

/**
 * Get all widgets for a couple
 */
export async function getCoupleWidgets(coupleId: string): Promise<Widget[]> {
  try {
    return await query(
      `SELECT id, couple_id as "coupleId", type, title, content,
              created_by_uid as "createdByUid", created_at as "createdAt",
              updated_at as "updatedAt", position, is_visible as "isVisible",
              metadata
       FROM widgets
       WHERE couple_id = $1 AND is_visible = TRUE
       ORDER BY position ASC`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error fetching widgets:', error)
    return []
  }
}

/**
 * Get widget by ID
 */
export async function getWidget(coupleId: string, widgetId: string): Promise<Widget | null> {
  try {
    const result = await query(
      `SELECT id, couple_id as "coupleId", type, title, content,
              created_by_uid as "createdByUid", created_at as "createdAt",
              updated_at as "updatedAt", position, is_visible as "isVisible",
              metadata
       FROM widgets
       WHERE couple_id = $1 AND id = $2`,
      [coupleId, widgetId]
    )

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error('Error fetching widget:', error)
    return null
  }
}

/**
 * Update widget
 */
export async function updateWidget(
  coupleId: string,
  widgetId: string,
  updates: Partial<Widget>
): Promise<void> {
  try {
    const { title, content, position, isVisible, metadata } = updates

    await query(
      `UPDATE widgets
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           position = COALESCE($3, position),
           is_visible = COALESCE($4, is_visible),
           metadata = COALESCE($5, metadata),
           updated_at = NOW()
       WHERE couple_id = $6 AND id = $7`,
      [title, content, position, isVisible, JSON.stringify(metadata || {}), coupleId, widgetId]
    )
  } catch (error) {
    console.error('Error updating widget:', error)
    throw error
  }
}

/**
 * Delete widget
 */
export async function deleteWidget(coupleId: string, widgetId: string): Promise<void> {
  try {
    await query(`DELETE FROM widgets WHERE couple_id = $1 AND id = $2`, [coupleId, widgetId])
  } catch (error) {
    console.error('Error deleting widget:', error)
    throw error
  }
}

/**
 * Reorder widgets
 */
export async function reorderWidgets(coupleId: string, widgetOrder: string[]): Promise<void> {
  try {
    for (let i = 0; i < widgetOrder.length; i++) {
      await query(
        `UPDATE widgets SET position = $1, updated_at = NOW() WHERE couple_id = $2 AND id = $3`,
        [i, coupleId, widgetOrder[i]]
      )
    }
  } catch (error) {
    console.error('Error reordering widgets:', error)
    throw error
  }
}

/**
 * Toggle widget visibility
 */
export async function toggleWidgetVisibility(coupleId: string, widgetId: string): Promise<void> {
  try {
    await query(
      `UPDATE widgets SET is_visible = NOT is_visible, updated_at = NOW()
       WHERE couple_id = $1 AND id = $2`,
      [coupleId, widgetId]
    )
  } catch (error) {
    console.error('Error toggling widget visibility:', error)
    throw error
  }
}
