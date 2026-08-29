import { NextRequest, NextResponse } from 'next/server';
import { restoreRevision, pruneOldRevisions } from '@/lib/revisions';

const MAX_REVISIONS = 50;

// ============================================
// POST /api/admin/content/[id]/revisions/[revId]/restore
// ============================================

/**
 * POST /api/admin/content/[id]/revisions/[revId]/restore
 *
 * Restore a content item to the state captured in a specific revision.
 * Creates a reversal revision so the restore is itself reversible.
 * Protected by middleware (admin session already validated).
 *
 * Admin ID is provided via the `x-admin-user-id` header set by middleware.
 *
 * Returns 200 with the restored content item on success.
 * Returns 404 if the revision or content item is not found.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; revId: string }> }
) {
  try {
    const { id, revId } = await context.params;

    const adminId = request.headers.get('x-admin-user-id');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let restoredItem;
    try {
      restoredItem = await restoreRevision(revId, adminId);
    } catch (err) {
      if (err instanceof Error && err.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Revision or content item not found' },
          { status: 404 }
        );
      }
      throw err;
    }

    // Prune old revisions (keep max 50)
    await pruneOldRevisions(id, MAX_REVISIONS);

    return NextResponse.json(restoredItem);
  } catch (error) {
    console.error('Failed to restore revision:', error);
    return NextResponse.json(
      { error: 'Failed to restore revision' },
      { status: 500 }
    );
  }
}
