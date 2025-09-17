import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { healthCheck } from '@/lib/health-check'

let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

export async function middleware(req: NextRequest) {
  // In development, bypass all auth and allow direct access to dashboard
  if (process.env.NODE_ENV === 'development') {
    // Periodic health check (every 30 seconds max)
    const now = Date.now();
    if (now - lastHealthCheck > HEALTH_CHECK_INTERVAL) {
      lastHealthCheck = now;
      healthCheck().catch(console.error);
    }
    return NextResponse.next()
  }
  
  // Skip auth check for API routes and static files
  if (
    req.nextUrl.pathname.startsWith('/api/') ||
    req.nextUrl.pathname.startsWith('/_next/') ||
    req.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // TODO: Implement proper auth checking for production
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}