'use client';

import { useEffect, useState } from 'react';
import { getClientLanguage } from '@/lib/language';

export function ScrollProgress() {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // Detect language and set direction
    const lang = getClientLanguage();
    setDir(lang === 'ar' ? 'rtl' : 'ltr');
  }, []);

  useEffect(() => {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    const update = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update(); // Set initial width on load
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      id="scrollProgress"
      className="fixed top-0 h-1 bg-brand-gold z-[9999]"
      style={{
        // Anchor to the correct side based on language
        left: dir === 'ltr' ? 0 : 'auto',
        right: dir === 'rtl' ? 0 : 'auto',
        width: '0%',
        transition: 'width 0.1s ease-out',
      }}
    />
  );
}