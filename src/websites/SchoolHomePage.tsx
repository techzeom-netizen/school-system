import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Menu,
  School,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { href: '#about', label: 'About the school' },
  { href: '#academics', label: 'Academics' },
  { href: '#campus', label: 'Campus life' },
  { href: '#admissions', label: 'Admissions' },
  { href: '#news', label: 'News & events' },
];

const academicAreas = [
  [
    'Early years',
    'A gentle start built around play, language, movement and relationships.',
  ],
  [
    'Primary school',
    'Strong foundations in reading, mathematics, science and the arts.',
  ],
  [
    'Middle & senior school',
    'Independent thinking, subject depth and preparation for the next step.',
  ],
];

const notices = [
  ['Admissions', 'Applications for the 2026-27 academic year are now open.'],
  [
    'School calendar',
    'Parents can view the term calendar and upcoming activities through the portal.',
  ],
  ['Campus visit', 'Book a weekday visit with our admissions office.'],
];

const SchoolHomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="bg-[#17352f] px-5 py-2 text-center text-xs font-medium text-white/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-1 lg:justify-between">
          <span>Welcome to Demo School</span>
          <span className="hidden sm:inline">
            A caring school community for curious learners
          </span>
          <a
            href="mailto:hello@demo-school.edu"
            className="underline underline-offset-2 hover:text-[#f4c65f]"
          >
            hello@demo-school.edu
          </a>
        </div>
      </div>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label="Demo School home"
          >
            <span className="flex h-11 w-11 items-center justify-center bg-[#17352f] text-[#f4c65f]">
              <School className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-serif text-xl font-bold leading-none text-[#17352f]">
                Demo School
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Learning with purpose
              </span>
            </span>
          </a>
          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-[#17352f]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/login"
              className="text-sm font-semibold text-[#17352f] hover:text-[#b8751c]"
            >
              Portal login
            </Link>
            <Button
              asChild
              size="sm"
              className="rounded-md bg-[#b8751c] px-5 text-white hover:bg-[#975d13]"
            >
              <a href="#admissions">Enquire now</a>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#17352f] lg:hidden"
            onClick={() => setMenuOpen(open => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-3 lg:hidden">
            <nav className="flex flex-col" aria-label="Mobile navigation">
              {navigation.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="border-b border-slate-100 py-3 text-sm font-medium text-slate-700"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex gap-3">
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-md border-[#17352f] text-[#17352f]"
              >
                <Link to="/login" onClick={closeMenu}>
                  Portal login
                </Link>
              </Button>
              <Button
                asChild
                className="flex-1 rounded-md bg-[#b8751c] text-white hover:bg-[#975d13]"
              >
                <a href="#admissions" onClick={closeMenu}>
                  Enquire now
                </a>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="bg-[#f3f0e8]">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_.95fr]">
            <div className="flex flex-col justify-center px-5 py-16 sm:py-20 lg:px-8 lg:py-28">
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
                Demo School
              </p>
              <h1 className="mt-5 max-w-2xl font-serif text-5xl font-semibold leading-[1.03] tracking-tight text-[#17352f] sm:text-6xl">
                A good school gives children room to grow.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                We combine high expectations with a warm, steady environment
                where every child can learn well, make friends and find
                something they care about.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-md bg-[#17352f] px-6 text-white hover:bg-[#0f2723]"
                >
                  <a href="#about">
                    Learn about our school{' '}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-md border-[#17352f] px-6 text-[#17352f] hover:bg-white"
                >
                  <a href="#admissions">Admissions information</a>
                </Button>
              </div>
            </div>
            <div
              className="min-h-[360px] bg-[url('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85')] bg-cover bg-center lg:min-h-[540px]"
              aria-label="Students learning together"
              role="img"
            />
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl divide-y divide-slate-200 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
            {notices.map(([label, text]) => (
              <div
                key={label}
                className="flex gap-3 py-5 sm:px-6 sm:first:pl-0"
              >
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#b8751c]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.13em] text-[#17352f]">
                    {label}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.85fr_1.15fr] lg:px-8 lg:py-24"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
              About the school
            </p>
            <h2 className="mt-4 max-w-lg font-serif text-4xl font-semibold leading-tight text-[#17352f] sm:text-5xl">
              A school community that knows its children.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">
              Demo School is a place where teachers and families work together.
              We pay attention to the small things: a new interest, a difficult
              morning, a question that deserves more time.
            </p>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
              Our aim is simple — to help children become thoughtful, capable
              and considerate people who are ready for what comes next.
            </p>
            <a
              href="#academics"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#17352f]"
            >
              How learning works at Demo School{' '}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-[#17352f] p-7 text-white sm:row-span-2">
              <GraduationCap className="h-8 w-8 text-[#f4c65f]" />
              <p className="mt-16 font-serif text-3xl leading-tight">
                Every child should leave school with confidence in their own
                voice.
              </p>
            </div>
            <div className="border border-slate-200 bg-[#f8f7f3] p-6">
              <Users className="h-6 w-6 text-[#b8751c]" />
              <h3 className="mt-6 font-serif text-2xl font-semibold text-[#17352f]">
                Known and supported
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Small tutor groups and open communication with families.
              </p>
            </div>
            <div className="border border-slate-200 bg-[#f8f7f3] p-6">
              <BookOpen className="h-6 w-6 text-[#b8751c]" />
              <h3 className="mt-6 font-serif text-2xl font-semibold text-[#17352f]">
                Ready to learn
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A balanced curriculum that takes both results and wellbeing
                seriously.
              </p>
            </div>
          </div>
        </section>

        <section id="academics" className="bg-[#f3f0e8] py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
                Academics
              </p>
              <h2 className="mt-4 font-serif text-4xl font-semibold text-[#17352f] sm:text-5xl">
                Clear foundations. Plenty of possibility.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Our curriculum is carefully planned across each stage of school,
                while leaving space for teachers to respond to the children in
                front of them.
              </p>
            </div>
            <div className="mt-10 grid gap-px border border-slate-300 bg-slate-300 md:grid-cols-3">
              {academicAreas.map(([title, text], index) => (
                <article key={title} className="bg-[#f3f0e8] p-7 lg:p-8">
                  <p className="text-sm font-bold text-[#b8751c]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-10 font-serif text-2xl font-semibold text-[#17352f]">
                    {title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {text}
                  </p>
                  <a
                    href="#admissions"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#17352f]"
                  >
                    Ask about this stage <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="campus"
          className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8 lg:py-24"
        >
          <div
            className="h-[360px] bg-[url('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1400&q=85')] bg-cover bg-center"
            role="img"
            aria-label="Students working together in class"
          />
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
              Campus life
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#17352f] sm:text-5xl">
              Learning continues after the bell.
            </h2>
            <p className="mt-6 text-base leading-7 text-slate-600">
              The school day includes sport, music, art, clubs, service and time
              to simply be together. Children are encouraged to try new things
              without needing to be perfect at them.
            </p>
            <ul className="mt-7 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              {[
                'Library and reading room',
                'Science and computer labs',
                'Music, art and performance',
                'Sports and outdoor play',
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#b8751c]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="admissions"
          className="bg-[#17352f] py-20 text-white lg:py-24"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1.1fr_.9fr] lg:items-start lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#f4c65f]">
                Admissions
              </p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                We would be pleased to meet your family.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/75">
                The best way to understand Demo School is to visit. Our
                admissions team can answer questions about year groups, the
                school day, transport and the application process.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-md bg-[#f4c65f] px-6 font-bold text-[#17352f] hover:bg-[#ffd979]"
                >
                  <a href="mailto:admissions@demo-school.edu">
                    Contact admissions
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-md border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </Button>
              </div>
            </div>
            <div className="border border-white/20 p-7">
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#f4c65f]">
                Next open morning
              </p>
              <p className="mt-4 font-serif text-3xl">Saturday, 14 December</p>
              <p className="mt-2 text-white/70">10:00 am to 12:00 pm</p>
              <p className="mt-6 border-t border-white/20 pt-5 text-sm leading-6 text-white/70">
                A short tour, a conversation with our team and time to see the
                school in action.
              </p>
            </div>
          </div>
        </section>

        <section
          id="news"
          className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
                News & events
              </p>
              <h2 className="mt-4 font-serif text-4xl font-semibold text-[#17352f] sm:text-5xl">
                What is happening at school.
              </h2>
            </div>
            <a
              href="mailto:hello@demo-school.edu"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#17352f]"
            >
              Contact the school <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-10 grid gap-8 border-t border-slate-200 pt-6 md:grid-cols-3">
            {[
              [
                '05 Nov 2026',
                'Students share their ideas at the innovation fair',
              ],
              ['28 Oct 2026', 'A week of stories, music and theatre'],
              ['12 Oct 2026', 'Meet our pastoral care team'],
            ].map(([date, title]) => (
              <article key={title}>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#b8751c]">
                  {date}
                </p>
                <h3 className="mt-4 font-serif text-2xl font-semibold leading-tight text-[#17352f]">
                  {title}
                </h3>
                <a
                  href="mailto:hello@demo-school.edu"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-700"
                >
                  Read more <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#f3f0e8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-[1.4fr_.7fr_.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-[#17352f] text-[#f4c65f]">
                <School className="h-5 w-5" />
              </span>
              <div>
                <p className="font-serif text-lg font-bold text-[#17352f]">
                  Demo School
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">
                  Learning with purpose
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600">
              A school community for children from early years through senior
              school.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#17352f]">
              Explore
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <a href="#about" className="hover:text-[#17352f]">
                About the school
              </a>
              <a href="#academics" className="hover:text-[#17352f]">
                Academics
              </a>
              <a href="#admissions" className="hover:text-[#17352f]">
                Admissions
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#17352f]">
              Contact
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <a href="mailto:hello@demo-school.edu">hello@demo-school.edu</a>
              <a href="tel:+919876543210">+91 98765 43210</a>
              <Link to="/login" className="font-bold text-[#17352f]">
                Portal login <Users className="ml-1 inline h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-300 px-5 py-5 text-center text-xs text-slate-500">
          © 2026 Demo School · Privacy · Accessibility
        </div>
      </footer>
    </div>
  );
};

export default SchoolHomePage;
