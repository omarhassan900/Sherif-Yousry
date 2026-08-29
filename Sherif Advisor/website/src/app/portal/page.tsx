import { Lock, FileText, MessageSquare, BarChart3, Bell, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-brand-navy-dark flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        {/* Login Card */}
        <div className="bg-brand-navy border border-white/10 rounded-lg p-10 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-brand-gold/60 flex items-center justify-center">
              <Lock className="w-7 h-7 text-brand-gold" />
            </div>
            <h1 className="font-cormorant text-2xl text-text-primary">
              بوابة العملاء
            </h1>
            <p className="text-sm text-text-secondary text-center">
              الوصول الآمن إلى ملفاتك ومستنداتك وحالة الخدمات
            </p>
          </div>

          <form className="w-full flex flex-col gap-4">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              required
              className="w-full bg-brand-navy-deep border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              required
              className="w-full bg-brand-navy-deep border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
            />
            <button
              type="submit"
              className="btn-primary w-full text-center"
            >
              تسجيل الدخول
            </button>
          </form>

          <div className="flex items-center gap-4 text-xs text-text-muted">
            <Lock className="w-3 h-3" />
            <span>مشفّر بمعيار AES-256 | مصادقة ثنائية</span>
          </div>
        </div>

        {/* Portal Features Preview */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: FileText, label: 'المستندات' },
            { icon: MessageSquare, label: 'الرسائل' },
            { icon: BarChart3, label: 'التقارير' },
            { icon: Bell, label: 'الإشعارات' },
            { icon: Calendar, label: 'المواعيد' },
            { icon: Lock, label: 'الأمان' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 py-4 px-3 border border-white/5 rounded bg-brand-navy/30"
            >
              <item.icon className="w-5 h-5 text-brand-gold/70" />
              <span className="text-xs text-text-muted">{item.label}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          <Link href="/" className="text-brand-gold hover:underline">
            العودة للرئيسية
          </Link>
        </p>
      </div>
    </div>
  );
}
