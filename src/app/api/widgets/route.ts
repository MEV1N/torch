/**
 * API Route: Widgets
 * File: src/app/api/widgets/route.ts
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

    const widgets = await query(
      `SELECT id, couple_id, type, title, content, created_by_uid, position, is_visible, metadata
       FROM widgets WHERE couple_id = $1 AND is_visible = TRUE
       ORDER BY position ASC`,
      [coupleId]
    )

    return Response.json({ success: true, data: widgets })
  } catch (error) {
    console.error('GET /api/widgets error:', error)
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
    const { coupleId, type, title, content, metadata } = body

    if (!coupleId || !type || !title) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get max position
    const maxPos = await query(
      `SELECT COALESCE(MAX(position), 0) as max_pos FROM widgets WHERE couple_id = $1`,
      [coupleId]
    )

    const result = await query(
      `INSERT INTO widgets (couple_id, type, title, content, created_by_uid, position, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [coupleId, type, title, content, session.user.id, (maxPos[0].max_pos || 0) + 1, JSON.stringify(metadata || {})]
    )

    return Response.json({ success: true, data: result[0] }, { status: 201 })
  } catch (error) {
    console.error('POST /api/widgets error:', error)
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
    const { widgetId, coupleId, ...updates } = body

    if (!widgetId || !coupleId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await query(
      `UPDATE widgets SET title = COALESCE($1, title), content = COALESCE($2, content),
              position = COALESCE($3, position), is_visible = COALESCE($4, is_visible),
              updated_at = NOW() WHERE id = $5 AND couple_id = $6`,
      [updates.title, updates.content, updates.position, updates.is_visible, widgetId, coupleId]
    )

    return Response.json({ success: true })
  } catch (error) {
    console.error('PUT /api/widgets error:', error)
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
    const widgetId = searchParams.get('id')
    const coupleId = searchParams.get('coupleId')

    if (!widgetId || !coupleId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await query(`DELETE FROM widgets WHERE id = $1 AND couple_id = $2`, [widgetId, coupleId])

    return Response.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/widgets error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
