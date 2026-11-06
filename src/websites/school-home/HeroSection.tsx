import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const heroSlides = [
  {
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=85&w=1400',
    caption: 'Engaging classrooms',
  },
  {
    image:
      'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=1400',
    caption: 'A welcoming school campus',
  },
  {
    image:
      'https://images.unsplash.com/photo-1748345952129-3bdd7d39f155?auto=format&fit=crop&q=70&w=1400',
    caption: 'Technology-enabled learning',
  },
];

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (paused || reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [paused]);

  return (
    <section
      className="relative min-h-[560px] overflow-hidden bg-[#071f3d] text-white"
      data-reveal
      aria-roledescription="carousel"
      aria-label="KD Public School highlights"
    >
      {heroSlides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeSlide ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={index !== activeSlide}
        >
          <img
            src={slide.image}
            alt={index === activeSlide ? slide.caption : ''}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#071b33]/82 via-[#071b33]/48 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-5 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-[#d4a62f] backdrop-blur-sm">
            CBSE · Nursery to Class XII
          </p>
          <h1 className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            A school where every child can learn with confidence.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Thoughtful teaching, practical learning and a caring community help
            students build strong foundations for the future.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[#d4a62f] px-6 font-bold text-[#071f3d] hover:bg-[#f0d47a]"
            >
              <a href="#about">
                Explore our school <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/50 bg-white/5 px-6 text-white backdrop-blur-sm hover:bg-white hover:text-[#071f3d]"
            >
              <Link to="/enquiry">Admission enquiry</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 lg:left-8 lg:right-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-white/60">
              School highlights
            </p>
            <p className="mt-1 text-sm font-semibold" aria-live="polite">
              {heroSlides[activeSlide].caption}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="mr-1 hidden items-center sm:flex">
              {heroSlides.map((slide, index) => (
                <Button
                  key={slide.caption}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-white hover:bg-white/15 hover:text-white"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}: ${slide.caption}`}
                  aria-current={index === activeSlide ? 'true' : undefined}
                >
                  <span
                    className={`h-2 rounded-full transition-all ${
                      index === activeSlide
                        ? 'w-5 bg-[#d4a62f]'
                        : 'w-2 bg-white/70'
                    }`}
                    aria-hidden="true"
                  />
                </Button>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full border-white/40 bg-black/15 text-white hover:bg-white hover:text-[#071f3d]"
              onClick={() =>
                setActiveSlide(current =>
                  current === 0 ? heroSlides.length - 1 : current - 1
                )
              }
              aria-label="Previous hero image"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full border-white/40 bg-black/15 text-white hover:bg-white hover:text-[#071f3d]"
              onClick={() => setPaused(current => !current)}
              aria-label={
                paused ? 'Play hero slideshow' : 'Pause hero slideshow'
              }
            >
              {paused ? (
                <Play aria-hidden="true" />
              ) : (
                <Pause aria-hidden="true" />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full border-white/40 bg-black/15 text-white hover:bg-white hover:text-[#071f3d]"
              onClick={() =>
                setActiveSlide(current => (current + 1) % heroSlides.length)
              }
              aria-label="Next hero image"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
