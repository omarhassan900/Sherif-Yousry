'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';
import { FileText, FileCheck, BarChart2, Calendar, MessageSquare, Mail } from 'lucide-react';
import Image from 'next/image';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const menuItems = [
    { id: 'engagements', icon: FileText, labelAr: 'المهام', labelEn: 'Engagements' },
    { id: 'documents', icon: FileCheck, labelAr: 'المستندات', labelEn: 'Documents' },
    { id: 'reports', icon: BarChart2, labelAr: 'التقارير', labelEn: 'Reports' },
    { id: 'tax', icon: Calendar, labelAr: 'التقويم الضريبي', labelEn: 'Tax Calendar' },
    { id: 'requests', icon: MessageSquare, labelAr: 'الطلبات', labelEn: 'Requests' },
    { id: 'messages', icon: Mail, labelAr: 'الرسائل', labelEn: 'Messages' },
];

export function DigitalExperience() {
    const [lang, setLang] = useState<Language>('en');
    const [activeMenu, setActiveMenu] = useState('engagements');

    useEffect(() => {
        setLang(getClientLanguage());
    }, []);

    return (
        <section className="w-full">
            <div className=" mx-auto bg-gradient-to-br from-[#020d1c] via-[#051d38] to-[#020c18] rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[340px_180px_1fr_180px] items-center p-6 lg:p-10 gap-8 lg:gap-5 shadow-2xl relative">

                {/* SECTION 1: LEFT HERO TEXT */}
                <div className={`flex flex-col gap-3 z-10 ${lang === 'ar' ? 'items-start text-right' : 'items-start text-left'}`}>
                    <span className="text-[0.7rem] font-bold tracking-[2.2px] text-[#8ea3b8] uppercase">
                        {t(lang, 'تجربة رقمية', 'Digital Experience')}
                    </span>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold leading-tight text-white uppercase tracking-wide">
                        {t(lang, 'أعمالك.', 'Your Business.')}<br />
                        {t(lang, 'متصلة.', 'Connected.')}
                    </h2>
                    <p className="text-[0.78rem] leading-relaxed text-[#9cb1c9] font-light max-w-xs">
                        {t(
                            lang,
                            'تجربة رقمية آمنة وسلسة لعملائنا ومستثمرينا.',
                            'A secure and seamless digital experience for our clients and investors.'
                        )}
                    </p>
                    <Link
                        href="/portal"
                        className="inline-flex items-center gap-2.5 mt-2 px-4 py-2 border border-white/40 text-white text-[0.65rem] font-bold tracking-[1.8px] uppercase hover:bg-white hover:text-[#031427] hover:border-white transition-all duration-300 w-fit group"
                    >
                        {t(lang, 'استكشف التجربة الرقمية', 'Explore Digital Experience')}
                        <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">→</span>
                    </Link>
                </div>

                {/* SECTION 2: FEATURES MENU */}
                <div className={`flex flex-col gap-3 ${lang === 'ar' ? 'lg:border-l-0 lg:border-r' : ''} lg:pl-5 lg:border-l border-white/10`}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMenu === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveMenu(item.id)}
                                className={`flex items-center gap-2.5 text-[0.72rem] font-medium transition-all duration-200 cursor-pointer w-fit
                  ${isActive ? 'text-white translate-x-1 rtl:-translate-x-1' : 'text-[#a0b3c6] hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1'}`}
                            >
                                <Icon className="w-4 h-4 stroke-current stroke-[1.8]" />
                                {t(lang, item.labelAr, item.labelEn)}
                            </button>
                        );
                    })}
                </div>

                {/* SECTION 3: MOCKUP DEVICES (Hidden on small mobile for clean layout, visible on md+) */}
                <div className=" md:flex items-end justify-center gap-3 relative">
                    {/* Laptop Frame */}
                    <div className="w-full  bg-[#111] rounded-t-lg border-[3px] border-[#222] shadow-xl overflow-hidden">
                        <div className="bg-[#f4f6f9] grid grid-cols-[110px_1fr] min-h-[210px]">
                            {/* Laptop Sidebar */}
                            <div className="bg-[#031326] p-3 flex flex-col gap-2">
                                <div className="font-serif text-white text-sm font-bold mb-2 pl-1.5"><Image
                                    src="/images/logo.png"
                                    alt={t(lang, 'لوحة التحكم الرقمية', 'Digital Dashboard Mockup')}
                                    width={600}
                                    height={350}
                                    className="w-full h-auto object-contain drop-shadow-2xl"
                                    priority
                                /></div>
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
                    <div className="w-[90px] h-[175px] bg-[#020a14] rounded-xl border-2 border-[#222] shadow-xl flex flex-col items-center justify-center p-2 text-center relative">
                        <div className="absolute top-1 w-7 h-1 bg-[#222] rounded-full" />
                        <div className="text-2xl mb-3"><Image
                                    src="/images/logo.png"
                                    alt={t(lang, 'لوحة التحكم الرقمية', 'Digital Dashboard Mockup')}
                                    width={600}
                                    height={350}
                                    className="w-full h-auto object-contain drop-shadow-2xl"
                                    priority
                                /></div>
                        <div className="text-[0.55rem] text-white font-semibold leading-tight">
                            {t(lang, 'استشاراتك', 'Your Advisory')}<br />
                            {t(lang, 'في كل مكان', 'Anywhere')}
                        </div>
                    </div>
                </div>

                {/* SECTION 4: RIGHT TAGLINE */}
                <div className={`flex flex-col gap-1.5 ${lang === 'ar' ? 'items-start' : 'items-start'}`}>
                    <div className="text-[0.72rem] font-bold tracking-wider text-white leading-tight uppercase whitespace-pre-line">
                        {t(lang, 'آمن.\nبسيط.\nشفاف.\nدائماً.\nفي كل مكان.', 'Secure.\nSimple.\nTransparent.\nAnytime.\nAnywhere.')}
                    </div>
                    <div className={`w-7 h-0.5 bg-white mt-2 ${lang === 'ar' ? 'mr-auto' : ''}`} />
                </div>

            </div>
        </section>
    );
}