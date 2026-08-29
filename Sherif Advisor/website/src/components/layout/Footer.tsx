import Link from 'next/link';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

const services = [
  { label: 'الاستشارات الضريبية', href: '/services/tax' },
  { label: 'الاستشارات المالية', href: '/services/finance' },
  { label: 'المدير المالي بالتعاقد', href: '/services/cfo' },
  { label: 'المخاطر والحوكمة', href: '/services/risk' },
  { label: 'إدارة الأعمال', href: '/services/business' },
  { label: 'التوسع الدولي', href: '/services/international' },
];

const quickLinks = [
  { label: 'من نحن', href: '/about' },
  { label: 'مركز المعرفة', href: '/knowledge' },
  { label: 'بوابة العملاء', href: '/portal' },
  { label: 'سياسة الخصوصية', href: '/privacy' },
  { label: 'الشروط والأحكام', href: '/terms' },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy-deep border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7 text-brand-gold" />
              <span className="font-cormorant text-xl text-text-primary">
                Sherif Yousry Advisory
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              استشارات متكاملة للشركات التي تخطّط لما هو قادم. الضرائب والتمويل
              والمخاطر وإدارة الأعمال.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>مصر · السعودية · الإمارات</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Mail className="w-4 h-4 text-brand-gold" />
                <span>info@sherifadvisory.com</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Phone className="w-4 h-4 text-brand-gold" />
                <span dir="ltr">+20 xxx xxx xxxx</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-brand-gold mb-5 uppercase">
              خدماتنا
            </h3>
            <ul className="flex flex-col gap-3">
              {services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-brand-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-brand-gold mb-5 uppercase">
              روابط سريعة
            </h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-brand-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Security Badge */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-brand-gold mb-5 uppercase">
              ابق على اطلاع
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              اشترك في نشرتنا لتلقي آخر التحديثات الضريبية والتنظيمية.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 bg-brand-navy/50 border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
              <button type="submit" className="bg-brand-gold text-brand-navy px-4 py-2.5 text-xs font-medium tracking-wider rounded hover:bg-brand-gold-light transition-colors">
                اشتراك
              </button>
            </form>
            <div className="mt-6 flex items-center gap-2 text-xs text-text-muted">
              <Shield className="w-4 h-4 text-green-400" />
              <span>بياناتك مشفرة ومحمية بأعلى معايير الأمان</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Sherif Yousry Advisory. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6 text-xs text-text-muted">
            <span>ISO 27001 Compliant</span>
            <span>•</span>
            <span>SOC 2 Ready</span>
            <span>•</span>
            <span>GDPR Aware</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
