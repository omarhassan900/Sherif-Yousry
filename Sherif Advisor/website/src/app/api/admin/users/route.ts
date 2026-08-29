import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/admin-auth';

// ============================================
// GET /api/admin/users
// ============================================

/**
 * GET /api/admin/users
 *
 * List all admin users. Returns a small set (no pagination needed).
 * Excludes sensitive fields: passwordHash, failedLoginAttempts, lockedUntil.
 * Protected by middleware (admin session already validated).
 *
 * Response: { users: AdminUser[] }
 */
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Failed to list admin users:', error);
    return NextResponse.json(
      { error: 'Failed to list admin users' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/admin/users
// ============================================

/**
 * Generate a random temporary password (12 characters).
 * Uses crypto.randomBytes with base64url encoding.
 */
function generateTempPassword(): string {
  return crypto.randomBytes(9).toString('base64url').slice(0, 12);
}

/**
 * POST /api/admin/users
 *
 * Create a new admin user with a generated temporary password.
 * Only super_admin role can create users (checked via x-admin-user-role header).
 *
 * Request body: { email: string, displayName: string, role?: 'admin' | 'super_admin' }
 * Response 201: { user: { id, email, displayName, role }, tempPassword: string }
 * Response 400: validation error or email already exists
 * Response 403: caller is not super_admin
 */
export async function POST(request: NextRequest) {
  try {
    // Check that the caller is a super_admin
    const callerRole = request.headers.get('x-admin-user-role');

    if (callerRole !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admins can create users' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate request body
    const { email, displayName, role } = body as {
      email?: string;
      displayName?: string;
      role?: string;
    };

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!displayName || typeof displayName !== 'string' || !displayName.trim()) {
      return NextResponse.json(
        { error: 'Display name is required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate role if provided
    const validRoles = ['admin', 'super_admin'];
    const assignedRole = role && validRoles.includes(role) ? role : 'admin';

    // Check if email already exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 400 }
      );
    }

    // Generate temp password and hash it
    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);

    // Create the admin user
    const user = await prisma.adminUser.create({
      data: {
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        passwordHash,
        role: assignedRole,
        requiresPasswordChange: true,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        },
        tempPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
