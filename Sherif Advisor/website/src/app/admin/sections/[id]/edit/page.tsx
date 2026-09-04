'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AdminShell from '../../../components/AdminShell';
import BilingualEditor from '../../../components/BilingualEditor';
import ContentPreview from '../../../components/ContentPreview';
import SectionLivePreview from '../../../components/SectionLivePreview';
import RevisionHistory from '../../../components/RevisionHistory';

interface SectionData {
  id: string;
  type: 'page_section';
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  status: string;
  metadata: {
    page: string;
    sectionKey: string;
    fields: Record<string, { ar: string; en: string }>;
  };
}

interface FormErrors {
  titleAr?: string;
  titleEn?: string;
  bodyAr?: string;
  bodyEn?: string;
  fields?: Record<string, { ar?: string; en?: string }>;
  general?: string;
}

const MAX_FIELD_LENGTH = 2000;
const MIN_FIELD_LENGTH = 1;

function validateTextField(value: string, fieldLabel: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length < MIN_FIELD_LENGTH) {
    return `${fieldLabel} is required (min ${MIN_FIELD_LENGTH} character)`;
  }
  if (trimmed.length > MAX_FIELD_LENGTH) {
    return `${fieldLabel} must not exceed ${MAX_FIELD_LENGTH} characters`;
  }
  return undefined;
}

export default function EditSectionPage() {
  const params = useParams();
  const sectionId = params.id as string;

  const [adminName, setAdminName] = useState('Admin');
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [savedTick, setSavedTick] = useState(0);
  const [showSaved, setShowSaved] = useState(false);

  // Section data
  const [sectionData, setSectionData] = useState<SectionData | null>(null);

  // Form fields
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [dynamicFields, setDynamicFields] = useState<Record<string, { ar: string; en: string }>>({});

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

  // Fetch existing section data
  useEffect(() => {
    async function fetchSection() {
      try {
        const res = await fetch(`/api/admin/content/${sectionId}`);

        if (res.status === 404) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        if (!res.ok) {
          setErrors({ general: 'Failed to load section data.' });
          setIsLoading(false);
          return;
        }

        const data: SectionData = await res.json();
        setSectionData(data);

        // Pre-fill form fields
        setTitleAr(data.titleAr || '');
        setTitleEn(data.titleEn || '');
        setBodyAr(data.bodyAr || '');
        setBodyEn(data.bodyEn || '');

        // Pre-fill dynamic metadata fields
        if (data.metadata?.fields) {
          setDynamicFields({ ...data.metadata.fields });
        }
      } catch {
        setErrors({ general: 'Network error. Failed to load section data.' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSection();
  }, [sectionId]);

  function validate(): FormErrors {
    const errs: FormErrors = {};

    const titleArErr = validateTextField(titleAr, 'Arabic title');
    if (titleArErr) errs.titleAr = titleArErr;

    const titleEnErr = validateTextField(titleEn, 'English title');
    if (titleEnErr) errs.titleEn = titleEnErr;

    const bodyArErr = validateTextField(bodyAr, 'Arabic body');
    if (bodyArErr) errs.bodyAr = bodyArErr;

    const bodyEnErr = validateTextField(bodyEn, 'English body');
    if (bodyEnErr) errs.bodyEn = bodyEnErr;

    // Validate dynamic fields
    const fieldErrors: Record<string, { ar?: string; en?: string }> = {};
    for (const [key, value] of Object.entries(dynamicFields)) {
      const arErr = validateTextField(value.ar, `${key} (Arabic)`);
      const enErr = validateTextField(value.en, `${key} (English)`);
      if (arErr || enErr) {
        fieldErrors[key] = {};
        if (arErr) fieldErrors[key].ar = arErr;
        if (enErr) fieldErrors[key].en = enErr;
      }
    }
    if (Object.keys(fieldErrors).length > 0) {
      errs.fields = fieldErrors;
    }

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/content/${sectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr,
          titleEn,
          bodyAr,
          bodyEn,
          metadata: {
            page: sectionData?.metadata?.page || '',
            sectionKey: sectionData?.metadata?.sectionKey || '',
            fields: dynamicFields,
          },
        }),
      });

      if (res.ok) {
        // Stay on the page and refresh the front-end preview so the admin
        // can immediately see the saved result in the real design.
        setSavedTick((t) => t + 1);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
      } else {
        const data = await res.json().catch(() => null);
        setErrors({
          general: data?.error || 'Failed to save changes. Please try again.',
        });
      }
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateDynamicField(key: string, lang: 'ar' | 'en', value: string) {
    setDynamicFields((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value,
      },
    }));
    // Clear field-specific error on change
    if (errors.fields?.[key]) {
      setErrors((prev) => {
        const updatedFields = { ...prev.fields };
        if (updatedFields[key]) {
          delete updatedFields[key][lang];
          if (!updatedFields[key].ar && !updatedFields[key].en) {
            delete updatedFields[key];
          }
        }
        return {
          ...prev,
          fields: Object.keys(updatedFields).length > 0 ? updatedFields : undefined,
        };
      });
    }
  }

  // Format section key for display
  function formatSectionLabel(page?: string, sectionKey?: string): string {
    if (!page || !sectionKey) return 'Section';
    const pageName = page.charAt(0).toUpperCase() + page.slice(1);
    const keyName = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
    return `${pageName} — ${keyName}`;
  }

  // Loading state
  if (isLoading) {
    return (
      <AdminShell adminName={adminName}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
            <p className="text-sm text-text-muted">Loading section...</p>
          </div>
        </div>
      </AdminShell>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <AdminShell adminName={adminName}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Link
            href="/admin/sections"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sections
          </Link>

          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <h1 className="text-xl font-semibold text-text-primary">Section Not Found</h1>
            <p className="text-sm text-text-muted">
              The section you are looking for does not exist or has been deleted.
            </p>
            <Link
              href="/admin/sections"
              className="px-4 py-2 text-sm font-medium rounded bg-brand-gold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              Return to Sections
            </Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell adminName={adminName}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back link + heading */}
        <div className="space-y-4">
          <Link
            href="/admin/sections"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sections
          </Link>

          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Edit Section
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {formatSectionLabel(sectionData?.metadata?.page, sectionData?.metadata?.sectionKey)}
            </p>
          </div>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-sm text-red-300" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Title — Side-by-side AR/EN */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Title
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* English Title */}
              <div className="flex flex-col gap-1">
                <label htmlFor="titleEn" className="text-sm font-medium text-text-primary">
                  Title (English)
                </label>
                <input
                  id="titleEn"
                  type="text"
                  maxLength={MAX_FIELD_LENGTH}
                  value={titleEn}
                  onChange={(e) => {
                    setTitleEn(e.target.value);
                    if (errors.titleEn) setErrors((prev) => ({ ...prev, titleEn: undefined }));
                  }}
                  disabled={isSubmitting}
                  placeholder="Enter section title in English..."
                  dir="ltr"
                  className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${
                    errors.titleEn ? 'border-red-500' : 'border-white/10'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <div className="flex justify-between">
                  {errors.titleEn ? (
                    <p className="text-xs text-red-400" role="alert">{errors.titleEn}</p>
                  ) : <span />}
                  <span className="text-xs text-text-muted">{titleEn.length}/{MAX_FIELD_LENGTH}</span>
                </div>
              </div>

              {/* Arabic Title */}
              <div className="flex flex-col gap-1">
                <label htmlFor="titleAr" className="text-sm font-medium text-text-primary text-right">
                  العنوان (عربي)
                </label>
                <input
                  id="titleAr"
                  type="text"
                  maxLength={MAX_FIELD_LENGTH}
                  value={titleAr}
                  onChange={(e) => {
                    setTitleAr(e.target.value);
                    if (errors.titleAr) setErrors((prev) => ({ ...prev, titleAr: undefined }));
                  }}
                  disabled={isSubmitting}
                  placeholder="أدخل عنوان القسم بالعربية..."
                  dir="rtl"
                  className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors text-right ${
                    errors.titleAr ? 'border-red-500' : 'border-white/10'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <div className="flex justify-between">
                  {errors.titleAr ? (
                    <p className="text-xs text-red-400" role="alert">{errors.titleAr}</p>
                  ) : <span />}
                  <span className="text-xs text-text-muted">{titleAr.length}/{MAX_FIELD_LENGTH}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Body — Bilingual Rich Text Editor */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Body
            </h2>
            {errors.bodyEn && (
              <p className="text-xs text-red-400" role="alert">{errors.bodyEn}</p>
            )}
            {errors.bodyAr && (
              <p className="text-xs text-red-400" role="alert">{errors.bodyAr}</p>
            )}
            <BilingualEditor
              contentEn={bodyEn}
              contentAr={bodyAr}
              onChangeEn={(html) => {
                setBodyEn(html);
                if (errors.bodyEn) setErrors((prev) => ({ ...prev, bodyEn: undefined }));
              }}
              onChangeAr={(html) => {
                setBodyAr(html);
                if (errors.bodyAr) setErrors((prev) => ({ ...prev, bodyAr: undefined }));
              }}
              placeholderEn="Enter section body in English..."
              placeholderAr="أدخل محتوى القسم بالعربية..."
              disabled={isSubmitting}
            />
          </section>

          {/* Dynamic metadata fields */}
          {Object.keys(dynamicFields).length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Additional Fields
              </h2>

              {Object.entries(dynamicFields).map(([fieldKey, fieldValue]) => (
                <div key={fieldKey} className="space-y-2">
                  <h3 className="text-sm font-medium text-text-primary capitalize">
                    {fieldKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* English */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor={`field-${fieldKey}-en`}
                        className="text-xs text-text-muted"
                      >
                        English
                      </label>
                      <textarea
                        id={`field-${fieldKey}-en`}
                        maxLength={MAX_FIELD_LENGTH}
                        rows={3}
                        value={fieldValue.en}
                        onChange={(e) => updateDynamicField(fieldKey, 'en', e.target.value)}
                        disabled={isSubmitting}
                        placeholder={`Enter ${fieldKey} in English...`}
                        dir="ltr"
                        className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors resize-none ${
                          errors.fields?.[fieldKey]?.en ? 'border-red-500' : 'border-white/10'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <div className="flex justify-between">
                        {errors.fields?.[fieldKey]?.en ? (
                          <p className="text-xs text-red-400" role="alert">
                            {errors.fields[fieldKey].en}
                          </p>
                        ) : <span />}
                        <span className="text-xs text-text-muted">
                          {fieldValue.en.length}/{MAX_FIELD_LENGTH}
                        </span>
                      </div>
                    </div>

                    {/* Arabic */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor={`field-${fieldKey}-ar`}
                        className="text-xs text-text-muted text-right"
                      >
                        العربية
                      </label>
                      <textarea
                        id={`field-${fieldKey}-ar`}
                        maxLength={MAX_FIELD_LENGTH}
                        rows={3}
                        value={fieldValue.ar}
                        onChange={(e) => updateDynamicField(fieldKey, 'ar', e.target.value)}
                        disabled={isSubmitting}
                        placeholder={`أدخل ${fieldKey} بالعربية...`}
                        dir="rtl"
                        className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors text-right resize-none ${
                          errors.fields?.[fieldKey]?.ar ? 'border-red-500' : 'border-white/10'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <div className="flex justify-between">
                        {errors.fields?.[fieldKey]?.ar ? (
                          <p className="text-xs text-red-400" role="alert">
                            {errors.fields[fieldKey].ar}
                          </p>
                        ) : <span />}
                        <span className="text-xs text-text-muted">
                          {fieldValue.ar.length}/{MAX_FIELD_LENGTH}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Draft Preview (unsaved content, side-by-side AR/EN) */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Draft Preview
            </h2>
            <ContentPreview
              titleAr={titleAr}
              titleEn={titleEn}
              bodyAr={bodyAr}
              bodyEn={bodyEn}
              fields={dynamicFields}
            />
          </section>

          {/* Front-end Preview (real site design, last saved content) */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Front-end Preview
            </h2>
            <SectionLivePreview
              page={sectionData?.metadata?.page}
              sectionKey={sectionData?.metadata?.sectionKey}
              refreshSignal={savedTick}
            />
          </section>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            {showSaved && (
              <span className="text-sm text-green-400" role="status">
                Saved — preview updated below.
              </span>
            )}
            <Link
              href="/admin/sections"
              className="px-4 py-2 text-sm font-medium rounded border border-white/10 text-text-secondary hover:bg-white/5 transition-colors"
            >
              Done
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-sm font-medium rounded transition-colors ${
                isSubmitting
                  ? 'bg-brand-gold/50 text-brand-navy/70 cursor-not-allowed'
                  : 'bg-brand-gold text-brand-navy hover:bg-brand-gold/90'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Revision History */}
        <RevisionHistory contentId={sectionId} />
      </div>
    </AdminShell>
  );
}
