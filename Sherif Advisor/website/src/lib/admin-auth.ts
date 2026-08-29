/**
 * Admin Authentication Module
 *
 * Provides password hashing, JWT session management, account lockout,
 * and password validation for the admin portal.
 */

import * as bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

// ============================================
// TYPES
// ============================================

export interface AdminSession {
  userId: string;
  email: string;
  role: 'super_admin' | 'admin';
  displayName: string;
  permissions: string[];
  iat: number;
  exp: number;
}

// ============================================
// CONFIGURATION
// ============================================

const BCRYPT_ROUNDS = 10;
const SESSION_EXPIRY = '8h';
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

// ============================================
// PASSWORD FUNCTIONS
// ============================================

/**
 * Hash a plaintext password using bcrypt with 10 rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a plaintext password against a bcrypt hash.
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Validate a password meets complexity requirements:
 * - 8 to 128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password must be at most 128 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one digit' };
  }
  return { valid: true };
}

// ============================================
// SESSION FUNCTIONS
// ============================================

/**
 * Create a signed JWT session token for an admin user.
 * Token expires after 8 hours.
 */
export async function createAdminSession(user: {
  id: string;
  email: string;
  role: string;
  displayName: string;
}): Promise<string> {
  const permissions = getPermissionsForRole(user.role as 'super_admin' | 'admin');

  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    permissions,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(getJwtSecret());

  return token;
}

/**
 * Validate a JWT session token. Returns the session payload if valid,
 * or null if the token is invalid or expired.
 */
export async function validateAdminSession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as 'super_admin' | 'admin',
      displayName: payload.displayName as string,
      permissions: payload.permissions as string[],
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch {
    return null;
  }
}

// ============================================
// ACCOUNT LOCKOUT FUNCTIONS
// ============================================

/**
 * Check if an account is currently locked.
 * Returns true if lockedUntil is set and is in the future.
 */
export function isAccountLocked(user: {
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}): boolean {
  if (!user.lockedUntil) {
    return false;
  }
  return new Date() < new Date(user.lockedUntil);
}

/**
 * Record a failed login attempt. If the user reaches 5 failed attempts,
 * lock the account for 15 minutes.
 */
export async function recordFailedAttempt(userId: string): Promise<void> {
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { failedLoginAttempts: true },
  });

  if (!user) return;

  const newAttempts = user.failedLoginAttempts + 1;

  if (newAttempts >= MAX_FAILED_ATTEMPTS) {
    await prisma.adminUser.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newAttempts,
        lockedUntil: new Date(Date.now() + LOCK_DURATION_MS),
      },
    });
  } else {
    await prisma.adminUser.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newAttempts,
      },
    });
  }
}

/**
 * Reset failed login attempts and clear the lock.
 * Called after a successful login.
 */
export async function resetFailedAttempts(userId: string): Promise<void> {
  await prisma.adminUser.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}

// ============================================
// HELPERS
// ============================================

/**
 * Get permissions array based on admin role.
 */
function getPermissionsForRole(role: 'super_admin' | 'admin'): string[] {
  const basePermissions = [
    'content:read',
    'content:write',
    'media:read',
    'media:write',
    'revisions:read',
    'revisions:restore',
  ];

  if (role === 'super_admin') {
    return [
      ...basePermissions,
      'users:read',
      'users:write',
      'users:delete',
      'settings:read',
      'settings:write',
    ];
  }

  return basePermissions;
}
