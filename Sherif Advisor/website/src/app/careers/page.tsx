'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, ArrowLeft, Briefcase, MapPin, Clock, Users,
  Plus, CheckCircle, Upload, FileText, Scale, Calculator, BarChart2, Building2,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { CTABanner } from '@/components/sections/CTABanner';
import { Contact } from '@/components/sections/Contact';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase, Scale, Calculator, BarChart2, Building2, Users,
};

// ==========================================
// Scroll Animation Component
// ==========================================
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
}

// ==========================================
// Open Positions — each carries full detail so the right panel can present
// it the same way the Services page presents a service category.
// ==========================================
interface Position {
  id: number;
  slug: string;
  icon: keyof typeof ICON_MAP;
  titleAr: string;
  titleEn: string;
  departmentAr: string;
  departmentEn: string;
  locationAr: string;
  locationEn: string;
  typeAr: string;
  typeEn: string;
  image: string;
  summaryAr: string;
  summaryEn: string;
  responsibilitiesAr: string[];
  responsibilitiesEn: string[];
  requirementsAr: string[];
  requirementsEn: string[];
}

// Fallback positions, used only if no published jobs exist in the CMS yet.
const FALLBACK_POSITIONS: Position[] = [
  {
    id: 1,
    slug: 'senior-tax-consultant',
    icon: 'Calculator',
    titleAr: 'مستشار ضريبي أول',
    titleEn: 'Senior Tax Consultant',
    departmentAr: 'الضرائب',
    departmentEn: 'Tax',
    locationAr: 'القاهرة الجديدة، مصر',
    locationEn: 'New Cairo, Egypt',
    typeAr: 'دوام كامل',
    typeEn: 'Full-time',
    image: '/images/careers/tax-consultant.jpg',
    summaryAr: 'قُد ارتباطات ضريبية معقدة وقدّم استشارات استراتيجية لعملاء من مختلف القطاعات مع ضمان الامتثال الكامل للتشريعات المحلية والدولية.',
    summaryEn: 'Lead complex tax engagements and deliver strategic advisory to clients across sectors, while ensuring full compliance with local and international legislation.',
    responsibilitiesAr: [
      'إدارة محافظ العملاء الضريبية وتقديم استشارات متكاملة.',
      'مراجعة الإقرارات الضريبية وضمان دقتها والتزامها.',
      'التعامل مع المنازعات الضريبية أمام الجهات المختصة.',
      'توجيه وتطوير فريق المستشارين المبتدئين.',
    ],
    responsibilitiesEn: [
      'Manage client tax portfolios and provide integrated advisory.',
      'Review tax returns to ensure accuracy and compliance.',
      'Handle tax disputes before the relevant authorities.',
      'Mentor and develop junior consultants.',
    ],
    requirementsAr: [
      'خبرة لا تقل عن 5 سنوات في الاستشارات الضريبية.',
      'إلمام عميق بقانون الضرائب المصري والفاتورة الإلكترونية.',
      'إجادة العربية والإنجليزية تحدثاً وكتابة.',
    ],
    requirementsEn: [
      'Minimum 5 years of experience in tax advisory.',
      'Deep knowledge of Egyptian tax law and e-invoicing.',
      'Fluency in Arabic and English, written and spoken.',
    ],
  },
  {
    id: 2,
    slug: 'corporate-lawyer',
    icon: 'Scale',
    titleAr: 'محامي شركات',
    titleEn: 'Corporate Lawyer',
    departmentAr: 'القانوني',
    departmentEn: 'Legal',
    locationAr: 'القاهرة الجديدة، مصر',
    locationEn: 'New Cairo, Egypt',
    typeAr: 'دوام كامل',
    typeEn: 'Full-time',
    image: '/images/careers/lawyer.jpg',
    summaryAr: 'قدّم المشورة القانونية في مجالات حوكمة الشركات والعقود والامتثال التنظيمي لمجموعة متنوعة من العملاء.',
    summaryEn: 'Provide legal counsel across corporate governance, contracts, and regulatory compliance for a diverse client base.',
    responsibilitiesAr: [
      'صياغة ومراجعة العقود والاتفاقيات التجارية.',
      'تقديم المشورة في تأسيس الشركات وإعادة الهيكلة.',
      'متابعة الامتثال التنظيمي والحوكمة.',
    ],
    responsibilitiesEn: [
      'Draft and review commercial contracts and agreements.',
      'Advise on company formation and restructuring.',
      'Oversee regulatory compliance and governance.',
    ],
    requirementsAr: [
      'خبرة لا تقل عن 4 سنوات في قانون الشركات.',
      'عضوية نقابة المحامين سارية.',
      'مهارات تفاوض وتحليل قانوني قوية.',
    ],
    requirementsEn: [
      'Minimum 4 years of experience in corporate law.',
      'Active bar association membership.',
      'Strong negotiation and legal analysis skills.',
    ],
  },
  {
    id: 3,
    slug: 'financial-analyst',
    icon: 'BarChart2',
    titleAr: 'محلل مالي',
    titleEn: 'Financial Analyst',
    departmentAr: 'التمويل',
    departmentEn: 'Finance',
    locationAr: 'عن بُعد',
    locationEn: 'Remote',
    typeAr: 'دوام كامل',
    typeEn: 'Full-time',
    image: '/images/careers/analyst.jpg',
    summaryAr: 'حلّل البيانات المالية وأعدّ النماذج والتوقعات التي تدعم قرارات الاستثمار ودراسات الجدوى لعملائنا.',
    summaryEn: 'Analyze financial data and build the models and forecasts that support investment decisions and feasibility studies for our clients.',
    responsibilitiesAr: [
      'إعداد النماذج المالية والتوقعات.',
      'تحليل القوائم المالية ومؤشرات الأداء.',
      'المساهمة في دراسات الجدوى وتقييم الاستثمارات.',
    ],
    responsibilitiesEn: [
      'Build financial models and forecasts.',
      'Analyze financial statements and performance metrics.',
      'Contribute to feasibility studies and investment appraisals.',
    ],
    requirementsAr: [
      'خبرة من 2 إلى 4 سنوات في التحليل المالي.',
      'إتقان Excel ونمذجة البيانات المالية.',
      'شهادة CFA أو ما يعادلها ميزة إضافية.',
    ],
    requirementsEn: [
      '2 to 4 years of experience in financial analysis.',
      'Proficiency in Excel and financial modeling.',
      'A CFA certification or equivalent is a plus.',
    ],
  },
  {
    id: 4,
    slug: 'hr-manager',
    icon: 'Users',
    titleAr: 'مدير موارد بشرية',
    titleEn: 'HR Manager',
    departmentAr: 'الموارد البشرية',
    departmentEn: 'Human Resources',
    locationAr: 'القاهرة الجديدة، مصر',
    locationEn: 'New Cairo, Egypt',
    typeAr: 'دوام كامل',
    typeEn: 'Full-time',
    image: '/images/careers/hr.jpg',
    summaryAr: 'قُد وظيفة الموارد البشرية بالكامل من الاستقطاب إلى تطوير المواهب وبناء ثقافة مؤسسية متميزة.',
    summaryEn: 'Lead the full HR function from talent acquisition to development, building a distinguished organizational culture.',
    responsibilitiesAr: [
      'إدارة دورة الاستقطاب والتوظيف.',
      'تطوير برامج التدريب والمسارات الوظيفية.',
      'الإشراف على سياسات الموارد البشرية والامتثال.',
    ],
    responsibilitiesEn: [
      'Manage the recruitment and hiring cycle.',
      'Develop training programs and career paths.',
      'Oversee HR policies and compliance.',
    ],
    requirementsAr: [
      'خبرة لا تقل عن 5 سنوات في الموارد البشرية.',
      'معرفة بقانون العمل المصري.',
      'مهارات قيادية وتواصل ممتازة.',
    ],
    requirementsEn: [
      'Minimum 5 years of experience in HR.',
      'Knowledge of Egyptian labor law.',
      'Excellent leadership and communication skills.',
    ],
  },
];

const faqs = [
  {
    questionAr: 'ما هي خطوات التقديم على وظيفة في شريف يسري للاستشارات؟',
    questionEn: 'What are the steps to apply for a job at Sherif Yousry Advisory?',
    answerAr: 'يمكنك التقديم من خلال نموذج التقديم أدناه. بعد مراجعة السيرة الذاتية، سنتواصل مع المرشحين المؤهلين لإجراء مقابلة أولية.',
    answerEn: 'You can apply through the application form below. After reviewing your resume, we will contact qualified candidates for an initial interview.',
  },
  {
    questionAr: 'هل تقدمون فرص تدريب للطلاب والخريجين الجدد؟',
    questionEn: 'Do you offer internship opportunities for students and fresh graduates?',
    answerAr: 'نعم، نرحب دائماً بالطلاب المتفوقين والخريجين الجدد للانضمام إلى برامج التدريب الصيفي والزمالة لدينا.',
    answerEn: 'Yes, we always welcome outstanding students and fresh graduates to join our summer internship and fellowship programs.',
  },
  {
    questionAr: 'ما هي اللغات المطلوبة للعمل في الشركة؟',
    questionEn: 'What languages are required to work at the company?',
    answerAr: 'إجادة اللغة العربية والإنجليزية ضرورية لمعظم الوظائف. تعتبر لغات إضافية مثل الفرنسية ميزة إضافية.',
    answerEn: 'Proficiency in Arabic and English is essential for most roles. Additional languages like French are considered a plus.',
  },
];

export default function CareersPage() {
  const [lang, setLang] = useState<Language>('en');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openPositions, setOpenPositions] = useState<Position[]>([]);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    message: '',
    consent: false,
  });
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  // Load published jobs from the CMS (admin-managed). The page reflects exactly
  // what the admin has published — the built-in FALLBACK_POSITIONS are only used
  // if the request fails entirely.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/content/jobs?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad status'))))
      .then((data) => {
        if (cancelled) return;
        const items = Array.isArray(data.items) ? data.items : [];
        const mapped: Position[] = items.map((item: { id: string; title: string; body: string; metadata?: Record<string, unknown> }, idx: number) => {
          const m = item.metadata ?? {};
          const title = item.title;
          const dept = lang === 'ar'
            ? ((m.departmentAr as string) || (m.department as string) || '')
            : ((m.department as string) || '');
          const loc = lang === 'ar'
            ? ((m.locationAr as string) || (m.location as string) || '')
            : ((m.location as string) || '');
          return {
            id: idx + 1,
            slug: item.id,
            icon: (m.icon as keyof typeof ICON_MAP) ?? 'Briefcase',
            titleAr: title,
            titleEn: title,
            departmentAr: dept,
            departmentEn: dept,
            locationAr: loc,
            locationEn: loc,
            typeAr: (m.jobType as string) ?? '',
            typeEn: (m.jobType as string) ?? '',
            image: (m.image as string) ?? '/images/bg.jpeg',
            summaryAr: item.body,
            summaryEn: item.body,
            responsibilitiesAr: (m.responsibilitiesAr as string[]) ?? (m.responsibilitiesEn as string[]) ?? [],
            responsibilitiesEn: (m.responsibilitiesEn as string[]) ?? (m.responsibilitiesAr as string[]) ?? [],
            requirementsAr: (m.requirementsAr as string[]) ?? (m.requirementsEn as string[]) ?? [],
            requirementsEn: (m.requirementsEn as string[]) ?? (m.requirementsAr as string[]) ?? [],
          };
        });
        setOpenPositions(mapped);
        setActiveSlug((prev) => (mapped.some((p) => p.slug === prev) ? prev : (mapped[0]?.slug ?? '')));
        setJobsLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        // Network/parse failure: show the built-in sample list as a safety net.
        setOpenPositions(FALLBACK_POSITIONS);
        setActiveSlug((prev) => prev || FALLBACK_POSITIONS[0].slug);
        setJobsLoaded(true);
      });
    return () => { cancelled = true; };
  }, [lang]);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const activeJob = openPositions.find((p) => p.slug === activeSlug) ?? openPositions[0];

  // When a job is chosen, scroll to the application form with that position
  // pre-selected.
  const applyForJob = (job: Position) => {
    setFormData((prev) => ({ ...prev, position: String(job.id) }));
    document.getElementById('apply-now')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', position: '', message: '', consent: false });
      setFileName('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white" dir={dir}>
      <ScrollProgress />
      <Header />

      {/* ── Hero Section (matches Services page) ── */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/bg.jpeg" alt="Careers Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1929]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5"
             style={{ animation: 'heroFadeRight 0.8s ease 0.2s both' }}>
            {t(lang, 'انضم إلى فريقنا', 'JOIN OUR TEAM')}
          </p>
          <h1 className="font-serif text-white leading-[1.05] max-w-2xl mx-auto mb-5"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', animation: 'heroFadeUp 0.8s ease 0.4s both', textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
            {t(lang, 'اصنع مستقبلك', 'Build Your Future')}<br />
            <span className="italic text-brand-gold">{t(lang, 'مع نخبة من الخبراء.', 'With a Team of Experts.')}</span>
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed mb-8"
             style={{ animation: 'heroFadeUp 0.8s ease 0.6s both', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {t(lang, 'نبحث عن المواهب الطموحة التي تسعى للتميز في مجال الاستشارات المالية والضريبية والقانونية.', 'We are looking for ambitious talents who strive for excellence in financial, tax, and legal advisory.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ animation: 'heroFadeUp 0.8s ease 0.8s both' }}>
            <Link href="#apply-now" className="border cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase">
              <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-white transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
              <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#030a12] flex-shrink-0">
                {lang === 'ar'
                  ? <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  : <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
              </span>
              <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#030a12]">
                {t(lang, 'قدم الآن', 'Apply Now')}
              </span>
            </Link>
            <Link href="#open-positions" className="border cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase">
              <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-gold transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
              <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-gold text-white flex-shrink-0">
                {lang === 'ar'
                  ? <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  : <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
              </span>
              <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-white">
                {t(lang, 'الوظائف المتاحة', 'View Openings')}
              </span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── Open Positions — master/detail layout (matches Services page) ── */}
      <section id="open-positions" className="bg-surface-light py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5">
              {t(lang, 'فرص العمل', 'OPPORTUNITIES')}
            </p>
            <h2 className="font-serif text-brand-navy" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
              {t(lang, 'الوظائف المتاحة حالياً', 'Current Openings')}
            </h2>
          </div>

          {!jobsLoaded ? (
            <div className="py-16 text-center text-text-secondary">
              {t(lang, 'جاري التحميل...', 'Loading openings...')}
            </div>
          ) : openPositions.length === 0 || !activeJob ? (
            <div className="py-16 text-center">
              <p className="text-brand-navy font-serif text-xl mb-2">
                {t(lang, 'لا توجد وظائف متاحة حالياً', 'No current openings')}
              </p>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                {t(
                  lang,
                  'لا توجد وظائف شاغرة في الوقت الحالي. يمكنك دائماً إرسال طلب تلقائي عبر النموذج أدناه.',
                  'There are no open positions right now. You can still submit a spontaneous application using the form below.'
                )}
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-start">

            {/* ── LEFT SIDEBAR — list of open positions ── */}
            <aside className="lg:sticky lg:top-28">
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className="bg-brand-navy px-5 py-4">
                  <h3 className="text-white font-semibold text-sm tracking-wide">
                    {t(lang, 'الوظائف المتاحة', 'Open Positions')}
                  </h3>
                </div>
                <nav className="py-2">
                  {openPositions.map((job) => {
                    const active = activeSlug === job.slug;
                    const Icon = ICON_MAP[job.icon] ?? Briefcase;
                    return (
                      <button
                        key={job.slug}
                        onClick={() => setActiveSlug(job.slug)}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-sm text-start transition-all duration-200 border-s-2 ${
                          active
                            ? 'border-brand-gold bg-brand-gold/5 text-brand-navy font-semibold'
                            : 'border-transparent text-text-dark-secondary hover:bg-gray-50 hover:text-brand-gold hover:border-brand-gold/40'
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-brand-gold' : 'text-gray-400'}`} />
                        <span className="leading-snug">{lang === 'ar' ? job.titleAr : job.titleEn}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* ── RIGHT CONTENT — selected position detail ── */}
            <div className="min-w-0">
              <FadeIn key={activeSlug}>
                {/* Cover image */}
                <div className="relative h-56 md:h-64 rounded-sm overflow-hidden mb-6">
                  <Image
                    src={activeJob.image}
                    alt={lang === 'ar' ? activeJob.titleAr : activeJob.titleEn}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-center gap-3 text-[10px] font-bold tracking-wider text-brand-gold uppercase mb-2">
                      <span>{lang === 'ar' ? activeJob.departmentAr : activeJob.departmentEn}</span>
                      <span className="w-1 h-1 bg-brand-gold rounded-full" />
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lang === 'ar' ? activeJob.typeAr : activeJob.typeEn}</span>
                      <span className="w-1 h-1 bg-brand-gold rounded-full" />
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lang === 'ar' ? activeJob.locationAr : activeJob.locationEn}</span>
                    </div>
                  </div>
                </div>

                {/* Heading (icon + serif title) — same pattern as Services detail */}
                <div className="flex items-center gap-3 mb-3">
                  {(() => {
                    const Icon = ICON_MAP[activeJob.icon] ?? Briefcase;
                    return <Icon className="w-6 h-6 text-brand-gold flex-shrink-0" />;
                  })()}
                  <h2 className="font-amiri text-2xl md:text-3xl text-brand-navy">
                    {lang === 'ar' ? activeJob.titleAr : activeJob.titleEn}
                  </h2>
                </div>

                {/* Summary */}
                <p className="text-text-secondary text-sm leading-relaxed mb-8">
                  {lang === 'ar' ? activeJob.summaryAr : activeJob.summaryEn}
                </p>

                {/* Responsibilities */}
                <h3 className="text-sm font-semibold text-brand-navy uppercase tracking-wider mb-4">
                  {t(lang, 'المهام والمسؤوليات', 'Key Responsibilities')}
                </h3>
                <ul className="space-y-3 mb-8">
                  {(lang === 'ar' ? activeJob.responsibilitiesAr : activeJob.responsibilitiesEn).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Requirements */}
                <h3 className="text-sm font-semibold text-brand-navy uppercase tracking-wider mb-4">
                  {t(lang, 'المؤهلات المطلوبة', 'Requirements')}
                </h3>
                <ul className="space-y-3 mb-8">
                  {(lang === 'ar' ? activeJob.requirementsAr : activeJob.requirementsEn).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Apply CTA */}
                <button
                  onClick={() => applyForJob(activeJob)}
                  className="border-brand-navy border cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase"
                >
                  <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-navy transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                  <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-navy text-white flex-shrink-0">
                    {lang === 'ar'
                      ? <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                      : <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
                  </span>
                  <span className="relative z-10 text-brand-navy transition-colors duration-300 group-hover:text-white">
                    {t(lang, 'قدم على هذه الوظيفة', 'Apply for this Role')}
                  </span>
                </button>
              </FadeIn>
            </div>

          </div>
          )}
        </div>
      </section>

      {/* ── Application Form Section ── */}
      <FadeIn delay={400}>
        <section id="apply-now" className="py-20 lg:py-28 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5">
                {t(lang, 'تواصل معنا', 'GET IN TOUCH')}
              </p>
              <h2 className="font-serif text-brand-navy mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
                {t(lang, 'قدم طلبك الآن', 'Submit Your Application')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t(
                  lang,
                  'املأ النموذج أدناه وأرفق سيرتك الذاتية. سيقوم فريق الموارد البشرية بمراجعة طلبك والتواصل معك في أقرب وقت ممكن.',
                  'Fill out the form below and attach your CV. Our HR team will review your application and get back to you as soon as possible.'
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-12">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-2xl text-brand-navy mb-3">
                    {t(lang, 'تم إرسال طلبك بنجاح!', 'Application Submitted Successfully!')}
                  </h3>
                  <p className="text-gray-600">
                    {t(lang, 'شكراً لاهتمامك. سنتواصل معك قريباً.', 'Thank you for your interest. We will be in touch soon.')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-bold text-brand-navy mb-2">
                        {t(lang, 'الاسم الكامل', 'Full Name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all bg-gray-50"
                        placeholder={t(lang, 'أدخل اسمك الكامل', 'Enter your full name')}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-brand-navy mb-2">
                        {t(lang, 'البريد الإلكتروني', 'Email Address')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all bg-gray-50"
                        placeholder={t(lang, 'example@email.com', 'example@email.com')}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-bold text-brand-navy mb-2">
                        {t(lang, 'رقم الهاتف', 'Phone Number')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all bg-gray-50"
                        placeholder={t(lang, '+20 100 000 0000', '+20 100 000 0000')}
                      />
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-sm font-bold text-brand-navy mb-2">
                        {t(lang, 'الوظيفة المتقدم لها', 'Position Applying For')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all bg-gray-50 appearance-none"
                      >
                        <option value="">{t(lang, 'اختر الوظيفة', 'Select a position')}</option>
                        {openPositions.map((job) => (
                          <option key={job.id} value={job.id}>
                            {lang === 'ar' ? job.titleAr : job.titleEn}
                          </option>
                        ))}
                        <option value="other">{t(lang, 'أخرى / تقديم تلقائي', 'Other / Spontaneous Application')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Message / Cover Letter */}
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-2">
                      {t(lang, 'رسالة تغطية (اختياري)', 'Cover Letter (Optional)')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all bg-gray-50 resize-none"
                      placeholder={t(lang, 'أخبرنا لماذا تريد الانضمام إلينا...', 'Tell us why you want to join us...')}
                    />
                  </div>

                  {/* File Upload (CV) */}
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-2">
                      {t(lang, 'إرفاق السيرة الذاتية', 'Attach CV')} <span className="text-red-500">*</span>
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-brand-gold/50 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {fileName ? (
                          <>
                            <FileText className="w-8 h-8 mb-2 text-brand-gold" />
                            <p className="text-sm text-brand-navy font-semibold truncate max-w-[250px]">{fileName}</p>
                            <p className="text-xs text-gray-500 mt-1">{t(lang, 'اضغط لتغيير الملف', 'Click to change file')}</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-gray-400 group-hover:text-brand-gold transition-colors" />
                            <p className="mb-1 text-sm text-gray-500">
                              <span className="font-semibold text-brand-navy">{t(lang, 'اضغط للرفع', 'Click to upload')}</span> {t(lang, 'أو اسحب وأفلت', 'or drag and drop')}
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX ({t(lang, 'حد أقصى 5 ميجابايت', 'Max 5MB')})</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        required={!fileName}
                      />
                    </label>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="consent"
                      id="consent"
                      checked={formData.consent}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
                      {t(
                        lang,
                        'أوافق على معالجة بياناتي الشخصية وفقاً لسياسة الخصوصية الخاصة بالشركة.',
                        'I consent to the processing of my personal data in accordance with the company\'s Privacy Policy.'
                      )}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-brand-navy text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t(lang, 'جاري الإرسال...', 'Submitting...')}
                        </>
                      ) : (
                        <>
                          {t(lang, 'إرسال الطلب', 'Submit Application')}
                          <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── FAQ Section ── */}
      <FadeIn delay={500}>
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5">
                {t(lang, 'أسئلة شائعة', 'FAQ')}
              </p>
              <h2 className="font-serif text-brand-navy" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
                {t(lang, 'كل ما تحتاج معرفته', 'Everything You Need to Know')}
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-bold text-brand-navy pr-8 leading-6">
                        {lang === 'ar' ? faq.questionAr : faq.questionEn}
                      </span>
                      <Plus className={`w-5 h-5 text-brand-gold flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-45' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-6 pb-6">
                        <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
                          {lang === 'ar' ? faq.answerAr : faq.answerEn}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <CTABanner />
      <Contact />
      <Footer />
      <WhatsAppFloat />

      <style jsx>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </main>
  );
}
