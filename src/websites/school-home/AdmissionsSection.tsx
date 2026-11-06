import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AnimatedHeading from './motion/AnimatedHeading';
import { RevealSection, StaggerGroup } from './motion/MotionPrimitives';
import { staggerItemVariants } from './motion/animationConfig';

const AdmissionsSection = () => (
  <RevealSection
    id="admissions"
    className="bg-gradient-to-br to-[#5c141e] via-[#7a1724] from-[#9a3342] py-20 text-white lg:py-24"
    data-reveal
  >
    <StaggerGroup className="mx-auto grid min-w-0 max-w-7xl gap-8 px-4 sm:px-5 lg:grid-cols-[1.1fr_.9fr] lg:items-start lg:gap-12 lg:px-8">
      <motion.div
        className="min-w-0"
        custom="left"
        variants={staggerItemVariants}
      >
        <p className="text-sm font-bold uppercase tracking-[.18em] text-[#d4a62f]">
          Admissions
        </p>
        <AnimatedHeading className="mt-2 text-2xl font-semibold sm:text-3xl">
          We would be pleased to meet your family.
        </AnimatedHeading>
        <p className="mt-3 max-w-xl text-base leading-7 text-white/75">
          The best way to understand KD Public School is to visit. Our
          admissions team can answer questions about year groups, the school
          day, transport and the application process.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            asChild
            size="lg"
            className="w-full rounded-md bg-[#d4a62f] px-6 font-bold text-[#071f3d] hover:bg-[#f0d47a] sm:w-auto"
          >
            <a href="mailto:admissions@kdpublicschool.edu">
              Contact admissions
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full rounded-md border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
          >
            <a href="tel:+919876543210">+91 98765 43210</a>
          </Button>
        </div>
      </motion.div>
      <motion.div
        custom="right"
        variants={staggerItemVariants}
        className="premium-card min-w-0 border border-white/20 p-5 sm:p-7"
      >
        <p className="text-sm font-bold uppercase tracking-[.18em] text-[#d4a62f]">
          Next open morning
        </p>
        <p className="mt-4 text-xl sm:text-2xl">Saturday, 14 December</p>
        <p className="mt-2 text-white/70">10:00 am to 12:00 pm</p>
        <p className="mt-6 border-t border-white/20 pt-5 text-sm leading-6 text-white/70">
          A short tour, a conversation with our team and time to see the school
          in action.
        </p>
      </motion.div>
    </StaggerGroup>
  </RevealSection>
);

export default AdmissionsSection;
