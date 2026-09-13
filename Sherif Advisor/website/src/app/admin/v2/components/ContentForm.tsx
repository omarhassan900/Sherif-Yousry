'use client';

import { useState, useCallback } from 'react';
import BilingualEditor from './BilingualEditor';

export type ContentType = 'service' | 'article' | 'page_section';
export type ContentStatus = 'published' | 'unpublished';

export interface ContentFormData {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  status: ContentStatus;
  type: ContentType;
  metadata: Record<string, unknown>;
}

export interface ContentFormErrors {
  titleAr?: string;
  titleEn?: string;
  bodyAr?: string;
  bodyEn?: string;
}

export interface ContentFormProps {
  /** Initial form data (for editing existing content) */
  initialData?: Partial<ContentFormData>;
  /** Content type for this form */
  type: ContentType;
  /** Called when the form is submitted with valid data */
  onSubmit: (data: ContentFormData) => void | Promise<void>;
  /** Whether the form is in a submitting/loading state */
  isSubmitting?: boolean;
  /** Whether the form fields are disabled */
  disabled?: boolean;
  /** Additional content to render before the submit button (e.g., type-specific fields) */
  children?: React.ReactNode;
}

/**
 * Strips HTML tags from a string, returning only text content.
 */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

/**
 * Counts non-whitespace characters in a string.
 */
export function countNonWhitespace(value: string): number {
  return value.replace(/\s/g, '').length;
}

/**
 * Validates content form fields according to the bilingual content requirements.
 * - Titles: 2-200 non-whitespace characters
 * - Body: at least 1 non-whitespace character
 */
export function validateContentForm(data: ContentFormData): ContentFormErrors {
  const errors: ContentFormErrors = {};

  const titleArLen = countNonWhitespace(data.titleAr);
  if (titleArLen < 2) {
    errors.titleAr = 'Arabic title must contain at least 2 non-whitespace characters';
  } else if (titleArLen > 200) {
    errors.titleAr = 'Arabic title must not exceed 200 non-whitespace characters';
  }

  const titleEnLen = countNonWhitespace(data.titleEn);
  if (titleEnLen < 2) {
    errors.titleEn = 'English title must contain at least 2 non-whitespace characters';
  } else if (titleEnLen > 200) {
    errors.titleEn = 'English title must not exceed 200 non-whitespace characters';
  }

  const bodyArText = stripHtml(data.bodyAr);
  const bodyArLen = countNonWhitespace(bodyArText);
  if (bodyArLen < 1) {
    errors.bodyAr = 'Arabic body must contain at least 1 non-whitespace character';
  }

  const bodyEnText = stripHtml(data.bodyEn);
  const bodyEnLen = countNonWhitespace(bodyEnText);
  if (bodyEnLen < 1) {
    errors.bodyEn = 'English body must contain at least 1 non-whitespace character';
  }

  return errors;
}

/**
 * ContentForm — Base form component for bilingual content creation/editing.
 *
 * Provides bilingual title fields (AR/EN), bilingual body fields using BilingualEditor,
 * a publish status toggle, client-side validation, and inline error display.
 */
export default function ContentForm({
  initialData,
  type,
  onSubmit,
  isSubmitting = false,
  disabled = false,
  children,
}: ContentFormProps) {
  const [titleAr, setTitleAr] = useState(initialData?.titleAr ?? '');
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? '');
  const [bodyAr, setBodyAr] = useState(initialData?.bodyAr ?? '');
  const [bodyEn, setBodyEn] = useState(initialData?.bodyEn ?? '');
  const [status, setStatus] = useState<ContentStatus>(initialData?.status ?? 'unpublished');
  const [errors, setErrors] = useState<ContentFormErrors>({});

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const formData: ContentFormData = {
        titleAr,
        titleEn,
        bodyAr,
        bodyEn,
        status,
        type,
        metadata: initialData?.metadata ?? {},
      };

      const validationErrors = validateContentForm(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});
      await onSubmit(formData);
    },
    [titleAr, titleEn, bodyAr, bodyEn, status, type, initialData?.metadata, onSubmit]
  );

  const isDisabled = disabled || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Bilingual Title Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* English Title */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="titleEn"
            className="text-sm font-medium text-text-primary"
          >
            English Title
          </label>
          <input
            id="titleEn"
            type="text"
            value={titleEn}
            onChange={(e) => {
              setTitleEn(e.target.value);
              if (errors.titleEn) {
                setErrors((prev) => ({ ...prev, titleEn: undefined }));
              }
            }}
            disabled={isDisabled}
            placeholder="Enter English title..."
            className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${
              errors.titleEn ? 'border-red-500' : 'border-white/10'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            dir="ltr"
          />
          {errors.titleEn && (
            <p className="text-xs text-red-400 mt-0.5" role="alert">
              {errors.titleEn}
            </p>
          )}
        </div>

        {/* Arabic Title */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="titleAr"
            className="text-sm font-medium text-text-primary text-right"
          >
            العنوان بالعربية
          </label>
          <input
            id="titleAr"
            type="text"
            value={titleAr}
            onChange={(e) => {
              setTitleAr(e.target.value);
              if (errors.titleAr) {
                setErrors((prev) => ({ ...prev, titleAr: undefined }));
              }
            }}
            disabled={isDisabled}
            placeholder="أدخل العنوان بالعربية..."
            className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors text-right ${
              errors.titleAr ? 'border-red-500' : 'border-white/10'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            dir="rtl"
          />
          {errors.titleAr && (
            <p className="text-xs text-red-400 mt-0.5 text-right" role="alert">
              {errors.titleAr}
            </p>
          )}
        </div>
      </div>

      {/* Bilingual Body Fields */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-text-primary">Content Body</h3>
        <BilingualEditor
          contentEn={bodyEn}
          contentAr={bodyAr}
          onChangeEn={(html) => {
            setBodyEn(html);
            if (errors.bodyEn) {
              setErrors((prev) => ({ ...prev, bodyEn: undefined }));
            }
          }}
          onChangeAr={(html) => {
            setBodyAr(html);
            if (errors.bodyAr) {
              setErrors((prev) => ({ ...prev, bodyAr: undefined }));
            }
          }}
          placeholderEn="Enter English content..."
          placeholderAr="أدخل المحتوى بالعربية..."
          disabled={isDisabled}
        />
        {/* Body error messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            {errors.bodyEn && (
              <p className="text-xs text-red-400" role="alert">
                {errors.bodyEn}
              </p>
            )}
          </div>
          <div>
            {errors.bodyAr && (
              <p className="text-xs text-red-400 text-right" role="alert">
                {errors.bodyAr}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Type-specific fields injected by parent */}
      {children}

      {/* Status Toggle */}
      <div className="flex items-center gap-3">
        <label htmlFor="status-toggle" className="text-sm font-medium text-text-primary">
          Status
        </label>
        <button
          id="status-toggle"
          type="button"
          role="switch"
          aria-checked={status === 'published'}
          onClick={() => {
            if (!isDisabled) {
              setStatus((prev) => (prev === 'published' ? 'unpublished' : 'published'));
            }
          }}
          disabled={isDisabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:ring-offset-2 focus:ring-offset-brand-navy ${
            status === 'published' ? 'bg-green-600' : 'bg-white/20'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              status === 'published' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-sm text-text-muted">
          {status === 'published' ? 'Published' : 'Unpublished'}
        </span>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={isDisabled}
          className={`px-6 py-2 text-sm font-medium rounded transition-colors ${
            isDisabled
              ? 'bg-brand-gold/50 text-brand-navy/70 cursor-not-allowed'
              : 'bg-brand-gold text-brand-navy hover:bg-brand-gold/90'
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
