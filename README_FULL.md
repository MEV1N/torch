# � Torch — Keep Your Love Glowing

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A premium, emotionally-designed couples relationship app for keeping your love glowing. Built with modern web technologies and optimized for mobile devices and Android APK conversion.

[Live Demo](https://torch.app) • [Documentation](#-documentation) • [Quick Start](#-quick-start) • [Features](#-features)

---

## ✨ Features

### 💕 Core Features

- **🔐 Authentication** — Email/Password + Google Sign-in with beautiful onboarding
- **🔗 Couple Pairing** — Connect with partner using unique invite codes
- **💝 Daily Questions** — 120+ romantic questions with animated partner reveal
- **🔥 Streak System** — Daily engagement tracking with milestones and motivations
- **📸 Shared Memories** — Photo timeline with Firebase Storage integration
- **💬 Private Chat** — Real-time messaging with read receipts and typing indicators
- **💋 Thumb Kiss** — Real-time touch interaction with glowing heart animations
- **💌 Love Notes** — Send romantic short notes with animated delivery
- **📊 Dashboard** — Days counter, mood tracking, relationship analytics
- **🔔 Push Notifications** — FCM-ready notification system

### 🎨 Design Features

- **Mobile-First Design** — Responsive, touch-optimized interface
- **Glassmorphism Effects** — Modern glass-effect cards and modals
- **Smooth Animations** — Framer Motion animations throughout
- **Romantic Aesthetics** — Dark mode with rose/pink accents
- **PWA Support** — Installable web app on mobile devices
- **Offline Ready** — Service worker support for offline access

### 🚀 Development Features

- **TypeScript** — Full type safety across the codebase
- **Next.js 16** — Latest App Router for optimal performance
- **Tailwind CSS v4** — Utility-first styling with custom theme
- **Firebase** — Realtime database, auth, storage
- **Production Ready** — Code splitting, optimization, SEO
- **Scalable Architecture** — Modular components and utilities

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 16.x |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **Animations** | Framer Motion | 12.x |
| **Auth** | Firebase Auth | 12.x |
| **Database** | Firestore | Latest |
| **Storage** | Firebase Storage | Latest |
| **Icons** | React Icons | 5.x |
| **Dates** | date-fns | 4.x |
| **Deployment** | Vercel | Latest |
| **APK** | Capacitor | Latest |

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ ([Download](https://nodejs.org/))
- npm or yarn
- Firebase account ([Create free](https://firebase.google.com/))
- Vercel account ([Sign up](https://vercel.com/)) — optional for deployment

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/torch.git
cd torch
npm install
```

### 2. Setup Firebase

1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email + Google)
3. Create Firestore Database
4. Enable Cloud Storage
5. Copy Firebase config

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### ✅ Done!

You now have a fully functional couples app running locally.

---

## 📚 Documentation

### Getting Started

- **[QUICK_START.md](QUICK_START.md)** — Get running in 5 minutes
- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** — Comprehensive setup guide
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** — UI/UX design guidelines

### Reference

- **[API_REFERENCE.md](API_REFERENCE.md)** — Complete API documentation
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** — Pre-deployment checklist
- **[Database Schema](#-database-schema)** — Firestore structure

### Configuration

- **Next.js Config** — [next.config.ts](next.config.ts)
- **Tailwind Config** — [tailwind.config.ts](tailwind.config.ts)
- **TypeScript Config** — [tsconfig.json](tsconfig.json)
- **ESLint Config** — [eslint.config.mjs](eslint.config.mjs)

---

## 📁 Project Structure

```
torch/
├── src/
│   ├── app/                    # Next.js pages (App Router)
│   │   ├── layout.tsx          # Root layout with AuthProvider
│   │   ├── page.tsx            # Splash screen
│   │   ├── auth/               # Authentication pages
│   │   ├── pair/               # Couple pairing
│   │   ├── home/               # Dashboard
│   │   ├── question/           # Daily questions
│   │   ├── chat/               # Chat interface
│   │   ├── memories/           # Shared memories
│   │   ├── notes/              # Love notes
│   │   ├── streak/             # Streak tracking
│   │   ├── settings/           # Profile/settings
│   │   └── thumbkiss/          # Thumb kiss interaction
│   ├── components/             # Reusable React components
│   │   ├── AnimatedButton.tsx   # Button with animations
│   │   ├── Avatar.tsx           # User avatar
│   │   ├── BottomNav.tsx        # Bottom navigation bar
│   │   ├── ChatBubble.tsx       # Chat message bubble
│   │   ├── DaysCounter.tsx      # Relationship days display
│   │   ├── EmptyState.tsx       # Empty state placeholder
│   │   ├── GlassCard.tsx        # Glassmorphism card
│   │   ├── LoadingScreen.tsx    # Loading animation
│   │   ├── LoveNoteCard...tsx   # Love note display
│   │   ├── MemoryCard...tsx     # Memory photo card
│   │   ├── PageTransition.tsx   # Page transition animation
│   │   ├── QuestionCard.tsx     # Question display
│   │   ├── SkeletonLoader.tsx   # Skeleton loading UI
│   │   ├── StreakBadge.tsx      # Streak badge
│   │   ├── ThumbKiss.tsx        # Thumb kiss component
│   │   └── Toast.tsx            # Toast notifications
│   ├── contexts/               # React Context
│   │   └── AuthContext.tsx      # Authentication context
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts             # Authentication functions
│   │   ├── chat.ts             # Chat utilities
│   │   ├── emotional.ts        # Quotes, motivations
│   │   ├── firebase.ts         # Firebase config & init
│   │   ├── loveNotes.ts        # Love note utilities
│   │   ├── memories.ts         # Memory management
│   │   ├── notifications.ts    # Notification templates
│   │   ├── questions.ts        # Question utilities
│   │   ├── streaks.ts          # Streak logic
│   │   ├── thumbKiss.ts        # Thumb kiss logic
│   │   ├── types.ts            # TypeScript types
│   │   └── useAuth.ts          # Custom auth hooks
│   └── app/
│       └── globals.css         # Global styles
├── public/                     # Static assets
│   ├── icons/                  # App icons
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO robots file
├── Configuration Files
│   ├── next.config.ts          # Next.js config
│   ├── tailwind.config.ts      # Tailwind config
│   ├── tsconfig.json           # TypeScript config
│   ├── eslint.config.mjs       # ESLint config
│   └── postcss.config.mjs      # PostCSS config
└── Documentation
    ├── README.md               # This file
    ├── QUICK_START.md          # 5-minute setup
    ├── COMPLETE_SETUP_GUIDE.md # Full guide
    ├── DESIGN_SYSTEM.md        # Design specs
    ├── API_REFERENCE.md        # API docs
    └── DEPLOYMENT_CHECKLIST.md # Pre-deploy checklist
```

---

## 🗄️ Database Schema

### Firestore Collections

**users/{userId}**
```json
{
  "uid": "user_id",
  "displayName": "User Name",
  "email": "user@email.com",
  "photoURL": "https://...",
  "coupleId": "couple_id",
  "inviteCode": "ABC123",
  "mood": "😊",
  "createdAt": Timestamp,
  "fcmToken": "push_token"
}
```

**couples/{coupleId}**
```json
{
  "users": ["userId1", "userId2"],
  "relationshipStartDate": "2024-01-01",
  "createdAt": Timestamp
}
```

**messages/{coupleId}/chat/{messageId}**
```json
{
  "senderId": "userId",
  "text": "Message content",
  "timestamp": Timestamp,
  "read": false
}
```

**daily_questions/{questionId}**
```json
{
  "question": "What's your favorite memory?",
  "category": "romantic|deep|fun|nostalgic|spicy|dream",
  "date": "2024-05-19"
}
```

**streaks/{coupleId}**
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

Full schema documentation: [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md#-database-schema)

---

## 🎯 Usage Examples

### Authenticate User

```typescript
import { signUp, signIn, signInWithGoogle } from "@/lib/auth";

// Sign up
const user = await signUp("email@example.com", "password", "John Doe");

// Sign in
const user = await signIn("email@example.com", "password");

// Google sign in
const user = await signInWithGoogle();
```

### Send Message

```typescript
import { sendMessage } from "@/lib/chat";

await sendMessage(coupleId, userId, "I love you! ❤️");
```

### Submit Daily Question Answer

```typescript
import { submitAnswer } from "@/lib/questions";

await submitAnswer(
  coupleId,
  userId,
  questionId,
  "My answer...",
  "2024-05-19"
);
```

### Upload Memory

```typescript
import { uploadMemory } from "@/lib/memories";

await uploadMemory(
  coupleId,
  userId,
  imageFile,
  "Our beach trip!",
  ["beach", "vacation"]
);
```

More examples: [API_REFERENCE.md](API_REFERENCE.md)

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add . && git commit -m "Ready for production"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repo
   - Add environment variables
   - Click Deploy

3. **Custom Domain**
   - Add domain in Vercel Settings
   - Configure DNS settings
   - Done!

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

Complete deployment guide: [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md#-deployment-to-vercel)

---

## 📱 Android APK Conversion

Convert your web app to native Android APK using Capacitor:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize
npx cap init

# Build web assets
npm run build

# Add Android
npx cap add android

# Open in Android Studio
npx cap open android

# Build APK in Android Studio
# Build → Generate Signed Bundle/APK
```

Full guide: [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md#-android-apk-conversion-with-capacitor)

---

## 🧪 Testing Locally

### Development Server

```bash
npm run dev
```

### Build & Test Production

```bash
npm run build
npm start
```

### Test on Mobile Device

1. Find your machine's IP:
   ```bash
   ipconfig getifaddr en0    # macOS
   hostname -I               # Linux
   ```

2. Visit from phone: `http://YOUR_IP:3000`

### Test with Different Screen Sizes

- Open DevTools (F12)
- Click device toggle (top-left)
- Select different devices to simulate

---

## 🔐 Security

### Firebase Security Rules

Firestore rules are configured to:
- Users can only access their own profile
- Couples can only access their shared data
- Messages are only visible to couple members

See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md#-firestore-security-rules) for full rules.

### Storage Security

- Images limited to 10MB
- Only authenticated users can upload
- Auto-cleanup of unused files

### Authentication

- Email/password with Firebase Auth
- Google OAuth for easy signup
- Session persistence
- Secure token handling

---

## 🚨 Troubleshooting

### Build Issues

```bash
# Clear build cache
rm -rf .next
npm run build

# Check for errors
npm run lint
```

### Firebase Connection Issues

- Verify `.env.local` has correct credentials
- Check Firebase project is active
- Ensure all services are enabled
- Review console for errors (F12)

### Performance Issues

- Check bundle size: `npm run build`
- Monitor Firebase usage in console
- Enable CDN caching
- Optimize images
- Use lazy loading

Complete troubleshooting: [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md#-troubleshooting)

---

## 📊 Performance Metrics

Target metrics for production:

- **Lighthouse Score:** > 90
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms
- **Bundle Size:** < 500KB (gzipped)
- **Time to Interactive:** < 3s

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 Support & Resources

- **Documentation:** [Complete Setup Guide](COMPLETE_SETUP_GUIDE.md)
- **API Reference:** [API_REFERENCE.md](API_REFERENCE.md)
- **Design System:** [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- **Firebase Docs:** https://firebase.google.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

---

## 🎉 Getting Started

Ready to build? Start here:

1. 📖 Read [QUICK_START.md](QUICK_START.md) (5 min)
2. 🚀 Follow [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
3. 💻 Deploy with [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
4. 📱 Convert to APK with Capacitor

---

## 🙌 Built With Love

Made with ❤️ for couples who want to keep their love glowing.

**Keep your love glowing 🕯️✨**

---

**Version:** 1.0.0  
**Last Updated:** May 19, 2026  
**Maintainer:** Your Name
