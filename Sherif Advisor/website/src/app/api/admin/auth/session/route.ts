import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/auth/session
 *
 * Returns the current admin session info (userId, email, role, displayName).
 * Protected by middleware — the session is already validated and data is in headers.
 *
 * Response: { userId, email, role, displayName }
 */
export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-admin-user-id');
  const email = request.headers.get('x-admin-user-email');
  const role = request.headers.get('x-admin-user-role');
  const displayName = request.headers.get('x-admin-user-name');

  if (!userId || !email || !role || !displayName) {
    return NextResponse.json(
      { error: 'No active session' },
      { status: 401 }
    );
  }

  return NextResponse.json({ userId, email, role, displayName });
}
