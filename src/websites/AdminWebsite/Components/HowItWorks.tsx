import { howItWorksItems } from './employerPortalData';
import SectionHeading from './SectionHeading';

const HowItWorks = () => (
  <section
    id="how-it-works"
    className="scroll-mt-24 bg-white dark:bg-slate-900 py-16 lg:py-20"
    aria-labelledby="how-it-works-title"
  >
    <div className="mx-auto w-full max-w-[1560px] px-5 lg:px-8">
      <SectionHeading
        id="how-it-works-title"
        eyebrow="How it works"
        title="Start hiring in four simple steps"
        subtitle="Move from account setup to candidate conversations with a clear hiring flow."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {howItWorksItems.map((item, index) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-lg font-extrabold text-white">
              {index + 1}
            </span>
            <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-slate-100">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
