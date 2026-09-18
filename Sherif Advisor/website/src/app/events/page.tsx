'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, ArrowRight, Heart, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { EventsHero } from '@/components/sections/EventsHero';

// Sherif Yousry Advisory Event Data
const eventCategories = [
  { id: 'all', label: 'All Events' },
  { id: 'workshop', label: 'Tax Workshops' },
  { id: 'seminar', label: 'Legal Seminars' },
  { id: 'webinar', label: 'Financial Webinars' },
  { id: 'conference', label: 'Conferences' },
];

const featuredEvents = [
  {
    id: '1',
    title: 'Annual Sherif Yousry Advisory Business Summit',
    date: 'DEC 15, 2025',
    time: '08:00 AM - 06:00 PM',
    location: 'The St. Regis Cairo',
    description: 'Join industry leaders, investors, and policymakers for a full day of strategic insights, market forecasts, and high-level networking in the heart of Cairo.',
    image: '/images/events/summit-banner.jpg',
    link: '/events/summit-2025',
  },
  {
    id: '2',
    title: 'Egypt Corporate Tax Update 2025 Workshop',
    date: 'OCT 24, 2025',
    time: '09:00 AM - 01:00 PM',
    location: 'New Administrative Capital, Cairo',
    description: 'A comprehensive workshop covering the latest amendments to Egyptian corporate tax laws and compliance strategies for modern businesses.',
    image: '/images/events/tax-workshop.jpg',
    link: '/events/tax-workshop-2025',
  },
  {
    id: '3',
    title: 'Legal Framework for Foreign Investors',
    date: 'NOV 12, 2025',
    time: '02:00 PM - 04:30 PM',
    location: 'Online via Zoom',
    description: 'Understanding the regulatory landscape, investment protections, and legal structuring for foreign entities operating in the MENA region.',
    image: '/images/events/legal-seminar.jpg',
    link: '/events/legal-framework-2025',
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Egypt Corporate Tax Update 2025: What You Need to Know',
    category: 'workshop',
    categoryLabel: 'Tax Workshop',
    date: 'OCT 24, 2025',
    time: '09:00 AM - 01:00 PM',
    location: 'New Administrative Capital, Cairo',
    type: 'In-Person',
    image: '/images/events/tax-workshop.jpg',
  },
  {
    id: 2,
    title: 'Legal Framework for Foreign Investors in the MENA Region',
    category: 'seminar',
    categoryLabel: 'Legal Seminar',
    date: 'NOV 12, 2025',
    time: '02:00 PM - 04:30 PM',
    location: 'Online via Zoom',
    type: 'Virtual',
    image: '/images/events/legal-seminar.jpg',
  },
  {
    id: 3,
    title: 'E-Invoicing Phase 2: Compliance & Integration Strategies',
    category: 'webinar',
    categoryLabel: 'Financial Webinar',
    date: 'NOV 28, 2025',
    time: '11:00 AM - 12:30 PM',
    location: 'Online via Teams',
    type: 'Virtual',
    image: '/images/events/e-invoicing.jpg',
  },
  {
    id: 4,
    title: 'Annual Sherif Yousry Advisory Business Summit',
    category: 'conference',
    categoryLabel: 'Conference',
    date: 'DEC 15, 2025',
    time: '08:00 AM - 06:00 PM',
    location: 'The St. Regis Cairo',
    type: 'In-Person',
    image: '/images/events/summit.jpg',
  },
  {
    id: 5,
    title: 'IFRS Updates and Financial Reporting Best Practices',
    category: 'workshop',
    categoryLabel: 'Tax Workshop',
    date: 'JAN 10, 2026',
    time: '10:00 AM - 02:00 PM',
    location: 'Sherif Yousry Advisory HQ',
    type: 'In-Person',
    image: '/images/events/ifrs.jpg',
  },
  {
    id: 6,
    title: 'Navigating UAE Corporate Tax: A Guide for Egyptian Businesses',
    category: 'seminar',
    categoryLabel: 'Legal Seminar',
    date: 'JAN 22, 2026',
    time: '03:00 PM - 05:00 PM',
    location: 'Online via Zoom',
    type: 'Virtual',
    image: '/images/events/uae-tax.jpg',
  },
];

const faqs = [
  {
    question: 'When is the best time of year to attend advisory events in Egypt?',
    answer: 'The peak season for corporate tax and legal seminars in Egypt is typically between October and April, aligning with the fiscal year-end and new regulatory implementations.',
  },
  {
    question: 'Are the webinars recorded for later viewing?',
    answer: 'Yes, all Sherif Yousry Advisory virtual webinars are recorded and provided exclusively to registered attendees within 48 hours of the live session.',
  },
  {
    question: 'Do you offer CPE credits for your workshops?',
    answer: 'Our comprehensive tax and IFRS workshops are accredited and offer Continuing Professional Education (CPE) credits for certified accountants and legal professionals.',
  },
  {
    question: 'How can my company sponsor an event?',
    answer: 'We offer various partnership and sponsorship tiers for our annual Business Summit and specialized workshops. Please contact our events team for the sponsorship prospectus.',
  },
];

// Reusable Section Header Component to match Abu Dhabi styling exactly
function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-4xl font-bold text-[#201d1d] leading-10">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-2 text-[1.375rem] font-bold text-[#201d1d] hover:text-[#009086] transition-colors"
        >
          See all
          <ArrowRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality for Featured Event Banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentEvent = featuredEvents[currentSlide];

  const filteredEvents =
    activeCategory === 'all'
      ? upcomingEvents
      : upcomingEvents.filter((event) => event.category === activeCategory);

  return (
    <main className="min-h-screen bg-white text-[#201d1d] font-sans">
      <ScrollProgress />
      <Header />
      <EventsHero />

      {/* ── Featured Event Banner Slideshow ── */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16 mb-12">
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center min-h-[400px] lg:min-h-[500px]">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#009086] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                  Featured Event
                </span>
                <span className="text-gray-500 text-xs font-bold tracking-wider uppercase transition-opacity duration-500">
                  {currentEvent.date}
                </span>
              </div>
              
              <h2 className="font-sans text-2xl lg:text-3xl font-bold text-[#201d1d] mb-4 leading-snug transition-opacity duration-500">
                {currentEvent.title}
              </h2>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-lg transition-opacity duration-500">
                {currentEvent.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-8 text-xs text-gray-500 font-bold">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4 text-[#009086]" />
                  <span>{currentEvent.time}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4 text-[#009086]" />
                  <span>{currentEvent.location}</span>
                </div>
              </div>
              
              <Link
                href={currentEvent.link}
                className="inline-flex items-center gap-2 bg-[#201d1d] hover:bg-black text-white px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 w-fit hover:shadow-lg"
              >
                Reserve Your Seat
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Image with Navigation */}
            <div className="relative h-64 lg:h-auto min-h-[300px] lg:min-h-[500px] bg-gray-100 overflow-hidden">
              {/* Image Slider */}
              <div className="relative h-full w-full">
                {featuredEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => { e.preventDefault(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-20"
                aria-label="Previous event"
              >
                <ChevronLeft className="w-5 h-5 text-[#201d1d]" />
              </button>

              <button
                onClick={(e) => { e.preventDefault(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-20"
                aria-label="Next event"
              >
                <ChevronRight className="w-5 h-5 text-[#201d1d]" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {featuredEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.preventDefault(); goToSlide(index); }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-8 bg-[#009086]'
                        : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events & Filters ── */}
      <section id="upcoming" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h2 className="text-4xl font-bold text-[#201d1d] leading-10">Upcoming events</h2>

            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-full p-1">
                {['this-week', 'this-month', 'next-month'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveCategory(tab === 'this-week' ? 'all' : tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
                      (tab === 'this-week' && activeCategory === 'all') || activeCategory === tab
                        ? 'bg-[#ff8707] text-white shadow-sm'
                        : 'text-gray-600 hover:text-[#201d1d]'
                    }`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <Link
                href="/events/calendar"
                className="flex items-center gap-1 text-sm font-bold text-[#201d1d] hover:text-[#009086] transition-colors"
              >
                See all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {eventCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#201d1d] text-white shadow-md'
                    : 'bg-white text-[#201d1d] border border-gray-200 hover:border-[#201d1d]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <div className="relative h-56 bg-gray-200">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#201d1d]/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                      {event.categoryLabel}
                    </span>
                  </div>
                  <button 
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide leading-4">
                    {event.date} • {event.time}
                  </p>
                  <h3 className="text-[1.375rem] font-bold text-[#201d1d] mb-2 leading-8 line-clamp-2 group-hover:text-[#009086] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-auto pt-4 border-t border-gray-100 flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top 10 Events (Teal Background) ── */}
      <section className="py-20 bg-[#009086] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-white leading-10 mb-10">Top 10 events</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.slice(0, 3).map((event, index) => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}`}
                className="relative group block"
              >
                <div className="absolute -left-4 top-0 text-[150px] font-bold text-white/10 leading-none select-none pointer-events-none">
                  {index + 1}
                </div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg ml-6 transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="relative h-64 bg-gray-200">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#201d1d]/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                        {event.categoryLabel}
                      </span>
                    </div>
                    <button 
                      className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase leading-4">
                      {event.date}
                    </p>
                    <h3 className="text-[1.375rem] font-bold text-[#201d1d] leading-8 line-clamp-2 group-hover:text-[#009086] transition-colors">
                      {event.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tax & Legal (White Background) ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Tax & Legal" href="/events/tax-legal" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.filter(e => e.category === 'workshop' || e.category === 'seminar').map((event) => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="relative h-48 bg-gray-200">
                  <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#201d1d]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full">
                      {event.categoryLabel}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-gray-500 mb-2 leading-4">{event.date}</p>
                  <h3 className="text-[1.375rem] font-bold text-[#201d1d] mb-2 leading-8 line-clamp-2 group-hover:text-[#009086] transition-colors">{event.title}</h3>
                  <p className="text-xs text-gray-500 font-medium">{event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Financial & Corporate (Blue Background) ── */}
      <section className="py-20 bg-[#0056b3] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-bold text-white leading-10">Financial & Corporate</h2>
            <Link href="/events/financial" className="flex items-center gap-2 text-[1.375rem] font-bold text-white hover:text-[#ff8707] transition-colors">
              See all <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.filter(e => e.category === 'webinar').map((event) => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="relative h-48 bg-gray-200">
                  <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#201d1d]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full">
                      {event.categoryLabel}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-gray-500 mb-2 leading-4">{event.date}</p>
                  <h3 className="text-[1.375rem] font-bold text-[#201d1d] mb-2 leading-8 line-clamp-2 group-hover:text-[#0056b3] transition-colors">{event.title}</h3>
                  <p className="text-xs text-gray-500 font-medium">{event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Strategy & Leadership (Purple Background) ── */}
      <section className="py-20 bg-[#9F28C1] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-bold text-white leading-10">Strategy & Leadership</h2>
            <Link href="/events/strategy" className="flex items-center gap-2 text-[1.375rem] font-bold text-white hover:text-[#ff8707] transition-colors">
              See all <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.filter(e => e.category === 'conference').map((event) => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="relative h-48 bg-gray-200">
                  <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#201d1d]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full">
                      {event.categoryLabel}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-gray-500 mb-2 leading-4">{event.date}</p>
                  <h3 className="text-[1.375rem] font-bold text-[#201d1d] mb-2 leading-8 line-clamp-2 group-hover:text-[#9F28C1] transition-colors">{event.title}</h3>
                  <p className="text-xs text-gray-500 font-medium">{event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ─ */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-[#201d1d] leading-10 mb-10 text-center">Frequently asked questions</h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-bold text-[#201d1d] pr-8 leading-6">{faq.question}</span>
                  <Plus
                    className={`w-5 h-5 text-[#009086] flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}