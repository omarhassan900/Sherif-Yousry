'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getClientLanguage } from '@/lib/language';

/**
 * Cookieless page-view tracker. Fires a lightweight beacon to /api/track on
 * every route change for public pages. Admin routes are excluded.
 *
 * A coarse "session id" is stored in sessionStorage and rotated daily to
 * approximate unique visits without persistent cookies.
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const key = 'sy_sid';
  try {
    const existing = sessionStorage.getItem(key);
    if (existing && existing.startsWith(today)) return existing;
    const fresh = `${today}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, fresh);
    return fresh;
  } catch {
    return `${today}-anon`;
  }
}

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages.
    if (!pathname || pathname.startsWith('/admin')) return;

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || '',
      lang: getClientLanguage(),
      sessionId: getSessionId(),
    });

    // Prefer sendBeacon (survives navigation); fall back to fetch.
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  return null;
}
