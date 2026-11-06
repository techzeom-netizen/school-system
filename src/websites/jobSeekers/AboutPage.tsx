import { Briefcase, Building2, Users } from 'lucide-react';
import WebsiteShell from '@/features/jobseekers/components/WebsiteShell';

const AboutPage = () => (
  <WebsiteShell>
    <section className="mx-auto w-full max-w-[1560px] px-5 py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-950 dark:text-slate-100">
        About KD Public School
      </h1>
      <p className="mt-4 max-w-3xl text-gray-600 dark:text-slate-300">
        KD Public School brings administrators, teachers, staff, parents, and
        students into one practical workspace. The portal keeps hiring workflows
        focused, fast, and easy to manage.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          [Users, 'Role based access'],
          [Briefcase, 'Job management'],
          [Building2, 'Company records'],
        ].map(([Icon, label]) => (
          <div
            key={label as string}
            className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5"
          >
            <Icon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
            <p className="mt-3 font-semibold">{label as string}</p>
          </div>
        ))}
      </div>
    </section>
  </WebsiteShell>
);

export default AboutPage;
