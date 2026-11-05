import { assuranceItems } from './employerPortalData';

const AssuranceStrip = () => (
  <section
    className="bg-slate-50 dark:bg-slate-900/50 py-12"
    aria-label="Hiring assurances"
  >
    <div className="mx-auto grid w-full max-w-[1560px] gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
      {assuranceItems.map(({ icon: Icon, title, text }) => (
        <article
          key={title}
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 shadow-sm"
        >
          <Icon
            className="h-6 w-6 text-blue-700 dark:text-blue-400"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-base font-bold text-slate-950 dark:text-slate-100">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {text}
          </p>
        </article>
      ))}
    </div>
  </section>
);

export default AssuranceStrip;
