import { featureItems } from './employerPortalData';
import SectionHeading from './SectionHeading';

const FeaturesSection = () => (
  <section
    aria-labelledby="features-title"
    className="bg-white dark:bg-slate-900 py-16 lg:py-20"
  >
    <div className="mx-auto w-full max-w-[1560px] px-5 lg:px-8">
      <SectionHeading
        id="features-title"
        eyebrow="Features"
        title="One platform for your entire hiring workflow"
        subtitle="Bring job posting, candidate search, pipeline tracking and team decisions into one recruiter workspace."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featureItems.map(({ icon: Icon, title, text, tint }) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg motion-reduce:transform-none"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-slate-100">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {text}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
