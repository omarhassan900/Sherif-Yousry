import { NextRequest, NextResponse } from 'next/server';
import { getPublishedArticleById, Language } from '@/lib/public-content';

/**
 * GET /api/content/articles/[id]
 *
 * Public endpoint: returns a single published article by id.
 * Query params:
 *   - lang: 'ar' | 'en' (default 'ar')
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const langParam = searchParams.get('lang');
    const lang: Language = langParam === 'en' ? 'en' : 'ar';

    const article = await getPublishedArticleById(params.id, lang);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
