import { Award, GraduationCap, Trophy, Users } from 'lucide-react';

const highlights = [
  { value: '20+', label: 'Years of learning', icon: GraduationCap },
  { value: '1:20', label: 'Student-teacher ratio', icon: Users },
  { value: '100%', label: 'Board pass record', icon: Award },
  { value: '25+', label: 'Clubs and activities', icon: Trophy },
];

const SchoolHighlights = () => (
  <section
    className="border-b border-slate-200 bg-white"
    aria-label="School at a glance"
    data-reveal
  >
    <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-0 lg:grid-cols-4">
      {highlights.map(({ value, label, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-4 border-b border-slate-200 px-3 py-6 even:border-l sm:px-6 lg:border-b-0 lg:border-l lg:first:border-l-0"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5efe0] text-[#071f3d]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xl font-bold text-[#071f3d]">{value}</p>
            <p className="text-xs font-semibold uppercase tracking-[.08em] text-slate-500">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default SchoolHighlights;
