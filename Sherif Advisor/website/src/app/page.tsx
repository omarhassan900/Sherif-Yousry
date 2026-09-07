'use client';

import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { WhyUs } from '@/components/sections/WhyUs';
import { Services } from '@/components/sections/Services';
import { RegionalMap } from '@/components/sections/RegionalMap';
import { Assessment } from '@/components/sections/Assessment';
import { Knowledge } from '@/components/sections/Knowledge';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { AIChatWidget } from '@/components/chat/AIChatWidget';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Header />
      <Hero />
      <Stats />
      <WhyUs />
      <Services />
      <RegionalMap />
      <Assessment />
      <Knowledge />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
