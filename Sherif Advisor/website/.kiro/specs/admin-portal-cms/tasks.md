# Tasks

## Task 1: Project Infrastructure Setup [depends on: none]

Set up the foundational infrastructure including database, testing framework, and core dependencies required by the Admin Portal CMS.

- [x] 1.1 Install Prisma, @prisma/client, fast-check, vitest, @testing-library/react, @tiptap/core, @tiptap/react, @tiptap/starter-kit, @tiptap/extension-link, @tiptap/extension-image, sharp (for image processing), and required dev dependencies
- [x] 1.2 Create the Prisma schema file at `prisma/schema.prisma` with all models (AdminUser, ContentItem, ContentRevision, MediaItem, MediaReference) as defined in the design document
- [x] 1.3 Configure Prisma datasource for SQLite with DATABASE_URL in `.env` and update `.env.example`
- [x] 1.4 Run initial Prisma migration to create the database schema
- [x] 1.5 Create `src/lib/prisma.ts` — Prisma client singleton for Next.js (prevents multiple instances in dev)
- [x] 1.6 Create seed script `prisma/seed.ts` to create the initial super_admin user (email from env, hashed password) and predefined page sections (Homepage hero, Homepage stats, About page, Contact page)
- [x] 1.7 Set up Vitest configuration (`vitest.config.ts`) with path aliases matching tsconfig, and add test scripts to package.json

## Task 2: Authentication Module [depends on: 1]

Implement the authentication system including password hashing, JWT session management, middleware protection, and rate limiting.

- [x] 2.1 Create `src/lib/admin-auth.ts` with functions: hashPassword, verifyPassword, createAdminSession (JWT via jose with 8h expiry), validateAdminSession, isAccountLocked, recordFailedAttempt, resetFailedAttempts
- [x] 2.2 Create `src/app/api/admin/auth/login/route.ts` — POST handler that validates credentials, checks lockout (5 attempts / 15 min), creates session cookie (httpOnly, secure, sameSite strict), returns success or generic error
- [x] 2.3 Create `src/app/api/admin/auth/logout/route.ts` — POST handler that clears the session cookie
- [x] 2.4 Create `src/app/api/admin/auth/change-password/route.ts` — POST handler for password changes (validates current password, enforces password rules, updates hash, clears requiresPasswordChange flag)
- [x] 2.5 Update `src/middleware.ts` to intercept `/admin/*` and `/api/admin/*` routes, validate JWT from cookie, redirect unauthenticated requests to login, and pass session data to route handlers via headers
- [x] 2.6 Create property-based tests for password validation (Property 3) and generic error on invalid credentials (Property 1) in `src/__tests__/properties/auth.property.test.ts`

## Task 3: Admin Login UI [depends on: 2]

Build the admin login page with email/password form, error handling, and redirect logic.

- [x] 3.1 Create `src/app/admin/login/page.tsx` — Login form with email and password fields, client-side validation (email format, max lengths), submit handler calling the login API, generic error display, and redirect to dashboard on success
- [x] 3.2 Create `src/app/admin/login/layout.tsx` — Minimal centered layout for the login page (no sidebar)
- [x] 3.3 Create `src/app/admin/change-password/page.tsx` — Forced password change form shown when requiresPasswordChange is true, with password rules displayed and validation

## Task 4: Admin Layout and Dashboard [depends on: 3]

Build the admin portal shell (sidebar navigation, header with logout) and the content dashboard.

- [x] 4.1 Create `src/app/admin/layout.tsx` — Admin shell layout with sidebar navigation (Dashboard, Services, Articles, Page Sections, Media, Administrators), header with admin name and logout button, session check redirect
- [x] 4.2 Create `src/app/admin/components/AdminSidebar.tsx` — Sidebar component with navigation links to each content type section, active state highlighting
- [x] 4.3 Create `src/app/admin/page.tsx` — Dashboard page showing content statistics (total items per type) and the 10 most recently modified content items with title, type, status, and last-modified date
- [x] 4.4 Create `src/app/api/admin/content/stats/route.ts` — GET handler returning content counts by type and recent items list

## Task 5: Bilingual Content Editor Components [depends on: 1]

Build reusable editor components for bilingual content creation with RTL/LTR support.

- [x] 5.1 Create `src/app/admin/components/RichTextEditor.tsx` — Tiptap editor wrapper supporting headings (h2-h4), bold, italic, bullet/numbered lists, links, embedded images, with configurable text direction (RTL/LTR)
- [x] 5.2 Create `src/app/admin/components/BilingualEditor.tsx` — Side-by-side editing panels (English left, Arabic right) using RichTextEditor with appropriate text direction per panel
- [x] 5.3 Create `src/app/admin/components/ContentForm.tsx` — Base form component with bilingual title fields, bilingual body fields (using BilingualEditor), status toggle, validation (titles 2-200 chars non-whitespace, body at least 1 char non-whitespace), and error display adjacent to invalid fields
- [x] 5.4 Create property-based tests for content field validation (Property 5) in `src/__tests__/properties/content-validation.property.test.ts`

## Task 6: Content API — CRUD Operations [depends on: 2]

Implement the server-side content management API with revision tracking.

- [x] 6.1 Create `src/lib/content.ts` — Core content functions: createContent, updateContent (with atomic revision creation), getContentById, deleteContent
- [x] 6.2 Create `src/lib/revisions.ts` — Revision functions: createRevision (captures full previous state, detects changed fields), getRevisions (paginated), restoreRevision (replaces current + creates reversal revision), pruneOldRevisions (max 50)
- [x] 6.3 Create `src/app/api/admin/content/route.ts` — GET (list with pagination, type filter, search) and POST (create content item with validation)
- [x] 6.4 Create `src/app/api/admin/content/[id]/route.ts` — GET (single item), PATCH (update with revision), DELETE
- [x] 6.5 Create `src/app/api/admin/content/[id]/revisions/route.ts` — GET revisions list (paginated, 20 per page, newest first)
- [x] 6.6 Create `src/app/api/admin/content/[id]/revisions/[revId]/restore/route.ts` — POST to restore a revision
- [x] 6.7 Create property-based tests for content search (Property 4), bilingual round trip (Property 6), revision creation (Property 17), changed fields detection (Property 18), revision restoration reversibility (Property 19) in `src/__tests__/properties/content.property.test.ts`

## Task 7: Service Content Management [depends on: 5, 6]

Build the service content type management UI and API integration.

- [x] 7.1 Create `src/app/admin/services/page.tsx` — Paginated service list (20/page) with title (AR/EN), display order, status, last-modified date, search field, and "New Service" button
- [x] 7.2 Create `src/app/admin/services/new/page.tsx` — Service creation form with fields: title AR/EN (max 100 chars), description AR/EN (max 500 chars), icon picker (predefined set from lucide-react), display order (positive integer), published status toggle
- [x] 7.3 Create `src/app/admin/services/[id]/edit/page.tsx` — Service edit form pre-filled with existing data, same fields as creation, save with revision tracking
- [x] 7.4 Create property-based tests for service sorting (Property 7) and unpublished exclusion (Property 8) in `src/__tests__/properties/services.property.test.ts`

## Task 8: Article Content Management [depends on: 5, 6]

Build the knowledge center article management UI and API integration.

- [x] 8.1 Create `src/app/admin/articles/page.tsx` — Paginated article list with title (AR/EN), category, publish date, status, search field, and "New Article" button
- [x] 8.2 Create `src/app/admin/articles/new/page.tsx` — Article creation form with: title AR/EN (max 200 chars), body AR/EN (rich text editor), category dropdown, featured image picker (optional), publish date picker, published status toggle
- [x] 8.3 Create `src/app/admin/articles/[id]/edit/page.tsx` — Article edit form pre-filled with existing data, save with revision tracking
- [x] 8.4 Create `src/app/api/admin/articles/categories/route.ts` — GET/POST for managing article categories
- [x] 8.5 Create property-based tests for publish date/status visibility (Property 9) and category filter (Property 10) in `src/__tests__/properties/articles.property.test.ts`

## Task 9: Page Section Content Management [depends on: 5, 6]

Build the page section editing UI for static website sections.

- [x] 9.1 Create `src/app/admin/sections/page.tsx` — List of editable page sections grouped by page (Homepage, About, Contact), showing section name and last-modified date. Fixed set; no create/delete buttons.
- [x] 9.2 Create `src/app/admin/sections/[id]/edit/page.tsx` — Section edit form with side-by-side AR/EN panels, pre-filled with existing content, section-specific fields (title, subtitle, body, stats, CTA label/link), validation (1-2000 chars per text field)
- [x] 9.3 Create `src/app/admin/components/ContentPreview.tsx` — Preview component that renders edited section content as it would appear on the public website, for both Arabic and English
- [x] 9.4 Create property-based tests for page section field validation (Property 12) in `src/__tests__/properties/sections.property.test.ts`

## Task 10: Media Upload and Management [depends on: 2]

Build the media upload system with file validation, storage, and gallery UI.

- [x] 10.1 Create `src/lib/media.ts` — Media functions: validateMediaFile (JPEG/PNG/WebP, max 5MB), uploadMedia (store to `/uploads`, extract dimensions with sharp, record metadata), deleteMedia (check references, remove file + DB record), listMedia (paginated), getMediaReferences
- [x] 10.2 Create `src/app/api/admin/media/route.ts` — GET (paginated gallery list) and POST (multipart upload with validation)
- [x] 10.3 Create `src/app/api/admin/media/[id]/route.ts` — DELETE (with reference check, force option)
- [x] 10.4 Create `src/app/admin/media/page.tsx` — Media gallery with thumbnail grid (20/page), upload button with drag-and-drop zone, delete button with reference warning dialog
- [x] 10.5 Create `src/app/admin/components/MediaPicker.tsx` — Modal dialog for selecting images from the media gallery, used within content editors
- [x] 10.6 Create property-based tests for media file validation (Property 13) and reference detection (Property 14) in `src/__tests__/properties/media.property.test.ts`

## Task 11: Administrator Management [depends on: 2]

Build the admin user management interface for creating and deactivating admin accounts.

- [x] 11.1 Create `src/app/api/admin/users/route.ts` — GET (list admins) and POST (create admin with generated temp password, send email)
- [x] 11.2 Create `src/app/api/admin/users/[id]/route.ts` — PATCH (update admin, deactivate with session invalidation, prevent self-deactivation)
- [x] 11.3 Create `src/app/admin/administrators/page.tsx` — Admin list showing name, email, role, status, with "New Admin" button (visible only to super_admin)
- [x] 11.4 Create `src/app/admin/administrators/new/page.tsx` — Create admin form: email, display name; system generates temp password and displays it (or sends email)
- [x] 11.5 Create `src/lib/email.ts` — Email utility for sending temporary passwords (initially console.log for dev, with SMTP integration point)

## Task 12: Content Revision History UI [depends on: 6, 7, 8, 9]

Build the revision history viewing and restoration interface.

- [x] 12.1 Create `src/app/admin/components/RevisionHistory.tsx` — Paginated revision timeline (20/page, newest first) showing date, author name, and changed field names for each revision
- [x] 12.2 Add revision history panel to content edit pages (services, articles, sections) — expandable section showing the RevisionHistory component for the current content item
- [x] 12.3 Create revision detail/restore dialog — shows full content of selected revision for review, with "Restore" confirmation button

## Task 13: Public Content Delivery API [depends on: 6]

Build the public-facing content API that serves published content filtered by language.

- [x] 13.1 Create `src/lib/public-content.ts` — Public content functions: getPublishedServices (sorted by display order), getPublishedArticles (paginated, sorted by publish date desc, filtered by status + date), getPageSection, resolveLanguageFallback (returns alternative language if requested is empty)
- [x] 13.2 Create `src/app/api/content/services/route.ts` — GET published services with language parameter
- [x] 13.3 Create `src/app/api/content/articles/route.ts` — GET published articles with language, pagination, optional category filter
- [x] 13.4 Create `src/app/api/content/sections/[page]/[key]/route.ts` — GET specific page section with language parameter
- [x] 13.5 Create property-based tests for language-specific delivery (Property 15), language fallback (Property 16), and pagination invariants (Property 11) in `src/__tests__/properties/public-content.property.test.ts`

## Task 14: Public Website Integration [depends on: 13]

Update the public website pages to fetch content from the CMS API instead of hardcoded data, with language toggle support.

- [x] 14.1 Create `src/lib/language.ts` — Language context/cookie utilities: getLanguagePreference (default 'ar'), setLanguagePreference, language cookie management for session persistence
- [x] 14.2 Update `src/components/layout/Header.tsx` — Add language toggle (AR/EN) visible on every page, persists selection via cookie
- [x] 14.3 Update `src/app/services/page.tsx` — Fetch services from `/api/content/services` with current language preference, render dynamically
- [x] 14.4 Update `src/app/knowledge/page.tsx` — Fetch articles from `/api/content/articles` with language, pagination, category filter
- [x] 14.5 Update homepage sections (`src/components/sections/Hero.tsx`, `Stats.tsx`, `Services.tsx`, `Knowledge.tsx`) to fetch content from page section API
- [x] 14.6 Update `src/app/about/page.tsx` and `src/app/contact/page.tsx` to fetch page section content from CMS API

## Task 15: Serve Uploaded Media Files [depends on: 10]

Configure Next.js to serve uploaded media files and ensure the uploads directory is accessible.

- [x] 15.1 Update `next.config.js` to configure static file serving for the `/uploads` directory
- [x] 15.2 Create the `public/uploads` directory structure and add it to `.gitignore`
- [x] 15.3 Update media upload logic to store files under `public/uploads` so they are served by Next.js static file handling
