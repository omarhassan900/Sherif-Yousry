'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Contact } from '@/components/sections/Contact';
import { getClientLanguage, type Language } from '@/lib/language';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

interface SectionContent {
  id: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<SectionContent | null>(null);
  const [lang, setLang] = useState<Language>('ar');
  const [langReady, setLangReady] = useState(false);

  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

  useEffect(() => {
    if (!langReady) return;
    let cancelled = false;
    async function fetchContactSection() {
      try {
        // Seeded section key is `contact/main`.
        const res = await fetch(`/api/content/sections/contact/main?lang=${lang}`);
        if (!cancelled && res.ok) {
          setContactInfo(await res.json());
        }
      } catch {
        // Use static fallback
      }
    }
    fetchContactSection();
    return () => {
      cancelled = true;
    };
  }, [lang, langReady]);

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
      <WhatsAppFloat />

    </main>
  );
}
