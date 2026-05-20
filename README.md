# � Torch — Couples Relationship App

A premium, emotionally-rich couples relationship web app built with Next.js, Firebase, and Framer Motion.

> Keep your love glowing ✨

---

## ✨ Features

- **🔐 Authentication** — Email + Google sign-in with beautiful onboarding
- **🔗 Couple Pairing** — Connect with your partner using unique invite codes
- **💝 Daily Questions** — 120+ romantic questions with animated partner reveal
- **🔥 Streak System** — Daily streaks with milestones, heatmap, and motivational messages
- **📸 Shared Memories** — Photo timeline with Firebase Storage upload
- **💬 Private Chat** — Real-time messaging with typing indicators and read receipts
- **💋 Thumb Kiss** — Real-time touch interaction with glowing heart animations
- **💌 Love Notes** — Send short romantic notes with animated delivery
- **📊 Relationship Dashboard** — Days counter, mood tracking, romantic quotes
- **🔔 Push Notifications** — FCM-ready notification system

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Icons | React Icons |
| Dates | date-fns |

---

## 🚀 Getting Started

### 1. Clone and install

```bash
cd torch
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** → Sign-in methods:
   - Email/Password
   - Google
4. Create **Cloud Firestore** database
5. Enable **Firebase Storage**
6. Go to Project Settings → General → Your apps → Web app
7. Copy the config values

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Set up Firestore Security Rules

In Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
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
    match /answers/{coupleId}/responses/{dateStr}/{userId} {
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
    
    // Typing indicators
    match /typing/{coupleId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Set up Storage Rules

In Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /memories/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 APK Conversion (Capacitor)

### Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npx cap init Torch com.torch.app --web-dir=out
```

### Step 2: Add Android platform

```bash
npm install @capacitor/android
npx cap add android
```

### Step 3: Configure for static export

Update `next.config.ts`:
```ts
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};
```

### Step 4: Build and sync

```bash
npm run build
npx cap sync android
```

### Step 5: Open in Android Studio

```bash
npx cap open android
```

Build the APK from Android Studio → Build → Build Bundle(s) / APK(s)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Splash screen
│   ├── layout.tsx            # Root layout + AuthProvider
│   ├── globals.css           # Design system
│   ├── auth/page.tsx         # Login/Register
│   ├── onboarding/page.tsx   # Onboarding slides
│   ├── pair/page.tsx         # Partner pairing
│   ├── home/page.tsx         # Dashboard
│   ├── question/page.tsx     # Daily question
│   ├── chat/page.tsx         # Real-time chat
│   ├── memories/page.tsx     # Photo memories
│   ├── notes/page.tsx        # Love notes
│   ├── streak/page.tsx       # Streak tracker
│   ├── thumbkiss/page.tsx    # Thumb kiss
│   └── settings/page.tsx     # Profile/Settings
├── components/
│   ├── AnimatedButton.tsx
│   ├── Avatar.tsx
│   ├── BottomNav.tsx
│   ├── ChatBubble.tsx
│   ├── DaysCounter.tsx
│   ├── EmptyState.tsx
│   ├── GlassCard.tsx
│   ├── LoadingScreen.tsx
│   ├── LoveNoteCard.tsx
│   ├── MemoryCard.tsx
│   ├── PageTransition.tsx
│   ├── SkeletonLoader.tsx
│   └── Toast.tsx
├── contexts/
│   └── AuthContext.tsx
└── lib/
    ├── auth.ts
    ├── firebase.ts
    ├── notifications.ts
    ├── questions.ts
    ├── streaks.ts
    └── types.ts
```

---

## 🎨 Design System

- **Background**: Deep black (#0a0a0f)
- **Accent**: Rose pink (#e8547c)
- **Purple**: Romantic purple (#a855f7)
- **Typography**: Geist Sans (via Next.js)
- **Effects**: Glassmorphism, glow effects, animated gradients
- **Animations**: Framer Motion throughout

---

## 📄 License

MIT
