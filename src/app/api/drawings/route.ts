/**
 * API Route: Drawings
 * File: src/app/api/drawings/route.ts
 */

import { query } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { uploadToS3, deleteFromS3 } from '@/lib/s3'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const coupleId = searchParams.get('coupleId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!coupleId) {
      return Response.json({ error: 'Missing coupleId' }, { status: 400 })
    }

    const drawings = await query(
      `SELECT id, couple_id, created_by_uid, created_by_name, drawing_url,
              title, description, created_at, likes
       FROM drawings WHERE couple_id = $1
       ORDER BY created_at DESC LIMIT $2`,
      [coupleId, limit]
    )

    return Response.json({ success: true, data: drawings })
  } catch (error) {
    console.error('GET /api/drawings error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const coupleId = formData.get('coupleId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const drawingFile = formData.get('drawing') as File

    if (!coupleId || !drawingFile) {
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

    // Upload to S3
    const buffer = Buffer.from(await drawingFile.arrayBuffer())
    const fileName = `drawings/${coupleId}/drawing-${Date.now()}.png`
    const drawingUrl = await uploadToS3(buffer, fileName, 'image/png')

    // Save to database
    const result = await query(
      `INSERT INTO drawings (couple_id, created_by_uid, created_by_name, drawing_url, title, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [coupleId, session.user.id, session.user.name, drawingUrl, title, description]
    )

    return Response.json({ success: true, data: result[0] }, { status: 201 })
  } catch (error) {
    console.error('POST /api/drawings error:', error)
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
    const drawingId = searchParams.get('id')

    if (!drawingId) {
      return Response.json({ error: 'Missing drawing ID' }, { status: 400 })
    }

    // Get drawing and verify ownership
    const drawing = await query(`SELECT * FROM drawings WHERE id = $1`, [drawingId])

    if (drawing.length === 0) {
      return Response.json({ error: 'Drawing not found' }, { status: 404 })
    }

    if (drawing[0].created_by_uid !== session.user.id) {
      return Response.json({ error: 'Cannot delete another user\'s drawing' }, { status: 403 })
    }

    // Delete from S3
    const key = drawing[0].drawing_url.split('.com/')[1]
    await deleteFromS3(key)

    // Delete from database
    await query(`DELETE FROM drawings WHERE id = $1`, [drawingId])

    return Response.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/drawings error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
