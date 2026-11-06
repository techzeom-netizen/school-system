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
import SchoolExperience from './school-home/motion/SchoolExperience';

const SchoolHomePage = () => {
  return (
    <SchoolExperience>
      <div className="school-home min-h-screen bg-white text-slate-800">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
          .school-home, .school-home button, .school-home input, .school-home textarea, .school-home select { font-family: 'Source Sans 3', sans-serif; }
          html.lenis, html.lenis body { height: auto; }
          .lenis.lenis-smooth { scroll-behavior: auto !important; }
          .lenis.lenis-stopped { overflow: hidden; }
          [id] { scroll-margin-top: 132px; }

          /* Premium hover tuning: transform/opacity only for smooth rendering. */
          .school-home .premium-card {
            transform-style: preserve-3d;
            transition: transform 420ms cubic-bezier(.22,1,.36,1), box-shadow 420ms cubic-bezier(.22,1,.36,1);
          }
          .school-home .image-frame { overflow: hidden; }
          .school-home .image-frame img {
            transition: transform 900ms cubic-bezier(.22,1,.36,1), opacity 400ms ease;
          }
          .school-home [data-slot="button"] {
            --magnetic-x: 0px;
            --magnetic-y: 0px;
            position: relative;
            overflow: hidden;
            transform: translate3d(var(--magnetic-x), var(--magnetic-y), 0);
            transition: transform 240ms cubic-bezier(.22,1,.36,1), background-color 200ms ease, color 200ms ease;
          }
          .school-home [data-slot="button"]::after {
            content: '';
            position: absolute;
            inset: 50%;
            border-radius: 999px;
            background: currentColor;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
            transition: transform 420ms ease, opacity 520ms ease;
          }
          .school-home [data-slot="button"]:active::after {
            opacity: .12;
            transform: translate(-50%, -50%) scale(12);
            transition-duration: 0ms;
          }

          @media (hover: hover) and (pointer: fine) {
            .school-home .premium-card:hover {
              transform: perspective(900px) translateY(-7px) rotateX(1.2deg) rotateY(-1.2deg);
              box-shadow: 0 22px 48px -28px rgba(7,31,61,.42);
            }
            .school-home .image-frame:hover img { transform: scale(1.055); }
            .school-home [data-slot="button"]:active {
              transform: translate3d(var(--magnetic-x), var(--magnetic-y), 0) scale(.97);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto !important; }
            .school-home *, .school-home *::before, .school-home *::after {
              animation-duration: .01ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
              transition-duration: .01ms !important;
            }
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
          <FaqSection />
        </main>
        <SchoolFooter />
      </div>
    </SchoolExperience>
  );
};

export default SchoolHomePage;
