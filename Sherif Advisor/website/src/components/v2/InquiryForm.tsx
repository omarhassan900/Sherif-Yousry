'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { type Language } from '@/lib/language';
import {
  BUSINESS_ACTIVITIES,
  COUNTRIES,
  DIAL_CODES,
} from '@/lib/inquiry-options';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

interface ServiceOption {
  id: string;
  title: string;
}

export interface InquiryFormProps {
  lang: Language;
  /** Where the inquiry is submitted from. */
  source: 'service' | 'contact';
  /**
   * When rendered on a service detail page, the service is fixed and its
   * name is used for the "help with" field automatically.
   */
  lockedService?: { id: string; name: string };
  /** Heading text override. */
  title?: string;
}

/**
 * Shared inquiry form used by both the service detail page and the contact
 * page. Posts to /api/services/[id]/inquiry when a service is locked, or to
 * /api/contact otherwise (both persist a ServiceInquiry record).
 */
export default function InquiryForm({
  lang,
  source,
  lockedService,
  title,
}: InquiryFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState(DIAL_CODES[0].dial);
  const [phone, setPhone] = useState('');
  const [businessActivity, setBusinessActivity] = useState('');
  const [country, setCountry] = useState('');
  const [helpWith, setHelpWith] = useState('');
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState('');

  const [services, setServices] = useState<ServiceOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load service list for the "What can we help you with?" dropdown
  // (only needed when the service isn't already locked).
  useEffect(() => {
    if (lockedService) return;
    let cancelled = false;
    fetch(`/api/content/services?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.items)) {
          setServices(data.items.map((s: { id: string; title: string }) => ({ id: s.id, title: s.title })));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang, lockedService]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError(t(lang, 'الاسم والبريد الإلكتروني مطلوبان', 'Name and email are required'));
      return;
    }
    if (!businessActivity) {
      setError(t(lang, 'نشاط العمل مطلوب', 'Business activity is required'));
      return;
    }
    if (!country) {
      setError(t(lang, 'يرجى اختيار الدولة', 'Please select your country'));
      return;
    }
    if (!lockedService && !helpWith) {
      setError(t(lang, 'يرجى اختيار الخدمة', 'Please select what we can help with'));
      return;
    }
    if (!consent) {
      setError(t(lang, 'يرجى الموافقة على الشروط وسياسة الخصوصية', 'Please accept the terms and privacy policy'));
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      countryCode: dialCode,
      businessActivity,
      country,
      helpWith: lockedService ? lockedService.name : helpWith,
      consent,
      message: message.trim() || undefined,
      source,
    };

    const url = lockedService
      ? `/api/services/${lockedService.id}/inquiry`
      : '/api/contact';

    setSubmitting(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(
          data?.error ||
            t(lang, 'حدث خطأ. حاول مرة أخرى.', 'Something went wrong. Please try again.')
        );
      }
    } catch {
      setError(t(lang, 'تعذر الاتصال. حاول مرة أخرى.', 'Unable to connect. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-brand-navy rounded-2xl border border-white/10 shadow-xl p-8 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-brand-gold" />
        </div>
        <h3 className="text-2xl font-semibold text-white">
          {t(lang, 'تم الإرسال', 'Message Sent')}
        </h3>
        <p className="text-sm text-gray-400 leading-6">
          {t(
            lang,
            'شكراً لتواصلك. سنعود إليك قريباً.',
            'Thank you for reaching out. We will get back to you soon.'
          )}
        </p>
      </div>
    );
  }

  const fieldClass =
    'w-full px-5 py-2.5 bg-white/5 border border-white/15 rounded-full text-white placeholder:text-gray-400 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all';
  const selectClass = `${fieldClass} appearance-none cursor-pointer [&>option]:bg-[#0d1f35] [&>option]:text-white`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-brand-navy rounded-2xl border border-white/10 shadow-xl p-5 sm:p-7 space-y-3"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Heading */}
      <div className="mb-2">
        <h3 className="text-2xl font-semibold text-white">
          {title || t(lang, 'لنبدأ العمل', "Let's get you started")}
        </h3>
        {lockedService && (
          <p className="text-xs text-gray-400 mt-1">
            {t(lang, 'بخصوص:', 'Regarding:')}{' '}
            <span className="text-brand-gold font-medium">{lockedService.name}</span>
          </p>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="bg-red-900/30 border border-red-500/40 text-red-300 text-sm px-4 py-2.5 rounded-xl"
        >
          {error}
        </div>
      )}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t(lang, 'الاسم الكامل*', 'Full Name*')}
        maxLength={100}
        className={fieldClass}
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t(lang, 'البريد الإلكتروني*', 'Email Address*')}
        maxLength={254}
        className={fieldClass}
      />

      {/* Phone with dial code */}
      <div className="flex items-stretch bg-white/5 border border-white/15 rounded-full overflow-hidden focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20 transition-all">
        <select
          value={dialCode}
          onChange={(e) => setDialCode(e.target.value)}
          className="bg-transparent px-4 py-2.5 text-sm text-white border-e border-white/15 focus:outline-none cursor-pointer [&>option]:bg-[#0d1f35]"
          aria-label={t(lang, 'رمز الدولة', 'Country code')}
        >
          {DIAL_CODES.map((d) => (
            <option key={d.code} value={d.dial}>
              {d.code} {d.dial}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t(lang, 'أدخل رقم هاتفك هنا', 'Enter your phone number here')}
          maxLength={30}
          className="flex-1 px-4 py-2.5 bg-transparent text-sm text-white placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      {/* Business Activity + Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={businessActivity}
          onChange={(e) => setBusinessActivity(e.target.value)}
          className={`${selectClass} ${businessActivity ? 'text-white' : 'text-gray-400'}`}
        >
          <option value="" disabled>
            {t(lang, 'نشاط العمل*', 'Business Activity*')}
          </option>
          {BUSINESS_ACTIVITIES.map((o) => (
            <option key={o.value} value={o.value}>
              {t(lang, o.labelAr, o.labelEn)}
            </option>
          ))}
        </select>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={`${selectClass} ${country ? 'text-white' : 'text-gray-400'}`}
        >
          <option value="" disabled>
            {t(lang, 'أقيم في...*', 'I live in...*')}
          </option>
          {COUNTRIES.map((o) => (
            <option key={o.value} value={o.value}>
              {t(lang, o.labelAr, o.labelEn)}
            </option>
          ))}
        </select>
      </div>

      {/* What can we help with */}
      {!lockedService && (
        <select
          value={helpWith}
          onChange={(e) => setHelpWith(e.target.value)}
          className={`${selectClass} ${helpWith ? 'text-white' : 'text-gray-400'}`}
        >
          <option value="" disabled>
            {t(lang, 'كيف يمكننا مساعدتك؟*', 'What Can We Help You With?*')}
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Other">
            {t(lang, 'أخرى', 'Other')}
          </option>
        </select>
      )}

      {/* Optional message */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t(lang, 'رسالتك (اختياري)', 'Your message (optional)')}
        maxLength={2000}
        rows={2}
        className="w-full px-5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-white placeholder:text-gray-400 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all resize-none"
      />

      {/* Consent */}
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-white/30 bg-white/5 text-brand-gold focus:ring-brand-gold/40 cursor-pointer"
        />
        <span className="text-xs text-gray-400 leading-5">
          {t(
            lang,
            'أؤكد أنني قرأت وفهمت الشروط وسياسة الخصوصية وأوافق على جمع ومعالجة بياناتي. ',
            'I confirm that I have read and understood the Terms and Privacy Policy and consent to the collection and processing of my data. '
          )}
          <Link href="/terms" className="text-brand-gold underline hover:text-brand-gold/80">
            {t(lang, 'الشروط', 'Terms')}
          </Link>
          {' · '}
          <Link href="/privacy" className="text-brand-gold underline hover:text-brand-gold/80">
            {t(lang, 'الخصوصية', 'Privacy')}
          </Link>
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 bg-brand-gold text-brand-navy font-bold py-3 px-6 rounded-full hover:bg-brand-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t(lang, 'جاري الإرسال...', 'Sending...')}
          </>
        ) : (
          <>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-navy text-brand-gold">
              <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </span>
            {t(lang, 'ابدأ الآن', 'Get Started Now')}
          </>
        )}
      </button>
    </form>
  );
}
