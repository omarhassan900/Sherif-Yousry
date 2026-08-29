-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresPasswordChange" BOOLEAN NOT NULL DEFAULT true,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "bodyAr" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpublished',
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContentItem_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "AdminUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentRevision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentId" TEXT NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "previousState" TEXT NOT NULL,
    "changedFields" TEXT NOT NULL,
    "changedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentRevision_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentRevision_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "AdminUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MediaItem_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "AdminUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MediaReference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediaId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    CONSTRAINT "MediaReference_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MediaReference_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "ContentItem_type_status_idx" ON "ContentItem"("type", "status");

-- CreateIndex
CREATE INDEX "ContentItem_updatedAt_idx" ON "ContentItem"("updatedAt");

-- CreateIndex
CREATE INDEX "ContentRevision_contentId_createdAt_idx" ON "ContentRevision"("contentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRevision_contentId_revisionNumber_key" ON "ContentRevision"("contentId", "revisionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MediaItem_fileName_key" ON "MediaItem"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "MediaReference_mediaId_contentId_fieldName_key" ON "MediaReference"("mediaId", "contentId", "fieldName");
