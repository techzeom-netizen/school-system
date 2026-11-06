import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  Landmark,
  MapPin,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const schoolFacts = [
  { label: 'Founded', value: '2005', icon: CalendarDays },
  { label: 'Affiliation', value: 'CBSE, New Delhi', icon: Landmark },
  { label: 'Grades', value: 'Nursery to Class XII', icon: BookOpen },
  { label: 'School type', value: 'Co-educational day school', icon: Users },
];

const leadership = [
  {
    role: 'Founder',
    name: 'Dr. Ananya Sharma',
    initials: 'AS',
    text: 'An educator who founded Demo School with the belief that strong academics and personal attention should go together.',
  },
  {
    role: 'Principal',
    name: 'Dr. Meera Kapoor',
    initials: 'MK',
    text: 'Leads teaching, student wellbeing and school improvement across every stage from early years to senior secondary.',
  },
  {
    role: 'Trust Chairperson',
    name: 'Mr. Rajiv Malhotra',
    initials: 'RM',
    text: 'Oversees school governance, long-term planning and the responsible development of campus resources.',
  },
];

const AboutUsPage = () => (
  <div className="about-page-enter min-h-screen bg-white font-sans text-slate-800">
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
      .about-page-enter, .about-page-enter button { font-family: 'Source Sans 3', sans-serif; }
      @keyframes about-page-enter {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .about-page-enter { animation: about-page-enter 520ms ease-out both; }
      @media (prefers-reduced-motion: reduce) { .about-page-enter { animation: none; } }
    `}</style>

    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Demo School home"
        >
          <span className="flex h-11 w-11 items-center justify-center bg-[#17352f] text-[#f4c65f]">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </span>
          <span>
            <strong className="block text-xl font-bold leading-none text-[#17352f]">
              Demo School
            </strong>
            <small className="mt-1 block text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">
              About our school
            </small>
          </span>
        </Link>
        <Button
          asChild
          variant="outline"
          className="border-[#17352f] text-[#17352f]"
        >
          <Link to="/#about">
            <ArrowLeft aria-hidden="true" /> Back home
          </Link>
        </Button>
      </div>
    </header>

    <main>
      <section className="bg-[#17352f] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#f4c65f]">
            Our school
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Learning with purpose since 2005.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
            Demo School is a CBSE-affiliated community where children are known,
            challenged and supported from Nursery through Class XII.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f3f0e8]">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {schoolFacts.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex gap-4 border-b border-slate-200 p-6 sm:border-r lg:border-b-0 lg:last:border-r-0"
            >
              <Icon
                className="h-6 w-6 shrink-0 text-[#b8751c]"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">
                  {label}
                </p>
                <p className="mt-1 font-semibold text-[#17352f]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b8751c]">
            Our story
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#17352f]">
            Built around children, families and good teaching.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-7 text-slate-600">
          <p>
            Demo School was founded in 2005 by Dr. Ananya Sharma under the Demo
            Education Trust. It began with a small primary section and a clear
            aim: to make high-quality education personal, practical and
            accessible.
          </p>
          <p>
            Today the school serves learners from Nursery to Class XII. The
            campus combines classrooms, laboratories, a library, sports
            facilities and creative spaces with a teaching culture that values
            questions, effort and steady progress.
          </p>
          <p>
            Our partnership with parents remains central. Regular communication,
            transparent policies and a strong pastoral system help every student
            feel safe and ready to learn.
          </p>
        </div>
      </section>

      <section
        className="bg-[#f3f0e8] py-16 lg:py-20"
        aria-labelledby="leadership-title"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b8751c]">
            People and governance
          </p>
          <h2
            id="leadership-title"
            className="mt-3 text-3xl font-bold text-[#17352f]"
          >
            School leadership
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {leadership.map(person => (
              <article
                key={person.role}
                className="rounded-md border border-slate-200 bg-white p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#17352f] font-bold text-[#f4c65f]">
                  {person.initials}
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-[#b8751c]">
                  {person.role}
                </p>
                <h3 className="mt-1 text-xl font-bold text-[#17352f]">
                  {person.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {person.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-md border border-slate-200 p-6">
            <Target className="h-7 w-7 text-[#b8751c]" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-bold text-[#17352f]">
              Our mission
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              To provide rigorous, inclusive education that develops knowledge,
              confidence, responsibility and respect.
            </p>
          </article>
          <article className="rounded-md border border-slate-200 p-6">
            <HeartHandshake
              className="h-7 w-7 text-[#b8751c]"
              aria-hidden="true"
            />
            <h2 className="mt-5 text-xl font-bold text-[#17352f]">
              Our values
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Curiosity, integrity, kindness, effort and service guide learning
              and relationships across the school.
            </p>
          </article>
          <article className="rounded-md border border-slate-200 p-6">
            <ShieldCheck
              className="h-7 w-7 text-[#b8751c]"
              aria-hidden="true"
            />
            <h2 className="mt-5 text-xl font-bold text-[#17352f]">
              The school trust
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Demo Education Trust provides governance, financial oversight and
              long-term stewardship of the school.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-[#17352f] py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 px-5 sm:flex-row sm:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#f4c65f]">
              Visit Demo School
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              See the school and meet our team.
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
              <MapPin className="h-4 w-4" aria-hidden="true" /> School Road,
              Your City, India 110001
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-[#f4c65f] font-bold text-[#17352f] hover:bg-[#ffd979]"
          >
            <Link to="/enquiry">
              Send an enquiry <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  </div>
);

export default AboutUsPage;
