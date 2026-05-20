/**
 * Games System (Neon)
 * File: src/lib/games-neon.ts
 */

import { query } from '@/lib/db'

export interface GameSession {
  id: string
  coupleId: string
  gameType: string
  status: 'waiting' | 'playing' | 'finished'
  createdBy: string
  startedAt: Date
  endedAt?: Date
  currentRound: number
  totalRounds: number
  scores: Record<string, number>
  winner?: string
}

export interface GameRecord {
  id: string
  coupleId: string
  gameName: string
  type: 'trivia' | 'memory' | 'word' | 'cards' | 'custom'
  difficulty: 'easy' | 'medium' | 'hard'
  playedAt: Date
  duration: number
  scores: Record<string, number>
  winner: string
  rounds: number
}

/**
 * Create a new game session
 */
export async function createGameSession(
  coupleId: string,
  gameType: string,
  createdBy: string,
  totalRounds: number = 5
): Promise<string> {
  try {
    const result = await query(
      `INSERT INTO game_sessions (couple_id, game_type, status, created_by, current_round, total_rounds)
       VALUES ($1, $2, 'waiting', $3, 0, $4)
       RETURNING id`,
      [coupleId, gameType, createdBy, totalRounds]
    )

    return result[0].id
  } catch (error) {
    console.error('Error creating game session:', error)
    throw error
  }
}

/**
 * Start a game session
 */
export async function startGameSession(
  coupleId: string,
  sessionId: string,
  initialScores: Record<string, number>
): Promise<void> {
  try {
    await query(
      `UPDATE game_sessions
       SET status = 'playing', scores = $1, current_round = 1
       WHERE couple_id = $2 AND id = $3`,
      [JSON.stringify(initialScores), coupleId, sessionId]
    )
  } catch (error) {
    console.error('Error starting game session:', error)
    throw error
  }
}

/**
 * Update game score
 */
export async function updateGameScore(
  coupleId: string,
  sessionId: string,
  playerUid: string,
  pointsToAdd: number
): Promise<void> {
  try {
    // Get current scores
    const result = await query(
      `SELECT scores FROM game_sessions WHERE couple_id = $1 AND id = $2`,
      [coupleId, sessionId]
    )

    if (result.length === 0) throw new Error('Game session not found')

    const currentScores = result[0].scores || {}
    currentScores[playerUid] = (currentScores[playerUid] || 0) + pointsToAdd

    // Update
    await query(
      `UPDATE game_sessions SET scores = $1 WHERE couple_id = $2 AND id = $3`,
      [JSON.stringify(currentScores), coupleId, sessionId]
    )
  } catch (error) {
    console.error('Error updating game score:', error)
    throw error
  }
}

/**
 * Finish a game session
 */
export async function finishGameSession(
  coupleId: string,
  sessionId: string,
  winner: string
): Promise<void> {
  try {
    // Get session
    const session = await query(
      `SELECT * FROM game_sessions WHERE couple_id = $1 AND id = $2`,
      [coupleId, sessionId]
    )

    if (session.length === 0) throw new Error('Game session not found')

    const sess = session[0]

    // Update session
    await query(
      `UPDATE game_sessions
       SET status = 'finished', winner = $1, ended_at = NOW()
       WHERE couple_id = $2 AND id = $3`,
      [winner, coupleId, sessionId]
    )

    // Save to game records
    const duration = sess.ended_at
      ? Math.round((new Date(sess.ended_at).getTime() - new Date(sess.started_at).getTime()) / 1000)
      : 0

    await query(
      `INSERT INTO game_records (couple_id, game_name, type, difficulty, duration, scores, winner, rounds)
       VALUES ($1, $2, $3, 'medium', $4, $5, $6, $7)`,
      [
        coupleId,
        sess.game_type,
        sess.game_type,
        duration,
        JSON.stringify(sess.scores),
        winner,
        sess.total_rounds,
      ]
    )
  } catch (error) {
    console.error('Error finishing game session:', error)
    throw error
  }
}

/**
 * Get game records for a couple
 */
export async function getGameRecords(
  coupleId: string,
  limitCount: number = 50
): Promise<GameRecord[]> {
  try {
    return await query(
      `SELECT id, couple_id as "coupleId", game_name as "gameName", type,
              difficulty, played_at as "playedAt", duration, scores,
              winner, rounds
       FROM game_records
       WHERE couple_id = $1
       ORDER BY played_at DESC
       LIMIT $2`,
      [coupleId, limitCount]
    )
  } catch (error) {
    console.error('Error getting game records:', error)
    return []
  }
}

/**
 * Get game statistics
 */
export async function getGameStats(coupleId: string) {
  try {
    const result = await query(
      `SELECT
        COUNT(*) as total_games,
        AVG(duration) as avg_duration,
        COUNT(DISTINCT winner) as unique_winners
       FROM game_records
       WHERE couple_id = $1`,
      [coupleId]
    )

    return {
      totalGames: result[0].total_games || 0,
      avgDuration: result[0].avg_duration || 0,
      uniqueWinners: result[0].unique_winners || 0,
    }
  } catch (error) {
    console.error('Error getting game stats:', error)
    return null
  }
}

/**
 * Get current game session
 */
export async function getCurrentGameSession(coupleId: string): Promise<GameSession | null> {
  try {
    const result = await query(
      `SELECT id, couple_id as "coupleId", game_type as "gameType", status,
              created_by as "createdBy", started_at as "startedAt",
              ended_at as "endedAt", current_round as "currentRound",
              total_rounds as "totalRounds", scores, winner
       FROM game_sessions
       WHERE couple_id = $1 AND status IN ('waiting', 'playing')
       ORDER BY started_at DESC
       LIMIT 1`,
      [coupleId]
    )

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error('Error getting current game session:', error)
    return null
  }
}
