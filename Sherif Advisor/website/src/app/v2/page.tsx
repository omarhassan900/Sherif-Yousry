'use client';

// ─────────────────────────────────────────────────────────────
// V2 PLAYGROUND ROUTE — Sherif's design POV
// This route uses its OWN copies of the components under
// `@/components/v2/*`. Edit those freely without affecting the
// live public site (which uses `@/components/sections/*` and
// `@/components/layout/*`).
// ─────────────────────────────────────────────────────────────

import { Header } from '@/components/v2/Header';
import { Hero } from '@/components/v2/Hero';
import { Journey } from '@/components/v2/Journey';
import { ServicesGrid } from '@/components/v2/ServicesGrid';
import { MarketsBanner } from '@/components/v2/MarketsBanner';
import { DigitalExperience } from '@/components/v2/DigitalExperience';
import { Knowledge } from '@/components/v2/Knowledge';
import { Contact } from '@/components/v2/Contact';
import { Footer } from '@/components/v2/Footer';
import { WhatsAppFloat } from '@/components/v2/WhatsAppFloat';
import { ScrollProgress } from '@/components/v2/ScrollProgress';

export default function HomeV2() {
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
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
