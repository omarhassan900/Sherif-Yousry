import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  verifyPassword,
  hashPassword,
  validatePassword,
  validateAdminSession,
} from '@/lib/admin-auth';

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

/**
 * POST /api/admin/auth/change-password
 *
 * Allows authenticated admin users to change their password.
 * Validates the current password, enforces password complexity rules,
 * updates the hash, and clears the requiresPasswordChange flag.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Read session cookie and validate
    const token = request.cookies.get('admin-session')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await validateAdminSession(token);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Validate request body
    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    // 3. Find the user by session userId
    const user = await prisma.adminUser.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 4. Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);

    if (!isCurrentValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // 5. Validate new password meets complexity requirements
    const validation = validatePassword(newPassword);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 6. Hash the new password and update the user
    const newHash = await hashPassword(newPassword);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        requiresPasswordChange: false,
      },
    });

    // 7. Return success
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
