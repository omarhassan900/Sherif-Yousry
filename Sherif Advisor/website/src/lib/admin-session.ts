import { headers } from 'next/headers';

/**
 * Server-side utility to retrieve admin session info from middleware headers.
 *
 * The middleware validates the JWT and passes session data via request headers:
 * - x-admin-user-id
 * - x-admin-user-email
 * - x-admin-user-role
 * - x-admin-user-name
 *
 * This function should only be called from Server Components or Server Actions
 * within protected admin routes (where middleware has already validated the session).
 */
export interface AdminSessionInfo {
  userId: string;
  email: string;
  role: string;
  displayName: string;
}

export async function getAdminSession(): Promise<AdminSessionInfo | null> {
  const headersList = await headers();

  const userId = headersList.get('x-admin-user-id');
  const email = headersList.get('x-admin-user-email');
  const role = headersList.get('x-admin-user-role');
  const displayName = headersList.get('x-admin-user-name');

  if (!userId || !email || !role || !displayName) {
    return null;
  }

  return { userId, email, role, displayName };
}
