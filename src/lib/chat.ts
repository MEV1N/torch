import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy, limit, startAfter, Query, QueryConstraint } from "firebase/firestore";
import { Message } from "./types";

/**
 * Send a message in couple chat
 */
export async function sendMessage(coupleId: string, senderId: string, text: string) {
  try {
    const messageRef = await addDoc(
      collection(db, "messages", coupleId, "chat"),
      {
        senderId,
        text: text.trim(),
        timestamp: serverTimestamp(),
        read: false,
      }
    );
    return messageRef.id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(coupleId: string, messageId: string) {
  try {
    const messageRef = doc(db, "messages", coupleId, "chat", messageId);
    await updateDoc(messageRef, { read: true });
  } catch (error) {
    console.error("Error marking message as read:", error);
  }
}

/**
 * Delete a message
 */
export async function deleteMessage(coupleId: string, messageId: string) {
  try {
    await deleteDoc(doc(db, "messages", coupleId, "chat", messageId));
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

/**
 * Edit a message
 */
export async function editMessage(coupleId: string, messageId: string, newText: string) {
  try {
    const messageRef = doc(db, "messages", coupleId, "chat", messageId);
    await updateDoc(messageRef, {
      text: newText.trim(),
      edited: true,
      editedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error editing message:", error);
    throw error;
  }
}

/**
 * Get unread message count
 */
export async function getUnreadCount(coupleId: string, userId: string) {
  try {
    const q = query(
      collection(db, "messages", coupleId, "chat"),
      where("read", "==", false),
      where("senderId", "!=", userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}
