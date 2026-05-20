# � Torch — Complete Setup & Deployment Guide

> A premium couples relationship web app for keeping your love glowing ✨

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Firebase Setup](#firebase-setup)
6. [Environment Configuration](#environment-configuration)
7. [Running Locally](#running-locally)
8. [Deployment to Vercel](#deployment-to-vercel)
9. [Android APK Conversion with Capacitor](#android-apk-conversion-with-capacitor)
10. [Database Schema](#database-schema)
11. [Feature Documentation](#feature-documentation)
12. [API Reference](#api-reference)
13. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

Torch is a premium, emotionally-designed couples relationship app that helps partners stay connected through:

- **Daily Questions** — 120+ romantic questions with partner reveal
- **Streak System** — Daily engagement tracking with milestones
- **Shared Memories** — Photo timeline with Firebase Storage
- **Private Chat** — Real-time messaging with read receipts
- **Thumb Kiss** — Real-time touch interaction
- **Love Notes** — Romantic message delivery
- **Relationship Dashboard** — Days counter, mood tracking, analytics

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Authentication** | Firebase Auth |
| **Database** | Cloud Firestore |
| **Storage** | Firebase Storage |
| **Icons** | React Icons |
| **Dates** | date-fns |
| **Deployment** | Vercel |
| **APK** | Capacitor |

---

## 📦 Prerequisites

Before starting, ensure you have:

- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **Firebase Account** ([create here](https://firebase.google.com/))
- **Vercel Account** for deployment ([sign up](https://vercel.com/))
- **Android Studio** (for APK conversion only)

### Verify Installation

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
git --version
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/torch.git
cd torch
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js & React
- Firebase SDK
- Framer Motion
- Tailwind CSS
- Date-fns
- React Icons

### 3. Verify Installation

```bash
npm run dev
```

Should show:
```
▲ Next.js 16.x.x
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project**
3. Name it "Torch" (or your choice)
4. Accept terms and create

### Step 2: Enable Services

#### Authentication
1. Go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable Sign-in Methods:
   - Email/Password
   - Google
4. Copy `Web API Key` for environment variables

#### Firestore Database
1. Go to **Build** → **Firestore Database**
2. Click **Create Database**
3. Choose **Start in Production Mode**
4. Select region closest to you (or `us-central1`)
5. Click **Create**

#### Storage
1. Go to **Build** → **Storage**
2. Click **Get Started**
3. Start in Production Mode
4. Select same region as Firestore

### Step 3: Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web app** (or create if not exists)
4. Copy the config object:

```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

---

## ⚙️ Environment Configuration

### 1. Create `.env.local`

```bash
cp .env.local.example .env.local
```

### 2. Fill Environment Variables

Edit `.env.local` with your Firebase config:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_APP_NAME=Torch
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Important Notes

- `NEXT_PUBLIC_*` variables are exposed to browser (safe for Firebase config)
- Never commit `.env.local` to git
- `.env.local` is in `.gitignore` for safety

---

## 💻 Running Locally

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app auto-reloads on code changes.

### Build for Production

```bash
npm run build
```

This creates optimized production build in `.next/` folder.

### Start Production Server

```bash
npm start
```

---

## 🌐 Deployment to Vercel

### Option 1: Deploy via Git (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Click **New Project**
   - Import your GitHub repo
   - Click **Import**

3. **Configure Environment Variables**
   - In Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add all variables from `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY = ...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = ...
     (and all others)
     ```
   - Click **Deploy**

4. **Done!**
   - Your app is live at `https://your-project.vercel.app`

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables when prompted
```

### Custom Domain

1. In Vercel Settings, go to **Domains**
2. Add your domain (e.g., `torch.app`)
3. Follow DNS configuration steps
4. Usually takes 5-10 minutes to activate

---

## 🤖 Android APK Conversion with Capacitor

### Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
```

### Step 2: Initialize Capacitor

```bash
npx cap init

# When prompted:
# App name: Torch
# App ID: com.yourdomain.torch (or com.example.torch)
# Choose android and ios
```

### Step 3: Build Web Assets

```bash
npm run build
```

### Step 4: Add Android Platform

```bash
npx cap add android
```

### Step 5: Configure Android Studio

1. **Install Android Studio** from [developer.android.com](https://developer.android.com/studio)
2. **Open Android project**
   ```bash
   npx cap open android
   ```
   This launches Android Studio with your project

3. **Wait for Gradle sync** to complete

### Step 6: Build APK

In Android Studio:

1. **Menu** → **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete (2-5 minutes)
3. APK is at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 7: Release APK (Production)

1. **Create signing key**:
   ```bash
   keytool -genkey -v -keystore torch-key.keystore \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias torch
   ```

2. **Configure signing in Android Studio**:
   - Menu → Build → Generate Signed Bundle/APK
   - Select APK
   - Choose your keystore
   - Select Release build type
   - Click Generate

3. **Release APK** is at: `android/app/release/app-release.apk`

### Step 8: Install on Phone

```bash
# Debug APK (for testing)
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Release APK (for production)
adb install android/app/release/app-release.apk
```

### Step 9: Publish to Google Play Store

1. Create Google Play Developer account ($25 one-time fee)
2. Go to [Google Play Console](https://play.google.com/console/)
3. **Create new app** → Upload release APK
4. Fill in store listing, privacy policy, content ratings
5. Submit for review (usually 2-4 hours)

---

## 📊 Database Schema

### Firestore Collections

#### `users/{userId}`
```json
{
  "uid": "unique_user_id",
  "displayName": "User Name",
  "email": "user@email.com",
  "photoURL": "https://...",
  "coupleId": "couple_id or null",
  "inviteCode": "ABC123",
  "mood": "😊",
  "createdAt": Timestamp,
  "fcmToken": "push_notification_token",
  "relationshipStartDate": "2024-01-01"
}
```

#### `couples/{coupleId}`
```json
{
  "users": ["userId1", "userId2"],
  "relationshipStartDate": "2024-01-01",
  "anniversaryDate": "2024-01-15",
  "createdAt": Timestamp
}
```

#### `messages/{coupleId}/chat/{messageId}`
```json
{
  "senderId": "userId",
  "text": "Message content",
  "timestamp": Timestamp,
  "read": false,
  "edited": false
}
```

#### `daily_questions/{questionId}`
```json
{
  "question": "What's your favorite memory of us?",
  "category": "romantic|deep|fun|nostalgic|spicy|dream",
  "date": "2024-05-19"
}
```

#### `answers/{coupleId}/responses/{responseId}`
```json
{
  "userId": "userId",
  "questionId": "questionId",
  "answer": "My answer...",
  "date": "2024-05-19",
  "timestamp": Timestamp
}
```

#### `streaks/{coupleId}`
```json
{
  "count": 15,
  "longestStreak": 30,
  "lastUpdated": Timestamp,
  "questionsAnswered": 15,
  "chatsExchanged": 142,
  "memoriesShared": 8
}
```

#### `memories/{coupleId}/items/{memoryId}`
```json
{
  "imageUrl": "https://storage.googleapis.com/...",
  "caption": "Our beach trip!",
  "uploadedBy": "userId",
  "uploadedAt": Timestamp,
  "tags": ["beach", "vacation"]
}
```

#### `love_notes/{coupleId}/notes/{noteId}`
```json
{
  "from": "userId1",
  "to": "userId2",
  "text": "I love you so much...",
  "sentAt": Timestamp,
  "read": false
}
```

#### `thumb_kiss/{coupleId}`
```json
{
  "user1Active": false,
  "user2Active": false,
  "lastUpdated": Timestamp,
  "count": 42
}
```

---

## 🎨 Feature Documentation

### 1. Authentication

**Signup with Email:**
```typescript
import { signUp } from "@/lib/auth";

await signUp("email@example.com", "password123", "Full Name");
```

**Signin with Email:**
```typescript
import { signIn } from "@/lib/auth";

await signIn("email@example.com", "password123");
```

**Signin with Google:**
```typescript
import { signInWithGoogle } from "@/lib/auth";

await signInWithGoogle();
```

### 2. Couple Pairing

**Get Invite Code:**
```typescript
// Auto-generated in user profile
const code = userProfile.inviteCode; // "ABC123"
```

**Connect Partner:**
```typescript
import { connectPartner } from "@/lib/auth";

await connectPartner(currentUserId, inviteCode);
```

### 3. Daily Questions

**Get Today's Question:**
```typescript
import { getDailyQuestion } from "@/lib/questions";

const todayString = new Date().toISOString().split('T')[0];
const question = await getDailyQuestion(todayString);
```

**Submit Answer:**
```typescript
import { submitAnswer } from "@/lib/questions";

await submitAnswer(coupleId, userId, questionId, "My answer", dateString);
```

### 4. Streak System

**Get Streak:**
```typescript
import { getOrCreateStreak } from "@/lib/streaks";

const streak = await getOrCreateStreak(coupleId);
console.log(streak.count); // Current streak days
```

**Increment Streak:**
```typescript
import { incrementStreak } from "@/lib/streaks";

await incrementStreak(coupleId);
```

### 5. Shared Memories

**Upload Memory:**
```typescript
import { uploadMemory } from "@/lib/memories";

await uploadMemory(coupleId, userId, imageFile, "Caption", ["tag1", "tag2"]);
```

**Get Memories:**
```typescript
import { getCoupleMemories } from "@/lib/memories";

const memories = await getCoupleMemories(coupleId);
```

### 6. Chat

**Send Message:**
```typescript
import { sendMessage } from "@/lib/chat";

await sendMessage(coupleId, userId, "Hello love!");
```

### 7. Love Notes

**Send Note:**
```typescript
import { sendLoveNote } from "@/lib/loveNotes";

await sendLoveNote(coupleId, fromId, toId, "I love you...");
```

### 8. Thumb Kiss

**Initialize Thumb Kiss:**
```typescript
import { initializeThumbKiss } from "@/lib/thumbKiss";

await initializeThumbKiss(coupleId);
```

**Listen to Thumb State:**
```typescript
import { listenToThumbKiss } from "@/lib/thumbKiss";

const unsubscribe = listenToThumbKiss(coupleId, (data) => {
  console.log("User1:", data.user1Active);
  console.log("User2:", data.user2Active);
});
```

---

## 🧠 Custom Hooks

### `useAuth()`
Get authentication context:
```typescript
const { firebaseUser, userProfile, partner, couple, loading } = useAuth();
```

### `useIsAuthenticated()`
Check if user is logged in:
```typescript
const isAuth = useIsAuthenticated();
```

### `useIsPaired()`
Check if user has a partner:
```typescript
const isPaired = useIsPaired();
```

### `usePartnerName()`
Get partner's display name:
```typescript
const partnerName = usePartnerName();
```

### `useRelationshipDays()`
Get days since relationship started:
```typescript
const days = useRelationshipDays();
```

---

## 🔐 Firestore Security Rules

Apply these rules in Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId;
    }
    
    // Couple data — only members can access
    match /couples/{coupleId} {
      allow read, write: if request.auth != null 
        && request.auth.uid in resource.data.users;
      allow create: if request.auth != null;
    }
    
    // Messages — couple members only
    match /messages/{coupleId}/chat/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Answers
    match /answers/{coupleId}/responses/{responseId} {
      allow read, write: if request.auth != null;
    }
    
    // Streaks
    match /streaks/{coupleId} {
      allow read, write: if request.auth != null;
    }
    
    // Memories
    match /memories/{coupleId}/items/{memoryId} {
      allow read, write: if request.auth != null;
    }
    
    // Love notes
    match /love_notes/{coupleId}/notes/{noteId} {
      allow read, write: if request.auth != null;
    }
    
    // Thumb kiss
    match /thumb_kiss/{coupleId} {
      allow read, write: if request.auth != null;
    }
    
    // Daily questions
    match /daily_questions/{questionId} {
      allow read: if request.auth != null;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🎥 Firebase Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /memories/{coupleId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.size < 10 * 1024 * 1024; // Max 10MB
    }
  }
}
```

---

## 📱 PWA Configuration

The app includes PWA support via `public/manifest.json`:

- **Installable** on home screen (iOS & Android)
- **Offline support** via service workers
- **App-like experience** full screen

Users can install by:
1. Open app in browser
2. Click share menu → "Add to Home Screen"
3. Or use browser's install prompt

---

## 🎨 Customization

### Change Color Scheme

Edit `tailwind.config.ts`:
```javascript
theme: {
  colors: {
    'rose-primary': '#ff6b9d', // Change primary color
    'romantic-pink': '#ff4757',
    // ... other colors
  }
}
```

### Change App Name

Edit multiple files:
- `package.json` - name field
- `public/manifest.json` - name & short_name
- `src/app/layout.tsx` - metadata.title
- `next.config.ts` - any references

### Add New Features

1. Create utility function in `src/lib/`
2. Create component in `src/components/`
3. Use in pages
4. Add Firestore collection schema if needed

---

## 🐛 Troubleshooting

### App Shows Blank Screen

**Solution:**
1. Check browser console for errors (F12)
2. Verify `.env.local` has correct Firebase config
3. Clear browser cache (Ctrl+Shift+Del)
4. Restart dev server

### Firebase Authentication Error

**"Firebase is not initialized"**
- Check `.env.local` has all Firebase variables
- Ensure variables start with `NEXT_PUBLIC_`
- Restart dev server after changing `.env.local`

### Messages Not Showing

**"Timestamp is null"**
- Ensure Firestore has messages documents
- Check that `timestamp: serverTimestamp()` was used
- Reload page and check browser console

### Memory Upload Fails

**"Storage quota exceeded"**
- Firebase free tier has 5GB limit
- Upgrade to Blaze plan, or
- Reduce image file sizes (compress before upload)

### Vercel Deployment Error

**"Build failed"**
- Check build logs in Vercel dashboard
- Run `npm run build` locally to reproduce
- Ensure all environment variables are set in Vercel

### APK Installation Fails

**"App not installed"**
- Ensure Android phone has "Unknown sources" enabled
- Check Android version is compatible (min API 21)
- Try different USB cable or computer

---

## 📞 Support & Resources

- **Documentation:** [Firebase Docs](https://firebase.google.com/docs)
- **Next.js Help:** [Next.js Docs](https://nextjs.org/docs)
- **Tailwind CSS:** [Tailwind Docs](https://tailwindcss.com/docs)
- **Vercel Deployment:** [Vercel Docs](https://vercel.com/docs)
- **Capacitor Guide:** [Capacitor Docs](https://capacitorjs.com/docs)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎉 Ready to Launch?

1. ✅ Install dependencies
2. ✅ Set up Firebase project
3. ✅ Configure `.env.local`
4. ✅ Run `npm run dev`
5. ✅ Deploy to Vercel
6. ✅ Convert to APK with Capacitor

**Your premium couples app is ready! Keep love glowing 🕯️✨**
