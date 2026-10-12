import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyATXnMNmCjiB5vpi0RjJeK43l970lgsTtg",
  authDomain: "dugsi-quran-online.firebaseapp.com",
  projectId: "dugsi-quran-online",
  storageBucket: "dugsi-quran-online.firebasestorage.app",
  messagingSenderId: "817284486670",
  appId: "1:817284486670:web:75091d3b94f7145fbf4e5f",
  measurementId: "G-RBNKMCB8R",
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

export async function uploadFileToStorage(file: File, folder: string = "uploads"): Promise<string> {
  const storage = getFirebaseStorage();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileRef = ref(storage, `${folder}/${timestamp}_${safeName}`);
  const snapshot = await uploadBytes(fileRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
