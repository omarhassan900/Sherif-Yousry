'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, ExternalLink, RefreshCw } from 'lucide-react';

/**
 * Maps a CMS section (page + sectionKey) to the public URL that renders it,
 * plus the anchor to scroll to when the section lives on a longer page.
 */
function resolvePublicUrl(page?: string, sectionKey?: string): string {
  if (!page) return '/';

  switch (page) {
    case 'homepage':
      // Homepage sections are anchored on the landing page.
      if (sectionKey === 'hero') return '/';
      if (sectionKey === 'stats') return '/#stats';
      if (sectionKey === 'why-us') return '/#why-us';
      if (sectionKey === 'markets') return '/#markets';
      if (sectionKey === 'assessment') return '/#assessment';
      if (sectionKey === 'services') return '/#services';
      if (sectionKey === 'insights') return '/#insights';
      return '/';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    default:
      // Fallback: try /{page}
      return `/${page}`;
  }
}

export interface SectionLivePreviewProps {
  page?: string;
  sectionKey?: string;
  /** Increment to force the iframe to reload (e.g. after a save). */
  refreshSignal?: number;
}

/**
 * SectionLivePreview — Renders the actual public page inside an iframe so the
 * admin sees the section exactly as it appears on the live front-end (with the
 * real design), rather than a stylized approximation.
 *
 * Note: this reflects the last *saved* content. Save changes to update it.
 */
export default function SectionLivePreview({
  page,
  sectionKey,
  refreshSignal = 0,
}: SectionLivePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  // Bump this to force the iframe to reload after a save.
  const [reloadKey, setReloadKey] = useState(0);

  // Reload the iframe whenever the parent signals a save.
  useEffect(() => {
    if (refreshSignal > 0) setReloadKey((k) => k + 1);
  }, [refreshSignal]);

  const url = resolvePublicUrl(page, sectionKey);

  return (
    <div className="rounded-lg border border-brand-gold/20 bg-brand-navy-dark/50 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-brand-navy">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-brand-gold/10 border border-brand-gold/30 px-3 py-0.5 text-xs font-semibold text-brand-gold">
            Front-end Preview
          </span>
          <span className="text-xs text-text-muted hidden sm:inline">
            Live site view of this section
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Device toggle */}
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded transition-colors ${
              device === 'desktop'
                ? 'bg-brand-gold/15 text-brand-gold'
                : 'text-text-muted hover:text-text-primary'
            }`}
            title="Desktop view"
            aria-label="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded transition-colors ${
              device === 'mobile'
                ? 'bg-brand-gold/15 text-brand-gold'
                : 'text-text-muted hover:text-text-primary'
            }`}
            title="Mobile view"
            aria-label="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-white/10 mx-1" />

          {/* Reload */}
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="p-1.5 rounded text-text-muted hover:text-text-primary transition-colors"
            title="Reload preview"
            aria-label="Reload preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Open in new tab */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded text-text-muted hover:text-text-primary transition-colors"
            title="Open in new tab"
            aria-label="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Iframe stage */}
      <div className="bg-[#0b0f16] p-4 flex justify-center overflow-auto">
        <div
          className="bg-white transition-all duration-300 shadow-2xl"
          style={{
            width: device === 'mobile' ? 390 : '100%',
            maxWidth: device === 'mobile' ? 390 : 1200,
          }}
        >
          <iframe
            key={reloadKey}
            src={url}
            title="Front-end section preview"
            className="w-full border-0 bg-white"
            style={{ height: 600 }}
          />
        </div>
      </div>

      <p className="px-4 py-2 text-[11px] text-text-muted border-t border-white/10">
        This preview shows the last <span className="text-text-secondary">saved</span> content. Save your changes to see them reflected here.
      </p>
    </div>
  );
}
