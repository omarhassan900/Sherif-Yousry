/// <reference types="vitest/globals" />
/**
 * Property-based tests for media operations.
 *
 * Feature: admin-portal-cms
 * - Property 13: Media file validation
 * - Property 14: Media reference detection is complete
 */

import * as fc from 'fast-check';
import { validateMediaFile } from '@/lib/media';

// ============================================
// CONSTANTS
// ============================================

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_FILE_SIZE = 5_242_880; // 5 MB in bytes

// ============================================
// TYPES (for Property 14)
// ============================================

interface MediaReference {
  mediaId: string;
  contentId: string;
  fieldName: string;
}

interface ContentItem {
  id: string;
  type: string;
  metadata: Record<string, unknown>;
  bodyAr: string;
  bodyEn: string;
}

// ============================================
// PURE LOGIC FUNCTIONS (for Property 14)
// ============================================

/**
 * Detect all content items that reference a given media ID.
 * A content item references a media item if:
 * - The media ID appears in its metadata (e.g., featuredImageId)
 * - The media ID appears in bodyAr or bodyEn
 */
function detectMediaReferences(
  mediaId: string,
  contentItems: ContentItem[]
): MediaReference[] {
  const references: MediaReference[] = [];

  for (const item of contentItems) {
    // Check metadata fields for the media ID
    for (const [key, value] of Object.entries(item.metadata)) {
      if (value === mediaId) {
        references.push({ mediaId, contentId: item.id, fieldName: key });
      }
    }

    // Check body fields for embedded media reference
    if (item.bodyAr.includes(mediaId)) {
      references.push({ mediaId, contentId: item.id, fieldName: 'bodyAr' });
    }
    if (item.bodyEn.includes(mediaId)) {
      references.push({ mediaId, contentId: item.id, fieldName: 'bodyEn' });
    }
  }

  return references;
}

// ============================================
// GENERATORS
// ============================================

/** Generate a valid MIME type */
const validMimeTypeArb: fc.Arbitrary<string> = fc.constantFrom(...ALLOWED_MIME_TYPES);

/** Generate an invalid MIME type (not in the allowed set) */
const invalidMimeTypeArb: fc.Arbitrary<string> = fc
  .oneof(
    fc.constantFrom(
      'image/gif',
      'image/bmp',
      'image/svg+xml',
      'image/tiff',
      'application/pdf',
      'text/plain',
      'video/mp4',
      'audio/mpeg',
      'application/octet-stream'
    ),
    fc.string({ minLength: 1, maxLength: 50 }).filter(
      (s) => !ALLOWED_MIME_TYPES.includes(s as (typeof ALLOWED_MIME_TYPES)[number])
    )
  );

/** Generate a valid file size (0 to MAX_FILE_SIZE) */
const validFileSizeArb: fc.Arbitrary<number> = fc.integer({ min: 0, max: MAX_FILE_SIZE });

/** Generate an invalid file size (exceeds MAX_FILE_SIZE) */
const invalidFileSizeArb: fc.Arbitrary<number> = fc.integer({
  min: MAX_FILE_SIZE + 1,
  max: MAX_FILE_SIZE * 10,
});

/** Generate a content item that references a specific media ID */
function contentItemReferencingMedia(mediaId: string): fc.Arbitrary<ContentItem> {
  return fc
    .tuple(
      fc.uuid(),
      fc.constantFrom('service', 'article', 'page_section'),
      fc.constantFrom('featuredImageId', 'imageId', 'coverImage'),
      fc.boolean(), // whether reference is in metadata
      fc.boolean() // whether reference is in body
    )
    .map(([id, type, fieldName, inMetadata, inBody]) => {
      const metadata: Record<string, unknown> = {};
      let bodyAr = 'محتوى عربي';
      let bodyEn = 'English content';

      // At least one reference type must exist
      if (inMetadata || (!inMetadata && !inBody)) {
        metadata[fieldName] = mediaId;
      }
      if (inBody) {
        bodyEn = `<img src="/uploads/${mediaId}" />`;
      }

      return { id, type, metadata, bodyAr, bodyEn };
    });
}

/** Generate a content item that does NOT reference a specific media ID */
function contentItemNotReferencingMedia(mediaId: string): fc.Arbitrary<ContentItem> {
  return fc
    .tuple(
      fc.uuid(),
      fc.constantFrom('service', 'article', 'page_section'),
      fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s !== mediaId),
      fc.string({ minLength: 1, maxLength: 100 }).filter((s) => !s.includes(mediaId)),
      fc.string({ minLength: 1, maxLength: 100 }).filter((s) => !s.includes(mediaId))
    )
    .map(([id, type, metaValue, bodyAr, bodyEn]) => ({
      id,
      type,
      metadata: { someField: metaValue },
      bodyAr,
      bodyEn,
    }));
}

// ============================================
// Property 13: Media file validation
// ============================================

describe('Feature: admin-portal-cms, Property 13: Media file validation', () => {
  /**
   * **Validates: Requirements 8.1, 8.2**
   *
   * For any file with a valid MIME type and valid size,
   * the validator SHALL accept the file.
   */
  it('accepts files with valid MIME type and size within limit', () => {
    fc.assert(
      fc.property(validMimeTypeArb, validFileSizeArb, (type, size) => {
        const result = validateMediaFile({ type, size });
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.1, 8.2**
   *
   * For any file with an invalid MIME type (regardless of size),
   * the validator SHALL reject the file.
   */
  it('rejects files with invalid MIME type regardless of size', () => {
    fc.assert(
      fc.property(
        invalidMimeTypeArb,
        fc.integer({ min: 0, max: MAX_FILE_SIZE * 10 }),
        (type, size) => {
          const result = validateMediaFile({ type, size });
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.1, 8.2**
   *
   * For any file with a valid MIME type but size exceeding 5 MB,
   * the validator SHALL reject the file.
   */
  it('rejects files with valid MIME type but size exceeding 5 MB', () => {
    fc.assert(
      fc.property(validMimeTypeArb, invalidFileSizeArb, (type, size) => {
        const result = validateMediaFile({ type, size });
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.1, 8.2**
   *
   * The boundary condition: a file with exactly 5,242,880 bytes should be accepted,
   * and a file with 5,242,881 bytes should be rejected.
   */
  it('accepts file at exact size boundary (5,242,880 bytes) and rejects one byte over', () => {
    fc.assert(
      fc.property(validMimeTypeArb, (type) => {
        const atLimit = validateMediaFile({ type, size: MAX_FILE_SIZE });
        expect(atLimit.valid).toBe(true);

        const overLimit = validateMediaFile({ type, size: MAX_FILE_SIZE + 1 });
        expect(overLimit.valid).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.1, 8.2**
   *
   * For any file, validation accepts if and only if MIME type is allowed AND size <= 5MB.
   * This is the biconditional property.
   */
  it('accepts if and only if MIME type is allowed AND size is within limit', () => {
    fc.assert(
      fc.property(
        fc.oneof(validMimeTypeArb, invalidMimeTypeArb),
        fc.integer({ min: 0, max: MAX_FILE_SIZE * 5 }),
        (type, size) => {
          const result = validateMediaFile({ type, size });
          const isAllowedType = ALLOWED_MIME_TYPES.includes(
            type as (typeof ALLOWED_MIME_TYPES)[number]
          );
          const isWithinSize = size <= MAX_FILE_SIZE;
          const shouldBeValid = isAllowedType && isWithinSize;

          expect(result.valid).toBe(shouldBeValid);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================
// Property 14: Media reference detection is complete
// ============================================

describe('Feature: admin-portal-cms, Property 14: Media reference detection is complete', () => {
  /**
   * **Validates: Requirements 8.6**
   *
   * For any media item and set of content items that reference it,
   * the reference detection function SHALL return all referencing items (no false negatives).
   */
  it('detects all content items that reference the media item (no false negatives)', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.array(fc.uuid(), { minLength: 1, maxLength: 10 }),
        (mediaId, referencingIds) => {
          // Create content items that reference the media
          const referencingItems: ContentItem[] = referencingIds.map((id) => ({
            id,
            type: 'article',
            metadata: { featuredImageId: mediaId },
            bodyAr: 'محتوى',
            bodyEn: 'content',
          }));

          const result = detectMediaReferences(mediaId, referencingItems);
          const detectedContentIds = result.map((r) => r.contentId);

          // Every referencing item must be detected
          for (const item of referencingItems) {
            expect(detectedContentIds).toContain(item.id);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.6**
   *
   * For any media item and set of content items that do NOT reference it,
   * the reference detection function SHALL return no results (no false positives).
   */
  it('does not return content items that do not reference the media item (no false positives)', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.array(contentItemNotReferencingMedia('target-media-id-xyz'), {
          minLength: 0,
          maxLength: 10,
        }),
        (_mediaId, nonReferencingItems) => {
          const targetMediaId = 'target-media-id-xyz';
          const result = detectMediaReferences(targetMediaId, nonReferencingItems);

          // No non-referencing item should be detected
          expect(result.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.6**
   *
   * For any media item with a mix of referencing and non-referencing content items,
   * the detection SHALL return exactly the referencing items.
   */
  it('correctly separates referencing from non-referencing items in a mixed set', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }),
        fc.array(
          fc.tuple(
            fc.uuid(),
            fc.string({ minLength: 1, maxLength: 20 }),
            fc.string({ minLength: 1, maxLength: 20 })
          ),
          { minLength: 1, maxLength: 5 }
        ),
        (mediaId, referencingIds, nonRefData) => {
          // Create referencing items
          const referencingItems: ContentItem[] = referencingIds.map((id) => ({
            id,
            type: 'article',
            metadata: { featuredImageId: mediaId },
            bodyAr: 'محتوى',
            bodyEn: 'content',
          }));

          // Create non-referencing items (filter out those that accidentally contain mediaId)
          const nonReferencingItems: ContentItem[] = nonRefData
            .filter(
              ([id, bodyAr, bodyEn]) =>
                !id.includes(mediaId) &&
                !bodyAr.includes(mediaId) &&
                !bodyEn.includes(mediaId)
            )
            .map(([id, bodyAr, bodyEn]) => ({
              id,
              type: 'service',
              metadata: { someField: 'unrelated' },
              bodyAr,
              bodyEn,
            }));

          const allItems = [...referencingItems, ...nonReferencingItems];
          const result = detectMediaReferences(mediaId, allItems);
          const detectedContentIds = result.map((r) => r.contentId);

          // All referencing items must be detected
          for (const item of referencingItems) {
            expect(detectedContentIds).toContain(item.id);
          }

          // No non-referencing item should be detected
          for (const item of nonReferencingItems) {
            expect(detectedContentIds).not.toContain(item.id);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.6**
   *
   * All returned references SHALL have the correct mediaId field.
   */
  it('all returned references have the correct mediaId', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.array(contentItemReferencingMedia('test-media-fixed-id'), {
          minLength: 1,
          maxLength: 10,
        }),
        (_generatedId, contentItems) => {
          const targetMediaId = 'test-media-fixed-id';
          const result = detectMediaReferences(targetMediaId, contentItems);

          for (const ref of result) {
            expect(ref.mediaId).toBe(targetMediaId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
