/**
 * Photos System (Neon + AWS S3)
 * File: src/lib/photos-neon.ts
 */

import { query } from '@/lib/db'
import { uploadToS3, deleteFromS3 } from '@/lib/s3'

export interface PhotoMessage {
  id: string
  coupleId: string
  senderUid: string
  senderName: string
  photoUrl: string
  thumbnailUrl?: string
  caption?: string
  sentAt: Date
  viewedAt?: Date
  isViewed: boolean
  expiresAt?: Date
  isDisappearing: boolean
  reactions: { userId: string; emoji: string }[]
}

/**
 * Send a photo to partner
 */
export async function sendPhoto(
  coupleId: string,
  senderUid: string,
  senderName: string,
  photoBuffer: Buffer,
  caption?: string,
  isDisappearing: boolean = false
): Promise<string> {
  try {
    // Upload to S3
    const fileName = `photos/${coupleId}/photo-${Date.now()}.jpg`
    const photoUrl = await uploadToS3(photoBuffer, fileName, 'image/jpeg')

    // Create database entry
    const expiresAt = isDisappearing ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null

    const result = await query(
      `INSERT INTO photos (couple_id, sender_id, sender_name, photo_url, caption, is_disappearing, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [coupleId, senderUid, senderName, photoUrl, caption, isDisappearing, expiresAt]
    )

    return result[0].id
  } catch (error) {
    console.error('Error sending photo:', error)
    throw error
  }
}

/**
 * Get all photos for a couple
 */
export async function getCouplePhotos(
  coupleId: string,
  limitCount: number = 50
): Promise<PhotoMessage[]> {
  try {
    const photos = await query(
      `SELECT id, couple_id as "coupleId", sender_id as "senderUid", sender_name as "senderName",
              photo_url as "photoUrl", thumbnail_url as "thumbnailUrl", caption, sent_at as "sentAt",
              viewed_at as "viewedAt", is_viewed as "isViewed", expires_at as "expiresAt",
              is_disappearing as "isDisappearing"
       FROM photos
       WHERE couple_id = $1
       ORDER BY sent_at DESC
       LIMIT $2`,
      [coupleId, limitCount]
    )

    return photos
  } catch (error) {
    console.error('Error fetching photos:', error)
    return []
  }
}

/**
 * Mark photo as viewed
 */
export async function markPhotoAsViewed(photoId: string): Promise<void> {
  try {
    await query(
      `UPDATE photos SET is_viewed = TRUE, viewed_at = NOW() WHERE id = $1`,
      [photoId]
    )
  } catch (error) {
    console.error('Error marking photo as viewed:', error)
    throw error
  }
}

/**
 * Delete a photo
 */
export async function deletePhoto(photoId: string, photoUrl: string): Promise<void> {
  try {
    // Delete from S3
    const key = photoUrl.split('.com/')[1]
    await deleteFromS3(key)

    // Delete from database
    await query(`DELETE FROM photos WHERE id = $1`, [photoId])
  } catch (error) {
    console.error('Error deleting photo:', error)
    throw error
  }
}

/**
 * Get unviewed photo count
 */
export async function getUnviewedPhotoCount(coupleId: string, userId: string): Promise<number> {
  try {
    const result = await query(
      `SELECT COUNT(*) as count FROM photos
       WHERE couple_id = $1 AND sender_id != $2 AND is_viewed = FALSE`,
      [coupleId, userId]
    )

    return result[0].count
  } catch (error) {
    console.error('Error getting unviewed photo count:', error)
    return 0
  }
}

/**
 * React to photo with emoji
 */
export async function reactToPhoto(
  photoId: string,
  userId: string,
  emoji: string
): Promise<void> {
  try {
    // Delete old reaction if exists
    await query(`DELETE FROM photo_reactions WHERE photo_id = $1 AND user_id = $2`, [photoId, userId])

    // Add new reaction
    await query(
      `INSERT INTO photo_reactions (photo_id, user_id, emoji)
       VALUES ($1, $2, $3)`,
      [photoId, userId, emoji]
    )
  } catch (error) {
    console.error('Error reacting to photo:', error)
    throw error
  }
}

/**
 * Get photo reactions
 */
export async function getPhotoReactions(photoId: string) {
  try {
    return await query(
      `SELECT user_id, emoji FROM photo_reactions WHERE photo_id = $1`,
      [photoId]
    )
  } catch (error) {
    console.error('Error getting photo reactions:', error)
    return []
  }
}
