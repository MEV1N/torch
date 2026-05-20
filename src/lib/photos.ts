// =============================================
// Torch — Photo Sending System
// =============================================

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

export interface PhotoMessage {
  id?: string;
  senderUid: string;
  senderName: string;
  photoUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  sentAt: Timestamp;
  viewedAt?: Timestamp;
  isViewed: boolean;
  expiresAt?: Timestamp; // For disappearing photos
  isDisappearing: boolean;
  reactions: { uid: string; emoji: string }[];
}

/**
 * Send a photo to partner
 */
export async function sendPhoto(
  coupleId: string,
  senderUid: string,
  senderName: string,
  photoFile: Blob,
  caption?: string,
  isDisappearing: boolean = false
): Promise<string> {
  try {
    // Upload to Firebase Storage
    const fileName = `photo-${Date.now()}.jpg`;
    const storageRef = ref(storage, `couples/${coupleId}/photos/${fileName}`);

    const uploadResult = await uploadBytes(storageRef, photoFile);
    const photoUrl = await getDownloadURL(uploadResult.ref);

    // Create message in Firestore
    const photoMessage: PhotoMessage = {
      senderUid,
      senderName,
      photoUrl,
      caption,
      sentAt: Timestamp.now(),
      isViewed: false,
      isDisappearing,
      expiresAt: isDisappearing
        ? Timestamp.fromDate(
            new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          )
        : undefined,
      reactions: [],
    };

    const messagesRef = collection(db, `couples/${coupleId}/photo-messages`);
    const docRef = await addDoc(messagesRef, photoMessage);

    return docRef.id;
  } catch (error) {
    console.error("Error sending photo:", error);
    throw error;
  }
}

/**
 * Get all photos from couple
 */
export async function getCouplePhotos(
  coupleId: string,
  limitCount: number = 50
) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/photo-messages`),
      orderBy("sentAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (PhotoMessage & { id: string })[];
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
}

/**
 * Listen to new photos in real-time
 */
export function listenToPhotos(
  coupleId: string,
  callback: (photos: (PhotoMessage & { id: string })[]) => void
) {
  const q = query(
    collection(db, `couples/${coupleId}/photo-messages`),
    orderBy("sentAt", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const photos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (PhotoMessage & { id: string })[];

    callback(photos);
  });
}

/**
 * Mark photo as viewed
 */
export async function markPhotoAsViewed(
  coupleId: string,
  photoId: string
): Promise<void> {
  try {
    const photoRef = doc(db, `couples/${coupleId}/photo-messages/${photoId}`);
    await updateDoc(photoRef, {
      isViewed: true,
      viewedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error marking photo as viewed:", error);
  }
}

/**
 * Get unviewed photo count
 */
export async function getUnviewedPhotoCount(
  coupleId: string,
  userUid: string
): Promise<number> {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/photo-messages`),
      where("isViewed", "==", false),
      where("senderUid", "!=", userUid)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting unviewed count:", error);
    return 0;
  }
}

/**
 * Add reaction to photo
 */
export async function reactToPhoto(
  coupleId: string,
  photoId: string,
  userUid: string,
  emoji: string
): Promise<void> {
  try {
    const photoRef = doc(db, `couples/${coupleId}/photo-messages/${photoId}`);
    const snap = await (
      await import("firebase/firestore")
    ).getDoc(photoRef);
    const reactions = snap.data()?.reactions || [];

    // Remove existing reaction from user
    const updatedReactions = reactions.filter((r: any) => r.uid !== userUid);
    updatedReactions.push({ uid: userUid, emoji });

    await updateDoc(photoRef, {
      reactions: updatedReactions,
    });
  } catch (error) {
    console.error("Error reacting to photo:", error);
  }
}

/**
 * Save photo as memory
 */
export async function savePhotoAsMemory(
  coupleId: string,
  photoId: string,
  caption?: string
): Promise<void> {
  try {
    const photoRef = doc(db, `couples/${coupleId}/photo-messages/${photoId}`);
    const snap = await (
      await import("firebase/firestore")
    ).getDoc(photoRef);
    const photoData = snap.data();

    // Save to memories collection
    const memoriesRef = collection(db, `couples/${coupleId}/memories`);
    await addDoc(memoriesRef, {
      ...photoData,
      savedAt: Timestamp.now(),
      caption: caption || photoData.caption,
    });
  } catch (error) {
    console.error("Error saving photo as memory:", error);
  }
}

/**
 * Delete a photo
 */
export async function deletePhoto(coupleId: string, photoId: string) {
  try {
    const photoRef = doc(db, `couples/${coupleId}/photo-messages/${photoId}`);
    const snap = await (
      await import("firebase/firestore")
    ).getDoc(photoRef);
    const photoData = snap.data();

    // Delete from storage
    if (photoData?.photoUrl) {
      const fileRef = ref(storage, photoData.photoUrl);
      await deleteObject(fileRef);
    }

    // Delete document
    await (await import("firebase/firestore")).deleteDoc(photoRef);
  } catch (error) {
    console.error("Error deleting photo:", error);
  }
}

/**
 * Clean up expired disappearing photos (run periodically)
 */
export async function cleanupExpiredPhotos(coupleId: string) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/photo-messages`),
      where("isDisappearing", "==", true)
    );

    const snapshot = await getDocs(q);
    const now = Timestamp.now();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.expiresAt && data.expiresAt < now) {
        await deletePhoto(coupleId, doc.id);
      }
    }
  } catch (error) {
    console.error("Error cleaning up expired photos:", error);
  }
}

/**
 * Get photo statistics
 */
export async function getPhotoStats(coupleId: string) {
  try {
    const photos = await getCouplePhotos(coupleId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeek = photos.filter((p) => {
      const dayDiff = Math.floor(
        (Date.now() - p.sentAt.toMillis()) / (1000 * 60 * 60 * 24)
      );
      return dayDiff <= 7;
    }).length;

    const todayPhotos = photos.filter((p) => {
      const photoDate = p.sentAt.toDate();
      photoDate.setHours(0, 0, 0, 0);
      return photoDate.getTime() === today.getTime();
    }).length;

    return {
      totalPhotos: photos.length,
      thisWeek,
      today: todayPhotos,
      unviewed: photos.filter((p) => !p.isViewed).length,
      averagePerDay: (photos.length / 30).toFixed(1),
    };
  } catch (error) {
    console.error("Error getting photo stats:", error);
    return {
      totalPhotos: 0,
      thisWeek: 0,
      today: 0,
      unviewed: 0,
      averagePerDay: "0",
    };
  }
}

export default {
  sendPhoto,
  getCouplePhotos,
  listenToPhotos,
  markPhotoAsViewed,
  getUnviewedPhotoCount,
  reactToPhoto,
  savePhotoAsMemory,
  deletePhoto,
  cleanupExpiredPhotos,
  getPhotoStats,
};
