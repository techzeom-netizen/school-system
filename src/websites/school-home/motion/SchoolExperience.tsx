import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
} from 'framer-motion';

interface SchoolExperienceProps {
  children: ReactNode;
}

const SchoolExperience = ({ children }: SchoolExperienceProps) => {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.15,
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const buttons = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.school-home [data-slot="button"]'
      )
    );
    const cleanups = buttons.map(button => {
      const handleMove = (event: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.1;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.1;
        button.style.setProperty('--magnetic-x', `${x}px`);
        button.style.setProperty('--magnetic-y', `${y}px`);
      };
      const handleLeave = () => {
        button.style.setProperty('--magnetic-x', '0px');
        button.style.setProperty('--magnetic-y', '0px');
      };
      button.addEventListener('mousemove', handleMove);
      button.addEventListener('mouseleave', handleLeave);
      return () => {
        button.removeEventListener('mousemove', handleMove);
        button.removeEventListener('mouseleave', handleLeave);
      };
    });

    return () => cleanups.forEach(cleanup => cleanup());
  }, [reduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="fixed left-0 top-0 z-[110] h-[3px] w-full origin-left bg-[#d4a62f]"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      {children}
    </MotionConfig>
  );
};

export default SchoolExperience;
