import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * Security Middleware
 *
 * Handles:
 * - Admin route protection (JWT validation via jose)
 * - Rate limiting (basic)
 * - Protected portal route access control
 * - Security headers enforcement
 */

// ============================================
// ADMIN ROUTE PROTECTION
// ============================================

const ADMIN_SESSION_COOKIE = 'admin-session';
const ADMIN_LOGIN_PATH = '/admin/login';

/**
 * Routes that are excluded from admin authentication.
 * These routes must be accessible without a valid admin session.
 */
const ADMIN_PUBLIC_ROUTES = [
  '/admin/login',
  '/api/admin/auth/login',
];

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}

function isAdminPublicRoute(pathname: string): boolean {
  return ADMIN_PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname === route + '/'
  );
}

function isAdminApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/admin');
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

async function validateAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      displayName: payload.displayName as string,
    };
  } catch {
    return null;
  }
}

// ============================================
// PORTAL ROUTE PROTECTION (existing)
// ============================================

const PORTAL_PROTECTED_ROUTES = [
  '/portal/dashboard',
  '/portal/documents',
  '/portal/messages',
  '/portal/reports',
  '/api/portal',
];

// ============================================
// RATE LIMITING
// ============================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  record.count++;
  return record.count > RATE_LIMIT_MAX;
}

// ============================================
// MIDDLEWARE
// ============================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  // Rate limiting
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // ---- Admin route protection ----
  if (isAdminRoute(pathname) && !isAdminPublicRoute(pathname)) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!token) {
      if (isAdminApiRoute(pathname)) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const session = await validateAdminToken(token);

    if (!session) {
      if (isAdminApiRoute(pathname)) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Pass session data to route handlers via request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-user-id', session.userId);
    requestHeaders.set('x-admin-user-email', session.email);
    requestHeaders.set('x-admin-user-role', session.role);
    requestHeaders.set('x-admin-user-name', session.displayName);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Request-ID', crypto.randomUUID());

    return response;
  }

  // ---- Portal route protection (existing logic) ----
  const isPortalProtected = PORTAL_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isPortalProtected) {
    const token = request.cookies.get('session-token')?.value;

    if (!token) {
      const loginUrl = new URL('/portal', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ---- Default response with security headers ----
  const response = NextResponse.next();

  // Prevent clickjacking from other origins, but allow same-origin framing so
  // the admin CMS can embed public pages in its front-end preview iframe.
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Request ID for audit trail
  response.headers.set('X-Request-ID', crypto.randomUUID());

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
