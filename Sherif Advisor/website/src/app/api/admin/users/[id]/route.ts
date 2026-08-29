import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ============================================
// PATCH /api/admin/users/[id]
// ============================================

/**
 * PATCH /api/admin/users/[id]
 *
 * Update an admin user (displayName, role, isActive).
 * Only super_admin can perform this action (checked via x-admin-user-role header).
 * Prevents self-deactivation: if caller tries to deactivate their own account, returns 400.
 * Deactivating a user effectively invalidates their session (middleware will reject on next request).
 *
 * Request body: { displayName?: string, role?: 'admin' | 'super_admin', isActive?: boolean }
 * Returns 200 with updated user data (excluding sensitive fields).
 * Returns 400 if self-deactivation attempted or invalid input.
 * Returns 403 if caller is not super_admin.
 * Returns 404 if user not found.
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check that the caller is a super_admin
    const callerRole = request.headers.get('x-admin-user-role');

    if (callerRole !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admins can update users' },
        { status: 403 }
      );
    }

    const callerId = request.headers.get('x-admin-user-id');

    // Prevent self-deactivation
    const body = await request.json();

    if (callerId === id && body.isActive === false) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    // Validate input fields
    const updateData: {
      displayName?: string;
      role?: string;
      isActive?: boolean;
    } = {};

    if (body.displayName !== undefined) {
      if (typeof body.displayName !== 'string' || !body.displayName.trim()) {
        return NextResponse.json(
          { error: 'Display name must be a non-empty string' },
          { status: 400 }
        );
      }
      updateData.displayName = body.displayName.trim();
    }

    if (body.role !== undefined) {
      const validRoles = ['admin', 'super_admin'];
      if (!validRoles.includes(body.role)) {
        return NextResponse.json(
          { error: 'Role must be either "admin" or "super_admin"' },
          { status: 400 }
        );
      }
      updateData.role = body.role;
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'isActive must be a boolean' },
          { status: 400 }
        );
      }
      updateData.isActive = body.isActive;
    }

    // Check if user exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update the user
    const updatedUser = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Failed to update admin user:', error);
    return NextResponse.json(
      { error: 'Failed to update admin user' },
      { status: 500 }
    );
  }
}
