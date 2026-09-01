import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const PAGE_SIZE = 20;
const VALID_STATUSES = ['new', 'read', 'archived'];

/**
 * GET /api/admin/inquiries
 *
 * List service inquiries with pagination and optional status filter.
 * Protected by middleware (admin session validated).
 *
 * Query params:
 *   - page: number (default 1)
 *   - status: 'new' | 'read' | 'archived' (optional)
 *
 * Response: { items, total, page, pageSize, totalPages, newCount }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

    const statusParam = searchParams.get('status');
    const status =
      statusParam && VALID_STATUSES.includes(statusParam)
        ? statusParam
        : undefined;

    const where = status ? { status } : {};

    const [items, total, newCount] = await Promise.all([
      prisma.serviceInquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.serviceInquiry.count({ where }),
      prisma.serviceInquiry.count({ where: { status: 'new' } }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
      newCount,
    });
  } catch (error) {
    console.error('Failed to list inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to list inquiries' },
      { status: 500 }
    );
  }
}
