'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function MarketsBanner() {
    const [lang, setLang] = useState<Language>('en');

    useEffect(() => {
        setLang(getClientLanguage());
    }, []);

    return (
        <section
            className="relative w-full mx-auto overflow-hidden border-y border-black/5 bg-[#f4f0e8]"
            id="markets"
        >
            {/* ✅ Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/7a5e567c-14fb-4123-9261-1b7a90ed3aee.jpeg"
                    alt="Global markets connection map showing Europe, MENA, and Egypt"
                    fill
                    className="object-contain object-center opacity-90" // Increased opacity for clarity
                    priority
                />
                
                {/* Gradient Fade: Hides the map behind the left text for readability */}
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#f4f0e8] via-[#f4f0e8]/80 to-transparent z-10" />
                
                {/* Fade on the right edge — wider, multi-stop blend so the map
                    dissolves smoothly into the cream background (no hard seam). */}
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#f4f0e8] via-[#f4f0e8]/80 to-transparent z-10" />
            </div>

            {/* ✅ Content Layer */}
            <div className="relative z-20 grid grid-cols-1 lg:grid-cols-[1.2fr_1.5fr_0.8fr] items-center gap-12 lg:gap-8 px-8 lg:px-16 py-10 lg:py-10">
                
                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-4 items-start text-left rtl:text-right">
                    <span className="text-[0.65rem] font-bold tracking-[0.25em] text-[#727e8c] uppercase">
                        {t(lang, 'رؤية أوسع', 'A Broader Perspective')}
                    </span>

                    <h2 className="font-serif text-2xl md:text-3xl font-bold leading-[1.15] text-[#1c2733] uppercase tracking-wide">
                        {t(lang, 'ربط الأسواق.\nصنع الفرص.', 'Connecting Markets.\nCreating Opportunity.')}
                    </h2>

                    <p className="text-xs leading-relaxed text-[#4a5664] max-w-[280px]">
                        {t(
                            lang,
                            'ندعم المستثمرين والشركات في مصر ومنطقة الشرق الأوسط وشمال أفريقيا للوصول إلى الأسواق الأوروبية، من خلال الخبرة المحلية والمنظور الدولي.',
                            'Supporting investors and businesses in Egypt and across the MENA region, with access to European markets, through local expertise and international perspective.'
                        )}
                    </p>

                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 border border-[#1c2733] text-[#1c2733] text-[0.65rem] font-bold tracking-[0.15em] uppercase hover:bg-[#1c2733] hover:text-white transition-all duration-300 group"
                    >
                        {t(lang, 'نهجنا', 'Our Approach')}
                        <span className="text-base transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">
                            &rarr;
                        </span>
                    </Link>
                </div>

                {/* MIDDLE COLUMN (Spacer) */}
                <div className="hidden lg:block"></div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col justify-center h-full lg:border-l rtl:lg:border-l-0 rtl:lg:border-r border-[#d8d2c6] lg:pl-8 rtl:lg:pl-0 rtl:lg:pr-8 py-8 lg:py-0">
                    <h3 className="text-xs md:text-sm font-bold leading-snug text-[#1c2733] uppercase tracking-wider whitespace-pre-line">
                        {t(lang, 'أسواق مختلفة.\nغدٌ أقوى.', 'Different Markets.\nA Stronger Tomorrow.')}
                    </h3>
                    <div className="w-8 h-[1.5px] bg-[#1c2733] mt-4 rtl:ml-auto" />
                </div>
            </div>
        </section>
    );
}