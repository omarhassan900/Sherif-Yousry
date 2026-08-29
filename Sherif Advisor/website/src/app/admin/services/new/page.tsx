'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Scale,
  ShieldCheck,
  FileText,
  TrendingUp,
  Users,
  Globe,
  Award,
  Calculator,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AdminShell from '../../components/AdminShell';

interface IconOption {
  name: string;
  icon: LucideIcon;
}

const ICON_OPTIONS: IconOption[] = [
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Building2', icon: Building2 },
  { name: 'Scale', icon: Scale },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'FileText', icon: FileText },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Users', icon: Users },
  { name: 'Globe', icon: Globe },
  { name: 'Award', icon: Award },
  { name: 'Calculator', icon: Calculator },
];

interface FormErrors {
  titleAr?: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  icon?: string;
  displayOrder?: string;
  general?: string;
}

export default function NewServicePage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('Admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form fields
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [published, setPublished] = useState(false);

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

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!titleAr.trim()) {
      errs.titleAr = 'Arabic title is required';
    } else if (titleAr.length > 100) {
      errs.titleAr = 'Arabic title must not exceed 100 characters';
    }

    if (!titleEn.trim()) {
      errs.titleEn = 'English title is required';
    } else if (titleEn.length > 100) {
      errs.titleEn = 'English title must not exceed 100 characters';
    }

    if (!descriptionAr.trim()) {
      errs.descriptionAr = 'Arabic description is required';
    } else if (descriptionAr.length > 500) {
      errs.descriptionAr = 'Arabic description must not exceed 500 characters';
    }

    if (!descriptionEn.trim()) {
      errs.descriptionEn = 'English description is required';
    } else if (descriptionEn.length > 500) {
      errs.descriptionEn = 'English description must not exceed 500 characters';
    }

    if (!selectedIcon) {
      errs.icon = 'Please select an icon';
    }

    const orderNum = Number(displayOrder);
    if (!displayOrder.trim()) {
      errs.displayOrder = 'Display order is required';
    } else if (!Number.isInteger(orderNum) || orderNum < 1) {
      errs.displayOrder = 'Display order must be a positive integer';
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
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'service',
          titleAr,
          titleEn,
          bodyAr: descriptionAr,
          bodyEn: descriptionEn,
          status: published ? 'published' : 'unpublished',
          metadata: {
            icon: selectedIcon,
            displayOrder: Number(displayOrder),
            descriptionAr,
            descriptionEn,
          },
        }),
      });

      if (res.ok) {
        router.push('/admin/services');
      } else {
        const data = await res.json().catch(() => null);
        setErrors({
          general: data?.error || 'Failed to create service. Please try again.',
        });
      }
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell adminName={adminName}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back link + heading */}
        <div className="space-y-4">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <h1 className="text-2xl font-semibold text-text-primary">
            Create New Service
          </h1>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-sm text-red-300" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Titles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* English Title */}
            <div className="flex flex-col gap-1">
              <label htmlFor="titleEn" className="text-sm font-medium text-text-primary">
                Title (English)
              </label>
              <input
                id="titleEn"
                type="text"
                maxLength={100}
                value={titleEn}
                onChange={(e) => {
                  setTitleEn(e.target.value);
                  if (errors.titleEn) setErrors((prev) => ({ ...prev, titleEn: undefined }));
                }}
                disabled={isSubmitting}
                placeholder="Enter service title in English..."
                dir="ltr"
                className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${
                  errors.titleEn ? 'border-red-500' : 'border-white/10'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="flex justify-between">
                {errors.titleEn ? (
                  <p className="text-xs text-red-400" role="alert">{errors.titleEn}</p>
                ) : <span />}
                <span className="text-xs text-text-muted">{titleEn.length}/100</span>
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
                maxLength={100}
                value={titleAr}
                onChange={(e) => {
                  setTitleAr(e.target.value);
                  if (errors.titleAr) setErrors((prev) => ({ ...prev, titleAr: undefined }));
                }}
                disabled={isSubmitting}
                placeholder="أدخل عنوان الخدمة بالعربية..."
                dir="rtl"
                className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors text-right ${
                  errors.titleAr ? 'border-red-500' : 'border-white/10'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="flex justify-between">
                {errors.titleAr ? (
                  <p className="text-xs text-red-400" role="alert">{errors.titleAr}</p>
                ) : <span />}
                <span className="text-xs text-text-muted">{titleAr.length}/100</span>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* English Description */}
            <div className="flex flex-col gap-1">
              <label htmlFor="descriptionEn" className="text-sm font-medium text-text-primary">
                Description (English)
              </label>
              <textarea
                id="descriptionEn"
                maxLength={500}
                rows={4}
                value={descriptionEn}
                onChange={(e) => {
                  setDescriptionEn(e.target.value);
                  if (errors.descriptionEn) setErrors((prev) => ({ ...prev, descriptionEn: undefined }));
                }}
                disabled={isSubmitting}
                placeholder="Enter service description in English..."
                dir="ltr"
                className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors resize-none ${
                  errors.descriptionEn ? 'border-red-500' : 'border-white/10'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="flex justify-between">
                {errors.descriptionEn ? (
                  <p className="text-xs text-red-400" role="alert">{errors.descriptionEn}</p>
                ) : <span />}
                <span className="text-xs text-text-muted">{descriptionEn.length}/500</span>
              </div>
            </div>

            {/* Arabic Description */}
            <div className="flex flex-col gap-1">
              <label htmlFor="descriptionAr" className="text-sm font-medium text-text-primary text-right">
                الوصف (عربي)
              </label>
              <textarea
                id="descriptionAr"
                maxLength={500}
                rows={4}
                value={descriptionAr}
                onChange={(e) => {
                  setDescriptionAr(e.target.value);
                  if (errors.descriptionAr) setErrors((prev) => ({ ...prev, descriptionAr: undefined }));
                }}
                disabled={isSubmitting}
                placeholder="أدخل وصف الخدمة بالعربية..."
                dir="rtl"
                className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors text-right resize-none ${
                  errors.descriptionAr ? 'border-red-500' : 'border-white/10'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="flex justify-between">
                {errors.descriptionAr ? (
                  <p className="text-xs text-red-400" role="alert">{errors.descriptionAr}</p>
                ) : <span />}
                <span className="text-xs text-text-muted">{descriptionAr.length}/500</span>
              </div>
            </div>
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Icon
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {ICON_OPTIONS.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setSelectedIcon(name);
                    if (errors.icon) setErrors((prev) => ({ ...prev, icon: undefined }));
                  }}
                  disabled={isSubmitting}
                  title={name}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                    selectedIcon === name
                      ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                      : 'border-white/10 text-text-muted hover:border-white/30 hover:text-text-primary'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
            {errors.icon && (
              <p className="text-xs text-red-400" role="alert">{errors.icon}</p>
            )}
            {selectedIcon && (
              <p className="text-xs text-text-muted">
                Selected: <span className="text-text-secondary">{selectedIcon}</span>
              </p>
            )}
          </div>

          {/* Display Order + Published Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display Order */}
            <div className="flex flex-col gap-1">
              <label htmlFor="displayOrder" className="text-sm font-medium text-text-primary">
                Display Order
              </label>
              <input
                id="displayOrder"
                type="number"
                min={1}
                step={1}
                value={displayOrder}
                onChange={(e) => {
                  setDisplayOrder(e.target.value);
                  if (errors.displayOrder) setErrors((prev) => ({ ...prev, displayOrder: undefined }));
                }}
                disabled={isSubmitting}
                placeholder="1"
                className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${
                  errors.displayOrder ? 'border-red-500' : 'border-white/10'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.displayOrder && (
                <p className="text-xs text-red-400" role="alert">{errors.displayOrder}</p>
              )}
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
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
