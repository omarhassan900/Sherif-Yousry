'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, ArrowRight, Heart, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { EventsHero } from '@/components/sections/EventsHero';

// ==========================================
// Scroll Animation Component
// ==========================================
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect(); // Stop observing once visible for better performance
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' } // Triggers slightly before element hits bottom
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      {children}
    </div>
  );
}

const eventCategories = [
  { id: 'all', label: 'All Events' },
  { id: 'workshop', label: 'Tax Workshops' },
  { id: 'seminar', label: 'Legal Seminars' },
  { id: 'webinar', label: 'Financial Webinars' },
  { id: 'conference', label: 'Conferences' },
];

const faqs = [
  { question: 'When is the best time of year to attend advisory events in Egypt?', answer: 'The peak season for corporate tax and legal seminars in Egypt is typically between October and April, aligning with the fiscal year-end and new regulatory implementations.' },
  { question: 'Are the webinars recorded for later viewing?', answer: 'Yes, all virtual webinars are recorded and provided exclusively to registered attendees within 48 hours of the live session.' },
  { question: 'Do you offer CPE credits for your workshops?', answer: 'Our comprehensive tax and IFRS workshops are accredited and offer Continuing Professional Education (CPE) credits for certified accountants and legal professionals.' },
  { question: 'Where can I buy official tickets for events?', answer: 'Official tickets are available through the event registration links provided on each event listing on this page.' },
  { question: 'Do I need to book tickets for events in advance?', answer: 'Yes, early booking is highly recommended as our specialized workshops and summits have limited capacity and often sell out.' },
  { question: 'What happens if an event is cancelled or rescheduled?', answer: 'If an event is cancelled or rescheduled, registered attendees will be notified via email with options for a full refund or transfer to the new date.' },
];

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-4xl font-bold text-brand-navy leading-10">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center gap-2 text-[1.375rem] font-bold text-brand-navy hover:text-[#009086] transition-all duration-300 ease-in-out">
          See all <ArrowRight className="w-5 h-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [events, setEvents] = useState<any[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events?lang=en&page=1&pageSize=50');
        const data = await res.json();
        if (data.items) {
          setEvents(data.items);
          setFeaturedEvents(data.items.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (featuredEvents.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredEvents]);

  const filteredEvents = activeCategory === 'all' 
    ? events 
    : events.filter((event: any) => event.metadata?.category === activeCategory);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[#009086] text-xl font-bold animate-pulse">Loading events...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-brand-navy font-sans">
      <ScrollProgress />
      <Header />
      <EventsHero />

      {/* ── Featured Event Banner Slideshow ── */}
      <FadeIn>
        <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16 mb-12">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center min-h-[400px] lg:min-h-[500px]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-brand-navy text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">Featured Event</span>
                  <span className="text-gray-500 text-xs font-bold tracking-wider uppercase">
                    {featuredEvents[currentSlide]?.metadata?.startDate ? new Date(featuredEvents[currentSlide].metadata.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                  </span>
                </div>
                <h2 className="font-sans text-2xl lg:text-3xl font-bold text-brand-navy mb-4 leading-snug">
                  {featuredEvents[currentSlide]?.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-lg">
                  {featuredEvents[currentSlide]?.body?.substring(0, 150)}...
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-8 text-xs text-gray-600 font-bold">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4 text-[#009086]" />
                    <span>{featuredEvents[currentSlide]?.metadata?.startTime || 'TBA'} - {featuredEvents[currentSlide]?.metadata?.endTime || 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4 text-[#009086]" />
                    <span>{featuredEvents[currentSlide]?.metadata?.location || 'TBA'}</span>
                  </div>
                </div>
                <Link href={`/events/${featuredEvents[currentSlide]?.id}`} className="inline-flex items-center gap-2 bg-brand-navy hover:bg-[#009086] text-white px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ease-in-out hover:shadow-lg w-fit">
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative h-64 lg:h-auto min-h-[300px] lg:min-h-[500px] bg-gray-100 overflow-hidden">
                {featuredEvents.map((event, index) => (
                  <div key={event.id} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <Image src={event.metadata?.image || '/images/events/default.jpg'} alt={event.title} fill className="object-cover" priority={index === 0} />
                  </div>
                ))}
                <button onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-brand-navy hover:text-white hover:border-brand-navy rounded-full flex items-center justify-center shadow-lg z-20 transition-all duration-300 ease-in-out">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredEvents.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-brand-navy hover:text-white hover:border-brand-navy rounded-full flex items-center justify-center shadow-lg z-20 transition-all duration-300 ease-in-out">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {featuredEvents.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all duration-300 ease-in-out ${index === currentSlide ? 'w-8 bg-[#009086]' : 'w-2 bg-gray-300 hover:bg-gray-400'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Upcoming Events ── */}
      <FadeIn>
        <section id="upcoming" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <h2 className="text-4xl font-bold text-brand-navy leading-10">Upcoming events</h2>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 rounded-full p-1">
                  {['this-week', 'this-month', 'next-month'].map((tab) => (
                    <button key={tab} onClick={() => setActiveCategory(tab === 'this-week' ? 'all' : tab)} className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ease-in-out ${(tab === 'this-week' && activeCategory === 'all') || activeCategory === tab ? 'bg-brand-navy text-white shadow-sm' : 'text-gray-600 hover:text-brand-navy'}`}>
                      {tab.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
              {eventCategories.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ease-in-out whitespace-nowrap ${activeCategory === cat.id ? 'bg-brand-navy text-white shadow-md' : 'bg-white text-brand-navy border border-gray-200 hover:border-brand-navy'}`}>
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event: any, index) => {
                const meta = event.metadata || {};
                return (
                  <FadeIn key={event.id} delay={index * 100}>
                    <Link href={`/events/${event.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#009086]/30 transition-all duration-300 ease-in-out flex flex-col hover:-translate-y-1 h-full">
                      <div className="relative h-56 bg-gray-100">
                        <Image src={meta.image || '/images/events/default.jpg'} alt={event.title} fill className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                        <div className="absolute top-4 left-4"><span className="bg-brand-navy/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">{meta.categoryLabel || meta.category || 'Event'}</span></div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide leading-4">
                          {meta.startDate ? new Date(meta.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'} • {meta.startTime || 'TBA'}
                        </p>
                        <h3 className="text-[1.375rem] font-bold text-brand-navy mb-2 leading-8 line-clamp-2 group-hover:text-[#009086] transition-colors duration-300 ease-in-out">{event.title}</h3>
                        <p className="text-xs text-gray-500 font-medium mt-auto pt-4 border-t border-gray-100 flex items-center gap-1"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{meta.location || 'TBA'}</span></p>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Top 10 Events (Brand Navy Background for Contrast) ── */}
      <FadeIn>
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl font-bold text-white leading-10 mb-10">Top 10 events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.slice(0, 3).map((event: any, index) => {
                const meta = event.metadata || {};
                return (
                  <FadeIn key={event.id} delay={index * 150}>
                    <Link href={`/events/${event.id}`} className="relative group block">
                      <div className="absolute -left-4 top-0 text-[150px] font-bold text-white/10 leading-none select-none pointer-events-none">
                        {index + 1}
                      </div>
                      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg ml-6 transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl">
                        <div className="relative h-64 bg-gray-100">
                          <Image src={meta.image || '/images/events/default.jpg'} alt={event.title} fill className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                          <div className="absolute top-4 left-4">
                            <span className="bg-brand-navy/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                              {meta.categoryLabel || meta.category || 'Event'}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <p className="text-xs font-bold text-gray-500 mb-2 uppercase leading-4">
                            {meta.startDate ? new Date(meta.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                          </p>
                          <h3 className="text-[1.375rem] font-bold text-brand-navy leading-8 line-clamp-2 group-hover:text-[#009086] transition-colors duration-300 ease-in-out">
                            {event.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── FAQ Section ── */}
      <FadeIn>
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-brand-navy leading-10 mb-10 text-center">Frequently asked questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-[#009086]/30">
                    <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-300 ease-in-out">
                      <span className="text-sm font-bold text-brand-navy pr-8 leading-6">{faq.question}</span>
                      <Plus className={`w-5 h-5 text-[#009086] flex-shrink-0 transition-transform duration-300 ease-in-out ${openFaq === index ? 'rotate-45' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-6 pb-6">
                        <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}