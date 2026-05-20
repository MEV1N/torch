"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserProfile, Couple } from "@/lib/types";

interface AuthContextType {
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  partner: UserProfile | null;
  couple: Couple | null;
  loading: boolean;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  userProfile: null,
  partner: null,
  couple: null,
  loading: true,
  refreshProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

/** Check if Firebase is properly initialized */
function isFirebaseReady(): boolean {
  try {
    // If auth is a stub (empty object), it won't have the app property
    return !!(auth && typeof (auth as any).app === "object");
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [partner, setPartner] = useState<UserProfile | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshProfile = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Listen to Firebase auth state (only if Firebase is initialized)
  useEffect(() => {
    if (!isFirebaseReady()) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (!user) {
        setUserProfile(null);
        setPartner(null);
        setCouple(null);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  // Listen to user profile changes
  useEffect(() => {
    if (!firebaseUser || !isFirebaseReady()) return;

    const unsub = onSnapshot(doc(db, "users", firebaseUser.uid), (snap) => {
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      }
      setLoading(false);
    });

    return unsub;
  }, [firebaseUser, refreshKey]);

  // Listen to couple data when coupleId exists
  useEffect(() => {
    if (!userProfile?.coupleId || !isFirebaseReady()) {
      setCouple(null);
      setPartner(null);
      return;
    }

    const unsub = onSnapshot(doc(db, "couples", userProfile.coupleId), async (snap) => {
      if (!snap.exists()) return;
      const coupleData = { id: snap.id, ...snap.data() } as Couple;
      setCouple(coupleData);

      // Get partner profile
      const partnerId = coupleData.users.find((uid) => uid !== userProfile.uid);
      if (partnerId) {
        const partnerSnap = await getDoc(doc(db, "users", partnerId));
        if (partnerSnap.exists()) {
          setPartner(partnerSnap.data() as UserProfile);
        }
      }
    });

    return unsub;
  }, [userProfile?.coupleId, userProfile?.uid]);

  return (
    <AuthContext.Provider value={{ firebaseUser, userProfile, partner, couple, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
