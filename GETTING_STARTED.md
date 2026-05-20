# � TORCH — GETTING STARTED & DEMO CREDENTIALS

## 🚀 Quick Setup (5 Minutes)

### Prerequisites
- Node.js v18+ installed
- Firebase account (free at firebase.google.com)

### Step 1: Install Dependencies
```bash
cd torch
npm install
```

### Step 2: Setup Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable: Authentication (Email + Google), Firestore, Storage
4. Copy your Firebase config

### Step 3: Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 4: Run Local Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Login Credentials

Since this uses Firebase authentication, you have two options:

### Option 1: Create Demo Accounts (Recommended)

Sign up two accounts in your local app:

**Partner 1:**
```
Email: alice@demo.com
Password: Demo123!@
Name: Alice
```

**Partner 2:**
```
Email: bob@demo.com
Password: Demo123!@
Name: Bob
```

Then connect them using the invite code feature.

### Option 2: Manually Add Test Data

Create test accounts in Firebase Console:

1. Go to **Authentication** tab
2. Click **Add User**
3. Enter email and password
4. User appears in your app

### Option 3: Use Firebase Emulator (Advanced)

For completely local testing without Firebase:

```bash
npm install -g firebase-tools
firebase emulators:start
```

Set in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=localhost:9099
```

---

## 🧪 Testing the App

### Test Full Flow (10 min)

1. **Create Account**
   - Sign up with email
   - Or use Google signup

2. **Connect Partner**
   - Copy your invite code
   - Share with partner
   - Partner enters code on pair page

3. **Try Features**
   - Daily question → Answer question
   - Chat → Send message to partner
   - Memories → Upload photo
   - Love Note → Send romantic note
   - Thumb Kiss → Hold button
   - Streaks → Check streak count

4. **View Dashboard**
   - See days together
   - View relationship stats
   - Check mood selector

---

## 📱 Test on Mobile Device

### Same Wi-Fi Network

1. Find your IP:
   ```bash
   ipconfig getifaddr en0    # macOS
   hostname -I               # Linux
   ipconfig                  # Windows (look for IPv4)
   ```

2. Open on phone:
   ```
   http://YOUR_IP:3000
   ```

3. Test touch interactions

### iOS Device

- Open Safari
- Share button → "Add to Home Screen"
- App appears like native app

### Android Device

- Open Chrome
- Menu → "Install app"
- App installs to home screen

---

## 🎯 First Time Users

### Recommended Testing Order

1. **Onboarding** (1 min)
   - See splash screen
   - Read welcome message

2. **Authentication** (2 min)
   - Try email signup
   - Try Google signup

3. **Pairing** (2 min)
   - Get invite code
   - Share with partner
   - Connect

4. **Dashboard** (1 min)
   - View home page
   - Check days counter
   - See quick actions

5. **Daily Question** (2 min)
   - See today's question
   - Submit answer
   - Wait for partner answer

6. **Chat** (2 min)
   - Send message
   - See real-time update
   - Try emoji

7. **Memories** (2 min)
   - Click upload
   - Select image
   - Add caption

8. **Other Features** (As time allows)
   - Love notes
   - Thumb kiss
   - Streaks
   - Settings

---

## 🔍 Understanding the Demo

### What Works

✅ **Fully Functional:**
- User authentication (signup/login)
- Couple pairing system
- Daily questions
- Chat messaging
- Memory uploads
- Love notes
- Streak tracking
- Real-time updates
- Profile settings
- Mood tracking

✅ **Partially Functional:**
- Push notifications (UI ready, FCM integration needed)
- Offline support (PWA ready)

### What Requires Additional Setup

- **Email Verification** — Configure email templates in Firebase
- **Password Reset** — Configure reset email template
- **FCM Notifications** — Add Firebase Cloud Messaging
- **Analytics** — Integrate Google Analytics
- **Error Tracking** — Add Sentry or similar

---

## 🐛 Common Issues

### "Blank White Screen"
```bash
# Solution:
1. Check console for errors (F12)
2. Check .env.local is configured
3. Restart dev server (Ctrl+C, npm run dev)
4. Clear cache (Ctrl+Shift+Del)
```

### "Can't Sign Up"
```
Check:
1. Email/Password auth is enabled in Firebase
2. .env.local has FIREBASE_API_KEY
3. No typos in .env.local
4. Firestore security rules allow create
```

### "Messages Not Showing"
```
Check:
1. Firestore has 'messages' collection
2. Security rules allow read/write
3. Browser console for errors (F12)
4. Reload page to refresh
```

### "Image Upload Fails"
```
Check:
1. Firebase Storage is enabled
2. Security rules allow write
3. Image file is < 10MB
4. Storage bucket exists
```

---

## 📊 Example Data Structure

### User Profile Created
```json
{
  "uid": "user123",
  "displayName": "Alice",
  "email": "alice@demo.com",
  "photoURL": "",
  "coupleId": null,         // null until paired
  "inviteCode": "ABC123",   // Unique code
  "mood": "😊",
  "createdAt": "2024-05-19T10:30:00Z"
}
```

### After Pairing
```json
{
  "coupleId": "couple456",  // Now has couple ID
  "users": ["user123", "user789"]
}
```

### Message Data
```json
{
  "id": "msg001",
  "senderId": "user123",
  "text": "Good morning love! ❤️",
  "timestamp": "2024-05-19T08:00:00Z",
  "read": true
}
```

---

## 🚀 Next Steps

### Week 1: Explore
1. [ ] Sign up and test all features
2. [ ] Invite friend/partner to test
3. [ ] Review code and components
4. [ ] Understand Firestore structure

### Week 2: Customize
1. [ ] Change app colors
2. [ ] Update questions
3. [ ] Modify greeting messages
4. [ ] Add your branding

### Week 3: Deploy
1. [ ] Deploy to Vercel
2. [ ] Set up custom domain
3. [ ] Configure production Firebase
4. [ ] Test live version

### Week 4: Launch
1. [ ] Public beta testing
2. [ ] Gather user feedback
3. [ ] Fix issues
4. [ ] Official launch

---

## 📚 Documentation Map

**Start Here:**
- [QUICK_START.md](QUICK_START.md) — 5-minute setup

**Then Read:**
- [README_FULL.md](README_FULL.md) — Project overview
- [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md) — Detailed setup

**Reference:**
- [API_REFERENCE.md](API_REFERENCE.md) — All functions
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Design specs
- [BUILD_SUMMARY.md](BUILD_SUMMARY.md) — What was built

**Deploy:**
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) — Before going live

---

## 💬 Chat Commands (Future)

When implemented, try:
- `/help` — Show available commands
- `/streak` — Show current streak
- `/question` — Show today's question
- `/mood 😊` — Set mood emoji

---

## 🎮 Keyboard Shortcuts (When Implemented)

- `Ctrl+N` — New message
- `Ctrl+/` — Search
- `Ctrl+P` — Profile
- `Ctrl+Q` — Today's question

---

## 📈 Monitor These Metrics

**In Firebase Console:**
- Authentication → Active users
- Firestore → Requests/reads
- Storage → Total storage used
- Realtime → Connection count

**In Browser:**
- Console → No errors (F12)
- Network → Fast load times
- Performance → > 90 score

---

## 🎓 Learning Path

**Day 1: Setup & Explore**
- Install and run locally
- Test all features
- Read QUICK_START.md

**Day 2: Code Review**
- Review component structure
- Understand Firebase integration
- Check Firestore schema

**Day 3: Customization**
- Change colors
- Update text/messages
- Add custom questions

**Day 4: Deployment**
- Deploy to Vercel
- Test production
- Set custom domain

**Day 5+: Growth**
- Monitor analytics
- Gather user feedback
- Plan new features

---

## ✨ Tips & Tricks

### Debugging
```javascript
// In browser console:
// Check current user
firebase.auth().currentUser

// Check Firestore data
db.collection('users').get()

// Monitor real-time updates
db.collection('messages').onSnapshot(...)
```

### Performance
- Use DevTools (F12) → Performance tab
- Run Lighthouse audit
- Monitor bundle size: `npm run build`

### Testing
- Test on real mobile devices
- Test with different screen sizes
- Test both portrait and landscape
- Test with slow network (DevTools)

### Security
- Never share Firebase credentials
- Use `.env.local` for secrets
- Review Firestore security rules
- Keep npm packages updated

---

## 🎉 You're All Set!

Your complete couples relationship app is ready to use, test, and deploy.

```bash
# Start here:
npm run dev
# Open http://localhost:3000
```

### What You Have:
✅ Fully functional couples app  
✅ Real-time features working  
✅ Beautiful mobile UI  
✅ Complete documentation  
✅ Ready for production  

### What's Next:
1. Test thoroughly
2. Customize for your needs
3. Deploy to Vercel
4. Launch publicly
5. Grow your user base

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Run prod | `npm start` |
| Lint code | `npm run lint` |
| Format | `npm run format` |

---

**Built with ❤️ for couples who want to keep their love glowing**

🕯️✨ Keep your love glowing 🕯️✨

**Ready to begin?**

```bash
npm run dev
```

---

**Version:** 1.0.0  
**Last Updated:** May 19, 2026  
**Status:** Production Ready ✅
