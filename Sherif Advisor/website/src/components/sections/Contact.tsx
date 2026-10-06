'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';
import { BUSINESS_ACTIVITIES, COUNTRIES, DIAL_CODES } from '@/lib/inquiry-options';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

interface ServiceOption {
  id: string;
  title: string;
}

export function Contact() {
  const [lang, setLang] = useState<Language>('en');

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
    return () => { cancelled = true; };
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
    'w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/8 transition-all';
  const selectClass = `${fieldClass} appearance-none cursor-pointer`;

  return (
    <section
      className="bg-white py-16 lg:py-24"
      id="contact"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-8">

        {/* Section header — centered */}
        <div className="text-center mb-10 lg:mb-12">
          <span className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase mb-3 block">
            {t(lang, 'تواصل معنا', 'Get In Touch')}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-wide leading-tight">
            {t(lang, 'اطلب استشارة', 'Request a Consultation')}
          </h2>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
            {t(
              lang,
              'اترك بياناتك وسنتواصل معك قريباً. نلتزم بالرد بسرعة على كل استفساراتكم.',
              "Leave your details and we'll be in touch shortly. We're committed to responding promptly to every query."
            )}
          </p>
        </div>

        {/* Contact info row — centered */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                {t(lang, 'اتصل بنا', 'Call us')}
              </p>
              <a href="tel:+201112042098" className="text-sm text-gray-900 hover:text-brand-gold transition-colors" dir="ltr">
                +20 111 204 2098
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                {t(lang, 'البريد الإلكتروني', 'Email')}
              </p>
              <a href="mailto:info@sherifadvisory.com" className="text-sm text-gray-900 hover:text-brand-gold transition-colors">
                info@sherifadvisory.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                {t(lang, 'المقر الرئيسي', 'Headquarters')}
              </p>
              <p className="text-sm text-gray-900">
                {t(lang, 'القاهرة الجديدة، مصر', 'New Cairo, Egypt')}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gray-100" />
          <div className="w-8 h-[2px] bg-brand-gold" />
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* ── Form — full width, centered ── */}
        <div>
            <h3 className="font-serif text-xl font-bold text-gray-900 uppercase tracking-wide mb-1 text-center">
              {t(lang, 'أرسل لنا رسالة', 'Send us a message')}
            </h3>
            <p className="text-xs text-gray-400 tracking-wider uppercase mb-6 text-center">
              {t(lang, 'جميع الحقول المعلّمة بـ * إلزامية', 'All fields marked * are required')}
            </p>

            {success ? (
              <div className="flex flex-col items-center text-center gap-4 py-12 border border-gray-100 rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t(lang, 'تم الإرسال', 'Message Sent')}
                </h3>
                <p className="text-sm text-gray-500">
                  {t(lang, 'شكراً لتواصلك. سنعود إليك قريباً.', 'Thank you for reaching out. We will get back to you soon.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                {error && (
                  <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t(lang, 'الاسم الكامل*', 'Full Name*')}
                    maxLength={100}
                    className={fieldClass}
                  />
                  <div className="flex items-stretch bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/8 transition-all">
                    <select
                      value={dialCode}
                      onChange={(e) => setDialCode(e.target.value)}
                      className="bg-gray-50 px-3 py-3 text-sm text-gray-900 border-e border-gray-200 focus:outline-none cursor-pointer"
                      aria-label={t(lang, 'رمز الدولة', 'Country code')}
                    >
                      {DIAL_CODES.map((d) => (
                        <option key={d.code} value={d.dial}>{d.code} {d.dial}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t(lang, 'الهاتف', 'Phone')}
                      maxLength={30}
                      className="flex-1 px-4 py-3 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(lang, 'البريد الإلكتروني*', 'Email*')}
                  maxLength={254}
                  className={fieldClass}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={businessActivity}
                    onChange={(e) => setBusinessActivity(e.target.value)}
                    className={`${selectClass} ${businessActivity ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    <option value="" disabled>{t(lang, 'نشاط العمل*', 'Business Activity*')}</option>
                    {BUSINESS_ACTIVITIES.map((o) => (
                      <option key={o.value} value={o.value}>{t(lang, o.labelAr, o.labelEn)}</option>
                    ))}
                  </select>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`${selectClass} ${country ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    <option value="" disabled>{t(lang, 'أقيم في...*', 'I live in...*')}</option>
                    {COUNTRIES.map((o) => (
                      <option key={o.value} value={o.value}>{t(lang, o.labelAr, o.labelEn)}</option>
                    ))}
                  </select>
                </div>

                <select
                  value={helpWith}
                  onChange={(e) => setHelpWith(e.target.value)}
                  className={`${selectClass} ${helpWith ? 'text-gray-900' : 'text-gray-400'}`}
                >
                  <option value="" disabled>{t(lang, 'كيف يمكننا مساعدتك؟*', 'What Can We Help You With?*')}</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                  <option value="Other">{t(lang, 'أخرى', 'Other')}</option>
                </select>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t(lang, 'رسالتك (اختياري)', 'Your Message (optional)')}
                  maxLength={2000}
                  rows={4}
                  className={`${fieldClass} rounded-xl resize-none`}
                />

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/30 cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 leading-5">
                    {t(
                      lang,
                      'أؤكد أنني قرأت وفهمت الشروط وسياسة الخصوصية وأوافق على جمع ومعالجة بياناتي. ',
                      'I confirm that I have read and understood the Terms and Privacy Policy and consent to the collection and processing of my data. '
                    )}
                    <Link href="/terms" className="text-gray-900 underline hover:text-brand-gold">
                      {t(lang, 'الشروط', 'Terms')}
                    </Link>
                    {' · '}
                    <Link href="/privacy" className="text-gray-900 underline hover:text-brand-gold">
                      {t(lang, 'الخصوصية', 'Privacy')}
                    </Link>
                  </span>
                </label>

                <div className="pt-1 flex justify-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="border border-gray-900 group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-xs font-bold uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-gray-900 transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                    <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-gray-900 text-white flex-shrink-0">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-base">→</span>}
                    </span>
                    <span className="relative z-10 text-gray-900 transition-colors duration-300 group-hover:text-white">
                      {submitting
                        ? t(lang, 'جاري الإرسال...', 'Submitting...')
                        : t(lang, 'إرسال الطلب', 'Submit Request')}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
      </div>
    </section>
  );
}
