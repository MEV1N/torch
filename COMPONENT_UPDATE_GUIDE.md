# 🔄 Component Update Guide — Firebase to Neon Migration

## Overview

Components need to be updated to use the new API routes instead of direct Firebase calls.

---

## Example 1: Update BoopButton Component

### BEFORE (Firebase)
```typescript
// src/components/BoopButton.tsx
import { sendBoop, getBoopCount } from "@/lib/boop"

export default function BoopButton({ coupleId, userId, partnerId }) {
  const [boopCount, setBoopCount] = useState(0)

  useEffect(() => {
    // Direct Firebase call
    getBoopCount(coupleId).then(setBoopCount)
  }, [coupleId])

  const handleBoop = async () => {
    // Direct Firebase call
    await sendBoop(coupleId, userId, userName, partnerId, "👆")
    const count = await getBoopCount(coupleId)
    setBoopCount(count)
  }

  return (
    <button onClick={handleBoop}>
      Boop! ({boopCount})
    </button>
  )
}
```

### AFTER (API Routes)
```typescript
// src/components/BoopButton.tsx
'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"

export default function BoopButton({ coupleId, partnerId }) {
  const { data: session } = useSession()
  const [boopCount, setBoopCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch initial boop count
  useEffect(() => {
    if (!coupleId) return
    
    fetchBoopCount()
    
    // Poll for updates every 3 seconds
    const interval = setInterval(fetchBoopCount, 3000)
    return () => clearInterval(interval)
  }, [coupleId])

  const fetchBoopCount = async () => {
    try {
      const res = await fetch(`/api/boops?coupleId=${coupleId}&stats=true`)
      if (!res.ok) throw new Error("Failed to fetch boops")
      
      const data = await res.json()
      setBoopCount(data.data.stats.total)
    } catch (error) {
      console.error("Error fetching boops:", error)
    }
  }

  const handleBoop = async () => {
    if (!session?.user?.id || isLoading) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/boops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          toUid: partnerId,
          emoji: "👆",
        }),
      })

      if (!res.ok) throw new Error("Failed to send boop")

      // Refetch count
      await fetchBoopCount()
      
      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } catch (error) {
      console.error("Error sending boop:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div className="flex flex-col items-center">
      <motion.button
        onClick={handleBoop}
        disabled={isLoading}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-5xl disabled:opacity-50"
      >
        👆
      </motion.button>
      <p className="mt-2 text-white font-bold">{boopCount} boops</p>
    </motion.div>
  )
}
```

---

## Example 2: Update LoveNotesPage

### BEFORE (Firebase)
```typescript
// src/app/love-notes/page.tsx
import { listenToLoveNotes, sendLoveNote } from "@/lib/loveNotes"

export default function LoveNotesPage() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    if (!couple?.id) return
    
    // Real-time listener
    const unsubscribe = listenToLoveNotes(couple.id, setNotes)
    return () => unsubscribe()
  }, [couple?.id])

  const handleSend = async () => {
    await sendLoveNote(couple.id, userId, userName, partnerId, text, sentiment)
    setText("")
  }

  return (
    <div>
      {/* Send form */}
      {/* Notes list */}
    </div>
  )
}
```

### AFTER (API Routes)
```typescript
// src/app/love-notes/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoveNotesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const coupleId = searchParams.get("coupleId")
  const [notes, setNotes] = useState([])
  const [text, setText] = useState("")
  const [sentiment, setSentiment] = useState("romantic")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch notes periodically
  useEffect(() => {
    if (!coupleId) return

    fetchNotes()
    
    // Poll for new notes every 2 seconds
    const interval = setInterval(fetchNotes, 2000)
    return () => clearInterval(interval)
  }, [coupleId])

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/love-notes?coupleId=${coupleId}`)
      if (!res.ok) throw new Error("Failed to fetch notes")
      
      const data = await res.json()
      setNotes(data.data || [])
    } catch (error) {
      console.error("Error fetching notes:", error)
      setError("Failed to load notes")
    }
  }

  const handleSend = async () => {
    if (!text.trim() || !session?.user?.id || isLoading) return

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/love-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          toUid: partnerId, // Get from session or context
          text: text.trim(),
          sentiment,
          emoji: "💕",
        }),
      })

      if (!res.ok) throw new Error("Failed to send note")

      setText("")
      setSentiment("romantic")
      
      // Refresh notes
      await fetchNotes()
    } catch (error) {
      console.error("Error sending note:", error)
      setError("Failed to send note")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}

      {/* Send Form */}
      <div className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a love note..."
          className="w-full h-24 p-3 rounded-lg bg-white/10 border border-white/20"
          disabled={isLoading}
        />

        <div className="flex gap-2">
          {["romantic", "funny", "supportive", "spicy"].map((s) => (
            <button
              key={s}
              onClick={() => setSentiment(s)}
              className={`px-3 py-1 rounded-full text-sm ${
                sentiment === s
                  ? "bg-pink-500 text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send Note 💕"}
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No love notes yet. Send the first one!</p>
          </div>
        ) : (
          notes.map((note) => (
            <LoveNoteCard
              key={note.id}
              note={note}
              coupleId={coupleId}
              onUpdate={fetchNotes}
            />
          ))
        )}
      </div>
    </div>
  )
}
```

---

## Example 3: Custom Hook for API Calls

Create a reusable hook for common API patterns:

```typescript
// src/hooks/useApiQuery.ts
import { useState, useEffect } from "react"

export function useApiQuery<T>(
  url: string | null,
  options?: {
    interval?: number
    onError?: (error: Error) => void
  }
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    if (!url) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      const result = await res.json()
      setData(result.data || result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      options?.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    if (options?.interval) {
      const interval = setInterval(fetchData, options.interval)
      return () => clearInterval(interval)
    }
  }, [url, options?.interval])

  return { data, isLoading, error, refetch: fetchData }
}
```

Usage:

```typescript
const { data: boops, isLoading, refetch } = useApiQuery(
  coupleId ? `/api/boops?coupleId=${coupleId}` : null,
  { interval: 3000 } // Poll every 3 seconds
)
```

---

## Example 4: Create API Mutation Hook

```typescript
// src/hooks/useApiMutation.ts
import { useState } from "react"

export function useApiMutation<T = any>(url: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = async (data: any, options?: { method?: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(url, {
        method: options?.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      const result = await res.json()
      return result.data || result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { mutate, isLoading, error }
}
```

Usage:

```typescript
const { mutate: sendBoop, isLoading } = useApiMutation("/api/boops")

const handleBoop = async () => {
  try {
    await sendBoop({ coupleId, toUid: partnerId, emoji: "👆" })
    // Success - refetch data
    refetch()
  } catch (error) {
    console.error("Error:", error)
  }
}
```

---

## Summary of Changes

| Aspect | Firebase | Neon/API |
|--------|----------|----------|
| **Data fetching** | Direct function calls | HTTP requests to `/api/*` |
| **Real-time** | Firestore listeners | Polling/SSE streams |
| **Authentication** | Firebase Auth | NextAuth.js |
| **Session** | Custom context | `useSession()` from NextAuth |
| **Error handling** | Try/catch on functions | HTTP status + JSON error |
| **Data flow** | Client → Firestore | Client → API → Database |
| **Performance** | Automatic caching | Manual caching with SWR/React Query |

---

## 🎯 Best Practices for API-Based Components

1. **Use useSession() for auth:**
   ```typescript
   const { data: session } = useSession()
   // Check session?.user?.id before API calls
   ```

2. **Handle loading states:**
   ```typescript
   {isLoading && <LoadingSpinner />}
   ```

3. **Show error messages:**
   ```typescript
   {error && <ErrorAlert message={error} />}
   ```

4. **Refetch after mutations:**
   ```typescript
   await mutate(data)
   await refetch() // Sync UI with database
   ```

5. **Use proper polling intervals:**
   - Real-time features: 1-2 seconds
   - General updates: 5-10 seconds
   - Stats/dashboards: 30 seconds

6. **Implement cleanup:**
   ```typescript
   useEffect(() => {
     const interval = setInterval(...)
     return () => clearInterval(interval) // Cleanup
   }, [])
   ```

---

## 🚀 Next Steps

1. Update components one by one
2. Test with two browser windows
3. Verify real-time updates work
4. Check network tab for API calls
5. Monitor performance

Ready to start? Pick a component and follow the pattern above!
