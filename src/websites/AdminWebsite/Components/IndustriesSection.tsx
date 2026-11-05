import { industries } from './employerPortalData';
import SectionHeading from './SectionHeading';

const tileColors = [
  'bg-blue-600',
  'bg-violet-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-sky-500',
  'bg-rose-600',
  'bg-teal-500',
  'bg-slate-600',
];

const IndustriesSection = () => (
  <section
    className="bg-blue-100/60 dark:bg-blue-950/50  py-16 lg:py-20"
    aria-labelledby="industries-title"
  >
    <div className="mx-auto w-full max-w-[1560px] px-5 lg:px-8">
      <SectionHeading
        eyebrow=" Hire across industries"
        title="Talent for every team you build"
        subtitle="Reach skilled professionals in the fields you hire for most."
      />
      <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
        {industries.map(([initials, title, count], index) => (
          <article
            key={title}
            className="flex min-h-[116px] items-center gap-6 rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-7 py-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md motion-reduce:transform-none"
          >
            <div
              className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg text-xl font-extrabold text-white ${tileColors[index]}`}
            >
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-extrabold leading-tight text-slate-700 dark:text-slate-200">
                {title}
              </h3>
              <p className="mt-2 text-base font-medium text-slate-500 dark:text-slate-400">
                {count}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default IndustriesSection;
