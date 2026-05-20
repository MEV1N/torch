/**
 * API Route: Streaks
 * File: src/app/api/streaks/route.ts
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

    if (!coupleId) {
      return Response.json({ error: 'Missing coupleId' }, { status: 400 })
    }

    const result = await query(
      `SELECT id, couple_id, current_streak, longest_streak, last_activity_date
       FROM streaks WHERE couple_id = $1`,
      [coupleId]
    )

    if (result.length === 0) {
      // Create initial streak
      const newStreak = await query(
        `INSERT INTO streaks (couple_id, current_streak, longest_streak)
         VALUES ($1, 0, 0)
         RETURNING id, couple_id, current_streak, longest_streak, last_activity_date`,
        [coupleId]
      )
      return Response.json({ success: true, data: newStreak[0] })
    }

    return Response.json({ success: true, data: result[0] })
  } catch (error) {
    console.error('GET /api/streaks error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { coupleId, activityType } = body

    if (!coupleId) {
      return Response.json({ error: 'Missing coupleId' }, { status: 400 })
    }

    // Verify couple membership
    const couple = await query(
      `SELECT id FROM couples WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [coupleId, session.user.id]
    )

    if (couple.length === 0) {
      return Response.json({ error: 'Not a member of this couple' }, { status: 403 })
    }

    const today = new Date().toISOString().split('T')[0]

    // Record activity
    if (activityType) {
      await query(
        `INSERT INTO streak_activities (couple_id, activity_type, activity_date)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [coupleId, activityType, today]
      )
    }

    // Get current streak
    let streak = await query(
      `SELECT * FROM streaks WHERE couple_id = $1`,
      [coupleId]
    )

    if (streak.length === 0) {
      const newStreak = await query(
        `INSERT INTO streaks (couple_id, current_streak, longest_streak, last_activity_date)
         VALUES ($1, 1, 1, $2)
         RETURNING id, couple_id, current_streak, longest_streak, last_activity_date`,
        [coupleId, today]
      )
      return Response.json({ success: true, data: newStreak[0] }, { status: 201 })
    }

    streak = streak[0]

    // Check if already updated today
    if (streak.last_activity_date === today) {
      return Response.json({ success: true, data: streak })
    }

    // Calculate new streak
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let newStreak = 1
    if (streak.last_activity_date === yesterdayStr) {
      newStreak = streak.current_streak + 1
    }

    const newLongest = Math.max(newStreak, streak.longest_streak)

    // Update
    const updated = await query(
      `UPDATE streaks
       SET current_streak = $1, longest_streak = $2, last_activity_date = $3
       WHERE couple_id = $4
       RETURNING id, couple_id, current_streak, longest_streak, last_activity_date`,
      [newStreak, newLongest, today, coupleId]
    )

    return Response.json({ success: true, data: updated[0] })
  } catch (error) {
    console.error('POST /api/streaks error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
