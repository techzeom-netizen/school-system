import { useEffect } from 'react';
import AboutSection from './school-home/AboutSection';
import AcademicsSection from './school-home/AcademicsSection';
import AdmissionsSection from './school-home/AdmissionsSection';
import CampusLifeSection from './school-home/CampusLifeSection';
import FaqSection from './school-home/FaqSection';
import FacilitiesSection from './school-home/FacilitiesSection';
import HeroSection from './school-home/HeroSection';
import NoticeBoardSection from './school-home/NoticeBoardSection';
import QuickLinksSection from './school-home/QuickLinksSection';
import SchoolFooter from './school-home/SchoolFooter';
import SchoolHeader from './school-home/SchoolHeader';
import SchoolHighlights from './school-home/SchoolHighlights';

const revealDirections = [
  'left',
  'right',
  'bottom',
  'top',
  'left',
  'right',
  'scale',
  'bottom',
  'left',
  'right',
] as const;

const SchoolHomePage = () => {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    sections.forEach((section, index) => {
      section.dataset.revealDirection =
        revealDirections[index % revealDirections.length];
    });

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
        <FaqSection />
      </main>
      <SchoolFooter />
    </div>
  );
};

export default SchoolHomePage;
