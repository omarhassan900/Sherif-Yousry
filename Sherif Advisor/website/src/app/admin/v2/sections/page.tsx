'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import AdminShell from '../components/AdminShell';

interface SectionItem {
  id: string;
  type: string;
  titleAr: string;
  titleEn: string;
  status: string;
  metadata: {
    page: string;
    sectionKey: string;
    fields: Record<string, { ar: string; en: string }>;
  };
  updatedAt: string;
}

interface ApiResponse {
  items: SectionItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Page display names keyed by metadata.page value */
const PAGE_LABELS: Record<string, string> = {
  v2: 'V2 Landing Page',
};

/**
 * The v2 admin only manages the V2 landing page sections (they map to /v2).
 * Legacy homepage/about/contact sections belong to the original admin and
 * preview against the old site, so we omit them here to avoid confusing,
 * mismatched previews.
 */
const V2_PAGE = 'v2';

/** Order the V2 sections to match how they appear on the /v2 page. */
const V2_SECTION_ORDER = [
  'hero',
  'journey',
  'services',
  'markets',
  'digital',
  'packages',
  'contact',
];

/**
 * Friendly display name + description per section, keyed by "page:sectionKey".
 * Makes it clear which part of the public site each section controls.
 */
const SECTION_META: Record<string, { name: string; desc: string }> = {
  // V2 landing page sections (match the components rendered at /v2).
  'v2:hero': { name: 'Hero', desc: 'Headline, subtitle, CTAs, eyebrow, location & feature cards' },
  'v2:journey': { name: 'Your Journey', desc: 'Heading, eyebrow & "explore services" link' },
  'v2:services': { name: 'Services Grid', desc: 'Heading, eyebrow, intro paragraph & CTA' },
  'v2:markets': { name: 'Markets Banner', desc: 'Heading, eyebrow, description, CTA & right heading' },
  'v2:digital': { name: 'Digital Experience', desc: 'App announcement heading, body, badge & notify button' },
  'v2:packages': { name: 'Packages', desc: 'Heading, eyebrow & custom-package note' },
  'v2:contact': { name: 'Contact', desc: 'Heading, eyebrow, contact details & form title' },
};

/** Formats a sectionKey like "hero" into a fallback display name */
function formatSectionName(key: string): string {
  return key
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getSectionMeta(page: string, key: string): { name: string; desc: string } {
  return (
    SECTION_META[`${page}:${key}`] ?? {
      name: formatSectionName(key),
      desc: '',
    }
  );
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function AdminSectionsPage() {
  const [items, setItems] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  // Fetch page sections
  useEffect(() => {
    async function fetchSections() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          type: 'page_section',
          pageSize: '50', // Fixed set, fetch all
        });
        const res = await fetch(`/api/admin/content?${params.toString()}`);
        if (res.ok) {
          const data: ApiResponse = await res.json();
          setItems(data.items);
        }
      } catch (error) {
        console.error('Failed to fetch page sections:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSections();
  }, []);

  // Fetch admin name
  useEffect(() => {
    fetch('/api/admin/content/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.adminName) {
          setAdminName(data.adminName);
        }
      })
      .catch(() => {});
  }, []);

  // Keep only the V2 landing page sections and order them to match /v2.
  const v2Sections = items
    .filter((item) => item.metadata?.page === V2_PAGE)
    .sort((a, b) => {
      const ai = V2_SECTION_ORDER.indexOf(a.metadata?.sectionKey ?? '');
      const bi = V2_SECTION_ORDER.indexOf(b.metadata?.sectionKey ?? '');
      // Unknown keys sort to the end, preserving their relative order.
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

  return (
    <AdminShell adminName={adminName}>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            {PAGE_LABELS[V2_PAGE]} Sections
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Edit the content of each section on the /v2 landing page
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-lg border border-white/10 bg-brand-navy px-5 py-12 text-center text-text-muted">
            Loading page sections...
          </div>
        ) : v2Sections.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-brand-navy px-5 py-12 text-center text-text-muted">
            No V2 sections found. Run the seed script to create them.
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-brand-navy overflow-hidden divide-y divide-white/5">
            {v2Sections.map((section) => {
              const meta = getSectionMeta(
                section.metadata?.page || '',
                section.metadata?.sectionKey || ''
              );
              return (
                <Link
                  key={section.id}
                  href={`/admin/v2/sections/${section.id}/edit`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 shrink-0 text-text-muted group-hover:text-brand-gold transition-colors" />
                    <div className="min-w-0">
                      <span className="block text-text-primary font-medium group-hover:text-brand-gold transition-colors">
                        {meta.name}
                      </span>
                      {meta.desc && (
                        <span className="block text-xs text-text-muted truncate">
                          {meta.desc}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-text-secondary whitespace-nowrap shrink-0">
                    {formatDate(section.updatedAt)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
