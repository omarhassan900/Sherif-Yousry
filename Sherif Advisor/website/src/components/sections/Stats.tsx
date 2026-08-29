'use client';

import { useState, useEffect } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

const defaultStats = {
  ar: [
    { value: '٩', label: 'مجالات ممارسة' },
    { value: '١٢', label: 'قطاعاً مغطّى' },
    { value: '٣', label: 'أسواق · مصر / السعودية / الإمارات' },
    { value: '٢٤س', label: 'التزام بسرعة الرد' },
  ],
  en: [
    { value: '9', label: 'Practice Areas' },
    { value: '12', label: 'Sectors Covered' },
    { value: '3', label: 'Markets · Egypt / KSA / UAE' },
    { value: '24h', label: 'Response Commitment' },
  ],
};

interface SectionContent {
  title: string;
  body: string;
  metadata: Record<string, unknown>;
}

export function Stats() {
  const [content, setContent] = useState<SectionContent | null>(null);
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/content/sections/homepage/stats?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        }
      } catch {
        // Use static fallback
      }
    }
    fetchStats();
  }, [lang]);

  // Parse stats from CMS body if available (expected format: JSON array)
  let stats = defaultStats[lang];
  if (content?.body) {
    try {
      const parsed = JSON.parse(content.body);
      if (Array.isArray(parsed) && parsed.length > 0) {
        stats = parsed;
      }
    } catch {
      // If body is not JSON, use default stats
    }
  }

  return (
    <section className="bg-brand-navy-mid border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="px-8 py-9 border-l border-white/10 first:border-l-0"
            >
              <div className="font-cormorant text-3xl lg:text-4xl text-text-primary">
                {stat.value}
              </div>
              <div className="text-xs tracking-wider text-text-muted mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
