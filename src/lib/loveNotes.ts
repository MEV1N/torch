// =============================================
// Torch — Love Notes System (ENHANCED)
// =============================================

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
  orderBy,
  limit,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface LoveNote {
  id?: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  text: string;
  sentiment?: "romantic" | "funny" | "supportive" | "spicy";
  emoji?: string;
  sentAt: Timestamp;
  readAt?: Timestamp;
  isRead: boolean;
  isPinned: boolean;
  reactions: { uid: string; emoji: string }[];
}

/**
 * Send a love note
 */
export async function sendLoveNote(
  coupleId: string,
  fromUid: string,
  fromName: string,
  toUid: string,
  text: string,
  sentiment: "romantic" | "funny" | "supportive" | "spicy" = "romantic",
  emoji: string = "💕"
): Promise<string> {
  try {
    const note: LoveNote = {
      fromUid,
      fromName,
      toUid,
      text,
      sentiment,
      emoji,
      sentAt: Timestamp.now(),
      isRead: false,
      isPinned: false,
      reactions: [],
    };

    const notesRef = collection(db, `couples/${coupleId}/love-notes`);
    const docRef = await addDoc(notesRef, note);

    // Send notification
    await sendLoveNoteNotification(coupleId, toUid, fromName);

    return docRef.id;
  } catch (error) {
    console.error("Error sending love note:", error);
    throw error;
  }
}

/**
 * Get love notes for a couple
 */
export async function getLoveNotes(coupleId: string, limitCount: number = 50) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/love-notes`),
      orderBy("sentAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (LoveNote & { id: string })[];
  } catch (error) {
    console.error("Error fetching love notes:", error);
    return [];
  }
}

/**
 * Get unread notes
 */
export async function getUnreadNotes(coupleId: string, userUid: string) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/love-notes`),
      where("toUid", "==", userUid),
      where("isRead", "==", false)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (LoveNote & { id: string })[];
  } catch (error) {
    console.error("Error fetching unread notes:", error);
    return [];
  }
}

/**
 * Get unread notes count
 */
export async function getUnreadNotesCount(
  coupleId: string,
  userId: string
): Promise<number> {
  try {
    const unread = await getUnreadNotes(coupleId, userId);
    return unread.length;
  } catch (error) {
    console.error("Error getting unread notes count:", error);
    return 0;
  }
}

/**
 * Mark note as read
 */
export async function markNoteAsRead(
  coupleId: string,
  noteId: string
): Promise<void> {
  try {
    const noteRef = doc(db, `couples/${coupleId}/love-notes/${noteId}`);
    await updateDoc(noteRef, {
      isRead: true,
      readAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error marking note as read:", error);
  }
}

/**
 * Pin a love note
 */
export async function pinLoveNote(
  coupleId: string,
  noteId: string
): Promise<void> {
  try {
    const noteRef = doc(db, `couples/${coupleId}/love-notes/${noteId}`);
    await updateDoc(noteRef, {
      isPinned: true,
    });
  } catch (error) {
    console.error("Error pinning note:", error);
  }
}

/**
 * Unpin a love note
 */
export async function unpinLoveNote(
  coupleId: string,
  noteId: string
): Promise<void> {
  try {
    const noteRef = doc(db, `couples/${coupleId}/love-notes/${noteId}`);
    await updateDoc(noteRef, {
      isPinned: false,
    });
  } catch (error) {
    console.error("Error unpinning note:", error);
  }
}

/**
 * Get pinned notes
 */
export async function getPinnedNotes(coupleId: string) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/love-notes`),
      where("isPinned", "==", true),
      orderBy("sentAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (LoveNote & { id: string })[];
  } catch (error) {
    console.error("Error fetching pinned notes:", error);
    return [];
  }
}

/**
 * Add reaction to love note
 */
export async function reactToLoveNote(
  coupleId: string,
  noteId: string,
  userUid: string,
  emoji: string
): Promise<void> {
  try {
    const noteRef = doc(db, `couples/${coupleId}/love-notes/${noteId}`);
    const snap = await getDoc(noteRef);
    const reactions = snap.data()?.reactions || [];

    // Remove existing reaction from user
    const updatedReactions = reactions.filter((r: any) => r.uid !== userUid);
    updatedReactions.push({ uid: userUid, emoji });

    await updateDoc(noteRef, {
      reactions: updatedReactions,
    });
  } catch (error) {
    console.error("Error reacting to note:", error);
  }
}

/**
 * Delete a love note
 */
export async function deleteLoveNote(
  coupleId: string,
  noteId: string
): Promise<void> {
  try {
    const noteRef = doc(db, `couples/${coupleId}/love-notes/${noteId}`);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

/**
 * Listen to love notes in real-time
 */
export function listenToLoveNotes(
  coupleId: string,
  callback: (notes: (LoveNote & { id: string })[]) => void
) {
  const q = query(
    collection(db, `couples/${coupleId}/love-notes`),
    orderBy("sentAt", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (LoveNote & { id: string })[];

    callback(notes);
  });
}

/**
 * Get love note statistics
 */
export async function getLoveNoteStats(coupleId: string) {
  try {
    const notes = await getLoveNotes(coupleId, 100);

    const sentiments: { [key: string]: number } = {
      romantic: 0,
      funny: 0,
      supportive: 0,
      spicy: 0,
    };

    notes.forEach((note) => {
      if (note.sentiment && sentiments[note.sentiment] !== undefined) {
        sentiments[note.sentiment]++;
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayNotes = notes.filter((n) => {
      const noteDate = n.sentAt.toDate();
      noteDate.setHours(0, 0, 0, 0);
      return noteDate.getTime() === today.getTime();
    }).length;

    return {
      totalNotes: notes.length,
      todayNotes,
      sentiments,
      averagePerDay: (notes.length / 30).toFixed(1),
      pinnedNotes: notes.filter((n) => n.isPinned).length,
    };
  } catch (error) {
    console.error("Error getting love note stats:", error);
    return {
      totalNotes: 0,
      todayNotes: 0,
      sentiments: { romantic: 0, funny: 0, supportive: 0, spicy: 0 },
      averagePerDay: "0",
      pinnedNotes: 0,
    };
  }
}

/**
 * Send love note notification
 */
async function sendLoveNoteNotification(
  coupleId: string,
  toUid: string,
  fromName: string
) {
  try {
    const notificationsRef = collection(
      db,
      `couples/${coupleId}/notifications`
    );
    await addDoc(notificationsRef, {
      type: "love-note",
      recipientUid: toUid,
      title: `${fromName} sent you a love note 💕`,
      body: "Tap to read",
      createdAt: Timestamp.now(),
      isRead: false,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

/**
 * Get random love note template
 */
export function getRandomLoveNoteTemplate(sentiment: string = "romantic"): {
  text: string;
  emoji: string;
} {
  const templates = {
    romantic: [
      {
        text: "Every moment with you feels like a dream come true 💭",
        emoji: "💕",
      },
      { text: "You make my heart skip a beat 💖", emoji: "💕" },
      { text: "I fall in love with you more each day 🌹", emoji: "🌹" },
      {
        text: "Being with you is my favorite place to be 🏠",
        emoji: "🏠",
      },
    ],
    funny: [
      {
        text: "You're the weirdest person I know... and I love you for it 😄",
        emoji: "😄",
      },
      {
        text: "Thanks for putting up with my nonsense 🤪",
        emoji: "🤪",
      },
      {
        text: "I'm crazy about you (and also just crazy) 🎭",
        emoji: "🎭",
      },
    ],
    supportive: [
      {
        text: "I believe in you and everything you want to achieve 💪",
        emoji: "💪",
      },
      {
        text: "You inspire me to be better every single day 🌟",
        emoji: "🌟",
      },
      {
        text: "I'm so proud of everything you've accomplished 🏆",
        emoji: "🏆",
      },
    ],
    spicy: [
      {
        text: "Can't wait to see you tonight 👀",
        emoji: "👀",
      },
      { text: "You drive me crazy 🔥", emoji: "🔥" },
      {
        text: "Counting down the hours until I can hold you 😘",
        emoji: "😘",
      },
    ],
  };

  const list =
    templates[sentiment as keyof typeof templates] || templates.romantic;
  return list[Math.floor(Math.random() * list.length)];
}

export default {
  sendLoveNote,
  getLoveNotes,
  getUnreadNotes,
  getUnreadNotesCount,
  markNoteAsRead,
  pinLoveNote,
  unpinLoveNote,
  getPinnedNotes,
  reactToLoveNote,
  deleteLoveNote,
  listenToLoveNotes,
  getLoveNoteStats,
  getRandomLoveNoteTemplate,
}
