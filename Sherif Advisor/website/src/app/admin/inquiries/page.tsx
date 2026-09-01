'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Inbox,
  Mail,
  Phone,
  Trash2,
  Check,
  Archive,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import AdminShell from '../components/AdminShell';

interface Inquiry {
  id: string;
  serviceId: string | null;
  serviceName: string;
  source: string;
  name: string;
  email: string;
  phone: string | null;
  countryCode: string | null;
  businessActivity: string | null;
  country: string | null;
  helpWith: string | null;
  consent: boolean;
  message: string | null;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
}

interface ApiResponse {
  items: Inquiry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  newCount: number;
}

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'archived', label: 'Archived' },
];

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.set('status', status);

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
      if (res.ok) {
        const data: ApiResponse = await res.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
        setTotal(data.total);
        setNewCount(data.newCount);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  useEffect(() => {
    fetch('/api/admin/content/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.adminName) setAdminName(data.adminName);
      })
      .catch(() => {});
  }, []);

  async function updateStatus(id: string, newStatus: Inquiry['status']) {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchInquiries();
    } catch (error) {
      console.error('Failed to update inquiry:', error);
    }
  }

  async function deleteInquiry(id: string) {
    if (!confirm('Delete this inquiry permanently?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) fetchInquiries();
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
    }
  }

  return (
    <AdminShell adminName={adminName}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <Inbox className="w-6 h-6" />
              Service Inquiries
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {total} total{newCount > 0 ? ` · ${newCount} new` : ''}
            </p>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                status === f.value
                  ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/40'
                  : 'text-text-secondary border-white/10 hover:bg-white/5'
              }`}
            >
              {f.label}
              {f.value === 'new' && newCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-brand-gold text-brand-navy-dark">
                  {newCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-text-muted">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-brand-navy px-5 py-16 text-center text-text-muted">
            No inquiries {status ? `with status "${status}"` : 'yet'}.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg border bg-brand-navy p-5 ${
                  item.status === 'new'
                    ? 'border-brand-gold/40'
                    : 'border-white/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-text-primary font-medium">
                        {item.name}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="flex items-center gap-4 flex-wrap text-sm text-text-secondary">
                      <a
                        href={`mailto:${item.email}`}
                        className="inline-flex items-center gap-1.5 hover:text-brand-gold transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {item.email}
                      </a>
                      {item.phone && (
                        <a
                          href={`tel:${item.countryCode ?? ''}${item.phone}`}
                          className="inline-flex items-center gap-1.5 hover:text-brand-gold transition-colors"
                          dir="ltr"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {item.countryCode ? `${item.countryCode} ` : ''}
                          {item.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* Tags */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-900/40 text-blue-300">
                    {item.source === 'contact' ? 'Contact' : 'Service'}: {item.serviceName}
                    {item.source === 'service' && !item.serviceId && ' (deleted)'}
                  </span>
                  {item.helpWith && item.helpWith !== item.serviceName && (
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-purple-900/40 text-purple-300">
                      Interested in: {item.helpWith}
                    </span>
                  )}
                </div>

                {/* Detail fields */}
                {(item.businessActivity || item.country) && (
                  <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-text-muted">
                    {item.businessActivity && (
                      <span>
                        <span className="text-text-secondary">Activity:</span>{' '}
                        {item.businessActivity}
                      </span>
                    )}
                    {item.country && (
                      <span>
                        <span className="text-text-secondary">Location:</span>{' '}
                        {item.country}
                      </span>
                    )}
                    <span>
                      <span className="text-text-secondary">Consent:</span>{' '}
                      {item.consent ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}

                {/* Message */}
                {item.message && (
                  <p className="mt-3 text-sm text-text-secondary leading-6 whitespace-pre-line border-t border-white/5 pt-3">
                    {item.message}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  {item.status !== 'read' && (
                    <button
                      onClick={() => updateStatus(item.id, 'read')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark read
                    </button>
                  )}
                  {item.status !== 'archived' && (
                    <button
                      onClick={() => updateStatus(item.id, 'archived')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => deleteInquiry(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
  const config: Record<string, string> = {
    new: 'bg-brand-gold/20 text-brand-gold',
    read: 'bg-green-900/40 text-green-300',
    archived: 'bg-gray-700/40 text-gray-300',
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        config[status] ?? 'bg-gray-700 text-gray-300'
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
