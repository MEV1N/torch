/**
 * Relationship Stats System (Neon)
 * File: src/lib/relationshipStats-neon.ts
 */

import { query } from '@/lib/db'

/**
 * Get comprehensive relationship statistics
 */
export async function getRelationshipStats(coupleId: string) {
  try {
    // Total interactions
    const totalInteractions = await query(
      `SELECT
        (SELECT COUNT(*) FROM love_notes WHERE couple_id = $1) +
        (SELECT COUNT(*) FROM boops WHERE couple_id = $1) +
        (SELECT COUNT(*) FROM messages WHERE couple_id = $1) +
        (SELECT COUNT(*) FROM photos WHERE couple_id = $1)
       as total`,
      [coupleId]
    )

    // Messages stats
    const messageStats = await query(
      `SELECT
        COUNT(*) as total_messages,
        COUNT(DISTINCT DATE(created_at)) as days_chatted,
        AVG(LENGTH(text)) as avg_message_length
       FROM messages WHERE couple_id = $1`,
      [coupleId]
    )

    // Love notes stats
    const loveNoteStats = await query(
      `SELECT
        COUNT(*) as total_notes,
        COUNT(DISTINCT sentiment) as sentiment_types
       FROM love_notes WHERE couple_id = $1`,
      [coupleId]
    )

    // Photos stats
    const photoStats = await query(
      `SELECT
        COUNT(*) as total_photos,
        COUNT(CASE WHEN is_viewed = TRUE THEN 1 END) as viewed_photos
       FROM photos WHERE couple_id = $1`,
      [coupleId]
    )

    // Streak stats
    const streakStats = await query(
      `SELECT current_streak, longest_streak FROM streaks WHERE couple_id = $1`,
      [coupleId]
    )

    return {
      totalInteractions: totalInteractions[0]?.total || 0,
      messages: messageStats[0],
      loveNotes: loveNoteStats[0],
      photos: photoStats[0],
      streak: streakStats[0] || { current_streak: 0, longest_streak: 0 },
    }
  } catch (error) {
    console.error('Error getting relationship stats:', error)
    return null
  }
}

/**
 * Get activity timeline
 */
export async function getActivityTimeline(coupleId: string, days: number = 30) {
  try {
    return await query(
      `SELECT
        DATE(created_at) as date,
        COUNT(*) as total,
        'messages' as type
       FROM messages
       WHERE couple_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       
       UNION ALL
       
       SELECT
        DATE(created_at) as date,
        COUNT(*) as total,
        'love_notes' as type
       FROM love_notes
       WHERE couple_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       
       ORDER BY date DESC`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error getting activity timeline:', error)
    return []
  }
}

/**
 * Get first date anniversary
 */
export async function getFirstDateAnniversary(coupleId: string) {
  try {
    const result = await query(
      `SELECT start_date FROM couples WHERE id = $1`,
      [coupleId]
    )

    if (result.length === 0) return null

    const startDate = new Date(result[0].start_date)
    const today = new Date()
    const daysTogether = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    const nextAnniversary = new Date(startDate)
    nextAnniversary.setFullYear(today.getFullYear())
    if (nextAnniversary < today) {
      nextAnniversary.setFullYear(today.getFullYear() + 1)
    }

    return {
      startDate,
      daysTogether,
      nextAnniversary,
    }
  } catch (error) {
    console.error('Error getting first date anniversary:', error)
    return null
  }
}

/**
 * Get favorite love note sentiment
 */
export async function getFavoriteSentiment(coupleId: string): Promise<string> {
  try {
    const result = await query(
      `SELECT sentiment, COUNT(*) as count
       FROM love_notes
       WHERE couple_id = $1
       GROUP BY sentiment
       ORDER BY count DESC
       LIMIT 1`,
      [coupleId]
    )

    return result[0]?.sentiment || 'romantic'
  } catch (error) {
    console.error('Error getting favorite sentiment:', error)
    return 'romantic'
  }
}

/**
 * Get communication patterns
 */
export async function getCommunicationPatterns(coupleId: string) {
  try {
    const hourlyPatterns = await query(
      `SELECT
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as count
       FROM messages
       WHERE couple_id = $1
       GROUP BY EXTRACT(HOUR FROM created_at)
       ORDER BY hour`,
      [coupleId]
    )

    const dailyPatterns = await query(
      `SELECT
        TO_CHAR(created_at, 'Day') as day,
        COUNT(*) as count
       FROM messages
       WHERE couple_id = $1
       GROUP BY TO_CHAR(created_at, 'Day')`,
      [coupleId]
    )

    return {
      byHour: hourlyPatterns,
      byDay: dailyPatterns,
    }
  } catch (error) {
    console.error('Error getting communication patterns:', error)
    return null
  }
}

/**
 * Get growth metrics
 */
export async function getGrowthMetrics(coupleId: string, days: number = 90) {
  try {
    const pastStats = await query(
      `SELECT
        COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN id END) as month_1,
        COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '60 days' THEN id END) as month_2,
        COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '90 days' THEN id END) as month_3
       FROM messages
       WHERE couple_id = $1`,
      [coupleId]
    )

    return {
      last30Days: pastStats[0]?.month_1 || 0,
      last60Days: pastStats[0]?.month_2 || 0,
      last90Days: pastStats[0]?.month_3 || 0,
    }
  } catch (error) {
    console.error('Error getting growth metrics:', error)
    return null
  }
}
