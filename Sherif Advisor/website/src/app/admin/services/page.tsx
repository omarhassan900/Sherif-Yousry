'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminShell from '../components/AdminShell';

interface ServiceItem {
  id: string;
  type: string;
  titleAr: string;
  titleEn: string;
  status: string;
  metadata: {
    displayOrder: number;
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

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch services
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'service',
        page: String(page),
      });
      if (debouncedSearch.length >= 2) {
        params.set('search', debouncedSearch);
      }

      const res = await fetch(`/api/admin/content?${params.toString()}`);
      if (res.ok) {
        const data: ApiResponse = await res.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Fetch admin name from session (via stats endpoint as a lightweight check)
  useEffect(() => {
    fetch('/api/admin/content/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.adminName) {
          setAdminName(data.adminName);
        }
      })
      .catch(() => {
        // Fallback — admin name stays as default
      });
  }, []);

  return (
    <AdminShell adminName={adminName}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Services
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage your service offerings ({total} total)
            </p>
          </div>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy-dark font-medium text-sm rounded-lg hover:bg-brand-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Service
          </Link>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search services by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-navy border border-white/10 rounded-lg text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-white/10 bg-brand-navy overflow-hidden">
          {loading ? (
            <div className="px-5 py-12 text-center text-text-muted">
              Loading services...
            </div>
          ) : items.length === 0 ? (
            <div className="px-5 py-12 text-center text-text-muted">
              {debouncedSearch
                ? 'No services found matching your search.'
                : 'No services yet. Create your first service.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-text-secondary">
                    <th className="text-left px-5 py-3 font-medium">
                      Title (EN)
                    </th>
                    <th className="text-left px-5 py-3 font-medium">
                      Title (AR)
                    </th>
                    <th className="text-left px-5 py-3 font-medium">
                      Order
                    </th>
                    <th className="text-left px-5 py-3 font-medium">
                      Status
                    </th>
                    <th className="text-left px-5 py-3 font-medium">
                      Last Modified
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/services/${item.id}/edit`}
                          className="text-text-primary font-medium hover:text-brand-gold transition-colors truncate block max-w-[200px]"
                        >
                          {item.titleEn || '(Untitled)'}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-text-secondary truncate max-w-[200px]" dir="rtl">
                        {item.titleAr || '(بدون عنوان)'}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {item.metadata?.displayOrder ?? '—'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-3 text-text-secondary whitespace-nowrap">
                        {formatDate(item.updatedAt)}
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
            <p className="text-sm text-text-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary border border-white/10 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary border border-white/10 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === 'published';
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        isPublished
          ? 'bg-green-900/40 text-green-300'
          : 'bg-yellow-900/40 text-yellow-300'
      }`}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}
