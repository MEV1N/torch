/**
 * Location Services (Neon)
 * File: src/lib/location-neon.ts
 */

import { query } from '@/lib/db'

export interface LocationUpdate {
  userId: string
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
}

/**
 * Update user location
 */
export async function updateUserLocation(
  coupleId: string,
  userId: string,
  latitude: number,
  longitude: number,
  accuracy: number = 0
): Promise<void> {
  try {
    await query(
      `INSERT INTO location_updates (couple_id, user_id, latitude, longitude, accuracy)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (couple_id, user_id) DO UPDATE
       SET latitude = EXCLUDED.latitude,
           longitude = EXCLUDED.longitude,
           accuracy = EXCLUDED.accuracy,
           updated_at = NOW()`,
      [coupleId, userId, latitude, longitude, accuracy]
    )
  } catch (error) {
    console.error('Error updating location:', error)
    throw error
  }
}

/**
 * Get user's current location
 */
export async function getUserLocation(coupleId: string, userId: string) {
  try {
    const result = await query(
      `SELECT user_id, latitude, longitude, accuracy, updated_at
       FROM location_updates
       WHERE couple_id = $1 AND user_id = $2`,
      [coupleId, userId]
    )

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error('Error getting user location:', error)
    return null
  }
}

/**
 * Get partner's location
 */
export async function getPartnerLocation(coupleId: string, currentUserId: string) {
  try {
    // Get couple info to find partner
    const couple = await query(
      `SELECT user1_id, user2_id FROM couples WHERE id = $1`,
      [coupleId]
    )

    if (couple.length === 0) return null

    const partnerId = couple[0].user1_id === currentUserId
      ? couple[0].user2_id
      : couple[0].user1_id

    return await getUserLocation(coupleId, partnerId)
  } catch (error) {
    console.error('Error getting partner location:', error)
    return null
  }
}

/**
 * Get location history
 */
export async function getLocationHistory(
  coupleId: string,
  userId: string,
  days: number = 7
) {
  try {
    return await query(
      `SELECT latitude, longitude, accuracy, updated_at
       FROM location_updates
       WHERE couple_id = $1 AND user_id = $2 AND updated_at >= NOW() - INTERVAL '${days} days'
       ORDER BY updated_at DESC`,
      [coupleId, userId]
    )
  } catch (error) {
    console.error('Error getting location history:', error)
    return []
  }
}

/**
 * Check if locations are shared
 */
export async function areLocationsShared(coupleId: string): Promise<boolean> {
  try {
    const result = await query(
      `SELECT COUNT(*) as count FROM location_updates WHERE couple_id = $1`,
      [coupleId]
    )

    return result[0].count >= 2
  } catch (error) {
    console.error('Error checking if locations are shared:', error)
    return false
  }
}

/**
 * Enable location sharing
 */
export async function enableLocationSharing(coupleId: string, userId: string): Promise<void> {
  try {
    await query(
      `UPDATE user_preferences
       SET location_sharing = TRUE
       WHERE couple_id = $1 AND user_id = $2`,
      [coupleId, userId]
    )
  } catch (error) {
    console.error('Error enabling location sharing:', error)
    throw error
  }
}

/**
 * Disable location sharing
 */
export async function disableLocationSharing(coupleId: string, userId: string): Promise<void> {
  try {
    await query(
      `UPDATE user_preferences
       SET location_sharing = FALSE
       WHERE couple_id = $1 AND user_id = $2`,
      [coupleId, userId]
    )
  } catch (error) {
    console.error('Error disabling location sharing:', error)
    throw error
  }
}

/**
 * Get location sharing preference
 */
export async function isLocationSharingEnabled(
  coupleId: string,
  userId: string
): Promise<boolean> {
  try {
    const result = await query(
      `SELECT location_sharing FROM user_preferences WHERE couple_id = $1 AND user_id = $2`,
      [coupleId, userId]
    )

    return result.length > 0 ? result[0].location_sharing : false
  } catch (error) {
    console.error('Error getting location sharing preference:', error)
    return false
  }
}

/**
 * Delete old location data
 */
export async function deleteOldLocationData(coupleId: string, daysToKeep: number = 30): Promise<void> {
  try {
    await query(
      `DELETE FROM location_updates
       WHERE couple_id = $1 AND updated_at < NOW() - INTERVAL '${daysToKeep} days'`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error deleting old location data:', error)
    throw error
  }
}
