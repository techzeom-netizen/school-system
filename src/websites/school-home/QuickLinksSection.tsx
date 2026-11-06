import {
  Award,
  Bus,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileBadge,
  GraduationCap,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HomeSectionLink from './HomeSectionLink';
import AnimatedHeading from './motion/AnimatedHeading';
import {
  DirectionalReveal,
  RevealSection,
  StaggerGroup,
} from './motion/MotionPrimitives';
import { staggerItemVariants } from './motion/animationConfig';

type QuickLink = {
  title: string;
  caption: string;
  icon: LucideIcon;
} & ({ kind: 'section'; sectionId: string } | { kind: 'route'; to: string });

const quickLinks: QuickLink[] = [
  {
    kind: 'section',
    title: 'Admission',
    caption: 'Process and dates',
    sectionId: 'admissions',
    icon: ClipboardCheck,
  },
  {
    kind: 'section',
    title: 'Fee structure',
    caption: 'Class-wise fees',
    sectionId: 'academics',
    icon: FileBadge,
  },
  {
    kind: 'route',
    title: 'Downloads',
    caption: 'Forms and circulars',
    to: '/notice-board',
    icon: Download,
  },
  {
    kind: 'route',
    title: 'Mandatory disclosure',
    caption: 'CBSE public information',
    to: '/about-us',
    icon: CheckCircle2,
  },
  {
    kind: 'section',
    title: 'Results',
    caption: 'Board performance',
    sectionId: 'academics',
    icon: Award,
  },
  {
    kind: 'section',
    title: 'Transfer certificate',
    caption: 'Request and verify',
    sectionId: 'contact',
    icon: GraduationCap,
  },
  {
    kind: 'section',
    title: 'Transport',
    caption: 'Routes and timings',
    sectionId: 'facilities',
    icon: Bus,
  },
  {
    kind: 'section',
    title: 'Contact',
    caption: 'Address and map',
    sectionId: 'contact',
    icon: MapPin,
  },
];

const QuickLinksSection = () => (
  <RevealSection
    id="quick-links"
    direction="right"
    className="bg-white py-20 lg:py-24"
  >
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <DirectionalReveal direction="left">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-[#7a1724]">
          Explore
        </p>
        <AnimatedHeading className="mt-2 text-2xl font-semibold text-[#071f3d] sm:text-3xl">
          Quick links
        </AnimatedHeading>
        <p className="mt-4 text-base text-slate-600">
          What parents and students look for most.
        </p>
      </DirectionalReveal>
      <StaggerGroup className="mt-10 grid grid-cols-1 border-l border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link, index) => {
          const { title, caption, icon: Icon } = link;
          const content = (
            <>
              <Icon
                className="h-7 w-7 text-[#7a1724] transition-colors group-hover:text-[#d4a62f] group-focus-visible:text-[#d4a62f]"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <h3 className="mt-8 text-xl font-semibold text-[#071f3d] group-hover:text-white group-focus-visible:text-white">
                {title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 group-hover:text-white/70 group-focus-visible:text-white/70">
                {caption}
              </p>
            </>
          );
          const className =
            'group min-h-40 border-b border-r border-slate-200 bg-white p-6 transition-colors hover:bg-[#7a1724] focus-visible:bg-[#7a1724] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a62f]';

          return (
            <motion.div
              key={title}
              custom={(['left', 'down', 'up', 'right'] as const)[index % 4]}
              variants={staggerItemVariants}
              className="h-full"
            >
              {link.kind === 'section' ? (
                <HomeSectionLink
                  sectionId={link.sectionId}
                  className={`${className} premium-card block h-full`}
                >
                  {content}
                </HomeSectionLink>
              ) : (
                <Link
                  to={link.to}
                  className={`${className} premium-card block h-full`}
                >
                  {content}
                </Link>
              )}
            </motion.div>
          );
        })}
      </StaggerGroup>
    </div>
  </RevealSection>
);

export default QuickLinksSection;
