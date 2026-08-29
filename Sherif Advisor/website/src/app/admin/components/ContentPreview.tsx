'use client';

export interface ContentPreviewProps {
  /** Arabic title */
  titleAr?: string;
  /** English title */
  titleEn?: string;
  /** Arabic subtitle */
  subtitleAr?: string;
  /** English subtitle */
  subtitleEn?: string;
  /** Arabic body (HTML) */
  bodyAr?: string;
  /** English body (HTML) */
  bodyEn?: string;
  /** Additional bilingual fields */
  fields?: Record<string, { ar: string; en: string }>;
}

/**
 * ContentPreview — Renders edited section content as it would appear on the public website.
 *
 * Displays both Arabic (RTL) and English (LTR) previews side-by-side,
 * matching the BilingualEditor layout (English left, Arabic right).
 * Uses a distinct background and border to visually separate the preview from edit fields.
 */
export default function ContentPreview({
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
  bodyAr,
  bodyEn,
  fields,
}: ContentPreviewProps) {
  return (
    <div className="rounded-lg border border-brand-gold/20 bg-brand-navy-dark/50 p-4">
      {/* Preview Header Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-brand-gold/10 border border-brand-gold/30 px-3 py-0.5 text-xs font-semibold text-brand-gold">
          Preview
        </span>
        <span className="text-xs text-text-muted">
          Content as it will appear on the public website
        </span>
      </div>

      {/* Side-by-side columns: English (left), Arabic (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* English Preview (LTR) */}
        <div className="rounded border border-white/10 bg-white/5 p-4" dir="ltr">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-text-muted font-medium">
            English
          </p>

          {titleEn && (
            <h2 className="text-lg font-bold text-text-primary mb-1">
              {titleEn}
            </h2>
          )}

          {subtitleEn && (
            <h3 className="text-sm font-medium text-text-muted mb-3">
              {subtitleEn}
            </h3>
          )}

          {bodyEn && (
            <div
              className="prose prose-sm prose-invert max-w-none text-text-primary [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold [&_h4]:text-sm [&_h4]:font-medium [&_p]:text-sm [&_p]:leading-relaxed [&_ul]:text-sm [&_ol]:text-sm [&_li]:text-sm [&_a]:text-brand-gold [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: bodyEn }}
            />
          )}

          {/* Additional fields */}
          {fields && Object.keys(fields).length > 0 && (
            <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
              {Object.entries(fields).map(([key, value]) => (
                <div key={key}>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">
                    {key}
                  </span>
                  <p className="text-sm text-text-primary">{value.en}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Arabic Preview (RTL) */}
        <div className="rounded border border-white/10 bg-white/5 p-4" dir="rtl">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-text-muted font-medium text-right">
            العربية
          </p>

          {titleAr && (
            <h2 className="text-lg font-bold text-text-primary mb-1 text-right">
              {titleAr}
            </h2>
          )}

          {subtitleAr && (
            <h3 className="text-sm font-medium text-text-muted mb-3 text-right">
              {subtitleAr}
            </h3>
          )}

          {bodyAr && (
            <div
              className="prose prose-sm prose-invert max-w-none text-text-primary text-right [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold [&_h4]:text-sm [&_h4]:font-medium [&_p]:text-sm [&_p]:leading-relaxed [&_ul]:text-sm [&_ol]:text-sm [&_li]:text-sm [&_a]:text-brand-gold [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: bodyAr }}
            />
          )}

          {/* Additional fields */}
          {fields && Object.keys(fields).length > 0 && (
            <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
              {Object.entries(fields).map(([key, value]) => (
                <div key={key}>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">
                    {key}
                  </span>
                  <p className="text-sm text-text-primary text-right">{value.ar}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
