/**
 * Content Management Module
 *
 * Provides CRUD operations for content items (services, articles, page sections)
 * with atomic revision creation on updates.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// ============================================
// TYPES
// ============================================

export type ContentType = 'service' | 'article' | 'page_section';
export type ContentStatus = 'published' | 'unpublished';

export interface ContentItem {
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

export interface CreateContentInput {
  type: ContentType;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  status?: ContentStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateContentInput {
  titleAr?: string;
  titleEn?: string;
  bodyAr?: string;
  bodyEn?: string;
  status?: ContentStatus;
  metadata?: Record<string, unknown>;
}

// ============================================
// HELPERS
// ============================================

/**
 * Convert a raw database record to a ContentItem with parsed metadata.
 */
function toContentItem(record: {
  id: string;
  type: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  status: string;
  metadata: string;
  createdById: string;
  updatedById: string;
  createdAt: Date;
  updatedAt: Date;
}): ContentItem {
  return {
    id: record.id,
    type: record.type as ContentType,
    titleAr: record.titleAr,
    titleEn: record.titleEn,
    bodyAr: record.bodyAr,
    bodyEn: record.bodyEn,
    status: record.status as ContentStatus,
    metadata: JSON.parse(record.metadata),
    createdBy: record.createdById,
    updatedBy: record.updatedById,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Detect which fields changed between the previous state and the update data.
 */
function detectChangedFields(
  previous: ContentItem,
  update: UpdateContentInput
): string[] {
  const changed: string[] = [];

  if (update.titleAr !== undefined && update.titleAr !== previous.titleAr) {
    changed.push('titleAr');
  }
  if (update.titleEn !== undefined && update.titleEn !== previous.titleEn) {
    changed.push('titleEn');
  }
  if (update.bodyAr !== undefined && update.bodyAr !== previous.bodyAr) {
    changed.push('bodyAr');
  }
  if (update.bodyEn !== undefined && update.bodyEn !== previous.bodyEn) {
    changed.push('bodyEn');
  }
  if (update.status !== undefined && update.status !== previous.status) {
    changed.push('status');
  }
  if (update.metadata !== undefined) {
    const prevMeta = JSON.stringify(previous.metadata);
    const newMeta = JSON.stringify(update.metadata);
    if (prevMeta !== newMeta) {
      changed.push('metadata');
    }
  }

  return changed;
}

// ============================================
// CONTENT FUNCTIONS
// ============================================

/**
 * Create a new content item.
 *
 * @param data - The content data to create
 * @param adminId - The ID of the admin creating the content
 * @returns The created content item with parsed metadata
 */
export async function createContent(
  data: CreateContentInput,
  adminId: string
): Promise<ContentItem> {
  const record = await prisma.contentItem.create({
    data: {
      type: data.type,
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      bodyAr: data.bodyAr,
      bodyEn: data.bodyEn,
      status: data.status ?? 'unpublished',
      metadata: JSON.stringify(data.metadata ?? {}),
      createdById: adminId,
      updatedById: adminId,
    },
  });

  return toContentItem(record);
}

/**
 * Update a content item with atomic revision creation.
 *
 * Uses a Prisma transaction to:
 * 1. Fetch the current state
 * 2. Create a revision capturing the previous state
 * 3. Apply the update
 *
 * @param id - The content item ID to update
 * @param data - The fields to update
 * @param adminId - The ID of the admin performing the update
 * @returns The updated content item
 * @throws Error if the content item is not found
 */
export async function updateContent(
  id: string,
  data: UpdateContentInput,
  adminId: string
): Promise<ContentItem> {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Fetch current state
    const existing = await tx.contentItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error(`Content item not found: ${id}`);
    }

    const previousItem = toContentItem(existing);
    const changedFields = detectChangedFields(previousItem, data);

    // 2. Create revision capturing previous state (only if there are changes)
    if (changedFields.length > 0) {
      // Determine the next revision number
      const lastRevision = await tx.contentRevision.findFirst({
        where: { contentId: id },
        orderBy: { revisionNumber: 'desc' },
        select: { revisionNumber: true },
      });

      const revisionNumber = (lastRevision?.revisionNumber ?? 0) + 1;

      // Capture the full previous state as a JSON snapshot
      const previousState: Record<string, unknown> = {
        type: previousItem.type,
        titleAr: previousItem.titleAr,
        titleEn: previousItem.titleEn,
        bodyAr: previousItem.bodyAr,
        bodyEn: previousItem.bodyEn,
        status: previousItem.status,
        metadata: previousItem.metadata,
      };

      await tx.contentRevision.create({
        data: {
          contentId: id,
          revisionNumber,
          previousState: JSON.stringify(previousState),
          changedFields: JSON.stringify(changedFields),
          changedById: adminId,
        },
      });
    }

    // 3. Apply the update
    const updateData: Record<string, unknown> = {
      updatedById: adminId,
    };

    if (data.titleAr !== undefined) updateData.titleAr = data.titleAr;
    if (data.titleEn !== undefined) updateData.titleEn = data.titleEn;
    if (data.bodyAr !== undefined) updateData.bodyAr = data.bodyAr;
    if (data.bodyEn !== undefined) updateData.bodyEn = data.bodyEn;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.metadata !== undefined) {
      updateData.metadata = JSON.stringify(data.metadata);
    }

    const updated = await tx.contentItem.update({
      where: { id },
      data: updateData,
    });

    return toContentItem(updated);
  });

  return result;
}

/**
 * Get a content item by its ID.
 *
 * @param id - The content item ID
 * @returns The content item or null if not found
 */
export async function getContentById(id: string): Promise<ContentItem | null> {
  const record = await prisma.contentItem.findUnique({
    where: { id },
  });

  if (!record) {
    return null;
  }

  return toContentItem(record);
}

/**
 * Delete a content item and its associated revisions (cascaded by DB).
 *
 * @param id - The content item ID to delete
 * @throws Error if the content item is not found
 */
export async function deleteContent(id: string): Promise<void> {
  const existing = await prisma.contentItem.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new Error(`Content item not found: ${id}`);
  }

  await prisma.contentItem.delete({
    where: { id },
  });
}
