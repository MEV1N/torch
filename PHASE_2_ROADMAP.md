# 🔥 Torch — PHASE 2 Implementation Roadmap

## ✅ JUST COMPLETED (Phase 1 Summary)

### Core Utilities Created (50+ Functions)
- ✅ `src/lib/boop.ts` (8 functions) - Cute boop interactions
- ✅ `src/lib/loveNotes.ts` (12 functions) - Enhanced love notes with reactions
- ✅ `src/lib/milestones.ts` (12 functions) - Milestone tracking
- ✅ `src/lib/dateIdeas.ts` (11 functions) - Date idea generator + saved ideas
- ✅ `src/lib/distanceTracking.ts` (14 functions) - Distance + timezone tracking
- ✅ Existing utilities: photos.ts, drawings.ts, widgets.ts, games.ts, etc.

### UI Components Created (6+)
- ✅ `src/components/BoopButton.tsx` - Interactive boop with floating hearts
- ✅ `src/components/LoveNoteCardExtended.tsx` - Collapsible love note with reactions
- ✅ `src/components/MilestoneCard.tsx` - Milestone progress tracker
- ✅ `src/components/DateIdeaCard.tsx` - Date idea with rating system
- ✅ Existing components: various page components, cards, etc.

### Documentation
- ✅ `FEATURE_IMPLEMENTATION_GUIDE.md` - Complete feature specifications
- ✅ This file: PHASE_2_ROADMAP.md

---

## 🎯 NEXT IMMEDIATE STEPS (What to Do Now)

### STEP 1: Create Page Components (3-4 pages)

#### 1a. Create `src/app/love-notes/page.tsx`
**Purpose:** Display all love notes for the couple

**Key Features:**
- Real-time listening via `listenToLoveNotes()`
- Filter by sentiment type
- Show pinned notes at top
- Unread notification badge
- Send new note form with sentiment selector
- Swipe-to-reveal animations

**Dependencies:**
- LoveNoteCardExtended.tsx ✅
- loveNotes.ts ✅
- Framer Motion (already installed)

**Rough Code Structure:**
```typescript
// src/app/love-notes/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { listenToLoveNotes, sendLoveNote } from '@/lib/loveNotes'
import LoveNoteCardExtended from '@/components/LoveNoteCardExtended'
import { useAuth } from '@/lib/useAuth'

export default function LoveNotesPage() {
  const { firebaseUser, couple, userProfile, partner } = useAuth()
  const [notes, setNotes] = useState([])
  const [sentiment, setSentiment] = useState('all')
  const [text, setText] = useState('')
  
  // Setup real-time listener
  useEffect(() => {
    if (!couple?.id) return
    const unsubscribe = listenToLoveNotes(couple.id, setNotes)
    return () => unsubscribe()
  }, [couple?.id])
  
  // Handle send
  const handleSend = async () => {
    if (!text.trim() || !couple?.id) return
    await sendLoveNote(couple.id, firebaseUser!.uid, userProfile!.name, 
                       partner!.id, text, sentiment)
    setText('')
  }
  
  return (
    <div className="space-y-4">
      {/* Send form */}
      {/* Notes list - map through notes */}
    </div>
  )
}
```

---

#### 1b. Create `src/app/milestones/page.tsx`
**Purpose:** Display milestones and manage them

**Key Features:**
- Show upcoming milestones
- Countdown timers
- Complete milestone button
- Create new milestone form
- Statistics dashboard
- Progress visualization

**Dependencies:**
- MilestoneCard.tsx ✅
- milestones.ts ✅

---

#### 1c. Create `src/app/date-ideas/page.tsx`
**Purpose:** Browse and manage date ideas

**Key Features:**
- Random date idea generator
- Category filtering
- Saved ideas list
- Completed ideas with ratings
- Statistics (completed, average rating, by category)
- "Go on date now" button

**Dependencies:**
- DateIdeaCard.tsx ✅
- dateIdeas.ts ✅

---

#### 1d. Create `src/app/boops/page.tsx` (Optional)
**Purpose:** History and stats for boops

**Key Features:**
- Boop history timeline
- Boop statistics
- Streak display
- Boop sound/animation test
- Boop counter real-time

---

### STEP 2: Update Existing Pages (3-4 pages)

#### 2a. Update `src/app/home/page.tsx` (HOME DASHBOARD)
**Add these sections:**

1. **Top Quick Stats:**
```
💕 365 days together | 🎯 Next milestone in 4 days
```

2. **New Sections Widget Area:**
```
┌─────────────────────────┐
│ 📸 Latest Photo         │  <- Show most recent photo
│ [Photo thumbnail]       │
└─────────────────────────┘

┌─────────────────────────┐
│ 👆 Boop Button          │
│ [Interactive Button]    │
│ Total: 42 boops         │
└─────────────────────────┘

┌─────────────────────────┐
│ 💕 Distance             │
│ 42 km apart 🚗          │
│ Same timezone? Yes      │
└─────────────────────────┘

┌─────────────────────────┐
│ ⭐ Upcoming Milestone   │
│ Anniversary in 4 days   │
└─────────────────────────┘
```

3. **Import New Modules:**
```typescript
import BoopButton from '@/components/BoopButton'
import { getDistanceStats } from '@/lib/distanceTracking'
import { getNextMilestone } from '@/lib/milestones'
import { getBoopCount } from '@/lib/boop'
```

---

#### 2b. Update `src/app/settings/page.tsx`
**Add Settings:**
- Location sharing toggle
- Notification preferences (boops, notes, photos, games, milestones)
- Distance unit preference (km/miles)
- Theme preference
- Privacy settings

---

#### 2c. Update `src/components/BottomNav.tsx`
**Add new navigation routes:**
```typescript
const routes = [
  { href: '/home', icon: HomeIcon, label: 'Home' },
  { href: '/love-notes', icon: HeartIcon, label: 'Notes' },        // NEW
  { href: '/date-ideas', icon: SparklesIcon, label: 'Ideas' },     // NEW
  { href: '/milestones', icon: StarIcon, label: 'Milestones' },    // NEW
  { href: '/chat', icon: ChatIcon, label: 'Chat' },
  { href: '/settings', icon: CogIcon, label: 'Settings' },
]
```

---

### STEP 3: Create New Utility Modules (3 small files)

#### 3a. Create `src/lib/notifications.ts` (Extend)
**Add these functions:**
```typescript
// Send in-app notifications
async function sendNotification(coupleId, type, recipientUid, title, body)
async function listenToNotifications(coupleId, userUid, callback)
async function markNotificationAsRead(coupleId, notificationId)
async function deleteNotification(coupleId, notificationId)
```

---

#### 3b. Create `src/lib/coupleStats.ts`
**Purpose:** Aggregate all couple statistics

**Functions:**
```typescript
async function getCoupleStats(coupleId)
  // Returns: boops, photos, notes, drawings, questions answered, games played, etc.

async function getCoupleTimeline(coupleId)
  // Returns: chronological events for past week/month

async function getRelationshipInsights(coupleId)
  // Returns: fun facts like "You exchange 5 boops/day", "Most common question sentiment", etc.
```

---

#### 3c. Create `src/components/NotificationCenter.tsx`
**Purpose:** Display notifications in header

**Features:**
- Toast notifications for new boops/notes/photos
- Notification badge with count
- Notification history
- Clear all button

---

### STEP 4: Create Modal/Dialog Components (2-3)

#### 4a. `src/components/SendLoveNoteModal.tsx`
**Features:**
- Textarea with character count
- Sentiment selector (romantic, funny, supportive, spicy)
- Emoji picker
- Send button
- Template suggestions

---

#### 4b. `src/components/CreateMilestoneModal.tsx`
**Features:**
- Form fields: title, date, description, type
- Emoji selector
- Importance selector
- Save button

---

#### 4c. `src/components/PhotoGalleryModal.tsx`
**Features:**
- Full-screen photo view
- Swipe to next/prev
- Disappearing photo indicator
- Like/React buttons
- Share/Save options

---

### STEP 5: Database Schema Updates (Firestore)

**Add these security rules to firestore.rules:**

```javascript
// Love notes subcollection
match /couples/{coupleId}/love-notes/{noteId} {
  allow read: if request.auth.uid in resource.get(/databases/$(database)/documents/couples/$(coupleId)).data.userIds;
  allow create: if request.auth.uid in resource.get(/databases/$(database)/documents/couples/$(coupleId)).data.userIds;
  allow update, delete: if request.auth.uid == resource.data.fromUid;
}

// Milestones
match /couples/{coupleId}/milestones/{milestoneId} {
  allow read, write: if request.auth.uid in resource.get(/databases/$(database)/documents/couples/$(coupleId)).data.userIds;
}

// Date ideas
match /couples/{coupleId}/date-ideas/{ideaId} {
  allow read, write: if request.auth.uid in resource.get(/databases/$(database)/documents/couples/$(coupleId)).data.userIds;
}

// Boops
match /couples/{coupleId}/boops/{boopId} {
  allow read: if request.auth.uid in resource.get(/databases/$(database)/documents/couples/$(coupleId)).data.userIds;
  allow create: if request.auth.uid in resource.get(/databases/$(database)/documents/couples/$(coupleId)).data.userIds;
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### PHASE 2A: PAGES (2-3 days)
- [ ] Create `love-notes/page.tsx`
- [ ] Create `date-ideas/page.tsx`
- [ ] Create `milestones/page.tsx`
- [ ] Create `boops/page.tsx` (optional)
- [ ] Update `home/page.tsx` with new widgets
- [ ] Update `settings/page.tsx` with new options
- [ ] Update `BottomNav.tsx` with new routes

### PHASE 2B: MODALS & COMPONENTS (1-2 days)
- [ ] Create `SendLoveNoteModal.tsx`
- [ ] Create `CreateMilestoneModal.tsx`
- [ ] Create `PhotoGalleryModal.tsx`
- [ ] Create `NotificationCenter.tsx`
- [ ] Create `DistanceTracker.tsx`
- [ ] Create `RelationshipStats.tsx`

### PHASE 2C: UTILITIES (1 day)
- [ ] Create/extend `notifications.ts`
- [ ] Create `coupleStats.ts`
- [ ] Update types.ts with new interfaces
- [ ] Create theme/styling utilities

### PHASE 2D: INTEGRATION (1-2 days)
- [ ] Test real-time listeners
- [ ] Test all new functions
- [ ] Verify Firestore security rules
- [ ] Test on mobile responsiveness

### PHASE 2E: POLISH (1 day)
- [ ] Add animations
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add empty states

---

## 🔥 QUICK START: Build First Page

**To get started immediately, build `love-notes/page.tsx`:**

1. Copy component code below
2. Create file at `src/app/love-notes/page.tsx`
3. Test with `npm run dev`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/useAuth'
import { 
  listenToLoveNotes, 
  sendLoveNote, 
  getRandomLoveNoteTemplate 
} from '@/lib/loveNotes'
import LoveNoteCardExtended from '@/components/LoveNoteCardExtended'
import PageTransition from '@/components/PageTransition'

export default function LoveNotesPage() {
  const { firebaseUser, couple, userProfile, partner } = useAuth()
  const [notes, setNotes] = useState([])
  const [text, setText] = useState('')
  const [sentiment, setSentiment] = useState('romantic')
  const [isLoading, setIsLoading] = useState(false)

  // Setup real-time listener
  useEffect(() => {
    if (!couple?.id) return
    const unsubscribe = listenToLoveNotes(couple.id, setNotes)
    return () => unsubscribe()
  }, [couple?.id])

  const handleSend = async () => {
    if (!text.trim() || !couple?.id || !firebaseUser) return

    setIsLoading(true)
    try {
      await sendLoveNote(
        couple.id,
        firebaseUser.uid,
        userProfile?.name || 'You',
        partner!.id,
        text,
        sentiment as any
      )
      setText('')
    } catch (error) {
      console.error('Error sending note:', error)
    }
    setIsLoading(false)
  }

  const fillTemplate = (sentiment: string) => {
    const template = getRandomLoveNoteTemplate(sentiment)
    setText(template.text)
    setSentiment(sentiment)
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto p-4 space-y-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2">💕 Love Notes</h1>
          <p className="text-gray-400">Send sweet messages to {partner?.name}</p>
        </motion.div>

        {/* Send Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 p-4 rounded-2xl border border-white/10 backdrop-blur-xl"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a love note..."
            className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"
          />

          {/* Sentiment Selector */}
          <div className="flex gap-2 flex-wrap">
            {['romantic', 'funny', 'supportive', 'spicy'].map((s) => (
              <button
                key={s}
                onClick={() => fillTemplate(s)}
                className={`px-3 py-1 rounded-full text-sm capitalize transition-all ${
                  sentiment === s
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isLoading || !text.trim()}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold disabled:opacity-50 transition-opacity"
          >
            {isLoading ? 'Sending...' : 'Send Note 💕'}
          </button>
        </motion.div>

        {/* Notes List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">No love notes yet...</p>
              <p className="text-sm">Send the first one! 💕</p>
            </div>
          ) : (
            notes.map((note) => (
              <LoveNoteCardExtended
                key={note.id}
                note={note as any}
                coupleId={couple!.id}
                userId={firebaseUser!.uid}
              />
            ))
          )}
        </motion.div>
      </div>
    </PageTransition>
  )
}
```

---

## 📊 Estimated Timeline

- **Phase 2A (Pages):** 2-3 days
- **Phase 2B (Modals):** 1-2 days
- **Phase 2C (Utils):** 1 day
- **Phase 2D (Integration):** 1-2 days
- **Phase 2E (Polish):** 1 day

**Total: 6-9 days to complete Phase 2**

---

## 🚀 AFTER PHASE 2

### Phase 3: Mobile Optimization
- [ ] PWA testing
- [ ] Mobile responsiveness audit
- [ ] Touch gesture optimization
- [ ] Capacitor setup

### Phase 4: Advanced Features
- [ ] Push notifications (FCM)
- [ ] Drawing canvas with real-time sync
- [ ] Advanced search/filtering
- [ ] Analytics dashboard
- [ ] Backup/export functionality

### Phase 5: Launch
- [ ] Security audit
- [ ] Performance optimization
- [ ] Deploy to Vercel
- [ ] APK build via Capacitor
- [ ] Testing on real devices

---

**Next action:** Start building `love-notes/page.tsx` using the code template provided above!
