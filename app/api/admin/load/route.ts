import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

/**
 * GET /api/admin/load
 * Returns the contents of data/db.json so the Admin Dashboard
 * can hydrate the Zustand store with persisted server-side data.
 */
export async function GET() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json({ success: true, data });
  } catch {
    // db.json does not exist yet — return empty (store will use defaults)
    return NextResponse.json({ success: true, data: null });
  }
}
