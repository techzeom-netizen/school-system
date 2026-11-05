import { CheckCircle2 } from 'lucide-react';
import { tools } from './data/landingContent';

const CareerToolsSection = () => (
  <section aria-labelledby="career-tools-heading">
    <div className="mx-auto w-full max-w-[1560px] px-5 py-10 lg:px-8 lg:py-12">
      <div>
        <h2
          id="how-it-works-heading"
          className="text-2xl font-bold text-gray-800 dark:text-slate-100"
        >
          Your job search, organized
        </h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-slate-200 sm:text-base">
          Save the companies you love, catch important updates, and follow every
          application.
        </p>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3 lg:gap-6">
        {tools.map(({ title, text, icon: Icon, highlights }) => (
          <article
            key={title}
            className="flex min-w-0 flex-col rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-5 shadow-[4px_4px_0_0_#dbeafe] sm:p-6"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white dark:border-slate-700 bg-blue-800 text-white shadow-[3px_3px_0_0_#bfdbfe]">
              <Icon aria-hidden="true" className="size-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-gray-950 dark:text-slate-100">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
              {text}
            </p>
            <ul className="mt-auto space-y-2.5 pt-5">
              {highlights.map(highlight => (
                <li
                  key={highlight}
                  className="flex items-start gap-2 text-xs leading-5 text-gray-600 dark:text-slate-300"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-blue-700 dark:text-blue-400"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  </section>
);
export default CareerToolsSection;
