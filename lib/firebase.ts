import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1miggH1c1fALT6nIAqmNXUuFizHF4Msw",
  authDomain: "miftaxulquran-online.firebaseapp.com",
  projectId: "miftaxulquran-online",
  storageBucket: "miftaxulquran-online.firebasestorage.app",
  messagingSenderId: "469836244605",
  appId: "1:469836244605:web:1ae9a1361b5ea3b812f314",
  measurementId: "G-834VPTPQ8Z",
};

export function getFirebaseApp() {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb() {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  return getAnalytics(getFirebaseApp());
}
