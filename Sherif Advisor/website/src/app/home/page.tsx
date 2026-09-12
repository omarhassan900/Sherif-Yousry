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
import {Journey} from '@/components/sections/Journey'
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { MarketsBanner } from '@/components/sections/MarketsBanner';
import { DigitalExperience } from '@/components/sections/DigitalExperience';
import { CTABanner } from '@/components/sections/CTABanner';

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Header />
      <Hero />
      <Journey />
      <ServicesGrid />
      <MarketsBanner />
      <DigitalExperience /> 
      <Knowledge />
      <Contact />
      <CTABanner />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
