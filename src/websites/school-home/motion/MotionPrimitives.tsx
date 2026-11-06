import { motion, type HTMLMotionProps } from 'framer-motion';
import {
  directionOffset,
  premiumEase,
  revealDuration,
  revealDistance,
  revealViewport,
  staggerContainerVariants,
  type RevealDirection,
} from './animationConfig';

interface RevealSectionProps extends HTMLMotionProps<'section'> {
  direction?: RevealDirection;
}

export const RevealSection = ({
  children,
  direction = 'up',
  ...props
}: RevealSectionProps) => {
  const offset = directionOffset(direction, 10);

  return (
    <motion.section
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: revealDuration, ease: premiumEase }}
      {...props}
    >
      {children}
    </motion.section>
  );
};

interface DirectionalRevealProps extends HTMLMotionProps<'div'> {
  direction?: RevealDirection;
  delay?: number;
}

export const DirectionalReveal = ({
  children,
  direction = 'up',
  delay = 0,
  ...props
}: DirectionalRevealProps) => (
  <motion.div
    initial={{ opacity: 0, ...directionOffset(direction, revealDistance + 8) }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={revealViewport}
    transition={{ duration: revealDuration, delay, ease: premiumEase }}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerGroup = ({
  children,
  ...props
}: HTMLMotionProps<'div'>) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={revealViewport}
    variants={staggerContainerVariants}
    {...props}
  >
    {children}
  </motion.div>
);
