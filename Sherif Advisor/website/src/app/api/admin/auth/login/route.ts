import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  verifyPassword,
  createAdminSession,
  isAccountLocked,
  recordFailedAttempt,
  resetFailedAttempts,
} from '@/lib/admin-auth';

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().max(128),
});

/**
 * POST /api/admin/auth/login
 *
 * Authenticates admin users. Returns a generic error for invalid credentials
 * to avoid revealing whether the email exists. Enforces account lockout
 * after 5 consecutive failed attempts within 15 minutes.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate request body
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // 2. Find user by email
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      // Return same generic error as wrong password
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 3. Check if account is locked
    if (isAccountLocked(user)) {
      return NextResponse.json(
        { error: 'Account temporarily locked' },
        { status: 423 }
      );
    }

    // 4. Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 5. Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      await recordFailedAttempt(user.id);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 6. Success — reset failed attempts, create session, set cookie
    await resetFailedAttempts(user.id);

    const token = await createAdminSession({
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    });

    const response = NextResponse.json(
      { success: true, requiresPasswordChange: user.requiresPasswordChange },
      { status: 200 }
    );

    response.cookies.set('admin-session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
