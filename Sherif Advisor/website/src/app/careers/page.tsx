'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Briefcase, MapPin, Clock, Users, TrendingUp, Heart, Plus, CheckCircle, Upload, FileText, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { CTABanner } from '@/components/sections/CTABanner';
import { Contact } from '@/components/sections/Contact';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

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
// Mock Data
// ==========================================
const benefits = [
  {
    icon: TrendingUp,
    titleAr: 'نمو مهني مستمر',
    titleEn: 'Continuous Professional Growth',
    descAr: 'نوفر برامج تدريبية متطورة وفرصاً للترقي الوظيفي داخل بيئة عمل ديناميكية.',
    descEn: 'We provide advanced training programs and career advancement opportunities within a dynamic work environment.',
  },
  {
    icon: Users,
    titleAr: 'ثقافة تعاونية',
    titleEn: 'Collaborative Culture',
    descAr: 'نعمل كفريق واحد، حيث يتم تشجيع تبادل الأفكار والخبرات بين جميع الأقسام.',
    descEn: 'We work as one team, encouraging the exchange of ideas and expertise across all departments.',
  },
  {
    icon: Heart,
    titleAr: 'توازن الحياة والعمل',
    titleEn: 'Work-Life Balance',
    descAr: 'نؤمن بأهمية الصحة النفسية والجسدية، ونوفر مرونة في بيئة العمل.',
    descEn: 'We believe in the importance of mental and physical well-being, offering flexibility in the work environment.',
  },
  {
    icon: Briefcase,
    titleAr: 'مشاريع عالمية',
    titleEn: 'Global Projects',
    descAr: 'فرصة للعمل على مشاريع دولية متنوعة مع عملاء من مختلف القطاعات.',
    descEn: 'Opportunity to work on diverse international projects with clients from various sectors.',
  },
];

const openPositions = [
  {
    id: 1,
    titleAr: 'مستشار ضريبي أول',
    titleEn: 'Senior Tax Consultant',
    departmentAr: 'الضرائب',
    departmentEn: 'Tax',
    locationAr: 'القاهرة الجديدة، مصر',
    locationEn: 'New Cairo, Egypt',
    typeAr: 'دوام كامل',
    typeEn: 'Full-time',
    image: '/images/careers/tax-consultant.jpg',
  },
  {
    id: 2,
    titleAr: 'محامي شركات',
    titleEn: 'Corporate Lawyer',
    departmentAr: 'القانوني',
    departmentEn: 'Legal',
    locationAr: 'القاهرة الجديدة، مصر',
    locationEn: 'New Cairo, Egypt',
    typeAr: 'دوام كامل',
    typeEn: 'Full-time',
    image: '/images/careers/lawyer.jpg',
  },
  {
    id: 3,
    titleAr: 'محلل مالي',
    titleEn: 'Financial Analyst',
    departmentAr: 'التمويل',
    departmentEn: 'Finance',
    locationAr: 'عن بُعد',
    locationEn: 'Remote',
    typeAr: 'دوام كامل',
    typeEn: 'Full-time',
    image: '/images/careers/analyst.jpg',
  },
  {
    id: 4,
    titleAr: 'مدير موارد بشرية',
    titleEn: 'HR Manager',
    departmentAr: 'الموارد البشرية',
    departmentEn: 'Human Resources',
    locationAr: 'القاهرة الجديدة، مصر',
    locationEn: 'New Cairo, Egypt',
    typeAr: 'دوام كامل',
    typeEn: 'Full-time',
    image: '/images/careers/hr.jpg',
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
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', position: '', message: '', consent: false });
      setFileName('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <ScrollProgress />
      <Header />

      {/* ── Hero Section ── */}
      <FadeIn>
        <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src="/images/bg.jpeg" alt="Careers Hero" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030a12]/90 via-[#030a12]/80 to-[#030a12]/90" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5" style={{ animation: 'heroFadeRight 0.8s ease 0.2s both' }}>
              {t(lang, 'انضم إلى فريقنا', 'JOIN OUR TEAM')}
            </p>
            <h1 className="font-serif text-white leading-[1.05] max-w-2xl mx-auto mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', animation: 'heroFadeUp 0.8s ease 0.4s both', textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
              {t(lang, 'اصنع مستقبلك', 'Build Your Future')}<br />
              <span className="italic text-brand-gold">{t(lang, 'مع نخبة من الخبراء.', 'With a Team of Experts.')}</span>
            </h1>
            <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed mb-8" style={{ animation: 'heroFadeUp 0.8s ease 0.6s both', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {t(lang, 'نبحث عن المواهب الطموحة التي تسعى للتميز في مجال الاستشارات المالية والضريبية والقانونية.', 'We are looking for ambitious talents who strive for excellence in financial, tax, and legal advisory.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ animation: 'heroFadeUp 0.8s ease 0.8s both' }}>
              <Link href="#apply-now" className="border border-white/40 cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase">
                <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-white transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#030a12] flex-shrink-0">
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
                <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#030a12]">
                  {t(lang, 'قدم الآن', 'Apply Now')}
                </span>
              </Link>
              <Link href="#open-positions" className="border border-white/40 cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase">
                <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-gold transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-gold text-white flex-shrink-0">
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
                <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-white">
                  {t(lang, 'الوظائف المتاحة', 'View Openings')}
                </span>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>
      </FadeIn>

      {/* ─ Why Join Us Section ── */}
      <FadeIn delay={200}>
        <section className="py-20 lg:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5">
                {t(lang, 'لماذا نحن؟', 'WHY US?')}
              </p>
              <h2 className="font-serif text-brand-navy" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
                {t(lang, 'حياة مهنية استثنائية', 'An Exceptional Career Life')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-gold/30 transition-all duration-300 h-full flex flex-col">
                    <div className="w-14 h-14 bg-brand-navy/5 rounded-full flex items-center justify-center mb-6">
                      <benefit.icon className="w-7 h-7 text-brand-gold" />
                    </div>
                    <h3 className="font-serif text-xl text-brand-navy mb-3">
                      {lang === 'ar' ? benefit.titleAr : benefit.titleEn}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">
                      {lang === 'ar' ? benefit.descAr : benefit.descEn}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Open Positions Section ── */}
      <FadeIn delay={300}>
        <section id="open-positions" className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5">
                {t(lang, 'فرص العمل', 'OPPORTUNITIES')}
              </p>
              <h2 className="font-serif text-brand-navy" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
                {t(lang, 'الوظائف المتاحة حالياً', 'Current Openings')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {openPositions.map((job, index) => (
                <FadeIn key={job.id} delay={index * 100}>
                  <div className="group relative rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col h-72">
                    <div className="relative h-72 overflow-hidden">
                      <Image src={job.image} alt={lang === 'ar' ? job.titleAr : job.titleEn} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-brand-navy/95 p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-[10px] font-bold tracking-wider text-brand-gold uppercase mb-1">
                        <span>{lang === 'ar' ? job.departmentAr : job.departmentEn}</span>
                        <span className="w-1 h-1 bg-brand-gold rounded-full" />
                        <span>{lang === 'ar' ? job.typeAr : job.typeEn}</span>
                      </div>
                      <h3 className="text-[18px] leading-snug font-semibold text-white">
                        {lang === 'ar' ? job.titleAr : job.titleEn}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-gray-300 mt-1">
                        <MapPin className="w-3 h-3 text-brand-gold" />
                        <span>{lang === 'ar' ? job.locationAr : job.locationEn}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className="text-[11px] font-bold tracking-wider text-white uppercase flex items-center gap-2">
                          {t(lang, 'قدم الآن', 'Apply Now')}
                          <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white/40 transition-all duration-300 group-hover:border-brand-gold group-hover:bg-brand-gold/15">
                            <ArrowRight className="w-3.5 h-3.5 transition-colors group-hover:text-brand-gold rtl:rotate-180" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

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