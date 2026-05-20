// =============================================
// Torch — Location & Distance Management
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
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Location {
  uid: string;
  userName: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  updatedAt: Timestamp;
  address?: string;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Update user's current location
 */
export async function updateUserLocation(
  coupleId: string,
  userUid: string,
  userName: string,
  latitude: number,
  longitude: number,
  accuracy: number = 10,
  address?: string
): Promise<void> {
  try {
    const locationRef = doc(db, `couples/${coupleId}/locations/${userUid}`);

    const locationData: Location = {
      uid: userUid,
      userName,
      latitude,
      longitude,
      accuracy,
      updatedAt: Timestamp.now(),
      address,
    };

    await setDoc(locationRef, locationData, { merge: true });
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
}

/**
 * Get user's last known location
 */
export async function getUserLocation(
  coupleId: string,
  userUid: string
): Promise<Location | null> {
  try {
    const locationRef = doc(db, `couples/${coupleId}/locations/${userUid}`);
    const snap = await (
      await import("firebase/firestore")
    ).getDoc(locationRef);

    if (!snap.exists()) return null;
    return snap.data() as Location;
  } catch (error) {
    console.error("Error fetching user location:", error);
    return null;
  }
}

/**
 * Calculate distance between two users in a couple
 */
export async function calculateCoupleDistance(
  coupleId: string,
  user1Uid: string,
  user2Uid: string
): Promise<number | null> {
  try {
    const location1 = await getUserLocation(coupleId, user1Uid);
    const location2 = await getUserLocation(coupleId, user2Uid);

    if (!location1 || !location2) {
      return null; // One user hasn't shared location
    }

    const distance = calculateDistance(
      location1.latitude,
      location1.longitude,
      location2.latitude,
      location2.longitude
    );

    return distance;
  } catch (error) {
    console.error("Error calculating distance:", error);
    return null;
  }
}

/**
 * Update couple's distance in their stats
 */
export async function updateCoupleDistance(
  coupleId: string,
  user1Uid: string,
  user2Uid: string
): Promise<void> {
  try {
    const distance = await calculateCoupleDistance(coupleId, user1Uid, user2Uid);

    if (distance !== null) {
      const coupleRef = doc(db, `couples/${coupleId}`);
      await updateDoc(coupleRef, {
        distance,
        distanceUpdatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error updating couple distance:", error);
  }
}

/**
 * Get location history for a user
 */
export async function getLocationHistory(
  coupleId: string,
  userUid: string,
  limitDays: number = 30
): Promise<Location[]> {
  try {
    const locationsRef = collection(db, `couples/${coupleId}/locations`);
    const q = query(where("uid", "==", userUid));

    const snapshot = await getDocs(q);
    const locations = snapshot.docs.map((doc) => doc.data() as Location);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - limitDays);

    return locations.filter((loc) =>
      loc.updatedAt.toDate() > cutoffDate
    );
  } catch (error) {
    console.error("Error fetching location history:", error);
    return [];
  }
}

/**
 * Check if users are in same city (simplified)
 */
export async function areUsersInSameCity(
  coupleId: string,
  user1Uid: string,
  user2Uid: string
): Promise<boolean> {
  try {
    const distance = await calculateCoupleDistance(coupleId, user1Uid, user2Uid);
    return distance !== null && distance < 50; // Within 50km considered "same city"
  } catch (error) {
    console.error("Error checking if in same city:", error);
    return false;
  }
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} meters away`;
  } else if (distanceKm < 100) {
    return `${distanceKm} km away`;
  } else {
    return `${Math.round(distanceKm / 1000)} hours drive away`;
  }
}

/**
 * Get distance status message
 */
export function getDistanceStatus(distanceKm: number | null): string {
  if (distanceKm === null) {
    return "Location not shared";
  }

  if (distanceKm < 0.5) {
    return "💕 Together";
  } else if (distanceKm < 10) {
    return "🏘️ In same city";
  } else if (distanceKm < 100) {
    return "🛣️ Close distance";
  } else if (distanceKm < 500) {
    return "✈️ Long distance";
  } else {
    return "🌍 Very far apart";
  }
}

/**
 * Enable location sharing for user
 */
export async function enableLocationSharing(
  coupleId: string,
  userUid: string
): Promise<void> {
  try {
    const coupleRef = doc(db, `couples/${coupleId}`);
    await updateDoc(coupleRef, {
      "settings.allowLocationSharing": true,
    });
  } catch (error) {
    console.error("Error enabling location sharing:", error);
    throw error;
  }
}

/**
 * Disable location sharing for user
 */
export async function disableLocationSharing(
  coupleId: string
): Promise<void> {
  try {
    const coupleRef = doc(db, `couples/${coupleId}`);
    await updateDoc(coupleRef, {
      "settings.allowLocationSharing": false,
    });
  } catch (error) {
    console.error("Error disabling location sharing:", error);
    throw error;
  }
}

/**
 * Get location sharing status
 */
export async function getLocationSharingStatus(
  coupleId: string
): Promise<boolean> {
  try {
    const coupleRef = doc(db, `couples/${coupleId}`);
    const snap = await (
      await import("firebase/firestore")
    ).getDoc(coupleRef);

    return snap.data()?.settings?.allowLocationSharing || false;
  } catch (error) {
    console.error("Error fetching location sharing status:", error);
    return false;
  }
}

export default {
  updateUserLocation,
  getUserLocation,
  calculateCoupleDistance,
  updateCoupleDistance,
  getLocationHistory,
  areUsersInSameCity,
  formatDistance,
  getDistanceStatus,
  enableLocationSharing,
  disableLocationSharing,
  getLocationSharingStatus,
};
