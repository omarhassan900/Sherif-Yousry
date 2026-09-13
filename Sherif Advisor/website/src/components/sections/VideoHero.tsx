'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowUpRight, Volume2, VolumeX, Pause, Play, Maximize } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const videoSlides = [
  {
    id: 1,
    video: '/videos/hero-1.mp4',
    poster: '/images/hero-poster-1.jpg',
    titleAr: 'استثمر في مصر',
    titleEn: 'Invest in EGYPT',
    subtitleAr: 'مدفوعة بفرص عالمية، مدعومة بالمواهب، ومصممة لنطاق لا حدود له',
    subtitleEn: 'Driven by world class opportunities, powered by talent, and designed for limitless scale'
  },
  {
    id: 2,
    video: '/videos/hero-2.mp4',
    poster: '/images/hero-poster-2.jpg',
    titleAr: 'رؤية 2030',
    titleEn: 'Vision 2030',
    subtitleAr: 'إعادة تعريف ما يمكن للأمم أن تبنيه',
    subtitleEn: 'Redefining what nations can build'
  },
  {
    id: 3,
    video: '/videos/hero-3.mp4',
    poster: '/images/hero-poster-3.jpg',
    titleAr: 'فرص استثمارية',
    titleEn: 'Investment Opportunities',
    subtitleAr: 'مستقبل واعد ينتظرك',
    subtitleEn: 'A promising future awaits you'
  }
];

export function VideoHero() {
  const [lang, setLang] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout>();
  const MIN_PLAY_TIME = 15000;
  const slideStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    setIsMounted(true);
    setLang(getClientLanguage());
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      setIsVideoReady(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoCurrentTime(videoRef.current.currentTime);
    }
  };

  const goToNextSlide = () => {
    const elapsed = Date.now() - slideStartTimeRef.current;
    const shouldAdvance = elapsed >= MIN_PLAY_TIME;
    
    if (shouldAdvance) {
      setCurrentSlide((prev) => (prev + 1) % videoSlides.length);
      setVideoCurrentTime(0);
      setIsVideoReady(false);
      slideStartTimeRef.current = Date.now();
    } else {
      const remainingTime = MIN_PLAY_TIME - elapsed;
      slideTimerRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % videoSlides.length);
        setVideoCurrentTime(0);
        setIsVideoReady(false);
        slideStartTimeRef.current = Date.now();
      }, remainingTime);
    }
  };

  const handleVideoEnded = () => {
    if (isPlaying) {
      goToNextSlide();
    }
  };

  useEffect(() => {
    if (!isMounted || !isPlaying) return;

    const playVideo = async () => {
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = 0;
          await videoRef.current.play();
        } catch (error) {
          console.log('Autoplay blocked');
        }
      }
    };

    playVideo();
    slideStartTimeRef.current = Date.now();

    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, isMounted, isPlaying]);

  const handlePlayPause = () => {
    setHasUserInteracted(true);
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setHasUserInteracted(true);
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const toggleFullscreen = () => {
    setHasUserInteracted(true);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const goToSlide = (index: number) => {
    setHasUserInteracted(true);
    setCurrentSlide(index);
    setVideoCurrentTime(0);
    setIsVideoReady(false);
    slideStartTimeRef.current = Date.now();
  };

  const progressPercent = videoDuration > 0 ? (videoCurrentTime / videoDuration) * 100 : 0;

  if (!isMounted) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Video Background */}
      <div className="absolute inset-0">
        {videoSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {slide.poster && (
              <Image
                src={slide.poster}
                alt=""
                fill
                className="object-cover z-0"
                priority={index === 0}
              />
            )}
            
            <video
              ref={index === currentSlide ? videoRef : null}
              src={slide.video}
              autoPlay={index === currentSlide && isPlaying}
              loop={false}
              muted={isMuted}
              playsInline
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              className="absolute inset-0 h-full w-full object-cover z-10"
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 z-20" />
          </div>
        ))}
      </div>

    

      {/* ✅ Main Content - Constrained Width, Right-Aligned */}
      <div className="relative z-30 h-full flex items-end px-6 lg:px-12 pb-32 max-w-6xl mx-auto">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="max-w-2xl"> {/* ✅ Right-aligned, constrained width */}
            <div key={currentSlide} className="animate-[fadeInUp 1s ease-out]">
              {/* Smaller Title */}
              <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
                {t(lang, videoSlides[currentSlide].titleAr, videoSlides[currentSlide].titleEn)}
              </h1>
              {/* Smaller Subtitle */}
              <p className="text-sm lg:text-base text-white/80 leading-relaxed mb-6">
                {t(lang, videoSlides[currentSlide].subtitleAr, videoSlides[currentSlide].subtitleEn)}
              </p>
            </div>

            {/* ✅ Search Bar and Buttons - Below Text */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center  gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t(lang, 'أبحث عن...', 'I am looking for...')}
                  className="w-full h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full pl-4 pr-10 text-white text-xs placeholder:text-white/50 focus:outline-none focus:border-white/40 transition-colors"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-white/20 text-white text-xs font-medium hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  {t(lang, 'استكشف القطاعات', 'Explore Sectors')}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-white/20 text-white text-xs font-medium hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  {t(lang, 'الخدمات الإلكترونية', 'E-Services')}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-white/20 text-white text-xs font-medium hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  {t(lang, 'تواصل معنا', 'Contact Us')}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
         {/* ✅ Bottom Controls - Constrained Width */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 lg:px-12 pb-6">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-3">
          
          {/* Progress Bars */}
          <div className="flex gap-2">
            {videoSlides.map((_, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:bg-white/30 transition-colors"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: index < currentSlide ? '100%' : index === currentSlide ? `${progressPercent}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Media Controls - Right Aligned */}
          <div className="flex items-center justify-end gap-4">
            {/* Time Display */}
            <div className="text-white/60 text-xs font-mono hidden sm:block">
              {Math.floor(videoCurrentTime / 60)}:{String(Math.floor(videoCurrentTime % 60)).padStart(2, '0')} / {Math.floor(videoDuration / 60) || 0}:{String(Math.floor((videoDuration || 0) % 60)).padStart(2, '0')}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Autoplay blocker */}
      {!hasUserInteracted && !isPlaying && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50">
          <button
            onClick={handlePlayPause}
            className="flex flex-col items-center gap-4 text-white"
          >
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
              <Play className="w-10 h-10 ml-1" />
            </div>
            <span className="text-sm uppercase tracking-wider">Click to Play</span>
          </button>
        </div>
      )}

      </div>

     
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}