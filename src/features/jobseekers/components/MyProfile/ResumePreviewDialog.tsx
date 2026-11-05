import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CandidateProfile } from '../../data/myProfile';

type ResumePreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: CandidateProfile;
};

const ResumePreviewDialog = ({
  open,
  onOpenChange,
  profile,
}: ResumePreviewDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="h-[92vh] max-w-5xl p-0">
      <DialogHeader className="border-b border-slate-100 dark:border-slate-800 px-5 py-4">
        <DialogTitle>Resume preview</DialogTitle>
      </DialogHeader>
      {profile.resume?.url ? (
        <iframe
          src={profile.resume.url}
          title={`${profile.fullName} resume preview`}
          className="h-[calc(92vh-73px)] w-full"
        />
      ) : (
        <div className="h-[calc(92vh-73px)] overflow-y-auto bg-slate-100 dark:bg-slate-800 p-4 sm:p-6">
          <article className="mx-auto min-h-full max-w-3xl rounded-lg bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 dark:border-slate-700 pb-5">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">
                {profile.fullName}
              </h2>
              <p className="mt-1 text-sm font-semibold text-blue-700 dark:text-blue-400">
                {profile.headline}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {profile.location} | {profile.email} | {profile.phone}
              </p>
            </div>
            <section className="mt-5">
              <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
                Summary
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                {profile.summary}
              </p>
            </section>
            <section className="mt-5">
              <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
                Experience
              </h3>
              <div className="mt-3 space-y-4">
                {profile.experienceList.map(item => (
                  <div key={item.id}>
                    <div className="flex flex-wrap justify-between gap-2">
                      <p className="font-bold text-slate-950 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.period}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.subtitle}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-5">
              <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
                Skills
              </h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                {profile.skills.join(', ')}
              </p>
            </section>
            {profile.projects.length > 0 && (
              <section className="mt-5">
                <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
                  Projects
                </h3>
                <div className="mt-3 space-y-3">
                  {profile.projects.map(project => (
                    <div key={project.id}>
                      <p className="font-bold text-slate-950 dark:text-slate-100">
                        {project.title}
                      </p>
                      {project.description && (
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default ResumePreviewDialog;
