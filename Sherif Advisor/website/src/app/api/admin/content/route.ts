import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createContent, ContentType, ContentStatus } from '@/lib/content';

const VALID_TYPES: ContentType[] = ['service', 'article', 'page_section'];
const VALID_STATUSES: ContentStatus[] = ['published', 'unpublished'];
const PAGE_SIZE = 20;

// ============================================
// GET /api/admin/content
// ============================================

/**
 * GET /api/admin/content
 *
 * List content items with pagination, optional type filter, and search.
 * Protected by middleware (admin session already validated).
 *
 * Query params:
 *   - page: number (default 1)
 *   - type: 'service' | 'article' | 'page_section' (optional)
 *   - search: string, min 2 chars (optional, case-insensitive match on titleAr or titleEn)
 *
 * Response: { items, total, page, pageSize, totalPages }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse page
    const pageParam = searchParams.get('page');
    const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

    // Parse type filter
    const typeParam = searchParams.get('type');
    const type =
      typeParam && VALID_TYPES.includes(typeParam as ContentType)
        ? (typeParam as ContentType)
        : undefined;

    // Parse search
    const searchParam = searchParams.get('search');
    const search =
      searchParam && searchParam.trim().length >= 2
        ? searchParam.trim()
        : undefined;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { titleAr: { contains: search } },
        { titleEn: { contains: search } },
      ];
    }

    // Execute queries in parallel
    const [items, total] = await Promise.all([
      prisma.contentItem.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.contentItem.count({ where }),
    ]);

    // Parse metadata for each item
    const parsedItems = items.map((item) => ({
      ...item,
      metadata: JSON.parse(item.metadata),
    }));

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return NextResponse.json({
      items: parsedItems,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages,
    });
  } catch (error) {
    console.error('Failed to list content:', error);
    return NextResponse.json(
      { error: 'Failed to list content' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/admin/content
// ============================================

interface ValidationError {
  field: string;
  message: string;
}

function validateContentInput(body: unknown): {
  valid: boolean;
  errors: ValidationError[];
  data?: {
    type: ContentType;
    titleAr: string;
    titleEn: string;
    bodyAr: string;
    bodyEn: string;
    status?: ContentStatus;
    metadata?: Record<string, unknown>;
  };
} {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: [{ field: 'body', message: 'Request body is required' }] };
  }

  const data = body as Record<string, unknown>;

  // Validate type
  if (!data.type || !VALID_TYPES.includes(data.type as ContentType)) {
    errors.push({
      field: 'type',
      message: `Type must be one of: ${VALID_TYPES.join(', ')}`,
    });
  }

  // Validate titleAr
  if (typeof data.titleAr !== 'string') {
    errors.push({ field: 'titleAr', message: 'Arabic title is required' });
  } else {
    const trimmed = data.titleAr.replace(/\s/g, '');
    if (trimmed.length < 2 || trimmed.length > 200) {
      errors.push({
        field: 'titleAr',
        message: 'Arabic title must have between 2 and 200 non-whitespace characters',
      });
    }
  }

  // Validate titleEn
  if (typeof data.titleEn !== 'string') {
    errors.push({ field: 'titleEn', message: 'English title is required' });
  } else {
    const trimmed = data.titleEn.replace(/\s/g, '');
    if (trimmed.length < 2 || trimmed.length > 200) {
      errors.push({
        field: 'titleEn',
        message: 'English title must have between 2 and 200 non-whitespace characters',
      });
    }
  }

  // Validate bodyAr
  if (typeof data.bodyAr !== 'string') {
    errors.push({ field: 'bodyAr', message: 'Arabic body is required' });
  } else {
    const trimmed = data.bodyAr.replace(/\s/g, '');
    if (trimmed.length < 1) {
      errors.push({
        field: 'bodyAr',
        message: 'Arabic body must have at least 1 non-whitespace character',
      });
    }
  }

  // Validate bodyEn
  if (typeof data.bodyEn !== 'string') {
    errors.push({ field: 'bodyEn', message: 'English body is required' });
  } else {
    const trimmed = data.bodyEn.replace(/\s/g, '');
    if (trimmed.length < 1) {
      errors.push({
        field: 'bodyEn',
        message: 'English body must have at least 1 non-whitespace character',
      });
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

  return {
    valid: true,
    errors: [],
    data: {
      type: data.type as ContentType,
      titleAr: data.titleAr as string,
      titleEn: data.titleEn as string,
      bodyAr: data.bodyAr as string,
      bodyEn: data.bodyEn as string,
      status: data.status as ContentStatus | undefined,
      metadata: data.metadata as Record<string, unknown> | undefined,
    },
  };
}

/**
 * POST /api/admin/content
 *
 * Create a new content item. Protected by middleware (admin session validated).
 * Admin ID is provided via the `x-admin-user-id` header set by middleware.
 *
 * Request body: { type, titleAr, titleEn, bodyAr, bodyEn, status?, metadata? }
 * Returns 201 with created item on success, 400 with validation errors on failure.
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

    const body = await request.json();

    const validation = validateContentInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400 }
      );
    }

    const item = await createContent(validation.data!, adminId);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Failed to create content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
