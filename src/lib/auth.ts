import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { v4 as uuidv4 } from "uuid";

function generateInviteCode(): string {
  return uuidv4().slice(0, 6).toUpperCase();
}

export async function createUserProfile(
  uid: string,
  data: { displayName: string; email: string; photoURL?: string }
) {
  const userRef = doc(db, "users", uid);
  const existing = await getDoc(userRef);
  if (existing.exists()) return;
  await setDoc(userRef, {
    uid,
    displayName: data.displayName,
    email: data.email,
    photoURL: data.photoURL || "",
    coupleId: null,
    inviteCode: generateInviteCode(),
    mood: "😊",
    createdAt: serverTimestamp(),
    fcmToken: "",
  });
}

export async function signUp(email: string, password: string, displayName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await createUserProfile(cred.user.uid, { displayName, email });
  return cred.user;
}

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  await createUserProfile(cred.user.uid, {
    displayName: cred.user.displayName || "User",
    email: cred.user.email || "",
    photoURL: cred.user.photoURL || "",
  });
  return cred.user;
}

export async function signOutUser() {
  await firebaseSignOut(auth);
}
