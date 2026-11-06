import type { Variants } from 'framer-motion';

// Central animation tuning: adjust duration, distance and stagger here.
export const premiumEase = [0.22, 1, 0.36, 1] as const;
export const revealDistance = 30;
export const revealDuration = 0.75;
export const staggerDelay = 0.1;
export type RevealDirection = 'up' | 'down' | 'left' | 'right';

export const directionOffset = (
  direction: RevealDirection,
  distance = revealDistance
) => ({
  x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
  y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
});

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: revealDistance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: revealDuration, ease: premiumEase },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.08,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: (direction: RevealDirection = 'up') => ({
    opacity: 0,
    ...directionOffset(direction, 32),
    scale: 0.985,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.68, ease: premiumEase },
  },
};

export const revealViewport = { once: true, amount: 0.16 } as const;
