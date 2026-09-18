'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface Event {
  id: string;
  image: string;
  date: string;
  title: string;
  link: string;
}

const events: Event[] = [
  {
    id: '1',
    image: '/images/events/book-fair.jpg',
    date: '13 - 18 SEP, 2026 09:00 AM - 10:00 PM',
    title: 'International Book Fair',
    link: '/events/book-fair',
  },
  {
    id: '2',
    image: '/images/events/mid-autumn.jpg',
    date: 'SEP 17 - 17, 07:30 PM - 09:30 PM',
    title: 'Mid-Autumn Festival',
    link: '/events/mid-autumn',
  },
  {
    id: '3',
    image: '/images/events/manarat.jpg',
    date: 'AUG 01 - OCT 28, 10:00 AM - 10:00 PM',
    title: 'Manarat Al Saadiyat Weekly Schedule',
    link: '/events/manarat',
  },
  {
    id: '4',
    image: '/images/events/louvre.jpg',
    date: 'JUL 22 - DEC 28, 10:00 AM - 06:30 PM',
    title: 'Drawing at Louvre Abu Dhabi',
    link: '/events/louvre',
  },
];

export function EventsHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-brand-navy">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          onLoadedData={() => setIsVideoLoaded(true)}
          poster="/images/events/bg.jpeg"
        >
          <source src="/videos/back-to-back-events.mp4" type="video/mp4" />
        </video>
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-brand-navy" />
        )}
        {/* Overlay gradient using brand colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/90 via-brand-navy/70 to-transparent" />
      </div>

      {/* Decorative SVG Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute top-0 right-0 w-1/2 h-full opacity-10"
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1000 0C800 200 600 400 400 600C200 800 100 900 0 1000V0H1000Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-center">
            
            {/* Left Panel */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Sherif Yousry<br />events
              </h1>
            
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Button */}
      <button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60 hover:text-brand-gold transition-colors duration-300"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8 animate-bounce" />
      </button>
    </section>
  );
}