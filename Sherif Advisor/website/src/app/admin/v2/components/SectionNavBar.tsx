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

/** Friendly display name per V2 section key (matches the sections list). */
const V2_SECTION_NAMES: Record<string, string> = {
  hero: 'Hero',
  journey: 'Your Journey',
  services: 'Services Grid',
  markets: 'Markets Banner',
  digital: 'Digital Experience',
  packages: 'Packages',
  contact: 'Contact',
};

/** Order the sections to match how they appear on the /v2 page. */
const V2_SECTION_ORDER = [
  'hero',
  'journey',
  'services',
  'markets',
  'digital',
  'packages',
  'contact',
];

export interface SectionNavBarProps {
  /** The id of the section currently being edited (for active highlighting). */
  currentId: string;
}

/**
 * SectionNavBar — A quick-jump bar of all V2 landing page sections shown while
 * editing a single section. Lets the admin navigate between sections without
 * returning to the list. Fetches the V2 sections once and renders them as
 * pills in their on-page order, highlighting the active one.
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
        if (cancelled) return;
        const v2 = (data.items || [])
          .filter((item) => item.metadata?.page === 'v2')
          .sort((a, b) => {
            const ai = V2_SECTION_ORDER.indexOf(a.metadata?.sectionKey ?? '');
            const bi = V2_SECTION_ORDER.indexOf(b.metadata?.sectionKey ?? '');
            return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
          });
        setSections(v2);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (sections.length === 0) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-brand-navy p-3">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Layers className="w-4 h-4 text-brand-gold" />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          V2 Sections
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => {
          const key = section.metadata?.sectionKey ?? '';
          const name = V2_SECTION_NAMES[key] ?? key;
          const active = section.id === currentId;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                if (!active) router.push(`/admin/v2/sections/${section.id}/edit`);
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
  );
}
