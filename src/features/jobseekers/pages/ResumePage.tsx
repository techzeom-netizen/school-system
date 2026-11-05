import { useMemo, useRef, useState } from 'react';
import { Clock3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CareerPreferencesCard from '../components/resume/CareerPreferencesCard';
import ProfileSummaryCard from '../components/resume/ProfileSummaryCard';
import ResumeFilesCard from '../components/resume/ResumeFilesCard';
import ResumeSidebar from '../components/resume/ResumeSidebar';
import SectionCard from '../components/resume/SectionCard';
import SkillsEditor from '../components/resume/SkillsEditor';
import {
  getMonthsSince,
  formatDate,
  initialPreferences,
  initialResumeFiles,
  initialSections,
  initialSkills,
  initialSummary,
  sectionConfigs,
  type CareerPreferences,
  type OpenToWork,
  type ProfileSummary,
  type ResumeFile,
  type ResumeSectionItem,
  type SectionKey,
  type Visibility,
} from '../data/resume';

const ResumePage = () => {
  const resumeFilesRef = useRef<HTMLDivElement | null>(null);
  const [notice, setNotice] = useState('');
  const [staleDismissed, setStaleDismissed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(
    new Date('2026-06-20T09:00:00')
  );
  const [resumes, setResumes] = useState<ResumeFile[]>(initialResumeFiles);
  const [summary, setSummary] = useState<ProfileSummary>(initialSummary);
  const [skills, setSkills] = useState(initialSkills);
  const [sections, setSections] = useState(initialSections);
  const [preferences, setPreferences] =
    useState<CareerPreferences>(initialPreferences);
  const [visibility, setVisibility] = useState<Visibility>('all');
  const [hideCurrentEmployer, setHideCurrentEmployer] = useState(false);
  const [openToWork, setOpenToWork] = useState<OpenToWork>({
    enabled: true,
    jobType: 'Full-time',
    startDate: '2026-10-15',
  });

  const refreshUpdatedAt = () => {
    setLastUpdated(new Date());
    setStaleDismissed(true);
  };

  const scrollToResumeFiles = () => {
    resumeFilesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const checklist = useMemo(
    () => [
      { key: 'resume', label: 'Upload a resume', done: resumes.length > 0 },
      {
        key: 'headline',
        label: 'Headline',
        done: Boolean(summary.headline.trim()),
      },
      {
        key: 'summary',
        label: 'Summary of 50+ chars',
        done: summary.summary.trim().length >= 50,
      },
      { key: 'skills', label: '5+ skills', done: skills.length >= 5 },
      {
        key: 'employment',
        label: 'Employment',
        done: sections.employment.length > 0,
      },
      {
        key: 'education',
        label: 'Education',
        done: sections.education.length > 0,
      },
      { key: 'project', label: 'Project', done: sections.projects.length > 0 },
      {
        key: 'certification',
        label: 'Certification',
        done: sections.certifications.length > 0,
      },
      {
        key: 'language',
        label: 'Language',
        done: sections.languages.length > 0,
      },
      {
        key: 'preferences',
        label: 'Career preferences',
        done: Boolean(preferences.desiredRole && preferences.salary),
      },
    ],
    [preferences, resumes.length, sections, skills.length, summary]
  );

  const completedCount = checklist.filter(item => item.done).length;
  const percent = Math.round((completedCount / checklist.length) * 100);
  const missingItems = checklist.filter(item => !item.done).slice(0, 3);
  const monthsOld = getMonthsSince(lastUpdated);
  const showStaleBanner = monthsOld > 3 && !staleDismissed;

  const updateSections = (key: SectionKey, items: ResumeSectionItem[]) => {
    setSections(current => ({ ...current, [key]: items }));
    refreshUpdatedAt();
  };

  return (
    <section className="bg-slate-50 dark:bg-[#0c1321] pb-24 lg:pb-0">
      <div className="mx-auto w-full max-w-[1560px] px-4 py-6 lg:px-8">
        {notice && (
          <div
            role="status"
            className="mb-4 flex items-start justify-between gap-3 rounded-t-md border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-4 text-sm font-medium text-blue-800 dark:text-blue-300"
          >
            <span>{notice}</span>
            <button
              type="button"
              aria-label="Dismiss notice"
              onClick={() => setNotice('')}
              className="rounded p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {showStaleBanner && (
          <div
            role="alert"
            className="mb-4 flex flex-col gap-3 rounded-t-md border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-4 text-sm text-amber-900 dark:text-amber-300 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>
              Your resume was last updated {monthsOld} months ago. Update it to
              get more recruiter views.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
                onClick={scrollToResumeFiles}
              >
                Update now
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Dismiss stale resume alert"
                onClick={() => setStaleDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <section className="mb-4 rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-950 dark:text-slate-100">
                Profile completeness
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Keep your resume profile complete so recruiters can understand
                your fit quickly.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock3 className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                Last updated: {formatDate(lastUpdated)}
              </p>
              <Button
                type="button"
                className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
                onClick={scrollToResumeFiles}
              >
                Update profile
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                {percent}% complete
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {completedCount}/{checklist.length} completed
              </p>
            </div>
            <div
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-2 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"
            >
              <div
                className="h-2.5 rounded-full bg-blue-600"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {missingItems.length === 0 ? (
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Your profile is complete. Nice work!
                </span>
              ) : (
                <>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Next up:
                  </span>
                  {missingItems.map(item => (
                    <span
                      key={item.key}
                      className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-400"
                    >
                      {item.label}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-4">
            <div ref={resumeFilesRef}>
              <ResumeFilesCard
                resumes={resumes}
                onChange={setResumes}
                onNotice={setNotice}
                onTouched={refreshUpdatedAt}
              />
            </div>
            <ProfileSummaryCard
              summary={summary}
              onSave={nextSummary => {
                setSummary(nextSummary);
                refreshUpdatedAt();
              }}
            />
            <SkillsEditor
              skills={skills}
              onChange={nextSkills => {
                setSkills(nextSkills);
                refreshUpdatedAt();
              }}
            />
            {sectionConfigs
              .filter(config => config.key !== 'languages')
              .map(config => (
                <SectionCard
                  key={config.key}
                  config={config}
                  items={sections[config.key]}
                  onChange={items => updateSections(config.key, items)}
                />
              ))}
          </main>

          <aside className="space-y-4">
            <ResumeSidebar
              visibility={visibility}
              hideCurrentEmployer={hideCurrentEmployer}
              openToWork={openToWork}
              onVisibilityChange={value => {
                setVisibility(value);
                refreshUpdatedAt();
              }}
              onHideCurrentEmployerChange={value => {
                setHideCurrentEmployer(value);
                refreshUpdatedAt();
              }}
              onOpenToWorkChange={value => {
                setOpenToWork(value);
                refreshUpdatedAt();
              }}
            />
            {sectionConfigs
              .filter(config => config.key === 'languages')
              .map(config => (
                <SectionCard
                  key={config.key}
                  config={config}
                  items={sections[config.key]}
                  onChange={items => updateSections(config.key, items)}
                />
              ))}
            <CareerPreferencesCard
              preferences={preferences}
              onSave={nextPreferences => {
                setPreferences(nextPreferences);
                refreshUpdatedAt();
              }}
            />
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-blue-100 dark:border-blue-900 bg-white dark:bg-slate-900 p-3 shadow-lg lg:hidden">
        <Button
          type="button"
          className="w-full rounded-none bg-blue-600 text-white hover:bg-blue-700"
          onClick={scrollToResumeFiles}
        >
          Update resume
        </Button>
      </div>
    </section>
  );
};

export default ResumePage;
