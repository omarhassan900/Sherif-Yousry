'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';
import { BUSINESS_ACTIVITIES, COUNTRIES, DIAL_CODES } from '@/lib/inquiry-options';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

interface ServiceOption {
  id: string;
  title: string;
}

export function Contact() {
  const [lang, setLang] = useState<Language>('ar');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState(DIAL_CODES[0].dial);
  const [phone, setPhone] = useState('');
  const [businessActivity, setBusinessActivity] = useState('');
  const [country, setCountry] = useState('');
  const [helpWith, setHelpWith] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [services, setServices] = useState<ServiceOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  // Load the service list for the "What can we help you with?" dropdown.
  useEffect(() => {
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
  }, [lang]);

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
    if (!helpWith) {
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
      helpWith,
      consent,
      message: message.trim() || undefined,
      source: 'contact' as const,
    };

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
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

  const fieldClass =
    'w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-[#333] placeholder:text-gray-400 text-sm focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 transition-all';
  const selectClass = `${fieldClass} appearance-none cursor-pointer`;

  return (
    <section className="bg-white py-16 lg:py-20" id="contact" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
            {t(lang, 'اطلب استشارة', 'Request a Consultation')}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
            {t(
              lang,
              'اترك بياناتك أدناه وسنتواصل معك قريباً. نلتزم بالرد بسرعة على كل استفساراتكم.',
              "Leave your details below, and we'll be in touch shortly. We're committed to responding promptly to each and every query."
            )}
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center text-center gap-3 py-10">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
            <h3 className="text-xl font-semibold text-[#1a1a1a]">
              {t(lang, 'تم الإرسال', 'Message Sent')}
            </h3>
            <p className="text-sm text-gray-500">
              {t(
                lang,
                'شكراً لتواصلك. سنعود إليك قريباً.',
                'Thank you for reaching out. We will get back to you soon.'
              )}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && (
              <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-md">
                {error}
              </div>
            )}

            {/* Name + Phone row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(lang, 'الاسم الكامل*', 'Full Name*')}
                maxLength={100}
                className={fieldClass}
              />

              {/* Phone with dial-code prefix */}
              <div className="flex items-stretch bg-white border border-gray-300 rounded-md overflow-hidden focus-within:border-brand-navy focus-within:ring-2 focus-within:ring-brand-navy/15 transition-all">
                <select
                  value={dialCode}
                  onChange={(e) => setDialCode(e.target.value)}
                  className="bg-transparent px-3 py-3 text-sm text-[#333] border-e border-gray-300 focus:outline-none cursor-pointer"
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
                  placeholder={t(lang, 'الهاتف', 'Phone')}
                  maxLength={30}
                  className="flex-1 px-4 py-3 bg-transparent text-sm text-[#333] placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(lang, 'البريد الإلكتروني*', 'Email*')}
              maxLength={254}
              className={fieldClass}
            />

            {/* Business Activity + Country row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={businessActivity}
                onChange={(e) => setBusinessActivity(e.target.value)}
                className={`${selectClass} ${businessActivity ? 'text-[#333]' : 'text-gray-400'}`}
              >
                <option value="" disabled>
                  {t(lang, 'نشاط العمل*', 'Business Activity*')}
                </option>
                {BUSINESS_ACTIVITIES.map((o) => (
                  <option key={o.value} value={o.value} className="text-[#333]">
                    {t(lang, o.labelAr, o.labelEn)}
                  </option>
                ))}
              </select>

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`${selectClass} ${country ? 'text-[#333]' : 'text-gray-400'}`}
              >
                <option value="" disabled>
                  {t(lang, 'أقيم في...*', 'I live in...*')}
                </option>
                {COUNTRIES.map((o) => (
                  <option key={o.value} value={o.value} className="text-[#333]">
                    {t(lang, o.labelAr, o.labelEn)}
                  </option>
                ))}
              </select>
            </div>

            {/* What can we help with */}
            <select
              value={helpWith}
              onChange={(e) => setHelpWith(e.target.value)}
              className={`${selectClass} ${helpWith ? 'text-[#333]' : 'text-gray-400'}`}
            >
              <option value="" disabled>
                {t(lang, 'كيف يمكننا مساعدتك؟*', 'What Can We Help You With?*')}
              </option>
              {services.map((s) => (
                <option key={s.id} value={s.title} className="text-[#333]">
                  {s.title}
                </option>
              ))}
              <option value="Other" className="text-[#333]">
                {t(lang, 'أخرى', 'Other')}
              </option>
            </select>

            {/* Message */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t(lang, 'رسالتك (اختياري)', 'Your Message (optional)')}
              maxLength={2000}
              rows={5}
              className={`${fieldClass} resize-y`}
            />

            {/* Consent */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-navy focus:ring-brand-navy/40 cursor-pointer"
              />
              <span className="text-xs text-gray-500 leading-5">
                {t(
                  lang,
                  'أؤكد أنني قرأت وفهمت الشروط وسياسة الخصوصية وأوافق على جمع ومعالجة بياناتي. ',
                  'I confirm that I have read and understood the Terms and Privacy Policy and consent to the collection and processing of my data. '
                )}
                <Link href="/terms" className="text-brand-navy underline hover:text-brand-gold">
                  {t(lang, 'الشروط', 'Terms')}
                </Link>
                {' · '}
                <Link href="/privacy" className="text-brand-navy underline hover:text-brand-gold">
                  {t(lang, 'الخصوصية', 'Privacy')}
                </Link>
              </span>
            </label>

            {/* Submit */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 mt-4 inline-flex items-center justify-center gap-2 rounded-full px-6 py-2 text-[11px] font-bold tracking-[1.5px] uppercase transition-colors duration-300 bg-brand-navy text-white hover:bg-brand-navy-mid bg-[#b01e28] text-white font-semibold text-sm py-2.5 px-8 rounded-md hover:bg-[#951821] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t(lang, 'جاري الإرسال...', 'Submitting...')}
                  </>
                ) : (
                  t(lang, 'إرسال', 'Submit')
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
