'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getClientLanguage, getDirection, type Language } from '@/lib/language';

// Safe initial language detection to prevent hydration mismatch
const getInitialLang = (): Language => {
  if (typeof window === 'undefined') return 'ar';
  return getClientLanguage();
};

interface PrivacyContent {
  title: string;
  body: string;
}

export default function PrivacyPage() {
  const [lang, setLang] = useState<Language>(getInitialLang);
  const [isMounted, setIsMounted] = useState(false);
  const [content, setContent] = useState<PrivacyContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Confirm language on client mount
  useEffect(() => {
    setIsMounted(true);
    const detected = getClientLanguage();
    if (detected !== lang) setLang(detected);
  }, [lang]);

  // Fetch content from API
  useEffect(() => {
    if (!isMounted) return;

    async function fetchPrivacyPolicy() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/pages/privacy?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          // Handle both array [{...}] and object {...} responses
          const item = Array.isArray(data) ? data[0] : data;
          if (item && (item.title || item.body)) {
            setContent({
              title: item.title ?? '',
              body: item.body ?? '',
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch privacy policy:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrivacyPolicy();
  }, [lang, isMounted]);

  // Fallback content in case API is empty or fails
  const fallbackTitle = lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy';
  const fallbackBody = lang === 'ar' 
    ? `<p>مرحباً بكم في <strong>شريف يسري للاستشارات</strong>. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقاً لأعلى المعايير المهنية والقوانين المعمول بها في مصر ومنطقة الشرق الأوسط.</p>\n\n<h2>1. المعلومات التي نجمعها</h2>\n<p>نقوم بجمع المعلومات التي تقدمها لنا طواعية عند:</p>\n<ul>\n<li>التواصل معنا عبر نماذج الموقع الإلكتروني أو البريد الإلكتروني.</li>\n<li>طلب خدمات استشارية أو حجز جلسة تقييم.</li>\n<li>الاشتراك في نشراتنا الإخبارية أو الرؤى المهنية.</li>\n</ul>\n<p>تشمل هذه المعلومات: الاسم، عنوان البريد الإلكتروني، رقم الهاتف، اسم الشركة، وتفاصيل متعلقة بطبيعة الاستفسار.</p>\n\n<h2>2. كيفية استخدام معلوماتك</h2>\n<p>نستخدم البيانات التي نجمعها للأغراض التالية فقط:</p>\n<ul>\n<li>تقديم خدماتنا الاستشارية والمالية والضريبية بكفاءة.</li>\n<li>الرد على استفساراتك وطلباتك في الوقت المناسب.</li>\n<li>تحسين تجربة المستخدم على موقعنا الإلكتروني ومحتوياته.</li>\n<li>إرسال تحديثات مهنية أو تنظيمية (فقط إذا وافقت صراحة على ذلك).</li>\n</ul>\n\n<h2>3. حماية وأمن البيانات</h2>\n<p>نطبق إجراءات أمنية تقنية وإدارية متقدمة لحماية بياناتك من الوصول غير المصرح به، أو التعديل، أو الإفصاح، أو الإتلاف. نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية.</p>\n\n<h2>4. ملفات تعريف الارتباط (Cookies)</h2>\n<p>يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربتك وتحليل حركة المرور. يمكنك ضبط متصفحك لرفض ملفات تعريف الارتباط، ولكن قد يؤثر ذلك على بعض وظائف الموقع.</p>\n\n<h2>5. حقوقك</h2>\n<p>يحق لك في أي وقت طلب الوصول إلى بياناتك الشخصية، أو تصحيحها، أو حذفها، أو سحب موافقتك على معالجتها. يمكنك ممارسة هذه الحقوق عن طريق التواصل معنا.</p>\n\n<h2>6. تواصل معنا</h2>\n<p>إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه أو كيفية تعاملنا مع بياناتك، يرجى التواصل معنا عبر:</p>\n<ul>\n<li>البريد الإلكتروني: <a href=\"mailto:info@sherifyousry.com\">info@sherifyousry.com</a></li>\n<li>العنوان: القاهرة، مصر</li>\n</ul>\n<p><em>آخر تحديث: سبتمبر 2026</em></p>`:
  `<p>Welcome to <strong>Sherif Yousry Advisory</strong>. We respect your privacy and are committed to protecting your personal data in accordance with the highest professional standards and applicable laws in Egypt and the Middle East region.</p>\n\n<h2>1. Information We Collect</h2>\n<p>We collect information that you voluntarily provide to us when you:</p>\n<ul>\n<li>Contact us via website forms or email.</li>\n<li>Request advisory services or book an assessment session.</li>\n<li>Subscribe to our newsletters or professional insights.</li>\n</ul>\n<p>This information includes: name, email address, phone number, company name, and details related to the nature of your inquiry.</p>\n\n<h2>2. How We Use Your Information</h2>\n<p>We use the data we collect solely for the following purposes:</p>\n<ul>\n<li>To deliver our financial, tax, and business advisory services efficiently.</li>\n<li>To respond to your inquiries and requests in a timely manner.</li>\n<li>To improve the user experience and content of our website.</li>\n<li>To send professional or regulatory updates (only if you have explicitly consented).</li>\n</ul>\n\n<h2>3. Data Protection and Security</h2>\n<p>We implement advanced technical and administrative security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>\n\n<h2>4. Cookies</h2>\n<p>Our website uses cookies to enhance your experience and analyze traffic. You can configure your browser to refuse cookies, but this may affect the functionality of certain parts of the site.</p>\n\n<h2>5. Your Rights</h2>\n<p>You have the right at any time to request access to, correction of, or deletion of your personal data, or to withdraw your consent to its processing. You can exercise these rights by contacting us.</p>\n\n<h2>6. Contact Us</h2>\n<p>If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:</p>\n<ul>\n<li>Email: <a href=\"mailto:info@sherifyousry.com\">info@sherifyousry.com</a></li>\n<li>Address: Cairo, Egypt</li>\n</ul>\n<p><em>Last Updated: September 2026</em></p>`
  const displayTitle = content?.title || fallbackTitle;
  const displayBody = content?.body || fallbackBody;

  return (
    <main dir={getDirection(lang)} className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Header */}
      <section className="bg-brand-navy py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="h-10 w-64 bg-white/10 animate-pulse rounded" />
          ) : (
            <h1 className="font-amiri text-3xl md:text-4xl text-text-primary leading-relaxed">
              {displayTitle}
            </h1>
          )}
        </div>
      </section>

      {/* Content Body */}
      <section className="bg-surface-light py-16 flex-grow">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded" />
            </div>
          ) : (
            <div 
              className="text-text-dark-secondary leading-8 space-y-6
                [&_h2]:text-2xl [&_h2]:font-amiri [&_h2]:text-text-primary [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text-primary [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:mb-4 [&_p]:leading-8
                [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:mb-4 [&_li]:mb-2
                 [&_a]:text-brand-gold [&_a]:underline hover:[&_a]:text-brand-gold/80"
              dangerouslySetInnerHTML={{ __html: displayBody }}
            />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}