/**
 * Chat System (Neon)
 * File: src/lib/chat-neon.ts
 */

import { query } from '@/lib/db'

export interface Message {
  id: string
  coupleId: string
  senderId: string
  text: string
  createdAt: Date
  updatedAt?: Date
  isRead: boolean
  isEdited: boolean
  editedAt?: Date
}

/**
 * Send a message
 */
export async function sendMessage(
  coupleId: string,
  senderId: string,
  text: string
): Promise<string> {
  try {
    const result = await query(
      `INSERT INTO messages (couple_id, sender_id, text, is_read)
       VALUES ($1, $2, $3, FALSE)
       RETURNING id`,
      [coupleId, senderId, text.trim()]
    )

    return result[0].id
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

/**
 * Get messages for a couple
 */
export async function getMessages(
  coupleId: string,
  limitCount: number = 100
): Promise<Message[]> {
  try {
    return await query(
      `SELECT id, couple_id as "coupleId", sender_id as "senderId", text,
              created_at as "createdAt", updated_at as "updatedAt",
              is_read as "isRead", is_edited as "isEdited", edited_at as "editedAt"
       FROM messages
       WHERE couple_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [coupleId, limitCount]
    )
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string): Promise<void> {
  try {
    await query(
      `UPDATE messages SET is_read = TRUE WHERE id = $1`,
      [messageId]
    )
  } catch (error) {
    console.error('Error marking message as read:', error)
    throw error
  }
}

/**
 * Mark all messages as read for a couple
 */
export async function markAllMessagesAsRead(coupleId: string): Promise<void> {
  try {
    await query(
      `UPDATE messages SET is_read = TRUE WHERE couple_id = $1 AND is_read = FALSE`,
      [coupleId]
    )
  } catch (error) {
    console.error('Error marking all messages as read:', error)
    throw error
  }
}

/**
 * Edit a message
 */
export async function editMessage(messageId: string, newText: string): Promise<void> {
  try {
    await query(
      `UPDATE messages SET text = $1, is_edited = TRUE, updated_at = NOW() WHERE id = $2`,
      [newText.trim(), messageId]
    )
  } catch (error) {
    console.error('Error editing message:', error)
    throw error
  }
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId: string): Promise<void> {
  try {
    await query(`DELETE FROM messages WHERE id = $1`, [messageId])
  } catch (error) {
    console.error('Error deleting message:', error)
    throw error
  }
}

/**
 * Get unread message count
 */
export async function getUnreadCount(coupleId: string, userId: string): Promise<number> {
  try {
    const result = await query(
      `SELECT COUNT(*) as count FROM messages
       WHERE couple_id = $1 AND sender_id != $2 AND is_read = FALSE`,
      [coupleId, userId]
    )

    return result[0].count
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}

/**
 * Search messages
 */
export async function searchMessages(coupleId: string, searchTerm: string): Promise<Message[]> {
  try {
    return await query(
      `SELECT id, couple_id as "coupleId", sender_id as "senderId", text,
              created_at as "createdAt", updated_at as "updatedAt",
              is_read as "isRead", is_edited as "isEdited", edited_at as "editedAt"
       FROM messages
       WHERE couple_id = $1 AND text ILIKE $2
       ORDER BY created_at DESC
       LIMIT 50`,
      [coupleId, `%${searchTerm}%`]
    )
  } catch (error) {
    console.error('Error searching messages:', error)
    return []
  }
}

/**
 * Get chat statistics
 */
export async function getChatStats(coupleId: string) {
  try {
    const result = await query(
      `SELECT
        COUNT(*) as total_messages,
        COUNT(CASE WHEN is_read = FALSE THEN 1 END) as unread_messages,
        COUNT(DISTINCT sender_id) as unique_senders,
        MAX(created_at) as last_message_at
       FROM messages
       WHERE couple_id = $1`,
      [coupleId]
    )

    return {
      totalMessages: result[0].total_messages,
      unreadMessages: result[0].unread_messages,
      uniqueSenders: result[0].unique_senders,
      lastMessageAt: result[0].last_message_at,
    }
  } catch (error) {
    console.error('Error getting chat stats:', error)
    return null
  }
}
