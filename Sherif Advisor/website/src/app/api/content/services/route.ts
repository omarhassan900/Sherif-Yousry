import { NextRequest, NextResponse } from 'next/server';
import { getPublishedServices, Language } from '@/lib/public-content';

/**
 * GET /api/content/services
 *
 * Public endpoint: returns published services sorted by display order.
 * Query params:
 *   - lang: 'ar' | 'en' (default 'ar')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const langParam = searchParams.get('lang');
    const lang: Language = langParam === 'en' ? 'en' : 'ar';

    const services = await getPublishedServices(lang);

    return NextResponse.json({ items: services });
  } catch (error) {
    console.error('Failed to fetch public services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
