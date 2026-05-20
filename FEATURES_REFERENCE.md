# 🔥 Torch — Complete Features & Functions Reference

## 📋 Table of Contents

1. [Authentication & User Management](#authentication--user-management)
2. [Couple Pairing & Connection](#couple-pairing--connection)
3. [Real-Time Messaging (Chat)](#real-time-messaging-chat)
4. [Photo Sharing](#photo-sharing)
5. [Drawing & Sketches](#drawing--sketches)
6. [Custom Widgets](#custom-widgets)
7. [Location & Distance Tracking](#location--distance-tracking)
8. [Relationship Duration & Stats](#relationship-duration--stats)
9. [Daily Questions](#daily-questions)
10. [Games & Leaderboards](#games--leaderboards)
11. [Couple Games](#couple-games)

---

## Authentication & User Management

### Functions Available

#### `signUp(email, password, displayName, photoURL)`
Create new user account
```typescript
import { signUp } from "@/lib/auth";

const user = await signUp(
  "user@email.com",
  "Password123!",
  "John Doe",
  photoUrl
);
```

#### `signIn(email, password)`
Log in existing user
```typescript
const user = await signIn("user@email.com", "Password123!");
```

#### `signInWithGoogle()`
Log in with Google OAuth
```typescript
const user = await signInWithGoogle();
```

#### `signOutUser()`
Log out current user
```typescript
await signOutUser();
```

#### `createUserProfile(firebaseUser, displayName, photoURL)`
Create user profile in Firestore
```typescript
await createUserProfile(user, displayName, photoUrl);
```

#### `getUserProfile(uid)`
Get user profile data
```typescript
const profile = await getUserProfile("user-uid");
```

---

## Couple Pairing & Connection

### Functions Available

#### `generateInviteCode()`
Generate 6-character invite code
```typescript
import { generateInviteCode } from "@/lib/auth";

const code = generateInviteCode(); // e.g., "AB12CD"
```

#### `connectCouple(user1Uid, user2Uid, inviteCode)`
Connect two users as a couple
```typescript
import { connectCouple } from "@/lib/auth";

const coupleId = await connectCouple(uid1, uid2, "AB12CD");
```

#### `getPartnerProfile(coupleId, currentUserUid)`
Get partner's profile
```typescript
const partner = await getPartnerProfile(coupleId, myUid);
```

#### `getCoupleData(coupleId)`
Get couple shared data
```typescript
const couple = await getCoupleData(coupleId);
```

---

## Real-Time Messaging (Chat)

### Database Structure
```
couples/{coupleId}/messages/{messageId}
├── senderUid: string
├── text: string
├── type: "text" | "image" | "emoji"
├── createdAt: Timestamp
├── isRead: boolean
└── reactions: [{ uid, emoji }]
```

### Functions Available

#### `sendMessage(coupleId, senderUid, text)`
Send a text message
```typescript
import { sendMessage } from "@/lib/chat";

await sendMessage(coupleId, userId, "I love you! 💕");
```

#### `getMessages(coupleId, limit)`
Fetch message history
```typescript
const messages = await getMessages(coupleId, 50);
```

#### `listenToMessages(coupleId, callback)`
Real-time message listener
```typescript
import { listenToMessages } from "@/lib/chat";

listenToMessages(coupleId, (messages) => {
  console.log("New messages:", messages);
});
```

#### `markMessageAsRead(coupleId, messageId)`
Mark message as read
```typescript
await markMessageAsRead(coupleId, messageId);
```

#### `deleteMessage(coupleId, messageId)`
Delete a message
```typescript
await deleteMessage(coupleId, messageId);
```

#### `editMessage(coupleId, messageId, newText)`
Edit a message
```typescript
await editMessage(coupleId, messageId, "Updated text");
```

#### `addReactionToMessage(coupleId, messageId, userUid, emoji)`
Add emoji reaction to message
```typescript
await addReactionToMessage(coupleId, messageId, userId, "❤️");
```

#### `getUnreadCount(coupleId, userUid)`
Get count of unread messages
```typescript
const unreadCount = await getUnreadCount(coupleId, userId);
```

---

## Photo Sharing

### Database Structure
```
couples/{coupleId}/photos/{photoId}
├── uploadedByUid: string
├── photoUrl: string
├── caption: string
├── tags: [string]
├── createdAt: Timestamp
└── likes: number
```

### Functions Available

#### `uploadPhoto(coupleId, imageFile, caption, tags)`
Upload a photo
```typescript
import { uploadPhoto } from "@/lib/memories";

const photoId = await uploadPhoto(
  coupleId,
  imageFile,
  "Our date night! 💕",
  ["date-night", "restaurant"]
);
```

#### `getCouplePhotos(coupleId)`
Get all photos
```typescript
const photos = await getCouplePhotos(coupleId);
```

#### `getPhotosByTag(coupleId, tag)`
Get photos with specific tag
```typescript
const vacationPhotos = await getPhotosByTag(coupleId, "vacation");
```

#### `searchPhotos(coupleId, query)`
Search photos by caption
```typescript
const results = await searchPhotos(coupleId, "beach");
```

#### `likePhoto(coupleId, photoId, userUid)`
Like a photo
```typescript
await likePhoto(coupleId, photoId, userId);
```

#### `deletePhoto(coupleId, photoId)`
Delete a photo
```typescript
await deletePhoto(coupleId, photoId);
```

---

## Drawing & Sketches

### Database Structure
```
couples/{coupleId}/drawings/{drawingId}
├── createdByUid: string
├── drawingUrl: string
├── drawingData: string (JSON)
├── title: string
├── createdAt: Timestamp
└── reactions: [{ uid, emoji }]
```

### Functions Available

#### `uploadDrawing(coupleId, drawingImage, createdByUid, createdByName, title, drawingData)`
Upload a drawing
```typescript
import { uploadDrawing } from "@/lib/drawings";

const drawingId = await uploadDrawing(
  coupleId,
  canvasBlob,
  userId,
  userName,
  "My favorite person"
);
```

#### `getCoupleDrawings(coupleId)`
Get all drawings
```typescript
const drawings = await getCoupleDrawings(coupleId);
```

#### `getRecentDrawings(coupleId, limit)`
Get recent drawings
```typescript
const recent = await getRecentDrawings(coupleId, 5);
```

#### `getLatestDrawing(coupleId)`
Get the latest drawing (for widget)
```typescript
const latest = await getLatestDrawing(coupleId);
```

#### `likeDrawing(coupleId, drawingId, userUid)`
Like a drawing
```typescript
await likeDrawing(coupleId, drawingId, userId);
```

#### `reactToDrawing(coupleId, drawingId, userUid, emoji)`
Add emoji reaction
```typescript
await reactToDrawing(coupleId, drawingId, userId, "😍");
```

#### `deleteDrawing(coupleId, drawingId)`
Delete a drawing
```typescript
await deleteDrawing(coupleId, drawingId);
```

#### `getDrawingStats(coupleId)`
Get drawing statistics
```typescript
const stats = await getDrawingStats(coupleId);
// { totalDrawings, totalLikes, thisWeek, thisMonth }
```

---

## Custom Widgets

### Database Structure
```
couples/{coupleId}/widgets/{widgetId}
├── type: "photo" | "text" | "counter" | "timer" | "quote" | "drawing" | "game"
├── title: string
├── position: number
├── isVisible: boolean
└── metadata: { ... }
```

### Widget Types

**Counter Widget** - Counts days to date
```typescript
import { createCounterWidget } from "@/lib/widgets";

await createCounterWidget(
  coupleId,
  userId,
  "Days Together",
  relationshipStartDate
);
```

**Timer Widget** - Countdown to date
```typescript
await createTimerWidget(
  coupleId,
  userId,
  "Until Vacation",
  vacationDate
);
```

**Photo Widget** - Display featured photo
```typescript
await createPhotoWidget(
  coupleId,
  userId,
  "Our First Date",
  photoUrl
);
```

**Text Widget** - Display custom text
```typescript
await createTextWidget(
  coupleId,
  userId,
  "Our Love Story",
  "We met at..."
);
```

**Drawing Widget** - Show latest drawing
```typescript
await createDrawingWidget(coupleId, userId);
```

**Quote Widget** - Display favorite quote
```typescript
await createQuoteWidget(
  coupleId,
  userId,
  "Forever with you 💕"
);
```

**Game Widget** - Quick access to games
```typescript
await createGameWidget(coupleId, userId, gameId);
```

### Widget Management Functions

#### `getCoupleWidgets(coupleId)`
Get all widgets (ordered)
```typescript
const widgets = await getCoupleWidgets(coupleId);
```

#### `updateWidget(coupleId, widgetId, updates)`
Update widget
```typescript
await updateWidget(coupleId, widgetId, {
  title: "New Title",
  isVisible: true
});
```

#### `deleteWidget(coupleId, widgetId)`
Delete widget
```typescript
await deleteWidget(coupleId, widgetId);
```

#### `reorderWidgets(coupleId, widgetIds)`
Reorder widgets on dashboard
```typescript
await reorderWidgets(coupleId, ["widget1", "widget2", "widget3"]);
```

#### `getDashboardWidgets(coupleId)`
Get dashboard widgets in order
```typescript
const dashboard = await getDashboardWidgets(coupleId);
```

---

## Location & Distance Tracking

### Database Structure
```
couples/{coupleId}/locations/{userId}
├── uid: string
├── latitude: number
├── longitude: number
├── accuracy: number (meters)
├── updatedAt: Timestamp
└── address: string (optional)
```

### Functions Available

#### `updateUserLocation(coupleId, userUid, userName, latitude, longitude, accuracy)`
Update user's location
```typescript
import { updateUserLocation } from "@/lib/location";

await updateUserLocation(
  coupleId,
  userId,
  "John",
  40.7128,
  -74.0060,
  10
);
```

#### `calculateCoupleDistance(coupleId, user1Uid, user2Uid)`
Calculate distance between couple
```typescript
const distanceKm = await calculateCoupleDistance(coupleId, uid1, uid2);
// Returns: 42.5 (km)
```

#### `getDistanceStatus(distanceKm)`
Get user-friendly distance status
```typescript
const status = getDistanceStatus(42.5);
// Returns: "🛣️ Close distance"
```

#### `formatDistance(distanceKm)`
Format distance for display
```typescript
const formatted = formatDistance(42.5);
// Returns: "42.5 km away"
```

#### `areUsersInSameCity(coupleId, user1Uid, user2Uid)`
Check if couple is in same city
```typescript
const sameCity = await areUsersInSameCity(coupleId, uid1, uid2);
// Returns: true/false
```

#### `enableLocationSharing(coupleId, userUid)`
Enable location sharing
```typescript
await enableLocationSharing(coupleId, userId);
```

#### `getLocationSharingStatus(coupleId)`
Check if location sharing is enabled
```typescript
const enabled = await getLocationSharingStatus(coupleId);
```

---

## Relationship Duration & Stats

### Database Structure
```
couples/{coupleId}/stats/overview
├── daysTogether: number
├── relationshipStartDate: Timestamp
├── anniversaryDate: Timestamp
├── daysUntilAnniversary: number
├── totalMessages: number
├── totalPhotos: number
├── totalDrawings: number
├── totalGamesSessions: number
└── milestones: { daysMilestones, achieved }
```

### Functions Available

#### `initializeRelationshipStats(coupleId, relationshipStartDate, anniversaryDate)`
Initialize couple stats (run when couple connects)
```typescript
import { initializeRelationshipStats } from "@/lib/relationshipStats";

await initializeRelationshipStats(
  coupleId,
  relationshipStartDate,
  anniversaryDate
);
```

#### `getRelationshipStats(coupleId)`
Get relationship statistics
```typescript
const stats = await getRelationshipStats(coupleId);
// { daysTogether, totalMessages, totalPhotos, ... }
```

#### `calculateDaysTogether(startDate)`
Calculate days between dates
```typescript
const days = calculateDaysTogether(startDate);
// Returns: 365
```

#### `formatRelationshipDuration(days)`
Format duration nicely
```typescript
const formatted = formatRelationshipDuration(365);
// Returns: "1 year"
```

#### `getMilestoneEmoji(days)`
Get emoji for milestone
```typescript
const emoji = getMilestoneEmoji(365);
// Returns: "💍"
```

#### `getFormattedStats(coupleId)`
Get all stats formatted for display
```typescript
const display = await getFormattedStats(coupleId);
// {
//   daysTogether: 365,
//   formattedDuration: "1 year",
//   emoji: "💍",
//   daysUntilAnniversary: 42,
//   ...
// }
```

#### `updateStatsCounter(coupleId, counterName, increment)`
Update stat counters
```typescript
// When message sent
await updateStatsCounter(coupleId, "totalMessages", 1);

// When photo uploaded
await updateStatsCounter(coupleId, "totalPhotos", 1);
```

#### `checkAndUnlockMilestones(coupleId)`
Check for milestone achievements
```typescript
await checkAndUnlockMilestones(coupleId);
// Automatically unlocks 30, 100, 365, 1000 day milestones
```

---

## Daily Questions

### Database Structure
```
daily_questions/{questionId}
├── question: string
├── category: "deep" | "fun" | "romantic" | "nostalgic" | "spicy" | "dream"
├── difficulty: "easy" | "medium" | "hard"
└── tags: [string]

couples/{coupleId}/questions/{questionId}
├── question: string
├── date: Timestamp
└── answers: { user1Uid: { answer, answeredAt }, ... }
```

### Functions Available

#### `getDailyQuestion(coupleId)`
Get today's question
```typescript
import { getDailyQuestion } from "@/lib/questions";

const question = await getDailyQuestion(coupleId);
// { id, question, category, ... }
```

#### `submitAnswer(coupleId, questionId, userUid, answer)`
Submit question answer
```typescript
await submitAnswer(coupleId, questionId, userId, "My answer...");
```

#### `getPartnerAnswer(coupleId, questionId, userUid)`
Get partner's answer
```typescript
const partnerAnswer = await getPartnerAnswer(coupleId, questionId, userId);
```

#### `checkUserAnswer(coupleId, questionId, userUid)`
Check if user answered
```typescript
const answered = await checkUserAnswer(coupleId, questionId, userId);
// Returns: true/false
```

#### `getQuestionHistory(coupleId, limit)`
Get question history
```typescript
const history = await getQuestionHistory(coupleId, 30);
```

---

## Games & Leaderboards

### Database Structure
```
couples/{coupleId}/games/{gameId}
├── gameName: string
├── type: "trivia" | "memory" | "word" | "cards"
├── playedAt: Timestamp
├── scores: { uid: number }
└── winner: string

couples/{coupleId}/game-sessions/{sessionId}
├── gameType: string
├── status: "waiting" | "playing" | "finished"
├── currentRound: number
├── scores: { uid: number }
└── winner: string
```

### Functions Available

#### `createGameSession(coupleId, gameType, createdBy, totalRounds)`
Start a new game
```typescript
import { createGameSession } from "@/lib/games";

const sessionId = await createGameSession(
  coupleId,
  "trivia",
  userId,
  5
);
```

#### `startGameSession(coupleId, sessionId, initialScores)`
Begin playing
```typescript
await startGameSession(coupleId, sessionId, { uid1: 0, uid2: 0 });
```

#### `updateGameScore(coupleId, sessionId, playerUid, pointsToAdd)`
Update player score during game
```typescript
await updateGameScore(coupleId, sessionId, userId, 10);
```

#### `finishGameSession(coupleId, sessionId, winnerId)`
End game and save to history
```typescript
await finishGameSession(coupleId, sessionId, winnerId);
```

#### `getGameHistory(coupleId, limit)`
Get past games
```typescript
const history = await getGameHistory(coupleId, 20);
```

#### `getPlayerGameStats(coupleId, playerUid)`
Get player statistics
```typescript
const stats = await getPlayerGameStats(coupleId, userId);
// { totalGames, totalWins, winRate, totalPoints, averageScore }
```

#### `getGameLeaderboard(coupleId)`
Get couple leaderboard
```typescript
const leaderboard = await getGameLeaderboard(coupleId);
// { player1: { ... }, player2: { ... } }
```

---

## Couple Games

### Database Structure
```
couples/{coupleId}/couple-games/{sessionId}
├── gameType: "truth-or-dare" | "would-you-rather" | "compatibility"
├── status: "active" | "completed"
├── currentRound: number
├── totalScore: { uid: number }
└── compatibility: number (0-100)
```

### Game Types

#### Truth or Dare
**Start game:**
```typescript
import { startTruthOrDareGame } from "@/lib/coupleGames";

const gameId = await startTruthOrDareGame(coupleId, userId);
```

**Get questions:**
```typescript
import { getRandomQuestion } from "@/lib/coupleGames";

const truthQuestion = getRandomQuestion("truth-or-dare", "truth");
const dareChallenge = getRandomQuestion("truth-or-dare", "dare");
```

#### Would You Rather
**Start game:**
```typescript
const gameId = await startWouldYouRatherGame(coupleId, userId);
```

**Pre-defined questions:**
```typescript
// Automatically uses 10 pre-made "would you rather" questions
```

#### Compatibility Test
**Start test:**
```typescript
const testId = await startCompatibilityTest(coupleId, userId);
```

**Get compatibility questions:**
```typescript
const questions = coupleGameQuestions.compatibility;
// 10 questions to test how compatible you are
```

### Functions Available

#### `startTruthOrDareGame(coupleId, initiatedBy)`
Start Truth or Dare
```typescript
const gameId = await startTruthOrDareGame(coupleId, userId);
```

#### `startWouldYouRatherGame(coupleId, initiatedBy)`
Start Would You Rather
```typescript
const gameId = await startWouldYouRatherGame(coupleId, userId);
```

#### `startCompatibilityTest(coupleId, initiatedBy)`
Start Compatibility Test
```typescript
const testId = await startCompatibilityTest(coupleId, userId);
```

#### `submitGameAnswer(coupleId, sessionId, userUid, answer)`
Submit answer
```typescript
await submitGameAnswer(coupleId, gameId, userId, "My answer");
```

#### `nextRound(coupleId, sessionId, user1Answer, user2Answer, points1, points2)`
Progress to next round
```typescript
await nextRound(
  coupleId,
  gameId,
  "answer1",
  "answer2",
  10,
  10
);
```

#### `endCoupleGame(coupleId, sessionId, compatibility)`
End couple game
```typescript
await endCoupleGame(coupleId, gameId, 87); // 87% compatible
```

#### `getActiveCoupleGame(coupleId)`
Get current game
```typescript
const game = await getActiveCoupleGame(coupleId);
```

#### `getCoupleGameHistory(coupleId)`
Get game history
```typescript
const history = await getCoupleGameHistory(coupleId);
```

#### `getAverageCompatibility(coupleId)`
Get average compatibility over time
```typescript
const avgCompat = await getAverageCompatibility(coupleId);
// Returns: 85 (percentage)
```

#### `getRandomQuestion(gameType, subType)`
Get random question for game
```typescript
const q = getRandomQuestion("truth-or-dare", "truth");
```

---

## Pre-Defined Question Banks

### Truth or Dare Questions

**Truths:**
- "What's something you've never told me?"
- "What was your first impression of me?"
- "When was the first moment you fell in love with me?"
- (+ 7 more)

**Dares:**
- "Send me your best selfie"
- "Tell me what you love about me without stopping for 1 minute"
- "Dance to our song for me"
- (+ 7 more)

### Would You Rather Questions
- "Vacation in mountains or beaches?"
- "Movie night or dinner out?"
- "Living together or long distance?"
- (+ 7 more)

### Compatibility Questions
- "Do you want kids?"
- "What's your ideal future?"
- "How do you handle conflict?"
- (+ 7 more)

### Challenge Questions
- "Give each other compliments for 2 minutes"
- "Stare into each other's eyes for 1 minute"
- "Write a love letter and read it"
- (+ 7 more)

---

## Summary

**Total Functions: 100+**

**Core Categories:**
1. Authentication (6 functions)
2. Chat (8 functions)
3. Photos (6 functions)
4. Drawings (8 functions)
5. Widgets (14 functions)
6. Location (11 functions)
7. Relationship Stats (11 functions)
8. Questions (5 functions)
9. Games (7 functions)
10. Couple Games (10 functions)

**Features Enabled:**
✅ User authentication  
✅ Couple pairing  
✅ Real-time chat  
✅ Photo sharing  
✅ Drawing widget  
✅ Custom widgets  
✅ Distance tracking  
✅ Relationship counting  
✅ Daily questions  
✅ Individual games  
✅ Couple games  
✅ Leaderboards  
✅ Milestones  
✅ Stats tracking  

---

**Ready to use!** Import functions and start building amazing couple experiences 💕

For database setup, see: [DATABASE_SETUP.md](DATABASE_SETUP.md)
