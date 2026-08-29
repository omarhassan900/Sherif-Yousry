import Link from 'next/link';
import { ClipboardCheck } from 'lucide-react';

const steps = [
  { id: '٠١', text: 'أجب على تسعة أسئلة قصيرة' },
  { id: '٠٢', text: 'استلم ملف أعمالك ومؤشرات المخاطر' },
  { id: '٠٣', text: 'احصل على خدمة وخطة موصى بهما' },
  { id: '٠٤', text: 'احجز استشارة أو اطلب عرضاً' },
];

export function Assessment() {
  return (
    <section className="bg-brand-navy-mid py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 section-label">
              <ClipboardCheck className="w-4 h-4" />
              <span>تقييم مجاني</span>
            </div>
            <h2 className="font-amiri text-3xl leading-relaxed text-text-primary">
              لست متأكداً من موقعك؟ ابدأ التقييم المجاني لأعمالك.
            </h2>
            <p className="text-base text-text-secondary leading-[1.85]">
              تسعة أسئلة عن الحجم والالتزام والنضج المالي تُنتج درجة جاهزية
              ومؤشرات مخاطر وخطة استشارية موصى بها — في أقل من أربع دقائق.
            </p>
            <Link href="/assessment" className="btn-primary w-fit">
              ابدأ التقييم
            </Link>
          </div>

          {/* Steps */}
          <div className="border border-white/20 p-9 flex flex-col gap-5 rounded-lg">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex gap-4 items-baseline"
              >
                <span className="font-mono text-xs text-brand-gold min-w-[22px]">
                  {step.id}
                </span>
                <span className="text-sm text-text-primary/90">
                  {step.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
