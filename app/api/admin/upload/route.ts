import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * POST /api/admin/upload
 * Accepts a multipart form with a single "file" field.
 * Saves the file to /public/uploads/<timestamp>_<sanitised-name>
 * Returns the public URL path: /uploads/<filename>
 *
 * Use this from the Admin Dashboard instead of Firebase Storage.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Sanitise filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${timestamp}_${safeName}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Ensure directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl, filename });
  } catch (err) {
    console.error('[/api/admin/upload] Error saving file:', err);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

/**
 * GET /api/admin/upload
 * Returns a list of all uploaded files.
 */
export async function GET() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const files = await fs.readdir(UPLOADS_DIR);
    const imageFiles = files.filter(f => !f.endsWith('.txt') && !f.endsWith('.md'));
    const urls = imageFiles.map(f => ({ filename: f, url: `/uploads/${f}` }));
    return NextResponse.json({ success: true, files: urls });
  } catch (err) {
    console.error('[/api/admin/upload] Error listing files:', err);
    return NextResponse.json({ error: 'Failed to list uploads' }, { status: 500 });
  }
}
