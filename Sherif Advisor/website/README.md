# Sherif Yousry Advisory — Website & Platform

A comprehensive digital advisory platform for **Sherif Yousry Advisory**, serving investors and companies with tax, finance, risk management, and business consulting services across Egypt, Saudi Arabia, and UAE.

## 🏗️ Architecture

```
website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # Backend API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── chat/           # AI Chatbot API
│   │   │   ├── contact/        # Contact form handler
│   │   │   └── portal/         # Client portal APIs (future)
│   │   ├── portal/             # Client portal (protected)
│   │   ├── services/           # Services pages
│   │   ├── knowledge/          # Knowledge center
│   │   ├── about/              # About page
│   │   └── contact/            # Contact page
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   ├── sections/           # Home page sections
│   │   ├── chat/               # AI Chat widget
│   │   └── ui/                 # Reusable UI components
│   ├── lib/                    # Utilities & security
│   └── middleware.ts           # Security middleware
├── public/                     # Static assets
├── tailwind.config.ts          # Design system
└── next.config.js              # Security headers + config
```

## 🔐 Security Features

| Layer | Implementation |
|-------|---------------|
| Transport | HSTS, TLS 1.3 enforced |
| Headers | CSP, X-Frame-Options, X-Content-Type-Options |
| Authentication | JWT (HS256) + 2FA ready |
| Session | HttpOnly, Secure, SameSite=Strict cookies |
| Input | Zod validation + XSS sanitization |
| Data | AES-256-GCM encryption at rest (planned) |
| Rate Limiting | Per-IP request throttling |
| Audit | Full event logging for compliance |
| Access Control | Role-based (client/advisor/admin) |

## 🚀 Current Pages

- **Home** — Full landing page with hero, services, stats, assessment CTA
- **Services** — 9 practice areas with detailed descriptions
- **About** — Company values, methodology, team
- **Knowledge Center** — Articles, regulatory updates, guides
- **Contact** — Form with validation
- **Client Portal** — Login page (auth integration pending)

## 📋 Planned Features (Roadmap)

### Phase 1 — Foundation ✅
- [x] Responsive website with Arabic RTL support
- [x] Contact form with validation
- [x] Security middleware & headers
- [x] AI Chat widget (UI ready)

### Phase 2 — Client Portal
- [ ] User registration & authentication (2FA)
- [ ] Document management (encrypted upload/download)
- [ ] Service request tracking
- [ ] Appointment scheduling
- [ ] Secure messaging

### Phase 3 — AI & Knowledge
- [ ] AI Chatbot with RAG (tax/regulatory knowledge base)
- [ ] Knowledge center CMS
- [ ] Personalized regulatory alerts
- [ ] Document analysis assistant

### Phase 4 — Advanced
- [ ] Multi-tenant portal (advisor + client views)
- [ ] Financial dashboard & reporting
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 🎨 Design System

- **Colors**: Navy (#0A1E3C), Gold (#C9A961), Light (#F4F5F7)
- **Fonts**: Amiri (headings AR), Cormorant Garamond (headings EN), IBM Plex Sans Arabic (body), IBM Plex Mono (labels)
- **Direction**: RTL-first with LTR support planned

## 📐 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 14 | Full-stack React framework |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Zod | Input validation |
| next-auth | Authentication (future) |
| jose | JWT handling |
| Framer Motion | Animations |
| Lucide React | Icons |

---

© 2024 Sherif Yousry Advisory. All rights reserved.
