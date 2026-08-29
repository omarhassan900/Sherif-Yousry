import { NextRequest, NextResponse } from 'next/server';
import { listMedia, uploadMedia, validateMediaFile } from '@/lib/media';

// ============================================
// GET /api/admin/media
// ============================================

/**
 * GET /api/admin/media
 *
 * List media items with pagination (20 items per page, sorted by uploadedAt desc).
 * Protected by middleware (admin session already validated).
 *
 * Query params:
 *   - page: number (default 1)
 *
 * Response: { items, total, page, pageSize, totalPages }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse page
    const pageParam = searchParams.get('page');
    const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

    const result = await listMedia(page);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to list media:', error);
    return NextResponse.json(
      { error: 'Failed to list media' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/admin/media
// ============================================

/**
 * POST /api/admin/media
 *
 * Upload a media file (multipart/form-data).
 * Protected by middleware (admin session validated).
 * Admin ID is provided via the `x-admin-user-id` header set by middleware.
 *
 * Form field: "file" — the file to upload
 * Returns 201 with created MediaItem on success.
 * Returns 400 if no file provided or validation fails.
 * Returns 401 if no admin ID.
 */
export async function POST(request: NextRequest) {
  try {
    const adminId = request.headers.get('x-admin-user-id');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate the file before uploading
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Upload the file
    const mediaItem = await uploadMedia(file, adminId);

    return NextResponse.json(mediaItem, { status: 201 });
  } catch (error) {
    console.error('Failed to upload media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
}
