'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ChevronRight, Plus, ArrowRight, Users, Award, Briefcase } from 'lucide-react';

const tabs = [
  { id: 'all', label: 'ALL' },
  { id: 'tax', label: 'TAX SEMINARS' },
  { id: 'legal', label: 'LEGAL WORKSHOPS' },
  { id: 'training', label: 'CORPORATE TRAINING' },
  { id: 'webinar', label: 'WEBINARS' },
];

const featuredEvent = {
  id: 'featured-1',
  title: "Annual Tax & Regulatory Summit 2025",
  date: "November 15 - 16, 2025 | 09:00 AM - 05:00 PM",
  location: "The St. Regis Cairo, New Administrative Capital",
  category: "FLAGSHIP EVENT",
  description: "Join industry leaders, policymakers, and top-tier advisors for Egypt's premier tax and regulatory summit. Gain exclusive insights into the latest fiscal policies, E-invoicing Phase 2 updates, and cross-border compliance strategies.",
  image: "/images/events/summit-2025.jpg", // Replace with your image
};

const events = [
  {
    id: 1,
    title: "Navigating Egypt's New Corporate Tax Law",
    date: "Oct 12, 2025 | 02:00 PM - 04:30 PM",
    location: "Sherif Yousry Advisory HQ, New Capital",
    category: "TAX SEMINAR",
    type: "tax",
    image: "/images/events/tax-law.jpg",
  },
  {
    id: 2,
    title: "E-Invoicing Phase 2 Compliance Workshop",
    date: "Oct 24, 2025 | 10:00 AM - 01:00 PM",
    location: "Virtual & In-Person (Hybrid)",
    category: "LEGAL WORKSHOP",
    type: "legal",
    image: "/images/events/e-invoice.jpg",
  },
  {
    id: 3,
    title: "Strategic Financial Modeling for CFOs",
    date: "Nov 05, 2025 | 09:00 AM - 04:00 PM",
    location: "Four Seasons Hotel, Cairo",
    category: "CORPORATE TRAINING",
    type: "training",
    image: "/images/events/financial-modeling.jpg",
  },
  {
    id: 4,
    title: "Cross-Border M&A: Legal & Tax Implications",
    date: "Nov 18, 2025 | 03:00 PM - 05:00 PM",
    location: "Online Webinar",
    category: "WEBINAR",
    type: "webinar",
    image: "/images/events/ma-webinar.jpg",
  },
  {
    id: 5,
    title: "Transfer Pricing Documentation Masterclass",
    date: "Dec 02, 2025 | 10:00 AM - 02:00 PM",
    location: "Sherif Yousry Advisory HQ, New Capital",
    category: "TAX SEMINAR",
    type: "tax",
    image: "/images/events/transfer-pricing.jpg",
  },
  {
    id: 6,
    title: "Leadership & Management for Growing Firms",
    date: "Dec 15, 2025 | 09:00 AM - 05:00 PM",
    location: "Sofitel Cairo Nile El Gezirah",
    category: "CORPORATE TRAINING",
    type: "training",
    image: "/images/events/leadership.jpg",
  },
];

const faqs = [
  {
    question: "Do you offer customized corporate training for our team?",
    answer: "Yes. We design bespoke training programs tailored to your organization's specific industry, size, and strategic goals. Contact our corporate training team to discuss a customized proposal."
  },
  {
    question: "Are your seminars and workshops CPE accredited?",
    answer: "Many of our flagship seminars and advanced tax workshops are accredited for Continuing Professional Education (CPE) credits. Accreditation details are listed on each specific event page."
  },
  {
    question: "How can I register for an upcoming event?",
    answer: "You can register directly through the event page by clicking the 'Register Now' button. For corporate group bookings or bespoke training, please contact us directly via our consultation form."
  },
  {
    question: "Are the webinars recorded and available on-demand?",
    answer: "Yes, all our live webinars are recorded. Registered attendees will receive a secure link to access the recording and the presentation slides within 48 hours of the live session."
  },
];

export function EventsTraining() {
  const [activeTab, setActiveTab] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredEvents = activeTab === 'all' 
    ? events 
    : events.filter(event => event.type === activeTab);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ── */}
      <section className="relative bg-[#030a12] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/events-hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030a12] via-[#030a12]/90 to-transparent" />
        
        {/* Decorative gold accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-gold/5 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase mb-4 block">
              Knowledge & Development
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Events & <span className="italic text-brand-gold">Training.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
              Empowering businesses and professionals through expert-led seminars, hands-on workshops, and strategic corporate training.
            </p>
            
            <div className="flex flex-wrap gap-6 mt-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Professionals Trained</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">CPE</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Accredited Sessions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Bespoke</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Corporate Programs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Event ── */}
      <section className="py-16 bg-[#fbf9f6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-brand-gold" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#030a12]">Featured Event</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg overflow-hidden shadow-xl border border-gray-100">
            <div className="relative h-64 lg:h-auto min-h-[300px] bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-brand-gold text-[#030a12] text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-sm uppercase">
                  {featuredEvent.category}
                </span>
              </div>
              {/* Placeholder for image */}
              <div className="absolute inset-0 bg-[#030a12] flex items-center justify-center text-gray-500">
                [Event Image]
              </div>
            </div>
            
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#030a12] mb-4">
                {featuredEvent.title}
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-brand-gold" />
                  <span>{featuredEvent.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                  <span>{featuredEvent.location}</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {featuredEvent.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link 
                  href={`/events/${featuredEvent.id}`}
                  className="inline-flex items-center gap-2 bg-[#030a12] hover:bg-[#030a12]/90 text-white px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors group"
                >
                  Register Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/events"
                  className="inline-flex items-center gap-2 border border-[#030a12] text-[#030a12] hover:bg-[#030a12] hover:text-white px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events Grid ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
            <div>
              <span className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase block mb-2">
                Calendar
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#030a12]">
                Upcoming Events
              </h2>
            </div>
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-[11px] font-bold tracking-wider transition-all relative ${
                    activeTab === tab.id 
                      ? 'text-[#030a12] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-0.5 after:bg-brand-gold' 
                      : 'text-gray-500 hover:text-[#030a12]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}`}
                className="group relative rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col h-[420px]"
              >
                {/* Image Area */}
                <div className="relative h-48 bg-gray-200 flex-shrink-0">
                  <div className="absolute inset-0 bg-[#030a12] flex items-center justify-center text-gray-500 text-xs">
                    [Image]
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#030a12]/90 text-brand-gold text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-sm uppercase backdrop-blur-sm">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-[#030a12] p-6 flex flex-col gap-3 flex-grow">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3 text-brand-gold" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <MapPin className="w-3 h-3 text-brand-gold" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <h3 className="text-[16px] leading-snug font-serif font-semibold text-white line-clamp-2 group-hover:text-brand-gold transition-colors">
                    {event.title}
                  </h3>

                  <div className="mt-auto pt-4 flex items-center gap-2.5 text-[11px] font-bold tracking-wider text-white uppercase">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/30 transition-all duration-300 group-hover:border-brand-gold group-hover:bg-brand-gold/10">
                      <ArrowRight className="w-3.5 h-3.5 transition-colors group-hover:text-brand-gold" />
                    </span>
                    Learn More
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No events found for this category.
            </div>
          )}
        </div>
      </section>

      {/* ── Corporate Training CTA ── */}
      <section className="py-20 bg-[#030a12] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#030a12] via-[#0a1628] to-[#030a12]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Need a <span className="italic text-brand-gold">Customized</span> Program?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            We design bespoke training and development programs tailored to your organization's specific industry, challenges, and strategic goals.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-[#030a12] px-8 py-4 text-xs font-bold tracking-wider uppercase transition-colors group"
          >
            Request a Proposal
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-20 bg-[#fbf9f6]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase block mb-2">
              Support
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#030a12]">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm md:text-base font-medium text-[#030a12] pr-8">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-300 ${openFaq === index ? 'bg-brand-gold border-brand-gold rotate-45' : ''}`}>
                    <Plus className={`w-4 h-4 ${openFaq === index ? 'text-[#030a12]' : 'text-gray-500'}`} />
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}