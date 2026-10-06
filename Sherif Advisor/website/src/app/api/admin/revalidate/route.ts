import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * POST /api/admin/revalidate
 *
 * Purges the Next.js Data Cache for the supplied content tags.
 * Called internally by admin mutation routes (create / update / delete)
 * so the public site always serves fresh content after a save.
 *
 * Protected by middleware (admin session already validated).
 *
 * Body: { type: 'service' | 'article' | 'event' | 'page_section' | 'all' }
 *
 * Tags invalidated per type:
 *   service      → 'services', 'search', 'content'
 *   article      → 'articles', 'search', 'content'
 *   event        → 'events',   'search', 'content'
 *   page_section → 'page-sections', 'content'
 *   all          → all of the above
 */

type ContentType = 'service' | 'article' | 'event' | 'page_section' | 'all';

const TAG_MAP: Record<ContentType, string[]> = {
  service:      ['services', 'search', 'content'],
  article:      ['articles', 'search', 'content'],
  event:        ['events',   'search', 'content'],
  page_section: ['page-sections', 'content'],
  all:          ['services', 'articles', 'events', 'page-sections', 'search', 'content'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const type: ContentType = body?.type ?? 'all';

    const tags = TAG_MAP[type] ?? TAG_MAP.all;
    tags.forEach((tag) => revalidateTag(tag));

    return NextResponse.json({ revalidated: true, tags });
  } catch (error) {
    console.error('Cache revalidation failed:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
