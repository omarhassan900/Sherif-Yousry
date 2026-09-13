import { NextRequest, NextResponse } from 'next/server';
import { searchPublicContent, Language } from '@/lib/public-content';

/**
 * GET /api/content/search
 *
 * Public endpoint: searches published services and insights (articles) by
 * keyword across both languages' title/body and article category.
 *
 * Query params:
 *   - q: string (search keywords; min 2 chars, else returns empty list)
 *   - lang: 'ar' | 'en' (default 'ar') — language of the returned title/body
 *   - limit: number (optional, default 8, max 20)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? '';
    const langParam = searchParams.get('lang');
    const lang: Language = langParam === 'en' ? 'en' : 'ar';

    const limitParam = searchParams.get('limit');
    const limit = Math.min(20, Math.max(1, parseInt(limitParam ?? '', 10) || 8));

    const items = await searchPublicContent(q, lang, limit);

    return NextResponse.json({ query: q.trim(), items });
  } catch (error) {
    console.error('Failed to search content:', error);
    return NextResponse.json(
      { error: 'Failed to search content' },
      { status: 500 }
    );
  }
}
