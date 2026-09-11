'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function MarketsBanner() {
    const [lang, setLang] = useState<Language>('en');
    const [activeNode, setActiveNode] = useState<string | null>(null);

    // Set language on mount
    useState(() => {
        setLang(getClientLanguage());
    });

    return (
        <>
            {/* Custom Animations for SVG */}
            <style>{`
        @keyframes flowArc {
          0% { stroke-dashoffset: 128; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulseGlow {
          0% { r: 6px; opacity: 0.8; }
          50% { r: 16px; opacity: 0.15; }
          100% { r: 6px; opacity: 0.8; }
        }
        .animate-flow-arc {
          animation: flowArc 3s infinite linear;
        }
        .animate-pulse-glow {
          animation: pulseGlow 2.4s infinite ease-in-out;
          transform-origin: center;
        }
        
      `}</style>

            <section  style={{
        backgroundImage: 'url("/images/.png")', // Ensure this matches your public folder
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '62% 102%',
        backgroundColor: '#eeebe4',
      }}
            className="relative w-full mx-auto bg-[#f4f0e8] overflow-hidden grid grid-cols-1 lg:grid-cols-[320px_1fr_220px] rtl:lg:grid-cols-[220px_1fr_320px] items-center p-8 lg:p-12 border-y border-black/5 shadow-[0_12px_32px_rgba(0,0,0,0.05)]"
            id="markets"
      >
            {/* LEFT COLUMN */}
            <div className={`z-10 flex flex-col gap-4 ${lang === 'ar' ? 'items-start text-right' : 'items-start text-left'}`}>
                <span className="text-[0.72rem] font-bold tracking-[2.5px] text-[#727e8c] uppercase">
                    {t(lang, 'رؤية أوسع', 'A Broader Perspective')}
                </span>

                <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-[#1c2733] uppercase tracking-wide whitespace-pre-line">
                    {t(lang, 'ربط الأسواق.\nصنع الفرص.', 'Connecting Markets.\nCreating Opportunity.')}
                </h2>

                <p className="text-sm leading-relaxed text-[#4a5664] max-w-[290px]">
                    {t(
                        lang,
                        'ندعم المستثمرين والشركات في مصر ومنطقة الشرق الأوسط وشمال أفريقيا للوصول إلى الأسواق الأوروبية، من خلال الخبرة المحلية والمنظور الدولي.',
                        'Supporting investors and businesses in Egypt and across the MENA region, with access to European markets, through local expertise and international perspective.'
                    )}
                </p>

                <Link
                    href="/about"
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 border border-[#1c2733] text-[#1c2733] text-[0.7rem] font-bold tracking-wider uppercase hover:bg-[#1c2733] hover:text-white transition-all duration-300 group w-fit"
                >
                    {t(lang, 'نهجنا', 'Our Approach')}
                    <span className="text-base transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">
                        →
                    </span>
                </Link>
            </div>

            {/* MIDDLE COLUMN (SVG Map) */}
            <div className="relative w-full h-full min-h-[220px] flex justify-center items-center py-8 lg:py-0">

            </div>

            {/* RIGHT COLUMN */}
            <div className={`z-10 flex flex-col justify-center h-[60%] lg:h-auto lg:border-l rtl:lg:border-l-0 rtl:lg:border-r border-[#d8d2c6] ${lang === 'ar' ? 'lg:pr-6 rtl:lg:pl-0' : 'lg:pl-6'}`}>
                <h3 className="text-sm font-bold leading-snug text-[#1c2733] uppercase tracking-wider whitespace-pre-line">
                    {t(lang, 'أسواق مختلفة.\nغدٌ أقوى.', 'Different Markets.\nA Stronger Tomorrow.')}
                </h3>
                <div className={`w-8 h-0.5 bg-[#1c2733] mt-4 ${lang === 'ar' ? 'rtl:ml-0 rtl:mr-auto' : ''}`} />
            </div>

        </section >
    </>
  );
}