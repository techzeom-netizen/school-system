import { ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { candidateRows } from './employerPortalData';

interface CandidateSearchShowcaseProps {
  onRegister: () => void;
}

const CandidateSearchShowcase = ({
  onRegister,
}: CandidateSearchShowcaseProps) => (
  <section
    id="candidate-search"
    className="scroll-mt-24 bg-blue-100/60 dark:bg-blue-950/50  py-16 lg:py-20"
    aria-labelledby="candidate-search-title"
  >
    <div className="mx-auto grid w-full max-w-[1560px] items-center gap-10 px-5 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-400">
          Candidate search
        </p>
        <h2
          id="candidate-search-title"
          className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 lg:text-4xl"
        >
          Find the right candidate in minutes, not weeks
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Search across structured candidate profiles, compare skill matches and
          save the people your team wants to contact next.
        </p>
        <div className="mt-7 space-y-3">
          {[
            'Search by skills, role and location',
            'Review profile highlights before outreach',
            'Build shortlists for every open role',
          ].map(item => (
            <p
              key={item}
              className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              {item}
            </p>
          ))}
        </div>
        <Button
          type="button"
          onClick={onRegister}
          className="group mt-7 inline-flex h-12 items-center gap-2   divide-x divide-white/10 dark:divide-slate-700/10 rounded-xl border-2 border-white dark:border-white/60 bg-blue-800 p-2 shadow-[5px_5px_0_0_#607cbd]  hover:bg-blue-800 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#1e40af] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:transition-none lg:mt-[clamp(1rem,3.4vh,1.75rem)] dark:text-white"
        >
          Start searching
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Button>
      </div>

      <div className="rounded-2xl border-2 border-blue-800 bg-slate-50 dark:border-white/60 dark:bg-slate-900 p-5 shadow-[6px_6px_0_0_#1e40af]">
        <div className="flex gap-2 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-sm">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm text-slate-500 dark:text-slate-400">
            <Search className="h-4 w-4 shrink-0" />
            React developer - Bengaluru
          </div>
          <Button
            type="button"
            className="h-11 rounded-xl bg-blue-700 dark:text-white"
          >
            Search
          </Button>
        </div>
        <div className="mt-5 space-y-3">
          {candidateRows.map(candidate => (
            <article
              key={candidate.name}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-sm font-bold text-blue-700 dark:text-blue-400">
                  {candidate.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-950 dark:text-slate-100">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {candidate.role}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {candidate.match}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {candidate.skills.map(skill => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CandidateSearchShowcase;
