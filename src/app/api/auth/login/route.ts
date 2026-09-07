import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const password = body?.password;
    const correctPassword = process.env.DASHBOARD_PASSWORD || 'fondsnyt2026';

    if (password && password === correctPassword) {
      const proto = request.headers.get('x-forwarded-proto');
      const isHttps = proto === 'https' || request.url.startsWith('https:');
      const isSecure = process.env.NODE_ENV === 'production' && isHttps;

      const cookieOptions = {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      };

      // Set cookie directly on the response to ensure header inclusion
      const response = NextResponse.json({ success: true });
      response.cookies.set('fondsnyt_auth', 'authenticated', cookieOptions);

      // Also set on cookieStore for server component state consistency
      try {
        const cookieStore = await cookies();
        cookieStore.set('fondsnyt_auth', 'authenticated', cookieOptions);
      } catch (e) {
        // Ignored if headers already committed
      }

      return response;
    }

    return NextResponse.json({ error: 'Forkert adgangskode. Prøv igen.' }, { status: 401 });
  } catch (error) {
    console.error('Fejl under login:', error);
    return NextResponse.json({ error: 'Serverfejl under login' }, { status: 500 });
  }
}
