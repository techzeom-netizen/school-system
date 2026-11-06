import { ArrowRight, BookOpen, GraduationCap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedHeading from './motion/AnimatedHeading';
import {
  DirectionalReveal,
  RevealSection,
  StaggerGroup,
} from './motion/MotionPrimitives';
import { staggerItemVariants } from './motion/animationConfig';

const AboutSection = () => (
  <RevealSection
    id="about"
    direction="left"
    className="bg-[#f7f3e8] py-16 lg:py-20"
  >
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="grid gap-8 border-b border-slate-300 pb-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
        <DirectionalReveal direction="left">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#7a1724]">
            About the school
          </p>
          <AnimatedHeading className="mt-3 max-w-lg text-2xl font-bold leading-tight text-[#071f3d] sm:text-3xl">
            A caring school with clear expectations.
          </AnimatedHeading>
        </DirectionalReveal>
        <DirectionalReveal direction="right" delay={0.08}>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            KD Public School brings teachers and families together around one
            goal: helping every child become capable, curious and kind. We
            combine strong academic foundations with practical learning and
            individual attention.
          </p>
          <Link
            to="/about-us"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#071f3d] hover:text-[#7a1724]"
          >
            Read our story and meet the school
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </DirectionalReveal>
      </div>

      <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-3">
        <motion.article
          custom="left"
          variants={staggerItemVariants}
          className="premium-card rounded-md border border-slate-200 bg-white p-6"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5efe0] text-[#071f3d]">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-lg font-bold text-[#071f3d]">
            Known and supported
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Teachers know their students well and keep families informed.
          </p>
        </motion.article>
        <motion.article
          custom="up"
          variants={staggerItemVariants}
          className="premium-card rounded-md border border-slate-200 bg-white p-6"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5efe0] text-[#071f3d]">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-lg font-bold text-[#071f3d]">
            Ready to learn
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A balanced CBSE curriculum builds knowledge and confidence.
          </p>
        </motion.article>
        <motion.article
          custom="right"
          variants={staggerItemVariants}
          className="premium-card rounded-md border border-slate-200 bg-[#7a1724] p-6 text-white"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#d4a62f]">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-lg font-bold">Prepared for tomorrow</h3>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Students leave with the skills and values to take their next step.
          </p>
        </motion.article>
      </StaggerGroup>
    </div>
  </RevealSection>
);

export default AboutSection;
