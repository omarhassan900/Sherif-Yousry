'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import AdminShell from '../../../components/AdminShell';
import BilingualEditor from '../../../components/BilingualEditor';
import MediaPicker from '../../../components/MediaPicker';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'] as const;

const ICON_OPTIONS = [
  { value: 'Briefcase', label: 'Briefcase (general)' },
  { value: 'Calculator', label: 'Calculator (tax / finance)' },
  { value: 'Scale', label: 'Scale (legal)' },
  { value: 'BarChart2', label: 'Chart (analyst)' },
  { value: 'Building2', label: 'Building (corporate)' },
  { value: 'Users', label: 'Users (HR / people)' },
] as const;

interface FormErrors {
  titleAr?: string; titleEn?: string;
  bodyAr?: string; bodyEn?: string;
  department?: string; general?: string;
}

function linesToArray(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean);
}
function arrayToLines(val: unknown): string {
  return Array.isArray(val) ? (val as string[]).join('\n') : '';
}

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [departmentEn, setDepartmentEn] = useState('');
  const [departmentAr, setDepartmentAr] = useState('');
  const [locationEn, setLocationEn] = useState('');
  const [locationAr, setLocationAr] = useState('');
  const [jobType, setJobType] = useState<string>('Full-time');
  const [icon, setIcon] = useState<string>('Briefcase');
  const [displayOrder, setDisplayOrder] = useState('');
  const [respEn, setRespEn] = useState('');
  const [respAr, setRespAr] = useState('');
  const [reqEn, setReqEn] = useState('');
  const [reqAr, setReqAr] = useState('');
  const [published, setPublished] = useState(false);
  const [image, setImage] = useState<{ id: string; filePath: string } | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content/stats').then(r => r.json()).then(d => { if (d.adminName) setAdminName(d.adminName); }).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/content/${id}`);
        if (!res.ok) { if (!cancelled) setNotFound(true); return; }
        const item = await res.json();
        if (cancelled) return;
        const m = item.metadata ?? {};
        setTitleEn(item.titleEn ?? '');
        setTitleAr(item.titleAr ?? '');
        setBodyEn(item.bodyEn ?? '');
        setBodyAr(item.bodyAr ?? '');
        setDepartmentEn(m.department ?? '');
        setDepartmentAr(m.departmentAr ?? '');
        setLocationEn(m.location ?? '');
        setLocationAr(m.locationAr ?? '');
        setJobType(m.jobType ?? 'Full-time');
        setIcon(m.icon ?? 'Briefcase');
        setDisplayOrder(m.displayOrder != null ? String(m.displayOrder) : '');
        setRespEn(arrayToLines(m.responsibilitiesEn));
        setRespAr(arrayToLines(m.responsibilitiesAr));
        setReqEn(arrayToLines(m.requirementsEn));
        setReqAr(arrayToLines(m.requirementsAr));
        setPublished(item.status === 'published');
        if (m.image) setImage({ id: m.imageId ?? '', filePath: m.image });
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!titleEn.trim()) errs.titleEn = 'English title is required';
    if (!titleAr.trim()) errs.titleAr = 'Arabic title is required';
    if (!bodyEn.replace(/<[^>]*>/g, '').trim()) errs.bodyEn = 'English summary is required';
    if (!bodyAr.replace(/<[^>]*>/g, '').trim()) errs.bodyAr = 'Arabic summary is required';
    if (!departmentEn.trim()) errs.department = 'Department is required';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setErrors({}); setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/content/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr, titleEn, bodyAr, bodyEn,
          status: published ? 'published' : 'unpublished',
          metadata: {
            department: departmentEn.trim(),
            departmentAr: departmentAr.trim() || departmentEn.trim(),
            location: locationEn.trim(),
            locationAr: locationAr.trim() || locationEn.trim(),
            jobType,
            icon,
            displayOrder: displayOrder ? Number(displayOrder) : undefined,
            responsibilitiesEn: linesToArray(respEn),
            responsibilitiesAr: linesToArray(respAr),
            requirementsEn: linesToArray(reqEn),
            requirementsAr: linesToArray(reqAr),
            image: image?.filePath ?? null,
            imageId: image?.id ?? null,
          },
        }),
      });
      if (res.ok) { router.push('/admin/jobs'); }
      else { const d = await res.json().catch(() => null); setErrors({ general: d?.error || 'Failed to update job.' }); }
    } catch { setErrors({ general: 'Network error.' }); } finally { setIsSubmitting(false); }
  }

  const inp = (err?: string) => `px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${err ? 'border-red-500' : 'border-white/10'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`;
  const ta = `px-3 py-2 bg-brand-navy-dark border border-white/10 rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors resize-y min-h-[120px] ${isSubmitting ? 'opacity-50' : ''}`;

  if (loading) {
    return <AdminShell adminName={adminName}><div className="px-5 py-12 text-center text-text-muted">Loading...</div></AdminShell>;
  }
  if (notFound) {
    return <AdminShell adminName={adminName}>
      <div className="max-w-4xl mx-auto space-y-4">
        <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"><ArrowLeft className="w-4 h-4" />Back to Careers</Link>
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-500/40 text-sm text-red-300">Job not found.</div>
      </div>
    </AdminShell>;
  }

  return (
    <AdminShell adminName={adminName}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"><ArrowLeft className="w-4 h-4" />Back to Careers</Link>
          <h1 className="text-2xl font-semibold text-text-primary">Edit Job</h1>
        </div>
        {errors.general && <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-sm text-red-300">{errors.general}</div>}
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Job Title</h2>
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

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Summary</h2>
            <BilingualEditor contentEn={bodyEn} contentAr={bodyAr} onChangeEn={h => { setBodyEn(h); if (errors.bodyEn) setErrors(p => ({ ...p, bodyEn: undefined })); }} onChangeAr={h => { setBodyAr(h); if (errors.bodyAr) setErrors(p => ({ ...p, bodyAr: undefined })); }} placeholderEn="Short role summary..." placeholderAr="ملخص قصير للوظيفة..." disabled={isSubmitting} />
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Classification</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Department (English) *</label>
                <input type="text" value={departmentEn} onChange={e => { setDepartmentEn(e.target.value); if (errors.department) setErrors(p => ({ ...p, department: undefined })); }} disabled={isSubmitting} placeholder="e.g. Tax" className={inp(errors.department)} />
                {errors.department && <p className="text-xs text-red-400">{errors.department}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary text-right">القسم (عربي)</label>
                <input type="text" value={departmentAr} onChange={e => setDepartmentAr(e.target.value)} disabled={isSubmitting} dir="rtl" placeholder="مثال: الضرائب" className={`${inp()} text-right`} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Location (English)</label>
                <input type="text" value={locationEn} onChange={e => setLocationEn(e.target.value)} disabled={isSubmitting} placeholder="e.g. New Cairo, Egypt or Remote" className={inp()} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary text-right">الموقع (عربي)</label>
                <input type="text" value={locationAr} onChange={e => setLocationAr(e.target.value)} disabled={isSubmitting} dir="rtl" placeholder="مثال: القاهرة الجديدة" className={`${inp()} text-right`} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Job Type</label>
                <select value={jobType} onChange={e => setJobType(e.target.value)} disabled={isSubmitting} className={inp()}>{JOB_TYPES.map(tp => <option key={tp} value={tp}>{tp}</option>)}</select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Icon</label>
                <select value={icon} onChange={e => setIcon(e.target.value)} disabled={isSubmitting} className={inp()}>{ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Display Order</label>
                <input type="number" min={0} value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} disabled={isSubmitting} placeholder="e.g. 1" className={inp()} />
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Key Responsibilities <span className="normal-case font-normal text-text-muted">(one per line)</span></h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <textarea value={respEn} onChange={e => setRespEn(e.target.value)} disabled={isSubmitting} dir="ltr" className={ta} />
              <textarea value={respAr} onChange={e => setRespAr(e.target.value)} disabled={isSubmitting} dir="rtl" className={`${ta} text-right`} />
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Requirements <span className="normal-case font-normal text-text-muted">(one per line)</span></h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <textarea value={reqEn} onChange={e => setReqEn(e.target.value)} disabled={isSubmitting} dir="ltr" className={ta} />
              <textarea value={reqAr} onChange={e => setReqAr(e.target.value)} disabled={isSubmitting} dir="rtl" className={`${ta} text-right`} />
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Cover Image</h2>
            {image ? (
              <div className="space-y-2">
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.filePath} alt="cover" className="w-48 h-32 object-cover rounded-lg border border-white/10" />
                  <button type="button" onClick={() => setImage(null)} disabled={isSubmitting} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-500 transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <button type="button" onClick={() => setPickerOpen(true)} disabled={isSubmitting} className="block text-xs text-brand-gold hover:underline">Change image</button>
              </div>
            ) : (
              <button type="button" onClick={() => setPickerOpen(true)} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-3 border border-dashed border-white/20 rounded-lg text-sm text-text-muted hover:border-brand-gold/40 hover:text-text-primary transition-colors"><ImagePlus className="w-5 h-5" />Select image from media</button>
            )}
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Settings</h2>
            <div className="flex items-center gap-3">
              <button type="button" role="switch" aria-checked={published} onClick={() => { if (!isSubmitting) setPublished(p => !p); }} disabled={isSubmitting} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${published ? 'bg-green-600' : 'bg-white/20'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}><span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${published ? 'translate-x-6' : 'translate-x-1'}`} /></button>
              <span className="text-sm text-text-secondary">{published ? 'Published' : 'Draft'}</span>
            </div>
          </section>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button type="submit" disabled={isSubmitting} className={`px-6 py-2 text-sm font-medium rounded transition-colors ${isSubmitting ? 'bg-brand-gold/50 text-brand-navy/70 cursor-not-allowed' : 'bg-brand-gold text-brand-navy hover:bg-brand-gold/90'}`}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
      <MediaPicker isOpen={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={m => { setImage({ id: m.id, filePath: m.filePath }); setPickerOpen(false); }} />
    </AdminShell>
  );
}
