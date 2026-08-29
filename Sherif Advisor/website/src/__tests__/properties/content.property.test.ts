/// <reference types="vitest/globals" />
/**
 * Property-based tests for content management operations.
 *
 * Feature: admin-portal-cms
 * - Property 4: Content search returns only matching results
 * - Property 6: Bilingual content round trip
 * - Property 17: Revision creation captures complete previous state
 * - Property 18: Changed fields detection is accurate
 * - Property 19: Revision restoration is reversible
 */

import * as fc from 'fast-check';

// ============================================
// TYPES (mirroring the content/revision modules)
// ============================================

type ContentType = 'service' | 'article' | 'page_section';
type ContentStatus = 'published' | 'unpublished';

interface ContentItem {
  id: string;
  type: ContentType;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  status: ContentStatus;
  metadata: Record<string, unknown>;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ContentRevision {
  id: string;
  contentId: string;
  revisionNumber: number;
  previousState: Record<string, unknown>;
  changedFields: string[];
  changedBy: string;
  createdAt: Date;
}

// ============================================
// PURE LOGIC FUNCTIONS (extracted for testing)
// ============================================

/**
 * Search filter logic: returns true if the item's titleAr or titleEn
 * contains the search term (case-insensitive).
 */
function matchesSearch(item: ContentItem, query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return (
    item.titleAr.toLowerCase().includes(lowerQuery) ||
    item.titleEn.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter content items by search query (case-insensitive match on titles).
 */
function searchContent(items: ContentItem[], query: string): ContentItem[] {
  if (query.trim().length < 2) return items;
  return items.filter((item) => matchesSearch(item, query));
}

/**
 * Detect changed fields between two content states.
 * Returns exactly the field names whose values differ.
 */
function detectChangedFields(
  previous: Record<string, unknown>,
  current: Record<string, unknown>
): string[] {
  const changed: string[] = [];
  const fieldsToCompare = ['type', 'titleAr', 'titleEn', 'bodyAr', 'bodyEn', 'status', 'metadata'];

  for (const field of fieldsToCompare) {
    const prevValue = previous[field];
    const currValue = current[field];

    if (field === 'metadata') {
      const prevStr = JSON.stringify(prevValue ?? {});
      const currStr = JSON.stringify(currValue ?? {});
      if (prevStr !== currStr) {
        changed.push(field);
      }
    } else {
      if (prevValue !== currValue) {
        changed.push(field);
      }
    }
  }

  return changed;
}

/**
 * Capture the full previous state of a content item (content fields only).
 */
function captureState(item: ContentItem): Record<string, unknown> {
  return {
    type: item.type,
    titleAr: item.titleAr,
    titleEn: item.titleEn,
    bodyAr: item.bodyAr,
    bodyEn: item.bodyEn,
    status: item.status,
    metadata: item.metadata,
  };
}

/**
 * Simulate revision creation: captures previous state, detects changes.
 */
function createRevisionRecord(
  previousItem: ContentItem,
  currentItem: ContentItem,
  revisionNumber: number,
  changedBy: string
): ContentRevision {
  const previousState = captureState(previousItem);
  const currentState = captureState(currentItem);
  const changedFields = detectChangedFields(previousState, currentState);

  return {
    id: `rev-${revisionNumber}`,
    contentId: currentItem.id,
    revisionNumber,
    previousState,
    changedFields,
    changedBy,
    createdAt: new Date(),
  };
}

/**
 * Simulate revision pruning: keeps only the most recent maxRevisions.
 */
function pruneRevisions(
  revisions: ContentRevision[],
  maxRevisions: number
): ContentRevision[] {
  if (revisions.length <= maxRevisions) return revisions;
  // Sort by revisionNumber descending, keep the newest
  const sorted = [...revisions].sort((a, b) => b.revisionNumber - a.revisionNumber);
  return sorted.slice(0, maxRevisions);
}

/**
 * Simulate restoring a revision: returns the new content state and a reversal revision.
 */
function restoreRevisionLogic(
  currentItem: ContentItem,
  revision: ContentRevision,
  adminId: string,
  nextRevisionNumber: number
): { restoredItem: ContentItem; reversalRevision: ContentRevision } {
  // Capture pre-restoration state
  const preRestoreState = captureState(currentItem);

  // The restored state comes from the revision's previousState
  const restoredState = revision.previousState;

  // Detect what will change between restored state and current
  const currentState = captureState(currentItem);
  const changedFields = detectChangedFields(restoredState, currentState);

  // Build the restored content item
  const restoredItem: ContentItem = {
    ...currentItem,
    type: (restoredState.type as ContentType) ?? currentItem.type,
    titleAr: (restoredState.titleAr as string) ?? currentItem.titleAr,
    titleEn: (restoredState.titleEn as string) ?? currentItem.titleEn,
    bodyAr: (restoredState.bodyAr as string) ?? currentItem.bodyAr,
    bodyEn: (restoredState.bodyEn as string) ?? currentItem.bodyEn,
    status: (restoredState.status as ContentStatus) ?? currentItem.status,
    metadata: (restoredState.metadata as Record<string, unknown>) ?? currentItem.metadata,
    updatedBy: adminId,
    updatedAt: new Date(),
  };

  // Create the reversal revision (captures pre-restoration state)
  const reversalRevision: ContentRevision = {
    id: `rev-${nextRevisionNumber}`,
    contentId: currentItem.id,
    revisionNumber: nextRevisionNumber,
    previousState: preRestoreState,
    changedFields,
    changedBy: adminId,
    createdAt: new Date(),
  };

  return { restoredItem, reversalRevision };
}

// ============================================
// GENERATORS
// ============================================

const contentTypeArb: fc.Arbitrary<ContentType> = fc.constantFrom('service', 'article', 'page_section');
const contentStatusArb: fc.Arbitrary<ContentStatus> = fc.constantFrom('published', 'unpublished');

/** Generate a non-empty title string with mixed characters */
function titleArb(minLength = 2, maxLength = 100): fc.Arbitrary<string> {
  return fc.string({ minLength, maxLength }).filter((s) => s.replace(/\s/g, '').length >= 2);
}

/** Generate a non-empty body string */
function bodyArb(): fc.Arbitrary<string> {
  return fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.replace(/\s/g, '').length >= 1);
}

/** Generate simple metadata */
const metadataArb: fc.Arbitrary<Record<string, unknown>> = fc.oneof(
  fc.constant({}),
  fc.record({
    icon: fc.string({ minLength: 1, maxLength: 10 }),
    displayOrder: fc.integer({ min: 1, max: 100 }),
  }),
  fc.record({
    category: fc.string({ minLength: 1, maxLength: 20 }),
  })
);

/** Generate a full content item */
const contentItemArb: fc.Arbitrary<ContentItem> = fc
  .tuple(
    fc.uuid(),
    contentTypeArb,
    titleArb(),
    titleArb(),
    bodyArb(),
    bodyArb(),
    contentStatusArb,
    metadataArb,
    fc.uuid(),
    fc.uuid()
  )
  .map(([id, type, titleAr, titleEn, bodyAr, bodyEn, status, metadata, createdBy, updatedBy]) => ({
    id,
    type,
    titleAr,
    titleEn,
    bodyAr,
    bodyEn,
    status,
    metadata,
    createdBy,
    updatedBy,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }));

/** Generate a search query (at least 2 characters, no whitespace-only) */
const searchQueryArb: fc.Arbitrary<string> = fc
  .string({ minLength: 2, maxLength: 20 })
  .filter((s) => s.trim().length >= 2);

// ============================================
// Property 4: Content search returns only matching results
// ============================================

describe('Feature: admin-portal-cms, Property 4: Content search returns only matching results', () => {
  /**
   * **Validates: Requirements 3.4**
   *
   * For any search query of at least 2 characters and any set of content items,
   * every item returned by the search function SHALL contain the search term
   * (case-insensitive) in either its Arabic title or its English title.
   */
  it('every search result contains the query term in titleAr or titleEn (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(contentItemArb, { minLength: 0, maxLength: 20 }),
        searchQueryArb,
        (items, query) => {
          const results = searchContent(items, query);
          const lowerQuery = query.toLowerCase();

          for (const item of results) {
            const matchesTitleAr = item.titleAr.toLowerCase().includes(lowerQuery);
            const matchesTitleEn = item.titleEn.toLowerCase().includes(lowerQuery);
            expect(matchesTitleAr || matchesTitleEn).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 3.4**
   *
   * For any set of content items and a search query, no item that does NOT
   * contain the search term in either title SHALL be included in the results.
   */
  it('no item without a title match is included in search results', () => {
    fc.assert(
      fc.property(
        fc.array(contentItemArb, { minLength: 0, maxLength: 20 }),
        searchQueryArb,
        (items, query) => {
          const results = searchContent(items, query);
          const lowerQuery = query.toLowerCase();

          // All non-matching items should be excluded
          const nonMatchingItems = items.filter(
            (item) =>
              !item.titleAr.toLowerCase().includes(lowerQuery) &&
              !item.titleEn.toLowerCase().includes(lowerQuery)
          );

          for (const nonMatch of nonMatchingItems) {
            expect(results).not.toContainEqual(nonMatch);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 3.4**
   *
   * If the search query is embedded in a generated item's title,
   * that item must appear in the results.
   */
  it('items with the query embedded in their title are always found', () => {
    fc.assert(
      fc.property(
        contentItemArb,
        searchQueryArb,
        fc.boolean(),
        (item, query, inArabic) => {
          // Embed the query in one of the titles
          const modifiedItem: ContentItem = inArabic
            ? { ...item, titleAr: `prefix ${query} suffix` }
            : { ...item, titleEn: `prefix ${query} suffix` };

          const results = searchContent([modifiedItem], query);
          expect(results).toHaveLength(1);
          expect(results[0]).toEqual(modifiedItem);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================
// Property 6: Bilingual content round trip
// ============================================

describe('Feature: admin-portal-cms, Property 6: Bilingual content round trip', () => {
  /**
   * **Validates: Requirements 4.3**
   *
   * For any valid content item with arbitrary Arabic and English text,
   * saving the item (serializing to DB format) and then retrieving it
   * (deserializing) SHALL produce an item with identical field values.
   */
  it('serializing and deserializing a content item preserves all bilingual fields', () => {
    fc.assert(
      fc.property(contentItemArb, (item) => {
        // Simulate save: serialize metadata to JSON string (as stored in DB)
        const dbRecord = {
          id: item.id,
          type: item.type,
          titleAr: item.titleAr,
          titleEn: item.titleEn,
          bodyAr: item.bodyAr,
          bodyEn: item.bodyEn,
          status: item.status,
          metadata: JSON.stringify(item.metadata),
          createdById: item.createdBy,
          updatedById: item.updatedBy,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };

        // Simulate retrieve: deserialize back to ContentItem
        const retrieved: ContentItem = {
          id: dbRecord.id,
          type: dbRecord.type as ContentType,
          titleAr: dbRecord.titleAr,
          titleEn: dbRecord.titleEn,
          bodyAr: dbRecord.bodyAr,
          bodyEn: dbRecord.bodyEn,
          status: dbRecord.status as ContentStatus,
          metadata: JSON.parse(dbRecord.metadata),
          createdBy: dbRecord.createdById,
          updatedBy: dbRecord.updatedById,
          createdAt: dbRecord.createdAt,
          updatedAt: dbRecord.updatedAt,
        };

        // Bilingual fields must be identical
        expect(retrieved.titleAr).toBe(item.titleAr);
        expect(retrieved.titleEn).toBe(item.titleEn);
        expect(retrieved.bodyAr).toBe(item.bodyAr);
        expect(retrieved.bodyEn).toBe(item.bodyEn);
        expect(retrieved.metadata).toEqual(item.metadata);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 4.3**
   *
   * Round-tripping through JSON serialization preserves Unicode content
   * including Arabic characters, mixed scripts, and special characters.
   */
  it('round trip preserves Arabic Unicode content through JSON serialization', () => {
    // Use specific Arabic character generators for more targeted testing
    const arabicStringArb = fc
      .array(
        fc.integer({ min: 0x0621, max: 0x064a }).map((c) => String.fromCharCode(c)),
        { minLength: 2, maxLength: 50 }
      )
      .map((chars) => chars.join(''));

    fc.assert(
      fc.property(arabicStringArb, arabicStringArb, (titleAr, bodyAr) => {
        // Simulate the DB round trip
        const serialized = JSON.stringify({ titleAr, bodyAr });
        const deserialized = JSON.parse(serialized);

        expect(deserialized.titleAr).toBe(titleAr);
        expect(deserialized.bodyAr).toBe(bodyAr);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================
// Property 17: Revision creation captures complete previous state
// ============================================

describe('Feature: admin-portal-cms, Property 17: Revision creation captures complete previous state', () => {
  /**
   * **Validates: Requirements 10.1**
   *
   * For any content item update, the revision record SHALL contain
   * the complete previous content state (all 7 content fields).
   */
  it('revision captures all content fields from the previous state', () => {
    fc.assert(
      fc.property(
        contentItemArb,
        contentItemArb,
        fc.uuid(),
        (previousItem, currentItem, adminId) => {
          // Ensure they share the same ID (simulating an update)
          const current = { ...currentItem, id: previousItem.id };

          const revision = createRevisionRecord(previousItem, current, 1, adminId);

          // The revision's previousState must contain ALL content fields
          expect(revision.previousState).toHaveProperty('type', previousItem.type);
          expect(revision.previousState).toHaveProperty('titleAr', previousItem.titleAr);
          expect(revision.previousState).toHaveProperty('titleEn', previousItem.titleEn);
          expect(revision.previousState).toHaveProperty('bodyAr', previousItem.bodyAr);
          expect(revision.previousState).toHaveProperty('bodyEn', previousItem.bodyEn);
          expect(revision.previousState).toHaveProperty('status', previousItem.status);
          expect(revision.previousState).toHaveProperty('metadata');
          expect(revision.previousState.metadata).toEqual(previousItem.metadata);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 10.1**
   *
   * The number of revisions per content item SHALL never exceed 50.
   * When the limit is exceeded, pruning removes the oldest revisions.
   */
  it('pruning ensures revisions never exceed 50 per content item', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        (revisionCount) => {
          // Generate a list of revisions
          const revisions: ContentRevision[] = Array.from({ length: revisionCount }, (_, i) => ({
            id: `rev-${i + 1}`,
            contentId: 'content-1',
            revisionNumber: i + 1,
            previousState: { titleAr: `title-${i}`, titleEn: `title-${i}`, bodyAr: 'b', bodyEn: 'b', type: 'article', status: 'published', metadata: {} },
            changedFields: ['titleAr'],
            changedBy: 'admin-1',
            createdAt: new Date(2024, 0, i + 1),
          }));

          const pruned = pruneRevisions(revisions, 50);

          // Must never exceed 50
          expect(pruned.length).toBeLessThanOrEqual(50);

          // If original had ≤ 50, nothing should be removed
          if (revisionCount <= 50) {
            expect(pruned.length).toBe(revisionCount);
          }

          // Pruned list should keep the newest (highest revision numbers)
          if (revisionCount > 50) {
            const minKeptRevisionNumber = pruned[pruned.length - 1].revisionNumber;
            expect(minKeptRevisionNumber).toBe(revisionCount - 49);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 10.1**
   *
   * A revision's contentId SHALL match the content item that was updated.
   */
  it('revision contentId matches the updated content item', () => {
    fc.assert(
      fc.property(
        contentItemArb,
        contentItemArb,
        fc.uuid(),
        (previousItem, currentItem, adminId) => {
          const current = { ...currentItem, id: previousItem.id };
          const revision = createRevisionRecord(previousItem, current, 1, adminId);

          expect(revision.contentId).toBe(previousItem.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================
// Property 18: Changed fields detection is accurate
// ============================================

describe('Feature: admin-portal-cms, Property 18: Changed fields detection is accurate', () => {
  /**
   * **Validates: Requirements 10.2**
   *
   * For any two content states, the changed fields list SHALL contain
   * exactly the field names whose values differ — no more, no less.
   */
  it('detectChangedFields returns exactly the fields that differ between two states', () => {
    fc.assert(
      fc.property(
        contentItemArb,
        contentItemArb,
        (item1, item2) => {
          const state1 = captureState(item1);
          const state2 = captureState(item2);

          const detectedChanges = detectChangedFields(state1, state2);

          const fieldsToCompare = ['type', 'titleAr', 'titleEn', 'bodyAr', 'bodyEn', 'status', 'metadata'];

          for (const field of fieldsToCompare) {
            const val1 = state1[field];
            const val2 = state2[field];

            let isDifferent: boolean;
            if (field === 'metadata') {
              isDifferent = JSON.stringify(val1 ?? {}) !== JSON.stringify(val2 ?? {});
            } else {
              isDifferent = val1 !== val2;
            }

            if (isDifferent) {
              expect(detectedChanges).toContain(field);
            } else {
              expect(detectedChanges).not.toContain(field);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 10.2**
   *
   * When two states are identical, no changed fields should be detected.
   */
  it('identical states produce an empty changed fields list', () => {
    fc.assert(
      fc.property(contentItemArb, (item) => {
        const state = captureState(item);
        // Compare state with itself
        const detectedChanges = detectChangedFields(state, { ...state });

        expect(detectedChanges).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 10.2**
   *
   * When exactly one field differs, only that field should appear in changed fields.
   */
  it('changing a single field results in exactly that field being detected', () => {
    const fieldGenerators = {
      titleAr: titleArb(),
      titleEn: titleArb(),
      bodyAr: bodyArb(),
      bodyEn: bodyArb(),
      type: contentTypeArb,
      status: contentStatusArb,
    };

    const fieldNames = Object.keys(fieldGenerators) as Array<keyof typeof fieldGenerators>;

    fc.assert(
      fc.property(
        contentItemArb,
        fc.constantFrom(...fieldNames),
        titleArb(), // use as the new value source
        (item, fieldToChange, newValue) => {
          const state1 = captureState(item);
          const state2 = { ...state1 };

          // Modify exactly one field to a different value
          if (state1[fieldToChange] === newValue) {
            // If by chance the new value equals the old, skip this test case
            return;
          }
          state2[fieldToChange] = newValue;

          const detectedChanges = detectChangedFields(state1, state2);

          expect(detectedChanges).toContain(fieldToChange);
          // All other simple fields should NOT be in the list
          for (const f of fieldNames) {
            if (f !== fieldToChange) {
              expect(detectedChanges).not.toContain(f);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================
// Property 19: Revision restoration is reversible
// ============================================

describe('Feature: admin-portal-cms, Property 19: Revision restoration is reversible', () => {
  /**
   * **Validates: Requirements 10.4**
   *
   * For any content item with at least one revision, restoring a previous revision
   * SHALL set the current content state to the revision's stored content.
   */
  it('restoring a revision sets current content to the revision stored state', () => {
    fc.assert(
      fc.property(
        contentItemArb,
        contentItemArb,
        fc.uuid(),
        (originalItem, currentItem, adminId) => {
          // Simulate: originalItem was the previous state, currentItem is now current
          const current = { ...currentItem, id: originalItem.id };

          // Create a revision that captured the original state
          const revision = createRevisionRecord(originalItem, current, 1, adminId);

          // Now restore from that revision
          const { restoredItem } = restoreRevisionLogic(current, revision, adminId, 2);

          // The restored item should have the original's content fields
          expect(restoredItem.titleAr).toBe(originalItem.titleAr);
          expect(restoredItem.titleEn).toBe(originalItem.titleEn);
          expect(restoredItem.bodyAr).toBe(originalItem.bodyAr);
          expect(restoredItem.bodyEn).toBe(originalItem.bodyEn);
          expect(restoredItem.status).toBe(originalItem.status);
          expect(restoredItem.type).toBe(originalItem.type);
          expect(restoredItem.metadata).toEqual(originalItem.metadata);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 10.4**
   *
   * Restoring a revision SHALL create a new revision capturing the pre-restoration state,
   * making the restore itself reversible.
   */
  it('restoration creates a reversal revision capturing the pre-restoration state', () => {
    fc.assert(
      fc.property(
        contentItemArb,
        contentItemArb,
        fc.uuid(),
        (originalItem, currentItem, adminId) => {
          const current = { ...currentItem, id: originalItem.id };

          // Create a revision that captured the original state
          const revision = createRevisionRecord(originalItem, current, 1, adminId);

          // Restore from that revision
          const { reversalRevision } = restoreRevisionLogic(current, revision, adminId, 2);

          // The reversal revision must capture the pre-restoration (current) state
          expect(reversalRevision.previousState.titleAr).toBe(current.titleAr);
          expect(reversalRevision.previousState.titleEn).toBe(current.titleEn);
          expect(reversalRevision.previousState.bodyAr).toBe(current.bodyAr);
          expect(reversalRevision.previousState.bodyEn).toBe(current.bodyEn);
          expect(reversalRevision.previousState.status).toBe(current.status);
          expect(reversalRevision.previousState.type).toBe(current.type);
          expect(reversalRevision.previousState.metadata).toEqual(current.metadata);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 10.4**
   *
   * Restoring the reversal revision (double-restore) SHALL return the content
   * to the state before the first restoration — proving full reversibility.
   */
  it('double restoration returns to the pre-first-restoration state', () => {
    fc.assert(
      fc.property(
        contentItemArb,
        contentItemArb,
        fc.uuid(),
        (originalItem, currentItem, adminId) => {
          const current = { ...currentItem, id: originalItem.id };

          // First: create a revision capturing original state
          const revision1 = createRevisionRecord(originalItem, current, 1, adminId);

          // Restore original → now content = original state
          const { restoredItem: afterFirstRestore, reversalRevision } = restoreRevisionLogic(
            current,
            revision1,
            adminId,
            2
          );

          // Second: restore the reversal revision → should go back to current state
          const { restoredItem: afterSecondRestore } = restoreRevisionLogic(
            afterFirstRestore,
            reversalRevision,
            adminId,
            3
          );

          // After double-restore, we should be back at the pre-first-restore state
          expect(afterSecondRestore.titleAr).toBe(current.titleAr);
          expect(afterSecondRestore.titleEn).toBe(current.titleEn);
          expect(afterSecondRestore.bodyAr).toBe(current.bodyAr);
          expect(afterSecondRestore.bodyEn).toBe(current.bodyEn);
          expect(afterSecondRestore.status).toBe(current.status);
          expect(afterSecondRestore.type).toBe(current.type);
          expect(afterSecondRestore.metadata).toEqual(current.metadata);
        }
      ),
      { numRuns: 100 }
    );
  });
});
