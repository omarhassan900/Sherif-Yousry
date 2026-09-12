'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const features = [
  { ar: 'الوضوح', en: 'CLARITY' },
  { ar: 'الخبرة', en: 'EXPERTISE' },
  { ar: 'الالتزام', en: 'COMMITMENT' },
  { ar: 'أثر دائم', en: 'LASTING IMPACT' },
];

export function CTABanner() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  return (
    <section 
      className="relative w-full flex flex-col lg:flex-row items-start lg:items-center justify-between px-6 lg:px-[60px] py-12 lg:py-10 text-white gap-10 lg:gap-0 min-h-auto lg:min-h-[280px]"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(2, 10, 20, 0.95) 20%, rgba(2, 10, 20, 0.4) 60%, rgba(2, 10, 20, 0.95) 100%), url('/images/bg.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* LEFT COLUMN */}
      <div className="max-w-[500px] z-10 w-full">
        <span className="text-[11px] tracking-[2px] uppercase text-gray-300 block mb-3">
          {t(lang, 'ما التالي؟', "WHAT'S NEXT?")}
        </span>
        
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[36px] font-normal leading-tight text-white mb-3">
          {t(lang, 'لنبنِ ما هو قادم.', "Let's build what's next.")}
        </h2>
        
        <p className="text-sm md:text-base text-gray-400 mb-7 max-w-md">
          {t(lang, 'أخبرنا بما تسعى لتحقيقه. سنساعدك في الوصول إليه.', "Tell us what you're trying to achieve. We'll help you get there.")}
        </p>
        
        <Link 
          href="/contact" 
          className="inline-flex items-center gap-2.5 bg-[#f7f3e9] text-gray-900 px-6 py-3 text-[11px] font-bold tracking-[1.5px] uppercase hover:bg-[#eae3d2] transition-colors duration-200 group"
        >
          {t(lang, 'ابدأ محادثة', 'START A CONVERSATION')}
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
        </Link>
      </div>

      {/* RIGHT COLUMN */}
      <div className={`relative flex flex-col gap-3 z-10 border-t lg:border-t-0 lg:border-l border-white/30 pt-8 lg:pt-0 lg:pl-[30px] rtl:lg:border-l-0 rtl:lg:border-r rtl:lg:pl-0 rtl:lg:pr-[30px] w-full lg:w-auto`}>
        <ul className="flex flex-col gap-2 list-none">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className="text-[12px] tracking-[2px] uppercase text-gray-200 font-semibold"
            >
              {t(lang, feature.ar, feature.en)}
            </li>
          ))}
        </ul>
        
        <div className="w-[30px] h-[2px] bg-white/40 mt-2.5" />
      </div>
    </section>
  );
}