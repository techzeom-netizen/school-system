import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Landmark,
  MapPin,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SchoolBrand from '@/components/common/SchoolBrand';

const schoolFacts = [
  { label: 'Established', value: '2026', icon: CalendarDays },
  { label: 'Affiliation', value: 'CBSE, New Delhi', icon: Landmark },
  { label: 'Grades', value: 'Nursery to Class XII', icon: BookOpen },
  { label: 'School type', value: 'Co-educational day school', icon: Users },
];

const leadership = [
  {
    role: 'Founder',
    name: 'Dr. Ananya Sharma',
    initials: 'AS',
    text: 'An educator who founded KD Public School with the belief that strong academics and personal attention should go together.',
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
          aria-label="KD Public School home"
        >
          <SchoolBrand />
        </Link>
        <Button
          asChild
          variant="outline"
          className="border-[#7a1724] text-[#7a1724]"
        >
          <Link to="/">
            <ArrowLeft aria-hidden="true" /> Back home
          </Link>
        </Button>
      </div>
    </header>

    <main>
      <section className="bg-[#7a1724] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d4a62f]">
            Our school
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Knowledge, discipline and excellence since 2026.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
            KD Public School is a CBSE-affiliated community where children are
            known, challenged and supported from Nursery through Class XII.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f7f3e8]">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {schoolFacts.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex gap-4 border-b border-slate-200 p-6 sm:border-r lg:border-b-0 lg:last:border-r-0"
            >
              <Icon
                className="h-6 w-6 shrink-0 text-[#7a1724]"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">
                  {label}
                </p>
                <p className="mt-1 font-semibold text-[#7a1724]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#7a1724]">
            Our story
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#7a1724]">
            Built around children, families and good teaching.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-7 text-slate-600">
          <p>
            KD Public School was established in 2026 by Dr. Ananya Sharma under
            the KD Education Trust. It began with a clear aim: to make
            high-quality education personal, practical and accessible.
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
        className="bg-[#f7f3e8] py-16 lg:py-20"
        aria-labelledby="leadership-title"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#7a1724]">
            People and governance
          </p>
          <h2
            id="leadership-title"
            className="mt-3 text-3xl font-bold text-[#7a1724]"
          >
            School leadership
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {leadership.map(person => (
              <article
                key={person.role}
                className="rounded-md border border-slate-200 bg-white p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7a1724] font-bold text-[#d4a62f]">
                  {person.initials}
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-[#7a1724]">
                  {person.role}
                </p>
                <h3 className="mt-1 text-xl font-bold text-[#7a1724]">
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
            <Target className="h-7 w-7 text-[#7a1724]" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-bold text-[#7a1724]">
              Our mission
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              To provide rigorous, inclusive education that develops knowledge,
              confidence, responsibility and respect.
            </p>
          </article>
          <article className="rounded-md border border-slate-200 p-6">
            <HeartHandshake
              className="h-7 w-7 text-[#7a1724]"
              aria-hidden="true"
            />
            <h2 className="mt-5 text-xl font-bold text-[#7a1724]">
              Our values
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Curiosity, integrity, kindness, effort and service guide learning
              and relationships across the school.
            </p>
          </article>
          <article className="rounded-md border border-slate-200 p-6">
            <ShieldCheck
              className="h-7 w-7 text-[#7a1724]"
              aria-hidden="true"
            />
            <h2 className="mt-5 text-xl font-bold text-[#7a1724]">
              The school trust
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              KD Education Trust provides governance, financial oversight and
              long-term stewardship of the school.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-[#7a1724] py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 px-5 sm:flex-row sm:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#d4a62f]">
              Visit KD Public School
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
            className="bg-[#d4a62f] font-bold text-[#7a1724] hover:bg-[#f0d47a]"
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
