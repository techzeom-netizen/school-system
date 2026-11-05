import { Plus } from 'lucide-react';
import { faqs } from './employerPortalData';
import SectionHeading from './SectionHeading';

const FaqSection = () => (
  <section
    className="bg-white dark:bg-slate-900 py-16 lg:py-20"
    aria-labelledby="faq-title"
  >
    <div className="mx-auto w-full max-w-[1560px] px-5 lg:px-8">
      <SectionHeading
        id="faq-title"
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Answers for school teams evaluating Demo School for campus operations."
      />
      <div className="mx-auto mt-10 max-w-4xl space-y-3">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            open={index === 0}
            className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:border-white/60 dark:bg-slate-800/50 p-5 shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-slate-950 dark:text-slate-100">
              {faq.question}
              <Plus className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-400 transition group-open:rotate-45" />
            </summary>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FaqSection;
