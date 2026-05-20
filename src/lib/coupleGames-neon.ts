/**
 * Couple Games System (Neon)
 * File: src/lib/coupleGames-neon.ts
 */

import { query } from '@/lib/db'

/**
 * Get compatibility score
 */
export async function getCompatibilityScore(coupleId: string): Promise<number> {
  try {
    // Calculate based on various factors
    const result = await query(
      `SELECT
        ROUND(
          (
            (SELECT COUNT(*) FROM love_notes WHERE couple_id = $1) / 
            GREATEST((SELECT COUNT(*) FROM messages WHERE couple_id = $1), 1)
          ) * 100
        ) as score
       FROM couples WHERE id = $1`,
      [coupleId]
    )

    return result[0]?.score || 50
  } catch (error) {
    console.error('Error getting compatibility score:', error)
    return 50
  }
}

/**
 * Get love language
 */
export async function getLoveLanguage(coupleId: string, userId: string) {
  try {
    const result = await query(
      `SELECT * FROM user_preferences WHERE couple_id = $1 AND user_id = $2`,
      [coupleId, userId]
    )

    return result.length > 0
      ? result[0].love_language
      : 'acts_of_service'
  } catch (error) {
    console.error('Error getting love language:', error)
    return 'acts_of_service'
  }
}

/**
 * Create compatibility quiz
 */
export async function createCompatibilityQuiz(coupleId: string): Promise<string> {
  try {
    const questions = [
      'How well do you know your partner?',
      'How often do you think about your partner?',
      'How comfortable are you with physical affection?',
      'How important is communication?',
      'How do you handle disagreements?',
      'What is your love language?',
      'How important is adventure to you?',
      'How do you show appreciation?',
      'What role does intimacy play?',
      'How important are shared goals?',
    ]

    const result = await query(
      `INSERT INTO compatibility_quizzes (couple_id, questions)
       VALUES ($1, $2)
       RETURNING id`,
      [coupleId, JSON.stringify(questions)]
    )

    return result[0].id
  } catch (error) {
    console.error('Error creating compatibility quiz:', error)
    throw error
  }
}

/**
 * Submit quiz answer
 */
export async function submitQuizAnswer(
  quizId: string,
  userId: string,
  questionIndex: number,
  answer: string
): Promise<void> {
  try {
    await query(
      `INSERT INTO quiz_answers (quiz_id, user_id, question_index, answer)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (quiz_id, user_id, question_index) DO UPDATE
       SET answer = EXCLUDED.answer`,
      [quizId, userId, questionIndex, answer]
    )
  } catch (error) {
    console.error('Error submitting quiz answer:', error)
    throw error
  }
}

/**
 * Get quiz results
 */
export async function getQuizResults(quizId: string) {
  try {
    const results = await query(
      `SELECT user_id, question_index, answer
       FROM quiz_answers
       WHERE quiz_id = $1
       ORDER BY user_id, question_index`,
      [quizId]
    )

    return results
  } catch (error) {
    console.error('Error getting quiz results:', error)
    return []
  }
}

/**
 * Calculate compatibility after quiz
 */
export async function calculateQuizCompatibility(quizId: string): Promise<number> {
  try {
    // Get all answers
    const answers = await getQuizResults(quizId)

    if (answers.length < 10) return 0

    // Group by user
    const userAnswers: Record<string, string[]> = {}
    answers.forEach((a: any) => {
      if (!userAnswers[a.user_id]) userAnswers[a.user_id] = []
      userAnswers[a.user_id][a.question_index] = a.answer
    })

    const users = Object.keys(userAnswers)
    if (users.length < 2) return 0

    // Calculate compatibility (simplified)
    let matches = 0
    const user1 = userAnswers[users[0]]
    const user2 = userAnswers[users[1]]

    for (let i = 0; i < user1.length; i++) {
      if (user1[i] === user2[i]) matches++
    }

    const score = Math.round((matches / user1.length) * 100)

    // Save score
    await query(
      `UPDATE compatibility_quizzes SET compatibility_score = $1 WHERE id = $2`,
      [score, quizId]
    )

    return score
  } catch (error) {
    console.error('Error calculating quiz compatibility:', error)
    return 0
  }
}

/**
 * Get love notes frequency
 */
export async function getLoveNotesFrequency(coupleId: string, days: number = 7): Promise<number> {
  try {
    const result = await query(
      `SELECT COUNT(*) as count FROM love_notes
       WHERE couple_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'`,
      [coupleId]
    )

    return result[0]?.count || 0
  } catch (error) {
    console.error('Error getting love notes frequency:', error)
    return 0
  }
}

/**
 * Get boops frequency
 */
export async function getBoopsFrequency(coupleId: string, days: number = 7): Promise<number> {
  try {
    const result = await query(
      `SELECT COUNT(*) as count FROM boops
       WHERE couple_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'`,
      [coupleId]
    )

    return result[0]?.count || 0
  } catch (error) {
    console.error('Error getting boops frequency:', error)
    return 0
  }
}

/**
 * Get couple health score (0-100)
 */
export async function getCoupleHealthScore(coupleId: string): Promise<number> {
  try {
    const loveNotes = await getLoveNotesFrequency(coupleId, 7)
    const boops = await getBoopsFrequency(coupleId, 7)
    const messages = await query(
      `SELECT COUNT(*) as count FROM messages
       WHERE couple_id = $1 AND created_at >= NOW() - INTERVAL '7 days'`,
      [coupleId]
    )

    const streak = await query(
      `SELECT current_streak FROM streaks WHERE couple_id = $1`,
      [coupleId]
    )

    const score = Math.min(
      100,
      Math.round(
        (loveNotes * 10 + boops * 5 + (messages[0]?.count || 0) * 2 + (streak[0]?.current_streak || 0) * 0.5) / 2
      )
    )

    return score
  } catch (error) {
    console.error('Error getting couple health score:', error)
    return 0
  }
}
