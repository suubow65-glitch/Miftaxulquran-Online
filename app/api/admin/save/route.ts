import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Recursively scans an object or array for Base64 image data URLs,
 * extracts them to physical files in /public/uploads/, and replaces
 * them with /uploads/<filename> URLs.
 */
async function extractBase64Images(obj: any): Promise<any> {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return Promise.all(obj.map((item) => extractBase64Images(item)));
  }

  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string' && val.startsWith('data:image/') && val.includes(';base64,')) {
      try {
        const commaIdx = val.indexOf(',');
        const meta = val.substring(0, commaIdx);
        const base64Data = val.substring(commaIdx + 1);
        const mimeMatch = meta.match(/data:image\/([a-zA-Z0-9+.-]+)/);
        const rawExt = mimeMatch ? mimeMatch[1].toLowerCase() : 'png';
        const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
        const filename = `${key}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
        result[key] = `/uploads/${filename}`;
        continue;
      } catch (err) {
        console.warn(`[save] Failed to extract base64 image for key ${key}:`, err);
      }
    } else if (typeof val === 'object' && val !== null) {
      result[key] = await extractBase64Images(val);
      continue;
    }
    result[key] = val;
  }
  return result;
}

/**
 * POST /api/admin/save
 * Accepts the full CMS state as JSON, extracts any Base64 images to /public/uploads/,
 * and writes the state to data/db.json.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    if (!rawBody || typeof rawBody !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Extract any embedded base64 images into physical files in /public/uploads/
    const cleanedBody = await extractBase64Images(rawBody);

    const payload = {
      _meta: {
        version: '1.0.0',
        description: 'Miftaxul Quran Online — Local JSON Database (SOSTEC)',
        lastUpdated: new Date().toISOString(),
      },
      ...cleanedBody,
    };

    // Ensure data/ directory exists (important on first SOSTEC deploy)
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(payload, null, 2), 'utf-8');

    return NextResponse.json({ success: true, savedAt: payload._meta.lastUpdated, data: payload });
  } catch (err) {
    console.error('[/api/admin/save] Error writing db.json:', err);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

/**
 * GET /api/admin/save  (read current db.json contents)
 */
export async function GET() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    // File doesn't exist yet — return empty object
    return NextResponse.json({ _meta: { version: '1.0.0', lastUpdated: null } });
  }
}
