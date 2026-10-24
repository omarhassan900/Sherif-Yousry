# Production Performance — DB Retrieval Slowness (deferred task)

Status: **Investigated, not yet implemented.** Captured for later.

## Symptom
The app is slow when retrieving data from the database **in production (GoDaddy)**.
Local dev DB queries are fast, so the problem is in the app ↔ remote MySQL
connection layer and oversized payloads, amplified by network distance.

## Diagnosis (measured)
- Raw DB queries are fast; the latency is in connection + data transfer.
- Local timing: **cold DB hit ~862ms vs warm ~50ms**. Over the network to
  GoDaddy the cold penalty is much larger and happens more often because
  GoDaddy shared MySQL closes idle connections aggressively.

## Root causes
1. **Connection churn (biggest).** `src/lib/prisma.ts` builds the adapter with a
   bare URL string: `new PrismaMariaDb(url)`. This uses mariadb's default pool
   with no production tuning (connectionLimit, idleTimeout, connectTimeout,
   acquireTimeout, keep-alive). Stale/closed connections force repeated
   TCP+TLS+auth handshakes to the remote DB.
2. **Oversized `metadata` payloads.** Service rows store up to **~37KB of
   metadata JSON each**, containing base64-encoded images. Loading all services
   transfers ~300KB+ per uncached read plus heavy JSON parsing.
3. **`export const dynamic = 'force-dynamic'`** on all public content API routes
   (`src/app/api/content/**/route.ts`) forces a DB round trip on every request,
   keeping GoDaddy latency in the critical path despite `unstable_cache`.
4. **`SELECT *`** in content queries pulls all columns (both language bodies +
   the giant metadata) even for list views that only need titles.

## Proposed fixes (ordered by impact / effort)

### A. Safe, high impact — do first
- [ ] Tune MariaDB pool in `src/lib/prisma.ts`: pass a config object to
      `PrismaMariaDb({ ...parsed url..., connectionLimit, idleTimeout,
      connectTimeout, acquireTimeout, keepAlive })` so warm connections survive
      and cold waits are bounded. Adapter is `@prisma/adapter-mariadb@7.10.0`;
      when given a config object it calls `mariadb.createPool(config)`.
- [ ] Verify the `ContentItem(type, status)` index actually exists in the
      GoDaddy DB (schema declares `@@index([type, status])` — confirm migration
      applied).
- [ ] Increase `unstable_cache` revalidate (currently 300s) and lean on
      stale-while-revalidate so visitors rarely wait on the DB.

### B. High impact — needs sign-off (touches data / behavior)
- [ ] Move base64 images OUT of `metadata` into file URLs (media system already
      serves `/uploads/...`). Biggest transfer-speed win. Requires a careful
      data migration.
- [ ] Select only needed columns for list endpoints (defer heavy body/metadata
      fields until detail view).

### C. Medium
- [ ] Reconsider `force-dynamic` on public GET content routes so Next can serve
      cached route responses without hitting GoDaddy every request.

## Recommended order
Do A first (low risk, immediate win), measure, then tackle B (base64 image
extraction) as a separate migration.

## Key files
- `src/lib/prisma.ts` — adapter / pool config
- `src/lib/public-content.ts` — cached read functions (`unstable_cache`, TTL)
- `src/app/api/content/**/route.ts` — `force-dynamic` flags
- `prisma/schema.prisma` — `ContentItem` indexes
