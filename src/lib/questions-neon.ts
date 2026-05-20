/**
 * Questions System (Neon)
 * File: src/lib/questions-neon.ts
 */

import { query } from '@/lib/db'

export const QUESTIONS = [
  // Deep
  { question: 'What moment made you realize you were in love with me?', category: 'deep' },
  { question: "What's something about our relationship that you're most proud of?", category: 'deep' },
  { question: 'If you could relive one moment we\'ve shared, which would it be?', category: 'deep' },
  { question: "What's the hardest thing you've overcome because of our love?", category: 'deep' },
  { question: "What does 'home' mean to you when you think of us?", category: 'deep' },

  // Romantic
  { question: "What's your favorite thing to hear me say?", category: 'romantic' },
  { question: "Where's the most romantic place you'd love to visit with me?", category: 'romantic' },
  { question: "What's the most romantic thing I've ever done for you?", category: 'romantic' },
  { question: 'If we could have a perfect date tonight, what would it look like?', category: 'romantic' },
  { question: 'What song reminds you of us?', category: 'romantic' },

  // Fun
  { question: 'If we were a TV couple, who would we be?', category: 'fun' },
  { question: "What's the funniest thing that's happened to us?", category: 'fun' },
  { question: 'If we swapped lives for a day, what would surprise you most?', category: 'fun' },
  { question: "What's a weird habit of mine that you secretly love?", category: 'fun' },
  { question: 'If we had a couple\'s superpower, what would it be?', category: 'fun' },

  // Spicy
  { question: 'What was the best moment of physical intimacy we\'ve shared?', category: 'spicy' },
  { question: 'What's a fantasy you've had about me?', category: 'spicy' },
  { question: 'What physical feature of mine do you find most attractive?', category: 'spicy' },
  { question: 'If you could change one thing about our intimate life, what would it be?', category: 'spicy' },
  { question: 'What's something you'd love to try together?', category: 'spicy' },
]

/**
 * Get daily question for a couple
 */
export async function getDailyQuestion(coupleId: string) {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Try to get existing question for today
    const existing = await query(
      `SELECT id, couple_id, question, category, asked_at
       FROM daily_questions
       WHERE couple_id = $1 AND DATE(asked_at) = $2`,
      [coupleId, today]
    )

    if (existing.length > 0) {
      return existing[0]
    }

    // Generate new question
    const randomQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]

    const result = await query(
      `INSERT INTO daily_questions (couple_id, question, category)
       VALUES ($1, $2, $3)
       RETURNING id, couple_id, question, category, asked_at`,
      [coupleId, randomQuestion.question, randomQuestion.category]
    )

    return result[0]
  } catch (error) {
    console.error('Error getting daily question:', error)
    throw error
  }
}

/**
 * Submit answer to question
 */
export async function submitAnswer(
  questionId: string,
  userId: string,
  answer: string
): Promise<string> {
  try {
    const result = await query(
      `INSERT INTO question_answers (question_id, user_id, answer)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [questionId, userId, answer]
    )

    return result[0].id
  } catch (error) {
    console.error('Error submitting answer:', error)
    throw error
  }
}

/**
 * Get answers to a question
 */
export async function getAnswers(questionId: string) {
  try {
    return await query(
      `SELECT id, question_id, user_id, answer, created_at
       FROM question_answers
       WHERE question_id = $1
       ORDER BY created_at ASC`,
      [questionId]
    )
  } catch (error) {
    console.error('Error getting answers:', error)
    return []
  }
}

/**
 * Get question history for a couple
 */
export async function getQuestionHistory(coupleId: string, limitCount: number = 30) {
  try {
    return await query(
      `SELECT dq.id, dq.couple_id, dq.question, dq.category, dq.asked_at,
              COUNT(qa.id) as answer_count
       FROM daily_questions dq
       LEFT JOIN question_answers qa ON dq.id = qa.question_id
       WHERE dq.couple_id = $1
       GROUP BY dq.id
       ORDER BY dq.asked_at DESC
       LIMIT $2`,
      [coupleId, limitCount]
    )
  } catch (error) {
    console.error('Error getting question history:', error)
    return []
  }
}

/**
 * Get question statistics
 */
export async function getQuestionStats(coupleId: string) {
  try {
    const result = await query(
      `SELECT
        COUNT(DISTINCT dq.id) as total_questions,
        COUNT(DISTINCT qa.id) as total_answers,
        COUNT(DISTINCT qa.user_id) as users_answered
       FROM daily_questions dq
       LEFT JOIN question_answers qa ON dq.id = qa.question_id
       WHERE dq.couple_id = $1`,
      [coupleId]
    )

    return {
      totalQuestions: result[0].total_questions,
      totalAnswers: result[0].total_answers,
      usersAnswered: result[0].users_answered,
    }
  } catch (error) {
    console.error('Error getting question stats:', error)
    return null
  }
}

/**
 * Get questions by category
 */
export async function getQuestionsByCategory(coupleId: string, category: string) {
  try {
    return await query(
      `SELECT id, couple_id, question, category, asked_at
       FROM daily_questions
       WHERE couple_id = $1 AND category = $2
       ORDER BY asked_at DESC
       LIMIT 20`,
      [coupleId, category]
    )
  } catch (error) {
    console.error('Error getting questions by category:', error)
    return []
  }
}
