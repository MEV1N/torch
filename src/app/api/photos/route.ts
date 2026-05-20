/**
 * API Route: Photos
 * File: src/app/api/photos/route.ts
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

    const photos = await query(
      `SELECT id, couple_id, sender_id, sender_name, photo_url, caption, 
              is_viewed, sent_at, viewed_at
       FROM photos WHERE couple_id = $1 ORDER BY sent_at DESC LIMIT $2`,
      [coupleId, limit]
    )

    return Response.json({ success: true, data: photos })
  } catch (error) {
    console.error('GET /api/photos error:', error)
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
    const caption = formData.get('caption') as string
    const photoFile = formData.get('photo') as File

    if (!coupleId || !photoFile) {
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
    const buffer = Buffer.from(await photoFile.arrayBuffer())
    const fileName = `photos/${coupleId}/photo-${Date.now()}.jpg`
    const photoUrl = await uploadToS3(buffer, fileName, 'image/jpeg')

    // Save to database
    const result = await query(
      `INSERT INTO photos (couple_id, sender_id, sender_name, photo_url, caption)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, sent_at`,
      [coupleId, session.user.id, session.user.name, photoUrl, caption]
    )

    return Response.json({ success: true, data: result[0] }, { status: 201 })
  } catch (error) {
    console.error('POST /api/photos error:', error)
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
    const photoId = searchParams.get('id')

    if (!photoId) {
      return Response.json({ error: 'Missing photo ID' }, { status: 400 })
    }

    // Get photo and verify ownership
    const photo = await query(`SELECT * FROM photos WHERE id = $1`, [photoId])

    if (photo.length === 0) {
      return Response.json({ error: 'Photo not found' }, { status: 404 })
    }

    if (photo[0].sender_id !== session.user.id) {
      return Response.json({ error: 'Cannot delete another user\'s photo' }, { status: 403 })
    }

    // Delete from S3
    const key = photo[0].photo_url.split('.com/')[1]
    await deleteFromS3(key)

    // Delete from database
    await query(`DELETE FROM photos WHERE id = $1`, [photoId])

    return Response.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/photos error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
