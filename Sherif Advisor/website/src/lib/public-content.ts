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
  createdAt?: Date; // Added for event sorting
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
  item: { titleAr: string; titleEn: string; bodyAr: string; bodyEn: string; id: string; metadata: string; updatedAt: Date; createdAt?: Date },
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

  const allArticles = await prisma.contentItem.findMany({
    where: {
      type: 'article',
      status: 'published',
    },
  });
  
  const filtered = allArticles.filter((item) => {
    let meta: Record<string, unknown> = {};
    try {
      meta = JSON.parse(item.metadata);
    } catch {
      return false;
    }

    const publishDate = meta.publishDate as string | undefined;
    if (publishDate && new Date(publishDate) > new Date(now)) {
      return false;
    }

    if (category && meta.category !== category) {
      return false;
    }

    return true;
  });

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

// ============================================
// NEW: EVENTS FUNCTIONS
// ============================================

/**
 * Get published events with pagination, sorted by start date ascending (upcoming first).
 * Optionally filters by category (e.g., 'workshop', 'seminar', 'webinar', 'conference').
 */
export async function getPublishedEvents(
  lang: Language,
  page: number = 1,
  category?: string
): Promise<PaginatedPublicResult> {
  const pageSize = 12; // Typical grid size for events

  const allEvents = await prisma.contentItem.findMany({
    where: {
      type: 'event',
      status: 'published',
    },
  });

  const filtered = allEvents.filter((item) => {
    let meta: Record<string, unknown> = {};
    try {
      meta = JSON.parse(item.metadata);
    } catch {
      return false;
    }

    // Check category filter (e.g., 'workshop', 'seminar')
    if (category && meta.category !== category) {
      return false;
    }

    return true;
  });

  // Sort by startDate ascending (upcoming events first), fallback to createdAt
  filtered.sort((a, b) => {
    const metaA = JSON.parse(a.metadata);
    const metaB = JSON.parse(b.metadata);
    const dateA = metaA.startDate ? new Date(metaA.startDate as string).getTime() : new Date(a.createdAt).getTime();
    const dateB = metaB.startDate ? new Date(metaB.startDate as string).getTime() : new Date(b.createdAt).getTime();
    return dateA - dateB;
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
 * Get a single published event by id, with language fallback applied.
 */
export async function getPublishedEventById(
  id: string,
  lang: Language
): Promise<PublicContentResponse | null> {
  const item = await prisma.contentItem.findFirst({
    where: {
      id,
      type: 'event',
      status: 'published',
    },
  });

  if (!item) return null;

  return resolveLanguageFallback(item, lang);
}

// ============================================
// PAGE SECTIONS
// ============================================

/**
 * Get a specific page section by page name and section key.
 */
export async function getPageSection(
  page: string,
  sectionKey: string,
  lang: Language
): Promise<PublicContentResponse | null> {
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
      type: { in: ['service', 'article', 'event'] },
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

    // Rank: title matches beat body matches; services beat events, events beat articles.
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

    results.push({
      ...resolved,
      type,
      category: category || undefined,
      url,
      score,
    });
  }

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit).map(({ score, ...rest }) => {
    void score;
    return rest;
  });
}