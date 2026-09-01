import { NextRequest, NextResponse } from 'next/server';
import { getPublishedServiceById, Language } from '@/lib/public-content';

/**
 * GET /api/content/services/[id]
 *
 * Public endpoint: returns a single published service by id.
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

    const service = await getPublishedServiceById(params.id, lang);

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}
