'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, Search, ChevronLeft, ChevronRight,
  Trash2, Pencil, CalendarDays, GraduationCap,
} from 'lucide-react';
import AdminShell from '../components/AdminShell';

interface EventItem {
  id: string;
  titleEn: string;
  titleAr: string;
  status: string;
  metadata: {
    category?: string;
    eventType?: string;
    startDate?: string;
    location?: string;
  };
  updatedAt: string;
}

interface ApiResponse {
  items: EventItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Categories that belong to "Training" tab
const TRAINING_CATEGORIES = new Set(['workshop', 'webinar', 'seminar', 'training']);
// Categories that belong to "Events" tab
const EVENT_CATEGORIES = new Set(['conference', 'summit', 'networking', 'event']);

const CATEGORY_LABELS: Record<string, string> = {
  workshop:    'Workshop',
  seminar:     'Seminar',
  webinar:     'Webinar',
  conference:  'Conference',
  training:    'Training',
  summit:      'Summit',
  networking:  'Networking',
  event:       'Event',
};

type Tab = 'events' | 'training';

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));
}

function StatusBadge({ status }: { status: string }) {
  const ok = status === 'published';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${ok ? 'bg-green-900/40 text-green-300' : 'bg-yellow-900/40 text-yellow-300'}`}>
      {ok ? 'Published' : 'Draft'}
    </span>
  );
}

export default function AdminEventsPage() {
  const [tab, setTab]               = useState<Tab>('events');
  const [allItems, setAllItems]     = useState<EventItem[]>([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [search, setSearch]         = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading]       = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adminName, setAdminName]   = useState('Admin');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when tab changes
  useEffect(() => { setPage(1); }, [tab]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch with type=event — large page to allow client-side tab filtering
      const params = new URLSearchParams({ type: 'event', page: String(page), pageSize: '50' });
      if (debouncedSearch.length >= 2) params.set('search', debouncedSearch);
      const res = await fetch(`/api/admin/content?${params}`);
      if (res.ok) {
        const data: ApiResponse = await res.json();
        setAllItems(data.items);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  useEffect(() => {
    fetch('/api/admin/content/stats').then(r => r.json()).then(d => { if (d.adminName) setAdminName(d.adminName); }).catch(() => {});
  }, []);

  // Client-side tab filter
  const items = allItems.filter(item => {
    const cat = (item.metadata?.category ?? '').toLowerCase();
    if (tab === 'training') return TRAINING_CATEGORIES.has(cat);
    // "events" tab = conference/summit/networking/event OR unknown categories
    return EVENT_CATEGORIES.has(cat) || (!TRAINING_CATEGORIES.has(cat) && cat !== '');
  });

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEvents();
    } finally {
      setDeletingId(null);
    }
  }

  const tabCls = (t: Tab) =>
    `flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
      tab === t
        ? 'border-brand-gold text-brand-gold'
        : 'border-transparent text-text-secondary hover:text-text-primary'
    }`;

  return (
    <AdminShell adminName={adminName}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-brand-gold" />
              Events &amp; Training
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage events, workshops, webinars, and training sessions ({total} total)
            </p>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy-dark font-medium text-sm rounded-lg hover:bg-brand-gold/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New {tab === 'training' ? 'Training' : 'Event'}
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 flex gap-0 -mb-px">
          <button className={tabCls('events')} onClick={() => setTab('events')}>
            <CalendarDays className="w-4 h-4" />
            Events
          </button>
          <button className={tabCls('training')} onClick={() => setTab('training')}>
            <GraduationCap className="w-4 h-4" />
            Training
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={`Search ${tab === 'training' ? 'training sessions' : 'events'} by title...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-navy border border-white/10 rounded-lg text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-white/10 bg-brand-navy overflow-hidden">
          {loading ? (
            <div className="px-5 py-12 text-center text-text-muted">Loading...</div>
          ) : items.length === 0 ? (
            <div className="px-5 py-12 text-center text-text-muted">
              {debouncedSearch
                ? 'No results match your search.'
                : `No ${tab === 'training' ? 'training sessions' : 'events'} yet. Create one with the button above.`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-text-secondary">
                    <th className="text-left px-5 py-3 font-medium">Title</th>
                    <th className="text-left px-5 py-3 font-medium">Category</th>
                    <th className="text-left px-5 py-3 font-medium">Type</th>
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3">
                        <Link href={`/admin/events/${item.id}/edit`} className="text-text-primary font-medium hover:text-brand-gold transition-colors truncate block max-w-[240px]">
                          {item.titleEn || '(Untitled)'}
                        </Link>
                        <span className="text-xs text-text-muted block truncate max-w-[240px]" dir="rtl">{item.titleAr}</span>
                      </td>
                      <td className="px-5 py-3 text-text-secondary capitalize">
                        {CATEGORY_LABELS[item.metadata?.category ?? ''] ?? item.metadata?.category ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">{item.metadata?.eventType ?? '—'}</td>
                      <td className="px-5 py-3 text-text-secondary whitespace-nowrap">
                        {formatDate(item.metadata?.startDate)}
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/events/${item.id}/edit`} className="p-1.5 text-text-muted hover:text-brand-gold rounded transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(item.id, item.titleEn)} disabled={deletingId === item.id}
                            className="p-1.5 text-text-muted hover:text-red-400 rounded transition-colors disabled:opacity-40" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
