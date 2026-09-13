'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
}

interface ApiResponse {
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MediaPickerProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Called when the modal is closed without selecting */
  onClose: () => void;
  /** Called when an image is confirmed via the Select button */
  onSelect: (media: { id: string; filePath: string; originalName: string }) => void;
}

export default function MediaPicker({ isOpen, onClose, onSelect }: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?page=${page}`);
      if (res.ok) {
        const data: ApiResponse = await res.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, fetchMedia]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedItem(null);
      setPage(1);
    }
  }, [isOpen]);

  const handleConfirmSelect = () => {
    if (selectedItem) {
      onSelect({
        id: selectedItem.id,
        filePath: selectedItem.filePath,
        originalName: selectedItem.originalName,
      });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-brand-navy-dark border border-white/10 rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-gold" />
            <h3 className="text-lg font-semibold text-text-primary">
              Select Image
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
              <span className="ml-2 text-text-muted text-sm">Loading media...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-text-muted text-sm">
              No media uploaded yet. Upload images in the Media Gallery first.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/50 ${
                    selectedItem?.id === item.id
                      ? 'border-brand-gold ring-2 ring-brand-gold/30'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  title={item.originalName}
                >
                  <img
                    src={item.filePath}
                    alt={item.originalName}
                    className="w-full h-full object-cover"
                  />
                  {selectedItem?.id === item.id && (
                    <div className="absolute inset-0 bg-brand-gold/10" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer with pagination and action buttons */}
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          {/* Pagination */}
          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <p className="text-xs text-text-muted mr-2">
                Page {page} of {totalPages}
              </p>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-text-secondary border border-white/10 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-text-secondary border border-white/10 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-text-secondary border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelect}
              disabled={!selectedItem}
              className="px-4 py-2 text-sm font-medium bg-brand-gold text-brand-navy-dark rounded-lg hover:bg-brand-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
