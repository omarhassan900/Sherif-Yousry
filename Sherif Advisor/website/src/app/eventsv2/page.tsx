import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { AIChatWidget } from '@/components/chat/AIChatWidget';
import { EventsTraining } from '@/components/sections/EventsTraining';

export default function EventsPage() {
  return (
    <main className="bg-white">
      <ScrollProgress />
      <Header />
      <EventsTraining />
      <Footer />
      <WhatsAppFloat />
      <AIChatWidget />
    </main>
  );
}