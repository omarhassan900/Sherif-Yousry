import { NextResponse } from 'next/server';

/**
 * POST /api/admin/auth/logout
 *
 * Clears the admin session cookie, effectively logging the user out.
 */
export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set('admin-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return response;
}
