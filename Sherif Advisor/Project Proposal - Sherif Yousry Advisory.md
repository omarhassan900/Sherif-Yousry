# Project Proposal
## Sherif Yousry Advisory — Digital Platform & Website

---

**Prepared by:** [Your Name / Company]  
**Date:** August 25, 2026  
**Client:** Sherif Yousry Advisory  

---

## 1. Project Overview

A comprehensive, bilingual (Arabic & English) digital advisory platform for **Sherif Yousry Advisory** — serving investors and companies with tax, finance, risk management, and business consulting services across **Egypt, Saudi Arabia, and the UAE**.

The platform includes a full public-facing website, a secure Admin Content Management System (CMS), and the infrastructure for future client portal and AI-powered features.

---

## 2. Scope of Deliverables

### 2.1 Public-Facing Website

A fully responsive, professional website with RTL-first Arabic design and English language support.

#### Pages Included:

| Page | Description |
|------|-------------|
| **Homepage** | Hero section, company statistics, services overview, differentiators, client logos, assessment CTA, knowledge articles, contact section |
| **Services** | 9 practice areas with detailed descriptions in Arabic & English |
| **About** | Company values, methodology, team overview |
| **Knowledge Center** | Articles, regulatory updates, guides with category filtering |
| **Contact** | Professional contact form with full validation |
| **Client Portal** | Login page (ready for future authentication integration) |

#### Homepage Sections:

- **Hero** — Main brand messaging and call-to-action
- **Statistics** — 9 Practice Areas, 12 Sectors Covered, 3 Markets (Egypt/KSA/UAE), 24h Response Commitment
- **Services Grid** — Overview of all 9 advisory services
- **Why Us** — 5 key differentiators
- **Client Logos** — Trusted clients showcase
- **Assessment CTA** — Free assessment call-to-action
- **Knowledge** — Latest articles and insights
- **Contact** — Quick contact section

---

### 2.2 Advisory Services (9 Practice Areas)

Each service is fully managed through the CMS with bilingual content:

| # | Service (Arabic) | Service (English) | Description |
|---|---|---|---|
| 1 | الاستشارات الضريبية | Tax Advisory | Corporate tax, VAT, transfer pricing, compliance & disputes |
| 2 | الاستشارات المالية | Financial Advisory | Valuation, due diligence, restructuring, transaction support |
| 3 | المدير المالي بالتعاقد | Outsourced CFO | Management reporting, budgets, financial forecasts (monthly retainer) |
| 4 | المخاطر والحوكمة | Risk & Governance | Internal controls, COSO frameworks, digital audits |
| 5 | إدارة الأعمال | Business Management | Outsourcing, process optimization, operating models, performance management |
| 6 | التوسع الدولي | International Expansion | Market entry, regional structuring, cross-border tax |
| 7 | تأسيس الشركات | Company Formation | Legal entity setup, government registrations, licenses (Egypt & GCC) |
| 8 | خدمات المستثمرين | Investor Services | Investor procedures, government facilitation, licensing |
| 9 | الخدمات الرقمية | Digital Services | Secure client portal, AI assistant, encrypted document management |

---

### 2.3 Admin Portal & Content Management System (CMS)

A complete, secure CMS accessible at `/admin` enabling the client to manage all website content independently.

#### CMS Features:

**Authentication & Security:**
- Secure login with email/password
- JWT-based sessions (8-hour expiry)
- Account lockout after 5 failed attempts (15-minute lock)
- Password policy enforcement (uppercase, lowercase, digit, 8+ characters)
- Role-based access (Super Admin / Admin)
- Forced password change on first login

**Content Dashboard:**
- Content statistics (total items per type)
- 10 most recently modified items
- Sidebar navigation to all content sections
- Search functionality across all content

**Bilingual Content Editor:**
- Side-by-side Arabic (RTL) and English (LTR) editing panels
- Rich text editor (Tiptap) supporting:
  - Headings (H2–H4)
  - Bold, italic
  - Bullet and numbered lists
  - Links
  - Embedded images
- Full RTL/LTR support per panel
- Validation with inline error messages

**Service Management:**
- Create, edit, publish/unpublish services
- Icon picker from predefined set
- Custom display order
- Bilingual titles and descriptions

**Article Management (Knowledge Center):**
- Create and publish articles in Arabic & English
- Category assignment and management
- Featured image support
- Scheduled publishing (future date)
- Pagination (20 per page)

**Page Section Editing:**
- Edit homepage hero, statistics, about, and contact sections
- No developer required for content updates
- Live preview before publishing
- Section-specific fields (title, subtitle, body, stats, CTA)

**Media Manager:**
- Image upload (JPEG, PNG, WebP — max 5MB)
- Gallery view with thumbnails
- Drag-and-drop upload
- Reference tracking (warns before deleting images in use)
- Automatic image optimization

**Administrator Management:**
- Create additional admin accounts
- Deactivate accounts (with immediate session invalidation)
- Role assignment (Super Admin / Admin)
- Temporary password generation

**Revision History & Audit Trail:**
- Full change history (up to 50 revisions per item)
- See who changed what, and when
- View previous versions in detail
- One-click restore to any previous version
- Restore action is itself reversible

---

### 2.4 Bilingual (Arabic & English) Support

- **RTL-first design** — Arabic is the default language
- **Language toggle** — Visible on every page for visitors
- **Session persistence** — Language preference saved for the browsing session
- **Fallback logic** — If content is missing in one language, the other is shown
- **CMS bilingual editing** — All content managed in both languages simultaneously

---

### 2.5 Design System & Branding

| Element | Specification |
|---------|--------------|
| Primary Color | Navy (#0A1E3C) |
| Accent Color | Gold (#C9A961) |
| Background | Light (#F4F5F7) |
| Arabic Headings | Amiri font |
| English Headings | Cormorant Garamond |
| Body Text | IBM Plex Sans Arabic |
| Labels/Mono | IBM Plex Mono |
| Icons | Lucide React |
| Animations | Framer Motion |

---

### 2.6 Security Features

| Layer | Implementation |
|-------|---------------|
| Transport | HSTS, TLS 1.3 enforced |
| HTTP Headers | Content Security Policy, X-Frame-Options, X-Content-Type-Options |
| Authentication | JWT (HS256) + role-based access |
| Sessions | HttpOnly, Secure, SameSite=Strict cookies |
| Input Validation | Zod schema validation + XSS sanitization |
| Rate Limiting | Per-IP request throttling |
| Account Protection | Lockout after failed attempts |
| Access Control | Role-based (Super Admin / Admin) |

---

### 2.7 Technical Architecture

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite via Prisma ORM (migrateable to PostgreSQL) |
| Authentication | JWT via jose library |
| Password Hashing | bcryptjs |
| Rich Text Editor | Tiptap (headless) |
| Image Processing | Sharp |
| Animations | Framer Motion |
| Icons | Lucide React |
| Validation | Zod |
| Testing | Vitest + Testing Library + fast-check |

---

## 3. Key Differentiators (Why Us Section)

The website prominently features 5 differentiators:

1. **انضباط المكاتب الكبرى** (Big Firm Discipline) — Methodology led by senior professionals with documented quality review
2. **تركيز على العميل** (Client Focus) — Custom scope with direct partner communication
3. **خبرة محلية** (Local Expertise) — Deep knowledge of Egyptian regulation and enforcement
4. **حضور إقليمي** (Regional Presence) — Expansion to KSA and UAE alongside clients
5. **تنفيذ رقمي** (Digital Execution) — Portal, calendars, and tracked deliverables as standard

---

## 4. Future Roadmap (Planned Phases)

### Phase 2 — Client Portal
- User registration & authentication with 2FA
- Encrypted document upload/download
- Service request tracking
- Appointment scheduling
- Secure messaging

### Phase 3 — AI & Knowledge
- AI Chatbot with RAG (tax/regulatory knowledge base)
- Knowledge center CMS enhancements
- Personalized regulatory alerts
- Document analysis assistant

### Phase 4 — Advanced Features
- Multi-tenant portal (advisor + client views)
- Financial dashboard & reporting
- Payment integration
- Mobile app (React Native)
- API for third-party integrations

---

## 5. Deliverables Summary

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Responsive public website (6 pages) | ✅ Complete |
| 2 | Arabic RTL + English bilingual support | ✅ Complete |
| 3 | Admin CMS Portal with full content management | ✅ Complete |
| 4 | 9 service pages with bilingual content | ✅ Complete |
| 5 | Knowledge center with articles & categories | ✅ Complete |
| 6 | Media management system | ✅ Complete |
| 7 | Administrator management (multi-user) | ✅ Complete |
| 8 | Content revision history & audit trail | ✅ Complete |
| 9 | Security middleware & headers | ✅ Complete |
| 10 | Contact form with validation | ✅ Complete |
| 11 | Design system (Navy/Gold branding) | ✅ Complete |
| 12 | AI Chat widget (UI ready) | ✅ Complete |
| 13 | Client portal login page | ✅ Complete |
| 14 | Testing suite (property-based + unit) | ✅ Complete |
| 15 | Production-ready deployment configuration | ✅ Complete |

---

## 6. What the Client Receives

1. **Full source code** — Complete ownership of the codebase
2. **Admin panel access** — Super Admin account to manage all content
3. **Documentation** — README with setup, architecture, and usage instructions
4. **Database** — SQLite database (upgradeable to PostgreSQL for production)
5. **Deployment-ready** — Production build scripts and configuration
6. **Design assets** — Full Tailwind-based design system matching brand identity
7. **Future-proof architecture** — Clean, modular code ready for Phase 2–4 features
8. **Security hardened** — Industry-standard security headers and practices
9. **SEO ready** — Server-side rendering with Next.js for search engine optimization
10. **Content independence** — Full ability to update all website content without a developer

---

## 7. Markets Covered

- 🇪🇬 **Egypt** — Primary market
- 🇸🇦 **Saudi Arabia** — Regional expansion
- 🇦🇪 **United Arab Emirates** — Regional expansion

---

## 8. Terms & Conditions

[To be filled with payment terms, timeline, support period, hosting arrangements, etc.]

---

**Prepared for:** Sherif Yousry Advisory  
**Platform:** sherifyousry.com  
**Contact:** [Your Contact Information]

---

*© 2026 — All rights reserved.*
