import { NextRequest, NextResponse } from 'next/server';
import { getContentById, updateContent, deleteContent, ContentStatus } from '@/lib/content';
import { pruneOldRevisions } from '@/lib/revisions';

const VALID_STATUSES: ContentStatus[] = ['published', 'unpublished'];
const MAX_REVISIONS = 50;

// ============================================
// Validation
// ============================================

interface ValidationError {
  field: string;
  message: string;
}

function validatePatchInput(body: unknown): {
  valid: boolean;
  errors: ValidationError[];
  data?: {
    titleAr?: string;
    titleEn?: string;
    bodyAr?: string;
    bodyEn?: string;
    status?: ContentStatus;
    metadata?: Record<string, unknown>;
  };
} {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: [{ field: 'body', message: 'Request body is required' }] };
  }

  const data = body as Record<string, unknown>;

  // Validate titleAr (optional in PATCH)
  if (data.titleAr !== undefined) {
    if (typeof data.titleAr !== 'string') {
      errors.push({ field: 'titleAr', message: 'Arabic title must be a string' });
    } else {
      const trimmed = data.titleAr.replace(/\s/g, '');
      if (trimmed.length < 2 || trimmed.length > 200) {
        errors.push({
          field: 'titleAr',
          message: 'Arabic title must have between 2 and 200 non-whitespace characters',
        });
      }
    }
  }

  // Validate titleEn (optional in PATCH)
  if (data.titleEn !== undefined) {
    if (typeof data.titleEn !== 'string') {
      errors.push({ field: 'titleEn', message: 'English title must be a string' });
    } else {
      const trimmed = data.titleEn.replace(/\s/g, '');
      if (trimmed.length < 2 || trimmed.length > 200) {
        errors.push({
          field: 'titleEn',
          message: 'English title must have between 2 and 200 non-whitespace characters',
        });
      }
    }
  }

  // Validate bodyAr (optional in PATCH)
  if (data.bodyAr !== undefined) {
    if (typeof data.bodyAr !== 'string') {
      errors.push({ field: 'bodyAr', message: 'Arabic body must be a string' });
    } else {
      const trimmed = data.bodyAr.replace(/\s/g, '');
      if (trimmed.length < 1) {
        errors.push({
          field: 'bodyAr',
          message: 'Arabic body must have at least 1 non-whitespace character',
        });
      }
    }
  }

  // Validate bodyEn (optional in PATCH)
  if (data.bodyEn !== undefined) {
    if (typeof data.bodyEn !== 'string') {
      errors.push({ field: 'bodyEn', message: 'English body must be a string' });
    } else {
      const trimmed = data.bodyEn.replace(/\s/g, '');
      if (trimmed.length < 1) {
        errors.push({
          field: 'bodyEn',
          message: 'English body must have at least 1 non-whitespace character',
        });
      }
    }
  }

  // Validate status (optional)
  if (data.status !== undefined && !VALID_STATUSES.includes(data.status as ContentStatus)) {
    errors.push({
      field: 'status',
      message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  // Validate metadata (optional)
  if (data.metadata !== undefined && (typeof data.metadata !== 'object' || data.metadata === null || Array.isArray(data.metadata))) {
    errors.push({
      field: 'metadata',
      message: 'Metadata must be an object',
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Build the update data with only provided fields
  const updateData: {
    titleAr?: string;
    titleEn?: string;
    bodyAr?: string;
    bodyEn?: string;
    status?: ContentStatus;
    metadata?: Record<string, unknown>;
  } = {};

  if (data.titleAr !== undefined) updateData.titleAr = data.titleAr as string;
  if (data.titleEn !== undefined) updateData.titleEn = data.titleEn as string;
  if (data.bodyAr !== undefined) updateData.bodyAr = data.bodyAr as string;
  if (data.bodyEn !== undefined) updateData.bodyEn = data.bodyEn as string;
  if (data.status !== undefined) updateData.status = data.status as ContentStatus;
  if (data.metadata !== undefined) updateData.metadata = data.metadata as Record<string, unknown>;

  return { valid: true, errors: [], data: updateData };
}

// ============================================
// GET /api/admin/content/[id]
// ============================================

/**
 * GET /api/admin/content/[id]
 *
 * Get a single content item by ID.
 * Protected by middleware (admin session already validated).
 *
 * Returns 200 with the content item (parsed metadata) on success.
 * Returns 404 if the content item is not found.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const item = await getContentById(id);

    if (!item) {
      return NextResponse.json(
        { error: 'Content item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to get content item:', error);
    return NextResponse.json(
      { error: 'Failed to get content item' },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH /api/admin/content/[id]
// ============================================

/**
 * PATCH /api/admin/content/[id]
 *
 * Update a content item. Creates a revision atomically.
 * Protected by middleware (admin session already validated).
 * Admin ID is provided via the `x-admin-user-id` header set by middleware.
 *
 * Request body: { titleAr?, titleEn?, bodyAr?, bodyEn?, status?, metadata? }
 * Returns 200 with the updated item on success.
 * Returns 400 if validation fails, 404 if not found.
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const adminId = request.headers.get('x-admin-user-id');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const validation = validatePatchInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400 }
      );
    }

    // updateContent throws if not found
    let updatedItem;
    try {
      updatedItem = await updateContent(id, validation.data!, adminId);
    } catch (err) {
      if (err instanceof Error && err.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Content item not found' },
          { status: 404 }
        );
      }
      throw err;
    }

    // Prune old revisions (keep max 50)
    await pruneOldRevisions(id, MAX_REVISIONS);

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Failed to update content item:', error);
    return NextResponse.json(
      { error: 'Failed to update content item' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/admin/content/[id]
// ============================================

/**
 * DELETE /api/admin/content/[id]
 *
 * Delete a content item and its associated revisions.
 * Protected by middleware (admin session already validated).
 *
 * Returns 204 (no content) on success.
 * Returns 404 if the content item is not found.
 */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    try {
      await deleteContent(id);
    } catch (err) {
      if (err instanceof Error && err.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Content item not found' },
          { status: 404 }
        );
      }
      throw err;
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete content item:', error);
    return NextResponse.json(
      { error: 'Failed to delete content item' },
      { status: 500 }
    );
  }
}
