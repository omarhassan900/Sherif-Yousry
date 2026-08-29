/**
 * Revision History Module
 *
 * Provides functions to create, retrieve, restore, and prune content revisions.
 * Each revision captures the full previous state of a content item and detects
 * which fields changed.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ContentItem } from '@/lib/content';

// ============================================
// TYPES
// ============================================

export interface ContentRevision {
  id: string;
  contentId: string;
  revisionNumber: number;
  previousState: Record<string, unknown>;
  changedFields: string[];
  changedBy: string;
  createdAt: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// CONSTANTS
// ============================================

const REVISIONS_PER_PAGE = 20;
const DEFAULT_MAX_REVISIONS = 50;

// ============================================
// HELPERS
// ============================================

/**
 * Convert a raw database revision record to a ContentRevision with parsed JSON fields.
 */
function toContentRevision(record: {
  id: string;
  contentId: string;
  revisionNumber: number;
  previousState: string;
  changedFields: string;
  changedById: string;
  createdAt: Date;
}): ContentRevision {
  return {
    id: record.id,
    contentId: record.contentId,
    revisionNumber: record.revisionNumber,
    previousState: JSON.parse(record.previousState) as Record<string, unknown>,
    changedFields: JSON.parse(record.changedFields) as string[],
    changedBy: record.changedById,
    createdAt: record.createdAt,
  };
}

/**
 * Detect which fields differ between a previous state snapshot and the current content item.
 */
function detectChangedFieldsBetweenStates(
  previousState: Record<string, unknown>,
  current: ContentItem
): string[] {
  const changed: string[] = [];
  const fieldsToCompare = ['type', 'titleAr', 'titleEn', 'bodyAr', 'bodyEn', 'status', 'metadata'];

  for (const field of fieldsToCompare) {
    const prevValue = previousState[field];
    const currValue = current[field as keyof ContentItem];

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

// ============================================
// REVISION FUNCTIONS
// ============================================

/**
 * Create a revision capturing the full previous state of a content item.
 *
 * Compares the previous state against the current state in the database to
 * determine which fields have changed.
 *
 * @param contentId - The content item ID
 * @param previousState - The full previous state of the content item
 * @param changedBy - The admin ID who made the change
 * @returns The created revision record
 * @throws Error if the content item is not found
 */
export async function createRevision(
  contentId: string,
  previousState: ContentItem,
  changedBy: string
): Promise<ContentRevision> {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Fetch current state to detect changed fields
    const currentRecord = await tx.contentItem.findUnique({
      where: { id: contentId },
    });

    if (!currentRecord) {
      throw new Error(`Content item not found: ${contentId}`);
    }

    // Build the current ContentItem for comparison
    const currentItem: ContentItem = {
      id: currentRecord.id,
      type: currentRecord.type as ContentItem['type'],
      titleAr: currentRecord.titleAr,
      titleEn: currentRecord.titleEn,
      bodyAr: currentRecord.bodyAr,
      bodyEn: currentRecord.bodyEn,
      status: currentRecord.status as ContentItem['status'],
      metadata: JSON.parse(currentRecord.metadata),
      createdBy: currentRecord.createdById,
      updatedBy: currentRecord.updatedById,
      createdAt: currentRecord.createdAt,
      updatedAt: currentRecord.updatedAt,
    };

    // Build the previousState snapshot (content fields only)
    const snapshot: Record<string, unknown> = {
      type: previousState.type,
      titleAr: previousState.titleAr,
      titleEn: previousState.titleEn,
      bodyAr: previousState.bodyAr,
      bodyEn: previousState.bodyEn,
      status: previousState.status,
      metadata: previousState.metadata,
    };

    // Detect which fields changed between previous state and current DB state
    const changedFields = detectChangedFieldsBetweenStates(snapshot, currentItem);

    // Determine next revision number
    const lastRevision = await tx.contentRevision.findFirst({
      where: { contentId },
      orderBy: { revisionNumber: 'desc' },
      select: { revisionNumber: true },
    });

    const revisionNumber = (lastRevision?.revisionNumber ?? 0) + 1;

    // Create the revision record
    const record = await tx.contentRevision.create({
      data: {
        contentId,
        revisionNumber,
        previousState: JSON.stringify(snapshot),
        changedFields: JSON.stringify(changedFields),
        changedById: changedBy,
      },
    });

    return toContentRevision(record);
  });
}

/**
 * Get paginated revisions for a content item, newest first.
 *
 * @param contentId - The content item ID
 * @param page - The page number (1-based)
 * @returns Paginated result of revisions
 */
export async function getRevisions(
  contentId: string,
  page: number
): Promise<PaginatedResult<ContentRevision>> {
  const pageNum = Math.max(1, page);
  const skip = (pageNum - 1) * REVISIONS_PER_PAGE;

  const [records, total] = await Promise.all([
    prisma.contentRevision.findMany({
      where: { contentId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: REVISIONS_PER_PAGE,
    }),
    prisma.contentRevision.count({
      where: { contentId },
    }),
  ]);

  return {
    items: records.map(toContentRevision),
    total,
    page: pageNum,
    pageSize: REVISIONS_PER_PAGE,
    totalPages: Math.ceil(total / REVISIONS_PER_PAGE),
  };
}

/**
 * Restore a revision by replacing the current content state with the revision's
 * stored state. Also creates a new revision capturing the pre-restoration state,
 * making the restore itself reversible.
 *
 * @param revisionId - The revision ID to restore
 * @param adminId - The admin ID performing the restore
 * @returns The restored content item
 * @throws Error if the revision or content item is not found
 */
export async function restoreRevision(
  revisionId: string,
  adminId: string
): Promise<ContentItem> {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Fetch the revision to restore
    const revision = await tx.contentRevision.findUnique({
      where: { id: revisionId },
    });

    if (!revision) {
      throw new Error(`Revision not found: ${revisionId}`);
    }

    // 2. Fetch the current content state (pre-restoration)
    const currentRecord = await tx.contentItem.findUnique({
      where: { id: revision.contentId },
    });

    if (!currentRecord) {
      throw new Error(`Content item not found: ${revision.contentId}`);
    }

    // 3. Capture pre-restoration state as a new revision (makes restore reversible)
    const preRestoreSnapshot: Record<string, unknown> = {
      type: currentRecord.type,
      titleAr: currentRecord.titleAr,
      titleEn: currentRecord.titleEn,
      bodyAr: currentRecord.bodyAr,
      bodyEn: currentRecord.bodyEn,
      status: currentRecord.status,
      metadata: JSON.parse(currentRecord.metadata),
    };

    // Determine next revision number
    const lastRevision = await tx.contentRevision.findFirst({
      where: { contentId: revision.contentId },
      orderBy: { revisionNumber: 'desc' },
      select: { revisionNumber: true },
    });

    const nextRevisionNumber = (lastRevision?.revisionNumber ?? 0) + 1;

    // Parse the stored state we're restoring to
    const restoredState = JSON.parse(revision.previousState) as Record<string, unknown>;

    // Detect which fields will change from current → restored
    const currentItem: ContentItem = {
      id: currentRecord.id,
      type: currentRecord.type as ContentItem['type'],
      titleAr: currentRecord.titleAr,
      titleEn: currentRecord.titleEn,
      bodyAr: currentRecord.bodyAr,
      bodyEn: currentRecord.bodyEn,
      status: currentRecord.status as ContentItem['status'],
      metadata: JSON.parse(currentRecord.metadata),
      createdBy: currentRecord.createdById,
      updatedBy: currentRecord.updatedById,
      createdAt: currentRecord.createdAt,
      updatedAt: currentRecord.updatedAt,
    };

    // The changed fields are what differs between current state and what we'll restore to
    const changedFields = detectChangedFieldsBetweenStates(restoredState, currentItem);

    // Create the reversal revision
    await tx.contentRevision.create({
      data: {
        contentId: revision.contentId,
        revisionNumber: nextRevisionNumber,
        previousState: JSON.stringify(preRestoreSnapshot),
        changedFields: JSON.stringify(changedFields),
        changedById: adminId,
      },
    });

    // 4. Restore the content item with the revision's stored state
    const updateData: Record<string, unknown> = {
      updatedById: adminId,
    };

    if (restoredState.titleAr !== undefined) updateData.titleAr = restoredState.titleAr;
    if (restoredState.titleEn !== undefined) updateData.titleEn = restoredState.titleEn;
    if (restoredState.bodyAr !== undefined) updateData.bodyAr = restoredState.bodyAr;
    if (restoredState.bodyEn !== undefined) updateData.bodyEn = restoredState.bodyEn;
    if (restoredState.status !== undefined) updateData.status = restoredState.status;
    if (restoredState.metadata !== undefined) {
      updateData.metadata = JSON.stringify(restoredState.metadata);
    }

    const updated = await tx.contentItem.update({
      where: { id: revision.contentId },
      data: updateData,
    });

    return {
      id: updated.id,
      type: updated.type as ContentItem['type'],
      titleAr: updated.titleAr,
      titleEn: updated.titleEn,
      bodyAr: updated.bodyAr,
      bodyEn: updated.bodyEn,
      status: updated.status as ContentItem['status'],
      metadata: JSON.parse(updated.metadata),
      createdBy: updated.createdById,
      updatedBy: updated.updatedById,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  });
}

/**
 * Prune old revisions for a content item when they exceed maxRevisions.
 * Keeps the newest revisions and deletes the oldest ones.
 *
 * @param contentId - The content item ID
 * @param maxRevisions - Maximum number of revisions to keep (default: 50)
 */
export async function pruneOldRevisions(
  contentId: string,
  maxRevisions: number = DEFAULT_MAX_REVISIONS
): Promise<void> {
  const count = await prisma.contentRevision.count({
    where: { contentId },
  });

  if (count <= maxRevisions) {
    return;
  }

  // Find the revisions to keep (newest N by revision number)
  const revisionsToKeep = await prisma.contentRevision.findMany({
    where: { contentId },
    orderBy: { revisionNumber: 'desc' },
    take: maxRevisions,
    select: { id: true },
  });

  const keepIds = revisionsToKeep.map((r) => r.id);

  // Delete all revisions not in the keep list
  await prisma.contentRevision.deleteMany({
    where: {
      contentId,
      id: { notIn: keepIds },
    },
  });
}
