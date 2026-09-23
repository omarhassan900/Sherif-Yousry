'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
<<<<<<< HEAD
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
  Loader2, 
=======
  ArrowLeft, Briefcase, Building2, Scale, ShieldCheck, FileText,
  TrendingUp, Users, Globe, Award, Calculator, BarChart2, Loader2, ImagePlus, X,
>>>>>>> a1aeb90 (UI & portal)
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AdminShell from '../../../components/AdminShell';
import RevisionHistory from '../../../components/RevisionHistory';
import MediaPicker from '../../../components/MediaPicker';
<<<<<<< HEAD
import BilingualEditor from '../../../components/BilingualEditor'; // ✅ Added import
=======
import BilingualEditor from '../../../components/BilingualEditor';
>>>>>>> a1aeb90 (UI & portal)

// ── Constants ─────────────────────────────────────────────────────────────────

const ICON_OPTIONS: { name: string; icon: LucideIcon }[] = [
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
  { name: 'BarChart2', icon: BarChart2 },
];

const CATEGORY_OPTIONS = [
  { slug: 'tax-advisory',               labelEn: 'Tax Advisory' },
  { slug: 'audit-accounting-assurance', labelEn: 'Audit, Accounting & Assurance' },
  { slug: 'financial-advisory',         labelEn: 'Financial Advisory' },
  { slug: 'business-management-advisory', labelEn: 'Business, Economic & Management Advisory' },
  { slug: 'corporate-legal-services',   labelEn: 'Corporate & Legal Services' },
  { slug: 'payroll-social-insurance',   labelEn: 'Payroll & Social Insurance' },
  { slug: 'ecommerce-digital-business', labelEn: 'E-Commerce & Digital Business' },
];

interface FormErrors {
  titleAr?: string; titleEn?: string;
  descriptionAr?: string; descriptionEn?: string;
  categorySlug?: string; displayOrder?: string; general?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EditServicePage() {
  const router  = useRouter();
  const params  = useParams();
  const serviceId = params.id as string;

  const [adminName, setAdminName]       = useState('Admin');
  const [isLoading, setIsLoading]       = useState(true);
  const [notFound, setNotFound]         = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors]             = useState<FormErrors>({});
  const [showSaved, setShowSaved]       = useState(false);

  const [serviceType, setServiceType]   = useState<'category' | 'sub-service'>('sub-service');
  const [categorySlug, setCategorySlug] = useState('');
  const [titleEn, setTitleEn]           = useState('');
  const [titleAr, setTitleAr]           = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [fullDescriptionEn, setFullDescriptionEn] = useState('');
  const [fullDescriptionAr, setFullDescriptionAr] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [published, setPublished]       = useState(false);
  const [image, setImage]               = useState<{ id: string; filePath: string } | null>(null);
  const [pickerOpen, setPickerOpen]     = useState(false);

  useEffect(() => {
    fetch('/api/admin/content/stats').then(r => r.json())
      .then(d => { if (d.adminName) setAdminName(d.adminName); }).catch(() => {});
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/content/${serviceId}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) { setErrors({ general: 'Failed to load service.' }); return; }
        const data = await res.json();
        setTitleEn(data.titleEn || '');
        setTitleAr(data.titleAr || '');
        setPublished(data.status === 'published');
        const m = data.metadata || {};
        setServiceType(m.serviceType === 'category' ? 'category' : 'sub-service');
        setCategorySlug(m.categorySlug || '');
        setSelectedIcon(m.icon || '');
        setDisplayOrder(String(m.displayOrder || ''));
        setDescriptionEn(m.shortDescriptionEn || m.descriptionEn || data.bodyEn || '');
        setDescriptionAr(m.shortDescriptionAr || m.descriptionAr || data.bodyAr || '');
        setFullDescriptionEn(m.fullDescriptionEn || data.bodyEn || '');
        setFullDescriptionAr(m.fullDescriptionAr || data.bodyAr || '');
        if (m.image) setImage({ id: m.imageId || '', filePath: m.image });
      } catch {
        setErrors({ general: 'Network error loading service.' });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [serviceId]);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!titleEn.trim()) errs.titleEn = 'English title is required';
    if (!titleAr.trim()) errs.titleAr = 'Arabic title is required';
    if (!descriptionEn.trim()) errs.descriptionEn = 'English description is required';
    if (!descriptionAr.trim()) errs.descriptionAr = 'Arabic description is required';
    if (serviceType === 'sub-service' && !categorySlug) errs.categorySlug = 'Please select a category';
    if (!displayOrder.trim() || isNaN(Number(displayOrder)) || Number(displayOrder) < 1)
      errs.displayOrder = 'Display order must be a positive number';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/content/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr, titleEn,
          bodyAr: descriptionAr,
          bodyEn: descriptionEn,
          status: published ? 'published' : 'unpublished',
          metadata: {
            serviceType,
            categorySlug,
            displayOrder: Number(displayOrder),
            icon: selectedIcon || null,
            shortDescriptionEn: descriptionEn,
            shortDescriptionAr: descriptionAr,
            fullDescriptionEn: fullDescriptionEn.trim() || descriptionEn,
            fullDescriptionAr: fullDescriptionAr.trim() || descriptionAr,
            image: image?.filePath ?? null,
            imageId: image?.id ?? null,
          },
        }),
      });
      if (res.ok) {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
      } else {
        const data = await res.json().catch(() => null);
        setErrors({ general: data?.error || 'Failed to save changes.' });
      }
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputCls = (err?: string) =>
    `px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${err ? 'border-red-500' : 'border-white/10'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (isLoading) return (
    <AdminShell adminName={adminName}>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
          <p className="text-sm text-text-muted">Loading service...</p>
        </div>
      </div>
    </AdminShell>
  );

  if (notFound) return (
    <AdminShell adminName={adminName}>
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <h1 className="text-xl font-semibold text-text-primary">Service Not Found</h1>
        <Link href="/admin/services" className="px-4 py-2 text-sm font-medium rounded bg-brand-gold text-brand-navy hover:bg-brand-gold/90 transition-colors">
          Back to Services
        </Link>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell adminName={adminName}>
      <div className="max-w-4xl mx-auto space-y-6">
<<<<<<< HEAD
        {/* Back link + heading */}
=======
>>>>>>> a1aeb90 (UI & portal)
        <div className="space-y-4">
          <Link href="/admin/services" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Edit Service</h1>
        </div>

        {errors.general && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-sm text-red-300" role="alert">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>

<<<<<<< HEAD
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

          {/* ✅ Full Description — Bilingual Rich Text Editor */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary">
              Full Description (shown on the service detail page)
            </h3>
            <BilingualEditor
              contentEn={fullDescriptionEn}
              contentAr={fullDescriptionAr}
              onChangeEn={(html) => setFullDescriptionEn(html)}
              onChangeAr={(html) => setFullDescriptionAr(html)}
              placeholderEn="Full details shown on the service page (optional)..."
              placeholderAr="التفاصيل الكاملة التي تظهر في صفحة الخدمة (اختياري)..."
              disabled={isSubmitting}
            />
            <p className="text-xs text-text-muted">
              Leave empty to fall back to the short description.
            </p>
          </div>

          {/* Service Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Image
            </label>
            {image ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.filePath}
                  alt="Selected service"
                  className="w-48 h-32 object-cover rounded-lg border border-white/10"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  disabled={isSubmitting}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-3 border border-dashed border-white/20 rounded-lg text-sm text-text-muted hover:border-brand-gold/40 hover:text-text-primary transition-colors"
              >
                <ImagePlus className="w-5 h-5" />
                Select image from media
              </button>
            )}
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
=======
          {/* ── Service Type ── */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Service Type</h2>
            <div className="flex gap-3">
              {(['sub-service', 'category'] as const).map(t => (
                <button key={t} type="button" onClick={() => setServiceType(t)}
                  className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${serviceType === t ? 'bg-brand-gold/15 border-brand-gold/40 text-brand-gold' : 'border-white/10 text-text-secondary hover:bg-white/5'}`}>
                  {t === 'category' ? '📂 Service Category' : '📄 Sub-Service'}
>>>>>>> a1aeb90 (UI & portal)
                </button>
              ))}
            </div>
          </section>

          {/* ── Category selector ── */}
          {serviceType === 'sub-service' && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Parent Category *</h2>
              <select value={categorySlug} onChange={e => { setCategorySlug(e.target.value); if (errors.categorySlug) setErrors(p => ({...p, categorySlug: undefined})); }}
                disabled={isSubmitting} className={inputCls(errors.categorySlug)}>
                <option value="" disabled>Select the category this service belongs to...</option>
                {CATEGORY_OPTIONS.map(c => <option key={c.slug} value={c.slug}>{c.labelEn}</option>)}
              </select>
              {errors.categorySlug && <p className="text-xs text-red-400">{errors.categorySlug}</p>}
            </section>
          )}

          {/* ── Titles ── */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Title</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="titleEn" className="text-sm font-medium text-text-primary">Title (English)</label>
                <input id="titleEn" type="text" maxLength={200} value={titleEn}
                  onChange={e => { setTitleEn(e.target.value); if (errors.titleEn) setErrors(p => ({...p, titleEn: undefined})); }}
                  disabled={isSubmitting} dir="ltr" className={inputCls(errors.titleEn)} />
                {errors.titleEn && <p className="text-xs text-red-400">{errors.titleEn}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="titleAr" className="text-sm font-medium text-text-primary text-right">العنوان (عربي)</label>
                <input id="titleAr" type="text" maxLength={200} value={titleAr}
                  onChange={e => { setTitleAr(e.target.value); if (errors.titleAr) setErrors(p => ({...p, titleAr: undefined})); }}
                  disabled={isSubmitting} dir="rtl" className={`${inputCls(errors.titleAr)} text-right`} />
                {errors.titleAr && <p className="text-xs text-red-400">{errors.titleAr}</p>}
              </div>
            </div>
          </section>

          {/* ── Short Description ── */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Short Description <span className="text-text-muted font-normal normal-case">(shown in listings)</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="descriptionEn" className="text-sm font-medium text-text-primary">English</label>
                <textarea id="descriptionEn" rows={3} maxLength={500} value={descriptionEn}
                  onChange={e => { setDescriptionEn(e.target.value); if (errors.descriptionEn) setErrors(p => ({...p, descriptionEn: undefined})); }}
                  disabled={isSubmitting} dir="ltr" className={`${inputCls(errors.descriptionEn)} resize-none`} />
                {errors.descriptionEn && <p className="text-xs text-red-400">{errors.descriptionEn}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="descriptionAr" className="text-sm font-medium text-text-primary text-right">عربي</label>
                <textarea id="descriptionAr" rows={3} maxLength={500} value={descriptionAr}
                  onChange={e => { setDescriptionAr(e.target.value); if (errors.descriptionAr) setErrors(p => ({...p, descriptionAr: undefined})); }}
                  disabled={isSubmitting} dir="rtl" className={`${inputCls(errors.descriptionAr)} resize-none text-right`} />
                {errors.descriptionAr && <p className="text-xs text-red-400">{errors.descriptionAr}</p>}
              </div>
            </div>
          </section>

          {/* ── Full Description ── */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Full Description <span className="text-text-muted font-normal normal-case">(service detail page)</span>
            </h2>
            <BilingualEditor contentEn={fullDescriptionEn} contentAr={fullDescriptionAr}
              onChangeEn={html => setFullDescriptionEn(html)}
              onChangeAr={html => setFullDescriptionAr(html)}
              placeholderEn="Full details for the service page..." placeholderAr="التفاصيل الكاملة لصفحة الخدمة..."
              disabled={isSubmitting} />
            <p className="text-xs text-text-muted">Leave empty to fall back to the short description.</p>
          </section>

          {/* ── Image ── */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Cover Image</h2>
            {image ? (
              <div className="space-y-2">
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.filePath} alt="Service cover" className="w-48 h-32 object-cover rounded-lg border border-white/10" />
                  <button type="button" onClick={() => setImage(null)} disabled={isSubmitting}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-500 transition-colors" aria-label="Remove image">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <button type="button" onClick={() => setPickerOpen(true)} disabled={isSubmitting}
                  className="block text-xs text-brand-gold hover:underline">Change image</button>
              </div>
            ) : (
              <button type="button" onClick={() => setPickerOpen(true)} disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-3 border border-dashed border-white/20 rounded-lg text-sm text-text-muted hover:border-brand-gold/40 hover:text-text-primary transition-colors">
                <ImagePlus className="w-5 h-5" /> Select image from media
              </button>
            )}
          </section>

          {/* ── Icon (categories only) ── */}
          {serviceType === 'category' && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Icon</h2>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(({ name, icon: Icon }) => (
                  <button key={name} type="button" onClick={() => setSelectedIcon(name)} disabled={isSubmitting} title={name}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${selectedIcon === name ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-white/10 text-text-muted hover:border-white/30'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
              {selectedIcon && <p className="text-xs text-text-muted">Selected: <span className="text-text-secondary">{selectedIcon}</span></p>}
            </section>
          )}

          {/* ── Display Order & Status ── */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="displayOrder" className="text-sm font-medium text-text-primary">Display Order *</label>
                <input id="displayOrder" type="number" min={1} step={1} value={displayOrder}
                  onChange={e => { setDisplayOrder(e.target.value); if (errors.displayOrder) setErrors(p => ({...p, displayOrder: undefined})); }}
                  disabled={isSubmitting} placeholder="1" className={inputCls(errors.displayOrder)} />
                {errors.displayOrder && <p className="text-xs text-red-400">{errors.displayOrder}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Status</label>
                <div className="flex items-center gap-3 h-[42px]">
                  <button type="button" role="switch" aria-checked={published}
                    onClick={() => { if (!isSubmitting) setPublished(p => !p); }} disabled={isSubmitting}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/40 ${published ? 'bg-green-600' : 'bg-white/20'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${published ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-text-muted">{published ? 'Published' : 'Unpublished'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Submit ── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            {showSaved && <span className="text-sm text-green-400">Changes saved.</span>}
            <Link href="/admin/services" className="px-4 py-2 text-sm font-medium rounded border border-white/10 text-text-secondary hover:bg-white/5 transition-colors">Done</Link>
            <button type="submit" disabled={isSubmitting}
              className={`px-6 py-2 text-sm font-medium rounded transition-colors ${isSubmitting ? 'bg-brand-gold/50 text-brand-navy/70 cursor-not-allowed' : 'bg-brand-gold text-brand-navy hover:bg-brand-gold/90'}`}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <RevisionHistory contentId={serviceId} />
      </div>

      <MediaPicker isOpen={pickerOpen} onClose={() => setPickerOpen(false)}
        onSelect={media => { setImage({ id: media.id, filePath: media.filePath }); setPickerOpen(false); }} />
    </AdminShell>
  );
}