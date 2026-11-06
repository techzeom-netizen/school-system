import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  value: string;
}

const CountUp = ({ value }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const reduceMotion = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : null;
  const suffix = match?.[2] ?? '';
  const [display, setDisplay] = useState(
    target === null ? value : `0${suffix}`
  );

  useEffect(() => {
    if (!inView || target === null) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const duration = 1100;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${Math.round(target * eased)}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, suffix, target, value]);

  return <span ref={ref}>{display}</span>;
};

export default CountUp;
