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
            className="relative w-full mx-auto overflow-hidden grid grid-cols-1 lg:grid-cols-[300px_1fr_220px] rtl:lg:grid-cols-[220px_1fr_300px] items-center gap-8 lg:gap-6 p-8 lg:p-14 border-y border-black/5"
            style={{ backgroundColor: '#f4f0e8' }}
            id="markets"
        >
            {/* LEFT COLUMN */}
            <div className="z-10 flex flex-col gap-4 items-start text-left rtl:text-right">
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

            {/* MIDDLE COLUMN — real map backdrop + crisp vector overlay */}
            <div className="relative w-full h-full min-h-[280px] flex justify-center items-center">
                <div className="relative w-full h-full aspect-[1436/736]">
                    {/* Markets world map fills the middle area */}
                    <Image
                        src="/images/markets-map.jpeg"
                        alt={t(lang, 'خريطة الأسواق العالمية', 'Global markets map')}
                        fill
                        quality={100}
                        sizes="(max-width: 1024px) 100vw, 700px"
                        className="object-contain object-center select-none pointer-events-none"
                    />
                    {/* Soft edge fade so the map blends into the section */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(ellipse 80% 90% at 50% 50%, rgba(244,240,232,0) 65%, rgba(244,240,232,0.75) 100%)',
                        }}
                    />
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="z-10 flex flex-col justify-center h-full lg:border-l rtl:lg:border-l-0 rtl:lg:border-r border-[#d8d2c6] lg:pl-6 rtl:lg:pl-0 rtl:lg:pr-6">
                <h3 className="text-sm font-bold leading-snug text-[#1c2733] uppercase tracking-wider whitespace-pre-line">
                    {t(lang, 'أسواق مختلفة.\nغدٌ أقوى.', 'Different Markets.\nA Stronger Tomorrow.')}
                </h3>
                <div className="w-8 h-0.5 bg-[#1c2733] mt-4 rtl:ml-auto" />
            </div>
        </section>
    );
}
