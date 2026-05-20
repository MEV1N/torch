// =============================================
// Torch — Distance & Weather Tracking
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

export interface LocationCoordinate {
  latitude: number;
  longitude: number;
  timestamp?: Timestamp;
  accuracy?: number;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
}

export interface DistanceTracking {
  id?: string;
  user1Location: LocationCoordinate;
  user2Location: LocationCoordinate;
  distanceKm: number;
  distanceMiles: number;
  user1Timezone?: string;
  user2Timezone?: string;
  weather1?: WeatherInfo;
  weather2?: WeatherInfo;
  updatedAt: Timestamp;
  sameCity: boolean;
  distanceStatus: string;
}

/**
 * Haversine formula to calculate distance between two points
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { km: number; miles: number } {
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
  const km = R * c;
  const miles = km * 0.621371;

  return { km: Math.round(km * 10) / 10, miles: Math.round(miles * 10) / 10 };
}

/**
 * Get distance status message
 */
export function getDistanceStatus(distanceKm: number): {
  status: string;
  emoji: string;
  message: string;
} {
  if (distanceKm === 0)
    return { status: "together", emoji: "💕", message: "Together" };
  if (distanceKm < 5)
    return { status: "very-close", emoji: "🤏", message: "Very Close" };
  if (distanceKm < 50)
    return { status: "close", emoji: "🚗", message: "Close By" };
  if (distanceKm < 500)
    return { status: "regional", emoji: "🛣️", message: "Regional Distance" };
  if (distanceKm < 3000)
    return { status: "long-distance", emoji: "✈️", message: "Long Distance" };

  return { status: "very-far", emoji: "🌍", message: "Very Far Apart" };
}

/**
 * Update location for a user
 */
export async function updateUserLocation(
  coupleId: string,
  userUid: string,
  latitude: number,
  longitude: number,
  accuracy?: number
): Promise<void> {
  try {
    const locationRef = doc(
      db,
      `couples/${coupleId}/locations/${userUid}`
    );

    await updateDoc(locationRef, {
      latitude,
      longitude,
      timestamp: Timestamp.now(),
      accuracy: accuracy || 0,
    });
  } catch (error) {
    console.error("Error updating location:", error);
  }
}

/**
 * Get couple's locations
 */
export async function getCoupleLocations(coupleId: string): Promise<{
  user1?: LocationCoordinate & { uid: string };
  user2?: LocationCoordinate & { uid: string };
}> {
  try {
    const q = collection(db, `couples/${coupleId}/locations`);
    const snapshot = await getDocs(q);

    const locations: {
      user1?: LocationCoordinate & { uid: string };
      user2?: LocationCoordinate & { uid: string };
    } = {};

    snapshot.docs.forEach((doc, index) => {
      if (index === 0) {
        locations.user1 = { uid: doc.id, ...doc.data() } as any;
      } else {
        locations.user2 = { uid: doc.id, ...doc.data() } as any;
      }
    });

    return locations;
  } catch (error) {
    console.error("Error getting couple locations:", error);
    return {};
  }
}

/**
 * Calculate couple's distance and update tracking
 */
export async function updateCoupleDistance(
  coupleId: string,
  user1Id: string,
  user1Coords: LocationCoordinate,
  user2Id: string,
  user2Coords: LocationCoordinate
): Promise<number> {
  try {
    const { km, miles } = calculateDistance(
      user1Coords.latitude,
      user1Coords.longitude,
      user2Coords.latitude,
      user2Coords.longitude
    );

    const sameCity = km < 5;
    const distanceStatus = getDistanceStatus(km);

    // Update distance tracking
    const trackingRef = doc(db, `couples/${coupleId}/stats/distance-tracking`);
    await updateDoc(trackingRef, {
      user1Location: user1Coords,
      user2Location: user2Coords,
      distanceKm: km,
      distanceMiles: miles,
      sameCity,
      distanceStatus: distanceStatus.status,
      updatedAt: Timestamp.now(),
    });

    return km;
  } catch (error) {
    console.error("Error updating couple distance:", error);
    return 0;
  }
}

/**
 * Listen to distance changes in real-time
 */
export function listenToDistance(
  coupleId: string,
  callback: (data: DistanceTracking) => void
) {
  const trackingRef = doc(db, `couples/${coupleId}/stats/distance-tracking`);

  return onSnapshot(trackingRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as DistanceTracking);
    }
  });
}

/**
 * Get timezone difference
 */
export function getTimezoneDifference(
  timezone1: string,
  timezone2: string
): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone1,
  });
  const formatter2 = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone2,
  });

  const date = new Date();
  const time1 = new Date(formatter.format(date));
  const time2 = new Date(formatter2.format(date));

  const diff = (time1.getTime() - time2.getTime()) / (1000 * 60 * 60);
  return Math.round(diff * 10) / 10;
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number, metric: "km" | "miles" = "km"): string {
  if (metric === "miles") {
    const miles = distanceKm * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Check if users are in the same city
 */
export function areUsersInSameCity(distanceKm: number): boolean {
  return distanceKm < 5;
}

/**
 * Get distance statistics
 */
export async function getDistanceStats(coupleId: string) {
  try {
    const trackingRef = doc(db, `couples/${coupleId}/stats/distance-tracking`);
    const snap = await getDoc(trackingRef);

    if (!snap.exists()) {
      return {
        currentDistance: 0,
        lastUpdate: null,
        status: "unknown",
        emoji: "❓",
      };
    }

    const data = snap.data() as DistanceTracking;
    const status = getDistanceStatus(data.distanceKm);

    return {
      currentDistance: data.distanceKm,
      currentDistanceMiles: data.distanceMiles,
      lastUpdate: data.updatedAt,
      status: status.status,
      emoji: status.emoji,
      message: status.message,
      sameCity: data.sameCity,
    };
  } catch (error) {
    console.error("Error getting distance stats:", error);
    return {
      currentDistance: 0,
      lastUpdate: null,
      status: "unknown",
      emoji: "❓",
    };
  }
}

/**
 * Enable location sharing for a user
 */
export async function enableLocationSharing(
  coupleId: string,
  userUid: string
): Promise<void> {
  try {
    const settingsRef = doc(db, `couples/${coupleId}/settings/location-sharing`);
    await updateDoc(settingsRef, {
      [userUid]: true,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error enabling location sharing:", error);
  }
}

/**
 * Disable location sharing for a user
 */
export async function disableLocationSharing(
  coupleId: string,
  userUid: string
): Promise<void> {
  try {
    const settingsRef = doc(db, `couples/${coupleId}/settings/location-sharing`);
    await updateDoc(settingsRef, {
      [userUid]: false,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error disabling location sharing:", error);
  }
}

/**
 * Get location sharing status
 */
export async function getLocationSharingStatus(
  coupleId: string,
  userUid: string
): Promise<boolean> {
  try {
    const settingsRef = doc(db, `couples/${coupleId}/settings/location-sharing`);
    const snap = await getDoc(settingsRef);

    if (!snap.exists()) return false;

    return snap.data()[userUid] === true;
  } catch (error) {
    console.error("Error getting location sharing status:", error);
    return false;
  }
}

/**
 * Get distance over time (for analytics)
 */
export async function getDistanceHistory(
  coupleId: string,
  limitDays: number = 30
): Promise<any[]> {
  try {
    // This would require a history collection that stores distance snapshots
    // For now, returning placeholder
    const historyRef = collection(
      db,
      `couples/${coupleId}/stats/distance-history`
    );
    const q = query(
      historyRef,
      orderBy("timestamp", "desc"),
      limit(limitDays * 24) // Assuming hourly snapshots
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting distance history:", error);
    return [];
  }
}

export default {
  calculateDistance,
  getDistanceStatus,
  updateUserLocation,
  getCoupleLocations,
  updateCoupleDistance,
  listenToDistance,
  getTimezoneDifference,
  formatDistance,
  areUsersInSameCity,
  getDistanceStats,
  enableLocationSharing,
  disableLocationSharing,
  getLocationSharingStatus,
  getDistanceHistory,
};
