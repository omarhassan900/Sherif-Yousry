/**
 * Seed script: extract rich article content from the HTML export files
 * and store it as bodyEn in the matching sub-service ContentItems.
 *
 * Run with:  node scripts/seed-service-content.mjs
 *
 * Strategy:
 *   1. Read each HTML file
 *   2. Extract the <article> element
 *   3. Strip inline styles → replace with semantic Tailwind-compatible class names
 *   4. Update the matching ContentItem.bodyEn in the database
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXPORT_DIR = join(__dirname, '../public/services/services-export');

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL || 'file:./prisma/dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────────────────────────────────────
// Map: HTML filename → sub-service title (EN) used to find the DB record
// ─────────────────────────────────────────────────────────────────────────────
const FILE_TO_TITLE = {
  'tax-direct-indirect-taxation.html':  'Direct & Indirect Taxation',
  'tax-international-taxation.html':    'International Taxation',
  'tax-transfer-pricing.html':          'Transfer Pricing',
  'tax-dispute-resolution.html':        'Tax Dispute Resolution',
  'tax-due-diligence-structuring.html': 'Tax Due Diligence & Structuring',
  'tax-accounting.html':                'Tax Accounting',
  'tax-e-invoicing.html':               'E-Invoicing & E-Receipt Compliance',
  // Category-level pages (map to category records)
  'tax-advisory.html':                  'Tax Advisory',
  'audit-accounting-assurance.html':    'Audit, Accounting & Assurance',
  'financial-advisory.html':            'Financial Advisory',
  'business-management-advisory.html':  'Business, Economic & Management Advisory',
  'corporate-legal-services.html':      'Corporate & Legal Services',
  'payroll-social-insurance.html':      'Payroll & Social Insurance',
  'ecommerce-digital-business.html':    'E-Commerce & Digital Business',
};

// ─────────────────────────────────────────────────────────────────────────────
// Extract <article> from an HTML string and clean it into styled HTML
// ─────────────────────────────────────────────────────────────────────────────
function extractArticle(html) {
  // Pull the <article ...> ... </article> block
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (!articleMatch) return null;

  let content = articleMatch[1];

  // Remove the <h1> (already shown as page title)
  content = content.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');

  // ── Replace styled elements with semantic class-based HTML ──────────────

  // h2 headings (gold, serif)
  content = content.replace(
    /<h2[^>]*>([\s\S]*?)<\/h2>/gi,
    '<h2 class="service-h2">$1</h2>'
  );

  // Lead paragraph (larger font — first <p> with font-size: 21px)
  content = content.replace(
    /<p[^>]*font-size: 21px[^>]*>([\s\S]*?)<\/p>/gi,
    '<p class="service-lead">$1</p>'
  );

  // Body paragraphs
  content = content.replace(
    /<p[^>]*color: #2B3545[^>]*>([\s\S]*?)<\/p>/gi,
    '<p class="service-p">$1</p>'
  );

  // Strong labels (bold service names)
  content = content.replace(
    /<strong[^>]*>([\s\S]*?)<\/strong>/gi,
    '<strong class="service-strong">$1</strong>'
  );

  // Steps grid (ol with grid layout)
  content = content.replace(
    /<ol[^>]*display: grid[^>]*>([\s\S]*?)<\/ol>/gi,
    '<ol class="service-steps">$1</ol>'
  );

  // Step list items
  content = content.replace(
    /<li[^>]*border-top: 2px solid #D4B06A[^>]*>([\s\S]*?)<\/li>/gi,
    '<li class="service-step">$1</li>'
  );

  // Step number span (e.g. "Step 1")
  content = content.replace(
    /<span[^>]*color: #7A5A1E; font-weight: 600[^>]*>([\s\S]*?)<\/span>/gi,
    '<span class="service-step-num">$1</span>'
  );

  // Step title span (large, bold)
  content = content.replace(
    /<span[^>]*font-size: 18px; font-weight: 600[^>]*>([\s\S]*?)<\/span>/gi,
    '<span class="service-step-title">$1</span>'
  );

  // Step body span
  content = content.replace(
    /<span[^>]*font-size: 15px[^>]*>([\s\S]*?)<\/span>/gi,
    '<span class="service-step-body">$1</span>'
  );

  // "Who we advise" highlight box
  content = content.replace(
    /<div[^>]*background: #F2F4F7[^>]*>([\s\S]*?)<\/div>/gi,
    '<div class="service-highlight">$1</div>'
  );

  // Highlight box title span
  content = content.replace(
    /<span[^>]*font-size: 16px; font-weight: 600[^>]*>([\s\S]*?)<\/span>/gi,
    '<span class="service-highlight-title">$1</span>'
  );

  // Highlight box body span
  content = content.replace(
    /<span[^>]*font-size: 16px[^>]*>([\s\S]*?)<\/span>/gi,
    '<span class="service-highlight-body">$1</span>'
  );

  // FAQ/details accordion
  content = content.replace(
    /<details[^>]*>([\s\S]*?)<\/details>/gi,
    '<details class="service-faq">$1</details>'
  );

  content = content.replace(
    /<summary[^>]*>([\s\S]*?)<\/summary>/gi,
    '<summary class="service-faq-q">$1</summary>'
  );

  content = content.replace(
    /<p[^>]*margin: 12px[^>]*>([\s\S]*?)<\/p>/gi,
    '<p class="service-faq-a">$1</p>'
  );

  // FAQ wrapper div
  content = content.replace(
    /<div[^>]*display: flex; flex-direction: column;[^>]*>([\s\S]*?)<\/div>/gi,
    '<div class="service-faq-list">$1</div>'
  );

  // Closing quote paragraph
  content = content.replace(
    /<p[^>]*font-family: 'Newsreader'[^>]*>([\s\S]*?)<\/p>/gi,
    '<p class="service-closing">$1</p>'
  );

  // Grid for sub-service cards (inside tax-advisory category page)
  content = content.replace(
    /<div[^>]*display: grid; grid-template-columns: repeat\(2[^>]*>([\s\S]*?)<\/div>/gi,
    '<div class="service-grid-2col">$1</div>'
  );

  // Sub-service card link
  content = content.replace(
    /<a[^>]*href="([^"]+\.html)"[^>]*>([\s\S]*?)<\/a>/gi,
    (match, href, inner) => {
      // Convert html filenames to service slugs — strip .html
      const slug = href.replace('.html', '');
      return `<a href="/services-redirect/${slug}" class="service-card">${inner}</a>`;
    }
  );

  // Sector grid items
  content = content.replace(
    /<div[^>]*border-top: 1px solid #C7CDD6[^>]*>([\s\S]*?)<\/div>/gi,
    '<div class="service-sector">$1</div>'
  );

  // Sector title
  content = content.replace(
    /<span[^>]*font-size: 18px; font-weight: 600[^>]*>([\s\S]*?)<\/span>/gi,
    '<span class="service-sector-title">$1</span>'
  );

  // Sector body
  content = content.replace(
    /<span[^>]*font-size: 15px; line-height: 1.65[^>]*>([\s\S]*?)<\/span>/gi,
    '<span class="service-sector-body">$1</span>'
  );

  // Strip all remaining inline style attributes
  content = content.replace(/ style="[^"]*"/gi, '');

  // Strip leftover empty attribute fragments
  content = content.replace(/ aria-label="[^"]*"/gi, '');
  content = content.replace(/ aria-current="[^"]*"/gi, '');

  // Collapse excessive whitespace between tags
  content = content.replace(/>\s{2,}</g, '>\n<');

  return content.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  // Load all service ContentItems once
  const allServices = await prisma.contentItem.findMany({
    where: { type: 'service' },
  });

  function findByTitle(titleEn) {
    return allServices.find(s => s.titleEn === titleEn);
  }

  const files = Object.keys(FILE_TO_TITLE);
  let updated = 0;
  let skipped = 0;

  for (const filename of files) {
    const titleEn = FILE_TO_TITLE[filename];
    const filePath = join(EXPORT_DIR, filename);

    let html;
    try {
      html = readFileSync(filePath, 'utf-8');
    } catch {
      console.warn(`  ⚠ File not found: ${filename}`);
      skipped++;
      continue;
    }

    const articleContent = extractArticle(html);
    if (!articleContent) {
      console.warn(`  ⚠ No <article> found in: ${filename}`);
      skipped++;
      continue;
    }

    const record = findByTitle(titleEn);
    if (!record) {
      console.warn(`  ⚠ No DB record found for: "${titleEn}"`);
      skipped++;
      continue;
    }

    await prisma.contentItem.update({
      where: { id: record.id },
      data: { bodyEn: articleContent },
    });

    console.log(`  ✓ Updated: ${titleEn}`);
    updated++;
  }

  console.log(`\n✅ Done. Updated: ${updated}, Skipped: ${skipped}`);
}

main()
  .catch(e => { console.error('❌ Failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
