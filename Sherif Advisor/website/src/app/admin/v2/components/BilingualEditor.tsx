'use client';

import RichTextEditor from './RichTextEditor';

export interface BilingualEditorProps {
  /** English HTML content */
  contentEn: string;
  /** Arabic HTML content */
  contentAr: string;
  /** Called when English content changes */
  onChangeEn: (html: string) => void;
  /** Called when Arabic content changes */
  onChangeAr: (html: string) => void;
  /** Placeholder for the English editor */
  placeholderEn?: string;
  /** Placeholder for the Arabic editor */
  placeholderAr?: string;
  /** Whether both editors are disabled */
  disabled?: boolean;
  /** Additional CSS class names for the outer wrapper */
  className?: string;
}

/**
 * BilingualEditor — Side-by-side editing panels for English (LTR) and Arabic (RTL) content.
 *
 * English panel is positioned on the left, Arabic panel on the right.
 * Each panel uses the RichTextEditor with the appropriate text direction.
 */
export default function BilingualEditor({
  contentEn,
  contentAr,
  onChangeEn,
  onChangeAr,
  placeholderEn = 'Enter English content...',
  placeholderAr = 'أدخل المحتوى بالعربية...',
  disabled = false,
  className = '',
}: BilingualEditorProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
      {/* English Panel (Left) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary">
          English
        </label>
        <RichTextEditor
          content={contentEn}
          onChange={onChangeEn}
          direction="ltr"
          placeholder={placeholderEn}
          disabled={disabled}
        />
      </div>

      {/* Arabic Panel (Right) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary text-right">
          العربية
        </label>
        <RichTextEditor
          content={contentAr}
          onChange={onChangeAr}
          direction="rtl"
          placeholder={placeholderAr}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
