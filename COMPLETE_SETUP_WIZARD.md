# 🧙 COMPLETE SETUP WIZARD

**Torch Couples App — Firebase to Neon Migration**

Follow these steps in order. Estimated time: **25 minutes**

---

## ✅ Step 1: Install Dependencies (5 minutes)

```bash
npm install @neondatabase/serverless next-auth bcrypt aws-sdk
npm install --save-dev @types/bcrypt
```

**Verify:**
```bash
npm list @neondatabase/serverless next-auth
```

✅ **Move to Step 2**

---

## ✅ Step 2: Create Neon Project (5 minutes)

1. Go to https://console.neon.tech/
2. Sign up or login
3. Click "Create project"
4. Select "PostgreSQL"
5. Choose a region close to you
6. Click "Create"
7. **Save your credentials** (you'll need them)

**You now have:**
- ✅ PostgreSQL database URL
- ✅ Username & password
- ✅ Host & port

✅ **Move to Step 3**

---

## ✅ Step 3: Create .env.local File (5 minutes)

Create file: `c:\Users\mevin\Desktop\candle\.env.local`

**Copy this template and fill in your values:**

```env
# Database (from Neon console)
DATABASE_URL=postgresql://user:password@host/database

# NextAuth
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=us-east-1
```

**How to get each value:**

### DATABASE_URL (from Neon)
1. Open https://console.neon.tech/
2. Click your project
3. Click "Connection string"
4. Copy the PostgreSQL connection string
5. Paste as DATABASE_URL

### NEXTAUTH_SECRET
```bash
# Mac/Linux
openssl rand -base64 32

# Windows (PowerShell)
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
```

### Google OAuth Credentials
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable "Google+ API"
4. Create "OAuth 2.0 Client ID"
5. Set redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret

### AWS S3 Credentials
1. Go to https://console.aws.amazon.com/
2. Create IAM user with S3 access
3. Generate access key
4. Create S3 bucket
5. Copy credentials

✅ **Move to Step 4**

---

## ✅ Step 4: Load Database Tables (3 minutes)

**Choose ONE method:**

### Method A: Easiest (Neon Console)
1. Open https://console.neon.tech/
2. Go to SQL Editor
3. Open file: `DATABASE_SCHEMA_NEON.sql`
4. Copy all contents
5. Paste into SQL Editor
6. Click "Run"
7. ✅ Done!

### Method B: Command Line (Recommended)
```powershell
# Set environment variable
$env:DATABASE_URL = "your_database_url_here"

# Run loader
.\load-schema.bat
```

### Method C: Node.js Script
```bash
node load-schema.js
```

**Verify tables created:**
```bash
psql $env:DATABASE_URL -c "\dt"
```

Should show 15+ tables.

✅ **Move to Step 5**

---

## ✅ Step 5: Start Dev Server (2 minutes)

```bash
npm run dev
```

Should output:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

✅ **Move to Step 6**

---

## ✅ Step 6: Test API Routes (5 minutes)

**Open new terminal and test:**

```bash
# Test boops API
curl -X GET "http://localhost:3000/api/boops?coupleId=test"

# Test messages API
curl -X GET "http://localhost:3000/api/messages?coupleId=test"

# Test streaks API
curl -X GET "http://localhost:3000/api/streaks?coupleId=test"
```

**Expected response:**
```json
{
  "success": true,
  "data": []
}
```

✅ **Setup Complete!**

---

## 🎉 You're Ready!

All backend infrastructure is ready. Next steps:

### Phase 1: Test Authentication
1. Open http://localhost:3000
2. Try Google OAuth sign-in
3. Verify user created in database

### Phase 2: Update Components
See: `COMPONENT_UPDATE_GUIDE.md`
- Update React components to use API routes
- Replace Firebase SDK calls with fetch
- Add polling for real-time updates

### Phase 3: Migrate Data
See: `NEON_MIGRATION_GUIDE.md`
- Export data from Firebase
- Transform to PostgreSQL format
- Import to Neon

### Phase 4: Deploy
```bash
vercel deploy --prod
```

---

## 📋 Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
npm cache clean --force
npm install
```

### Issue: DATABASE_URL not working

**Solution:**
1. Verify DATABASE_URL is correct format
2. Test connection: `psql $env:DATABASE_URL -c "SELECT 1"`
3. Check Neon project is active

### Issue: API routes return 500 error

**Solution:**
1. Check `.env.local` has all required variables
2. Verify database tables exist: `\dt` in psql
3. Check server logs for specific error

### Issue: Google OAuth doesn't work

**Solution:**
1. Verify GOOGLE_CLIENT_ID is set
2. Verify GOOGLE_CLIENT_SECRET is set
3. Check redirect URI matches exactly
4. Clear browser cookies and try again

### Issue: S3 uploads fail

**Solution:**
1. Verify AWS credentials are correct
2. Check S3 bucket exists
3. Verify bucket permissions allow uploads
4. Check AWS region is set correctly

---

## ✅ Verification Checklist

Before moving to next phase, verify:

- [ ] Dependencies installed
- [ ] .env.local created with all variables
- [ ] Neon database created
- [ ] Database tables loaded (15+)
- [ ] npm run dev starts without errors
- [ ] API routes respond to requests
- [ ] Google OAuth configured
- [ ] AWS S3 configured

---

## 📚 Next Documentation

After setup is complete:

1. **Test Authentication**
   - Open http://localhost:3000
   - Sign in with Google
   - Verify user in database

2. **Update Components**
   - Read: `COMPONENT_UPDATE_GUIDE.md`
   - Update React components
   - Test with API routes

3. **Migrate Data**
   - Read: `NEON_MIGRATION_GUIDE.md`
   - Export Firebase data
   - Import to Neon

4. **Deploy**
   - Run: `vercel deploy --prod`
   - Monitor logs
   - Test in production

---

## 🚀 Ready to Begin?

```bash
# Step 1: Install
npm install @neondatabase/serverless next-auth bcrypt aws-sdk

# Step 2: Create .env.local (use template above)

# Step 3: Load tables (use load-schema.bat or load-schema.js)

# Step 4: Start dev server
npm run dev

# Step 5: Test API
curl http://localhost:3000/api/boops?coupleId=test
```

**All 5 steps should take ~25 minutes.**

---

**Status: Setup Ready ✅**

**Next: Follow COMPONENT_UPDATE_GUIDE.md**
