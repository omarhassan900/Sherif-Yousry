import { NextRequest, NextResponse } from 'next/server';
import { getPublishedArticles, Language } from '@/lib/public-content';

/**
 * GET /api/content/articles
 *
 * Public endpoint: returns published articles with pagination.
 * Only includes articles with status "published" and publishDate <= now.
 *
 * Query params:
 *   - lang: 'ar' | 'en' (default 'ar')
 *   - page: number (default 1)
 *   - category: string (optional filter)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const langParam = searchParams.get('lang');
    const lang: Language = langParam === 'en' ? 'en' : 'ar';

    const pageParam = searchParams.get('page');
    const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

    const category = searchParams.get('category') || undefined;

    const result = await getPublishedArticles(lang, page, category);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch public articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
