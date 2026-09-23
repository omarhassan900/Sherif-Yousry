'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Layers, FileText } from 'lucide-react';
import AdminShell from '../components/AdminShell';

interface ServiceItem {
  id: string;
  titleEn: string;
  titleAr: string;
  status: string;
  metadata: {
    serviceType?: string;
    categorySlug?: string;
    displayOrder?: number;
    icon?: string;
    [key: string]: unknown;
  };
  updatedAt: string;
}

interface ApiResponse {
  items: ServiceItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const CATEGORIES = [
  { slug: 'all',                        label: 'All' },
  { slug: 'categories',                 label: '📂 Categories' },
  { slug: 'tax-advisory',               label: 'Tax Advisory' },
  { slug: 'audit-accounting-assurance', label: 'Audit & Accounting' },
  { slug: 'financial-advisory',         label: 'Financial Advisory' },
  { slug: 'business-management-advisory', label: 'Business Advisory' },
  { slug: 'corporate-legal-services',   label: 'Corporate & Legal' },
  { slug: 'payroll-social-insurance',   label: 'Payroll & HR' },
  { slug: 'ecommerce-digital-business', label: 'E-Commerce & Digital' },
];

function formatDate(dateStr: string): string {
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

export default function AdminServicesPage() {
  const [allItems, setAllItems]   = useState<ServiceItem[]>([]);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const [search, setSearch]       = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading]     = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [activeTab]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: 'service', page: String(page), pageSize: '100' });
      if (debouncedSearch.length >= 2) params.set('search', debouncedSearch);
      const res = await fetch(`/api/admin/content?${params}`);
      if (res.ok) {
        const data: ApiResponse = await res.json();
        setAllItems(data.items);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  useEffect(() => {
    fetch('/api/admin/content/stats').then(r => r.json()).then(d => { if (d.adminName) setAdminName(d.adminName); }).catch(() => {});
  }, []);

  // Filter by active tab
  const items = allItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'categories') return item.metadata?.serviceType === 'category';
    return item.metadata?.categorySlug === activeTab;
  }).sort((a, b) => (a.metadata?.displayOrder ?? 99) - (b.metadata?.displayOrder ?? 99));

  const tabCls = (slug: string) =>
    `px-3 py-1.5 text-xs font-medium rounded-full border transition-colors whitespace-nowrap ${
      activeTab === slug
        ? 'bg-brand-gold/15 border-brand-gold/40 text-brand-gold'
        : 'border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5'
    }`;

  return (
    <AdminShell adminName={adminName}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Services</h1>
            <p className="text-sm text-text-secondary mt-1">
              {total} total — {allItems.filter(i => i.metadata?.serviceType === 'category').length} categories,{' '}
              {allItems.filter(i => i.metadata?.serviceType !== 'category').length} sub-services
            </p>
          </div>
          <Link href="/admin/services/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy-dark font-medium text-sm rounded-lg hover:bg-brand-gold/90 transition-colors">
            <Plus className="w-4 h-4" /> New Service
          </Link>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c.slug} onClick={() => setActiveTab(c.slug)} className={tabCls(c.slug)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-navy border border-white/10 rounded-lg text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors" />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-white/10 bg-brand-navy overflow-hidden">
          {loading ? (
            <div className="px-5 py-12 text-center text-text-muted">Loading services...</div>
          ) : items.length === 0 ? (
            <div className="px-5 py-12 text-center text-text-muted">
              {debouncedSearch ? 'No services match your search.' : 'No services found. Run the seed script or create one.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-text-secondary">
                    <th className="text-left px-5 py-3 font-medium w-6" />
                    <th className="text-left px-5 py-3 font-medium">Title</th>
                    <th className="text-left px-5 py-3 font-medium">Type</th>
                    <th className="text-left px-5 py-3 font-medium">Category</th>
                    <th className="text-left px-5 py-3 font-medium">Order</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Updated</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => {
                    const isCategory = item.metadata?.serviceType === 'category';
                    return (
                      <tr key={item.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 text-text-muted">
                          {isCategory ? <Layers className="w-4 h-4 text-brand-gold" /> : <FileText className="w-4 h-4" />}
                        </td>
                        <td className="px-5 py-3">
                          <Link href={`/admin/services/${item.id}/edit`} className="text-text-primary font-medium hover:text-brand-gold transition-colors block truncate max-w-[260px]">
                            {item.titleEn || '(Untitled)'}
                          </Link>
                          <span className="text-xs text-text-muted truncate block max-w-[260px]" dir="rtl">{item.titleAr}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${isCategory ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20' : 'bg-white/5 text-text-muted border border-white/10'}`}>
                            {isCategory ? 'Category' : 'Service'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-text-muted text-xs">
                          {item.metadata?.categorySlug || '—'}
                        </td>
                        <td className="px-5 py-3 text-text-secondary">{item.metadata?.displayOrder ?? '—'}</td>
                        <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                        <td className="px-5 py-3 text-text-muted whitespace-nowrap">{formatDate(item.updatedAt)}</td>
                        <td className="px-5 py-3">
                          <Link href={`/admin/services/${item.id}/edit`} className="p-1.5 text-text-muted hover:text-brand-gold rounded transition-colors inline-flex" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
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
