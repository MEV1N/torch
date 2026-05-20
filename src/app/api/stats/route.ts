/**
 * API Route: Relationship Statistics
 * File: src/app/api/stats/route.ts
 */

import { query } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const coupleId = searchParams.get('coupleId')
    const statType = searchParams.get('type') // 'overview', 'timeline', 'health', 'communication'

    if (!coupleId) {
      return Response.json({ error: 'Missing coupleId' }, { status: 400 })
    }

    if (statType === 'overview') {
      const [messages, loveNotes, photos, boops, streak] = await Promise.all([
        query(`SELECT COUNT(*) as count FROM messages WHERE couple_id = $1`, [coupleId]),
        query(`SELECT COUNT(*) as count FROM love_notes WHERE couple_id = $1`, [coupleId]),
        query(`SELECT COUNT(*) as count FROM photos WHERE couple_id = $1`, [coupleId]),
        query(`SELECT COUNT(*) as count FROM boops WHERE couple_id = $1`, [coupleId]),
        query(`SELECT current_streak, longest_streak FROM streaks WHERE couple_id = $1`, [coupleId]),
      ])

      return Response.json({
        success: true,
        data: {
          messages: messages[0]?.count || 0,
          loveNotes: loveNotes[0]?.count || 0,
          photos: photos[0]?.count || 0,
          boops: boops[0]?.count || 0,
          streak: streak[0] || { current_streak: 0, longest_streak: 0 },
        },
      })
    }

    if (statType === 'timeline') {
      const timeline = await query(
        `SELECT DATE(created_at) as date, COUNT(*) as total
         FROM messages WHERE couple_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
         GROUP BY DATE(created_at) ORDER BY date DESC`,
        [coupleId]
      )
      return Response.json({ success: true, data: timeline })
    }

    if (statType === 'health') {
      const [loveNotes, boops, messages, streak] = await Promise.all([
        query(
          `SELECT COUNT(*) as count FROM love_notes WHERE couple_id = $1 AND created_at >= NOW() - INTERVAL '7 days'`,
          [coupleId]
        ),
        query(
          `SELECT COUNT(*) as count FROM boops WHERE couple_id = $1 AND created_at >= NOW() - INTERVAL '7 days'`,
          [coupleId]
        ),
        query(
          `SELECT COUNT(*) as count FROM messages WHERE couple_id = $1 AND created_at >= NOW() - INTERVAL '7 days'`,
          [coupleId]
        ),
        query(`SELECT current_streak FROM streaks WHERE couple_id = $1`, [coupleId]),
      ])

      const score = Math.min(
        100,
        Math.round(
          (loveNotes[0]?.count || 0) * 10 +
          (boops[0]?.count || 0) * 5 +
          (messages[0]?.count || 0) * 2 +
          (streak[0]?.current_streak || 0) * 0.5
        ) / 2
      )

      return Response.json({
        success: true,
        data: {
          score,
          loveNotes: loveNotes[0]?.count || 0,
          boops: boops[0]?.count || 0,
          messages: messages[0]?.count || 0,
          streak: streak[0]?.current_streak || 0,
        },
      })
    }

    return Response.json({ error: 'Invalid stat type' }, { status: 400 })
  } catch (error) {
    console.error('GET /api/stats error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
