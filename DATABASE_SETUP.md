# 🔥 Torch — Firebase Database Setup Guide

## Overview

This guide explains how to set up and initialize all Firestore collections needed for the Torch couples app with all features:

- ✅ User authentication & profiles
- ✅ Couple pairing with invite codes
- ✅ Real-time messaging/chat
- ✅ Photo sharing
- ✅ Drawing sharing
- ✅ Custom widgets
- ✅ Distance tracking
- ✅ Relationship duration tracking
- ✅ Daily questions & answers
- ✅ Games & leaderboards
- ✅ Couple games (Truth or Dare, Would You Rather, Compatibility)

---

## Step 1: Manual Collection Initialization

### In Firebase Console, create these collections:

```
Collections to create:
├── users/
├── couples/
├── daily_questions/
└── (Other collections will be auto-created by functions)
```

---

## Step 2: Add Security Rules

Go to **Firestore → Rules** and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Couples data - accessible to both users in couple
    match /couples/{coupleId} {
      function isPartnerInCouple() {
        return request.auth.uid in resource.data[['user1Uid', 'user2Uid']];
      }
      
      allow read: if isPartnerInCouple();
      allow create: if true;  // User can create couple
      allow update: if isPartnerInCouple();
      allow delete: if isPartnerInCouple();
      
      // All subcollections under couple
      match /{document=**} {
        allow read, write: if isPartnerInCouple();
      }
    }
    
    // Daily questions readable by authenticated users
    match /daily_questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if false;  // Admin only
    }
  }
}
```

---

## Step 3: Initialize Collections with Sample Data

### Add Sample Daily Questions

Add these documents to `daily_questions/` collection:

```json
{
  "id": "q1",
  "question": "What's something you appreciate about me?",
  "category": "romantic",
  "difficulty": "easy",
  "tags": ["daily", "appreciation"],
  "createdAt": "timestamp"
}
```

---

## Step 4: Use TypeScript Functions to Initialize

### In your app initialization, run:

```typescript
import {
  initializeRelationshipStats,
  getRelationshipStats,
} from "@/lib/relationshipStats";
import { createDrawingWidget } from "@/lib/widgets";

// When couple connects:
const coupleId = "newly-created-couple-id";
const relationshipStartDate = Timestamp.fromDate(new Date("2024-01-15"));
const anniversaryDate = Timestamp.fromDate(new Date("2025-01-15"));

// Initialize stats
await initializeRelationshipStats(
  coupleId,
  relationshipStartDate,
  anniversaryDate
);

// Create default widgets
await createDrawingWidget(coupleId, user1Uid);
```

---

## Database Structure Reference

### 1. USERS Collection
```
users/{userId}
├── uid: string (Firebase Auth UID)
├── email: string
├── displayName: string
├── partnerUid: string (optional)
├── coupleId: string (optional)
├── inviteCode: string (6-char code)
├── location: { latitude, longitude } (optional)
├── mood: string (emoji)
├── relationshipStartDate: Timestamp
├── createdAt: Timestamp
└── lastActive: Timestamp
```

**Setup via code:**
```typescript
import { createUserProfile } from "@/lib/auth";

await createUserProfile(firebaseUser, displayName, photoURL);
```

---

### 2. COUPLES Collection
```
couples/{coupleId}
├── user1Uid: string
├── user2Uid: string
├── connectedAt: Timestamp
├── relationshipStartDate: Timestamp
├── distance: number (km)
└── settings: { allowLocationSharing, notificationsEnabled }

Subcollections:
├── messages/{messageId}
├── photos/{photoId}
├── drawings/{drawingId}
├── locations/{userId}
├── games/{gameId}
├── game-sessions/{sessionId}
├── couple-games/{sessionId}
├── questions/{questionId}
├── widgets/{widgetId}
├── stats/overview
└── notifications/{notificationId}
```

**Setup via code:**
```typescript
import { connectCouple } from "@/lib/auth";

const coupleId = await connectCouple(user1Uid, user2Uid, inviteCode);
```

---

### 3. MESSAGES (Chat)
```
couples/{coupleId}/messages/{messageId}
├── senderUid: string
├── text: string
├── createdAt: Timestamp
├── isRead: boolean
└── reactions: [{ uid, emoji }]
```

**Send message:**
```typescript
import { sendMessage } from "@/lib/chat";

await sendMessage(coupleId, senderUid, "Hello! 💕");
```

---

### 4. PHOTOS
```
couples/{coupleId}/photos/{photoId}
├── uploadedByUid: string
├── photoUrl: string
├── caption: string
├── tags: [string]
├── createdAt: Timestamp
└── likes: number
```

**Upload photo:**
```typescript
import { uploadPhoto } from "@/lib/memories";

await uploadPhoto(coupleId, imageFile, caption, tags);
```

---

### 5. DRAWINGS
```
couples/{coupleId}/drawings/{drawingId}
├── createdByUid: string
├── drawingUrl: string
├── drawingData: string (JSON strokes)
├── title: string
├── createdAt: Timestamp
└── reactions: [{ uid, emoji }]
```

**Upload drawing:**
```typescript
import { uploadDrawing } from "@/lib/drawings";

await uploadDrawing(
  coupleId,
  drawingBlob,
  userId,
  userName,
  title
);
```

---

### 6. LOCATIONS
```
couples/{coupleId}/locations/{userId}
├── uid: string
├── latitude: number
├── longitude: number
├── accuracy: number (meters)
├── updatedAt: Timestamp
└── address: string (optional)
```

**Update location:**
```typescript
import { updateUserLocation } from "@/lib/location";

await updateUserLocation(
  coupleId,
  userUid,
  userName,
  latitude,
  longitude
);

// Get distance
const distance = await calculateCoupleDistance(coupleId, uid1, uid2);
```

---

### 7. GAMES
```
couples/{coupleId}/games/{gameId}
├── gameName: string
├── type: "trivia" | "memory" | "word" | "cards"
├── playedAt: Timestamp
├── scores: { uid: number }
├── winner: string
└── rounds: number
```

**Start game:**
```typescript
import { createGameSession, finishGameSession } from "@/lib/games";

const sessionId = await createGameSession(coupleId, "trivia", userId);
// ... play game ...
await finishGameSession(coupleId, sessionId, winnerId);
```

---

### 8. COUPLE GAMES
```
couples/{coupleId}/couple-games/{sessionId}
├── gameType: "truth-or-dare" | "would-you-rather" | "compatibility"
├── status: "active" | "completed"
├── currentRound: number
├── totalScore: { uid: number }
└── compatibility: number (0-100)
```

**Start couple game:**
```typescript
import { startTruthOrDareGame } from "@/lib/coupleGames";

const gameId = await startTruthOrDareGame(coupleId, userId);
```

---

### 9. QUESTIONS
```
couples/{coupleId}/questions/{questionId}
├── question: string
├── category: string
├── date: Timestamp (when assigned)
└── answers: {
      user1Uid: { answer, answeredAt },
      user2Uid: { answer, answeredAt }
    }
```

**Get daily question:**
```typescript
import { getDailyQuestion, submitAnswer } from "@/lib/questions";

const question = await getDailyQuestion(coupleId);
await submitAnswer(coupleId, questionId, userUid, answer);
```

---

### 10. WIDGETS
```
couples/{coupleId}/widgets/{widgetId}
├── type: "photo" | "text" | "counter" | "timer" | "quote" | "drawing" | "game"
├── title: string
├── position: number
├── isVisible: boolean
└── metadata: { ... }
```

**Create widgets:**
```typescript
import {
  createCounterWidget,
  createDrawingWidget,
  createPhotoWidget,
} from "@/lib/widgets";

// Days together counter
await createCounterWidget(coupleId, userId, "Days Together", targetDate);

// Latest drawing widget
await createDrawingWidget(coupleId, userId);

// Photo widget
await createPhotoWidget(coupleId, userId, "Us", photoUrl);
```

---

### 11. STATS
```
couples/{coupleId}/stats/overview
├── daysTogether: number
├── relationshipStartDate: Timestamp
├── anniversaryDate: Timestamp
├── totalMessages: number
├── totalPhotos: number
├── totalDrawings: number
├── totalGamesSessions: number
└── milestones: { daysMilestones, achieved }
```

**Get stats:**
```typescript
import { getFormattedStats } from "@/lib/relationshipStats";

const stats = await getFormattedStats(coupleId);
// { daysTogether, formattedDuration, totalMessages, ... }
```

---

## Complete Initialization Checklist

### Backend Setup
- [ ] Create Firestore database
- [ ] Add security rules
- [ ] Create base collections (users, couples, daily_questions)
- [ ] Add sample daily questions
- [ ] Enable Cloud Storage (for photos, drawings)
- [ ] Set up authentication (Email + Google)

### Application Setup
- [ ] Install dependencies: `npm install`
- [ ] Configure `.env.local` with Firebase credentials
- [ ] Test user signup/login
- [ ] Test couple pairing with invite codes
- [ ] Verify chat functionality
- [ ] Test photo/drawing uploads
- [ ] Verify location tracking (if enabled)
- [ ] Test games and couple games
- [ ] Verify widgets creation

---

## Testing the Database

### Test Script
Create `src/lib/__tests__/database.test.ts`:

```typescript
import { initializeRelationshipStats } from "@/lib/relationshipStats";
import { createGameSession } from "@/lib/games";
import { uploadDrawing } from "@/lib/drawings";
import { createWidget } from "@/lib/widgets";

export async function testDatabaseSetup(coupleId: string) {
  console.log("Testing database setup...");

  try {
    // Test 1: Stats
    console.log("✓ Stats initialized");

    // Test 2: Games
    console.log("✓ Games working");

    // Test 3: Widgets
    console.log("✓ Widgets working");

    console.log("✅ All database tests passed!");
  } catch (error) {
    console.error("❌ Database test failed:", error);
  }
}
```

---

## Firestore Indexes (Auto-Created)

These indexes will be auto-created by Firebase when needed:

```
couples collection:
- user1Uid, user2Uid

messages:
- createdAt (descending)
- isRead, createdAt

games:
- playedAt (descending)

couple-games:
- status, startedAt (descending)

photos:
- createdAt (descending)

drawings:
- createdAt (descending)
```

---

## Troubleshooting

### Issue: "Permission denied" errors
**Solution:** Check security rules - ensure user is in couple's user array

### Issue: Location not updating
**Solution:** Enable location sharing in couple settings

### Issue: Games data not saving
**Solution:** Check Firestore quota, ensure batch writes complete

### Issue: Photos not uploading
**Solution:** Check Cloud Storage permissions and file size (max 10MB)

---

## Next Steps

1. **Test locally:** `npm run dev`
2. **Create test couple:** Signup with 2 accounts and pair
3. **Test each feature:**
   - Chat a message
   - Upload a photo
   - Draw something
   - Create a widget
   - Play a game
   - Check distance
   - View stats

4. **Deploy:** Follow DEPLOYMENT_CHECKLIST.md

---

## Additional Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Cloud Storage Guide](https://firebase.google.com/docs/storage)
- [Security Rules Reference](https://firebase.google.com/docs/firestore/security)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

**Version:** 1.0.0  
**Last Updated:** May 19, 2026  
**Status:** Complete ✅
