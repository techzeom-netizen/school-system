import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, CheckCircle2, Pause, Play, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { steps } from './data/landingContent';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(
    () =>
      typeof window === 'undefined' ||
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const current = steps[activeStep];
  const ActiveIcon = current.icon;
  const progress = Math.min(100, (elapsed / 6000) * 100);
  const selectStep = (index: number) => {
    elapsedRef.current = 0;
    setElapsed(0);
    setActiveStep(index);
  };

  useEffect(() => {
    if (!isPlaying) return;
    let previousTick = Date.now();
    const resetClock = () => {
      previousTick = Date.now();
    };
    const timer = window.setInterval(() => {
      const now = Date.now();
      const delta = now - previousTick;
      previousTick = now;
      if (document.hidden) return;
      elapsedRef.current += delta;
      if (elapsedRef.current >= 6000) {
        elapsedRef.current = 0;
        setActiveStep(step => (step + 1) % steps.length);
      }
      setElapsed(elapsedRef.current);
    }, 100);
    document.addEventListener('visibilitychange', resetClock);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', resetClock);
    };
  }, [isPlaying, activeStep]);

  return (
    <section
      aria-labelledby="how-it-works-heading"
      style={
        {
          '--step-accent': current.accent,
          '--step-tint': current.tint,
        } as CSSProperties
      }
      className="mx-auto w-full max-w-[1560px] px-5 py-10 lg:px-8 lg:py-12"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="how-it-works-heading"
            className="text-2xl font-bold text-gray-800 dark:text-slate-100"
          >
            How it works
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
            Three simple steps to your next opportunity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={
              isPlaying
                ? 'Pause automatic step changes'
                : 'Play automatic step changes'
            }
            onClick={() => setIsPlaying(playing => !playing)}
            className="rounded-full border-blue-100 dark:border-blue-900 bg-white dark:bg-slate-900 px-4 text-blue-700 dark:text-blue-400 shadow-sm focus-visible:ring-blue-600"
          >
            {isPlaying ? (
              <Pause aria-hidden="true" className="size-3.5" />
            ) : (
              <Play aria-hidden="true" className="size-3.5" />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-stretch lg:gap-6">
        <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:grid-rows-3">
          {steps.map(({ title, icon: Icon, accent, tint }, index) => (
            <li key={title} className="min-w-0">
              <Button
                type="button"
                variant="outline"
                aria-pressed={activeStep === index}
                aria-controls="how-it-works-detail"
                onClick={() => selectStep(index)}
                style={
                  {
                    '--phase-accent': accent,
                    '--phase-tint': tint,
                  } as CSSProperties
                }
                className={cn(
                  'relative h-full min-h-[96px] w-full min-w-0 items-center justify-start gap-3 overflow-hidden whitespace-normal rounded-2xl border border-[color:color-mix(in_srgb,var(--phase-accent)_40%,white)] bg-white dark:bg-slate-900 p-4 text-left transition-all duration-200 hover:shadow-sm focus-visible:ring-blue-600 motion-reduce:transition-none sm:flex-col sm:items-start lg:flex-row lg:items-center',
                  activeStep === index
                    ? 'border-[color:color-mix(in_srgb,var(--phase-accent)_65%,white)] bg-gradient-to-r from-[var(--phase-tint)] dark:from-[color:color-mix(in_srgb,var(--phase-tint)_12%,#0f172a)] to-white dark:to-slate-900 text-gray-900 dark:text-slate-100 shadow-[0_6px_20px_-16px_var(--phase-accent)] hover:bg-[var(--phase-tint)] dark:hover:bg-[color:color-mix(in_srgb,var(--phase-tint)_12%,#0f172a)] hover:text-gray-900 dark:hover:text-slate-100'
                    : 'text-gray-700 dark:text-slate-200 hover:border-[var(--phase-accent)] hover:bg-[var(--phase-tint)] dark:hover:bg-[color:color-mix(in_srgb,var(--phase-tint)_12%,#0f172a)]'
                )}
              >
                {activeStep === index && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-[var(--phase-accent)]"
                  />
                )}
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                    activeStep === index
                      ? 'bg-white dark:bg-slate-900 text-[var(--phase-accent)] dark:text-[color:color-mix(in_srgb,var(--phase-accent)_60%,white)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--phase-accent)_12%,white)]'
                      : 'bg-[var(--phase-tint)] dark:bg-[color:color-mix(in_srgb,var(--phase-tint)_12%,#0f172a)] text-[var(--phase-accent)] dark:text-[color:color-mix(in_srgb,var(--phase-accent)_60%,white)]'
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-widest text-[var(--phase-accent)] dark:text-[color:color-mix(in_srgb,var(--phase-accent)_60%,white)]">
                    Step {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-1 block text-sm font-semibold">
                    {title}
                  </span>
                </span>
                {activeStep === index && (
                  <ArrowRight
                    aria-hidden="true"
                    className="hidden size-4 shrink-0 text-[var(--phase-accent)] dark:text-[color:color-mix(in_srgb,var(--phase-accent)_60%,white)] lg:block"
                  />
                )}
              </Button>
            </li>
          ))}
        </ol>

        <div
          id="how-it-works-detail"
          className="relative min-w-0 overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--step-accent)_55%,white)] bg-white dark:bg-slate-900 p-5 shadow-[0_10px_30px_-24px_var(--step-accent)] sm:p-6"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-44 w-72 rounded-full bg-[var(--step-tint)] dark:bg-[color:color-mix(in_srgb,var(--step-tint)_12%,#0f172a)] opacity-90 sm:w-80"
          />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--step-tint)] dark:bg-[color:color-mix(in_srgb,var(--step-tint)_12%,#0f172a)] text-[var(--step-accent)] dark:text-[color:color-mix(in_srgb,var(--step-accent)_60%,white)]">
                <ActiveIcon aria-hidden="true" className="size-6" />
              </span>
              <span className="rounded-full border border-[color:color-mix(in_srgb,var(--step-accent)_20%,white)] bg-[var(--step-tint)] dark:bg-[color:color-mix(in_srgb,var(--step-tint)_12%,#0f172a)] px-3 py-1 text-xs font-semibold text-[var(--step-accent)] dark:text-[color:color-mix(in_srgb,var(--step-accent)_60%,white)]">
                Step {activeStep + 1} of {steps.length}
              </span>
            </div>
            <div aria-live={isPlaying ? 'off' : 'polite'} aria-atomic="true">
              <h3 className="text-xl font-bold tracking-tight text-gray-950 dark:text-slate-100 sm:text-2xl">
                {current.headline}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-slate-300">
                {current.text}
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {current.highlights.map(highlight => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm leading-5 text-gray-700 dark:text-slate-200"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[var(--step-accent)] dark:text-[color:color-mix(in_srgb,var(--step-accent)_60%,white)]"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: 'Focus',
                    value: current.focus,
                    icon: Target,
                    cardClass:
                      'border-[color:color-mix(in_srgb,var(--step-accent)_30%,white)] bg-gradient-to-r from-[var(--step-tint)] dark:from-[color:color-mix(in_srgb,var(--step-tint)_12%,#0f172a)] to-white dark:to-slate-900',
                    accentClass:
                      'text-[var(--step-accent)] dark:text-[color:color-mix(in_srgb,var(--step-accent)_60%,white)]',
                  },
                  {
                    label: 'Next step',
                    value: current.next,
                    icon: ArrowRight,
                    cardClass:
                      'border-sky-200 dark:border-sky-800 bg-gradient-to-r from-sky-50 dark:from-sky-950/40 to-white dark:to-slate-900',
                    accentClass: 'text-sky-700 dark:text-sky-400',
                  },
                ].map(
                  ({ label, value, icon: Icon, cardClass, accentClass }) => (
                    <div
                      key={label}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border px-4 py-3',
                        cardClass
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/80 dark:bg-slate-900/80',
                          accentClass
                        )}
                      >
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <div>
                        <p className={cn('text-xs font-medium', accentClass)}>
                          {label}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-800 dark:text-slate-100">
                          {value}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="mt-5 border-t border-gray-100 dark:border-slate-800 pt-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-gray-700 dark:text-slate-200">
                  Your journey{' '}
                  <span className="font-normal text-gray-400">
                    / Step {activeStep + 1} of {steps.length}
                  </span>
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Time until the next journey step"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-valuetext={
                  Math.round(progress) + '% of the current step preview'
                }
                className="grid grid-cols-3 gap-2"
              >
                {steps.map(({ title, accent, tint }, index) => (
                  <div
                    key={title}
                    style={
                      {
                        '--segment-accent': accent,
                        '--segment-tint': tint,
                        '--segment-progress':
                          (index < activeStep
                            ? 100
                            : index === activeStep
                              ? progress
                              : 0) + '%',
                      } as CSSProperties
                    }
                  >
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--segment-tint)] dark:bg-[color:color-mix(in_srgb,var(--segment-tint)_12%,#0f172a)]">
                      <span className="block h-full w-[var(--segment-progress)] rounded-full bg-[color-mix(in_srgb,var(--segment-accent)_70%,white)] transition-[width] duration-100 ease-linear motion-reduce:transition-none" />
                    </div>
                    <span
                      className={cn(
                        'mt-2 block text-[10px] font-semibold sm:text-xs',
                        index <= activeStep
                          ? 'text-[var(--segment-accent)] dark:text-[color:color-mix(in_srgb,var(--segment-accent)_60%,white)]'
                          : 'text-gray-400'
                      )}
                    >
                      Step {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorksSection;
