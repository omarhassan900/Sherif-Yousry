import { NextRequest, NextResponse } from 'next/server';
import { getContentById } from '@/lib/content';
import { getRevisions } from '@/lib/revisions';

// ============================================
// GET /api/admin/content/[id]/revisions
// ============================================

/**
 * GET /api/admin/content/[id]/revisions
 *
 * List revisions for a content item, paginated (20 per page, newest first).
 * Protected by middleware (admin session already validated).
 *
 * Query params:
 *   - page (optional, default 1): page number
 *
 * Returns 200 with paginated revisions on success.
 * Returns 404 if the content item is not found.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Verify content item exists
    const item = await getContentById(id);

    if (!item) {
      return NextResponse.json(
        { error: 'Content item not found' },
        { status: 404 }
      );
    }

    // Parse page query param
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;

    // Fetch paginated revisions (newest first, 20 per page)
    const result = await getRevisions(id, page);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to get revisions:', error);
    return NextResponse.json(
      { error: 'Failed to get revisions' },
      { status: 500 }
    );
  }
}
