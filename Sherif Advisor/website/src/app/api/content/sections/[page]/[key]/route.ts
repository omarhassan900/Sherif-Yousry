import { NextRequest, NextResponse } from 'next/server';
import { getPageSection, Language } from '@/lib/public-content';

/**
 * GET /api/content/sections/[page]/[key]
 *
 * Public endpoint: returns a specific page section by page name and section key.
 *
 * Query params:
 *   - lang: 'ar' | 'en' (default 'ar')
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ page: string; key: string }> }
) {
  try {
    const { page, key } = await context.params;
    const { searchParams } = new URL(request.url);
    const langParam = searchParams.get('lang');
    const lang: Language = langParam === 'en' ? 'en' : 'ar';

    const section = await getPageSection(page, key, lang);

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Failed to fetch page section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    );
  }
}
