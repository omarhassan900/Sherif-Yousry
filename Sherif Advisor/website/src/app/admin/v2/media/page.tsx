'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import AdminShell from '../components/AdminShell';

interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  uploadedBy: string;
  uploadedAt: string;
}

interface MediaReference {
  mediaId: string;
  contentId: string;
  fieldName: string;
}

interface ApiResponse {
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(2)} MB`;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteReferences, setDeleteReferences] = useState<MediaReference[]>([]);
  const [showReferenceWarning, setShowReferenceWarning] = useState(false);

  // Fetch media items
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?page=${page}`);
      if (res.ok) {
        const data: ApiResponse = await res.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

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

  // Upload handler
  const handleUpload = async (file: File) => {
    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      // Refresh gallery after successful upload
      await fetchMedia();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset the input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  // Delete handler
  const handleDelete = async (item: MediaItem) => {
    setDeleteTarget(item);
    setDeleting(true);
    setDeleteReferences([]);
    setShowReferenceWarning(false);

    try {
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        // Successfully deleted, refresh gallery
        await fetchMedia();
        setDeleteTarget(null);
      } else if (res.status === 409) {
        // References exist — show warning dialog
        const data = await res.json();
        setDeleteReferences(data.references || []);
        setShowReferenceWarning(true);
      } else {
        const data = await res.json().catch(() => ({}));
        console.error('Delete failed:', data.error || res.status);
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error('Failed to delete media:', error);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  // Force delete handler
  const handleForceDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/media/${deleteTarget.id}?force=true`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        await fetchMedia();
      } else {
        console.error('Force delete failed:', res.status);
      }
    } catch (error) {
      console.error('Failed to force delete media:', error);
    } finally {
      setDeleting(false);
      setShowReferenceWarning(false);
      setDeleteTarget(null);
      setDeleteReferences([]);
    }
  };

  const closeWarningDialog = () => {
    setShowReferenceWarning(false);
    setDeleteTarget(null);
    setDeleteReferences([]);
  };

  return (
    <AdminShell adminName={adminName}>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Media Gallery
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage uploaded images ({total} total)
          </p>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-brand-gold bg-brand-gold/5'
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Upload className="w-8 h-8 mx-auto text-text-muted mb-3" />

          <p className="text-text-secondary text-sm mb-2">
            Drag and drop an image here, or
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy-dark font-medium text-sm rounded-lg hover:bg-brand-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Choose File
              </>
            )}
          </button>

          <p className="text-text-muted text-xs mt-3">
            JPEG, PNG, or WebP — max 5 MB
          </p>

          {uploadError && (
            <p className="text-red-400 text-sm mt-3">{uploadError}</p>
          )}
        </div>

        {/* Thumbnail grid */}
        <div className="rounded-lg border border-white/10 bg-brand-navy overflow-hidden">
          {loading ? (
            <div className="px-5 py-12 text-center text-text-muted">
              Loading media...
            </div>
          ) : items.length === 0 ? (
            <div className="px-5 py-12 text-center text-text-muted">
              No media uploaded yet. Upload your first image above.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-lg border border-white/10 bg-brand-navy-dark overflow-hidden hover:border-brand-gold/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="aspect-square relative bg-black/20">
                    <img
                      src={item.filePath}
                      alt={item.originalName}
                      className="w-full h-full object-cover"
                    />

                    {/* Delete button overlay */}
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deleting && deleteTarget?.id === item.id}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-2.5">
                    <p className="text-text-primary text-xs font-medium truncate" title={item.originalName}>
                      {item.originalName}
                    </p>
                    <p className="text-text-muted text-xs mt-0.5">
                      {formatFileSize(item.fileSize)} · {item.width}×{item.height}
                    </p>
                  </div>
                </div>
              ))}
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

      {/* Reference warning dialog */}
      {showReferenceWarning && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-brand-navy-dark border border-white/10 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Image In Use
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  &quot;{deleteTarget.originalName}&quot; is referenced by {deleteReferences.length}{' '}
                  content item{deleteReferences.length > 1 ? 's' : ''}:
                </p>
              </div>
            </div>

            {/* Reference list */}
            <div className="mb-5 max-h-40 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-3">
              <ul className="space-y-1.5">
                {deleteReferences.map((ref, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full shrink-0" />
                    <span>
                      Content: <span className="text-text-primary">{ref.contentId}</span>{' '}
                      (field: {ref.fieldName})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-text-muted mb-5">
              Force deleting will remove the image reference from all associated content items.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeWarningDialog}
                className="px-4 py-2 text-sm text-text-secondary border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleForceDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Force Delete
                  </>
                )}
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={closeWarningDialog}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
