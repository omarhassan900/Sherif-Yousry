'use client';

import { useEffect } from 'react';

export function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    const update = () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div id="scrollProgress" />;
}
