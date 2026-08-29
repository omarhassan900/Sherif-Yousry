/**
 * Media Management Module
 *
 * Provides functions for media file validation, upload, deletion,
 * listing, and reference tracking.
 */

import sharp from 'sharp';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

// ============================================
// CONSTANTS
// ============================================

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_FILE_SIZE = 5_242_880; // 5 MB in bytes
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const PAGE_SIZE = 20;

// ============================================
// TYPES
// ============================================

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  mimeType: AllowedMimeType;
  fileSize: number;
  width: number;
  height: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface MediaReference {
  mediaId: string;
  contentId: string;
  fieldName: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ============================================
// HELPERS
// ============================================

/**
 * Generate a unique filename preserving the original extension.
 */
function generateUniqueFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}${ext}`;
}

/**
 * Map a database record to a MediaItem.
 */
function toMediaItem(record: {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  uploadedById: string;
  uploadedAt: Date;
}): MediaItem {
  return {
    id: record.id,
    fileName: record.fileName,
    originalName: record.originalName,
    filePath: record.filePath,
    mimeType: record.mimeType as AllowedMimeType,
    fileSize: record.fileSize,
    width: record.width,
    height: record.height,
    uploadedBy: record.uploadedById,
    uploadedAt: record.uploadedAt,
  };
}

// ============================================
// MEDIA FUNCTIONS
// ============================================

/**
 * Validate a media file for upload.
 *
 * Checks:
 * - MIME type must be image/jpeg, image/png, or image/webp
 * - File size must not exceed 5 MB (5,242,880 bytes)
 *
 * @param file - The file to validate (must have type and size properties)
 * @returns Validation result with valid flag and optional error message
 */
export function validateMediaFile(file: { type: string; size: number }): ValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1_048_576).toFixed(2)} MB. Maximum size: 5 MB`,
    };
  }

  return { valid: true };
}

/**
 * Upload a media file.
 *
 * Stores the file to `public/uploads`, extracts image dimensions using sharp,
 * and creates a database record with metadata.
 *
 * @param file - The file to upload (Web File API or compatible object)
 * @param adminId - The ID of the admin uploading the file
 * @returns The created MediaItem record
 * @throws Error if validation fails or file cannot be written
 */
export async function uploadMedia(
  file: { name: string; type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> },
  adminId: string
): Promise<MediaItem> {
  // Validate the file
  const validation = validateMediaFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Ensure uploads directory exists
  await mkdir(UPLOADS_DIR, { recursive: true });

  // Generate unique filename
  const fileName = generateUniqueFileName(file.name);
  const filePath = path.join(UPLOADS_DIR, fileName);

  // Read file contents
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Extract image dimensions using sharp
  const metadata = await sharp(uint8Array).metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  // Write file to disk
  await writeFile(filePath, uint8Array);

  // Create database record
  const record = await prisma.mediaItem.create({
    data: {
      fileName,
      originalName: file.name,
      filePath: `/uploads/${fileName}`,
      mimeType: file.type,
      fileSize: file.size,
      width,
      height,
      uploadedById: adminId,
    },
  });

  return toMediaItem(record);
}

/**
 * Delete a media item.
 *
 * If references exist and force is false, returns the references without deleting.
 * If force is true or no references exist, removes the file from disk and deletes
 * the database record.
 *
 * @param id - The media item ID to delete
 * @param force - If true, delete even if references exist
 * @returns Object indicating whether deletion occurred, with references if blocked
 * @throws Error if the media item is not found
 */
export async function deleteMedia(
  id: string,
  force: boolean
): Promise<{ deleted: boolean; references?: MediaReference[] }> {
  // Find the media item
  const mediaItem = await prisma.mediaItem.findUnique({
    where: { id },
  });

  if (!mediaItem) {
    throw new Error(`Media item not found: ${id}`);
  }

  // Check for references
  const references = await prisma.mediaReference.findMany({
    where: { mediaId: id },
    select: { mediaId: true, contentId: true, fieldName: true },
  });

  // If references exist and not forcing, return them
  if (references.length > 0 && !force) {
    return {
      deleted: false,
      references: references.map((ref) => ({
        mediaId: ref.mediaId,
        contentId: ref.contentId,
        fieldName: ref.fieldName,
      })),
    };
  }

  // Remove file from disk
  const absolutePath = path.join(process.cwd(), 'public', mediaItem.filePath);
  try {
    await unlink(absolutePath);
  } catch (err) {
    // File may already be missing; log but don't fail
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err;
    }
  }

  // Delete the database record (cascades to MediaReference)
  await prisma.mediaItem.delete({
    where: { id },
  });

  return { deleted: true };
}

/**
 * List media items with pagination.
 *
 * Returns 20 items per page, sorted by uploadedAt descending (newest first).
 *
 * @param page - The page number (1-based)
 * @returns Paginated result of media items
 */
export async function listMedia(page: number): Promise<PaginatedResult<MediaItem>> {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    prisma.mediaItem.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { uploadedAt: 'desc' },
    }),
    prisma.mediaItem.count(),
  ]);

  return {
    items: items.map(toMediaItem),
    total,
    page: currentPage,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

/**
 * Get all content references for a specific media item.
 *
 * @param mediaId - The media item ID to find references for
 * @returns Array of media references linking to content items
 */
export async function getMediaReferences(mediaId: string): Promise<MediaReference[]> {
  const references = await prisma.mediaReference.findMany({
    where: { mediaId },
    select: { mediaId: true, contentId: true, fieldName: true },
  });

  return references.map((ref) => ({
    mediaId: ref.mediaId,
    contentId: ref.contentId,
    fieldName: ref.fieldName,
  }));
}
