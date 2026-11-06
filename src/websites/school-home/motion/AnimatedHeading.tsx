import { motion } from 'framer-motion';
import { premiumEase, revealViewport } from './animationConfig';

interface AnimatedHeadingProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2';
}

const AnimatedHeading = ({
  children,
  className,
  as = 'h2',
}: AnimatedHeadingProps) => {
  const Heading = as === 'h1' ? motion.h1 : motion.h2;

  return (
    <Heading
      className={className}
      aria-label={children}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.055 } },
      }}
    >
      {children.split(' ').map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="mr-[.24em] inline-block"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.62, ease: premiumEase },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </Heading>
  );
};

export default AnimatedHeading;
