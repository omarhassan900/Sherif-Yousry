/**
 * Public Content Delivery Module
 *
 * Provides functions for serving published content to the public website,
 * filtered by language with fallback support.
 *
 * CACHING STRATEGY
 * ─────────────────
 * All read functions are wrapped with Next.js `unstable_cache`.
 * • Data is served from the Next.js Data Cache after the first request.
 * • Cache is invalidated via `revalidateTag` whenever the admin mutates content
 *   (POST / PATCH / DELETE on /api/admin/content).
 * • Tags used:
 *     'content'          – all public content (broadest invalidation)
 *     'services'         – published services
 *     'articles'         – published articles
 *     'events'           – published events
 *     'page-sections'    – page section content
 *     'search'           – search results
 */

import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

// ============================================
// TYPES
// ============================================

export type Language = 'ar' | 'en';

export interface PublicContentResponse {
  id: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  updatedAt: Date;
  createdAt?: Date;
}

export interface PaginatedPublicResult {
  items: PublicContentResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Cache TTL: 5 minutes. The admin revalidation will clear it earlier when
// content changes, but this acts as a safety net.
const CACHE_TTL = 300;

// ============================================
// LANGUAGE HELPERS
// ============================================

export function resolveLanguageFallback(
  item: {
    titleAr: string;
    titleEn: string;
    bodyAr: string;
    bodyEn: string;
    id: string;
    metadata: string;
    updatedAt: Date;
    createdAt?: Date;
  },
  lang: Language
): PublicContentResponse {
  let title: string;
  let body: string;

  if (lang === 'ar') {
    title = item.titleAr?.trim() ? item.titleAr : item.titleEn;
    body = item.bodyAr?.trim() ? item.bodyAr : item.bodyEn;
  } else {
    title = item.titleEn?.trim() ? item.titleEn : item.titleAr;
    body = item.bodyEn?.trim() ? item.bodyEn : item.bodyAr;
  }

  let metadata: Record<string, unknown> = {};
  try {
    metadata = JSON.parse(item.metadata);
  } catch {
    // ignore parse errors
  }

  return {
    id: item.id,
    title,
    body,
    metadata,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
  };
}

// ============================================
// PUBLIC CONTENT FUNCTIONS  (cached)
// ============================================

/**
 * Get published services sorted by display order (ascending).
 * Cached with tags: ['content', 'services']
 */
export const getPublishedServices = unstable_cache(
  async (lang: Language): Promise<PublicContentResponse[]> => {
    const items = await prisma.contentItem.findMany({
      where: { type: 'service', status: 'published' },
      orderBy: { createdAt: 'asc' },
    });

    // Sort by displayOrder stored in metadata JSON, then createdAt
    const sorted = items.sort((a, b) => {
      let metaA: Record<string, unknown> = {};
      let metaB: Record<string, unknown> = {};
      try { metaA = JSON.parse(a.metadata); } catch { /* ignore */ }
      try { metaB = JSON.parse(b.metadata); } catch { /* ignore */ }
      const orderA = (metaA.displayOrder as number) ?? 9999;
      const orderB = (metaB.displayOrder as number) ?? 9999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return sorted.map((item) => resolveLanguageFallback(item, lang));
  },
  ['get-published-services'],
  { revalidate: CACHE_TTL, tags: ['content', 'services'] }
);

/**
 * Get published articles with pagination and optional category filter.
 * Sorting and date-filtering is now done in the DB where possible.
 * Cached with tags: ['content', 'articles']
 */
export const getPublishedArticles = unstable_cache(
  async (
    lang: Language,
    page: number = 1,
    category?: string
  ): Promise<PaginatedPublicResult> => {
    const pageSize = 20;
    const now = new Date().toISOString();

    // Fetch all published articles; SQLite doesn't support JSON WHERE natively
    // in Prisma, so we fetch published ones and filter by date/category in JS.
    // The set is bounded by the published+type index so it stays small.
    const allArticles = await prisma.contentItem.findMany({
      where: { type: 'article', status: 'published' },
      orderBy: { createdAt: 'desc' },
    });

    const filtered = allArticles.filter((item) => {
      let meta: Record<string, unknown> = {};
      try { meta = JSON.parse(item.metadata); } catch { return false; }

      // Exclude scheduled-future articles
      const publishDate = meta.publishDate as string | undefined;
      if (publishDate && new Date(publishDate) > new Date(now)) return false;

      // Category filter
      if (category && meta.category !== category) return false;

      return true;
    });

    // Sort by publishDate desc, falling back to createdAt
    filtered.sort((a, b) => {
      let metaA: Record<string, unknown> = {};
      let metaB: Record<string, unknown> = {};
      try { metaA = JSON.parse(a.metadata); } catch { /* ignore */ }
      try { metaB = JSON.parse(b.metadata); } catch { /* ignore */ }
      const dateA = metaA.publishDate
        ? new Date(metaA.publishDate as string).getTime()
        : new Date(a.createdAt).getTime();
      const dateB = metaB.publishDate
        ? new Date(metaB.publishDate as string).getTime()
        : new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const offset = (Math.max(1, page) - 1) * pageSize;
    const paged = filtered.slice(offset, offset + pageSize);

    return {
      items: paged.map((item) => resolveLanguageFallback(item, lang)),
      total,
      page: Math.max(1, page),
      pageSize,
      totalPages,
    };
  },
  ['get-published-articles'],
  { revalidate: CACHE_TTL, tags: ['content', 'articles'] }
);

/**
 * Get a single published article by id.
 * Cached with tags: ['content', 'articles']
 */
export const getPublishedArticleById = unstable_cache(
  async (id: string, lang: Language): Promise<PublicContentResponse | null> => {
    const item = await prisma.contentItem.findFirst({
      where: { id, type: 'article', status: 'published' },
    });

    if (!item) return null;

    try {
      const meta = JSON.parse(item.metadata);
      const publishDate = meta.publishDate as string | undefined;
      if (publishDate && new Date(publishDate) > new Date()) return null;
    } catch {
      // ignore — treat as publishable
    }

    return resolveLanguageFallback(item, lang);
  },
  ['get-published-article-by-id'],
  { revalidate: CACHE_TTL, tags: ['content', 'articles'] }
);

/**
 * Get a single published service by id.
 * Cached with tags: ['content', 'services']
 */
export const getPublishedServiceById = unstable_cache(
  async (id: string, lang: Language): Promise<PublicContentResponse | null> => {
    const item = await prisma.contentItem.findFirst({
      where: { id, type: 'service', status: 'published' },
    });

    if (!item) return null;

    return resolveLanguageFallback(item, lang);
  },
  ['get-published-service-by-id'],
  { revalidate: CACHE_TTL, tags: ['content', 'services'] }
);

// ============================================
// EVENTS FUNCTIONS  (cached)
// ============================================

/**
 * Get published events with pagination and optional filters.
 * Cached with tags: ['content', 'events']
 */
export const getPublishedEvents = unstable_cache(
  async (
    lang: Language,
    page: number = 1,
    category?: string,
    pageSize: number = 50,
    eventType?: string
  ): Promise<PaginatedPublicResult> => {
    const allEvents = await prisma.contentItem.findMany({
      where: { type: 'event', status: 'published' },
      orderBy: { createdAt: 'asc' },
    });

    const filtered = allEvents.filter((item) => {
      let meta: Record<string, unknown> = {};
      try { meta = JSON.parse(item.metadata); } catch { return false; }

      if (category && meta.category !== category) return false;

      if (eventType) {
        const itemEventType = (meta.eventType as string | undefined) || 'event';
        if (itemEventType !== eventType) return false;
      }

      return true;
    });

    // Sort by startDate ascending (upcoming first)
    filtered.sort((a, b) => {
      let metaA: Record<string, unknown> = {};
      let metaB: Record<string, unknown> = {};
      try { metaA = JSON.parse(a.metadata); } catch { /* ignore */ }
      try { metaB = JSON.parse(b.metadata); } catch { /* ignore */ }
      const dateA = metaA.startDate
        ? new Date(metaA.startDate as string).getTime()
        : new Date(a.createdAt).getTime();
      const dateB = metaB.startDate
        ? new Date(metaB.startDate as string).getTime()
        : new Date(b.createdAt).getTime();
      return dateA - dateB;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const offset = (Math.max(1, page) - 1) * pageSize;
    const paged = filtered.slice(offset, offset + pageSize);

    return {
      items: paged.map((item) => resolveLanguageFallback(item, lang)),
      total,
      page: Math.max(1, page),
      pageSize,
      totalPages,
    };
  },
  ['get-published-events'],
  { revalidate: CACHE_TTL, tags: ['content', 'events'] }
);

/**
 * Get a single published event by id.
 * Cached with tags: ['content', 'events']
 */
export const getPublishedEventById = unstable_cache(
  async (id: string, lang: Language): Promise<PublicContentResponse | null> => {
    const item = await prisma.contentItem.findFirst({
      where: { id, type: 'event', status: 'published' },
    });

    if (!item) return null;

    return resolveLanguageFallback(item, lang);
  },
  ['get-published-event-by-id'],
  { revalidate: CACHE_TTL, tags: ['content', 'events'] }
);

// ============================================
// PAGE SECTIONS  (cached)
// ============================================

/**
 * Get a specific page section by page name and section key.
 * Cached with tags: ['content', 'page-sections']
 */
export const getPageSection = unstable_cache(
  async (
    page: string,
    sectionKey: string,
    lang: Language
  ): Promise<PublicContentResponse | null> => {
    const items = await prisma.contentItem.findMany({
      where: { type: 'page_section' },
    });

    const section = items.find((item) => {
      try {
        const meta = JSON.parse(item.metadata);
        return meta.page === page && meta.sectionKey === sectionKey;
      } catch {
        return false;
      }
    });

    if (!section) return null;

    return resolveLanguageFallback(section, lang);
  },
  ['get-page-section'],
  { revalidate: CACHE_TTL, tags: ['content', 'page-sections'] }
);

// ============================================
// SEARCH  (cached)
// ============================================

export type SearchResultType = 'service' | 'article' | 'event';

export interface SearchResult extends PublicContentResponse {
  type: SearchResultType;
  category?: string;
  url: string;
}

function toPlainText(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Search published services, articles, and events by keyword.
 * Cached with tags: ['content', 'search']
 *
 * NOTE: The short CACHE_TTL (5 min) is intentional here — search results
 * should feel near-real-time. Invalidation via revalidateTag('search') on
 * admin saves will clear it immediately when new content is published.
 */
export const searchPublicContent = unstable_cache(
  async (
    query: string,
    lang: Language,
    limit: number = 8
  ): Promise<SearchResult[]> => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const items = await prisma.contentItem.findMany({
      where: {
        type: { in: ['service', 'article', 'event'] },
        status: 'published',
      },
    });

    const now = new Date();
    const results: (SearchResult & { score: number })[] = [];

    for (const item of items) {
      let meta: Record<string, unknown> = {};
      try { meta = JSON.parse(item.metadata); } catch { meta = {}; }

      if (item.type === 'article') {
        const publishDate = meta.publishDate as string | undefined;
        if (publishDate && new Date(publishDate) > now) continue;
      }

      const category = typeof meta.category === 'string' ? meta.category : '';
      const haystack = [
        item.titleAr,
        item.titleEn,
        toPlainText(item.bodyAr || ''),
        toPlainText(item.bodyEn || ''),
        category,
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(q)) continue;

      const resolved = resolveLanguageFallback(item, lang);
      const type = item.type as SearchResultType;

      const titleMatch =
        item.titleAr.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q);

      let score = titleMatch ? 100 : 50;
      if (type === 'service') score += 20;
      else if (type === 'event') score += 10;

      let url = '';
      if (type === 'service') url = `/services/${item.id}`;
      else if (type === 'event') url = `/events/${item.id}`;
      else url = `/knowledge/${item.id}`;

      results.push({ ...resolved, type, category: category || undefined, url, score });
    }

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit).map(({ score, ...rest }) => {
      void score;
      return rest;
    });
  },
  ['search-public-content'],
  { revalidate: CACHE_TTL, tags: ['content', 'search'] }
);
