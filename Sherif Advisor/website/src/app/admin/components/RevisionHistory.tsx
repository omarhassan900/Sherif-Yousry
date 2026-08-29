'use client';

import { useState, useEffect, useCallback } from 'react';
import { History, RotateCcw, ChevronDown, ChevronUp, X } from 'lucide-react';

interface Revision {
  id: string;
  revisionNumber: number;
  changedFields: string[];
  changedBy: { displayName: string };
  createdAt: string;
  previousState: Record<string, unknown>;
}

interface RevisionHistoryProps {
  contentId: string;
}

export default function RevisionHistory({ contentId }: RevisionHistoryProps) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState('');

  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  const fetchRevisions = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/content/${contentId}/revisions?page=${pageNum}`
      );
      if (res.ok) {
        const data = await res.json();
        setRevisions(data.items || []);
        setTotal(data.total || 0);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    if (expanded) {
      fetchRevisions(page);
    }
  }, [expanded, page, fetchRevisions]);

  async function handleRestore(revisionId: string) {
    setRestoring(true);
    setRestoreError('');
    try {
      const res = await fetch(
        `/api/admin/content/${contentId}/revisions/${revisionId}/restore`,
        { method: 'POST' }
      );
      if (res.ok) {
        setSelectedRevision(null);
        // Reload the page to reflect restored content
        window.location.reload();
      } else {
        const data = await res.json().catch(() => null);
        setRestoreError(data?.error || 'Failed to restore revision');
      }
    } catch {
      setRestoreError('Network error. Please try again.');
    } finally {
      setRestoring(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatFieldName(field: string): string {
    const map: Record<string, string> = {
      titleAr: 'Title (AR)',
      titleEn: 'Title (EN)',
      bodyAr: 'Body (AR)',
      bodyEn: 'Body (EN)',
      status: 'Status',
      metadata: 'Metadata',
    };
    return map[field] || field;
  }

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-brand-navy-dark hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
          <History className="w-4 h-4 text-brand-gold" />
          Revision History
          {total > 0 && (
            <span className="text-xs text-text-muted">({total})</span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>

      {/* Revision List */}
      {expanded && (
        <div className="border-t border-white/10">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-text-muted">
              Loading revisions...
            </div>
          ) : revisions.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-text-muted">
              No revisions yet. Changes will appear here after edits.
            </div>
          ) : (
            <>
              <ul className="divide-y divide-white/5">
                {revisions.map((rev) => (
                  <li key={rev.id} className="px-4 py-3 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-text-muted">#{rev.revisionNumber}</span>
                          <span className="text-text-secondary">
                            {rev.changedBy?.displayName || 'Unknown'}
                          </span>
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">
                          {formatDate(rev.createdAt)}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {rev.changedFields.map((field) => (
                            <span
                              key={field}
                              className="inline-block px-1.5 py-0.5 text-xs rounded bg-white/5 text-text-muted"
                            >
                              {formatFieldName(field)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedRevision(rev)}
                        className="shrink-0 p-1.5 rounded text-text-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                        title="View & Restore"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="text-xs text-text-muted hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-text-muted">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-xs text-text-muted hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Restore Dialog */}
      {selectedRevision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-brand-navy border border-white/10 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-medium text-text-primary">
                Revision #{selectedRevision.revisionNumber}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedRevision(null);
                  setRestoreError('');
                }}
                className="p-1 rounded text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              <div className="text-xs text-text-muted">
                <span className="font-medium">By:</span>{' '}
                {selectedRevision.changedBy?.displayName || 'Unknown'}
                {' • '}
                {formatDate(selectedRevision.createdAt)}
              </div>

              <div>
                <p className="text-xs font-medium text-text-secondary mb-1">Changed Fields:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedRevision.changedFields.map((field) => (
                    <span
                      key={field}
                      className="inline-block px-1.5 py-0.5 text-xs rounded bg-brand-gold/10 text-brand-gold"
                    >
                      {formatFieldName(field)}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-text-secondary mb-1">Previous State:</p>
                <pre className="text-xs text-text-muted bg-black/20 rounded p-2 overflow-x-auto max-h-48">
                  {JSON.stringify(selectedRevision.previousState, null, 2)}
                </pre>
              </div>

              {restoreError && (
                <div className="p-2 rounded bg-red-900/30 border border-red-500/40 text-xs text-red-300">
                  {restoreError}
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setSelectedRevision(null);
                  setRestoreError('');
                }}
                className="px-3 py-1.5 text-xs rounded border border-white/10 text-text-muted hover:text-text-primary hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={restoring}
                onClick={() => handleRestore(selectedRevision.id)}
                className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
                  restoring
                    ? 'bg-brand-gold/50 text-brand-navy/70 cursor-not-allowed'
                    : 'bg-brand-gold text-brand-navy hover:bg-brand-gold/90'
                }`}
              >
                {restoring ? 'Restoring...' : 'Restore This Revision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
