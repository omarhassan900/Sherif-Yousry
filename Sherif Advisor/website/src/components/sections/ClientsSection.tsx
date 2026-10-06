'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Hotel,
  Flame,
  Zap,
  Building2,
  Factory,
  Car,
  ShoppingCart,
  FileText,
  Shield,
  ChevronDown,
  ChevronUp,
  Mail,
} from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

// ─── Sector data ──────────────────────────────────────────────────────────────

interface Sector {
  labelEn: string;
  labelAr: string;
  icon: React.ElementType;
  /** Relative path inside /public/images — used as a background photo */
  image: string;
  clients: string[];
}

const SECTORS: Sector[] = [
  {
    labelEn: 'Hotels, Tourism & Entertainment',
    labelAr: 'الفنادق والسياحة والترفيه',
    icon: Hotel,
    image: '/images/bg__.jpeg',
    clients: [
      'Four Seasons Hotels & Resorts',
      'Savoy Sharm El Sheikh',
      'SOHO Square – Sharm El Sheikh',
      'Grand Oasis Resort',
      'International Sun for Tourism',
      'Travco Group',
      'Dream Park',
    ],
  },
  {
    labelEn: 'Oil, Gas & Drilling Services',
    labelAr: 'النفط والغاز وخدمات الحفر',
    icon: Flame,
    image: '/images/bg-2.jpeg',
    clients: ['ANOPC', 'Maersk Drilling', 'EGYDRILL'],
  },
  {
    labelEn: 'Energy, Utilities & Environmental Services',
    labelAr: 'الطاقة والمرافق والخدمات البيئية',
    icon: Zap,
    image: '/images/bg-3.jpeg',
    clients: ['TAQA Arabia', 'Sunrise Solar Power', 'AMA Arab Environment Company'],
  },
  {
    labelEn: 'Real Estate, Industrial Zones & Investment',
    labelAr: 'العقارات والمناطق الصناعية والاستثمار',
    icon: Building2,
    image: '/images/bg-4.jpeg',
    clients: [
      'Al-Futtaim Group',
      'City Edge Developments',
      'NAMAA – Real Estate Development & Investment Company',
      'TEDA Suez',
    ],
  },
  {
    labelEn: 'Industrial & Manufacturing',
    labelAr: 'الصناعة والتصنيع',
    icon: Factory,
    image: '/images/bg_.jpeg',
    clients: ['Egyptian Steel', 'Misr Glass Manufacturing Co.', 'GoldenTex'],
  },
  {
    labelEn: 'Automotive & Mobility',
    labelAr: 'السيارات والتنقل',
    icon: Car,
    image: '/images/bg___.jpeg',
    clients: ['Toyota Egypt', 'Honda'],
  },
  {
    labelEn: 'Consumer, Food & Distribution',
    labelAr: 'المستهلك والغذاء والتوزيع',
    icon: ShoppingCart,
    image: '/images/bg____.jpeg',
    clients: ['Savola Foods', 'Raya'],
  },
];

// ─── Legal disclaimer content ─────────────────────────────────────────────────

const DISCLAIMER_SUMMARY_EN =
  'The organizations listed are named solely to indicate that our professionals have participated in professional engagements with them in the course of their professional careers. Nothing in this section states or implies that any organization is, or has been, a client of Sherif Yousry Advisory.';

const DISCLAIMER_SUMMARY_AR =
  'تُذكر الجهات الواردة في هذا القسم لغرض وحيد هو بيان مشاركة أعضاء فريقنا في ارتباطات مهنية معها خلال مسيرتهم المهنية. ولا يعني أي مما ورد في هذا القسم أن أي جهة عميل حالي أو سابق لشريف يسري للاستشارات.';

const DISCLAIMER_FULL_EN = [
  {
    num: '1.',
    title: 'Purpose.',
    body: 'The organizations listed are named solely to indicate that our professionals have participated in professional engagements with them in the course of their professional careers. Nothing in this section states or implies that any organization is, or has been, a client of Sherif Yousry Consultancy Services and Business Management (Sherif Yousry Advisory), or that any partnership, agency, affiliation, sponsorship or endorsement exists, or that any engagement was undertaken by or on behalf of this firm.',
  },
  {
    num: '2.',
    title: 'No confidential information.',
    body: 'No information is disclosed beyond the fact of participation. The nature, scope, value, period and outcome of any engagement are not disclosed and shall not be inferred, and nothing in this section is made on behalf of, or with the authority of, any listed organization. No confidential or proprietary information of any current or former employer, or of any other third party, is used or disclosed.',
  },
  {
    num: '3.',
    title: 'Names.',
    body: 'Organizations are referred to by the names under which they were known at the time of the relevant engagement; such names may since have changed as a result of mergers, acquisitions or restructuring. Where a group name is used, the reference is to the relevant entity or operation in Egypt only, and not to the group as a whole. The list is not exhaustive and is presented in no particular order.',
  },
  {
    num: '4.',
    title: 'Intellectual property.',
    body: 'All names are the property of their respective owners and are referenced for identification purposes only. No logos, trademarks or brand marks are reproduced, and no licence or other right in any of them is claimed.',
  },
  {
    num: '5.',
    title: 'No reliance.',
    body: 'This section is provided for general information only and does not constitute an offer, a solicitation, or a representation as to the results of any future engagement. It is presented in good faith, is believed to be accurate at the date of publication, and may be amended or withdrawn at any time without notice. To the maximum extent permitted by law, no liability is accepted for any reliance placed on it.',
  },
  {
    num: '6.',
    title: 'Removal.',
    body: 'Any listed organization may request the removal of its name by writing to sherif@sherifyousry.com, and the reference will be removed without delay.',
  },
  {
    num: '7.',
    title: 'Language.',
    body: 'In the event of any inconsistency between the Arabic and English texts, the Arabic text shall prevail.',
  },
];

const DISCLAIMER_FULL_AR = [
  {
    num: '١.',
    title: 'الغرض:',
    body: 'تُذكر الجهات الواردة في هذا القسم لغرض وحيد هو بيان مشاركة أعضاء فريقنا في ارتباطات مهنية معها خلال مسيرتهم المهنية. ولا يعني أي مما ورد في هذا القسم أو يُفهم منه أن أي جهة عميل حالي أو سابق لـ «شريف يسري لخدمات الاستشارات وإدارة الأعمال»، أو وجود أي شراكة أو وكالة أو تبعية أو رعاية أو تأييد، أو أن أي ارتباط قد تم بمعرفته أو لحسابه.',
  },
  {
    num: '٢.',
    title: 'عدم الإفصاح عن معلومات سرية:',
    body: 'لا يُفصح عن أي معلومات بخلاف واقعة المشاركة، ولا يُفصح عن طبيعة أي ارتباط أو نطاقه أو قيمته أو مدته أو نتائجه، ولا يجوز استنتاج أي من ذلك، ولا يصدر أي مما ورد في هذا القسم باسم أي جهة مذكورة أو بتفويض منها. ولا تُستخدم أو يُفصح عن أي معلومات سرية أو خاصة بأي جهة عمل حالية أو سابقة أو بأي طرف آخر.',
  },
  {
    num: '٣.',
    title: 'الأسماء:',
    body: 'يُشار إلى الجهات بالأسماء التي كانت معروفة بها وقت الارتباط المعني، وقد تكون هذه الأسماء قد تغيرت لاحقًا نتيجة اندماج أو استحواذ أو إعادة هيكلة. وحيثما يُذكر اسم مجموعة، تنصرف الإشارة إلى الكيان أو النشاط المعني في مصر فقط، وليس إلى المجموعة ككل. والقائمة ليست حصرية ولا تعكس أي ترتيب.',
  },
  {
    num: '٤.',
    title: 'الملكية الفكرية:',
    body: 'جميع الأسماء مملوكة لأصحابها، وتُذكر لأغراض التعريف فقط، ولا يُستخدم أي شعار أو علامة تجارية أو علامة مميزة، ولا يُدعى أي ترخيص أو حق عليها.',
  },
  {
    num: '٥.',
    title: 'عدم الاعتماد:',
    body: 'يُقدَّم هذا القسم لأغراض المعلومات العامة فقط، ولا يُعد عرضًا أو دعوة للتعاقد أو تعهدًا بنتائج أي ارتباط مستقبلي، ويُقدَّم بحسن نية ويُعتقد في صحته وقت النشر، ويجوز تعديله أو سحبه في أي وقت دون إخطار، ولا تُقبل أي مسؤولية عن الاعتماد عليه، وذلك في أقصى الحدود التي يسمح بها القانون.',
  },
  {
    num: '٦.',
    title: 'الحذف:',
    body: 'يحق لأي جهة مذكورة طلب حذف اسمها بمراسلة sherif@sherifyousry.com، وسيتم الحذف دون إبطاء.',
  },
  {
    num: '٧.',
    title: 'اللغة:',
    body: 'في حال وجود أي اختلاف بين النصين العربي والإنجليزي، يُعتد بالنص العربي.',
  },
];

// ─── Sector card ─────────────────────────────────────────────────────────────

function SectorCard({ sector, lang }: { sector: Sector; lang: Language }) {
  const Icon = sector.icon;
  return (
    <div className="w-full rounded-sm overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Photo — reduced height */}
      <div className="relative h-28 overflow-hidden">
        <img
          src={sector.image}
          alt={t(lang, sector.labelAr, sector.labelEn)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030a12]/60 to-transparent" />
      </div>

      {/* Label row */}
      <div className="flex items-start gap-2 px-4 pt-3 pb-1.5">
        <div className="shrink-0 w-7 h-7 rounded bg-brand-navy flex items-center justify-center mt-0.5">
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="font-mono text-[10px] font-bold tracking-[0.1em] text-brand-navy uppercase leading-tight">
          {t(lang, sector.labelAr, sector.labelEn)}
        </h3>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gray-100 mb-2" />

      {/* Client list */}
      <ul className="px-4 pb-3 space-y-1 flex-1">
        {sector.clients.map((name, i) => (
          <li key={i} className="text-[11.5px] text-gray-600 leading-snug">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const VISIBLE_CARDS = 4;          // cards shown at once
const AUTOPLAY_MS   = 4000;       // advance interval

export function ClientsSection() {
  const [lang, setLang] = useState<Language>('en');
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);   // 0-based slide index
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);

  const total = SECTORS.length;
  // How many "steps" we can advance (last visible card = index total-1)
  const maxIndex = total - VISIBLE_CARDS;

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  // Scroll-triggered entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setSectionVisible(true); observer.disconnect(); }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, maxIndex]);

  // Sync DOM scroll position whenever activeIndex changes
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    // Card width = (container width / VISIBLE_CARDS) + gap
    const card = el.querySelector('[data-card]') as HTMLElement | null;
    if (!card) return;
    const gap = 16; // gap-4
    const cardW = card.offsetWidth + gap;
    el.scrollTo({ left: activeIndex * cardW, behavior: 'smooth' });
  }, [activeIndex]);

  const goTo = (idx: number) => setActiveIndex(Math.max(0, Math.min(idx, maxIndex)));

  const isRtl = lang === 'ar';

  return (
    <section
      ref={sectionRef}
      id="our-clients"
      className={`py-10 bg-white transition-all duration-700 ease-out ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-end mb-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-brand-gold uppercase mb-1.5 flex items-center gap-3">
              {t(lang, 'شريف يسري للاستشارات', 'SHERIF YOUSRY ADVISORY')}
              <span className="flex-1 h-px bg-brand-gold/30 max-w-[60px]" />
            </p>
            <h2 className="font-serif text-brand-navy leading-tight mb-1.5" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.1rem)' }}>
              {t(lang, 'خبرة مهنية مختارة', 'Selected Professional Experience')}
            </h2>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xl">
              {t(
                lang,
                'جهات مختارة شارك أعضاء فريقنا في ارتباطات مهنية معها، مقدَّمة حسب القطاع.',
                'Selected organizations with which our professionals have participated in professional engagements, presented by sector.'
              )}
            </p>
          </div>

          {/* Right tag-line */}
          <div className="hidden lg:flex flex-col items-end gap-0.5 text-right rtl:text-left pb-1">
            {[
              t(lang, 'أسواق متنوعة.', 'DIVERSE MARKETS.'),
              t(lang, 'خبرة حقيقية.', 'REAL EXPERIENCE.'),
              t(lang, 'قيمة دائمة.', 'LASTING VALUE.'),
            ].map((line, i) => (
              <span key={i} className="font-mono text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                {line}
              </span>
            ))}
          </div>
        </div>

        {/* ── Carousel ──────────────────────────────────────────────── */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Scroll track — cards sized to fill exactly 4 columns */}
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {SECTORS.map((sector, i) => (
              <div
                key={i}
                data-card
                /* Each card takes exactly 1/4 of the container minus gaps */
                className="flex-none"
                style={{ width: 'calc((100% - 3 * 1rem) / 4)' }}
              >
                <SectorCard sector={sector} lang={lang} />
              </div>
            ))}
          </div>

          {/* Prev arrow */}
          <button
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label={t(lang, 'السابق', 'Previous')}
            className="absolute top-1/2 -translate-y-1/2 -start-5 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white hover:border-brand-navy disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>

          {/* Next arrow */}
          <button
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex >= maxIndex}
            aria-label={t(lang, 'التالي', 'Next')}
            className="absolute top-1/2 -translate-y-1/2 -end-5 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white hover:border-brand-navy disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-3">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 bg-brand-navy'
                  : 'w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* ── Legal disclaimer panel ─────────────────────────────────── */}
        <div className="mt-4 border border-gray-200 rounded-sm bg-gray-50">

          {/* Summary row */}
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="shrink-0 w-7 h-7 rounded bg-brand-navy/10 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-brand-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[9px] font-bold tracking-[0.15em] text-brand-navy uppercase mb-0.5">
                {t(lang, 'إخلاء مسؤولية قانونية', 'LEGAL DISCLAIMER')}
              </p>
              <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                {t(lang, DISCLAIMER_SUMMARY_AR, DISCLAIMER_SUMMARY_EN)}
              </p>
            </div>
            <button
              onClick={() => setDisclaimerOpen((v) => !v)}
              className="shrink-0 flex items-center gap-1 text-[10px] font-bold tracking-wider text-brand-navy uppercase hover:text-brand-gold transition-colors whitespace-nowrap"
              aria-expanded={disclaimerOpen}
            >
              {disclaimerOpen
                ? t(lang, 'إخفاء', 'Hide')
                : t(lang, 'النص الكامل', 'Read Full Disclaimer')}
              {disclaimerOpen
                ? <ChevronUp className="w-3 h-3" />
                : <ChevronRight className="w-3 h-3" />}
            </button>
          </div>

          {/* Expanded full text */}
          {disclaimerOpen && (
            <div className="border-t border-gray-200 px-6 py-6">
              <h4 className="font-mono text-[10px] font-bold tracking-[0.2em] text-brand-navy uppercase mb-5">
                {t(lang, 'إخلاء مسؤولية قانونية — النص الكامل', 'LEGAL DISCLAIMER — FULL TEXT')}
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                {/* English */}
                <div className="space-y-4" dir="ltr">
                  {DISCLAIMER_FULL_EN.map((item, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="font-mono text-[11px] font-bold text-brand-gold shrink-0 mt-px">
                        {item.num}
                      </span>
                      <p className="text-[12px] text-gray-600 leading-relaxed">
                        <span className="font-semibold text-gray-700">{item.title} </span>
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Arabic */}
                <div className="space-y-4 lg:border-s lg:border-gray-200 lg:ps-12" dir="rtl">
                  {DISCLAIMER_FULL_AR.map((item, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="font-mono text-[11px] font-bold text-brand-gold shrink-0 mt-px">
                        {item.num}
                      </span>
                      <p className="text-[12px] text-gray-600 leading-relaxed">
                        <span className="font-semibold text-gray-700">{item.title} </span>
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Contact for removal */}
              <div className="mt-6 pt-5 border-t border-gray-200 flex flex-wrap items-center gap-3">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="text-[12px] text-gray-500">
                  {t(lang,
                    'لطلب حذف الاسم:',
                    'To request removal of a name:'
                  )}
                </span>
                <a
                  href="mailto:sherif@sherifyousry.com"
                  className="text-[12px] font-semibold text-brand-navy hover:text-brand-gold transition-colors"
                >
                  sherif@sherifyousry.com
                </a>
              </div>
            </div>
          )}

          {/* Bottom icon strip */}
          <div className="border-t border-gray-200 px-5 py-2.5 flex flex-wrap items-center justify-center gap-5 lg:gap-8">
            {[
              { icon: FileText, en: 'Names-only presentation', ar: 'أسماء فقط بلا شعارات' },
              { icon: Shield,   en: 'No logos or brand marks', ar: 'لا توجد علامات تجارية' },
              { icon: Shield,   en: 'No engagement details disclosed', ar: 'لا تفاصيل ارتباطات' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-gray-400">
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-medium tracking-wide">
                  {t(lang, item.ar, item.en)}
                </span>
                {i < 2 && <span className="hidden lg:block w-px h-3 bg-gray-200 ms-3" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
