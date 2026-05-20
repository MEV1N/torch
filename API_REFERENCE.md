# 🔌 Torch — API Reference

Complete reference for all utility functions and hooks.

---

## 📚 Table of Contents

1. [Authentication](#authentication)
2. [Chat](#chat)
3. [Questions](#questions)
4. [Streaks](#streaks)
5. [Memories](#memories)
6. [Love Notes](#love-notes)
7. [Thumb Kiss](#thumb-kiss)
8. [Notifications](#notifications)
9. [Custom Hooks](#custom-hooks)
10. [Utilities](#utilities)

---

## 🔐 Authentication

### `signUp(email, password, displayName)`
Create new user account.

```typescript
import { signUp } from "@/lib/auth";

try {
  const user = await signUp("email@example.com", "password123", "John Doe");
  console.log("Signed up:", user.uid);
} catch (error) {
  console.error("Signup failed:", error);
}
```

**Parameters:**
- `email` (string): User email
- `password` (string): User password
- `displayName` (string): User's display name

**Returns:** Firebase User object

---

### `signIn(email, password)`
Sign in existing user.

```typescript
import { signIn } from "@/lib/auth";

const user = await signIn("email@example.com", "password123");
```

**Parameters:**
- `email` (string): User email
- `password` (string): User password

**Returns:** Firebase User object

---

### `signInWithGoogle()`
Sign in with Google OAuth.

```typescript
import { signInWithGoogle } from "@/lib/auth";

const user = await signInWithGoogle();
```

**Returns:** Firebase User object

---

### `signOutUser()`
Sign out current user.

```typescript
import { signOutUser } from "@/lib/auth";

await signOutUser();
// User is now logged out
```

---

### `createUserProfile(uid, data)`
Create user profile document in Firestore.

```typescript
import { createUserProfile } from "@/lib/auth";

await createUserProfile(user.uid, {
  displayName: "John Doe",
  email: "john@example.com",
  photoURL: "https://..."
});
```

**Parameters:**
- `uid` (string): User's Firebase UID
- `data` (object): User profile data
  - `displayName` (string): User's name
  - `email` (string): User's email
  - `photoURL` (string, optional): Profile picture URL

---

## 💬 Chat

### `sendMessage(coupleId, senderId, text)`
Send a message in couple chat.

```typescript
import { sendMessage } from "@/lib/chat";

const messageId = await sendMessage(
  "couple123",
  "user456",
  "I love you so much! ❤️"
);
```

**Parameters:**
- `coupleId` (string): Couple's ID
- `senderId` (string): User sending the message
- `text` (string): Message content

**Returns:** Message ID (string)

---

### `markMessageAsRead(coupleId, messageId)`
Mark message as read.

```typescript
import { markMessageAsRead } from "@/lib/chat";

await markMessageAsRead("couple123", "msg789");
```

---

### `deleteMessage(coupleId, messageId)`
Delete a message.

```typescript
import { deleteMessage } from "@/lib/chat";

await deleteMessage("couple123", "msg789");
```

---

### `editMessage(coupleId, messageId, newText)`
Edit message content.

```typescript
import { editMessage } from "@/lib/chat";

await editMessage("couple123", "msg789", "Updated message text");
```

---

### `getUnreadCount(coupleId, userId)`
Get unread message count.

```typescript
import { getUnreadCount } from "@/lib/chat";

const count = await getUnreadCount("couple123", "user456");
console.log(`You have ${count} unread messages`);
```

**Returns:** Number of unread messages

---

## ❓ Questions

### `getDailyQuestion(date)`
Get question for specific date.

```typescript
import { getDailyQuestion } from "@/lib/questions";

const todayString = new Date().toISOString().split('T')[0]; // "2024-05-19"
const question = await getDailyQuestion(todayString);
console.log(question.question);
```

**Parameters:**
- `date` (string): Date in format YYYY-MM-DD

**Returns:** Question object or null

---

### `submitAnswer(coupleId, userId, questionId, answer, date)`
Submit answer to a question.

```typescript
import { submitAnswer } from "@/lib/questions";

await submitAnswer(
  "couple123",
  "user456",
  "q789",
  "My favorite memory is our first kiss",
  "2024-05-19"
);
```

---

### `getPartnerAnswer(coupleId, partnerId, questionId, date)`
Get partner's answer to a question.

```typescript
import { getPartnerAnswer } from "@/lib/questions";

const answer = await getPartnerAnswer(
  "couple123",
  "partner789",
  "q123",
  "2024-05-19"
);
console.log("Partner answered:", answer.answer);
```

**Returns:** Answer object or null

---

### `checkUserAnswer(coupleId, userId, questionId, date)`
Check if user already answered a question.

```typescript
import { checkUserAnswer } from "@/lib/questions";

const hasAnswered = await checkUserAnswer(
  "couple123",
  "user456",
  "q789",
  "2024-05-19"
);
```

**Returns:** Boolean

---

## 🔥 Streaks

### `getOrCreateStreak(coupleId)`
Get or create streak document.

```typescript
import { getOrCreateStreak } from "@/lib/streaks";

const streak = await getOrCreateStreak("couple123");
console.log(`Current streak: ${streak.count} days`);
console.log(`Longest streak: ${streak.longestStreak} days`);
```

**Returns:** Streak object

---

### `incrementStreak(coupleId)`
Increment streak by 1 day.

```typescript
import { incrementStreak } from "@/lib/streaks";

await incrementStreak("couple123");
```

---

### `resetStreak(coupleId)`
Reset streak to 0.

```typescript
import { resetStreak } from "@/lib/streaks";

await resetStreak("couple123");
```

---

### `shouldResetStreak(lastUpdated)`
Check if streak should be reset.

```typescript
import { shouldResetStreak } from "@/lib/streaks";

const lastUpdate = new Date("2024-05-17");
if (shouldResetStreak(lastUpdate)) {
  console.log("Streak should be reset!");
}
```

**Parameters:**
- `lastUpdated` (Date): Last streak update date

**Returns:** Boolean

---

### `getStreakMessage(count)`
Get motivational message for streak count.

```typescript
import { getStreakMessage } from "@/lib/streaks";

console.log(getStreakMessage(7));   // "🎉 One week together! Amazing!"
console.log(getStreakMessage(30));  // "👑 One month! You're a power couple!"
```

**Returns:** String message

---

### `getMilestoneMessage(days)`
Get milestone message for days count.

```typescript
import { getMilestoneMessage } from "@/lib/streaks";

const message = getMilestoneMessage(365); // "One year anniversary! 👑"
```

**Returns:** String or null if no milestone

---

## 📸 Memories

### `uploadMemory(coupleId, uploadedBy, imageFile, caption, tags)`
Upload a memory photo.

```typescript
import { uploadMemory } from "@/lib/memories";

const fileInput = document.querySelector('input[type="file"]');
const imageUrl = await uploadMemory(
  "couple123",
  "user456",
  fileInput.files[0],
  "Our beach vacation!",
  ["beach", "vacation", "summer"]
);
```

**Parameters:**
- `coupleId` (string): Couple's ID
- `uploadedBy` (string): User uploading
- `imageFile` (File): Image file from input
- `caption` (string): Memory description
- `tags` (string[]): Tags for organization

**Returns:** URL of uploaded image

---

### `getCoupleMemories(coupleId)`
Get all couple's memories.

```typescript
import { getCoupleMemories } from "@/lib/memories";

const memories = await getCoupleMemories("couple123");
memories.forEach(m => console.log(m.caption));
```

**Returns:** Array of Memory objects

---

### `getMemoriesByTag(coupleId, tag)`
Get memories by tag.

```typescript
import { getMemoriesByTag } from "@/lib/memories";

const beachPhotos = await getMemoriesByTag("couple123", "beach");
```

**Returns:** Array of Memory objects

---

### `searchMemories(coupleId, keyword)`
Search memories by caption or tags.

```typescript
import { searchMemories } from "@/lib/memories";

const results = await searchMemories("couple123", "vacation");
```

**Parameters:**
- `coupleId` (string): Couple's ID
- `keyword` (string): Search term

**Returns:** Array of matching Memory objects

---

### `deleteMemory(coupleId, memoryId, imageUrl)`
Delete a memory.

```typescript
import { deleteMemory } from "@/lib/memories";

await deleteMemory(
  "couple123",
  "memory789",
  "https://storage.googleapis.com/..."
);
```

---

## 💌 Love Notes

### `sendLoveNote(coupleId, fromUserId, toUserId, text)`
Send a love note.

```typescript
import { sendLoveNote } from "@/lib/loveNotes";

await sendLoveNote(
  "couple123",
  "user456",
  "user789",
  "I can't stop thinking about you... 💕"
);
```

---

### `getLoveNotes(coupleId, limit)`
Get love notes for couple.

```typescript
import { getLoveNotes } from "@/lib/loveNotes";

const notes = await getLoveNotes("couple123", 20);
notes.forEach(n => console.log(n.text));
```

**Parameters:**
- `coupleId` (string): Couple's ID
- `limit` (number, optional): Max notes to fetch (default: 20)

**Returns:** Array of LoveNote objects

---

### `getUnreadNotesCount(coupleId, userId)`
Get unread notes count.

```typescript
import { getUnreadNotesCount } from "@/lib/loveNotes";

const count = await getUnreadNotesCount("couple123", "user456");
```

**Returns:** Number of unread notes

---

## 💋 Thumb Kiss

### `initializeThumbKiss(coupleId)`
Initialize thumb kiss interaction.

```typescript
import { initializeThumbKiss } from "@/lib/thumbKiss";

await initializeThumbKiss("couple123");
```

---

### `listenToThumbKiss(coupleId, callback)`
Listen to thumb kiss state changes.

```typescript
import { listenToThumbKiss } from "@/lib/thumbKiss";

const unsubscribe = listenToThumbKiss("couple123", (data) => {
  console.log("User 1 active:", data.user1Active);
  console.log("User 2 active:", data.user2Active);
  
  if (data.user1Active && data.user2Active) {
    console.log("💋 Connection made!");
  }
});

// Stop listening
unsubscribe();
```

**Parameters:**
- `coupleId` (string): Couple's ID
- `callback` (function): Called with ThumbKiss data

---

### `updateThumbState(coupleId, userId, isActive)`
Update user's thumb state.

```typescript
import { updateThumbState } from "@/lib/thumbKiss";

// User pressed button
await updateThumbState("couple123", "user456", true);

// User released button
await updateThumbState("couple123", "user456", false);
```

---

## 🔔 Notifications

### `sendNotification(userId, type, title, body, metadata)`
Send notification.

```typescript
import { sendNotification } from "@/lib/notifications";

await sendNotification(
  "user456",
  "question",
  "New question available! 🎉",
  "Check your daily question",
  { questionId: "q789" }
);
```

**Parameters:**
- `userId` (string): Recipient user ID
- `type` (string): "question" | "streak" | "chat" | "note" | "memory" | "kiss"
- `title` (string): Notification title
- `body` (string): Notification body
- `metadata` (object, optional): Additional data

---

### Notification Templates

```typescript
import { notificationTemplates } from "@/lib/notifications";

// Use predefined templates
const { title, body } = notificationTemplates.partnerAnsweredQuestion("Sarah");
await sendNotification(userId, "question", title, body);
```

**Available Templates:**
- `partnerAnsweredQuestion(name)`
- `streakMilestone(days)`
- `streakAtRisk()`
- `receivedLoveNote(name)`
- `memoryShared(name)`
- `thumbKissReceived(name)`

---

## 🎣 Custom Hooks

### `useAuth()`
Get authentication context.

```typescript
import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { firebaseUser, userProfile, partner, couple, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  
  return <div>{userProfile?.displayName}</div>;
}
```

**Returns:**
- `firebaseUser` (User | null): Firebase user object
- `userProfile` (UserProfile | null): User's profile data
- `partner` (UserProfile | null): Partner's profile
- `couple` (Couple | null): Couple data
- `loading` (boolean): Loading state
- `refreshProfile` (function): Refresh profile data

---

### `useIsAuthenticated()`
Check if user is logged in.

```typescript
import { useIsAuthenticated } from "@/lib/useAuth";

const isAuth = useIsAuthenticated();
return isAuth ? <Dashboard /> : <LoginPage />;
```

**Returns:** Boolean

---

### `useIsPaired()`
Check if user has a partner.

```typescript
import { useIsPaired } from "@/lib/useAuth";

const isPaired = useIsPaired();
return isPaired ? <Home /> : <PairPage />;
```

**Returns:** Boolean

---

### `usePartnerName()`
Get partner's display name.

```typescript
import { usePartnerName } from "@/lib/useAuth";

const partnerName = usePartnerName(); // "Sarah"
return <div>Message for {partnerName}</div>;
```

**Returns:** String

---

### `useRelationshipDays()`
Get days in relationship.

```typescript
import { useRelationshipDays } from "@/lib/useAuth";

const days = useRelationshipDays(); // 123
return <div>Together for {days} beautiful days!</div>;
```

**Returns:** Number

---

### `useAuthCheck()`
Get comprehensive auth status.

```typescript
import { useAuthCheck } from "@/lib/useAuth";

const {
  isAuthenticated,
  isPaired,
  isLoading,
  userId,
  userEmail,
  profileComplete
} = useAuthCheck();
```

---

## 🛠️ Utilities

### Emotional Utilities

```typescript
import {
  getRandomQuote,
  getRandomMotivation,
  getRandomMoodEmoji,
  getTimeBasedGreeting,
  romanticQuotes,
  streakMotivations,
  moodEmojis
} from "@/lib/emotional";

// Get random romantic quote
console.log(getRandomQuote()); // "You are my greatest adventure. 💕"

// Get motivation for streaks
console.log(getRandomMotivation()); // "Keep the flame alive! 🔥"

// Get random mood emoji
console.log(getRandomMoodEmoji()); // "😊"

// Get time-based greeting
console.log(getTimeBasedGreeting()); // "🌅 Good morning, lovebirds!"
```

---

## 🔄 Real-Time Listeners

### Listen to User Profile Changes

```typescript
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const unsubscribe = onSnapshot(
  doc(db, "users", userId),
  (snapshot) => {
    const userData = snapshot.data();
    console.log("User profile updated:", userData);
  }
);

// Stop listening
unsubscribe();
```

---

## ❌ Error Handling

All functions throw errors that should be caught:

```typescript
try {
  await sendMessage(coupleId, userId, "Hello");
} catch (error) {
  console.error("Failed to send message:", error.message);
  // Show user-friendly error message
}
```

**Common Errors:**
- `permission-denied` — User doesn't have access
- `not-found` — Document doesn't exist
- `invalid-argument` — Wrong parameter type
- `unauthenticated` — User not logged in
- `network-request-failed` — No internet connection

---

**Version:** 1.0
**Last Updated:** May 19, 2026
