/**
 * Torch — Love Notes (Neon PostgreSQL)
 * Migrated from Firebase to PostgreSQL
 */

import { query, queryOne } from "@/lib/db";

export interface LoveNote {
  id: string;
  couple_id: string;
  from_user_id: string;
  from_name: string;
  to_user_id: string;
  text: string;
  sentiment: "romantic" | "funny" | "supportive" | "spicy";
  emoji: string;
  is_read: boolean;
  read_at: Date | null;
  is_pinned: boolean;
  created_at: Date;
}

export interface LoveNoteReaction {
  id: string;
  note_id: string;
  user_id: string;
  emoji: string;
  created_at: Date;
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
    const result = await query<{ id: string }>(
      `INSERT INTO love_notes (couple_id, from_user_id, from_name, to_user_id, text, sentiment, emoji)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [coupleId, fromUid, fromName, toUid, text, sentiment, emoji]
    );

    return result[0].id;
  } catch (error) {
    console.error("Error sending love note:", error);
    throw error;
  }
}

/**
 * Get love notes for a couple
 */
export async function getLoveNotes(coupleId: string, limit: number = 50): Promise<LoveNote[]> {
  try {
    const notes = await query<LoveNote>(
      `SELECT id, couple_id, from_user_id, from_name, to_user_id, text, sentiment, emoji, is_read, read_at, is_pinned, created_at
       FROM love_notes
       WHERE couple_id = $1
       ORDER BY is_pinned DESC, created_at DESC
       LIMIT $2`,
      [coupleId, limit]
    );

    return notes;
  } catch (error) {
    console.error("Error fetching love notes:", error);
    return [];
  }
}

/**
 * Get unread notes
 */
export async function getUnreadNotes(coupleId: string, userUid: string): Promise<LoveNote[]> {
  try {
    const notes = await query<LoveNote>(
      `SELECT id, couple_id, from_user_id, from_name, to_user_id, text, sentiment, emoji, is_read, read_at, is_pinned, created_at
       FROM love_notes
       WHERE couple_id = $1 AND to_user_id = $2 AND is_read = FALSE
       ORDER BY created_at DESC`,
      [coupleId, userUid]
    );

    return notes;
  } catch (error) {
    console.error("Error fetching unread notes:", error);
    return [];
  }
}

/**
 * Get unread notes count
 */
export async function getUnreadNotesCount(coupleId: string, userId: string): Promise<number> {
  try {
    const result = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM love_notes 
       WHERE couple_id = $1 AND to_user_id = $2 AND is_read = FALSE`,
      [coupleId, userId]
    );

    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error getting unread notes count:", error);
    return 0;
  }
}

/**
 * Mark note as read
 */
export async function markNoteAsRead(coupleId: string, noteId: string): Promise<void> {
  try {
    await query(
      `UPDATE love_notes SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE id = $1 AND couple_id = $2`,
      [noteId, coupleId]
    );
  } catch (error) {
    console.error("Error marking note as read:", error);
  }
}

/**
 * Pin a love note
 */
export async function pinLoveNote(coupleId: string, noteId: string): Promise<void> {
  try {
    await query(
      `UPDATE love_notes SET is_pinned = TRUE WHERE id = $1 AND couple_id = $2`,
      [noteId, coupleId]
    );
  } catch (error) {
    console.error("Error pinning note:", error);
  }
}

/**
 * Unpin a love note
 */
export async function unpinLoveNote(coupleId: string, noteId: string): Promise<void> {
  try {
    await query(
      `UPDATE love_notes SET is_pinned = FALSE WHERE id = $1 AND couple_id = $2`,
      [noteId, coupleId]
    );
  } catch (error) {
    console.error("Error unpinning note:", error);
  }
}

/**
 * Get pinned notes
 */
export async function getPinnedNotes(coupleId: string): Promise<LoveNote[]> {
  try {
    const notes = await query<LoveNote>(
      `SELECT id, couple_id, from_user_id, from_name, to_user_id, text, sentiment, emoji, is_read, read_at, is_pinned, created_at
       FROM love_notes
       WHERE couple_id = $1 AND is_pinned = TRUE
       ORDER BY created_at DESC`,
      [coupleId]
    );

    return notes;
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
    // Remove existing reaction
    await query(
      `DELETE FROM love_note_reactions WHERE note_id = $1 AND user_id = $2`,
      [noteId, userUid]
    );

    // Add new reaction
    await query(
      `INSERT INTO love_note_reactions (note_id, user_id, emoji) VALUES ($1, $2, $3)`,
      [noteId, userUid, emoji]
    );
  } catch (error) {
    console.error("Error reacting to note:", error);
  }
}

/**
 * Delete a love note
 */
export async function deleteLoveNote(coupleId: string, noteId: string): Promise<void> {
  try {
    // Delete reactions first (due to foreign key)
    await query(`DELETE FROM love_note_reactions WHERE note_id = $1`, [noteId]);

    // Delete note
    await query(`DELETE FROM love_notes WHERE id = $1 AND couple_id = $2`, [noteId, coupleId]);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
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
      const noteDate = new Date(n.created_at);
      noteDate.setHours(0, 0, 0, 0);
      return noteDate.getTime() === today.getTime();
    }).length;

    return {
      totalNotes: notes.length,
      todayNotes,
      sentiments,
      averagePerDay: (notes.length / 30).toFixed(1),
      pinnedNotes: notes.filter((n) => n.is_pinned).length,
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
    ],
    spicy: [
      {
        text: "Can't wait to see you tonight 👀",
        emoji: "👀",
      },
      { text: "You drive me crazy 🔥", emoji: "🔥" },
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
  getLoveNoteStats,
  getRandomLoveNoteTemplate,
};
