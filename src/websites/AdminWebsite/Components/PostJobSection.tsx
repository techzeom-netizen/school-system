import { ArrowRight, CheckCircle2, ClipboardList, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { postJobHighlights, postJobPreviewFields } from './employerPortalData';

interface PostJobSectionProps {
  onRegister: () => void;
}

const PostJobSection = ({ onRegister }: PostJobSectionProps) => (
  <section
    id="post-job"
    className="scroll-mt-24 bg-white dark:bg-slate-900 py-16 lg:py-20"
    aria-labelledby="post-job-title"
  >
    <div className="mx-auto grid w-full max-w-[1560px] items-center gap-10 px-5 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-400">
          Post job
        </p>
        <h2
          id="post-job-title"
          className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 lg:text-4xl"
        >
          Publish a role that attracts the right candidates.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Build clear job listings with the details candidates need, then manage
          every application from the recruiter workspace.
        </p>

        <div className="mt-7 space-y-3">
          {postJobHighlights.map(item => (
            <p
              key={item}
              className="flex items-start gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              {item}
            </p>
          ))}
        </div>

        <Button
          type="button"
          onClick={onRegister}
          className="group mt-7 inline-flex h-12 items-center gap-2  divide-x divide-white/10 dark:divide-slate-700/10 rounded-xl border-2 border-white dark:border-white/60 bg-blue-800 p-2 shadow-[5px_5px_0_0_#607cbd]  hover:bg-blue-800 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#1e40af] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:transition-none lg:mt-[clamp(1rem,3.4vh,1.75rem)] dark:text-white"
        >
          Register to post a job
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-blue-800  dark:border-white/60 p-2 shadow-[5px_5px_0_0_#1e40af]">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-white/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
              <ClipboardList className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-700 dark:text-slate-200">
                New job listing
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Draft preview
              </p>
            </div>
          </div>
          <span className="rounded-full bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
            Draft
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {postJobPreviewFields.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                {label}
              </p>
              <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Required skills
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind', 'API integration'].map(
              skill => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-50 dark:bg-blue-800/40 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-400"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        <div className="mt-5 p-6 flex flex-wrap items-center justify-between gap-3 divide-x divide-white/10 dark:divide-slate-700/10 rounded-xl border-2 border-white dark:border-white/60 bg-blue-800 dark:bg-blue-900">
          <div>
            <p className="text-sm font-bold text-white">Ready to publish?</p>
            <p className="text-xs text-blue-100">
              Preview, publish and start receiving applications.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-8 dark:border-white/60 items-center gap-2 rounded-lg bg-white dark:bg-slate-900 px-4 text-sm font-bold text-blue-700 dark:text-blue-400"
          >
            Publish
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default PostJobSection;
