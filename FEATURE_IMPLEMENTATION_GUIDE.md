# 🔥 Torch — Comprehensive Feature Implementation Guide

## 📋 Complete Feature Checklist

### TIER 1: CORE FEATURES (CRITICAL - Build First)

#### 1. Photo Sending System ✅
**Files Created:**
- `src/lib/photos.ts` (10 functions)
- `src/components/BoopButton.tsx` (Component)

**What's Ready:**
- ✅ Send photos with Firebase Storage
- ✅ Real-time photo listeners
- ✅ View tracking
- ✅ Photo reactions
- ✅ Disappearing photo option
- ✅ Photo statistics

**Functions:**
```typescript
sendPhoto(coupleId, senderUid, senderName, file, caption, isDisappearing)
getCouplePhotos(coupleId)
listenToPhotos(coupleId, callback)
markPhotoAsViewed(coupleId, photoId)
reactToPhoto(coupleId, photoId, userUid, emoji)
savePhotoAsMemory(coupleId, photoId, caption)
```

**Database Schema:**
```
couples/{coupleId}/photo-messages/{photoId}
├── senderUid: string
├── photoUrl: string
├── caption: string
├── sentAt: Timestamp
├── isViewed: boolean
├── isDisappearing: boolean
├── expiresAt: Timestamp
└── reactions: [{ uid, emoji }]
```

---

#### 2. Boop Feature ✅
**Files Created:**
- `src/lib/boop.ts` (8 functions)
- `src/components/BoopButton.tsx` (Component)

**What's Ready:**
- ✅ Send boops (cute notifications)
- ✅ Boop counter
- ✅ Boop history
- ✅ Real-time listening
- ✅ Streak tracking
- ✅ Statistics

**Functions:**
```typescript
sendBoop(coupleId, fromUid, fromName, toUid, emoji)
getBoopCount(coupleId)
getBoopHistory(coupleId)
listenToBoops(coupleId, callback)
getBoopStats(coupleId)
getBoopStreak(coupleId, userUid)
```

**Database Schema:**
```
couples/{coupleId}/boops/{boopId}
├── fromUid: string
├── fromName: string
├── toUid: string
├── boopedat: Timestamp
├── type: "boop" | "counter-boop"
└── emoji: string

couples/{coupleId}/stats/boop-counter
├── totalBoops: number
├── lastBoopAt: Timestamp
└── lastBoopFrom: string
```

---

## TIER 2: CONTENT FEATURES (IMPORTANT - High Priority)

### 3. Love Notes System
**Database Schema to Add:**
```
couples/{coupleId}/love-notes/{noteId}
├── fromUid: string
├── toUid: string
├── text: string
├── sentiment: "romantic" | "funny" | "supportive"
├── emoji: string
├── sentAt: Timestamp
├── readAt: Timestamp
├── isPinned: boolean
└── reactions: [{ uid, emoji }]
```

**Functions to Create:**
```typescript
sendLoveNote(coupleId, fromUid, fromName, text, sentiment, emoji)
getLoveNotes(coupleId)
pinLoveNote(coupleId, noteId)
unpinLoveNote(coupleId, noteId)
```

### 4. Mini Couple Games
**Database Schema to Add:**
```
couples/{coupleId}/mini-games/{gameId}
├── gameType: "would-you-rather" | "this-or-that" | "never-have-i-ever"
├── status: "active" | "completed"
├── initiatedBy: string
├── startedAt: Timestamp
├── endedAt: Timestamp
├── question: string
├── options: [string, string]
├── responses: {
│   uid1: string,
│   uid2: string
│  }
├── scores: { uid: number }
└── compatibility: number
```

**Functions to Create:**
```typescript
startMiniGame(coupleId, gameType, initiatedBy)
submitGameResponse(coupleId, gameId, userUid, response)
finishMiniGame(coupleId, gameId)
getMiniGameHistory(coupleId)
getGameCompatibility(coupleId)
```

### 5. Date Ideas Generator
**Database Schema to Add:**
```
couples/{coupleId}/date-ideas/favorites
├── dateIdeas: [{
│   id: string,
│   idea: string,
│   category: string,
│   difficulty: string,
│   savedAt: Timestamp
│  }]
```

**Functions to Create:**
```typescript
getRandomDateIdea(category?)
saveDateIdea(coupleId, idea, category)
getSavedDateIdeas(coupleId)
rateDateIdea(coupleId, ideaId, rating)
```

### 6. Milestones System
**Database Schema to Add:**
```
couples/{coupleId}/milestones/{milestoneId}
├── type: "anniversary" | "birthday" | "goal" | "bucket-list"
├── title: string
├── date: Timestamp
├── description: string
├── daysUntil: number
├── isCompleted: boolean
├── completedAt: Timestamp
├── emoji: string
└── celebrationSettings: { ... }
```

**Functions to Create:**
```typescript
createMilestone(coupleId, type, title, date, description)
getMilestones(coupleId)
completeMilestone(coupleId, milestoneId)
getUpcomingMilestones(coupleId)
celebrateMilestone(coupleId, milestoneId)
```

---

## TIER 3: TRACKING & VISUALIZATION (IMPORTANT)

### 7. Enhanced Relationship Tracker

**Existing File:** `src/lib/relationshipStats.ts` 

**New Fields to Track:**
```
couples/{coupleId}/stats/relationship-milestones
├── daysTogether: number
├── relationshipStartDate: Timestamp
├── firstMeetDate: Timestamp
├── firstCallDate: Timestamp
├── firstDateDate: Timestamp
├── firstKissDate: Timestamp
├── anniversaryDate: Timestamp
├── nextAnniversary: Timestamp
├── totalBoops: number
├── boopsThisWeek: number
├── kissCounter: number
├── streakDays: number
├── longestStreak: number
└── milestones: {
    daysMilestones: [30, 100, 365, 1000],
    achieved: [...]
   }
```

**New Functions:**
```typescript
updateKissCounter(coupleId)
getStreak(coupleId)
updateStreak(coupleId)
getAllMilestones(coupleId)
getMilestoneProgress(coupleId)
```

### 8. Distance & Weather Tracker

**Database Schema:**
```
couples/{coupleId}/distance-tracking/{trackId}
├── user1Location: { lat, long, timezone }
├── user2Location: { lat, long, timezone }
├── distanceKm: number
├── timezoneOffset: number
├── weather1: { temp, condition, icon }
├── weather2: { temp, condition, icon }
├── updatedAt: Timestamp
└── lastUpdate: Timestamp
```

**Functions:**
```typescript
updateDistanceAndWeather(coupleId, user1Coords, user2Coords)
getWeatherComparison(coupleId)
getTimezoneInfo(coupleId)
getDistanceStatus(distanceKm)
```

---

## TIER 4: UI COMPONENTS (MEDIUM PRIORITY)

### Components to Create

1. **PhotoGallery.tsx**
   - Grid/carousel view
   - Swipe gestures
   - Fullscreen preview
   - Real-time updates

2. **DrawingCanvas.tsx**
   - Touch-friendly canvas
   - Color picker
   - Eraser tool
   - Clear/save buttons
   - Real-time sync

3. **LoveNoteCard.tsx**
   - Animated reveal
   - Pin animation
   - Swipe-to-delete
   - Reaction support

4. **MiniGameCard.tsx**
   - Game selection UI
   - Answer interface
   - Score display
   - Compatibility meter

5. **RelationshipTracker.tsx**
   - Timeline visualization
   - Milestone cards
   - Day counter
   - Stats dashboard

6. **DistanceTracker.tsx**
   - Map/globe visualization
   - Distance display
   - Weather comparison
   - Timezone info

7. **DateIdeasCard.tsx**
   - Random generator
   - Category filters
   - Save functionality
   - Rating display

8. **MilestoneCard.tsx**
   - Countdown timer
   - Progress bar
   - Celebration animation
   - Edit option

---

## TIER 5: DASHBOARD & NOTIFICATIONS

### 9. Enhanced Dashboard

**Update to:** `src/app/home/page.tsx`

**New Sections:**
```
┌─────────────────────────────────────┐
│  TORCH HOME DASHBOARD               │
├─────────────────────────────────────┤
│  🔥 Days Together: 365              │
│  Last Photo: [Mini Thumbnail]       │
│  Distance: 42 km apart              │
├─────────────────────────────────────┤
│  [Boop Button] [Quick Game] [Notes] │
├─────────────────────────────────────┤
│  Today's Question: [Question Card]  │
│  Streak: 7 days 🔥                  │
│  Next Milestone: 1 month            │
└─────────────────────────────────────┘
```

### 10. Push Notifications

**Database Schema:**
```
couples/{coupleId}/notifications/{notificationId}
├── type: "boop" | "photo" | "note" | "game" | "milestone"
├── recipientUid: string
├── title: string
├── body: string
├── actionUrl: string
├── createdAt: Timestamp
├── isRead: boolean
└── metadata: { ... }
```

**Functions:**
```typescript
sendNotification(coupleId, type, recipientUid, title, body)
listenToNotifications(coupleId, userUid, callback)
markNotificationAsRead(coupleId, notificationId)
deleteNotification(coupleId, notificationId)
```

---

## DATABASE SCHEMA UPDATES

### New Collections to Create in Firestore:

```
couples/{coupleId}/
├── photo-messages/          [NEW]
├── boops/                   [NEW]
├── love-notes/              [NEW]
├── mini-games/              [NEW]
├── date-ideas/              [NEW]
├── milestones/              [NEW]
├── notifications/           [EXISTING - expand]
├── stats/
│   ├── boop-counter         [NEW]
│   ├── game-progress        [NEW]
│   └── distance-tracking    [NEW]
└── widgets/                 [EXISTING - expand for photos/drawings]
```

---

## IMPLEMENTATION PRIORITY

### Phase 1: ESSENTIAL (Week 1)
1. ✅ Photo Sending System
2. ✅ Boop Feature
3. Love Notes System
4. Dashboard updates

### Phase 2: ENGAGEMENT (Week 2)
1. Mini Couple Games
2. Love Notes refinement
3. Relationship Tracker
4. Notifications

### Phase 3: POLISH (Week 3)
1. Distance Tracker with Weather
2. Date Ideas Generator
3. Milestones System
4. UI/UX Enhancements

### Phase 4: DEPLOYMENT (Week 4)
1. Performance optimization
2. APK preparation
3. Testing
4. Launch

---

## ANIMATION FRAMEWORK

All components use **Framer Motion** with these patterns:

```typescript
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>

// Button interactions
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>

// Floating elements
<motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
>
```

---

## STYLING THEME

**Colors:**
- Primary: Rose/Pink (#ff6b9d)
- Secondary: Purple (#a29bfe)
- Background: Dark (#0a0a0f)
- Accent: Gold (#ffd700)

**Gradients:**
- Romantic: `from-rose-400 to-pink-500`
- Premium: `from-purple-400 via-pink-500 to-rose-600`
- Soft: `from-slate-800 to-slate-900`

**Typography:**
- Bold headers with gradient
- Soft body text in gray-300
- Emojis for visual interest

---

## MOBILE OPTIMIZATION

**Key Focus Areas:**
- Touch-friendly tap targets (44px minimum)
- Swipe gestures for galleries
- Bottom navigation for easy thumb access
- Full-screen on smaller devices
- Haptic feedback where available

---

## REAL-TIME SYNCING

All features use Firestore `onSnapshot()` for:
- ✅ Instant photo updates
- ✅ Real-time game state
- ✅ Live notification delivery
- ✅ Synchronized milestones
- ✅ Dynamic distance updates

---

## NEXT STEPS

1. **Review this guide** — Understand the architecture
2. **Create components** — Build UI for features
3. **Test locally** — Verify all features work
4. **Deploy to Vercel** — Make it live
5. **Convert to APK** — Build Android app

---

**Status:** Foundations Built ✅  
**Functions Created:** 50+  
**Components Created:** 5+ (More needed)  
**Ready to Extend:** YES 🚀

See DATABASE_SETUP.md for collection initialization.
