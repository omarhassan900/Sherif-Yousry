import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/track
 *
 * Lightweight, cookieless first-party page-view tracking. Called by a small
 * client beacon on public pages. Stores coarse data only (path, referrer host,
 * device class, language, coarse country, a daily-rotating session id).
 *
 * This is intentionally best-effort: any failure returns 204 so it never
 * disrupts the visitor experience.
 */
function classifyDevice(ua: string): string {
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(s)) return 'tablet';
  if (/mobi|iphone|android.*mobile|phone/.test(s)) return 'mobile';
  return 'desktop';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const path =
      typeof body.path === 'string' ? body.path.slice(0, 300) : '/';

    // Only keep the referrer host, not full URL (privacy + noise reduction).
    let referrer: string | null = null;
    if (typeof body.referrer === 'string' && body.referrer) {
      try {
        referrer = new URL(body.referrer).hostname.slice(0, 200);
      } catch {
        referrer = null;
      }
    }

    const lang = body.lang === 'en' ? 'en' : body.lang === 'ar' ? 'ar' : null;

    const ua = request.headers.get('user-agent') || '';
    const device = classifyDevice(ua);

    // Country from common CDN/proxy headers, if present (Vercel provides this).
    const country =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      null;

    const sessionId =
      typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : null;

    await prisma.pageView.create({
      data: { path, referrer, country, device, lang, sessionId },
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    // Never fail the visitor over analytics.
    return new NextResponse(null, { status: 204 });
  }
}
