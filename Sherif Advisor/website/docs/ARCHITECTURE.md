# System Architecture — Sherif Yousry Advisory

A bilingual (Arabic/English) Next.js 14 App Router site with a custom, JWT-secured
admin CMS. Content lives in a single generic table with full revision history, and a
parallel "v2" redesign of both the public site and the admin runs alongside the
originals.

> Diagrams use [Mermaid](https://mermaid.js.org/). They render in GitHub, most IDE
> Markdown previews, and any Mermaid-compatible viewer.

---

## Tech stack

- **Next.js 14.2** (App Router), React 18.3, TypeScript 5.6
- **Prisma 7.9** via the **libSQL adapter** (Turso in prod, local SQLite file in dev)
- **Auth**: `jose` (JWT) + `bcryptjs` — custom session, not NextAuth
- **UI**: Tailwind, Framer Motion, lucide-react, TipTap rich-text editor, Recharts
- **Testing**: Vitest + Testing Library + fast-check + jsdom

---

## High-level system architecture

```mermaid
graph TB
    subgraph Client["Browser (RTL/LTR bilingual)"]
        PUB["Public Site<br/>v1 + v2 pages"]
        ADM["Admin CMS<br/>/admin + /admin/v2"]
    end

    subgraph Edge["Next.js Middleware (edge)"]
        MW["middleware.ts<br/>• JWT validation (jose)<br/>• Rate limiting (in-memory)<br/>• Security headers<br/>• Injects x-admin-* headers"]
    end

    subgraph App["Next.js 14 App Router (Vercel)"]
        subgraph Pages["Server + Client Components"]
            PP["Public pages<br/>src/app/*, src/app/v2/*"]
            AP["Admin pages<br/>src/app/admin/*"]
        end
        subgraph API["API Route Handlers"]
            PAPI["Public API<br/>/api/content, /api/contact,<br/>/api/track, /api/chat"]
            AAPI["Admin API (JWT-gated)<br/>/api/admin/*"]
        end
        subgraph Lib["Domain lib (src/lib)"]
            L1["content.ts / revisions.ts"]
            L2["public-content.ts"]
            L3["admin-auth.ts / admin-session.ts"]
            L4["media.ts / email.ts / security.ts"]
        end
    end

    subgraph Data["Data layer"]
        PRISMA["Prisma Client<br/>libSQL adapter (cached)"]
        DB[("SQLite / Turso<br/>ContentItem, AdminUser,<br/>ContentRevision, MediaItem,<br/>PageView, ServiceInquiry")]
        FS["/public/uploads<br/>(image files)"]
    end

    PUB --> MW
    ADM --> MW
    MW --> PP
    MW --> AP
    PP --> PAPI
    AP --> AAPI
    PAPI --> L1 & L2 & L4
    AAPI --> L1 & L2 & L3 & L4
    L1 --> PRISMA
    L2 --> PRISMA
    L3 --> PRISMA
    L4 --> PRISMA & FS
    PRISMA --> DB
```

Notes:

- The **middleware is the single gate** for all `/admin` and `/api/admin` traffic;
  route handlers trust the injected `x-admin-*` headers rather than re-validating the JWT.
- **v1 and v2 share the same backend and database** — only pages/components differ.

---

## Admin authentication flow

```mermaid
sequenceDiagram
    participant U as Admin browser
    participant MW as middleware.ts
    participant API as /api/admin/auth/login
    participant AUTH as admin-auth.ts
    participant DB as Prisma / DB

    U->>API: POST email + password
    API->>DB: findUnique(AdminUser)
    API->>AUTH: isAccountLocked?
    alt locked
        AUTH-->>U: 423 locked (15 min)
    else not locked
        API->>AUTH: verifyPassword (bcrypt)
        alt wrong password
            AUTH->>DB: recordFailedAttempt (lock at 5)
            AUTH-->>U: 401
        else correct
            AUTH->>DB: resetFailedAttempts
            AUTH->>AUTH: createAdminSession (jose JWT, 8h)
            API-->>U: Set-Cookie admin-session (httpOnly)
        end
    end

    Note over U,MW: Subsequent protected requests
    U->>MW: GET /admin/* (cookie)
    MW->>MW: jwtVerify(JWT_SECRET)
    alt valid
        MW->>MW: inject x-admin-user-* headers
        MW-->>U: route handler (reads via getAdminSession)
    else invalid
        MW-->>U: redirect /admin/login (or 401 for API)
    end
```

---

## Content model + revision flow

```mermaid
graph LR
    subgraph Write["Admin write path"]
        UC["updateContent()<br/>Prisma transaction"]
        UC -->|1. read current| CUR[("ContentItem")]
        UC -->|2. snapshot prev state| REV[("ContentRevision")]
        UC -->|3. apply update| CUR
    end

    subgraph Restore["Restore path"]
        RR["restoreRevision()"]
        RR -->|writes reversal revision| REV
        RR -->|restores stored state| CUR
    end

    subgraph Read["Public read path"]
        PC["public-content.ts<br/>published only"]
        PC -->|fetch rows| CUR
        PC -->|JS filter/sort/search<br/>on metadata JSON| RESP["Language-resolved<br/>response (ar/en fallback)"]
    end
```

---

## The v1 / v2 parallel structure

```mermaid
graph TB
    subgraph Shared["Shared backend (single source of truth)"]
        DB[("ContentItem table<br/>type: service | article | page_section<br/>metadata JSON")]
        API2["/api/content/sections/v2/[key]"]
    end

    subgraph V1["v1 (original)"]
        V1P["src/app/* pages"]
        V1C["src/components/sections/*"]
        V1A["src/app/admin/*"]
    end

    subgraph V2["v2 (redesign)"]
        V2P["src/app/v2/* pages"]
        V2C["src/components/v2/*"]
        V2H["use-v2-section hook<br/>(fetch + fallback defaults)"]
        V2A["src/app/admin/v2/*"]
    end

    V1C --> DB
    V1A --> DB
    V2C --> V2H --> API2 --> DB
    V2A --> DB
```

---

## Data model (entity relationships)

```mermaid
erDiagram
    AdminUser ||--o{ ContentItem : "creates / updates"
    AdminUser ||--o{ ContentRevision : "authors"
    AdminUser ||--o{ MediaItem : "uploads"
    ContentItem ||--o{ ContentRevision : "has history"
    ContentItem ||--o{ MediaReference : "references"
    MediaItem ||--o{ MediaReference : "referenced by"
    ContentItem ||--o{ ServiceInquiry : "receives (nullable, SetNull)"

    ContentItem {
        string id PK
        string type "service | article | page_section"
        string titleAr
        string titleEn
        string bodyAr
        string bodyEn
        string status "published | unpublished"
        string metadata "JSON string"
    }
    ContentRevision {
        string id PK
        int revisionNumber
        string previousState "JSON snapshot"
        string changedFields "JSON array"
    }
    ServiceInquiry {
        string id PK
        string serviceName "snapshot"
        string source "service | contact"
        string status "new | read | archived"
    }
    PageView {
        string id PK
        string path
        string device
        string lang
        string sessionId "daily-rotating"
    }
```

---

## Architectural risks worth tracking

1. **Builds ignore all type and lint errors** — `next.config.js` sets
   `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` to `true`.
2. **JSON-string `metadata` defeats SQL** — public reads fetch all rows then
   filter/sort/search in JS. Won't scale; can't be indexed.
3. **In-memory rate limiting** — doesn't survive across serverless instances;
   Redis is the intended prod fix.
4. **Dual DB env vars** — runtime reads `TURSO_DATABASE_URL`, migrations read
   `DATABASE_URL`. Works locally because both point to the same file, but it's a footgun.
5. **v1/v2 duplication** — nearly every component/admin page exists twice; needs a
   cutover plan so v1 can be removed.
