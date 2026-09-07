import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('fondsnyt_auth');
  const isAuthenticated = !!authCookie?.value;

  // Check CRON secret for automated jobs (Bearer token or x-cron-secret)
  const authHeader = request.headers.get('authorization');
  const customCronHeader = request.headers.get('x-cron-secret');
  const cronSecret = process.env.CRON_SECRET;

  const isCronAuthorized = Boolean(
    cronSecret && (
      (authHeader && (authHeader === `Bearer ${cronSecret}` || authHeader === cronSecret)) ||
      (customCronHeader && customCronHeader === cronSecret)
    )
  );

  // Allow cron authorized requests to crawl endpoints
  if (pathname.startsWith('/api/crawl') && isCronAuthorized) {
    return NextResponse.next();
  }

  // Paths exempt from authentication
  const isPublicPath = 
    pathname.startsWith('/login') || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.'); // Static files

  if (!isAuthenticated && !isPublicPath) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Uautoriseret adgang. Login eller gyldig CRON_SECRET påkrævet.' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting /login, redirect to homepage
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
