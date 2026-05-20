import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Memory } from "./types";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload memory photo and create memory document
 */
export async function uploadMemory(
  coupleId: string,
  uploadedBy: string,
  imageFile: File,
  caption: string,
  tags: string[] = []
) {
  try {
    // Upload image to Firebase Storage
    const fileId = uuidv4();
    const storageRef = ref(storage, `memories/${coupleId}/${fileId}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);

    // Create memory document
    await addDoc(collection(db, "memories", coupleId, "items"), {
      imageUrl,
      caption: caption.trim(),
      uploadedBy,
      uploadedAt: serverTimestamp(),
      tags,
    });

    return imageUrl;
  } catch (error) {
    console.error("Error uploading memory:", error);
    throw error;
  }
}

/**
 * Delete memory
 */
export async function deleteMemory(
  coupleId: string,
  memoryId: string,
  imageUrl: string
) {
  try {
    // Delete from storage
    const fileRef = ref(storage, imageUrl);
    await deleteObject(fileRef).catch(() => {
      // File might not exist, continue
    });

    // Delete document
    await deleteDoc(doc(db, "memories", coupleId, "items", memoryId));
  } catch (error) {
    console.error("Error deleting memory:", error);
    throw error;
  }
}

/**
 * Get couple memories
 */
export async function getCoupleMemories(coupleId: string): Promise<Memory[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "memories", coupleId, "items"),
        orderBy("uploadedAt", "desc")
      )
    );
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      coupleId,
      ...doc.data(),
    })) as Memory[];
  } catch (error) {
    console.error("Error getting memories:", error);
    return [];
  }
}

/**
 * Get memories by tag
 */
export async function getMemoriesByTag(
  coupleId: string,
  tag: string
): Promise<Memory[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "memories", coupleId, "items"),
        where("tags", "array-contains", tag),
        orderBy("uploadedAt", "desc")
      )
    );
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      coupleId,
      ...doc.data(),
    })) as Memory[];
  } catch (error) {
    console.error("Error getting memories by tag:", error);
    return [];
  }
}

/**
 * Search memories by caption
 */
export async function searchMemories(coupleId: string, keyword: string) {
  try {
    const memories = await getCoupleMemories(coupleId);
    return memories.filter(
      (m) =>
        m.caption.toLowerCase().includes(keyword.toLowerCase()) ||
        m.tags?.some((t) =>
          t.toLowerCase().includes(keyword.toLowerCase())
        )
    );
  } catch (error) {
    console.error("Error searching memories:", error);
    return [];
  }
}
