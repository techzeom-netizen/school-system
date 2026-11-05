import { CheckCircle2 } from 'lucide-react';
import { comparisonRows } from './employerPortalData';
import SectionHeading from './SectionHeading';

const ComparisonSection = () => (
  <section
    className="bg-white dark:bg-slate-900 py-16 lg:py-20"
    aria-labelledby="comparison-title"
  >
    <div className="mx-auto w-full max-w-[1560px] px-5 lg:px-8">
      <SectionHeading
        id="comparison-title"
        eyebrow="Compare"
        title="A smarter way to hire"
        subtitle="Replace scattered hiring work with a focused recruiter platform."
      />
      <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/60 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/60">
              <th className="px-5 py-4 font-bold text-slate-700 dark:text-slate-200">
                Feature
              </th>
              <th className="bg-blue-200 dark:bg-blue-950/50  px-5 py-4 font-bold text-blue-800 dark:text-blue-300">
                Demo School
              </th>
              <th className="px-5 py-4 font-bold text-slate-700 dark:text-slate-200">
                Traditional hiring
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map(([feature, schoolSystem, traditional]) => (
              <tr
                key={feature}
                className="border-b border-slate-100 dark:border-white/60 last:border-b-0"
              >
                <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-100">
                  {feature}
                </td>
                <td className="bg-blue-50 dark:bg-blue-950/40 px-5 py-4 font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {schoolSystem}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500 dark:text-white/90">
                  {traditional}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default ComparisonSection;
