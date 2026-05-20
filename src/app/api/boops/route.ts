/**
 * API Route: Boops (GET, POST, DELETE)
 * File: src/app/api/boops/route.ts
 */

import { query } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

interface BoopRequest {
  coupleId: string
  toUid: string
  emoji?: string
}

// GET: Fetch boops for a couple
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const coupleId = searchParams.get('coupleId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const stats = searchParams.get('stats') === 'true'

    if (!coupleId) {
      return Response.json({ error: 'Missing coupleId' }, { status: 400 })
    }

    // Get boops
    const boops = await query(
      `SELECT id, couple_id, from_user_id, from_name, to_user_id, emoji, created_at
       FROM boops
       WHERE couple_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [coupleId, limit]
    )

    if (!stats) {
      return Response.json({ success: true, data: boops })
    }

    // Calculate stats if requested
    const total = await query(
      `SELECT COUNT(*) as count FROM boops WHERE couple_id = $1`,
      [coupleId]
    )

    const today = new Date().toISOString().split('T')[0]
    const todayCount = await query(
      `SELECT COUNT(*) as count FROM boops 
       WHERE couple_id = $1 AND DATE(created_at) = $2`,
      [coupleId, today]
    )

    const byUser: { [key: string]: number } = {}
    boops.forEach((boop: any) => {
      byUser[boop.from_user_id] = (byUser[boop.from_user_id] || 0) + 1
    })

    return Response.json({
      success: true,
      data: {
        boops,
        stats: {
          total: total[0].count,
          today: todayCount[0].count,
          byUser,
        },
      },
    })
  } catch (error) {
    console.error('GET /api/boops error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a new boop
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: BoopRequest = await request.json()
    const { coupleId, toUid, emoji = '👆' } = body

    if (!coupleId || !toUid) {
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

    // Create boop
    const result = await query(
      `INSERT INTO boops (couple_id, from_user_id, from_name, to_user_id, emoji)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [coupleId, session.user.id, session.user.name, toUid, emoji]
    )

    // TODO: Send notification to partner

    return Response.json(
      { success: true, data: result[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/boops error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete a boop (only own boops)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const boopId = searchParams.get('id')

    if (!boopId) {
      return Response.json({ error: 'Missing boop ID' }, { status: 400 })
    }

    // Verify ownership
    const boop = await query(
      `SELECT from_user_id FROM boops WHERE id = $1`,
      [boopId]
    )

    if (boop.length === 0) {
      return Response.json({ error: 'Boop not found' }, { status: 404 })
    }

    if (boop[0].from_user_id !== session.user.id) {
      return Response.json({ error: 'Cannot delete another user\'s boop' }, { status: 403 })
    }

    // Delete boop
    await query(`DELETE FROM boops WHERE id = $1`, [boopId])

    return Response.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/boops error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
