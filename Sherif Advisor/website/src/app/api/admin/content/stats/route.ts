import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/admin/content/stats
 *
 * Returns content counts grouped by type and the 10 most recently
 * modified items. Protected by middleware (admin session validated).
 * Useful for client-side dashboard refreshes.
 */
export async function GET() {
  try {
    const [serviceCount, articleCount, pageSectionCount, recentItems] =
      await Promise.all([
        prisma.contentItem.count({ where: { type: 'service' } }),
        prisma.contentItem.count({ where: { type: 'article' } }),
        prisma.contentItem.count({ where: { type: 'page_section' } }),
        prisma.contentItem.findMany({
          orderBy: { updatedAt: 'desc' },
          take: 10,
          select: {
            id: true,
            type: true,
            titleEn: true,
            titleAr: true,
            status: true,
            updatedAt: true,
          },
        }),
      ]);

    return NextResponse.json({
      stats: {
        services: serviceCount,
        articles: articleCount,
        pageSections: pageSectionCount,
        total: serviceCount + articleCount + pageSectionCount,
      },
      recentItems,
    });
  } catch (error) {
    console.error('Failed to fetch content stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content statistics' },
      { status: 500 }
    );
  }
}
