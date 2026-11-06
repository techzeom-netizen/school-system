import { motion } from 'framer-motion';
import AnimatedHeading from './motion/AnimatedHeading';
import {
  DirectionalReveal,
  RevealSection,
  StaggerGroup,
} from './motion/MotionPrimitives';
import { staggerItemVariants } from './motion/animationConfig';

const academicAreas = [
  {
    title: 'Early Years',
    years: 'Nursery to UKG',
    text: 'Play-based learning that builds language, number sense and social skills.',
  },
  {
    title: 'Primary',
    years: 'Classes I to V',
    text: 'Strong foundations in English, Hindi, Mathematics, EVS and Computers.',
  },
  {
    title: 'Secondary',
    years: 'Classes VI to X',
    text: 'Subject teaching, practical labs and focused preparation for Class X boards.',
  },
  {
    title: 'Senior Secondary',
    years: 'Classes XI and XII',
    text: 'Science (PCM / PCB), Commerce and Humanities.',
  },
];

const AcademicsSection = () => (
  <RevealSection
    id="academics"
    direction="up"
    className="bg-[#f7f3e8] py-20 lg:py-24"
  >
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <DirectionalReveal direction="left" className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-[#7a1724]">
          Academics
        </p>
        <AnimatedHeading className="mt-2 text-2xl font-semibold text-[#071f3d] sm:text-3xl">
          Academics
        </AnimatedHeading>
        <p className="mt-5 text-base leading-7 text-slate-600">
          CBSE curriculum from Nursery to Class XII.
        </p>
      </DirectionalReveal>
      <StaggerGroup className="mt-10 grid border border-slate-300 sm:grid-cols-2 lg:grid-cols-4">
        {academicAreas.map((area, index) => (
          <motion.article
            key={area.title}
            custom={(['left', 'down', 'up', 'right'] as const)[index]}
            variants={staggerItemVariants}
            className="premium-card border-b border-slate-300 bg-[#f7f3e8] p-7 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0 lg:p-8"
          >
            <p className="text-sm font-bold text-[#7a1724]">0{index + 1}</p>
            <h3 className="mt-10 text-2xl font-semibold text-[#071f3d]">
              {area.title}
            </h3>
            <p className="mt-2 text-sm font-bold text-[#7a1724]">
              {area.years}
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-600">{area.text}</p>
          </motion.article>
        ))}
      </StaggerGroup>
    </div>
  </RevealSection>
);

export default AcademicsSection;
