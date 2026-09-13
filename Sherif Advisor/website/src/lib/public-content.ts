/**
 * Public Content Delivery Module
 *
 * Provides functions for serving published content to the public website,
 * filtered by language with fallback support.
 */

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
}

export interface PaginatedPublicResult {
  items: PublicContentResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// LANGUAGE HELPERS
// ============================================

/**
 * Resolve language fallback: if the requested language field is empty,
 * return the alternative language version instead.
 */
export function resolveLanguageFallback(
  item: { titleAr: string; titleEn: string; bodyAr: string; bodyEn: string; id: string; metadata: string; updatedAt: Date },
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
  };
}

// ============================================
// PUBLIC CONTENT FUNCTIONS
// ============================================

/**
 * Get published services sorted by display order (ascending),
 * with creation date as tiebreaker (oldest first).
 */
export async function getPublishedServices(lang: Language): Promise<PublicContentResponse[]> {
  const items = await prisma.contentItem.findMany({
    where: {
      type: 'service',
      status: 'published',
    },
    orderBy: [
      { createdAt: 'asc' },
    ],
  });

  // Sort by displayOrder from metadata, then createdAt
  const sorted = items.sort((a, b) => {
    const metaA = JSON.parse(a.metadata);
    const metaB = JSON.parse(b.metadata);
    const orderA = metaA.displayOrder ?? 9999;
    const orderB = metaB.displayOrder ?? 9999;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return sorted.map((item) => resolveLanguageFallback(item, lang));
}

/**
 * Get published articles with pagination, sorted by publish date descending.
 * Only returns articles with status "published" and publishDate <= now.
 * Optionally filters by category.
 */
export async function getPublishedArticles(
  lang: Language,
  page: number = 1,
  category?: string
): Promise<PaginatedPublicResult> {
  const pageSize = 20;
  const now = new Date().toISOString();

  // Fetch all published articles (we need to filter by publishDate in metadata)
  const allArticles = await prisma.contentItem.findMany({
    where: {
      type: 'article',
      status: 'published',
    },
    orderBy: { updatedAt: 'desc' },
  });
  // Filter by publishDate and category from metadata
  const filtered = allArticles.filter((item) => {
    let meta: Record<string, unknown> = {};
    try {
      meta = JSON.parse(item.metadata);
    } catch {
      return false;
    }

    // Check publish date
    const publishDate = meta.publishDate as string | undefined;
    if (publishDate && new Date(publishDate) > new Date(now)) {
      return false;
    }

    // Check category
    if (category && meta.category !== category) {
      return false;
    }

    return true;
  });

  // Sort by publishDate descending
  filtered.sort((a, b) => {
    const metaA = JSON.parse(a.metadata);
    const metaB = JSON.parse(b.metadata);
    const dateA = metaA.publishDate ? new Date(metaA.publishDate).getTime() : new Date(a.createdAt).getTime();
    const dateB = metaB.publishDate ? new Date(metaB.publishDate).getTime() : new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (Math.max(1, page) - 1) * pageSize;
  const paged = filtered.slice(offset, offset + pageSize);

  return {
    items: paged.map((item) => resolveLanguageFallback(item, lang)),
    total,
    page: Math.max(1, page),
    pageSize,
    totalPages,
  };
}

/**
 * Get a single published article by id, with language fallback applied.
 * Returns null if not found, unpublished, or its publishDate is in the future.
 */
export async function getPublishedArticleById(
  id: string,
  lang: Language
): Promise<PublicContentResponse | null> {
  const item = await prisma.contentItem.findFirst({
    where: {
      id,
      type: 'article',
      status: 'published',
    },
  });

  if (!item) return null;

  // Respect a future publishDate (scheduled articles stay hidden).
  try {
    const meta = JSON.parse(item.metadata);
    const publishDate = meta.publishDate as string | undefined;
    if (publishDate && new Date(publishDate) > new Date()) {
      return null;
    }
  } catch {
    // ignore parse errors and treat as publishable
  }

  return resolveLanguageFallback(item, lang);
}

/**
 * Get a single published service by id, with language fallback applied.
 * Returns null if not found or not published.
 */
export async function getPublishedServiceById(
  id: string,
  lang: Language
): Promise<PublicContentResponse | null> {
  const item = await prisma.contentItem.findFirst({
    where: {
      id,
      type: 'service',
      status: 'published',
    },
  });

  if (!item) return null;

  return resolveLanguageFallback(item, lang);
}

/**
 * Get a specific page section by page name and section key.
 */
export async function getPageSection(
  page: string,
  sectionKey: string,
  lang: Language
): Promise<PublicContentResponse | null> {
  // Page sections are stored with metadata containing page and sectionKey
  const items = await prisma.contentItem.findMany({
    where: {
      type: 'page_section',
    },
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
}

// ============================================
// SEARCH
// ============================================

export type SearchResultType = 'service' | 'article';

export interface SearchResult extends PublicContentResponse {
  type: SearchResultType;
  /** Category for articles (from metadata), if present. */
  category?: string;
  /** Public URL to the item. */
  url: string;
}

/** Strip HTML tags so body text can be matched/snippeted as plain text. */
function toPlainText(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Search published services and articles by keyword.
 *
 * Matching is case-insensitive and spans BOTH languages' title and body plus
 * article category, so a query finds content regardless of the visitor's
 * current display language. Returned title/body are resolved to `lang` (with
 * fallback). Services rank above articles, then by title match.
 *
 * @param query  The search keywords (min 2 chars recommended).
 * @param lang   Display language for the returned title/body.
 * @param limit  Max results to return (default 8).
 */
export async function searchPublicContent(
  query: string,
  lang: Language,
  limit: number = 8
): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const items = await prisma.contentItem.findMany({
    where: {
      type: { in: ['service', 'article'] },
      status: 'published',
    },
  });

  const now = new Date();
  const results: (SearchResult & { score: number })[] = [];

  for (const item of items) {
    let meta: Record<string, unknown> = {};
    try {
      meta = JSON.parse(item.metadata);
    } catch {
      meta = {};
    }

    // Respect scheduled/future article publish dates.
    if (item.type === 'article') {
      const publishDate = meta.publishDate as string | undefined;
      if (publishDate && new Date(publishDate) > now) continue;
    }

    // Build a haystack across both languages + category so keyword search is
    // language-agnostic.
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

    // Rank: title matches beat body matches; services beat articles.
    const titleMatch =
      item.titleAr.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q);
    let score = titleMatch ? 100 : 50;
    if (type === 'service') score += 10;

    results.push({
      ...resolved,
      type,
      category: category || undefined,
      url: type === 'service' ? `/services/${item.id}` : `/knowledge/${item.id}`,
      score,
    });
  }

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit).map(({ score, ...rest }) => {
    void score;
    return rest;
  });
}
