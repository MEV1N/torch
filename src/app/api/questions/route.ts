/**
 * API Route: Questions & Daily Questions
 * File: src/app/api/questions/route.ts
 */

import { query } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { QUESTIONS } from '@/lib/questions-neon'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const coupleId = searchParams.get('coupleId')
    const type = searchParams.get('type') // 'daily' or 'history'

    if (!coupleId) {
      return Response.json({ error: 'Missing coupleId' }, { status: 400 })
    }

    if (type === 'history') {
      // Get question history
      const history = await query(
        `SELECT dq.id, dq.question, dq.category, dq.asked_at,
                COUNT(qa.id) as answer_count
         FROM daily_questions dq
         LEFT JOIN question_answers qa ON dq.id = qa.question_id
         WHERE dq.couple_id = $1
         GROUP BY dq.id
         ORDER BY dq.asked_at DESC
         LIMIT 50`,
        [coupleId]
      )

      return Response.json({ success: true, data: history })
    }

    // Get today's question
    const today = new Date().toISOString().split('T')[0]

    const existing = await query(
      `SELECT id, couple_id, question, category, asked_at
       FROM daily_questions
       WHERE couple_id = $1 AND DATE(asked_at) = $2`,
      [coupleId, today]
    )

    if (existing.length > 0) {
      return Response.json({ success: true, data: existing[0] })
    }

    // Generate new question
    const randomQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]

    const result = await query(
      `INSERT INTO daily_questions (couple_id, question, category)
       VALUES ($1, $2, $3)
       RETURNING id, couple_id, question, category, asked_at`,
      [coupleId, randomQuestion.question, randomQuestion.category]
    )

    return Response.json({ success: true, data: result[0] })
  } catch (error) {
    console.error('GET /api/questions error:', error)
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
    const { questionId, answer } = body

    if (!questionId || !answer) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO question_answers (question_id, user_id, answer)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [questionId, session.user.id, answer]
    )

    return Response.json({ success: true, data: result[0] }, { status: 201 })
  } catch (error) {
    console.error('POST /api/questions error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
