import { db } from "./firebase";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { ThumbKiss } from "./types";

/**
 * Listen to thumb kiss state
 */
export function listenToThumbKiss(
  coupleId: string,
  callback: (data: ThumbKiss) => void
) {
  const unsubscribe = onSnapshot(doc(db, "thumb_kiss", coupleId), (snap) => {
    if (snap.exists()) {
      callback(snap.data() as ThumbKiss);
    }
  });

  return unsubscribe;
}

/**
 * Update user's thumb state
 */
export async function updateThumbState(
  coupleId: string,
  userId: string,
  isActive: boolean
) {
  try {
    const kissRef = doc(db, "thumb_kiss", coupleId);
    const field = userId.slice(0, 5) === "user1" ? "user1Active" : "user2Active";
    await updateDoc(kissRef, {
      [field]: isActive,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Error updating thumb state:", error);
  }
}

/**
 * Initialize thumb kiss document
 */
export async function initializeThumbKiss(coupleId: string) {
  try {
    const kissRef = doc(db, "thumb_kiss", coupleId);
    await setDoc(
      kissRef,
      {
        coupleId,
        user1Active: false,
        user2Active: false,
        lastUpdated: new Date(),
        count: 0,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error initializing thumb kiss:", error);
  }
}
