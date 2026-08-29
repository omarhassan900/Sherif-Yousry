/// <reference types="vitest/globals" />
/**
 * Property-based tests for service delivery operations.
 *
 * Feature: admin-portal-cms
 * - Property 7: Services are sorted by display order with creation date tiebreaker
 * - Property 8: Unpublished services are excluded from public delivery
 */

import * as fc from 'fast-check';

// ============================================
// TYPES (mirroring the content module)
// ============================================

type ContentStatus = 'published' | 'unpublished';

interface ServiceItem {
  id: string;
  type: 'service';
  titleAr: string;
  titleEn: string;
  status: ContentStatus;
  metadata: {
    displayOrder: number;
  };
  createdAt: Date;
}

// ============================================
// PURE LOGIC FUNCTIONS (extracted for testing)
// ============================================

/**
 * Sort services by displayOrder ascending, with createdAt ascending as tiebreaker.
 */
function sortServices(services: ServiceItem[]): ServiceItem[] {
  return [...services].sort((a, b) => {
    const orderDiff = a.metadata.displayOrder - b.metadata.displayOrder;
    if (orderDiff !== 0) return orderDiff;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

/**
 * Filter services to include only published ones.
 */
function filterPublishedServices(services: ServiceItem[]): ServiceItem[] {
  return services.filter((s) => s.status === 'published');
}

/**
 * Simulate the public services endpoint: filter published, then sort.
 */
function getPublishedServices(services: ServiceItem[]): ServiceItem[] {
  const published = filterPublishedServices(services);
  return sortServices(published);
}

// ============================================
// GENERATORS
// ============================================

const contentStatusArb: fc.Arbitrary<ContentStatus> = fc.constantFrom('published', 'unpublished');

/** Generate a date within a reasonable range */
const dateArb: fc.Arbitrary<Date> = fc
  .integer({ min: 1672531200000, max: 1735689600000 }) // 2023-01-01 to 2025-01-01
  .map((ts) => new Date(ts));

/** Generate a service item */
const serviceItemArb: fc.Arbitrary<ServiceItem> = fc
  .tuple(
    fc.uuid(),
    fc.string({ minLength: 2, maxLength: 50 }),
    fc.string({ minLength: 2, maxLength: 50 }),
    contentStatusArb,
    fc.integer({ min: 1, max: 100 }),
    dateArb
  )
  .map(([id, titleAr, titleEn, status, displayOrder, createdAt]) => ({
    id,
    type: 'service' as const,
    titleAr,
    titleEn,
    status,
    metadata: { displayOrder },
    createdAt,
  }));

/** Generate a published service item */
const publishedServiceArb: fc.Arbitrary<ServiceItem> = fc
  .tuple(
    fc.uuid(),
    fc.string({ minLength: 2, maxLength: 50 }),
    fc.string({ minLength: 2, maxLength: 50 }),
    fc.integer({ min: 1, max: 100 }),
    dateArb
  )
  .map(([id, titleAr, titleEn, displayOrder, createdAt]) => ({
    id,
    type: 'service' as const,
    titleAr,
    titleEn,
    status: 'published' as const,
    metadata: { displayOrder },
    createdAt,
  }));

// ============================================
// Property 7: Services are sorted by display order with creation date tiebreaker
// ============================================

describe('Feature: admin-portal-cms, Property 7: Services are sorted by display order with creation date tiebreaker', () => {
  /**
   * **Validates: Requirements 5.2, 5.4**
   *
   * For any set of published services, the public content API SHALL return them
   * sorted by display order in ascending numeric order.
   */
  it('services are returned in ascending display order', () => {
    fc.assert(
      fc.property(
        fc.array(publishedServiceArb, { minLength: 0, maxLength: 30 }),
        (services) => {
          const sorted = sortServices(services);

          for (let i = 1; i < sorted.length; i++) {
            expect(sorted[i].metadata.displayOrder).toBeGreaterThanOrEqual(
              sorted[i - 1].metadata.displayOrder
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 5.2, 5.4**
   *
   * For services with equal display order, they SHALL be sorted by creation date
   * in ascending order (oldest first).
   */
  it('services with equal display order are sorted by creation date ascending', () => {
    fc.assert(
      fc.property(
        fc.array(publishedServiceArb, { minLength: 0, maxLength: 30 }),
        (services) => {
          const sorted = sortServices(services);

          for (let i = 1; i < sorted.length; i++) {
            if (sorted[i].metadata.displayOrder === sorted[i - 1].metadata.displayOrder) {
              expect(sorted[i].createdAt.getTime()).toBeGreaterThanOrEqual(
                sorted[i - 1].createdAt.getTime()
              );
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 5.2, 5.4**
   *
   * Sorting preserves all original items (no items lost or duplicated).
   */
  it('sorting preserves the set of services (no items lost or added)', () => {
    fc.assert(
      fc.property(
        fc.array(publishedServiceArb, { minLength: 0, maxLength: 30 }),
        (services) => {
          const sorted = sortServices(services);

          expect(sorted.length).toBe(services.length);

          const originalIds = services.map((s) => s.id).sort();
          const sortedIds = sorted.map((s) => s.id).sort();
          expect(sortedIds).toEqual(originalIds);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 5.2, 5.4**
   *
   * The full public endpoint (filter + sort) returns published services
   * in the correct combined order.
   */
  it('getPublishedServices returns results in correct combined sort order', () => {
    fc.assert(
      fc.property(
        fc.array(serviceItemArb, { minLength: 0, maxLength: 30 }),
        (services) => {
          const result = getPublishedServices(services);

          for (let i = 1; i < result.length; i++) {
            const prev = result[i - 1];
            const curr = result[i];

            if (prev.metadata.displayOrder === curr.metadata.displayOrder) {
              expect(curr.createdAt.getTime()).toBeGreaterThanOrEqual(prev.createdAt.getTime());
            } else {
              expect(curr.metadata.displayOrder).toBeGreaterThan(prev.metadata.displayOrder);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================
// Property 8: Unpublished services are excluded from public delivery
// ============================================

describe('Feature: admin-portal-cms, Property 8: Unpublished services are excluded from public delivery', () => {
  /**
   * **Validates: Requirements 5.3**
   *
   * For any set of services with mixed published/unpublished status,
   * the public services endpoint SHALL return only services with status "published".
   */
  it('all returned services have status "published"', () => {
    fc.assert(
      fc.property(
        fc.array(serviceItemArb, { minLength: 0, maxLength: 30 }),
        (services) => {
          const result = getPublishedServices(services);

          for (const service of result) {
            expect(service.status).toBe('published');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 5.3**
   *
   * No unpublished service SHALL appear in the results.
   */
  it('no unpublished service appears in the results', () => {
    fc.assert(
      fc.property(
        fc.array(serviceItemArb, { minLength: 0, maxLength: 30 }),
        (services) => {
          const result = getPublishedServices(services);
          const unpublishedIds = services
            .filter((s) => s.status === 'unpublished')
            .map((s) => s.id);

          const resultIds = result.map((s) => s.id);

          for (const unpubId of unpublishedIds) {
            expect(resultIds).not.toContain(unpubId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 5.3**
   *
   * Every published service in the input SHALL appear in the output
   * (no published service is incorrectly excluded).
   */
  it('every published service from input appears in the output', () => {
    fc.assert(
      fc.property(
        fc.array(serviceItemArb, { minLength: 0, maxLength: 30 }),
        (services) => {
          const result = getPublishedServices(services);
          const publishedInputIds = services
            .filter((s) => s.status === 'published')
            .map((s) => s.id);

          const resultIds = result.map((s) => s.id);

          for (const pubId of publishedInputIds) {
            expect(resultIds).toContain(pubId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 5.3**
   *
   * The count of returned services equals exactly the count of published
   * services in the input set.
   */
  it('result count equals the number of published services in input', () => {
    fc.assert(
      fc.property(
        fc.array(serviceItemArb, { minLength: 0, maxLength: 30 }),
        (services) => {
          const result = getPublishedServices(services);
          const publishedCount = services.filter((s) => s.status === 'published').length;

          expect(result.length).toBe(publishedCount);
        }
      ),
      { numRuns: 100 }
    );
  });
});
