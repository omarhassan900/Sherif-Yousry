'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Play, XCircle, ArrowRight } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';
import { ScrollProgress } from '@/components/effects/ScrollProgress';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const navItems = [
  { href: '/#home', labelAr: 'الرئيسية', labelEn: 'HOME' },
  { href: '/about', labelAr: 'من نحن', labelEn: 'ABOUT US' },
  { href: '/#services', labelAr: 'الخدمات', labelEn: 'SERVICES' },
  { href: '/industries', labelAr: 'القطاعات', labelEn: 'INDUSTRIES' },
  { href: '/knowledge', labelAr: 'الرؤى', labelEn: 'INSIGHTS' },
  { href: '/#digital', labelAr: 'التجربة الرقمية', labelEn: 'DIGITAL EXPERIENCE' },
  { href: '/contact', labelAr: 'تواصل معنا', labelEn: 'CONTACT' },
];

export function Hero() {
  const [lang, setLang] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // ✅ New state for the video modal
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const detectedLang = getClientLanguage();
    setLang(detectedLang);
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Close modal when pressing 'Esc' key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVideoOpen(false);
    };
    if (isVideoOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isVideoOpen]);

  // YouTube embed URL. Use the privacy-friendly nocookie domain and the
  // /embed/ form (required to play inside an iframe). A plain /watch?v= URL
  // is blocked by YouTube when embedded. No autoplay so the browser doesn't
  // block/blank the frame — the user presses play.
  const videoUrl = "https://www.youtube-nocookie.com/embed/GYBuD3JpxOI?rel=0"; 

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <ScrollProgress />
      
      {/* Background Image — direction-aware. In LTR it sits on the right and
          fades to the left; in RTL (Arabic) it mirrors, sits on the left, and
          fades to the right so it stays behind the text and off the content. */}
      <div
        className={`absolute inset-y-0 w-full md:w-[83.333%] lg:w-[83.333%] bg-cover bg-no-repeat ${
          lang === 'ar' ? 'left-0' : 'right-0'
        }`}
        style={{
          backgroundImage: 'url("/images/bg.jpeg")',
          backgroundPosition: lang === 'ar' ? 'left center' : 'right center',
          // Mirror the image in Arabic. The flip also reverses the mask below,
          // so the fade correctly points toward the text side in each language.
          transform: lang === 'ar' ? 'scaleX(-1)' : 'none',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 30%, #000 60%, #000 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 30%, #000 60%, #000 100%)',
        }}
      />

      {/* Soft bottom fade for polish */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030a12]/45 via-transparent to-transparent" />

    
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 font-mono text-sm tracking-[0.3em] text-brand-gold" style={{ animation: 'fadeInRight 0.8s ease 0.4s both' }}>
              {t(lang, 'الناس • الرؤى • الفرص', 'PEOPLE • INSIGHT • OPPORTUNITY')}
            </div>

            <h1 className="font-serif text-white leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', animation: 'fadeInUp 0.8s ease 0.6s both', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {t(lang, 'حيث تخلق الخبرة', 'WHERE EXPERTISE')}<br />
              <span className="text-brand-gold">{t(lang, 'القيمة.', 'CREATES VALUE.')}</span>
            </h1>

            <p className="text-gray-300 text-lg max-w-xl leading-relaxed" style={{ animation: 'fadeInUp 0.8s ease 0.8s both', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {t(lang, 'خدمات استشارية وإدارية متكاملة لغد أكثر مرونة.', 'Integrated Advisory & Business Management Services for a more resilient tomorrow.')}
            </p>

            <div className="flex flex-wrap gap-4" style={{ animation: 'fadeInUp 0.8s ease 1s both' }}>
              <Link href="/about#approach" className="inline-flex items-center gap-3 bg-[#f7f3e9] text-[#030a12] pl-3 pr-8 py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-white transition-all duration-300 group">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#030a12] text-[#f7f3e9] transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </span>
                {t(lang, 'استكشف نهجنا', 'EXPLORE OUR APPROACH')}
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-3 border border-white/30 text-white pl-3 pr-8 py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-white/10 hover:border-white transition-all duration-300 group">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#030a12] transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </span>
                {t(lang, 'ابدأ محادثة', 'START A CONVERSATION')}
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-4" style={{ animation: 'fadeInUp 0.8s ease 1.2s both' }}>
              <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
              <span className="font-mono text-gray-400 text-xs tracking-[0.15em]">{t(lang, 'مصر · العاصمة الإدارية الجديدة', 'EGYPT — NEW ADMINISTRATIVE CAPITAL')}</span>
            </div>
          </div>

          {/* Right Features */}
          <div className=" lg:flex flex-col justify-end items-end space-y-6">
            <div className="border-l-2 border-brand-gold/50 pl-8 space-y-4" style={{ animation: 'fadeInRight 0.8s ease 1s both' }}>
              <div className="text-right">
                <h3 className="text-white text-sm font-bold tracking-[0.2em] uppercase mb-2">{t(lang, 'خبرة محلية', 'LOCAL EXPERTISE')}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{t(lang, 'فهم عميق للأسواق المحلية', 'Deep understanding of local markets')}</p>
              </div>
              <div className="text-right">
                <h3 className="text-white text-sm font-bold tracking-[0.2em] uppercase mb-2">{t(lang, 'منظور دولي', 'INTERNATIONAL PERSPECTIVE')}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{t(lang, 'رؤية عالمية لأعمالك', 'Global vision for your business')}</p>
              </div>
              <div className="text-right">
                <h3 className="text-white text-sm font-bold tracking-[0.2em] uppercase mb-2">{t(lang, 'أثر دائم', 'LASTING IMPACT')}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{t(lang, 'نتائج مستدامة وطويلة الأمد', 'Sustainable and long-term results')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ WATCH OUR STORY BUTTON — pinned to the bottom-right of the hero */}
      <button
        onClick={() => setIsVideoOpen(true)}
        className="absolute bottom-10 right-24 lg:right-32 z-20 flex items-center gap-4 group cursor-pointer"
        style={{ animation: 'fadeInRight 0.8s ease 1.2s both' }}
      >
        <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-brand-gold group-hover:bg-brand-gold/10 transition-all duration-300">
          <Play className="w-5 h-5 text-white ml-1 group-hover:text-brand-gold transition-colors" fill="currentColor" />
        </div>
        <div className="text-left leading-tight">
          <p className="text-white text-xs font-bold tracking-[0.15em] uppercase">{t(lang, 'شاهد', 'WATCH')}</p>
          <p className="text-white text-xs font-bold tracking-[0.15em] uppercase">{t(lang, 'قصتنا', 'OUR STORY')}</p>
        </div>
      </button>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60" style={{ animation: 'fadeInUp 0.8s ease 1.4s both' }}>
        <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">{t(lang, 'استكشف', 'SCROLL')}</span>
        <div className="w-px h-12 bg-gradient-to-b from-brand-gold to-transparent animate-pulse" />
      </div>

      {/* ✅ VIDEO MODAL / DIALOG */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
          onClick={() => setIsVideoOpen(false)} // Close when clicking outside
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close video"
          >
            <XCircle className="w-10 h-10" />
          </button>

          {/* Video Container (16:9 Aspect Ratio) */}
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the video itself
          >
            <iframe
              key={videoUrl}
              src={videoUrl}
              title="Sherif Yousry Advisory Story"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            {/* Fallback: if the video can't be embedded, open it on YouTube */}
            <a
              href="https://www.youtube.com/watch?v=GYBuD3JpxOI"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 z-10 text-[11px] text-white/70 hover:text-white underline"
            >
              {t(lang, 'مشاهدة على يوتيوب', 'Watch on YouTube')}
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </section>
  );
}