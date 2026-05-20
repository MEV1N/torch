// =============================================
// Torch — Games Management
// =============================================

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

export interface GameSession {
  gameType: string;
  status: "waiting" | "playing" | "finished";
  createdBy: string;
  startedAt: Timestamp;
  endedAt?: Timestamp;
  currentRound: number;
  totalRounds: number;
  scores: { [uid: string]: number };
  winner?: string;
  questions?: {
    questionId: string;
    correctAnswer: string;
    user1Answer: string;
    user2Answer: string;
  }[];
}

export interface GameRecord {
  gameName: string;
  type: "trivia" | "memory" | "word" | "cards" | "custom";
  difficulty: "easy" | "medium" | "hard";
  playedAt: Timestamp;
  duration: number;
  scores: { [uid: string]: number };
  winner: string;
  rounds: number;
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
  const session: GameSession = {
    gameType,
    status: "waiting",
    createdBy,
    startedAt: Timestamp.now(),
    currentRound: 0,
    totalRounds,
    scores: {},
  };

  const gameSessionsRef = collection(
    db,
    `couples/${coupleId}/game-sessions`
  );
  const docRef = await addDoc(gameSessionsRef, session);
  return docRef.id;
}

/**
 * Start a game session
 */
export async function startGameSession(
  coupleId: string,
  sessionId: string,
  initialScores: { [uid: string]: number }
) {
  const sessionRef = doc(db, `couples/${coupleId}/game-sessions/${sessionId}`);
  await updateDoc(sessionRef, {
    status: "playing",
    scores: initialScores,
    currentRound: 1,
  });
}

/**
 * Update score during game
 */
export async function updateGameScore(
  coupleId: string,
  sessionId: string,
  playerUid: string,
  pointsToAdd: number
) {
  const sessionRef = doc(db, `couples/${coupleId}/game-sessions/${sessionId}`);

  const snap = await (
    await import("firebase/firestore")
  ).getDoc(sessionRef);
  const currentScores = snap.data()?.scores || {};

  await updateDoc(sessionRef, {
    scores: {
      ...currentScores,
      [playerUid]: (currentScores[playerUid] || 0) + pointsToAdd,
    },
  });
}

/**
 * Finish a game session and save to history
 */
export async function finishGameSession(
  coupleId: string,
  sessionId: string,
  winner: string
) {
  const sessionRef = doc(db, `couples/${coupleId}/game-sessions/${sessionId}`);
  const snap = await (
    await import("firebase/firestore")
  ).getDoc(sessionRef);
  const sessionData = snap.data();

  // Save to game records
  const gameRecord: GameRecord = {
    gameName: sessionData?.gameType,
    type: sessionData?.gameType,
    difficulty: "medium",
    playedAt: Timestamp.now(),
    duration: Math.round(
      (Timestamp.now().toMillis() - sessionData?.startedAt.toMillis()) / 1000
    ),
    scores: sessionData?.scores,
    winner,
    rounds: sessionData?.currentRound,
  };

  const gamesRef = collection(db, `couples/${coupleId}/games`);
  await addDoc(gamesRef, gameRecord);

  // Update session status
  await updateDoc(sessionRef, {
    status: "finished",
    endedAt: Timestamp.now(),
    winner,
  });
}

/**
 * Get active game session for a couple
 */
export async function getActiveGameSession(coupleId: string) {
  const q = query(
    collection(db, `couples/${coupleId}/game-sessions`),
    where("status", "in", ["waiting", "playing"]),
    orderBy("startedAt", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Get game history (leaderboard)
 */
export async function getGameHistory(coupleId: string, limitCount: number = 10) {
  const q = query(
    collection(db, `couples/${coupleId}/games`),
    orderBy("playedAt", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get game statistics for a player
 */
export async function getPlayerGameStats(coupleId: string, playerUid: string) {
  const gamesRef = collection(db, `couples/${coupleId}/games`);
  const q = query(gamesRef);

  const snapshot = await getDocs(q);
  const games = snapshot.docs.map((doc) => doc.data());

  let totalWins = 0;
  let totalGames = 0;
  let totalPoints = 0;

  games.forEach((game: any) => {
    if (game.winner === playerUid) {
      totalWins++;
    }
    totalGames++;
    totalPoints += game.scores?.[playerUid] || 0;
  });

  return {
    totalGames,
    totalWins,
    winRate: totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0,
    totalPoints,
    averageScore: totalGames > 0 ? Math.round(totalPoints / totalGames) : 0,
  };
}

/**
 * Get leaderboard for couple
 */
export async function getGameLeaderboard(coupleId: string) {
  const stats1 = await getPlayerGameStats(coupleId, "user1Uid");
  const stats2 = await getPlayerGameStats(coupleId, "user2Uid");

  return {
    player1: stats1,
    player2: stats2,
  };
}

/**
 * Create question for game
 */
export async function createGameQuestion(
  question: string,
  category: string,
  correctAnswer: string,
  options: string[]
) {
  return {
    question,
    category,
    correctAnswer,
    options,
    createdAt: Timestamp.now(),
  };
}

/**
 * Game question generator - returns random questions
 */
export const gameQuestions = {
  trivia: [
    {
      question: "What was our first date?",
      category: "memory",
      difficulty: "hard",
    },
    {
      question: "What's my favorite food?",
      category: "knowledge",
      difficulty: "easy",
    },
    {
      question: "Where would we like to travel next?",
      category: "dreams",
      difficulty: "medium",
    },
  ],
  wouldYouRather: [
    "Vacation in mountains or beaches?",
    "Movie night or dinner out?",
    "Road trip or flying?",
  ],
  compatibility: [
    "Do you want kids?",
    "What's your ideal future?",
    "How do you handle conflict?",
    "What's your love language?",
  ],
};

export default {
  createGameSession,
  startGameSession,
  updateGameScore,
  finishGameSession,
  getActiveGameSession,
  getGameHistory,
  getPlayerGameStats,
  getGameLeaderboard,
  createGameQuestion,
};
