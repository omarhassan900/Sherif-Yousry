'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AdminShell from '../../../components/AdminShell';
import BilingualEditor from '../../../components/BilingualEditor';
import RevisionHistory from '../../../components/RevisionHistory';

const CATEGORY_OPTIONS = [
  'Advisory',
  'Market Updates',
  'Regulatory',
  'Industry Insights',
  'General',
] as const;

interface FormErrors {
  titleAr?: string;
  titleEn?: string;
  bodyAr?: string;
  bodyEn?: string;
  category?: string;
  general?: string;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [adminName, setAdminName] = useState('Admin');
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form fields
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [category, setCategory] = useState('');
  const [featuredImageId, setFeaturedImageId] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [published, setPublished] = useState(false);

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

  // Fetch existing article data
  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/admin/content/${articleId}`);

        if (res.status === 404) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        if (!res.ok) {
          setErrors({ general: 'Failed to load article data.' });
          setIsLoading(false);
          return;
        }

        const data = await res.json();

        setTitleAr(data.titleAr || '');
        setTitleEn(data.titleEn || '');
        setBodyAr(data.bodyAr || '');
        setBodyEn(data.bodyEn || '');
        setCategory(data.metadata?.category || '');
        setFeaturedImageId(data.metadata?.featuredImageId || '');
        setPublished(data.status === 'published');

        // Format publishDate as YYYY-MM-DD for date input
        if (data.metadata?.publishDate) {
          const date = new Date(data.metadata.publishDate);
          if (!isNaN(date.getTime())) {
            setPublishDate(date.toISOString().split('T')[0]);
          }
        }
      } catch {
        setErrors({ general: 'Network error. Failed to load article data.' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticle();
  }, [articleId]);

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!titleAr.trim()) {
      errs.titleAr = 'Arabic title is required';
    } else if (titleAr.length > 200) {
      errs.titleAr = 'Arabic title must not exceed 200 characters';
    }

    if (!titleEn.trim()) {
      errs.titleEn = 'English title is required';
    } else if (titleEn.length > 200) {
      errs.titleEn = 'English title must not exceed 200 characters';
    }

    // Strip HTML and check body content
    const bodyArText = bodyAr.replace(/<[^>]*>/g, '').trim();
    if (!bodyArText) {
      errs.bodyAr = 'Arabic body content is required';
    }

    const bodyEnText = bodyEn.replace(/<[^>]*>/g, '').trim();
    if (!bodyEnText) {
      errs.bodyEn = 'English body content is required';
    }

    if (!category) {
      errs.category = 'Please select a category';
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
      const res = await fetch(`/api/admin/content/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr,
          titleEn,
          bodyAr,
          bodyEn,
          status: published ? 'published' : 'unpublished',
          metadata: {
            category,
            featuredImageId: featuredImageId.trim() || null,
            publishDate: publishDate
              ? new Date(publishDate).toISOString()
              : null,
          },
        }),
      });

      if (res.ok) {
        router.push('/admin/articles');
      } else {
        const data = await res.json().catch(() => null);
        setErrors({
          general:
            data?.error || 'Failed to save changes. Please try again.',
        });
      }
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <AdminShell adminName={adminName}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
            <p className="text-sm text-text-muted">Loading article...</p>
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
            href="/admin/articles"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <h1 className="text-xl font-semibold text-text-primary">
              Article Not Found
            </h1>
            <p className="text-sm text-text-muted">
              The article you are looking for does not exist or has been deleted.
            </p>
            <Link
              href="/admin/articles"
              className="px-4 py-2 text-sm font-medium rounded bg-brand-gold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              Return to Articles
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
            href="/admin/articles"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          <h1 className="text-2xl font-semibold text-text-primary">
            Edit Article
          </h1>
        </div>

        {/* General error */}
        {errors.general && (
          <div
            className="p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-sm text-red-300"
            role="alert"
          >
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Titles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* English Title */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="titleEn"
                className="text-sm font-medium text-text-primary"
              >
                Title (English)
              </label>
              <input
                id="titleEn"
                type="text"
                maxLength={200}
                value={titleEn}
                onChange={(e) => {
                  setTitleEn(e.target.value);
                  if (errors.titleEn)
                    setErrors((prev) => ({ ...prev, titleEn: undefined }));
                }}
                disabled={isSubmitting}
                placeholder="Enter article title in English..."
                dir="ltr"
                className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${
                  errors.titleEn ? 'border-red-500' : 'border-white/10'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="flex justify-between">
                {errors.titleEn ? (
                  <p className="text-xs text-red-400" role="alert">
                    {errors.titleEn}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-text-muted">
                  {titleEn.length}/200
                </span>
              </div>
            </div>

            {/* Arabic Title */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="titleAr"
                className="text-sm font-medium text-text-primary text-right"
              >
                العنوان (عربي)
              </label>
              <input
                id="titleAr"
                type="text"
                maxLength={200}
                value={titleAr}
                onChange={(e) => {
                  setTitleAr(e.target.value);
                  if (errors.titleAr)
                    setErrors((prev) => ({ ...prev, titleAr: undefined }));
                }}
                disabled={isSubmitting}
                placeholder="أدخل عنوان المقال بالعربية..."
                dir="rtl"
                className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors text-right ${
                  errors.titleAr ? 'border-red-500' : 'border-white/10'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="flex justify-between">
                {errors.titleAr ? (
                  <p className="text-xs text-red-400" role="alert">
                    {errors.titleAr}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-text-muted">
                  {titleAr.length}/200
                </span>
              </div>
            </div>
          </div>

          {/* Body — Bilingual Rich Text Editor */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary">
              Article Body
            </h3>
            <BilingualEditor
              contentEn={bodyEn}
              contentAr={bodyAr}
              onChangeEn={(html) => {
                setBodyEn(html);
                if (errors.bodyEn)
                  setErrors((prev) => ({ ...prev, bodyEn: undefined }));
              }}
              onChangeAr={(html) => {
                setBodyAr(html);
                if (errors.bodyAr)
                  setErrors((prev) => ({ ...prev, bodyAr: undefined }));
              }}
              placeholderEn="Write article content in English..."
              placeholderAr="اكتب محتوى المقال بالعربية..."
              disabled={isSubmitting}
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

          {/* Category + Publish Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="category"
                className="text-sm font-medium text-text-primary"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category)
                    setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                disabled={isSubmitting}
                className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary focus:outline-none focus:border-brand-gold/40 transition-colors ${
                  errors.category ? 'border-red-500' : 'border-white/10'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="" disabled>
                  Select a category...
                </option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-400" role="alert">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Publish Date */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="publishDate"
                className="text-sm font-medium text-text-primary"
              >
                Publish Date
              </label>
              <input
                id="publishDate"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                disabled={isSubmitting}
                className={`px-3 py-2 bg-brand-navy-dark border border-white/10 rounded text-text-primary focus:outline-none focus:border-brand-gold/40 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <p className="text-xs text-text-muted">
                Leave empty to use current date on publish
              </p>
            </div>
          </div>

          {/* Featured Image + Published Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Featured Image (text input placeholder) */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="featuredImage"
                className="text-sm font-medium text-text-primary"
              >
                Featured Image{' '}
                <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <input
                id="featuredImage"
                type="text"
                value={featuredImageId}
                onChange={(e) => setFeaturedImageId(e.target.value)}
                disabled={isSubmitting}
                placeholder="Image URL or ID..."
                className={`px-3 py-2 bg-brand-navy-dark border border-white/10 rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <p className="text-xs text-text-muted">
                Media picker coming soon
              </p>
            </div>

            {/* Published Status Toggle */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-primary">
                Status
              </label>
              <div className="flex items-center gap-3 h-[42px]">
                <button
                  type="button"
                  role="switch"
                  aria-checked={published}
                  onClick={() => {
                    if (!isSubmitting) setPublished((prev) => !prev);
                  }}
                  disabled={isSubmitting}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:ring-offset-2 focus:ring-offset-brand-navy-dark ${
                    published ? 'bg-green-600' : 'bg-white/20'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      published ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-text-muted">
                  {published ? 'Published' : 'Unpublished'}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-white/10">
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
        <RevisionHistory contentId={articleId} />
      </div>
    </AdminShell>
  );
}
