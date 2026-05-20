/**
 * Memories System (Neon)
 * File: src/lib/memories-neon.ts
 */

import { query } from '@/lib/db'
import { uploadToS3, deleteFromS3 } from '@/lib/s3'

export interface Memory {
  id: string
  coupleId: string
  title: string
  description: string
  imageUrl?: string
  tags: string[]
  createdAt: Date
  isFavorite: boolean
}

/**
 * Create a memory
 */
export async function createMemory(
  coupleId: string,
  title: string,
  description: string,
  imageBuffer?: Buffer,
  tags: string[] = []
): Promise<string> {
  try {
    let imageUrl: string | null = null

    if (imageBuffer) {
      const fileName = `memories/${coupleId}/memory-${Date.now()}.jpg`
      imageUrl = await uploadToS3(imageBuffer, fileName, 'image/jpeg')
    }

    const result = await query(
      `INSERT INTO memories (couple_id, title, description, image_url, tags)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [coupleId, title, description, imageUrl, JSON.stringify(tags)]
    )

    return result[0].id
  } catch (error) {
    console.error('Error creating memory:', error)
    throw error
  }
}

/**
 * Get all memories
 */
export async function getMemories(coupleId: string, limitCount: number = 50): Promise<Memory[]> {
  try {
    return await query(
      `SELECT id, couple_id as "coupleId", title, description, image_url as "imageUrl",
              tags, created_at as "createdAt", is_favorite as "isFavorite"
       FROM memories
       WHERE couple_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [coupleId, limitCount]
    )
  } catch (error) {
    console.error('Error getting memories:', error)
    return []
  }
}

/**
 * Get favorite memories
 */
export async function getFavoriteMemories(coupleId: string): Promise<Memory[]> {
  try {
    return await query(
      `SELECT id, couple_id as "coupleId", title, description, image_url as "imageUrl",
              tags, created_at as "createdAt", is_favorite as "isFavorite"
       FROM memories
       WHERE couple_id = $1 AND is_favorite = TRUE
       ORDER BY created_at DESC`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error getting favorite memories:', error)
    return []
  }
}

/**
 * Search memories
 */
export async function searchMemories(coupleId: string, searchTerm: string): Promise<Memory[]> {
  try {
    return await query(
      `SELECT id, couple_id as "coupleId", title, description, image_url as "imageUrl",
              tags, created_at as "createdAt", is_favorite as "isFavorite"
       FROM memories
       WHERE couple_id = $1 AND (title ILIKE $2 OR description ILIKE $2 OR tags::text ILIKE $2)
       ORDER BY created_at DESC`,
      [coupleId, `%${searchTerm}%`]
    )
  } catch (error) {
    console.error('Error searching memories:', error)
    return []
  }
}

/**
 * Toggle memory as favorite
 */
export async function toggleMemoryFavorite(coupleId: string, memoryId: string): Promise<void> {
  try {
    await query(
      `UPDATE memories SET is_favorite = NOT is_favorite WHERE couple_id = $1 AND id = $2`,
      [coupleId, memoryId]
    )
  } catch (error) {
    console.error('Error toggling memory favorite:', error)
    throw error
  }
}

/**
 * Delete memory
 */
export async function deleteMemory(coupleId: string, memoryId: string, imageUrl?: string): Promise<void> {
  try {
    if (imageUrl) {
      const key = imageUrl.split('.com/')[1]
      await deleteFromS3(key)
    }

    await query(`DELETE FROM memories WHERE couple_id = $1 AND id = $2`, [coupleId, memoryId])
  } catch (error) {
    console.error('Error deleting memory:', error)
    throw error
  }
}

/**
 * Get memories by tag
 */
export async function getMemoriesByTag(coupleId: string, tag: string): Promise<Memory[]> {
  try {
    return await query(
      `SELECT id, couple_id as "coupleId", title, description, image_url as "imageUrl",
              tags, created_at as "createdAt", is_favorite as "isFavorite"
       FROM memories
       WHERE couple_id = $1 AND tags::text LIKE $2
       ORDER BY created_at DESC`,
      [coupleId, `%${tag}%`]
    )
  } catch (error) {
    console.error('Error getting memories by tag:', error)
    return []
  }
}

/**
 * Get memory statistics
 */
export async function getMemoryStats(coupleId: string) {
  try {
    const result = await query(
      `SELECT
        COUNT(*) as total_memories,
        COUNT(CASE WHEN is_favorite = TRUE THEN 1 END) as favorite_count,
        COUNT(DISTINCT DATE(created_at)) as days_with_memories
       FROM memories
       WHERE couple_id = $1`,
      [coupleId]
    )

    return result[0]
  } catch (error) {
    console.error('Error getting memory stats:', error)
    return null
  }
}

/**
 * Get memory timeline
 */
export async function getMemoryTimeline(coupleId: string) {
  try {
    return await query(
      `SELECT
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
       FROM memories
       WHERE couple_id = $1
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month DESC`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error getting memory timeline:', error)
    return []
  }
}
