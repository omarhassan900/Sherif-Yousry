import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { WhyUs } from '@/components/sections/WhyUs';
import { ClientLogos } from '@/components/sections/ClientLogos';
import { Assessment } from '@/components/sections/Assessment';
import { Knowledge } from '@/components/sections/Knowledge';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <Services />
      <WhyUs />
      <ClientLogos />
      <Assessment />
      <Knowledge />
      <Contact />
      <Footer />
    </main>
  );
}
