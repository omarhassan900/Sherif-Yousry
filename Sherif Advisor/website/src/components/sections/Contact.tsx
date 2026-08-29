'use client';

import { useState } from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend API
    console.log('Form submitted:', formData);
  };

  return (
    <section className="bg-brand-navy py-20 lg:py-24" id="contact">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16">
          {/* Info Side */}
          <div className="flex flex-col gap-8">
            <div>
              <span className="section-label mb-3 block">تواصل معنا</span>
              <h2 className="font-amiri text-3xl leading-relaxed text-text-primary">
                نحن هنا لمساعدتك في التخطيط لما هو قادم.
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">اتصل بنا</p>
                  <p className="text-sm text-text-primary" dir="ltr">
                    +20 xxx xxx xxxx
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">البريد الإلكتروني</p>
                  <p className="text-sm text-text-primary">
                    info@sherifadvisory.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">المقر الرئيسي</p>
                  <p className="text-sm text-text-primary">القاهرة، مصر</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-brand-navy-deep border border-white/10 rounded-lg p-8 flex flex-col gap-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="الاسم الكامل"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-brand-navy/50 border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-brand-navy/50 border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-brand-navy/50 border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
              <input
                type="text"
                placeholder="اسم الشركة"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="bg-brand-navy/50 border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            <select
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
              className="bg-brand-navy/50 border border-white/10 px-4 py-3 text-sm text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
            >
              <option value="">اختر الخدمة المطلوبة</option>
              <option value="tax">الاستشارات الضريبية</option>
              <option value="finance">الاستشارات المالية</option>
              <option value="cfo">المدير المالي بالتعاقد</option>
              <option value="risk">المخاطر والحوكمة</option>
              <option value="business">إدارة الأعمال</option>
              <option value="international">التوسع الدولي</option>
              <option value="formation">تأسيس الشركات</option>
              <option value="investors">خدمات المستثمرين</option>
            </select>

            <textarea
              placeholder="كيف يمكننا مساعدتك؟"
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="bg-brand-navy/50 border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors resize-none"
            />

            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الطلب</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
