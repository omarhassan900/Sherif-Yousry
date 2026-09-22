'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Linkedin, Mail } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  email?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sherif Yousry',
    role: 'Founder & Managing Partner',
    image: '/images/team/sherif-yousry.jpg',
    linkedin: '#',
    email: 'sherif.yousry@company.com',
  },
  {
    name: 'Dr. Mostafa Fahmy',
    role: 'Partner – Audit & Assurance',
    image: '/images/team/mostafa-fahmy.jpg',
    linkedin: '#',
    email: 'mostafa.fahmy@company.com',
  },
  {
    name: 'Ahmed Mahrous',
    role: 'Partner – Corporate Services',
    image: '/images/team/ahmed-mahrous.jpg',
    linkedin: '#',
    email: 'ahmed.mahrous@company.com',
  },
  {
    name: 'Mohamed Abdel Fattah',
    role: 'Partner – Internal Audit & Advisory',
    image: '/images/team/mohamed-abdelfattah.jpg',
    linkedin: '#',
    email: 'mohamed.abdelfattah@company.com',
  },
  {
    name: 'Ahmed El Behery',
    role: 'Partner – Financial & Business Advisory',
    image: '/images/team/Ahmed-el-Bhery.jpg',
    linkedin: '#',
    email: 'name@company.com',
  },
];

const AUTOPLAY_INTERVAL = 3000;
const TOTAL = teamMembers.length;
const MIDDLE_SLOT = Math.floor(TOTAL / 2); // fixed visual "center" slot

export function Team() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TOTAL);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TOTAL) % TOTAL);
  }, []);

  // Autoplay: rotate which member sits in the middle slot
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [goNext, isPaused]);

  // Build fixed slots (0..TOTAL-1). The member for slot i is whoever should
  // sit there given the current rotation, so the active member always lands
  // in MIDDLE_SLOT, and the same slot position animates as content rotates in/out.
  const slots = Array.from({ length: TOTAL }, (_, slot) => {
    const memberIndex = (activeIndex - MIDDLE_SLOT + slot + TOTAL) % TOTAL;
    return teamMembers[memberIndex];
  });

  return (
    <section id="our-team" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
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

        {/* Carousel */}
        <div
          className="relative flex items-center justify-center gap-6 sm:gap-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            onClick={goPrev}
            aria-label="Previous team member"
            className="hidden sm:flex shrink-0 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md text-gray-700 hover:bg-primary hover:text-white transition-colors z-10"
          >
            <ChevronLeft size={20} />
          </button>

          {slots.map((member, slot) => {
            const isMiddle = slot === MIDDLE_SLOT;
            return (
              <div
                key={slot}
                className={`group shrink-0 flex flex-col items-center text-center transition-all duration-500 ease-in-out ${
                  isMiddle
                    ? 'opacity-100 scale-110'
                    : 'opacity-30 scale-90'
                }`}
              >
                <div
                  className={`relative rounded-full overflow-hidden ring-4 ring-white shadow-lg mb-5 transition-all duration-500 ${
                    isMiddle ? 'w-40 h-40 sm:w-44 sm:h-44' : 'w-28 h-28 sm:w-32 sm:h-32'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  {isMiddle && (
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-primary hover:text-white transition-colors"
                          aria-label={`${member.name} on LinkedIn`}
                        >
                          <Linkedin size={14} />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-primary hover:text-white transition-colors"
                          aria-label={`Email ${member.name}`}
                        >
                          <Mail size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <h3 className={`font-semibold text-gray-900 ${isMiddle ? 'text-lg' : 'text-sm'}`}>
                  {member.name}
                </h3>
                <p className={`text-gray-500 mt-1 ${isMiddle ? 'text-sm' : 'text-xs'}`}>
                  {member.role}
                </p>
              </div>
            );
          })}

          <button
            onClick={goNext}
            aria-label="Next team member"
            className="hidden sm:flex shrink-0 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md text-gray-700 hover:bg-primary hover:text-white transition-colors z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {teamMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to member ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
