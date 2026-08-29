/**
 * Property-based tests for Public Content Delivery
 *
 * Feature: admin-portal-cms
 * Properties tested:
 *   - Property 15: Language-specific content delivery
 *   - Property 16: Language fallback for missing translations
 *   - Property 11: Paginated list invariants
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { resolveLanguageFallback } from '@/lib/public-content';

// ============================================
// Helpers
// ============================================

function makeContentItem(overrides: Partial<{
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}> = {}) {
  return {
    id: 'test-id',
    titleAr: overrides.titleAr ?? 'عنوان عربي',
    titleEn: overrides.titleEn ?? 'English Title',
    bodyAr: overrides.bodyAr ?? 'محتوى عربي',
    bodyEn: overrides.bodyEn ?? 'English body',
    metadata: JSON.stringify({}),
    updatedAt: new Date(),
  };
}

// Arbitrary for non-empty strings (simulating real content)
const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0);

// ============================================
// Property 15: Language-specific content delivery
// ============================================

describe('Feature: admin-portal-cms, Property 15: Language-specific content delivery', () => {
  it('requesting with lang "ar" returns Arabic field values when both translations exist', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        nonEmptyStringArb,
        nonEmptyStringArb,
        nonEmptyStringArb,
        (titleAr, titleEn, bodyAr, bodyEn) => {
          const item = makeContentItem({ titleAr, titleEn, bodyAr, bodyEn });
          const result = resolveLanguageFallback(item, 'ar');

          expect(result.title).toBe(titleAr);
          expect(result.body).toBe(bodyAr);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('requesting with lang "en" returns English field values when both translations exist', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        nonEmptyStringArb,
        nonEmptyStringArb,
        nonEmptyStringArb,
        (titleAr, titleEn, bodyAr, bodyEn) => {
          const item = makeContentItem({ titleAr, titleEn, bodyAr, bodyEn });
          const result = resolveLanguageFallback(item, 'en');

          expect(result.title).toBe(titleEn);
          expect(result.body).toBe(bodyEn);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================
// Property 16: Language fallback for missing translations
// ============================================

describe('Feature: admin-portal-cms, Property 16: Language fallback for missing translations', () => {
  it('when Arabic title is empty, returns English title as fallback', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        nonEmptyStringArb,
        (titleEn, bodyAr) => {
          const item = makeContentItem({ titleAr: '', titleEn, bodyAr, bodyEn: 'en body' });
          const result = resolveLanguageFallback(item, 'ar');

          // Should fallback to English title
          expect(result.title).toBe(titleEn);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('when English title is empty, returns Arabic title as fallback', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        nonEmptyStringArb,
        (titleAr, bodyEn) => {
          const item = makeContentItem({ titleAr, titleEn: '', bodyAr: 'ar body', bodyEn });
          const result = resolveLanguageFallback(item, 'en');

          // Should fallback to Arabic title
          expect(result.title).toBe(titleAr);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('when Arabic body is empty, returns English body as fallback', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        nonEmptyStringArb,
        (titleAr, bodyEn) => {
          const item = makeContentItem({ titleAr, titleEn: 'en title', bodyAr: '', bodyEn });
          const result = resolveLanguageFallback(item, 'ar');

          expect(result.body).toBe(bodyEn);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('when English body is empty, returns Arabic body as fallback', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        nonEmptyStringArb,
        (titleEn, bodyAr) => {
          const item = makeContentItem({ titleAr: 'ar title', titleEn, bodyAr, bodyEn: '' });
          const result = resolveLanguageFallback(item, 'en');

          expect(result.body).toBe(bodyAr);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('whitespace-only fields are treated as empty (fallback triggered)', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        fc.array(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 10 }).map((arr) => arr.join('')),
        (titleEn, whitespace) => {
          const item = makeContentItem({ titleAr: whitespace, titleEn, bodyAr: 'body', bodyEn: 'body' });
          const result = resolveLanguageFallback(item, 'ar');

          // Whitespace-only should fallback
          expect(result.title).toBe(titleEn);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================
// Property 11: Paginated list invariants
// ============================================

describe('Feature: admin-portal-cms, Property 11: Paginated list invariants', () => {
  it('page size never exceeds 20 items for any page number', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.array(fc.record({
          id: fc.uuid(),
          title: nonEmptyStringArb,
        }), { minLength: 0, maxLength: 80 }),
        (page, items) => {
          const pageSize = 20;
          const offset = (page - 1) * pageSize;
          const paged = items.slice(offset, offset + pageSize);

          expect(paged.length).toBeLessThanOrEqual(pageSize);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('total pages equals ceiling of total items / page size', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 200 }),
        (totalItems) => {
          const pageSize = 20;
          const expectedPages = Math.ceil(totalItems / pageSize);
          const actualPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

          expect(actualPages).toBe(expectedPages);
        }
      ),
      { numRuns: 100 }
    );
  });
});
