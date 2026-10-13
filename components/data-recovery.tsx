"use client";

import { useEffect } from "react";
import { initializeStore } from "@/lib/store";

/**
 * DataRecovery
 * Root-level client component that guarantees:
 * 1. Checks if server data in /api/admin/load contains only default mock values.
 * 2. If defaults, checks browser localStorage ('miftaxul-cms-storage') for user edits.
 * 3. Auto-migrates any found edits to /api/admin/save (saved permanently to data/db.json).
 * 4. Ensures 'About Us' and 'Teachers' modules render the recovered data instantly.
 */
export function DataRecovery() {
  useEffect(() => {
    initializeStore().catch((err) => {
      console.warn("[DataRecovery] Initialization error:", err);
    });
  }, []);

  return null;
}
