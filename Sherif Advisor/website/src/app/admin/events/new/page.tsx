'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import AdminShell from '../../components/AdminShell';
import BilingualEditor from '../../components/BilingualEditor';
import MediaPicker from '../../components/MediaPicker';

const CATEGORY_OPTIONS = [
  { value: 'workshop',   label: 'Workshop'   },
  { value: 'seminar',    label: 'Seminar'    },
  { value: 'webinar',    label: 'Webinar'    },
  { value: 'conference', label: 'Conference' },
  { value: 'training',   label: 'Training'   },
] as const;

const EVENT_TYPES = ['In-Person', 'Virtual', 'Hybrid'] as const;

interface FormErrors {
  titleAr?: string; titleEn?: string;
  bodyAr?: string; bodyEn?: string;
  category?: string; startDate?: string; general?: string;
}

export default function NewEventPage() {
  const router = useRouter();
  const [adminName, setAdminName]       = useState('Admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors]             = useState<FormErrors>({});
  const [titleEn, setTitleEn]   = useState('');
  const [titleAr, setTitleAr]   = useState('');
  const [bodyEn, setBodyEn]     = useState('');
  const [bodyAr, setBodyAr]     = useState('');
  const [category, setCategory] = useState('');
  const [eventType, setEventType] = useState('In-Person');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate]   = useState('');
  const [endTime, setEndTime]   = useState('');
  const [location, setLocation] = useState('');
  const [isPaid, setIsPaid]     = useState(false);
  const [published, setPublished] = useState(false);
  const [image, setImage]         = useState<{ id: string; filePath: string } | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content/stats').then(r => r.json()).then(d => { if (d.adminName) setAdminName(d.adminName); }).catch(() => {});
  }, []);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!titleEn.trim()) errs.titleEn = 'English title is required';
    if (!titleAr.trim()) errs.titleAr = 'Arabic title is required';
    if (!bodyEn.replace(/<[^>]*>/g, '').trim()) errs.bodyEn = 'English description is required';
    if (!bodyAr.replace(/<[^>]*>/g, '').trim()) errs.bodyAr = 'Arabic description is required';
    if (!category) errs.category = 'Please select a category';
    if (!startDate) errs.startDate = 'Start date is required';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setErrors({}); setIsSubmitting(true);
    try {
      const startISO = startDate ? new Date(`${startDate}T${startTime || '09:00'}`).toISOString() : null;
      const endISO   = endDate   ? new Date(`${endDate}T${endTime || '17:00'}`).toISOString()     : null;
      const res = await fetch('/api/admin/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'event', titleAr, titleEn, bodyAr, bodyEn,
          status: published ? 'published' : 'unpublished',
          metadata: { category, eventType, startDate: startISO, endDate: endISO, startTime: startTime||null, endTime: endTime||null, location: location.trim()||null, image: image?.filePath??null, imageId: image?.id??null, isPaid, categoryLabel: CATEGORY_OPTIONS.find(o=>o.value===category)?.label??category },
        }),
      });
      if (res.ok) { router.push('/admin/events'); }
      else { const d = await res.json().catch(()=>null); setErrors({ general: d?.error||'Failed to create event.' }); }
    } catch { setErrors({ general: 'Network error.' }); } finally { setIsSubmitting(false); }
  }

  const inp = (err?: string) => `px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${err?'border-red-500':'border-white/10'} ${isSubmitting?'opacity-50 cursor-not-allowed':''}`;

  return (
    <AdminShell adminName={adminName}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"><ArrowLeft className="w-4 h-4"/>Back to Events</Link>
          <h1 className="text-2xl font-semibold text-text-primary">Create New Event</h1>
        </div>
        {errors.general && <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-sm text-red-300">{errors.general}</div>}
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Title</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Title (English)</label>
                <input type="text" maxLength={200} value={titleEn} onChange={e=>{setTitleEn(e.target.value);if(errors.titleEn)setErrors(p=>({...p,titleEn:undefined}));}} disabled={isSubmitting} dir="ltr" className={inp(errors.titleEn)}/>
                {errors.titleEn&&<p className="text-xs text-red-400">{errors.titleEn}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary text-right">العنوان (عربي)</label>
                <input type="text" maxLength={200} value={titleAr} onChange={e=>{setTitleAr(e.target.value);if(errors.titleAr)setErrors(p=>({...p,titleAr:undefined}));}} disabled={isSubmitting} dir="rtl" className={`${inp(errors.titleAr)} text-right`}/>
                {errors.titleAr&&<p className="text-xs text-red-400">{errors.titleAr}</p>}
              </div>
            </div>
          </section>
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Description</h2>
            <BilingualEditor contentEn={bodyEn} contentAr={bodyAr} onChangeEn={h=>{setBodyEn(h);if(errors.bodyEn)setErrors(p=>({...p,bodyEn:undefined}));}} onChangeAr={h=>{setBodyAr(h);if(errors.bodyAr)setErrors(p=>({...p,bodyAr:undefined}));}} placeholderEn="Describe the event..." placeholderAr="صف الفعالية..." disabled={isSubmitting}/>
          </section>
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Classification</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Category *</label>
                <select value={category} onChange={e=>{setCategory(e.target.value);if(errors.category)setErrors(p=>({...p,category:undefined}));}} disabled={isSubmitting} className={inp(errors.category)}>
                  <option value="" disabled>Select category...</option>
                  {CATEGORY_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {errors.category&&<p className="text-xs text-red-400">{errors.category}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Event Type</label>
                <select value={eventType} onChange={e=>setEventType(e.target.value)} disabled={isSubmitting} className={inp()}>{EVENT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
              </div>
            </div>
          </section>
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Date &amp; Time</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1"><label className="text-sm font-medium text-text-primary">Start Date *</label><input type="date" value={startDate} onChange={e=>{setStartDate(e.target.value);if(errors.startDate)setErrors(p=>({...p,startDate:undefined}));}} disabled={isSubmitting} className={inp(errors.startDate)}/>{errors.startDate&&<p className="text-xs text-red-400">{errors.startDate}</p>}</div>
              <div className="flex flex-col gap-1"><label className="text-sm font-medium text-text-primary">Start Time</label><input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} disabled={isSubmitting} className={inp()}/></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-medium text-text-primary">End Date</label><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} disabled={isSubmitting} className={inp()}/></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-medium text-text-primary">End Time</label><input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} disabled={isSubmitting} className={inp()}/></div>
            </div>
          </section>
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1"><label className="text-sm font-medium text-text-primary">Location / Platform</label><input type="text" value={location} onChange={e=>setLocation(e.target.value)} disabled={isSubmitting} placeholder="e.g. New Cairo or Online via Zoom" className={inp()}/></div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary block">Cover Image</label>
                {image ? (
                  <div className="space-y-2">
                    <div className="relative inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.filePath} alt="cover" className="w-48 h-32 object-cover rounded-lg border border-white/10"/>
                      <button type="button" onClick={()=>setImage(null)} disabled={isSubmitting} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-500 transition-colors"><X className="w-4 h-4"/></button>
                    </div>
                    <button type="button" onClick={()=>setPickerOpen(true)} disabled={isSubmitting} className="block text-xs text-brand-gold hover:underline">Change image</button>
                  </div>
                ) : (
                  <button type="button" onClick={()=>setPickerOpen(true)} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-3 border border-dashed border-white/20 rounded-lg text-sm text-text-muted hover:border-brand-gold/40 hover:text-text-primary transition-colors"><ImagePlus className="w-5 h-5"/>Select image from media</button>
                )}
              </div>
            </div>
          </section>
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Settings</h2>
            <div className="flex flex-wrap gap-8">
              {[{val:isPaid,set:setIsPaid,on:'Paid event',off:'Free event'},{val:published,set:setPublished,on:'Published',off:'Draft',green:true}].map((t,i)=>(
                <div key={i} className="flex items-center gap-3">
                  <button type="button" role="switch" aria-checked={t.val} onClick={()=>{if(!isSubmitting)t.set((p:boolean)=>!p);}} disabled={isSubmitting} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${t.val?(t.green?'bg-green-600':'bg-brand-gold'):'bg-white/20'} ${isSubmitting?'opacity-50 cursor-not-allowed':'cursor-pointer'}`}><span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${t.val?'translate-x-6':'translate-x-1'}`}/></button>
                  <span className="text-sm text-text-secondary">{t.val?t.on:t.off}</span>
                </div>
              ))}
            </div>
          </section>
          <div className="flex justify-end pt-4 border-t border-white/10">
            <button type="submit" disabled={isSubmitting} className={`px-6 py-2 text-sm font-medium rounded transition-colors ${isSubmitting?'bg-brand-gold/50 text-brand-navy/70 cursor-not-allowed':'bg-brand-gold text-brand-navy hover:bg-brand-gold/90'}`}>{isSubmitting?'Creating...':'Create Event'}</button>
          </div>
        </form>
      </div>
      <MediaPicker isOpen={pickerOpen} onClose={()=>setPickerOpen(false)} onSelect={m=>{setImage({id:m.id,filePath:m.filePath});setPickerOpen(false);}}/>
    </AdminShell>
  );
}
