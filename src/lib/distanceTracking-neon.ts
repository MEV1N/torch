/**
 * Distance Tracking System (Neon)
 * File: src/lib/distanceTracking-neon.ts
 */

import { query } from '@/lib/db'

export interface DistanceMetric {
  id: string
  coupleId: string
  userId: string
  latitude: number
  longitude: number
  distance: number
  timestamp: Date
}

/**
 * Record location and calculate distance
 */
export async function recordDistance(
  coupleId: string,
  userId: string,
  latitude: number,
  longitude: number,
  partnerLat?: number,
  partnerLng?: number
): Promise<number> {
  try {
    // Calculate distance using Haversine formula
    const distance = partnerLat && partnerLng
      ? calculateDistance(latitude, longitude, partnerLat, partnerLng)
      : 0

    const result = await query(
      `INSERT INTO distance_tracking (couple_id, user_id, latitude, longitude, distance)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING distance`,
      [coupleId, userId, latitude, longitude, distance]
    )

    return result[0].distance
  } catch (error) {
    console.error('Error recording distance:', error)
    throw error
  }
}

/**
 * Haversine formula to calculate distance between two coordinates
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Get current distance
 */
export async function getCurrentDistance(coupleId: string): Promise<number> {
  try {
    const result = await query(
      `SELECT distance FROM distance_tracking
       WHERE couple_id = $1
       ORDER BY timestamp DESC
       LIMIT 1`,
      [coupleId]
    )

    return result.length > 0 ? result[0].distance : 0
  } catch (error) {
    console.error('Error getting current distance:', error)
    return 0
  }
}

/**
 * Get distance history
 */
export async function getDistanceHistory(coupleId: string, days: number = 30) {
  try {
    return await query(
      `SELECT distance, timestamp
       FROM distance_tracking
       WHERE couple_id = $1 AND timestamp >= NOW() - INTERVAL '${days} days'
       ORDER BY timestamp DESC`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error getting distance history:', error)
    return []
  }
}

/**
 * Get average distance
 */
export async function getAverageDistance(coupleId: string, days: number = 30): Promise<number> {
  try {
    const result = await query(
      `SELECT AVG(distance) as avg_distance
       FROM distance_tracking
       WHERE couple_id = $1 AND timestamp >= NOW() - INTERVAL '${days} days'`,
      [coupleId]
    )

    return result[0]?.avg_distance || 0
  } catch (error) {
    console.error('Error getting average distance:', error)
    return 0
  }
}

/**
 * Get distance statistics
 */
export async function getDistanceStats(coupleId: string) {
  try {
    const result = await query(
      `SELECT
        MIN(distance) as closest,
        MAX(distance) as farthest,
        AVG(distance) as average,
        COUNT(*) as measurements
       FROM distance_tracking
       WHERE couple_id = $1`,
      [coupleId]
    )

    return {
      closest: result[0]?.closest || 0,
      farthest: result[0]?.farthest || 0,
      average: result[0]?.average || 0,
      measurements: result[0]?.measurements || 0,
    }
  } catch (error) {
    console.error('Error getting distance stats:', error)
    return null
  }
}

/**
 * Check if couple is close
 */
export async function isCoupleClosed(coupleId: string, thresholdMiles: number = 1): Promise<boolean> {
  try {
    const distance = await getCurrentDistance(coupleId)
    return distance <= thresholdMiles
  } catch (error) {
    console.error('Error checking if couple is close:', error)
    return false
  }
}
