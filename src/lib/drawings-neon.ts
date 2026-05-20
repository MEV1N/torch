/**
 * Drawings System (Neon + AWS S3)
 * File: src/lib/drawings-neon.ts
 */

import { query } from '@/lib/db'
import { uploadToS3, deleteFromS3 } from '@/lib/s3'

export interface Drawing {
  id: string
  coupleId: string
  createdByUid: string
  createdByName: string
  drawingUrl: string
  drawingData?: string
  title?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  likes: number
  reactions: { userId: string; emoji: string }[]
}

/**
 * Upload a drawing
 */
export async function uploadDrawing(
  coupleId: string,
  drawingImage: Buffer,
  createdByUid: string,
  createdByName: string,
  title?: string,
  description?: string,
  drawingData?: string
): Promise<string> {
  try {
    // Upload image to S3
    const fileName = `drawings/${coupleId}/drawing-${Date.now()}.png`
    const drawingUrl = await uploadToS3(drawingImage, fileName, 'image/png')

    // Create database entry
    const result = await query(
      `INSERT INTO drawings (couple_id, created_by_uid, created_by_name, drawing_url, drawing_data, title, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [coupleId, createdByUid, createdByName, drawingUrl, drawingData, title, description]
    )

    return result[0].id
  } catch (error) {
    console.error('Error uploading drawing:', error)
    throw error
  }
}

/**
 * Get all drawings for a couple
 */
export async function getCoupleDrawings(coupleId: string): Promise<Drawing[]> {
  try {
    return await query(
      `SELECT id, couple_id as "coupleId", created_by_uid as "createdByUid",
              created_by_name as "createdByName", drawing_url as "drawingUrl",
              drawing_data as "drawingData", title, description,
              created_at as "createdAt", updated_at as "updatedAt",
              likes
       FROM drawings
       WHERE couple_id = $1
       ORDER BY created_at DESC`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error fetching drawings:', error)
    return []
  }
}

/**
 * Get recent drawings
 */
export async function getRecentDrawings(coupleId: string, limitCount: number = 3): Promise<Drawing[]> {
  try {
    return await query(
      `SELECT id, couple_id as "coupleId", created_by_uid as "createdByUid",
              created_by_name as "createdByName", drawing_url as "drawingUrl",
              drawing_data as "drawingData", title, description,
              created_at as "createdAt", updated_at as "updatedAt",
              likes
       FROM drawings
       WHERE couple_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [coupleId, limitCount]
    )
  } catch (error) {
    console.error('Error fetching recent drawings:', error)
    return []
  }
}

/**
 * Delete a drawing
 */
export async function deleteDrawing(drawingId: string, drawingUrl: string): Promise<void> {
  try {
    // Delete from S3
    const key = drawingUrl.split('.com/')[1]
    await deleteFromS3(key)

    // Delete from database
    await query(`DELETE FROM drawings WHERE id = $1`, [drawingId])
  } catch (error) {
    console.error('Error deleting drawing:', error)
    throw error
  }
}

/**
 * Like a drawing
 */
export async function likeDrawing(drawingId: string): Promise<void> {
  try {
    await query(`UPDATE drawings SET likes = likes + 1 WHERE id = $1`, [drawingId])
  } catch (error) {
    console.error('Error liking drawing:', error)
    throw error
  }
}

/**
 * React to drawing with emoji
 */
export async function reactToDrawing(
  drawingId: string,
  userId: string,
  emoji: string
): Promise<void> {
  try {
    // Delete old reaction if exists
    await query(
      `DELETE FROM drawing_reactions WHERE drawing_id = $1 AND user_id = $2`,
      [drawingId, userId]
    )

    // Add new reaction
    await query(
      `INSERT INTO drawing_reactions (drawing_id, user_id, emoji)
       VALUES ($1, $2, $3)`,
      [drawingId, userId, emoji]
    )
  } catch (error) {
    console.error('Error reacting to drawing:', error)
    throw error
  }
}

/**
 * Get drawing reactions
 */
export async function getDrawingReactions(drawingId: string) {
  try {
    return await query(
      `SELECT user_id, emoji FROM drawing_reactions WHERE drawing_id = $1`,
      [drawingId]
    )
  } catch (error) {
    console.error('Error getting drawing reactions:', error)
    return []
  }
}

/**
 * Get drawing statistics
 */
export async function getDrawingStats(coupleId: string) {
  try {
    const result = await query(
      `SELECT
        COUNT(*) as total_drawings,
        SUM(likes) as total_likes,
        AVG(likes) as avg_likes
       FROM drawings
       WHERE couple_id = $1`,
      [coupleId]
    )

    return {
      totalDrawings: result[0].total_drawings || 0,
      totalLikes: result[0].total_likes || 0,
      avgLikes: result[0].avg_likes || 0,
    }
  } catch (error) {
    console.error('Error getting drawing stats:', error)
    return null
  }
}
