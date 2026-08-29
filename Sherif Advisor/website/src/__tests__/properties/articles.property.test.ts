/// <reference types="vitest/globals" />
/**
 * Property-based tests for article content delivery operations.
 *
 * Feature: admin-portal-cms
 * - Property 9: Published content visibility filters by status and date
 * - Property 10: Article category filter returns only matching articles
 */

import * as fc from 'fast-check';

// ============================================
// TYPES (mirroring the content module)
// ============================================

type ContentStatus = 'published' | 'unpublished';

interface ArticleItem {
  id: string;
  type: 'article';
  titleAr: string;
  titleEn: string;
  status: ContentStatus;
  metadata: {
    category: string;
    publishDate: Date;
    featuredImageId: string | null;
  };
}

// ============================================
// PURE LOGIC FUNCTIONS (extracted for testing)
// ============================================

/**
 * Filter articles to include only those with status "published"
 * AND a publishDate <= the current server time (now).
 */
function filterVisibleArticles(articles: ArticleItem[], now: Date): ArticleItem[] {
  return articles.filter(
    (a) => a.status === 'published' && a.metadata.publishDate.getTime() <= now.getTime()
  );
}

/**
 * Filter articles by category — returns only articles whose category
 * matches the given filter value exactly.
 */
function filterByCategory(articles: ArticleItem[], category: string): ArticleItem[] {
  return articles.filter((a) => a.metadata.category === category);
}

// ============================================
// GENERATORS
// ============================================

const contentStatusArb: fc.Arbitrary<ContentStatus> = fc.constantFrom('published', 'unpublished');

/** Generate a date within a reasonable range (2023-01-01 to 2025-12-31) */
const dateArb: fc.Arbitrary<Date> = fc
  .integer({ min: 1672531200000, max: 1767225600000 })
  .map((ts) => new Date(ts));

/** Predefined categories for realistic test data */
const categoryArb: fc.Arbitrary<string> = fc.constantFrom(
  'legal',
  'tax',
  'corporate',
  'compliance',
  'advisory',
  'finance'
);

/** Generate an article item with mixed statuses and publish dates */
const articleItemArb: fc.Arbitrary<ArticleItem> = fc
  .tuple(
    fc.uuid(),
    fc.string({ minLength: 2, maxLength: 50 }),
    fc.string({ minLength: 2, maxLength: 50 }),
    contentStatusArb,
    categoryArb,
    dateArb,
    fc.option(fc.uuid(), { nil: null })
  )
  .map(([id, titleAr, titleEn, status, category, publishDate, featuredImageId]) => ({
    id,
    type: 'article' as const,
    titleAr,
    titleEn,
    status,
    metadata: { category, publishDate, featuredImageId },
  }));

/** Generate a published article item (status always "published") */
const publishedArticleArb: fc.Arbitrary<ArticleItem> = fc
  .tuple(
    fc.uuid(),
    fc.string({ minLength: 2, maxLength: 50 }),
    fc.string({ minLength: 2, maxLength: 50 }),
    categoryArb,
    dateArb,
    fc.option(fc.uuid(), { nil: null })
  )
  .map(([id, titleAr, titleEn, category, publishDate, featuredImageId]) => ({
    id,
    type: 'article' as const,
    titleAr,
    titleEn,
    status: 'published' as const,
    metadata: { category, publishDate, featuredImageId },
  }));

// ============================================
// Property 9: Published content visibility filters by status and date
// ============================================

describe('Feature: admin-portal-cms, Property 9: Published content visibility filters by status and date', () => {
  /**
   * **Validates: Requirements 6.4, 6.5, 9.4**
   *
   * For any set of articles with mixed statuses and publish dates, only articles
   * with status "published" appear in the filtered results.
   */
  it('all visible articles have status "published"', () => {
    fc.assert(
      fc.property(
        fc.array(articleItemArb, { minLength: 0, maxLength: 30 }),
        dateArb,
        (articles, now) => {
          const visible = filterVisibleArticles(articles, now);

          for (const article of visible) {
            expect(article.status).toBe('published');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.4, 6.5, 9.4**
   *
   * For any set of articles, all visible articles have a publishDate <= now.
   */
  it('all visible articles have publishDate equal to or earlier than now', () => {
    fc.assert(
      fc.property(
        fc.array(articleItemArb, { minLength: 0, maxLength: 30 }),
        dateArb,
        (articles, now) => {
          const visible = filterVisibleArticles(articles, now);

          for (const article of visible) {
            expect(article.metadata.publishDate.getTime()).toBeLessThanOrEqual(now.getTime());
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.4, 6.5, 9.4**
   *
   * Articles with status "unpublished" never appear in visible results.
   */
  it('no unpublished article appears in the visible results', () => {
    fc.assert(
      fc.property(
        fc.array(articleItemArb, { minLength: 0, maxLength: 30 }),
        dateArb,
        (articles, now) => {
          const visible = filterVisibleArticles(articles, now);
          const unpublishedIds = articles
            .filter((a) => a.status === 'unpublished')
            .map((a) => a.id);

          const visibleIds = visible.map((a) => a.id);

          for (const unpubId of unpublishedIds) {
            expect(visibleIds).not.toContain(unpubId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.4, 6.5, 9.4**
   *
   * Articles with a future publish date (publishDate > now) never appear
   * in visible results, even if they have status "published".
   */
  it('published articles with future publishDate are excluded', () => {
    fc.assert(
      fc.property(
        fc.array(articleItemArb, { minLength: 0, maxLength: 30 }),
        dateArb,
        (articles, now) => {
          const visible = filterVisibleArticles(articles, now);
          const futurePublishedIds = articles
            .filter(
              (a) =>
                a.status === 'published' && a.metadata.publishDate.getTime() > now.getTime()
            )
            .map((a) => a.id);

          const visibleIds = visible.map((a) => a.id);

          for (const futureId of futurePublishedIds) {
            expect(visibleIds).not.toContain(futureId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.4, 6.5, 9.4**
   *
   * Every article that is published AND has publishDate <= now SHALL appear
   * in the visible results (no valid article is incorrectly excluded).
   */
  it('every eligible article (published + past/current date) appears in results', () => {
    fc.assert(
      fc.property(
        fc.array(articleItemArb, { minLength: 0, maxLength: 30 }),
        dateArb,
        (articles, now) => {
          const visible = filterVisibleArticles(articles, now);
          const eligibleIds = articles
            .filter(
              (a) =>
                a.status === 'published' && a.metadata.publishDate.getTime() <= now.getTime()
            )
            .map((a) => a.id);

          const visibleIds = visible.map((a) => a.id);

          for (const eligibleId of eligibleIds) {
            expect(visibleIds).toContain(eligibleId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================
// Property 10: Article category filter returns only matching articles
// ============================================

describe('Feature: admin-portal-cms, Property 10: Article category filter returns only matching articles', () => {
  /**
   * **Validates: Requirements 6.6**
   *
   * For any category filter value and any set of published articles,
   * all articles returned by the category-filtered query SHALL have
   * that exact category assigned.
   */
  it('all returned articles have the exact filtered category', () => {
    fc.assert(
      fc.property(
        fc.array(publishedArticleArb, { minLength: 0, maxLength: 30 }),
        categoryArb,
        (articles, category) => {
          const filtered = filterByCategory(articles, category);

          for (const article of filtered) {
            expect(article.metadata.category).toBe(category);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.6**
   *
   * No article with a different category SHALL appear in the filtered results.
   */
  it('no article with a different category appears in results', () => {
    fc.assert(
      fc.property(
        fc.array(publishedArticleArb, { minLength: 0, maxLength: 30 }),
        categoryArb,
        (articles, category) => {
          const filtered = filterByCategory(articles, category);
          const otherCategoryIds = articles
            .filter((a) => a.metadata.category !== category)
            .map((a) => a.id);

          const filteredIds = filtered.map((a) => a.id);

          for (const otherId of otherCategoryIds) {
            expect(filteredIds).not.toContain(otherId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.6**
   *
   * Every article in the input that matches the filter category SHALL
   * appear in the output (no matching article is incorrectly excluded).
   */
  it('every article matching the category from input appears in results', () => {
    fc.assert(
      fc.property(
        fc.array(publishedArticleArb, { minLength: 0, maxLength: 30 }),
        categoryArb,
        (articles, category) => {
          const filtered = filterByCategory(articles, category);
          const matchingIds = articles
            .filter((a) => a.metadata.category === category)
            .map((a) => a.id);

          const filteredIds = filtered.map((a) => a.id);

          for (const matchId of matchingIds) {
            expect(filteredIds).toContain(matchId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.6**
   *
   * The count of filtered results equals exactly the number of articles
   * in the input set that have the target category.
   */
  it('result count equals the number of articles with matching category in input', () => {
    fc.assert(
      fc.property(
        fc.array(publishedArticleArb, { minLength: 0, maxLength: 30 }),
        categoryArb,
        (articles, category) => {
          const filtered = filterByCategory(articles, category);
          const expectedCount = articles.filter(
            (a) => a.metadata.category === category
          ).length;

          expect(filtered.length).toBe(expectedCount);
        }
      ),
      { numRuns: 100 }
    );
  });
});
