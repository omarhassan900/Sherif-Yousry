'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, Clock, ArrowRight, Heart, Share2, ArrowLeft, Plus, Ticket, ExternalLink } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [eventData, setEventData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'highlights' | 'schedule' | 'faq' | 'location'>('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}?lang=en`);
        if (!res.ok) throw new Error('Event not found');
        const data = await res.json();
        setEventData(data);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[#009086] text-xl font-bold animate-pulse">Loading event details...</div>
      </main>
    );
  }

  if (!eventData) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-3xl font-bold text-brand-navy mb-4">Event Not Found</h1>
        <Link href="/Trainings" className="text-[#009086] hover:text-brand-navy transition-all duration-300 ease-in-out flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Training
        </Link>
      </main>
    );
  }

  const meta = eventData.metadata || {};
  const title = eventData.title;
  const description = eventData.body;
  const location = meta.location || 'TBA';
  const startDate = meta.startDate ? new Date(meta.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA';
  const startTime = meta.startTime || 'TBA';
  const endTime = meta.endTime || 'TBA';
  const image = meta.image || '/images/events/default.jpg';
  const category = meta.categoryLabel || meta.category || 'Event';
  const ticketLink = meta.ticketLink || '/contact';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'faq', label: 'FAQ' },
    { id: 'location', label: 'How to get there' },
  ] as const;

  const faqs = [
    { question: 'Is there a dress code?', answer: 'Business casual is recommended for all our advisory training.' },
    { question: 'Are meals included?', answer: 'Yes, lunch and refreshments are provided for in-person training.' },
    { question: 'Can I get a refund?', answer: 'Cancellations made 14 days prior to the event are eligible for a full refund.' },
  ];

  return (
    <main className="min-h-screen bg-white text-brand-navy">
      <ScrollProgress />
      <Header />

    

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[400px] lg:h-[500px]">
          <Image src={image} alt={title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-transparent" />
          
          {/* Back Button with Hero Animation */}
          <div className="absolute top-24 left-6 z-10">
            <Link href="/trainings" className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/20 hover:bg-white hover:text-brand-navy px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out">
              <ArrowLeft className="w-4 h-4" /> Back to Training
            </Link>
          </div>

         

          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-4 py-1.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider rounded-full">{category}</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">{title}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Info Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-24 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#009086] flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="font-semibold text-brand-navy">{startDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#009086] flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time</p>
                <p className="font-semibold text-brand-navy">{startTime} - {endTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#009086] flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
                <p className="font-semibold text-brand-navy">{location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#009086] transition-all duration-300 ease-in-out">Home</Link>
            <ArrowLeft className="w-3 h-3 text-gray-400 rotate-180" />
            <Link href="/trainings" className="text-gray-500 hover:text-[#009086] transition-all duration-300 ease-in-out">Trainings</Link>
            <ArrowLeft className="w-3 h-3 text-gray-400 rotate-180" />
            <span className="text-[#009086] font-medium truncate">{title}</span>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column - Tabs */}
            <div className="lg:col-span-2">
              <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 ease-in-out relative whitespace-nowrap ${
                      activeTab === tab.id ? 'text-[#009086]' : 'text-gray-500 hover:text-brand-navy'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-navy transition-all duration-300 ease-in-out" />}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {description || 'No description available for this event.'}
                </div>
              )}

              {activeTab === 'highlights' && (
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-brand-navy">
                    Event Highlights
                  </h3>
                  <ul className="space-y-4">
                    {['Keynote speeches from industry leaders', 'Interactive panel discussions', 'Exclusive networking sessions', 'CPE accreditation for attending professionals'].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-brand-navy rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6 text-brand-navy">Event Schedule</h2>
                  <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                    <h3 className="font-bold text-lg mb-4 text-[#009086]">{startDate}</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-4"><Clock className="w-4 h-4 text-[#009086] mt-1" /><div><p className="font-semibold text-brand-navy">{startTime}</p><p className="text-gray-600">Registration & Welcome</p></div></li>
                      <li className="flex items-start gap-4"><Clock className="w-4 h-4 text-[#009086] mt-1" /><div><p className="font-semibold text-brand-navy">09:30 AM</p><p className="text-gray-600">Opening Keynote</p></div></li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 ease-in-out">
                      <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-300 ease-in-out">
                        <span className="font-semibold pr-8 text-brand-navy">{faq.question}</span>
                        <Plus className={`w-5 h-5 text-[#009086] flex-shrink-0 transition-transform duration-300 ease-in-out ${openFaq === idx ? 'rotate-45' : ''}`} />
                      </button>
                      {openFaq === idx && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-700 leading-relaxed border-t border-gray-100 pt-4">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'location' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6 text-brand-navy">How to get there</h2>
                  <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                    <MapPin className="w-12 h-12 text-gray-400" />
                    <span className="ml-2 text-gray-500">Map Placeholder</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold mb-2 text-brand-navy">{location}</h3>
                    <a href="#" className="inline-flex items-center gap-2 text-[#009086] font-medium hover:text-brand-navy transition-all duration-300 ease-in-out">
                      Get Directions <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-40 space-y-6">
                {/* Ticket CTA (Matching Hero CTA Color & Animation) */}
                <div className="bg-brand-navy rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="text-xl font-bold mb-2">Get Your Tickets</h3>
                  <p className="text-white/90 text-sm mb-6">Secure your spot at this exclusive event</p>
                  <a href={ticketLink} className="w-full inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-white hover:text-[#009086] transition-all duration-300 ease-in-out">
                    <Ticket className="w-4 h-4" /> Book Tickets
                  </a>
                </div>

                {/* Event Details Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-brand-navy">Event Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Category</p>
                      <span className="text-sm text-[#009086] font-medium">{category}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Price</p>
                      <p className="font-semibold text-brand-navy">{meta.isPaid ? 'Ticketed Event' : 'Free Entry'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}