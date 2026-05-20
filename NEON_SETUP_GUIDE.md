# Neon Migration — Setup & Installation Guide

## 1️⃣ Add Dependencies to `package.json`

Run these commands:

```bash
npm install @neondatabase/serverless
npm install next-auth
npm install bcrypt
npm install aws-sdk
npm install --save-dev @types/bcrypt
```

Or manually add to `package.json`:

```json
{
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "next-auth": "^4.24.0",
    "bcrypt": "^5.1.1",
    "aws-sdk": "^2.1500.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "typescript": "^5.0.0"
  }
}
```

---

## 2️⃣ Create `.env.local` File

```env
# DATABASE
DATABASE_URL=postgresql://neondb_owner:npg_L0YarvoE2NQk@ep-fancy-lab-apto3wdn-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# NEXTAUTH
NEXTAUTH_SECRET=your-random-secret-here-generate-with-this-command:
# openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# GOOGLE OAUTH (get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# Optional: Development
NODE_ENV=development
DEBUG=true
```

---

## 3️⃣ Setup Neon Database

1. Go to https://console.neon.tech/
2. Create a new project
3. Copy the connection string (it will look like the `DATABASE_URL` above)
4. Run the SQL schema in `DATABASE_SCHEMA_NEON.sql`:
   - Click "SQL Editor" in Neon dashboard
   - Paste entire schema file
   - Execute

---

## 4️⃣ Setup Google OAuth

1. Go to https://console.cloud.google.com/
2. Create new OAuth credentials (OAuth 2.0 Client ID)
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (production)
4. Copy `Client ID` and `Client Secret` to `.env.local`

---

## 5️⃣ Setup AWS S3

1. Go to https://aws.amazon.com/
2. Create IAM user with S3 permissions
3. Create S3 bucket (name it `torch-app-storage` or similar)
4. Get Access Key and Secret Key
5. Add to `.env.local`

---

## 6️⃣ Update `src/contexts/AuthContext.tsx`

Replace Firebase with NextAuth:

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface AuthContextType {
  user: any
  isLoading: boolean
  session: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(status === 'loading')
  }, [status])

  return (
    <AuthContext.Provider
      value={{
        user: session?.user,
        isLoading,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

---

## 7️⃣ Update `src/app/layout.tsx`

Replace Firebase provider with NextAuth:

```typescript
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
```

---

## 8️⃣ Create API Routes Template

### File: `src/app/api/boops/route.ts`

```typescript
import { query, queryOne } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

// GET: Fetch boops
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const coupleId = searchParams.get('coupleId')

    if (!coupleId) {
      return Response.json({ error: 'Missing coupleId' }, { status: 400 })
    }

    const boops = await query(
      `SELECT * FROM boops WHERE couple_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [coupleId]
    )

    return Response.json(boops)
  } catch (error) {
    console.error('GET /api/boops error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a boop
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { coupleId, toUid, fromName, emoji } = body

    const result = await query(
      `INSERT INTO boops (couple_id, from_user_id, from_name, to_user_id, emoji)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [coupleId, session.user.id, fromName, toUid, emoji]
    )

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error('POST /api/boops error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## 9️⃣ Create S3 Upload Utility

### File: `src/lib/s3.ts`

```typescript
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export async function uploadToS3(
  file: Buffer | string,
  key: string,
  contentType: string
): Promise<string> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read' as const,
  }

  const result = await s3.upload(params).promise()
  return result.Location
}

export async function deleteFromS3(key: string): Promise<void> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  }

  await s3.deleteObject(params).promise()
}

export function getS3Url(key: string): string {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}
```

---

## 🔟 Update Import Statements

Replace throughout your codebase:

```typescript
// OLD (Firebase)
import { getBoopCount } from '@/lib/boop'

// NEW (Neon)
import { getBoopCount } from '@/lib/boop-neon'
```

Or create wrapper that imports from new location:

```typescript
// src/lib/boop.ts (wrapper)
export * from '@/lib/boop-neon'
```

---

## ✅ Verification Checklist

- [ ] `.env.local` created with all variables
- [ ] `DATABASE_URL` from Neon is correct
- [ ] Schema uploaded to Neon database
- [ ] `npm install` completed
- [ ] `src/lib/db.ts` exists
- [ ] `src/lib/auth-config.ts` exists
- [ ] `src/app/api/auth/[...nextauth]/route.ts` exists
- [ ] `src/contexts/AuthContext.tsx` updated
- [ ] `src/app/layout.tsx` updated
- [ ] Google OAuth credentials in `.env.local`
- [ ] AWS S3 credentials in `.env.local`

---

## 🧪 Test It

1. Start dev server:
```bash
npm run dev
```

2. Test database connection:
```bash
# Query Neon directly in dashboard to verify schema is there
```

3. Test auth:
```bash
# Go to http://localhost:3000/auth
# Try Google OAuth sign-in
```

4. Test API:
```bash
curl -X POST http://localhost:3000/api/boops \
  -H "Content-Type: application/json" \
  -d '{"coupleId":"test","toUid":"user2","fromName":"User1","emoji":"👆"}'
```

---

## 🚀 Next Steps

1. Finish the remaining module migrations (see NEON_MIGRATION_GUIDE.md)
2. Update component hooks to call API routes instead of direct functions
3. Test all features with two users in two browsers
4. Deploy to Vercel

---

**Ready?** Let's build! 🔥
