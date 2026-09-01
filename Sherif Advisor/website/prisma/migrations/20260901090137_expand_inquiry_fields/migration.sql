-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT,
    "serviceName" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'service',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "countryCode" TEXT,
    "businessActivity" TEXT,
    "country" TEXT,
    "helpWith" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ServiceInquiry_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ContentItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ServiceInquiry" ("createdAt", "email", "id", "ipAddress", "message", "name", "phone", "serviceId", "serviceName", "status") SELECT "createdAt", "email", "id", "ipAddress", "message", "name", "phone", "serviceId", "serviceName", "status" FROM "ServiceInquiry";
DROP TABLE "ServiceInquiry";
ALTER TABLE "new_ServiceInquiry" RENAME TO "ServiceInquiry";
CREATE INDEX "ServiceInquiry_status_createdAt_idx" ON "ServiceInquiry"("status", "createdAt");
CREATE INDEX "ServiceInquiry_serviceId_idx" ON "ServiceInquiry"("serviceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
