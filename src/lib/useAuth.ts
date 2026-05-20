import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useMemo } from "react";

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { firebaseUser } = useAuth();
  return !!firebaseUser;
}

/**
 * Hook to check if user is paired with a partner
 */
export function useIsPaired() {
  const { userProfile } = useAuth();
  return !!userProfile?.coupleId;
}

/**
 * Hook to get partner's name
 */
export function usePartnerName() {
  const { partner } = useAuth();
  return partner?.displayName || "Your Partner";
}

/**
 * Hook to format relationship duration
 */
export function useRelationshipDays() {
  const { couple } = useAuth();
  
  return useMemo(() => {
    if (!couple?.relationshipStartDate) return 0;
    const startDate = new Date(couple.relationshipStartDate).getTime();
    const now = new Date().getTime();
    return Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  }, [couple?.relationshipStartDate]);
}

/**
 * Hook to get current user's Firebase ID token
 */
export async function getUserIdToken() {
  const { firebaseUser } = useAuth();
  if (!firebaseUser) return null;
  return await firebaseUser.getIdToken();
}

/**
 * Hook for common auth checks
 */
export function useAuthCheck() {
  const { firebaseUser, userProfile, loading } = useAuth();
  
  return useMemo(
    () => ({
      isAuthenticated: !!firebaseUser,
      isPaired: !!userProfile?.coupleId,
      isLoading: loading,
      userId: firebaseUser?.uid,
      userEmail: firebaseUser?.email,
      profileComplete: !!userProfile?.displayName,
    }),
    [firebaseUser, userProfile, loading]
  );
}
