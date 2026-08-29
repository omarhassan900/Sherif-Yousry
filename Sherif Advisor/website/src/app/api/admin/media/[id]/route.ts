import { NextRequest, NextResponse } from 'next/server';
import { deleteMedia } from '@/lib/media';

// ============================================
// DELETE /api/admin/media/[id]
// ============================================

/**
 * DELETE /api/admin/media/[id]
 *
 * Delete a media item. If references exist and force is not set,
 * returns 409 with the references list. Use ?force=true to delete anyway.
 * Protected by middleware (admin session already validated).
 *
 * Returns 204 (no content) on successful deletion.
 * Returns 404 if the media item is not found.
 * Returns 409 if references exist and force is not true.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    let result;
    try {
      result = await deleteMedia(id, force);
    } catch (err) {
      if (err instanceof Error && err.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Media item not found' },
          { status: 404 }
        );
      }
      throw err;
    }

    if (!result.deleted) {
      return NextResponse.json(
        { error: 'Media item is referenced by content', references: result.references },
        { status: 409 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete media item:', error);
    return NextResponse.json(
      { error: 'Failed to delete media item' },
      { status: 500 }
    );
  }
}
