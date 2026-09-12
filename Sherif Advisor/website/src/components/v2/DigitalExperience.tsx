'use client';

import { useState, useEffect } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';
import { Sparkles, Bell, CheckCircle2, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const highlights = [
  { icon: ShieldCheck, labelAr: 'آمن بالكامل', labelEn: 'Fully Secure' },
  { icon: Zap, labelAr: 'وصول فوري', labelEn: 'Instant Access' },
  { icon: Smartphone, labelAr: 'على كل الأجهزة', labelEn: 'Any Device' },
];

export function DigitalExperience() {
  const [lang, setLang] = useState<Language>('en');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // NOTE: hook this up to your backend / mailing list later.
    setSubscribed(true);
  };

  return (
    <section className="w-full" id="digital">
      <div
        className="relative mx-auto overflow-hidden rounded-sm bg-gradient-to-br from-[#020d1c] via-[#051d38] to-[#020c18] p-6 lg:p-8 shadow-2xl"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Decorative glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 80% 20%, rgba(191,161,74,0.12) 0%, rgba(3,10,18,0) 70%)',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* LEFT: announcement */}
          <div className={`flex flex-col gap-4 ${lang === 'ar' ? 'items-start text-right' : 'items-start text-left'}`}>
            {/* Coming soon badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-4 py-1.5 text-[0.65rem] font-bold tracking-[2px] uppercase text-brand-gold">
              <Sparkles className="w-3.5 h-3.5" />
              {t(lang, 'قريباً', 'Coming Soon')}
            </span>

            <div>
              <span className="text-[0.7rem] font-bold tracking-[2.2px] text-[#8ea3b8] uppercase block mb-2">
                {t(lang, 'التطبيق الجديد للعملاء', 'The New Client App')}
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold leading-tight text-white uppercase tracking-wide">
                {t(lang, 'أعمالك. متصلة.', 'Your Business. Connected.')}
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-[#9cb1c9] font-light max-w-md">
              {t(
                lang,
                'نطلق قريباً تطبيقنا الرقمي الجديد — مساحة آمنة وسلسة تجمع مهامك ومستنداتك وتقاريرك ومواعيدك الضريبية في مكان واحد. كن أول من يعرف.',
                'We’re launching our new digital app soon — a secure, seamless space that brings your engagements, documents, reports, and tax deadlines together in one place. Be the first to know.'
              )}
            </p>

            {/* Notify me */}
            {subscribed ? (
              <div className="flex items-center gap-2.5 mt-2 text-sm text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                {t(lang, 'شكراً لك! سنعلمك فور الإطلاق.', "You're on the list! We'll notify you at launch.")}
              </div>
            ) : (
              <form onSubmit={handleNotify} className="w-full max-w-md mt-2">
                <div className="flex items-stretch gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm p-1.5 focus-within:border-brand-gold/50 transition-colors">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t(lang, 'أدخل بريدك الإلكتروني', 'Enter your email')}
                    className="flex-1 bg-transparent px-4 text-sm text-white placeholder:text-[#7b92a8] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2.5 text-[0.65rem] font-bold tracking-[1.5px] uppercase text-[#031427] hover:bg-white transition-colors duration-300 whitespace-nowrap"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {t(lang, 'أعلمني', 'Notify Me')}
                  </button>
                </div>
              </form>
            )}

            {/* Highlights */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#a0b3c6]">
                    <Icon className="w-4 h-4 text-brand-gold" />
                    {t(lang, h.labelAr, h.labelEn)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: device preview with a "Coming Soon" overlay */}
          <div className="relative flex items-end justify-center gap-3">
            {/* Coming Soon overlay across the whole preview */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-xl bg-[#020c18]/55 backdrop-blur-[2px] pointer-events-none">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.15em] text-white text-center drop-shadow-lg">
                {t(lang, 'قريباً', 'Coming Soon')}
              </span>
              <span className="mt-2 h-0.5 w-12 bg-brand-gold" />
            </div>

            {/* Laptop Frame */}
            <div className="w-full bg-[#111] rounded-t-lg border-[3px] border-[#222] shadow-xl overflow-hidden">
              <div className="bg-[#f4f6f9] grid grid-cols-[110px_1fr] min-h-[210px]">
                {/* Laptop Sidebar */}
                <div className="bg-[#031326] p-3 flex flex-col gap-2">
                  <div className="font-serif text-white text-sm font-bold mb-2 pl-1.5">
                    <Image
                      src="/images/logo.png"
                      alt={t(lang, 'لوحة التحكم الرقمية', 'Digital Dashboard Mockup')}
                      width={600}
                      height={350}
                      className="w-full h-auto object-contain drop-shadow-2xl"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    {['Dashboard', 'Engagements', 'Documents', 'Reports'].map((nav, i) => (
                      <div key={nav} className={`text-[0.55rem] px-1.5 py-1 rounded flex items-center gap-1 ${i === 0 ? 'bg-white/12 text-white' : 'text-[#7b92a8]'}`}>
                        {nav}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Laptop Main Dashboard */}
                <div className="p-3 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-[0.75rem] text-[#111] font-bold">{t(lang, 'مرحباً بعودتك', 'Welcome back')}</h3>
                      <p className="text-[0.55rem] text-[#777]">{t(lang, 'إليك ما يحدث اليوم.', "Here's what's happening today.")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { num: '5', label: 'Active Engagements', color: 'bg-green-50 text-green-600', arLabel: 'مهام نشطة' },
                      { num: '2', label: 'Pending Requests', color: 'bg-orange-50 text-orange-600', arLabel: 'طلبات معلقة' },
                      { num: '3', label: 'Upcoming Deadlines', color: 'bg-blue-50 text-blue-600', arLabel: 'مواعيد نهائية' },
                      { num: '12', label: 'Recent Documents', color: 'bg-purple-50 text-purple-600', arLabel: 'مستندات حديثة' },
                    ].map((card, i) => (
                      <div key={i} className="bg-white rounded px-2 py-1.5 shadow-sm flex items-center gap-2">
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-[0.6rem] font-bold ${card.color}`}>
                          {card.num}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.7rem] font-bold text-[#111] leading-none">{card.num}</span>
                          <span className="text-[0.45rem] text-[#666]">{t(lang, card.arLabel, card.label)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Phone Mockup */}
            <div className="hidden sm:flex w-[90px] h-[175px] bg-[#020a14] rounded-xl border-2 border-[#222] shadow-xl flex-col items-center justify-center p-2 text-center relative">
              <div className="absolute top-1 w-7 h-1 bg-[#222] rounded-full" />
              <div className="text-2xl mb-3">
                <Image
                  src="/images/logo.png"
                  alt={t(lang, 'لوحة التحكم الرقمية', 'Digital Dashboard Mockup')}
                  width={600}
                  height={350}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>
              <div className="text-[0.55rem] text-white font-semibold leading-tight">
                {t(lang, 'استشاراتك', 'Your Advisory')}<br />
                {t(lang, 'في كل مكان', 'Anywhere')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
