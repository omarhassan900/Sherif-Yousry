'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sherif Yousry',
    role: 'Founder & Managing Partner',
    image: '/images/team/sherif-yousry.jpg',
  },
  {
    name: 'Dr. Mostafa Fahmy',
    role: 'Partner – Audit & Assurance',
    image: '/images/team/mostafa-fahmy.jpg',
  },
  {
    name: 'Ahmed Mahrous',
    role: 'Partner – Corporate Services',
    image: '/images/team/ahmed-mahrous.jpg',
  },
  {
    name: 'Mohamed Abdel Fattah',
    role: 'Partner – Internal Audit & Advisory',
    image: '/images/team/mohamed-abdelfattah.jpg',
  },
  {
    name: 'Ahmed El Behery',
    role: 'Partner – Financial & Business Advisory',
    image: '/images/team/Ahmed-el-Bhery.jpg',
  },
];

const AUTOPLAY_INTERVAL = 4000;
const TOTAL = teamMembers.length;

// Calculate the circular distance of a card from the active center card
const getDistance = (index: number, active: number, total: number) => {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
};

<<<<<<< HEAD
export function Team() {
  const [lang, setLang] = useState<Language>('en');
=======
export function Team({ hideHeader = false }: { hideHeader?: boolean } = {}) {
>>>>>>> a1aeb90 (UI & portal)
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TOTAL);
  }, [TOTAL]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TOTAL) % TOTAL);
  }, [TOTAL]);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [goNext, isPaused]);

  // Direction multiplier for RTL support (flips the slide direction)
  const dirMultiplier = lang === 'ar' ? -1 : 1;

  return (
    <section id="team" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
<<<<<<< HEAD
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold tracking-wider uppercase text-brand-gold mb-3">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Meet the People Behind Our Success
          </h2>
          <p className="text-gray-600 text-lg">
            A dedicated team of experts committed to delivering excellence
            across every project.
          </p>
        </div>
=======
        {/* Section header — suppressed when the About page renders a CMS-driven header above */}
        {!hideHeader && (
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-sm font-semibold tracking-wider uppercase text-primary mb-3">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet the People Behind Our Success
            </h2>
            <p className="text-gray-600 text-lg">
              A dedicated team of experts committed to delivering excellence
              across every project.
            </p>
          </div>
        )}
>>>>>>> a1aeb90 (UI & portal)

        {/* Carousel Container */}
        <div
          className="relative flex items-center justify-center min-h-[420px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Previous Button */}
          <button
            onClick={goPrev}
            aria-label="Previous team member"
            className="absolute left-4 sm:left-10 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg text-brand-navy hover:bg-brand-navy hover:text-white transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Cards */}
          <div className="relative w-full flex items-center justify-center">
            {teamMembers.map((member, index) => {
              const dist = getDistance(index, activeIndex, TOTAL);
              const isCenter = dist === 0;
              const isAdjacent = Math.abs(dist) === 1;
              const isHidden = Math.abs(dist) > 1;

              // If it's too far, don't render it (keeps DOM light and animations clean)
              if (isHidden) return null;

              return (
                <div
                  key={member.name} // ✅ Crucial: Using stable key so React animates the same element
                  className="absolute flex flex-col items-center text-center will-change-transform transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    // Slide left/right based on distance, inverted for RTL
                    transform: `translateX(${dist * 130 * dirMultiplier}%) scale(${isCenter ? 1.15 : 0.85})`,
                    opacity: isCenter ? 1 : 0.5,
                    zIndex: isCenter ? 20 : 10,
                  }}
                >
                  {/* Image */}
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl transition-shadow duration-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text */}
                  <h3 className="font-semibold text-brand-navy mt-5 transition-all duration-700">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 transition-all duration-700">
                    {member.role}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={goNext}
            aria-label="Next team member"
            className="absolute right-4 sm:right-10 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg text-brand-navy hover:bg-brand-navy hover:text-white transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-12">
          {teamMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to member ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                index === activeIndex 
                  ? 'w-8 bg-brand-gold' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}