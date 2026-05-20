// =============================================
// Torch — Firestore Database Schema
// =============================================
// This file documents the complete database structure
// Copy the Firestore rules and collection setup from below

/**
 * FIRESTORE DATABASE STRUCTURE
 * 
 * This schema supports:
 * - User authentication & profiles
 * - Couple pairing with invite codes
 * - Real-time messaging/chat
 * - Photo sharing
 * - Drawing sharing & widget
 * - Distance tracking
 * - Relationship duration tracking
 * - Daily questions & answers
 * - Couple games & leaderboards
 * - Game sessions & scoring
 */

// =============================================
// 1. USERS COLLECTION
// =============================================
/**
 * Collection: users/{userId}
 * 
 * Purpose: User profiles and authentication data
 * 
 * Document structure:
 * {
 *   uid: string (Firebase Auth UID)
 *   email: string
 *   displayName: string
 *   photoURL: string (optional)
 *   partnerUid: string (optional, ID of connected partner)
 *   coupleId: string (optional, auto-generated couple ID)
 *   inviteCode: string (6-character code to share with partner)
 *   location: { latitude: number, longitude: number } (optional)
 *   locationUpdatedAt: Timestamp
 *   bio: string (optional)
 *   mood: string (optional, emoji)
 *   relationshipStartDate: Timestamp (when couple connected)
 *   createdAt: Timestamp
 *   updatedAt: Timestamp
 *   fcmToken: string (optional, for push notifications)
 *   isOnline: boolean
 *   lastActive: Timestamp
 * }
 */

// =============================================
// 2. COUPLES COLLECTION
// =============================================
/**
 * Collection: couples/{coupleId}
 * 
 * Purpose: Couple metadata and shared data
 * 
 * Document structure:
 * {
 *   user1Uid: string (first user's UID)
 *   user2Uid: string (second user's UID)
 *   user1Name: string
 *   user2Name: string
 *   connectedAt: Timestamp
 *   relationshipStartDate: Timestamp (when they started dating)
 *   anniversaryDate: Timestamp (optional)
 *   isActive: boolean
 *   distance: number (in km, calculated from locations)
 *   distanceUpdatedAt: Timestamp
 *   settings: {
 *     allowLocationSharing: boolean
 *     notificationsEnabled: boolean
 *     theme: string
 *   }
 * }
 */

// =============================================
// 3. MESSAGES COLLECTION (Chat)
// =============================================
/**
 * Collection: couples/{coupleId}/messages/{messageId}
 * 
 * Purpose: Real-time couple messaging/chat
 * 
 * Document structure:
 * {
 *   senderUid: string
 *   senderName: string
 *   text: string
 *   type: "text" | "image" | "emoji"
 *   imageUrl: string (optional, for image messages)
 *   createdAt: Timestamp
 *   editedAt: Timestamp (optional)
 *   readAt: Timestamp (optional)
 *   isRead: boolean
 *   reactions: { uid: string, emoji: string }[] (optional)
 * }
 */

// =============================================
// 4. PHOTOS COLLECTION
// =============================================
/**
 * Collection: couples/{coupleId}/photos/{photoId}
 * 
 * Purpose: Shared photos between couple
 * 
 * Document structure:
 * {
 *   uploadedByUid: string
 *   uploadedByName: string
 *   photoUrl: string (Firebase Storage URL)
 *   thumbnailUrl: string
 *   caption: string (optional)
 *   tags: string[] (optional, e.g., "vacation", "date-night")
 *   location: { latitude: number, longitude: number } (optional)
 *   createdAt: Timestamp
 *   updatedAt: Timestamp
 *   likes: { uid: string, likedAt: Timestamp }[] (optional)
 *   comments: {
 *     uid: string
 *     name: string
 *     text: string
 *     createdAt: Timestamp
 *   }[]
 * }
 */

// =============================================
// 5. DRAWINGS COLLECTION
// =============================================
/**
 * Collection: couples/{coupleId}/drawings/{drawingId}
 * 
 * Purpose: Shared drawings and sketches
 * 
 * Document structure:
 * {
 *   createdByUid: string
 *   createdByName: string
 *   drawingUrl: string (Firebase Storage URL - image of drawing)
 *   drawingData: string (optional, JSON of drawing strokes for replay)
 *   title: string (optional)
 *   description: string (optional)
 *   createdAt: Timestamp
 *   updatedAt: Timestamp
 *   likes: number
 *   reactions: { uid: string, emoji: string }[]
 * }
 */

// =============================================
// 6. DRAWING WIDGET
// =============================================
/**
 * Collection: couples/{coupleId}/widgets/drawing-widget
 * 
 * Purpose: Latest/featured drawing widget
 * 
 * Document structure:
 * {
 *   latestDrawingId: string (reference to latest drawing)
 *   latestDrawingUrl: string
 *   createdByUid: string
 *   createdByName: string
 *   createdAt: Timestamp
 *   weeklyDrawings: number (count of drawings this week)
 * }
 */

// =============================================
// 7. LOCATION TRACKING
// =============================================
/**
 * Collection: couples/{coupleId}/locations/{userId}
 * 
 * Purpose: Track partner locations for distance calculation
 * 
 * Document structure:
 * {
 *   uid: string
 *   userName: string
 *   latitude: number
 *   longitude: number
 *   accuracy: number (in meters)
 *   updatedAt: Timestamp
 *   address: string (optional, reverse geocoded)
 * }
 */

// =============================================
// 8. RELATIONSHIP STATS
// =============================================
/**
 * Collection: couples/{coupleId}/stats/overview
 * 
 * Purpose: Relationship duration and metrics
 * 
 * Document structure:
 * {
 *   daysTogether: number (calculated from relationshipStartDate)
 *   relationshipStartDate: Timestamp
 *   anniversaryDate: Timestamp (optional)
 *   nextAnniversary: Timestamp (calculated)
 *   daysUntilAnniversary: number
 *   totalMessages: number
 *   totalPhotos: number
 *   totalDrawings: number
 *   totalGamesSessions: number
 *   updatedAt: Timestamp
 *   milestones: {
 *     daysMilestones: number[] (e.g., [30, 100, 365, 1000])
 *     achieved: number[]
 *   }
 * }
 */

// =============================================
// 9. DAILY QUESTIONS
// =============================================
/**
 * Collection: daily_questions/{questionId}
 * 
 * Purpose: Repository of questions for the couple
 * 
 * Document structure:
 * {
 *   question: string
 *   category: "deep" | "fun" | "romantic" | "nostalgic" | "spicy" | "dream" | "game"
 *   difficulty: "easy" | "medium" | "hard"
 *   createdAt: Timestamp
 *   tags: string[]
 * }
 */

// =============================================
// 10. QUESTION ANSWERS
// =============================================
/**
 * Collection: couples/{coupleId}/questions/{questionId}
 * 
 * Purpose: Track question responses
 * 
 * Document structure:
 * {
 *   question: string
 *   category: string
 *   date: Timestamp (date assigned)
 *   answers: {
 *     user1Uid: {
 *       answer: string
 *       answeredAt: Timestamp
 *     },
 *     user2Uid: {
 *       answer: string
 *       answeredAt: Timestamp
 *     }
 *   }
 *   bothAnswered: boolean
 *   reactions: { uid: string, emoji: string }[]
 * }
 */

// =============================================
// 11. GAMES & LEADERBOARD
// =============================================
/**
 * Collection: couples/{coupleId}/games/{gameId}
 * 
 * Purpose: Game records and scores
 * 
 * Document structure:
 * {
 *   gameName: string (e.g., "Quiz", "Memory", "Word Match")
 *   type: "trivia" | "memory" | "word" | "cards" | "custom"
 *   difficulty: "easy" | "medium" | "hard"
 *   playedAt: Timestamp
 *   duration: number (in seconds)
 *   scores: {
 *     user1Uid: number,
 *     user2Uid: number
 *   }
 *   winner: string (uid of winner, or "tie")
 *   rounds: number
 *   questions: {
 *     questionId: string
 *     correctAnswer: string
 *     user1Answer: string
 *     user2Answer: string
 *   }[]
 * }
 */

// =============================================
// 12. GAME SESSIONS (Active Games)
// =============================================
/**
 * Collection: couples/{coupleId}/game-sessions/{sessionId}
 * 
 * Purpose: Ongoing game sessions
 * 
 * Document structure:
 * {
 *   gameType: string
 *   status: "waiting" | "playing" | "finished"
 *   createdBy: string (uid)
 *   startedAt: Timestamp
 *   endedAt: Timestamp (optional)
 *   currentRound: number
 *   totalRounds: number
 *   scores: { uid: number }
 *   players: {
 *     uid: string
 *     name: string
 *     ready: boolean
 *   }[]
 *   gameData: {
 *     currentQuestion: string
 *     options: string[]
 *     timeLimit: number
 *     answered: { uid: string, answer: string, time: number }[]
 *   }
 * }
 */

// =============================================
// 13. WIDGETS COLLECTION
// =============================================
/**
 * Collection: couples/{coupleId}/widgets/{widgetId}
 * 
 * Purpose: Custom widgets created by couple
 * 
 * Document structure:
 * {
 *   type: "photo" | "text" | "counter" | "timer" | "quote" | "drawing" | "game"
 *   title: string
 *   content: string (varies by type)
 *   createdByUid: string
 *   createdAt: Timestamp
 *   updatedAt: Timestamp
 *   position: number (for ordering on dashboard)
 *   isVisible: boolean
 *   metadata: {
 *     // Type-specific data
 *     photoUrl: string (if type: "photo")
 *     text: string (if type: "text")
 *     targetDate: Timestamp (if type: "counter" or "timer")
 *     quote: string (if type: "quote")
 *     gameId: string (if type: "game")
 *   }
 * }
 */

// =============================================
// 14. COUPLE GAMES
// =============================================
/**
 * Collection: couples/{coupleId}/couple-games/{sessionId}
 * 
 * Purpose: Real-time multiplayer games
 * 
 * Document structure:
 * {
 *   gameType: "truth-or-dare" | "would-you-rather" | "compatibility" | "challenge"
 *   status: "active" | "completed" | "abandoned"
 *   initiatedBy: string (uid)
 *   startedAt: Timestamp
 *   endedAt: Timestamp (optional)
 *   user1Status: "ready" | "playing" | "waiting" | "completed"
 *   user2Status: "ready" | "playing" | "waiting" | "completed"
 *   rounds: number
 *   currentRound: number
 *   totalScore: { uid: number }
 *   compatibility: number (percentage, 0-100)
 *   results: {
 *     category: string
 *     questions: number
 *     matches: number
 *     percentage: number
 *   }[]
 * }
 */

// =============================================
// 15. NOTIFICATIONS
// =============================================
/**
 * Collection: couples/{coupleId}/notifications/{notificationId}
 * 
 * Purpose: Notification log for couple
 * 
 * Document structure:
 * {
 *   type: "message" | "photo" | "drawing" | "game" | "question" | "milestone"
 *   title: string
 *   body: string
 *   recipientUid: string
 *   senderUid: string
 *   createdAt: Timestamp
 *   readAt: Timestamp (optional)
 *   isRead: boolean
 *   actionUrl: string (optional, link to relevant content)
 *   metadata: {
 *     // Type-specific metadata
 *     photoId: string (if type: "photo")
 *     drawingId: string (if type: "drawing")
 *     gameId: string (if type: "game")
 *     questionId: string (if type: "question")
 *   }
 * }
 */

// =============================================
// SECURITY RULES (Apply in Firebase Console)
// =============================================
/**
 
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow users to read couple data if they're part of couple
    match /couples/{coupleId} {
      allow read: if request.auth.uid in resource.data.user1Uid || request.auth.uid in resource.data.user2Uid;
      allow write: if request.auth.uid in resource.data.user1Uid || request.auth.uid in resource.data.user2Uid;
      
      // All subcollections under couple
      match /{document=**} {
        allow read: if request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.user1Uid || 
                       request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.user2Uid;
        allow write: if request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.user1Uid || 
                        request.auth.uid in get(/databases/$(database)/documents/couples/$(coupleId)).data.user2Uid;
      }
    }
    
    // Daily questions readable by everyone
    match /daily_questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admin writes
    }
  }
}

 */

export {};
