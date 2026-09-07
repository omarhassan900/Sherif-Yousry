'use client';

import { useEffect } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

export function DirectionSync() {
  useEffect(() => {
    const lang = getClientLanguage();
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update the HTML tag attributes dynamically
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, []);

  return null;
}