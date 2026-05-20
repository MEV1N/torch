/**
 * API Route: Create and retrieve love notes
 * File: src/app/api/love-notes/route.ts
 */

import { query } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

interface LoveNoteRequest {
  coupleId: string
  toUid: string
  text: string
  sentiment?: 'romantic' | 'funny' | 'supportive' | 'spicy'
  emoji?: string
}

// GET: Fetch love notes for a couple
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const coupleId = searchParams.get('coupleId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (!coupleId) {
      return Response.json({ error: 'Missing coupleId' }, { status: 400 })
    }

    let sqlQuery = `
      SELECT id, couple_id, from_user_id, from_name, to_user_id, text, 
             sentiment, emoji, is_read, read_at, is_pinned, created_at
      FROM love_notes
      WHERE couple_id = $1
    `
    const params: any[] = [coupleId]

    if (unreadOnly) {
      sqlQuery += ` AND to_user_id = $2 AND is_read = FALSE`
      params.push(session.user.id)
    }

    sqlQuery += ` ORDER BY is_pinned DESC, created_at DESC LIMIT $${params.length + 1}`
    params.push(limit)

    const notes = await query(sqlQuery, params)

    return Response.json({ success: true, data: notes })
  } catch (error) {
    console.error('GET /api/love-notes error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a new love note
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: LoveNoteRequest = await request.json()
    const { coupleId, toUid, text, sentiment = 'romantic', emoji = '💕' } = body

    if (!coupleId || !toUid || !text) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify couple membership
    const couple = await query(
      `SELECT id FROM couples WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [coupleId, session.user.id]
    )

    if (couple.length === 0) {
      return Response.json({ error: 'Not a member of this couple' }, { status: 403 })
    }

    // Create note
    const result = await query(
      `INSERT INTO love_notes (couple_id, from_user_id, from_name, to_user_id, text, sentiment, emoji)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [coupleId, session.user.id, session.user.name, toUid, text, sentiment, emoji]
    )

    return Response.json(
      { success: true, data: result[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/love-notes error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
