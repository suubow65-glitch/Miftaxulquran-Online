/**
 * Firebase has been removed from this project.
 * This file is a no-op stub kept to prevent broken imports.
 * All CMS state lives in lib/store.ts (Zustand, local).
 * Server-side persistence is via /api/admin/save (data/db.json).
 *
 * DO NOT add Firebase code here.
 */

// No-op exports for any legacy call sites
export const firebaseConfig = {};
export function getFirebaseApp() { return null as never; }
export function getFirebaseAuth() { return null as never; }
export function getFirebaseDb() { return null as never; }
export function getFirebaseStorage() { return null as never; }
export async function getFirebaseAnalytics() { return null; }
export async function uploadFileToStorage(_file: File, _folder?: string): Promise<string> {
  throw new Error('Firebase Storage removed. Use /api/admin/upload or store images in /public/uploads/.');
}
