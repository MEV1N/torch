// =============================================
// Torch — Couple Games & Compatibility
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

export interface CoupleGameSession {
  gameType: "truth-or-dare" | "would-you-rather" | "compatibility" | "challenge";
  status: "active" | "completed" | "abandoned";
  initiatedBy: string;
  startedAt: Timestamp;
  endedAt?: Timestamp;
  user1Status: "ready" | "playing" | "waiting" | "completed";
  user2Status: "ready" | "playing" | "waiting" | "completed";
  rounds: number;
  currentRound: number;
  totalScore: { [uid: string]: number };
  compatibility?: number;
  results?: {
    category: string;
    questions: number;
    matches: number;
    percentage: number;
  }[];
}

/**
 * Start a truth or dare game
 */
export async function startTruthOrDareGame(
  coupleId: string,
  initiatedBy: string
): Promise<string> {
  const session: CoupleGameSession = {
    gameType: "truth-or-dare",
    status: "active",
    initiatedBy,
    startedAt: Timestamp.now(),
    user1Status: initiatedBy === "user1" ? "ready" : "waiting",
    user2Status: initiatedBy === "user2" ? "ready" : "waiting",
    rounds: 10,
    currentRound: 1,
    totalScore: {},
  };

  const sessionsRef = collection(db, `couples/${coupleId}/couple-games`);
  const docRef = await addDoc(sessionsRef, session);
  return docRef.id;
}

/**
 * Start a would you rather game
 */
export async function startWouldYouRatherGame(
  coupleId: string,
  initiatedBy: string
): Promise<string> {
  const session: CoupleGameSession = {
    gameType: "would-you-rather",
    status: "active",
    initiatedBy,
    startedAt: Timestamp.now(),
    user1Status: initiatedBy === "user1" ? "ready" : "waiting",
    user2Status: initiatedBy === "user2" ? "ready" : "waiting",
    rounds: 10,
    currentRound: 1,
    totalScore: {},
  };

  const sessionsRef = collection(db, `couples/${coupleId}/couple-games`);
  const docRef = await addDoc(sessionsRef, session);
  return docRef.id;
}

/**
 * Start a compatibility test
 */
export async function startCompatibilityTest(
  coupleId: string,
  initiatedBy: string
): Promise<string> {
  const session: CoupleGameSession = {
    gameType: "compatibility",
    status: "active",
    initiatedBy,
    startedAt: Timestamp.now(),
    user1Status: "ready",
    user2Status: "waiting",
    rounds: 10,
    currentRound: 1,
    totalScore: {},
    compatibility: 0,
  };

  const sessionsRef = collection(db, `couples/${coupleId}/couple-games`);
  const docRef = await addDoc(sessionsRef, session);
  return docRef.id;
}

/**
 * Submit answer in couple game
 */
export async function submitGameAnswer(
  coupleId: string,
  sessionId: string,
  userUid: string,
  answer: string
) {
  const sessionRef = doc(db, `couples/${coupleId}/couple-games/${sessionId}`);
  await updateDoc(sessionRef, {
    [`${userUid}Answer`]: answer,
  });
}

/**
 * Progress to next round
 */
export async function nextRound(
  coupleId: string,
  sessionId: string,
  user1Answer: string,
  user2Answer: string,
  pointsUser1: number = 0,
  pointsUser2: number = 0
) {
  const sessionRef = doc(db, `couples/${coupleId}/couple-games/${sessionId}`);
  const snap = await (
    await import("firebase/firestore")
  ).getDoc(sessionRef);
  const session = snap.data();

  const currentScores = session?.totalScore || {};
  const newScores = {
    user1: (currentScores.user1 || 0) + pointsUser1,
    user2: (currentScores.user2 || 0) + pointsUser2,
  };

  await updateDoc(sessionRef, {
    currentRound: session.currentRound + 1,
    totalScore: newScores,
    user1Status: "playing",
    user2Status: "playing",
  });
}

/**
 * End couple game and calculate compatibility
 */
export async function endCoupleGame(
  coupleId: string,
  sessionId: string,
  compatibility?: number
) {
  const sessionRef = doc(db, `couples/${coupleId}/couple-games/${sessionId}`);

  await updateDoc(sessionRef, {
    status: "completed",
    endedAt: Timestamp.now(),
    user1Status: "completed",
    user2Status: "completed",
    compatibility,
  });
}

/**
 * Get active couple game
 */
export async function getActiveCoupleGame(coupleId: string) {
  const q = query(
    collection(db, `couples/${coupleId}/couple-games`),
    where("status", "==", "active"),
    orderBy("startedAt", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Get couple game history
 */
export async function getCoupleGameHistory(coupleId: string) {
  const q = query(
    collection(db, `couples/${coupleId}/couple-games`),
    where("status", "==", "completed"),
    orderBy("endedAt", "desc"),
    limit(20)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get average compatibility score
 */
export async function getAverageCompatibility(coupleId: string): Promise<number> {
  const history = await getCoupleGameHistory(coupleId);

  if (history.length === 0) return 0;

  const total = history.reduce(
    (sum, game) => sum + (game.compatibility || 0),
    0
  );
  return Math.round(total / history.length);
}

// Pre-defined game questions
export const coupleGameQuestions = {
  truthOrDare: {
    truth: [
      "What's something you've never told me?",
      "What was your first impression of me?",
      "What's your biggest fear about our relationship?",
      "Who was your celebrity crush?",
      "What's something you're proud of about yourself?",
      "When was the first moment you fell in love with me?",
      "What's one thing you'd change about me?",
      "Who do you admire the most?",
      "What's your biggest dream?",
      "What makes you feel most loved?",
    ],
    dare: [
      "Send me your best selfie",
      "Tell me what you love about me without stopping for 1 minute",
      "Do your best impression of me",
      "Send me a voice message singing our song",
      "Write a love letter to me and read it aloud",
      "Dance to our song for me",
      "Tell me 5 reasons you love me",
      "Call me and don't hang up for 10 minutes",
      "Send me a funny video of you",
      "Plan our next date and surprise me with details",
    ],
  },
  wouldYouRather: [
    "Live together or long distance with frequent visits?",
    "Vacation in mountains or beaches?",
    "Early riser or night owl?",
    "Adventure or relaxation?",
    "Small wedding or big party?",
    "City life or countryside?",
    "Movie night or dinner out?",
    "Kids or no kids?",
    "Work you love or high salary?",
    "Constant travel or stay in one place?",
  ],
  compatibility: [
    "What's your ideal weekend?",
    "How do you handle conflicts?",
    "What does love mean to you?",
    "Where do you see us in 5 years?",
    "What's your biggest strength?",
    "How do you express affection?",
    "What's important in a relationship?",
    "What's your definition of success?",
    "How do you like to be supported?",
    "What's your love language?",
  ],
  challenges: [
    "Give each other compliments for 2 minutes",
    "Make each other laugh for 1 minute",
    "Stare into each other's eyes for 1 minute",
    "Hold hands and describe your feelings",
    "Take a selfie with the best smile",
    "Plan a future adventure together",
    "Write a message about what you admire",
    "Share a favorite memory together",
    "Describe what you love about each other",
    "Plan a special date night",
  ],
};

/**
 * Get random question by game type
 */
export function getRandomQuestion(
  gameType: "truth-or-dare" | "would-you-rather" | "compatibility" | "challenge",
  subType?: string
): string {
  const questions =
    coupleGameQuestions[
      gameType as keyof typeof coupleGameQuestions
    ];

  if (subType && questions[subType as keyof typeof questions]) {
    const list = questions[subType as keyof typeof questions];
    return list[Math.floor(Math.random() * list.length)];
  }

  // For would-you-rather and compatibility, just return random
  if (Array.isArray(questions)) {
    return questions[Math.floor(Math.random() * questions.length)];
  }

  // For truth-or-dare, pick random truth or dare
  const type = Math.random() > 0.5 ? "truth" : "dare";
  const list = questions[type as keyof typeof questions];
  return list[Math.floor(Math.random() * list.length)];
}

export default {
  startTruthOrDareGame,
  startWouldYouRatherGame,
  startCompatibilityTest,
  submitGameAnswer,
  nextRound,
  endCoupleGame,
  getActiveCoupleGame,
  getCoupleGameHistory,
  getAverageCompatibility,
  getRandomQuestion,
};
