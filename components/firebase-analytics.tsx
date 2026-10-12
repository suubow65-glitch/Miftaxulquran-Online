"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

export function FirebaseAnalytics() {
  useEffect(() => {
    getFirebaseAnalytics().catch((err) => {
      console.warn("Analytics initialization skipped:", err);
    });
  }, []);

  return null;
}
