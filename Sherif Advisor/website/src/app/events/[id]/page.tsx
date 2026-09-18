'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Heart, 
  Share2, 
  ArrowLeft,
  ExternalLink,
  Ticket,
  Info,
  ChevronRight
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

interface EventData {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  location: string;
  venue?: string;
  category: string[];
  image: string;
  gallery?: string[];
  eventType: string[];
  isPaid: boolean;
  isFeatured: boolean;
  ticketLink?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  latitude?: number;
  longitude?: number;
}

// Sample event data - in production, this would come from your CMS/API
const eventData: EventData = {
  id: 'adibf-2026',
  title: 'Abu Dhabi International Book Fair 2026',
  description: 'The Abu Dhabi International Book Fair brings together engaging speakers, diverse themes and thought-provoking sessions celebrating the world of books and ideas.',
  longDescription: `The Abu Dhabi International Book Fair brings together engaging speakers, diverse themes and thought-provoking sessions celebrating the world of books and ideas. The event strengthens collaboration between regional publishing and creative industries, supporting a culture that embraces readable, visual, audio and interactive media, while showcasing outstanding professional and cultural content from across the world.

Join us for a week-long celebration of literature, culture, and ideas featuring:
- Author meet and greets
- Book signings
- Literary discussions
- Cultural performances
- Publishing industry workshops
- Children's activities and storytelling sessions
- International pavilions showcasing global literature`,
  startDate: 'Sep 13, 2026',
  endDate: 'Sep 18, 2026',
  startTime: '09:00 AM',
  endTime: '10:00 PM',
  location: 'ADNEC Centre Abu Dhabi, Abu Dhabi',
  venue: 'ADNEC Centre Abu Dhabi',
  category: ['Culture', 'Education', 'Business'],
  image: '/images/events/adibf-2026.jpg',
  gallery: [
    '/images/events/adibf-2026-1.jpg',
    '/images/events/adibf-2026-2.jpg',
    '/images/events/adibf-2026-3.jpg',
  ],
  eventType: ['Featured Events', 'Ticketed'],
  isPaid: true,
  isFeatured: true,
  ticketLink: '/contact',
  websiteUrl: '/contact',
  facebookUrl: 'https://www.facebook.com/ADBookFair',
  instagramUrl: '',
  latitude: 24.4167,
  longitude: 54.6000,
};

const relatedEvents = [
  {
    id: '1',
    title: 'The Pyxis of Prince Al-Mughira at Louvre Abu Dhabi',
    date: 'Nov 01 - Apr 30, 2026',
    category: 'Culture',
    image: '/images/events/pyxis.jpg',
  },
  {
    id: '2',
    title: 'Shezad Dawood: Skin of Dreams',
    date: 'Apr 09 - Sep 20, 2026',
    category: 'Arts',
    image: '/images/events/shezad-dawood.jpg',
  },
  {
    id: '3',
    title: 'The Ever Living exhibit',
    date: 'Mar 01 - Feb 29, 2026',
    category: 'Arts',
    image: '/images/events/ever-living.jpg',
  },
];

const faqs = [
  {
    question: 'Where can I buy official tickets for Abu Dhabi International Book Fair?',
    answer: 'Official tickets are available through the official website adbookfair.com or at the venue entrance. Early booking is recommended as the event attracts large crowds.'
  },
  {
    question: 'What are the opening hours?',
    answer: 'The fair is open daily from 9:00 AM to 10:00 PM throughout the event period.'
  },
  {
    question: 'Is parking available at ADNEC?',
    answer: 'Yes, ADNEC Centre has extensive parking facilities. During peak hours, we recommend arriving early or using public transport.'
  },
  {
    question: 'Are children allowed?',
    answer: 'Yes, the book fair is family-friendly with dedicated children\'s areas and activities. Children under 12 enter free when accompanied by an adult.'
  },
];

export default function EventDetailPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'schedule' | 'faq'>('details');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white text-[#201d1d]">
      <ScrollProgress />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-[#009086]">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/events" className="text-gray-600 hover:text-[#009086]">Events</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-[#009086] font-medium truncate">{eventData.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[500px] lg:h-[600px]">
          <Image
            src={eventData.image}
            alt={eventData.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>

          {/* Favorite & Share Buttons */}
          <div className="absolute top-6 right-6 z-10 flex gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </button>
            <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Event Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {eventData.category.map((cat) => (
                  <span
                    key={cat}
                    className="px-4 py-1.5 bg-[#009086] text-white text-xs font-bold uppercase tracking-wider rounded-full"
                  >
                    {cat}
                  </span>
                ))}
                {eventData.eventType.map((type) => (
                  <span
                    key={type}
                    className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-[#201d1d] text-xs font-bold uppercase tracking-wider rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                {eventData.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Event Info Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#009086] flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="font-semibold">{eventData.startDate}</p>
                <p className="text-sm text-gray-600">to {eventData.endDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#009086] flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time</p>
                <p className="font-semibold">{eventData.startTime}</p>
                <p className="text-sm text-gray-600">to {eventData.endTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#009086] flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
                <p className="font-semibold">{eventData.venue}</p>
                <p className="text-sm text-gray-600">{eventData.location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-6 border-b border-gray-200 mb-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                    activeTab === 'details'
                      ? 'text-[#009086]'
                      : 'text-gray-600 hover:text-[#009086]'
                  }`}
                >
                  Details
                  {activeTab === 'details' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009086]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                    activeTab === 'schedule'
                      ? 'text-[#009086]'
                      : 'text-gray-600 hover:text-[#009086]'
                  }`}
                >
                  Schedule
                  {activeTab === 'schedule' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009086]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                    activeTab === 'faq'
                      ? 'text-[#009086]'
                      : 'text-gray-600 hover:text-[#009086]'
                  }`}
                >
                  FAQ
                  {activeTab === 'faq' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009086]" />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="whitespace-pre-line">{eventData.longDescription || eventData.description}</p>
                    </div>
                  </div>

                  {/* Event Highlights */}
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#009086]" />
                      Event Highlights
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#009086] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">Meet renowned authors and publishers from around the world</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#009086] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">Discover thousands of books across multiple genres</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#009086] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">Attend exclusive book signings and author talks</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#009086] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">Enjoy cultural performances and literary discussions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#009086] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">Special activities and storytelling for children</span>
                      </li>
                    </ul>
                  </div>

                  {/* Gallery */}
                  {eventData.gallery && eventData.gallery.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Event Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {eventData.gallery.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                            <Image
                              src={img}
                              alt={`Gallery image ${idx + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Event Schedule</h2>
                  <div className="space-y-4">
                    {[
                      { day: 'Day 1 - September 13, 2026', events: ['Opening Ceremony - 10:00 AM', 'Author Meet & Greet - 2:00 PM', 'Cultural Performance - 6:00 PM'] },
                      { day: 'Day 2 - September 14, 2026', events: ['Publishing Workshop - 11:00 AM', 'Book Signing Session - 3:00 PM', 'Literary Discussion - 7:00 PM'] },
                      { day: 'Day 3 - September 15, 2026', events: ['Children\'s Storytelling - 10:00 AM', 'International Pavilion Tour - 2:00 PM', 'Award Ceremony - 8:00 PM'] },
                    ].map((day, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 text-[#009086]">{day.day}</h3>
                        <ul className="space-y-3">
                          {day.events.map((event, eventIdx) => (
                            <li key={eventIdx} className="flex items-center gap-3 text-gray-700">
                              <Clock className="w-4 h-4 text-[#009086]" />
                              {event}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold pr-8">{faq.question}</span>
                          <ChevronRight
                            className={`w-5 h-5 text-[#009086] flex-shrink-0 transition-transform duration-300 ${
                              openFaq === idx ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                        {openFaq === idx && (
                          <div className="px-6 pb-6">
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-40 space-y-6">
                {/* Ticket CTA */}
                <div className="bg-gradient-to-br from-[#009086] to-[#007a72] rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Get Your Tickets</h3>
                  <p className="text-white/90 text-sm mb-6">
                    {eventData.isPaid ? 'Secure your spot at this exclusive event' : 'Free entry - Register now to reserve your spot'}
                  </p>
                  {eventData.ticketLink && (
                    <a
                      href={eventData.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#009086] px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors mb-3"
                    >
                      <Ticket className="w-4 h-4" />
                      Book Tickets
                    </a>
                  )}
                  <button className="w-full inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-white/30 transition-colors">
                    <Calendar className="w-4 h-4" />
                    Add to Calendar
                  </button>
                </div>

                {/* Event Details Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Category</p>
                      <div className="flex flex-wrap gap-2">
                        {eventData.category.map((cat) => (
                          <span key={cat} className="text-sm text-[#009086] font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Price</p>
                      <p className="font-semibold">{eventData.isPaid ? 'Ticketed Event' : 'Free Entry'}</p>
                    </div>
                    {eventData.websiteUrl && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Website</p>
                        <a
                          href={eventData.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-[#009086] hover:underline"
                        >
                          Visit Official Site
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                
                {/* Location Map Placeholder */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Location</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{eventData.venue}</p>
                  <p className="text-sm text-gray-600">{eventData.location}</p>
                  <a
                    href={`https://www.google.com/maps?q=${eventData.latitude},${eventData.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 text-sm text-[#009086] font-medium hover:underline"
                  >
                    Get Directions
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Related Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#201d1d]/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">{event.date}</p>
                  <h3 className="font-bold text-[#201d1d] group-hover:text-[#009086] transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}