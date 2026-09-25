import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // In a real app, you would check against a database.
    // For now, we will just use the hardcoded credentials from the prompt,
    // or you can check against the mock DB. To keep it simple and robust,
    // we'll check against a hardcoded set, but ideally we want to check the Zustand store.
    // However, Zustand persist uses localStorage (client-side only).
    // So Server Actions/API routes cannot read localStorage.
    // Therefore, we will stick to the hardcoded credentials requested by the user:
    // admin / miftaxul2024
    // (If the user wants to change it later, we would need a server-side DB).

    if (username === 'admin' && password === 'miftaxul2024') {
      const response = NextResponse.json({ success: true });
      
      response.cookies.set('miftaxul_admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
