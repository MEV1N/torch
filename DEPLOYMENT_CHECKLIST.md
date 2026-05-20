# 🚀 Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment

- [ ] Run `npm run build` and ensure no errors
- [ ] Test all features locally with `npm run dev`
- [ ] Test on mobile device (iOS & Android)
- [ ] Verify responsive design on different screen sizes
- [ ] Check console for JavaScript errors
- [ ] Verify all environment variables in `.env.local`
- [ ] Test Firebase authentication flows
- [ ] Test data persistence in Firestore
- [ ] Test image uploads to Firebase Storage
- [ ] Test real-time messaging
- [ ] Load test with multiple users
- [ ] Check performance with Lighthouse

## Firebase Configuration

- [ ] Enable Email/Password authentication
- [ ] Enable Google authentication
- [ ] Configure Firestore database
- [ ] Enable Firebase Storage
- [ ] Set Firestore security rules
- [ ] Set Storage security rules
- [ ] Create service account (if needed for backend)
- [ ] Configure CORS for Storage
- [ ] Set up backup schedule
- [ ] Enable Firestore backups

## Code Quality

- [ ] Run ESLint: `npm run lint`
- [ ] Check TypeScript types: `npx tsc --noEmit`
- [ ] Run tests (if available)
- [ ] Code review completed
- [ ] No console.logs in production code
- [ ] Remove any hardcoded credentials
- [ ] Update version number in `package.json`
- [ ] Update `COMPLETE_SETUP_GUIDE.md` if needed

## Environment Setup

- [ ] All `.env.local` variables documented
- [ ] Vercel environment variables configured
- [ ] GitHub secrets configured (if needed)
- [ ] Database indexes optimized
- [ ] CDN caching configured

## Security

- [ ] Firebase security rules tested
- [ ] No sensitive data in localStorage
- [ ] HTTPS enforced on Vercel
- [ ] CORS properly configured
- [ ] Rate limiting considered for API calls
- [ ] Input validation on all forms
- [ ] SQL injection prevention (if using API)
- [ ] XSS protection active

## Performance

- [ ] Images optimized and compressed
- [ ] Lazy loading configured for images
- [ ] Bundle size under 500KB
- [ ] Lighthouse score > 90
- [ ] Lighthouse CLS < 0.1
- [ ] Lighthouse LCP < 2.5s
- [ ] Lighthouse FID < 100ms

## Mobile & PWA

- [ ] Manifest.json configured
- [ ] App icons added (192x192, 512x512, maskable)
- [ ] Install prompt working
- [ ] Offline support tested
- [ ] Touch icons configured
- [ ] Status bar color set
- [ ] Viewport meta tags correct

## Monitoring & Analytics

- [ ] Error tracking configured (if needed)
- [ ] Analytics setup (Google Analytics or similar)
- [ ] Uptime monitoring configured
- [ ] Backup strategy in place
- [ ] Database monitoring enabled
- [ ] Storage usage monitoring

## Deployment Steps

### Vercel Deployment

1. [ ] Push code to GitHub
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. [ ] Configure environment variables in Vercel
   - [ ] NEXT_PUBLIC_FIREBASE_API_KEY
   - [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - [ ] NEXT_PUBLIC_FIREBASE_APP_ID

3. [ ] Trigger deployment in Vercel dashboard
4. [ ] Monitor deployment logs
5. [ ] Test production URL
6. [ ] Configure custom domain
7. [ ] Set up SSL certificate

### APK Deployment

1. [ ] Build production APK
2. [ ] Test on real Android devices
3. [ ] Create signing certificate
4. [ ] Sign APK
5. [ ] Upload to Google Play Console
6. [ ] Fill in store listing
7. [ ] Add privacy policy and terms
8. [ ] Submit for review
9. [ ] Monitor review status

## Post-Deployment

- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Monitor performance metrics
- [ ] Monitor storage usage
- [ ] Monitor Firestore read/write operations
- [ ] Plan scaling strategy if needed
- [ ] Set up automated backups
- [ ] Schedule regular security audits
- [ ] Plan next feature releases

## First Week Monitoring

- [ ] Daily check of error logs
- [ ] Daily check of performance metrics
- [ ] Monitor new user signup
- [ ] Monitor active users
- [ ] Check Firebase quota usage
- [ ] Respond to user feedback
- [ ] Monitor crash reports

## Launch Marketing

- [ ] Social media announcement
- [ ] Email campaign
- [ ] Product Hunt post (if applicable)
- [ ] Couple-themed marketing materials
- [ ] Beta tester appreciation post
- [ ] Press release (if applicable)
- [ ] User onboarding email sequence

---

## Emergency Contacts & Resources

**Firebase Support:** https://firebase.google.com/support
**Vercel Support:** https://vercel.com/support
**Status Pages:**
- Firebase: https://status.firebase.google.com
- Vercel: https://www.vercelstatus.com

---

**Last Updated:** May 19, 2026
**Status:** Ready for Deployment ✅
