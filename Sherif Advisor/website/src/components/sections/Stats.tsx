'use client';

import { useState, useEffect, useRef } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

const stats = [
  { value: 9,    suffix: '',   labelAr: 'مجالات ممارسة',                         labelEn: 'Practice Areas' },
  { value: 12,   suffix: '',   labelAr: 'قطاعاً مغطى',                            labelEn: 'Sectors Covered' },
  { value: 3,    suffix: '',   labelAr: 'أسواق (مصر / السعودية / الإمارات)',       labelEn: 'Markets (Egypt / KSA / UAE)' },
  { value: 24,   suffix: 'h', labelAr: 'ساعة التزام بالرد',                       labelEn: 'Hour Response SLA' },
];

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (2000 / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [active, target]);
  return count;
}

function StatItem({ value, suffix, labelAr, labelEn, lang }: {
  value: number; suffix: string; labelAr: string; labelEn: string; lang: Language;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="px-8 py-10 border-l border-white/10 first:border-l-0 text-center group transition-all duration-300"
    >
      <div className="font-amiri text-brand-gold text-5xl mb-2 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(201,169,97,0.5)]">
        {count}{suffix}
      </div>
      <div className="font-mono text-text-secondary text-xs tracking-[0.05em]">
        {lang === 'ar' ? labelAr : labelEn}
      </div>
    </div>
  );
}

export function Stats() {
  const [lang, setLang] = useState<Language>('ar');
  useEffect(() => { setLang(getClientLanguage()); }, []);

  return (
    <section className="bg-brand-navy border-y border-brand-gold/20 relative overflow-hidden">
      {/* Shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,169,97,0.07), transparent)',
          animation: 'shimmer 3s infinite',
          left: '-100%',
        }}
      />
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 relative z-10">
        {stats.map((s) => (
          <StatItem key={s.labelEn} {...s} lang={lang} />
        ))}
      </div>
    </section>
  );
}
