'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layers } from 'lucide-react';

interface SectionItem {
  id: string;
  metadata: { page?: string; sectionKey?: string };
}

interface ApiResponse {
  items: SectionItem[];
}

/** Friendly display name + group order, matching the sections list page. */
const PAGE_LABELS: Record<string, string> = {
  homepage: 'Homepage',
  about: 'About',
  contact: 'Contact',
};

const PAGE_ORDER = ['homepage', 'about', 'contact'];

const SECTION_NAMES: Record<string, string> = {
  'homepage:hero': 'Hero Banner',
  'homepage:stats': 'Stats Bar',
  'homepage:why-us': 'Why Us',
  'homepage:markets': 'Regional Map',
  'homepage:assessment': 'Assessment CTA',
  'homepage:services': 'Services',
  'homepage:insights': 'Insights',
  'about:main': 'About Content',
  'contact:main': 'Contact Intro',
};

function sectionName(page: string, key: string): string {
  return (
    SECTION_NAMES[`${page}:${key}`] ??
    key.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export interface SectionNavBarProps {
  /** The id of the section currently being edited (for active highlighting). */
  currentId: string;
}

/**
 * SectionNavBar — A quick-jump bar of all page sections shown while editing a
 * single section. Lets the admin navigate between sections without returning
 * to the list. Sections are grouped by page and highlight the active one.
 */
export default function SectionNavBar({ currentId }: SectionNavBarProps) {
  const router = useRouter();
  const [sections, setSections] = useState<SectionItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ type: 'page_section', pageSize: '100' });
    fetch(`/api/admin/content?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: ApiResponse) => {
        if (!cancelled) setSections(data.items || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (sections.length === 0) return null;

  // Only show the legacy admin's own pages (homepage/about/contact); v2
  // sections are managed in the separate /admin/v2 portal.
  const groups = PAGE_ORDER.map((page) => ({
    page,
    items: sections.filter((s) => s.metadata?.page === page),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-brand-navy p-3 space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Layers className="w-4 h-4 text-brand-gold" />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Jump to section
        </span>
      </div>

      {groups.map((group) => (
        <div key={group.page} className="space-y-1.5">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted px-1">
            {PAGE_LABELS[group.page] ?? group.page}
          </span>
          <div className="flex flex-wrap gap-2">
            {group.items.map((section) => {
              const key = section.metadata?.sectionKey ?? '';
              const name = sectionName(section.metadata?.page ?? '', key);
              const active = section.id === currentId;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                    if (!active) router.push(`/admin/sections/${section.id}/edit`);
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    active
                      ? 'bg-brand-gold/15 text-brand-gold border-brand-gold/40 cursor-default'
                      : 'text-text-secondary border-white/10 hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
