const reasons = [
  {
    id: '٠١',
    title: 'انضباط المكاتب الكبرى',
    description: 'منهجية يقودها كبار المهنيين ومراجعة جودة موثقة.',
  },
  {
    id: '٠٢',
    title: 'تركيز على العميل',
    description: 'نطاق مصمم لك مع تواصل مباشر مع الشريك المسؤول.',
  },
  {
    id: '٠٣',
    title: 'خبرة محلية',
    description: 'معرفة عميقة بالتنظيم والتطبيق في مصر.',
  },
  {
    id: '٠٤',
    title: 'حضور إقليمي',
    description: 'توسّع إلى السعودية والإمارات مع عملائنا.',
  },
  {
    id: '٠٥',
    title: 'تنفيذ رقمي',
    description: 'بوابة وتقويمات ومخرجات متابَعة كإجراء أساسي.',
  },
];

export function WhyUs() {
  return (
    <section className="bg-brand-navy py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_2.5fr] gap-12 items-start">
          {/* Title */}
          <div className="flex flex-col gap-3">
            <span className="section-label">لماذا نحن</span>
            <h2 className="font-amiri text-3xl leading-relaxed text-text-primary">
              لماذا شريف يسري للاستشارات؟
            </h2>
          </div>

          {/* Reasons Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {reasons.map((reason) => (
              <div key={reason.id} className="flex flex-col gap-3">
                <div className="w-9 h-9 border border-brand-gold/60 rounded-full flex items-center justify-center font-mono text-[10px] text-brand-gold">
                  {reason.id}
                </div>
                <h3 className="text-sm font-medium text-white">
                  {reason.title}
                </h3>
                <p className="text-xs leading-6 text-text-secondary">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
