// Force dynamic rendering - reads request data / queries the DB at runtime
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getPublishedJobs, Language } from '@/lib/public-content';

/**
 * GET /api/content/jobs
 *
 * Public endpoint: returns published job openings sorted by display order.
 * Query params:
 *   - lang: 'ar' | 'en' (default 'ar')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const langParam = searchParams.get('lang');
    const lang: Language = langParam === 'en' ? 'en' : 'ar';

    const jobs = await getPublishedJobs(lang);

    return NextResponse.json({ items: jobs }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Failed to fetch public jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
