'use client';

import { useState, useEffect, useRef } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const reasons = [
  {
    id: 1,
    titleAr: 'رؤية تحويلية driven by أمة شابة',
    titleEn: 'Transformational Vision driven by Young Nation',
    shortTitleAr: 'رؤية تحويلية',
    shortTitleEn: 'Transformational Vision',
    descAr: '70% من السعوديين تحت 35 عاماً، متصلون رقمياً وعالمياً، مع ارتفاع مشاركة المرأة السعودية في سوق العمل إلى 34% في الربع الثالث من 2025 من 23% في 2016.',
    descEn: '70% of Egypts are under 35, digitally native, globally connected, with Egypt women\'s participation in the labor market rising to 34% in the third quarter of 2025 from 23% in 2016.',
    frontDescAr: '70% من السكان تحت 35 عاماً (2023)',
    frontDescEn: '70% of Egypt Population under 35 (2023)',
    bgColor: 'rgb(0, 58, 57)',
    glowColor: 'rgb(70, 243, 230)',
    icon: '/icons/globe.webp'
  },
  {
    id: 2,
    titleAr: 'وجهة موثوقة ومستقرة',
    titleEn: 'Trusted and Stable Destination',
    shortTitleAr: 'وجهة موثوقة',
    shortTitleEn: 'Trusted Destination',
    descAr: 'بيئة استثمارية موثوقة مدعومة باستقرار السياسات وأطر حماية المستثمر وتدفقات الاستثمار الأجنبي المستدامة عبر منطقة الشرق الأوسط وشمال أفريقيا.',
    descEn: 'A trusted investment environment supported by policy stability, investor protection frameworks, and sustained foreign investment inflows across the MENA region.',
    frontDescAr: 'الوجهة رقم 1 للاستثمار الأجنبي المباشر في منطقة الشرق الأوسط وشمال أفريقيا',
    frontDescEn: 'Recognized as #1 FDI Destination in MENA',
    bgColor: 'rgb(0, 44, 70)',
    glowColor: 'rgb(0, 119, 142)',
    icon: '/icons/city-01.webp'
  },
  {
    id: 3,
    titleAr: 'خدمات وبنية تحتية عالمية المستوى',
    titleEn: 'World-Class Services and Infrastructure',
    shortTitleAr: 'بنية تحتية عالمية',
    shortTitleEn: 'World-Class Infrastructure',
    descAr: 'بنية تحتية وطنية عالمية المستوى عبر الرعاية الصحية والتعليم والنقل والطاقة المتجددة، enabling efficient operations, high quality of life, and long-term investment sustainability.',
    descEn: 'World-class national infrastructure across healthcare, education, transport, and renewable energy, enabling efficient operations, high quality of life, and long-term investment sustainability.',
    frontDescAr: 'بنية تحتية عالمية المستوى في الرعاية الصحية والتعليم والنقل والطاقة المتجددة',
    frontDescEn: 'Global State-of-the-Art Healthcare, Education, Transport and Renewables Infrastructure',
    bgColor: 'rgb(0, 42, 50)',
    glowColor: 'rgb(0, 119, 142)',
    icon: '/icons/catalogue.webp'
  },
  {
    id: 4,
    titleAr: 'بنية تحتية رقمية متطورة',
    titleEn: 'State-of-the-Art Digital Infrastructure',
    shortTitleAr: 'بنية رقمية متطورة',
    shortTitleEn: 'Digital Infrastructure',
    descAr: 'بنية تحتية رقمية وطنية متقدمة مدعومة بقدرات حكومة رقمية رائدة عالمياً، enabling efficient services and scalable digital operations.',
    descEn: 'Advanced national digital infrastructure underpinned by globally leading digital government capabilities, enabling efficient services and scalable digital operations.',
    frontDescAr: 'رقم 2 عالمياً في مؤشر نضج الحكومة الرقمية (2025)',
    frontDescEn: 'Ranked Globally #2 in Digital Government Maturity Index (2025)',
    bgColor: 'rgb(0, 26, 42)',
    glowColor: 'rgb(4, 84, 132)',
    icon: '/icons/globe.webp'
  },
  {
    id: 5,
    titleAr: 'توفير فرص استثمارية تحويلية واسعة النطاق',
    titleEn: 'Delivering Scaled, Transformational Investment Opportunities',
    shortTitleAr: 'استثمارات تحويلية',
    shortTitleEn: 'Transformational Investments',
    descAr: 'محفظة استثمارية وطنية تتجاوز 2 تريليون دولار، spanning strategic sectors and enabling large-scale, sustainable capital deployment.',
    descEn: 'National investment pipeline exceeding USD 2T, spanning strategic sectors and enabling large-scale, sustainable capital deployment.',
    frontDescAr: 'أكثر من 2 تريليون دولار في فرص قابلة للاستثمار',
    frontDescEn: 'USD 2T+ in investable opportunities',
    bgColor: 'rgb(20, 18, 46)',
    glowColor: 'rgb(74, 66, 158)',
    icon: '/icons/globe.webp'
  }
];

export function WhyInvest() {
  const [lang, setLang] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // ✅ 1. Create a ref for the tall scroll section
  const scrollSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setLang(getClientLanguage());
  }, []);

  // ✅ 2. Scroll listener to update tabs automatically
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      if (!scrollSectionRef.current) return;
      
      const rect = scrollSectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const containerHeight = rect.height; // 300vh
      const scrollableDistance = containerHeight - viewportHeight;

      if (scrollableDistance <= 0) return;

      // Calculate how far we've scrolled into the container
      const scrolledPastTop = -rect.top;
      let progress = scrolledPastTop / scrollableDistance;
      
      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress));

      // Map progress (0 to 1) to tab index (0 to 4)
      const index = Math.floor(progress * 5);
      const newTab = Math.min(index, 4);

      setActiveTab(newTab);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on mount to set initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <section className="relative bg-[#002B2A]">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 h-1/4 w-full z-10 bg-gradient-to-b from-[#031A18] to-[#002B2A]" />

      {/* Header Section */}
      <div className="container mx-auto px-3 md:px-8 xl:px-12 2xl:px-12 relative z-10 pt-20">
        <div>
          <h2 className="flex flex-col xl:flex-row xl:items-end gap-5 text-2xl sm:text-2xl md:text-2xl lg:text-2xl 2xl:text-3xl font-bold text-white mb-4">
            {t(lang, 'لماذا تستثمر في السعودية', 'Why Invest in Egypt')}
            <div className="h-px bg-gradient-to-r from-white/50 via-emerald-200/80 to-transparent mb-2 w-full max-w-2xl" />
          </h2>
          <p className="text-base md:text-lg lg:text-xl 2xl:text-xl font-bold text-white/90">
            {t(lang, 'أهم 5 أسباب للاستثمار', 'Top 5 Reasons to Invest')}
          </p>
        </div>
      </div>

      {/* Flip Cards Section */}
      <div className="container mx-auto px-3 md:px-8 xl:px-12 2xl:px-12 relative z-50">
        <section className="relative pt-12 md:pt-10">
          <div className="relative z-50">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 2xl:gap-5 mb-5 md:mb-5">
              {reasons.map((reason) => (
                <div key={reason.id} className="relative h-full group" style={{ perspective: '1000px' }}>
                  <div className="relative w-full h-full transition-transform duration-700 group-hover:[transform:rotateY(180deg)]" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Front Face */}
                    <div
                      className="relative p-4 xl:p-5 2xl:py-8 2xl:px-6 overflow-hidden bg-white/10 backdrop-blur-sm rounded-2xl cursor-pointer group w-full h-full min-h-[220px]"
                      style={{ background: reason.bgColor, backfaceVisibility: 'hidden' }}
                    >
                      <div className="absolute inset-0">
                        <img alt="" className="w-full h-1/2 object-cover opacity-30" src="/images/bg-card.webp" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-lg md:text-[1.130rem] text-center font-medium text-white mb-7">
                          {t(lang, reason.shortTitleAr, reason.shortTitleEn)}
                        </h3>
                        <p className="text-sm md:text-base opacity-80 text-white/80 text-center">
                          {t(lang, reason.frontDescAr, reason.frontDescEn)}
                        </p>
                      </div>
                      <div
                        className="absolute inset-0 pointer-events-none opacity-40"
                        style={{ background: `radial-gradient(150% 150% at 110% 100%, ${reason.glowColor} 0%, transparent 50%)` }}
                      />
                    </div>

                    {/* Back Face */}
                    <div
                      className="absolute inset-0 p-4 xl:p-5 2xl:py-6 2xl:px-6 overflow-hidden bg-white/10 backdrop-blur-sm rounded-2xl cursor-pointer group w-full h-full min-h-[220px] flex flex-col justify-center"
                      style={{ background: reason.bgColor, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <div className="absolute inset-0">
                        <img alt="" className="w-full h-1/2 object-cover opacity-30" src="/images/bg-card.webp" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <p className="text-sm md:text-base opacity-90 text-white/90 leading-relaxed">
                          {t(lang, reason.descAr, reason.descEn)}
                        </p>
                      </div>
                      <div
                        className="absolute inset-0 pointer-events-none opacity-40"
                        style={{ background: `radial-gradient(150% 150% at 110% 100%, ${reason.glowColor} 0%, transparent 50%)` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ✅ 3. Sticky Scroll Section with Ref */}
      <div className="">
        <section 
          ref={scrollSectionRef} 
          className="relative w-full mt-10" 
          style={{ height: '300vh' }}
        >
          <div className="container mx-auto px-3 md:px-8 lg:px-0 xl:px-0 2xl:px-14 z-50 sticky top-0 sm:top-[25.5vh] md:top-[15vh] lg:top-[8vh] min-h-screen flex flex-col justify-center">
            <div className="max-w-3xl space-y-3 mb-5 md:mb-6 lg:mt-10">
              <h2 className="text-center md:text-left text-2xl sm:text-3xl md:text-4xl lg:text-[2.875rem] font-bold text-white">
                {t(lang, 'أمة برؤية جريئة', 'A Nation with a Bold Vision')}
              </h2>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-xl text-white/70 text-center md:text-start">
                {t(lang, 'فتح فرص تغير قواعد اللعبة للعالم', 'Unlocking game-changing opportunities for the world')}
              </p>
            </div>

            <div className="flex flex-col justify-center items-start lg:flex-row lg:justify-between gap-5 lg:gap-3 xl:gap-5 2xl:gap-5 mb-16">
              {/* Quote Card */}
              <div className="lg:max-w-95 xl:max-w-130 2xl:max-w-132.5 mb-10 xl:mb-0 overflow-hidden">
                <div className="lg:h-[36rem] w-full bg-black/60 overflow-hidden backdrop-blur-2xl rounded-[1.875rem] flex flex-col justify-between p-6 md:p-7.5 lg:p-6.5 2xl:p-7.5">
                  <p className="text-white/90 text-base lg:text-base xl:text-lg 2xl:text-[1.15rem] leading-relaxed text-left">
                    <span>"Our Vision is a strong, thriving, and stable Egypt that provides opportunity for all. Our Vision is a </span>
                    <span className="font-medium">tolerant country </span>
                    <span>with Islam as its constitution and moderation as its method. We will welcome </span>
                    <span className="font-medium">qualified individuals </span>
                    <span>from all over the world and will respect those who have come to </span>
                    <span className="font-medium">join our journey and our success</span>
                    <span>."</span>
                  </p>
                  <div className="flex justify-between items-center gap-2 mt-6">
                    <div className="lg:mb-0 w-1/2 lg:w-[55%] lg:h-auto xl:w-[290px] xl:h-[21.736rem] rounded-xl overflow-hidden shrink-0">
                      <img alt="Crown Prince" className="w-full h-full object-cover" src="/images/logo.png" />
                    </div>
                    <div className="flex flex-col text-white items-start">
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs and Content */}
              <div className="flex items-start justify-center lg:justify-between flex-col lg:flex-row gap-6 md:gap-0 xl:items-start">
                {/* Tab Buttons */}
                <div className="w-full md:w-[28rem] lg:min-w-60 lg:max-w-65 xl:max-w-75.5 2xl:max-w-86.25 sm:mb-2 md:mb-3 lg:mb-0 md:mt-8">
                  {reasons.map((reason, index) => (
                    <button
                      key={reason.id}
                      onClick={() => setActiveTab(index)}
                      className={`w-full text-left relative pl-6 2xl:pl-6 rounded-l-xl transition-all duration-500 ease-out py-3 pr-0.5 lg:py-5 cursor-pointer ${
                        activeTab === index
                          ? 'bg-gradient-to-r from-black/40 via-black/30 to-black/0 backdrop-blur-xl active:scale-[0.98]'
                          : 'hover:border-cyan-400/60 hover:bg-cyan-400/5 active:scale-[0.98]'
                      }`}
                    >
                      <span
                        className={`absolute top-0 left-0 w-2 rounded-l-3xl h-full transition-all duration-500 ease-out ${
                          activeTab === index
                            ? 'bg-gradient-to-b from-[#00A7A2] via-[#0179C2] to-[#814A98]'
                            : 'bg-transparent'
                        }`}
                        style={{
                          opacity: activeTab === index ? 1 : 0,
                          transform: activeTab === index ? 'scaleY(1)' : 'scaleY(0)',
                          transformOrigin: 'center center'
                        }}
                      />
                      <h3 className={`text-white text-sm xl:text-base 2xl:text-[1.125rem] ${
                        activeTab === index ? 'font-medium' : 'font-light'
                      }`}>
                        {t(lang, reason.titleAr, reason.titleEn)}
                      </h3>
                    </button>
                  ))}
                </div>

                {/* ✅ 4. Tab Content with Fade Animation */}
                <div className="lg:h-[36rem] relative overflow-hidden bg-black/60 flex items-center backdrop-blur-sm p-5 md:p-6 lg:px-5 lg:py-6 2xl:py-4.5 2xl:px-7.5 rounded-[1.875rem] xl:min-h-[31.969rem]">
                  <div key={activeTab} className="flex flex-col animate-[fadeIn_0.5s_ease-in-out]">
                    <div className="flex gap-3 xl:gap-5 mt-4 mt-0">
                      <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center bg-white/10">
                        <img className="w-full h-full object-contain" src={reasons[activeTab].icon} alt="icon" />
                      </div>
                      <p className="text-white text-sm md:text-base lg:text-[0.90rem] xl:text-[0.95rem] xl:text-base 2xl:text-[1.0625rem]">
                        {t(lang, reasons[activeTab].descAr, reasons[activeTab].descEn)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Add keyframes for the fade animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}