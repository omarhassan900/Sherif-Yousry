'use client';

/**
 * useV2Section — client hook for wiring V2 page components to the CMS.
 *
 * Each editable V2 section is stored as a `page_section` ContentItem with
 * metadata `{ page: 'v2', sectionKey, fields }`. The public sections API
 * (`/api/content/sections/v2/<key>`) resolves `title`/`body` to the requested
 * language, but returns `metadata.fields` raw (bilingual `{ ar, en }` pairs).
 *
 * This hook fetches the section and exposes:
 *  - `title` / `body`  — already language-resolved by the API
 *  - `field(key, fallbackAr, fallbackEn)` — resolves a bilingual extra field
 *    for the current language, falling back to the provided hardcoded default
 *    when the CMS has no value (so the site never renders blank).
 */

import { useEffect, useState } from 'react';
import type { Language } from '@/lib/language';

interface BilingualField {
  ar?: string;
  en?: string;
}

interface SectionResponse {
  id: string;
  title: string;
  body: string;
  metadata: {
    fields?: Record<string, BilingualField>;
    [key: string]: unknown;
  };
  updatedAt: string;
}

export interface V2Section {
  /** Whether the CMS fetch has completed (success or failure). */
  loaded: boolean;
  /** Language-resolved section title (empty string if unavailable). */
  title: string;
  /** Language-resolved section body (empty string if unavailable). */
  body: string;
  /** Raw bilingual extra fields keyed by name. */
  fields: Record<string, BilingualField>;
  /**
   * Resolve a bilingual extra field for the current language, using the
   * provided hardcoded fallbacks when the CMS value is missing/empty.
   */
  field: (key: string, fallbackAr: string, fallbackEn: string) => string;
}

/** Strip any HTML the rich text editor may have wrapped around plain strings. */
function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}

export function useV2Section(sectionKey: string, lang: Language): V2Section {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [fields, setFields] = useState<Record<string, BilingualField>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);

    fetch(`/api/content/sections/v2/${sectionKey}?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SectionResponse | null) => {
        if (cancelled) return;
        if (data) {
          setTitle(stripHtml(data.title ?? ''));
          setBody(stripHtml(data.body ?? ''));
          setFields(data.metadata?.fields ?? {});
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [sectionKey, lang]);

  const field = (key: string, fallbackAr: string, fallbackEn: string): string => {
    const f = fields[key];
    const value = lang === 'ar' ? f?.ar : f?.en;
    const trimmed = (value ?? '').trim();
    return trimmed !== '' ? trimmed : lang === 'ar' ? fallbackAr : fallbackEn;
  };

  return { loaded, title, body, fields, field };
}
