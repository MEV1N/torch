# 🚀 Torch — Quick Start Guide

Get up and running in 5 minutes!

## 1️⃣ Prerequisites (2 min)

```bash
# Check Node.js version (need v18+)
node --version
npm --version

# Clone or open the project
cd torch
```

## 2️⃣ Install & Setup (2 min)

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local
```

## 3️⃣ Firebase Configuration (1 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email + Google)
4. Create **Firestore Database**
5. Enable **Cloud Storage**
6. Copy Firebase config to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 4️⃣ Run Local Server (instant)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in browser.

## ✅ You're ready!

Sign up with email or Google, pair with partner, and explore the app.

---

## 🎯 Next Steps

1. **Explore Features**
   - Daily questions
   - Shared memories
   - Love notes
   - Chat

2. **Customize**
   - Change colors in `tailwind.config.ts`
   - Modify theme in `src/lib/emotional.ts`
   - Update questions in `src/lib/questions.ts`

3. **Deploy**
   ```bash
   # Push to GitHub
   git add . && git commit -m "Deploy"
   git push origin main
   
   # Deploy on Vercel (connect GitHub repo)
   ```

4. **Convert to APK**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   npm run build
   npx cap add android
   npx cap open android
   ```

---

## 📚 Common Commands

```bash
# Development
npm run dev              # Start dev server on :3000
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Check code quality

# Firebase
npx firebase deploy      # Deploy to Firebase Hosting (if configured)

# Capacitor (APK)
npx cap add android      # Add Android platform
npx cap open android     # Open in Android Studio
npx cap sync android     # Sync web assets to Android
```

---

## 🆘 Troubleshooting

**Blank screen?**
- Check `.env.local` has Firebase config
- Clear browser cache (Ctrl+Shift+Del)
- Check console for errors (F12)

**Can't sign up?**
- Ensure Email auth is enabled in Firebase
- Check Firestore security rules

**Messages not showing?**
- Check Firestore database for data
- Verify security rules allow access

**APK won't install?**
- Enable "Unknown sources" on phone
- Check Android version (min API 21)

---

## 📞 Need Help?

- **Setup Issues:** Check `COMPLETE_SETUP_GUIDE.md`
- **Design Questions:** Read `DESIGN_SYSTEM.md`
- **Deployment:** See `DEPLOYMENT_CHECKLIST.md`
- **Firebase Docs:** https://firebase.google.com/docs

---

**Happy coding! Keep love glowing 🕯️✨**
