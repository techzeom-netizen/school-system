import { type MouseEvent, useEffect, useState } from 'react';
import { ArrowUpRight, Check, Users } from 'lucide-react';
import { heroChecks, heroStats } from './employerPortalData';
import { hrmsHero } from './hrmsData';
import RecruiterLoginCard from './RecruiterLoginCard';

interface EmployerHeroProps {
  onRegister: () => void;
}

/** Counts up "10K+", "5L+", "2K+" style values on mount. */
const useCountUp = (raw: string, duration = 1400) => {
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(raw.trim());
  const target = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : '';
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setCurrent(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  if (target === null) return raw;
  const shown = Number.isInteger(target)
    ? Math.round(current).toString()
    : current.toFixed(1);
  return `${shown}${suffix}`;
};

const Stat = ({ value, label }: { value: string; label: string }) => {
  const display = useCountUp(value);
  return (
    <div className="px-5 py-3 sm:px-7">
      <p className="text-2xl font-extrabold tabular-nums text-white sm:text-3xl">
        {display}
      </p>
      <p className="mt-1 text-sm text-white/80">{label}</p>
    </div>
  );
};

const EmployerHero = ({ onRegister }: EmployerHeroProps) => {
  const scrollToHrms = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById('free-hrms')?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };

  return (
    <section
      aria-labelledby="employer-hero-title"
      className="relative overflow-hidden bg-[#c6d5ed5d] dark:bg-slate-900"
    >
      {/* Flat geometric shapes instead of blurry glows */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#4380f02d] dark:bg-slate-900" />
      <div className="pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto grid w-full max-w-[1320px] items-center gap-14 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-20 lg:px-8 lg:py-20">
        {/* Left column */}
        <div>
          {/* ADDED: "Free HRMS included" pill sits next to the existing badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className="hx-rise inline-flex items-center gap-2 rounded-md bg-blue-800 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white"
              style={{ animationDelay: '0ms' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-900/40" />
              Recruiter portal
            </div>
            <div
              className="hx-rise inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white"
              style={{ animationDelay: '60ms' }}
            >
              {hrmsHero.pill}
            </div>
          </div>

          <h1
            id="employer-hero-title"
            className="hx-rise mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-[60px]"
            style={{ animationDelay: '90ms' }}
          >
            Hire the right talent,{' '}
            <span className="relative inline-block whitespace-nowrap text-blue-800 dark:text-blue-300">
              faster.
            </span>
          </h1>

          <p
            className="hx-rise mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300"
            style={{ animationDelay: '180ms' }}
          >
            Post jobs, search verified candidates and manage your entire hiring
            pipeline from one place.
          </p>

          <div
            className="hx-rise mt-7 max-w-xl"
            style={{ animationDelay: '220ms' }}
          >
            <a
              href="#free-hrms"
              onClick={scrollToHrms}
              className="group flex items-center gap-4 rounded-xl border-2 border-blue-800 bg-white dark:bg-slate-800/50 dark:border-white/60 p-4 shadow-[5px_5px_0_0_#7a1724] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#7a1724] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-700 motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-800 text-white">
                <Users className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100">
                    {hrmsHero.title}
                  </span>
                  <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
                    {hrmsHero.tag}
                  </span>
                </span>
                <span className="mt-0.5 block text-sm leading-5 text-slate-600 dark:text-slate-300">
                  {hrmsHero.text}
                </span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-blue-800 dark:text-blue-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </a>
          </div>

          {/* Plain checklist */}
          <ul className="mt-7 space-y-3">
            {heroChecks.map((item, i) => (
              <li
                key={item}
                className="hx-rise flex items-center gap-3 text-[15px] font-semibold text-slate-800 dark:text-slate-100"
                style={{ animationDelay: `${260 + i * 80}ms` }}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-600">
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Dark stats block */}
          <div
            className="hx-rise mt-8 grid max-w-2xl grid-cols-3 divide-x divide-white/10 dark:divide-slate-700/10 rounded-xl border-2 border-white dark:border-slate-700  bg-blue-800 p-2 shadow-[5px_5px_0_0_#c96b7c]"
            style={{ animationDelay: '520ms' }}
          >
            {heroStats.map(stat => (
              <Stat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="hx-rise relative" style={{ animationDelay: '200ms' }}>
          {/* solid offset block behind the card */}
          <div className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 rounded-2xl bg-blue-800 shadow-lg" />

          <div className="relative">
            <RecruiterLoginCard onRegister={onRegister} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerHero;
