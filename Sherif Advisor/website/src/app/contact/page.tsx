'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Contact } from '@/components/sections/Contact';
import { getClientLanguage, type Language } from '@/lib/language';

interface SectionContent {
  id: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<SectionContent | null>(null);
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  useEffect(() => {
    async function fetchContactSection() {
      try {
        const res = await fetch(`/api/content/sections/contact/info?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          setContactInfo(data);
        }
      } catch {
        // Use static fallback
      }
    }
    fetchContactSection();
  }, [lang]);

  return (
    <main>
      <Header />
      {/* If CMS has contact info, show it above the form */}
      {contactInfo && (
        <section className="bg-brand-navy py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h1 className="font-amiri text-3xl md:text-4xl text-text-primary leading-relaxed mb-4">
              {contactInfo.title}
            </h1>
            {contactInfo.body && (
              <div
                className="text-text-secondary leading-7 max-w-2xl"
                dangerouslySetInnerHTML={{ __html: contactInfo.body }}
              />
            )}
          </div>
        </section>
      )}
      <Contact />
      <Footer />
    </main>
  );
}
