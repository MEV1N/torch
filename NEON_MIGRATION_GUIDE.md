# 🔥 Firebase to Neon Migration Guide

**Status:** Phase 1 Complete ✅  
**Modules Converted:** 2/16  
**Estimated Total Time:** 4-6 hours for full migration

---

## 📋 Migration Checklist

### Already Converted ✅
- [x] `src/lib/boop-neon.ts` — Boop system (8 functions)
- [x] `src/lib/loveNotes-neon.ts` — Love notes (12 functions)
- [x] Authentication setup — `src/lib/auth-config.ts`
- [x] Database connection — `src/lib/db.ts`
- [x] Database schema — `DATABASE_SCHEMA_NEON.sql`

### Still Needs Migration ⏳
- [ ] `src/lib/photos.ts` → `src/lib/photos-neon.ts`
- [ ] `src/lib/chat.ts` → `src/lib/chat-neon.ts`
- [ ] `src/lib/questions.ts` → `src/lib/questions-neon.ts`
- [ ] `src/lib/streaks.ts` → `src/lib/streaks-neon.ts`
- [ ] `src/lib/drawings.ts` → `src/lib/drawings-neon.ts`
- [ ] `src/lib/widgets.ts` → `src/lib/widgets-neon.ts`
- [ ] `src/lib/games.ts` → `src/lib/games-neon.ts`
- [ ] `src/lib/coupleGames.ts` → `src/lib/coupleGames-neon.ts`
- [ ] `src/lib/relationshipStats.ts` → `src/lib/relationshipStats-neon.ts`
- [ ] `src/lib/dateIdeas.ts` → `src/lib/dateIdeas-neon.ts`
- [ ] `src/lib/milestones.ts` → `src/lib/milestones-neon.ts`
- [ ] `src/lib/distanceTracking.ts` → `src/lib/distanceTracking-neon.ts`
- [ ] `src/lib/location.ts` → `src/lib/location-neon.ts`
- [ ] `src/contexts/AuthContext.tsx` → Use NextAuth instead

---

## 🔄 Migration Pattern

### Step 1: Convert Interfaces

**Firebase Version:**
```typescript
export interface LoveNote {
  id?: string;
  fromUid: string;
  sentAt: Timestamp;
  // ...
}
```

**Neon Version:**
```typescript
export interface LoveNote {
  id: string;
  from_user_id: string;
  created_at: Date;
  // ...
}
```

**Key Changes:**
- `id?: string` → `id: string` (always present in DB)
- `Timestamp` → `Date`
- camelCase → snake_case (column names)

---

### Step 2: Replace Firestore Queries

**Firebase Pattern:**
```typescript
const snapshot = await getDocs(
  query(
    collection(db, `couples/${coupleId}/love-notes`),
    orderBy("sentAt", "desc"),
    limit(50)
  )
);
```

**Neon Pattern:**
```typescript
const notes = await query(
  `SELECT * FROM love_notes 
   WHERE couple_id = $1 
   ORDER BY created_at DESC 
   LIMIT $2`,
  [coupleId, 50]
);
```

---

### Step 3: Update Create/Update/Delete Operations

**Firebase Pattern:**
```typescript
await addDoc(collection(db, "love_notes", coupleId, "notes"), {
  from: fromUserId,
  text: text.trim(),
  sentAt: serverTimestamp(),
});
```

**Neon Pattern:**
```typescript
const result = await query(
  `INSERT INTO love_notes (couple_id, from_user_id, text) 
   VALUES ($1, $2, $3) 
   RETURNING id`,
  [coupleId, fromUserId, text.trim()]
);
return result[0].id;
```

---

### Step 4: Remove Real-Time Listeners

**Firebase Pattern:**
```typescript
export function listenToBoops(coupleId, callback) {
  return onSnapshot(q, (snapshot) => {
    const boops = snapshot.docs.map(doc => ({...}));
    callback(boops);
  });
}
```

**Neon Pattern (API Route-Based):**

Create `src/app/api/boops/listen/route.ts`:
```typescript
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coupleId = searchParams.get("coupleId");

  const boops = await query(
    "SELECT * FROM boops WHERE couple_id = $1 ORDER BY created_at DESC",
    [coupleId]
  );

  return Response.json(boops);
}
```

Then use with polling:
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch(`/api/boops/listen?coupleId=${coupleId}`);
    const boops = await res.json();
    setBoops(boops);
  }, 1000); // Poll every second
  
  return () => clearInterval(interval);
}, [coupleId]);
```

**Better Option: Server-Sent Events (SSE)**

Create `src/app/api/boops/stream/route.ts`:
```typescript
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coupleId = searchParams.get("coupleId");

  const stream = new ReadableStream({
    async start(controller) {
      let lastCheckTime = new Date();

      const interval = setInterval(async () => {
        try {
          const boops = await query(
            "SELECT * FROM boops WHERE couple_id = $1 AND created_at > $2 ORDER BY created_at DESC",
            [coupleId, lastCheckTime]
          );

          if (boops.length > 0) {
            lastCheckTime = new Date();
            controller.enqueue(
              `data: ${JSON.stringify(boops)}\n\n`.split("").map(char => char.charCodeAt(0))
            );
          }
        } catch (error) {
          console.error("Stream error:", error);
        }
      }, 1000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
```

Then use in component:
```typescript
useEffect(() => {
  const eventSource = new EventSource(`/api/boops/stream?coupleId=${coupleId}`);
  
  eventSource.onmessage = (event) => {
    const boops = JSON.parse(event.data);
    setBoops(boops);
  };

  return () => eventSource.close();
}, [coupleId]);
```

---

## 🛠️ How to Migrate a Module

### Example: Convert `photos.ts` to `photos-neon.ts`

1. **Copy template:**
```bash
cp src/lib/photos.ts src/lib/photos-neon.ts
```

2. **Update imports:**
```typescript
// Remove:
// import { Firestore operations }

// Add:
import { query, queryOne } from "@/lib/db";
```

3. **Update all functions** following the pattern above

4. **Create API routes** for real-time features

5. **Test** with postman or curl

---

## 📝 Function Migration Template

```typescript
/**
 * Torch — Module Name (Neon PostgreSQL)
 * Migrated from Firebase to PostgreSQL
 */

import { query, queryOne } from "@/lib/db";

// Import interfaces from types or define here
export interface YourInterface {
  id: string;
  // Snake case fields matching DB columns
}

/**
 * Function name
 */
export async function functionName(params: any): Promise<any> {
  try {
    // SQL query using parameterized queries ($1, $2, etc.)
    const result = await query(
      "SELECT * FROM table_name WHERE id = $1",
      [params]
    );

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export default {
  functionName,
  // other functions
};
```

---

## 🔌 Environment Variables Setup

**Add to `.env.local`:**

```env
# Neon Database
DATABASE_URL=postgresql://neondb_owner:npg_L0YarvoE2NQk@ep-fancy-lab-apto3wdn-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# NextAuth
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
```

---

## 📦 Install Required Dependencies

```bash
npm install @neondatabase/serverless
npm install next-auth
npm install bcrypt
npm install aws-sdk  # For S3 uploads
npm install --save-dev @types/bcrypt
```

---

## 🧪 Testing API Routes

### Test with cURL:

```bash
# Test Boop creation
curl -X POST http://localhost:3000/api/boops \
  -H "Content-Type: application/json" \
  -d '{
    "coupleId": "couple-id",
    "fromUid": "user-id",
    "fromName": "User Name",
    "toUid": "partner-id",
    "emoji": "👆"
  }'

# Test Boop retrieval
curl http://localhost:3000/api/boops?coupleId=couple-id
```

### Test with Postman:
1. Create new collection
2. Add requests for each endpoint
3. Set environment variables
4. Run tests

---

## 🚀 Remaining Work

### Module Priorities (Migrate in this order):

**High Priority (Core Features):**
1. `photos.ts` — Photo sharing
2. `chat.ts` — Messaging
3. `questions.ts` — Daily questions
4. `streaks.ts` — Streak tracking

**Medium Priority:**
5. `drawings.ts` — Drawing feature
6. `games.ts` → `coupleGames.ts` — Games
7. `widgets.ts` — Dashboard widgets
8. `relationshipStats.ts` — Statistics

**Lower Priority:**
9. `dateIdeas.ts` — Date suggestions
10. `milestones.ts` — Milestone tracking
11. `distanceTracking.ts` — Location tracking
12. `location.ts` — Location services

---

## 💡 Tips & Best Practices

### Security
- ✅ Always use parameterized queries (`$1`, `$2`, etc.)
- ✅ Validate user IDs in mutations
- ✅ Check couple membership before returning data
- ✅ Use NextAuth session for authentication

### Performance
- ✅ Add indexes for frequently queried columns (already done in schema)
- ✅ Use LIMIT for large result sets
- ✅ Cache static data (questions, date ideas)
- ✅ Use connection pooling (Neon handles this)

### Error Handling
- ✅ Catch all database errors
- ✅ Log errors to console/monitoring service
- ✅ Return meaningful error messages to client
- ✅ Handle null results gracefully

### Polling vs. Real-Time
- **Polling:** Simpler, works everywhere, less real-time
- **SSE:** Better, built-in to browsers, server can push updates
- **WebSockets:** Best for real-time, requires more infrastructure
- **Recommendation:** Start with polling, upgrade to SSE when needed

---

## 📊 Migration Progress Tracking

Keep track in this file:

```
PHASE 1 (Foundation) ✅
- [x] Database schema
- [x] Neon connection
- [x] NextAuth setup
- [x] Boops module
- [x] Love Notes module

PHASE 2 (Core Features)
- [ ] Photos module
- [ ] Chat module
- [ ] Questions module
- [ ] Streaks module

PHASE 3 (Extended Features)
- [ ] Drawings module
- [ ] Games module
- [ ] Widgets module
- [ ] Stats module

PHASE 4 (Remaining)
- [ ] Date Ideas
- [ ] Milestones
- [ ] Distance Tracking
- [ ] Location Services

PHASE 5 (Testing & Launch)
- [ ] Integration testing
- [ ] Mobile testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Deploy to Vercel
```

---

## 🔗 Useful Resources

- **Neon Docs:** https://neon.tech/docs/
- **NextAuth Docs:** https://next-auth.js.org/
- **AWS S3 Docs:** https://docs.aws.amazon.com/s3/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Next.js API Routes:** https://nextjs.org/docs/api-routes/introduction

---

**Next Step:** Start migrating `photos.ts` to `photos-neon.ts` following this guide!
