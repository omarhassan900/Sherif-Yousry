'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Briefcase, Building2, Scale, ShieldCheck, FileText,
  TrendingUp, Users, Globe, Award, Calculator, BarChart2, Loader2, ImagePlus, X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AdminShell from '../../../components/AdminShell';
import RevisionHistory from '../../../components/RevisionHistory';
import MediaPicker from '../../../components/MediaPicker';
import BilingualEditor from '../../../components/BilingualEditor';

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
  { slug: 'tax-advisory',                 labelEn: 'Tax Advisory' },
  { slug: 'audit-accounting-assurance',   labelEn: 'Audit, Accounting & Assurance' },
  { slug: 'financial-advisory',           labelEn: 'Financial Advisory' },
  { slug: 'business-management-advisory', labelEn: 'Business, Economic & Management Advisory' },
  { slug: 'corporate-legal-services',     labelEn: 'Corporate & Legal Services' },
  { slug: 'payroll-social-insurance',     labelEn: 'Payroll & Social Insurance' },
  { slug: 'ecommerce-digital-business',   labelEn: 'E-Commerce & Digital Business' },
];

interface FormErrors {
  titleAr?: string; titleEn?: string;
  descriptionAr?: string; descriptionEn?: string;
  categorySlug?: string; displayOrder?: string; general?: string;
}

export default function EditServicePage() {
  const router    = useRouter();
  const params    = useParams();
  const serviceId = params.id as string;

  const [adminName, setAdminName]       = useState('Admin');
  const [isLoading, setIsLoading]       = useState(true);
  const [notFound, setNotFound]         = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors]             = useState<FormErrors>({});
  const [showSaved, setShowSaved]       = useState(false);

  const [serviceType, setServiceType]       = useState<'category' | 'sub-service'>('sub-service');
  const [categorySlug, setCategorySlug]     = useState('');
  const [titleEn, setTitleEn]               = useState('');
  const [titleAr, setTitleAr]               = useState('');
  const [descriptionEn, setDescriptionEn]   = useState('');
  const [descriptionAr, setDescriptionAr]   = useState('');
  const [fullDescriptionEn, setFullDescriptionEn] = useState('');
  const [fullDescriptionAr, setFullDescriptionAr] = useState('');
  const [selectedIcon, setSelectedIcon]     = useState('');
  const [displayOrder, setDisplayOrder]     = useState('');
  const [published, setPublished]           = useState(false);
  const [image, setImage]                   = useState<{ id: string; filePath: string } | null>(null);
  const [pickerOpen, setPickerOpen]         = useState(false);

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
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setErrors({}); setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/content/${serviceId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr, titleEn,
          bodyAr: descriptionAr,
          bodyEn: descriptionEn,
          status: published ? 'published' : 'unpublished',
          metadata: {
            serviceType, categorySlug,
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
      if (res.ok) { setShowSaved(true); setTimeout(() => setShowSaved(false), 3000); }
      else { const d = await res.json().catch(() => null); setErrors({ general: d?.error || 'Failed to save.' }); }
    } catch { setErrors({ general: 'Network error.' }); } finally { setIsSubmitting(false); }
  }

  const inp = (err?: string) =>
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
        <Link href="/admin/services" className="px-4 py-2 text-sm font-medium rounded bg-brand-gold text-brand-navy hover:bg-brand-gold/90 transition-colors">Back to Services</Link>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell adminName={adminName}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          <Link href="/admin/services" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Edit Service</h1>
        </div>

        {errors.general && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-sm text-red-300">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>

          {/* Service Type */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Service Type</h2>
            <div className="flex gap-3 flex-wrap">
              {(['sub-service', 'category'] as const).map(tp => (
                <button key={tp} type="button" onClick={() => setServiceType(tp)}
                  className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${serviceType === tp ? 'bg-brand-gold/15 border-brand-gold/40 text-brand-gold' : 'border-white/10 text-text-secondary hover:bg-white/5'}`}>
                  {tp === 'category' ? '📂 Service Category' : '📄 Sub-Service'}
                </button>
              ))}
            </div>
          </section>

          {/* Parent Category (sub-service only) */}
          {serviceType === 'sub-service' && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Parent Category *</h2>
              <select value={categorySlug} onChange={e => { setCategorySlug(e.target.value); if (errors.categorySlug) setErrors(p => ({ ...p, categorySlug: undefined })); }}
                disabled={isSubmitting} className={inp(errors.categorySlug)}>
                <option value="" disabled>Select category...</option>
                {CATEGORY_OPTIONS.map(c => <option key={c.slug} value={c.slug}>{c.labelEn}</option>)}
              </select>
              {errors.categorySlug && <p className="text-xs text-red-400">{errors.categorySlug}</p>}
            </section>
          )}

          {/* Titles */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Title</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Title (English)</label>
                <input type="text" maxLength={200} value={titleEn} onChange={e => { setTitleEn(e.target.value); if (errors.titleEn) setErrors(p => ({ ...p, titleEn: undefined })); }} disabled={isSubmitting} dir="ltr" className={inp(errors.titleEn)} />
                {errors.titleEn && <p className="text-xs text-red-400">{errors.titleEn}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary text-right">العنوان (عربي)</label>
                <input type="text" maxLength={200} value={titleAr} onChange={e => { setTitleAr(e.target.value); if (errors.titleAr) setErrors(p => ({ ...p, titleAr: undefined })); }} disabled={isSubmitting} dir="rtl" className={`${inp(errors.titleAr)} text-right`} />
                {errors.titleAr && <p className="text-xs text-red-400">{errors.titleAr}</p>}
              </div>
            </div>
          </section>

          {/* Short Description */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Short Description <span className="text-text-muted font-normal normal-case">(shown in listings)</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">English</label>
                <textarea rows={3} maxLength={500} value={descriptionEn} onChange={e => { setDescriptionEn(e.target.value); if (errors.descriptionEn) setErrors(p => ({ ...p, descriptionEn: undefined })); }} disabled={isSubmitting} dir="ltr" className={`${inp(errors.descriptionEn)} resize-none`} />
                {errors.descriptionEn && <p className="text-xs text-red-400">{errors.descriptionEn}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary text-right">عربي</label>
                <textarea rows={3} maxLength={500} value={descriptionAr} onChange={e => { setDescriptionAr(e.target.value); if (errors.descriptionAr) setErrors(p => ({ ...p, descriptionAr: undefined })); }} disabled={isSubmitting} dir="rtl" className={`${inp(errors.descriptionAr)} resize-none text-right`} />
                {errors.descriptionAr && <p className="text-xs text-red-400">{errors.descriptionAr}</p>}
              </div>
            </div>
          </section>

          {/* Full Description */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Full Description <span className="text-text-muted font-normal normal-case">(service detail page)</span>
            </h2>
            <BilingualEditor contentEn={fullDescriptionEn} contentAr={fullDescriptionAr}
              onChangeEn={html => setFullDescriptionEn(html)}
              onChangeAr={html => setFullDescriptionAr(html)}
              placeholderEn="Full details for the service page..."
              placeholderAr="التفاصيل الكاملة لصفحة الخدمة..."
              disabled={isSubmitting} />
            <p className="text-xs text-text-muted">Leave empty to fall back to the short description.</p>
          </section>

          {/* Cover Image */}
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

          {/* Icon (categories only) */}
          {serviceType === 'category' && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Icon <span className="text-text-muted font-normal normal-case">(shown on homepage)</span></h2>
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

          {/* Settings */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Display Order *</label>
                <input type="number" min={1} step={1} value={displayOrder}
                  onChange={e => { setDisplayOrder(e.target.value); if (errors.displayOrder) setErrors(p => ({ ...p, displayOrder: undefined })); }}
                  disabled={isSubmitting} placeholder="1" className={inp(errors.displayOrder)} />
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

          {/* Submit */}
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
