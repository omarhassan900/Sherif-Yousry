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
    'w-full px-4 py-3 bg-white border border-[#d8d2c6] rounded-lg text-[#1c2733] placeholder:text-[#727e8c] text-sm focus:outline-none focus:border-[#1c2733] focus:ring-2 focus:ring-[#1c2733]/10 transition-all';
  const selectClass = `${fieldClass} appearance-none cursor-pointer`;

  return (
    <section
      className="relative overflow-hidden border-y border-[#d8d2c6]"
      id="contact"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">

        {/* ── LEFT: Navy info panel ── */}
        <div className="relative bg-[#1c2733] flex flex-col justify-center px-10 py-16 lg:py-20 overflow-hidden">
          {/* Subtle cream-tinted glow matching banner */}
          <div className="absolute -top-32 -start-32 w-80 h-80 bg-[#f4f0e8]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -end-20 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-md">
            <span className="text-[0.65rem] font-bold tracking-[0.25em] text-[#727e8c] uppercase mb-4 block">
              {t(lang, 'تواصل معنا', 'Get In Touch')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white uppercase tracking-wide leading-tight mb-5">
              {t(lang, 'اطلب\nاستشارة', 'Request a\nConsultation')}
            </h2>
            <p className="text-[#727e8c] text-xs leading-relaxed mb-10 max-w-xs">
              {t(
                lang,
                'اترك بياناتك وسنتواصل معك قريباً. نلتزم بالرد بسرعة على كل استفساراتكم.',
                "Leave your details and we'll be in touch shortly. We're committed to responding promptly to every query."
              )}
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-5">
              {[
                { icon: '✆', labelAr: 'اتصل بنا', labelEn: 'Call us', valueAr: '+٢٠ ١١١ ٢٠٤ ٢٠٩٨', valueEn: '+20 111 204 2098', href: 'tel:+201112042098' },
                { icon: '✉', labelAr: 'البريد الإلكتروني', labelEn: 'Email', valueAr: 'info@sherifadvisory.com', valueEn: 'info@sherifadvisory.com', href: 'mailto:info@sherifadvisory.com' },
                { icon: '⌖', labelAr: 'المقر الرئيسي', labelEn: 'Headquarters', valueAr: 'القاهرة الجديدة، مصر', valueEn: 'New Cairo, Cairo, Egypt', href: undefined },
              ].map((item) => (
                <div key={item.labelEn} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full border border-brand-gold/40 flex items-center justify-center shrink-0">
                    <span className="text-brand-gold text-sm">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-[0.6rem] text-[#4a5664] uppercase tracking-wider mb-0.5">
                      {t(lang, item.labelAr, item.labelEn)}
                    </p>
                    {item.href ? (
                      <a href={item.href} className="text-white text-sm hover:text-brand-gold transition-colors" dir={item.labelEn === 'Call us' ? 'ltr' : undefined}>
                        {t(lang, item.valueAr, item.valueEn)}
                      </a>
                    ) : (
                      <p className="text-white text-sm">{t(lang, item.valueAr, item.valueEn)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider line — matches banner style */}
            <div className="w-10 h-[1.5px] bg-brand-gold mt-10" />
          </div>
        </div>

        {/* ── RIGHT: Cream form panel ── */}
        <div className="bg-[#f4f0e8] flex flex-col justify-center px-8 py-16 lg:py-20">
          <div className="max-w-lg w-full mx-auto">
            <h3 className="font-serif text-2xl font-bold text-[#1c2733] uppercase tracking-wide mb-1">
              {t(lang, 'أرسل لنا رسالة', 'Send us a message')}
            </h3>
            <p className="text-xs text-[#727e8c] tracking-wider uppercase mb-6">
              {t(lang, 'جميع الحقول المعلّمة بـ * إلزامية', 'All fields marked * are required')}
            </p>

            {success ? (
              <div className="flex flex-col items-center text-center gap-4 py-10">
                <div className="w-14 h-14 rounded-full bg-white border border-[#d8d2c6] flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-[#1c2733]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1c2733]">
                  {t(lang, 'تم الإرسال', 'Message Sent')}
                </h3>
                <p className="text-sm text-[#4a5664]">
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
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder={t(lang, 'الاسم الكامل*', 'Full Name*')} maxLength={100} className={fieldClass} />
                  <div className="flex items-stretch bg-white border border-[#d8d2c6] rounded-lg overflow-hidden focus-within:border-[#1c2733] focus-within:ring-2 focus-within:ring-[#1c2733]/10 transition-all">
                    <select value={dialCode} onChange={(e) => setDialCode(e.target.value)}
                      className="bg-[#ede9e1] px-3 py-3 text-sm text-[#1c2733] border-e border-[#d8d2c6] focus:outline-none cursor-pointer"
                      aria-label={t(lang, 'رمز الدولة', 'Country code')}>
                      {DIAL_CODES.map((d) => <option key={d.code} value={d.dial}>{d.code} {d.dial}</option>)}
                    </select>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder={t(lang, 'الهاتف', 'Phone')} maxLength={30}
                      className="flex-1 px-4 py-3 bg-transparent text-sm text-[#1c2733] placeholder:text-[#727e8c] focus:outline-none" />
                  </div>
                </div>

                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(lang, 'البريد الإلكتروني*', 'Email*')} maxLength={254} className={fieldClass} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select value={businessActivity} onChange={(e) => setBusinessActivity(e.target.value)}
                    className={`${selectClass} ${businessActivity ? 'text-[#1c2733]' : 'text-[#727e8c]'}`}>
                    <option value="" disabled>{t(lang, 'نشاط العمل*', 'Business Activity*')}</option>
                    {BUSINESS_ACTIVITIES.map((o) => <option key={o.value} value={o.value}>{t(lang, o.labelAr, o.labelEn)}</option>)}
                  </select>
                  <select value={country} onChange={(e) => setCountry(e.target.value)}
                    className={`${selectClass} ${country ? 'text-[#1c2733]' : 'text-[#727e8c]'}`}>
                    <option value="" disabled>{t(lang, 'أقيم في...*', 'I live in...*')}</option>
                    {COUNTRIES.map((o) => <option key={o.value} value={o.value}>{t(lang, o.labelAr, o.labelEn)}</option>)}
                  </select>
                </div>

                <select value={helpWith} onChange={(e) => setHelpWith(e.target.value)}
                  className={`${selectClass} ${helpWith ? 'text-[#1c2733]' : 'text-[#727e8c]'}`}>
                  <option value="" disabled>{t(lang, 'كيف يمكننا مساعدتك؟*', 'What Can We Help You With?*')}</option>
                  {services.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
                  <option value="Other">{t(lang, 'أخرى', 'Other')}</option>
                </select>

                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder={t(lang, 'رسالتك (اختياري)', 'Your Message (optional)')}
                  maxLength={2000} rows={4}
                  className={`${fieldClass} rounded-xl resize-none`} />

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#d8d2c6] text-[#1c2733] focus:ring-[#1c2733]/30 cursor-pointer" />
                  <span className="text-xs text-[#4a5664] leading-5">
                    {t(lang, 'أؤكد أنني قرأت وفهمت الشروط وسياسة الخصوصية وأوافق على جمع ومعالجة بياناتي. ',
                      'I confirm that I have read and understood the Terms and Privacy Policy and consent to the collection and processing of my data. ')}
                    <Link href="/terms" className="text-[#1c2733] underline hover:text-brand-gold">{t(lang, 'الشروط', 'Terms')}</Link>
                    {' · '}
                    <Link href="/privacy" className="text-[#1c2733] underline hover:text-brand-gold">{t(lang, 'الخصوصية', 'Privacy')}</Link>
                  </span>
                </label>

                {/* Submit — same pill style as banner CTA */}
                <div className="pt-1">
                  <button type="submit" disabled={submitting}
                    className="border-[#1c2733] border group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-xs font-bold uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed">
                    <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-[#1c2733] transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                    <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-[#1c2733] text-white flex-shrink-0">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-base">→</span>}
                    </span>
                    <span className="relative z-10 text-[#1c2733] transition-colors duration-300 group-hover:text-white">
                      {submitting ? t(lang, 'جاري الإرسال...', 'Submitting...') : t(lang, 'إرسال الطلب', 'Submit Request')}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
