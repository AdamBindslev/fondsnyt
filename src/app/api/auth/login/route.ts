import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.DASHBOARD_PASSWORD || 'fondsnyt2026';

    if (password === correctPassword) {
      const cookieStore = await cookies();
      cookieStore.set('fondsnyt_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Forkert adgangskode. Prøv igen.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Serverfejl under login' }, { status: 500 });
  }
}
