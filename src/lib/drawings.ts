// =============================================
// Torch — Drawing & Sketch Management
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
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

export interface Drawing {
  createdByUid: string;
  createdByName: string;
  drawingUrl: string;
  drawingData?: string; // JSON of strokes for replay
  title?: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likes: number;
  reactions: { uid: string; emoji: string }[];
}

/**
 * Upload a drawing
 */
export async function uploadDrawing(
  coupleId: string,
  drawingImage: Blob,
  createdByUid: string,
  createdByName: string,
  title?: string,
  description?: string,
  drawingData?: string
): Promise<string> {
  try {
    // Upload image to storage
    const fileName = `drawing-${Date.now()}.png`;
    const storageRef = ref(
      storage,
      `couples/${coupleId}/drawings/${fileName}`
    );
    const uploadResult = await uploadBytes(storageRef, drawingImage);
    const downloadUrl = await getDownloadURL(uploadResult.ref);

    // Create drawing document
    const drawing: Drawing = {
      createdByUid,
      createdByName,
      drawingUrl: downloadUrl,
      drawingData,
      title,
      description,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      likes: 0,
      reactions: [],
    };

    const drawingsRef = collection(db, `couples/${coupleId}/drawings`);
    const docRef = await addDoc(drawingsRef, drawing);
    return docRef.id;
  } catch (error) {
    console.error("Error uploading drawing:", error);
    throw error;
  }
}

/**
 * Get all drawings for a couple
 */
export async function getCoupleDrawings(coupleId: string) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/drawings`),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching drawings:", error);
    return [];
  }
}

/**
 * Get recent drawings (for widget)
 */
export async function getRecentDrawings(coupleId: string, limitCount: number = 3) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/drawings`),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching recent drawings:", error);
    return [];
  }
}

/**
 * Get latest drawing for drawing widget
 */
export async function getLatestDrawing(coupleId: string) {
  try {
    const drawings = await getRecentDrawings(coupleId, 1);
    return drawings[0] || null;
  } catch (error) {
    console.error("Error fetching latest drawing:", error);
    return null;
  }
}

/**
 * Update drawing widget with latest
 */
export async function updateDrawingWidget(coupleId: string) {
  try {
    const latestDrawing = await getLatestDrawing(coupleId);
    if (!latestDrawing) return;

    const widgetRef = doc(db, `couples/${coupleId}/widgets/drawing-widget`);

    await updateDoc(widgetRef, {
      latestDrawingId: latestDrawing.id,
      latestDrawingUrl: latestDrawing.drawingUrl,
      createdByUid: latestDrawing.createdByUid,
      createdByName: latestDrawing.createdByName,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating drawing widget:", error);
  }
}

/**
 * Add like to drawing
 */
export async function likeDrawing(
  coupleId: string,
  drawingId: string,
  userUid: string
) {
  try {
    const drawingRef = doc(db, `couples/${coupleId}/drawings/${drawingId}`);
    const snap = await (
      await import("firebase/firestore")
    ).getDoc(drawingRef);
    const currentLikes = snap.data()?.likes || 0;

    await updateDoc(drawingRef, {
      likes: currentLikes + 1,
    });
  } catch (error) {
    console.error("Error liking drawing:", error);
  }
}

/**
 * Add emoji reaction to drawing
 */
export async function reactToDrawing(
  coupleId: string,
  drawingId: string,
  userUid: string,
  emoji: string
) {
  try {
    const drawingRef = doc(db, `couples/${coupleId}/drawings/${drawingId}`);
    const snap = await (
      await import("firebase/firestore")
    ).getDoc(drawingRef);
    const currentReactions = snap.data()?.reactions || [];

    // Remove existing reaction from this user if any
    const updatedReactions = currentReactions.filter(
      (r: any) => r.uid !== userUid
    );
    updatedReactions.push({ uid: userUid, emoji });

    await updateDoc(drawingRef, {
      reactions: updatedReactions,
    });
  } catch (error) {
    console.error("Error reacting to drawing:", error);
  }
}

/**
 * Delete drawing
 */
export async function deleteDrawing(
  coupleId: string,
  drawingId: string
): Promise<void> {
  try {
    const drawingRef = doc(db, `couples/${coupleId}/drawings/${drawingId}`);
    const snap = await (
      await import("firebase/firestore")
    ).getDoc(drawingRef);
    const drawingData = snap.data();

    // Delete from storage
    if (drawingData?.drawingUrl) {
      const fileRef = ref(storage, drawingData.drawingUrl);
      await deleteObject(fileRef);
    }

    // Delete from database
    await deleteDoc(drawingRef);
  } catch (error) {
    console.error("Error deleting drawing:", error);
    throw error;
  }
}

/**
 * Get drawing stats
 */
export async function getDrawingStats(coupleId: string) {
  try {
    const drawings = await getCoupleDrawings(coupleId);

    return {
      totalDrawings: drawings.length,
      totalLikes: drawings.reduce((sum, d) => sum + (d.likes || 0), 0),
      averageLikes:
        drawings.length > 0
          ? Math.round(
              drawings.reduce((sum, d) => sum + (d.likes || 0), 0) /
                drawings.length
            )
          : 0,
      thisWeek: drawings.filter((d) => {
        const dayDiff = Math.floor(
          (Date.now() - d.createdAt.toMillis()) / (1000 * 60 * 60 * 24)
        );
        return dayDiff <= 7;
      }).length,
      thisMonth: drawings.filter((d) => {
        const dayDiff = Math.floor(
          (Date.now() - d.createdAt.toMillis()) / (1000 * 60 * 60 * 24)
        );
        return dayDiff <= 30;
      }).length,
    };
  } catch (error) {
    console.error("Error fetching drawing stats:", error);
    return {
      totalDrawings: 0,
      totalLikes: 0,
      averageLikes: 0,
      thisWeek: 0,
      thisMonth: 0,
    };
  }
}

export default {
  uploadDrawing,
  getCoupleDrawings,
  getRecentDrawings,
  getLatestDrawing,
  updateDrawingWidget,
  likeDrawing,
  reactToDrawing,
  deleteDrawing,
  getDrawingStats,
};
