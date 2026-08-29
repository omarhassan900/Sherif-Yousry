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
  homepage: 'Homepage',
  about: 'About',
  contact: 'Contact',
};

/** Display order for page groups */
const PAGE_ORDER = ['homepage', 'about', 'contact'];

/** Formats a sectionKey like "hero" or "services" into a nice display name */
function formatSectionName(key: string): string {
  return key
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
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

  // Group sections by page
  const grouped = PAGE_ORDER.reduce<Record<string, SectionItem[]>>((acc, page) => {
    const sections = items.filter(
      (item) => item.metadata?.page === page
    );
    if (sections.length > 0) {
      acc[page] = sections;
    }
    return acc;
  }, {});

  return (
    <AdminShell adminName={adminName}>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Page Sections
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Edit static website sections for each page
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-lg border border-white/10 bg-brand-navy px-5 py-12 text-center text-text-muted">
            Loading page sections...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-brand-navy px-5 py-12 text-center text-text-muted">
            No page sections found. Run the seed script to create predefined sections.
          </div>
        ) : (
          <div className="space-y-8">
            {PAGE_ORDER.map((page) => {
              const sections = grouped[page];
              if (!sections || sections.length === 0) return null;

              return (
                <div key={page}>
                  {/* Page group heading */}
                  <h2 className="text-lg font-medium text-text-primary mb-3">
                    {PAGE_LABELS[page] || page}
                  </h2>

                  {/* Section cards */}
                  <div className="rounded-lg border border-white/10 bg-brand-navy overflow-hidden divide-y divide-white/5">
                    {sections.map((section) => (
                      <Link
                        key={section.id}
                        href={`/admin/sections/${section.id}/edit`}
                        className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-text-muted group-hover:text-brand-gold transition-colors" />
                          <span className="text-text-primary font-medium group-hover:text-brand-gold transition-colors">
                            {formatSectionName(section.metadata?.sectionKey || '')}
                          </span>
                        </div>
                        <span className="text-sm text-text-secondary whitespace-nowrap">
                          {formatDate(section.updatedAt)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
