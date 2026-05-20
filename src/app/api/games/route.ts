/**
 * API Route: Games
 * File: src/app/api/games/route.ts
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
    const type = searchParams.get('type') // 'sessions' or 'records'
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!coupleId) {
      return Response.json({ error: 'Missing coupleId' }, { status: 400 })
    }

    if (type === 'records') {
      const records = await query(
        `SELECT id, game_name, type, difficulty, played_at, duration, scores, winner, rounds
         FROM game_records WHERE couple_id = $1
         ORDER BY played_at DESC LIMIT $2`,
        [coupleId, limit]
      )
      return Response.json({ success: true, data: records })
    }

    // Get sessions
    const sessions = await query(
      `SELECT id, couple_id, game_type, status, created_by, started_at, ended_at,
              current_round, total_rounds, scores, winner
       FROM game_sessions WHERE couple_id = $1
       ORDER BY started_at DESC LIMIT $2`,
      [coupleId, limit]
    )

    return Response.json({ success: true, data: sessions })
  } catch (error) {
    console.error('GET /api/games error:', error)
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
    const { coupleId, gameType, totalRounds = 5, action, sessionId, scores, winner } = body

    if (!coupleId || !gameType) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (action === 'start') {
      // Create new session
      const result = await query(
        `INSERT INTO game_sessions (couple_id, game_type, status, created_by, current_round, total_rounds)
         VALUES ($1, $2, 'waiting', $3, 0, $4)
         RETURNING id`,
        [coupleId, gameType, session.user.id, totalRounds]
      )
      return Response.json({ success: true, data: result[0] }, { status: 201 })
    }

    if (action === 'play' && sessionId) {
      await query(
        `UPDATE game_sessions SET status = 'playing', scores = $1, current_round = 1 WHERE id = $2`,
        [JSON.stringify(scores), sessionId]
      )
      return Response.json({ success: true })
    }

    if (action === 'finish' && sessionId && winner) {
      await query(
        `UPDATE game_sessions SET status = 'finished', winner = $1, ended_at = NOW() WHERE id = $2`,
        [winner, sessionId]
      )
      return Response.json({ success: true })
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('POST /api/games error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
