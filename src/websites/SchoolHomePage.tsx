import { useEffect } from 'react';
import AboutSection from './school-home/AboutSection';
import AcademicsSection from './school-home/AcademicsSection';
import AdmissionsSection from './school-home/AdmissionsSection';
import CampusLifeSection from './school-home/CampusLifeSection';
import FacilitiesSection from './school-home/FacilitiesSection';
import HeroSection from './school-home/HeroSection';
import NoticeBoardSection from './school-home/NoticeBoardSection';
import QuickLinksSection from './school-home/QuickLinksSection';
import SchoolFooter from './school-home/SchoolFooter';
import SchoolHeader from './school-home/SchoolHeader';
import SchoolHighlights from './school-home/SchoolHighlights';

const SchoolHomePage = () => {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('reveal-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px' }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="school-home min-h-screen bg-white text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
        .school-home, .school-home button, .school-home input, .school-home textarea, .school-home select { font-family: 'Source Sans 3', sans-serif; }
        html { scroll-behavior: smooth; }
        [id] { scroll-margin-top: 132px; }
        [data-reveal] { opacity: 0; transform: translateY(28px); transition: opacity 650ms ease, transform 650ms ease; }
        [data-reveal].reveal-visible { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          [data-reveal] { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <SchoolHeader />
      <main id="top">
        <HeroSection />
        <SchoolHighlights />
        <AboutSection />
        <QuickLinksSection />
        <AcademicsSection />
        <FacilitiesSection />
        <AdmissionsSection />
        <NoticeBoardSection />
        <CampusLifeSection />
      </main>
      <SchoolFooter />
    </div>
  );
};

export default SchoolHomePage;
