/**
 * API Route: Messages/Chat
 * File: src/app/api/messages/route.ts
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
    const limit = parseInt(searchParams.get('limit') || '100')

    if (!coupleId) {
      return Response.json({ error: 'Missing coupleId' }, { status: 400 })
    }

    const messages = await query(
      `SELECT id, couple_id, sender_id, text, created_at, is_read
       FROM messages WHERE couple_id = $1
       ORDER BY created_at DESC LIMIT $2`,
      [coupleId, limit]
    )

    return Response.json({ success: true, data: messages })
  } catch (error) {
    console.error('GET /api/messages error:', error)
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
    const { coupleId, text } = body

    if (!coupleId || !text) {
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

    const result = await query(
      `INSERT INTO messages (couple_id, sender_id, text)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [coupleId, session.user.id, text.trim()]
    )

    return Response.json({ success: true, data: result[0] }, { status: 201 })
  } catch (error) {
    console.error('POST /api/messages error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { messageId, text } = body

    if (!messageId || !text) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify ownership
    const message = await query(`SELECT sender_id FROM messages WHERE id = $1`, [messageId])

    if (message.length === 0) {
      return Response.json({ error: 'Message not found' }, { status: 404 })
    }

    if (message[0].sender_id !== session.user.id) {
      return Response.json({ error: 'Cannot edit another user\'s message' }, { status: 403 })
    }

    await query(
      `UPDATE messages SET text = $1, is_edited = TRUE, updated_at = NOW() WHERE id = $2`,
      [text.trim(), messageId]
    )

    return Response.json({ success: true })
  } catch (error) {
    console.error('PUT /api/messages error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('id')

    if (!messageId) {
      return Response.json({ error: 'Missing message ID' }, { status: 400 })
    }

    // Verify ownership
    const message = await query(`SELECT sender_id FROM messages WHERE id = $1`, [messageId])

    if (message.length === 0) {
      return Response.json({ error: 'Message not found' }, { status: 404 })
    }

    if (message[0].sender_id !== session.user.id) {
      return Response.json({ error: 'Cannot delete another user\'s message' }, { status: 403 })
    }

    await query(`DELETE FROM messages WHERE id = $1`, [messageId])

    return Response.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/messages error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
