// =============================================
// Torch — Custom Widgets Management
// =============================================

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Widget {
  type: "photo" | "text" | "counter" | "timer" | "quote" | "drawing" | "game";
  title: string;
  content?: string;
  createdByUid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  position: number;
  isVisible: boolean;
  metadata?: {
    photoUrl?: string;
    text?: string;
    targetDate?: Timestamp;
    quote?: string;
    gameId?: string;
    description?: string;
  };
}

/**
 * Create a new widget
 */
export async function createWidget(
  coupleId: string,
  widget: Widget
): Promise<string> {
  try {
    const widgetsRef = collection(db, `couples/${coupleId}/widgets`);

    // Get highest position
    const q = query(widgetsRef, orderBy("position", "desc"));
    const snapshot = await getDocs(q);
    const nextPosition =
      (snapshot.docs[0]?.data()?.position || 0) + 1;

    const widgetData = {
      ...widget,
      position: nextPosition,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(widgetsRef, widgetData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating widget:", error);
    throw error;
  }
}

/**
 * Get all widgets for a couple
 */
export async function getCoupleWidgets(coupleId: string) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/widgets`),
      where("isVisible", "==", true),
      orderBy("position", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching widgets:", error);
    return [];
  }
}

/**
 * Get widget by ID
 */
export async function getWidget(coupleId: string, widgetId: string) {
  try {
    const widgetRef = doc(db, `couples/${coupleId}/widgets/${widgetId}`);
    const snap = await (
      await import("firebase/firestore")
    ).getDoc(widgetRef);

    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error("Error fetching widget:", error);
    return null;
  }
}

/**
 * Update widget
 */
export async function updateWidget(
  coupleId: string,
  widgetId: string,
  updates: Partial<Widget>
) {
  try {
    const widgetRef = doc(db, `couples/${coupleId}/widgets/${widgetId}`);
    await updateDoc(widgetRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating widget:", error);
    throw error;
  }
}

/**
 * Delete widget
 */
export async function deleteWidget(coupleId: string, widgetId: string) {
  try {
    const widgetRef = doc(db, `couples/${coupleId}/widgets/${widgetId}`);
    await deleteDoc(widgetRef);
  } catch (error) {
    console.error("Error deleting widget:", error);
    throw error;
  }
}

/**
 * Reorder widgets
 */
export async function reorderWidgets(
  coupleId: string,
  widgetIds: string[]
) {
  try {
    for (let i = 0; i < widgetIds.length; i++) {
      const widgetRef = doc(db, `couples/${coupleId}/widgets/${widgetIds[i]}`);
      await updateDoc(widgetRef, { position: i });
    }
  } catch (error) {
    console.error("Error reordering widgets:", error);
    throw error;
  }
}

/**
 * Create counter widget (e.g., days together)
 */
export async function createCounterWidget(
  coupleId: string,
  createdByUid: string,
  title: string,
  targetDate: Timestamp
): Promise<string> {
  const widget: Widget = {
    type: "counter",
    title,
    createdByUid,
    position: 0,
    isVisible: true,
    metadata: {
      targetDate,
      description: `Counting to: ${title}`,
    },
  };

  return createWidget(coupleId, widget);
}

/**
 * Create text widget
 */
export async function createTextWidget(
  coupleId: string,
  createdByUid: string,
  title: string,
  text: string
): Promise<string> {
  const widget: Widget = {
    type: "text",
    title,
    content: text,
    createdByUid,
    position: 0,
    isVisible: true,
    metadata: {
      text,
    },
  };

  return createWidget(coupleId, widget);
}

/**
 * Create timer widget
 */
export async function createTimerWidget(
  coupleId: string,
  createdByUid: string,
  title: string,
  targetDate: Timestamp
): Promise<string> {
  const widget: Widget = {
    type: "timer",
    title,
    createdByUid,
    position: 0,
    isVisible: true,
    metadata: {
      targetDate,
      description: `Time until: ${title}`,
    },
  };

  return createWidget(coupleId, widget);
}

/**
 * Create photo widget
 */
export async function createPhotoWidget(
  coupleId: string,
  createdByUid: string,
  title: string,
  photoUrl: string
): Promise<string> {
  const widget: Widget = {
    type: "photo",
    title,
    createdByUid,
    position: 0,
    isVisible: true,
    metadata: {
      photoUrl,
    },
  };

  return createWidget(coupleId, widget);
}

/**
 * Create drawing widget
 */
export async function createDrawingWidget(
  coupleId: string,
  createdByUid: string
): Promise<string> {
  const widget: Widget = {
    type: "drawing",
    title: "Latest Drawing",
    createdByUid,
    position: 0,
    isVisible: true,
  };

  return createWidget(coupleId, widget);
}

/**
 * Create game widget
 */
export async function createGameWidget(
  coupleId: string,
  createdByUid: string,
  gameId: string
): Promise<string> {
  const widget: Widget = {
    type: "game",
    title: "Play a Game",
    createdByUid,
    position: 0,
    isVisible: true,
    metadata: {
      gameId,
    },
  };

  return createWidget(coupleId, widget);
}

/**
 * Create quote widget
 */
export async function createQuoteWidget(
  coupleId: string,
  createdByUid: string,
  quote: string
): Promise<string> {
  const widget: Widget = {
    type: "quote",
    title: "Our Quote",
    content: quote,
    createdByUid,
    position: 0,
    isVisible: true,
    metadata: {
      quote,
    },
  };

  return createWidget(coupleId, widget);
}

/**
 * Get dashboard widgets (ordered)
 */
export async function getDashboardWidgets(coupleId: string) {
  return getCoupleWidgets(coupleId);
}

/**
 * Toggle widget visibility
 */
export async function toggleWidgetVisibility(
  coupleId: string,
  widgetId: string
) {
  try {
    const widget = await getWidget(coupleId, widgetId);
    if (widget) {
      await updateWidget(coupleId, widgetId, {
        isVisible: !widget.isVisible,
      });
    }
  } catch (error) {
    console.error("Error toggling widget visibility:", error);
  }
}

export default {
  createWidget,
  getCoupleWidgets,
  getWidget,
  updateWidget,
  deleteWidget,
  reorderWidgets,
  createCounterWidget,
  createTextWidget,
  createTimerWidget,
  createPhotoWidget,
  createDrawingWidget,
  createGameWidget,
  createQuoteWidget,
  getDashboardWidgets,
  toggleWidgetVisibility,
};
