import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileBadge,
  FlaskConical,
  GraduationCap,
  Library,
  MapPin,
  Menu,
  MonitorSmartphone,
  Pause,
  Play,
  School,
  ShieldCheck,
  Trophy,
  Bus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { noticeBoardItems } from '@/websites/schoolNoticeData';

const navigation = [
  { href: '#top', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#academics', label: 'Academics' },
  { href: '#admissions', label: 'Admissions' },
  { href: '#facilities', label: 'Campus' },
  { href: '#notice-board', label: 'Notice board' },
  { href: '#contact', label: 'Contact' },
];

const quickLinks = [
  {
    title: 'Admission',
    caption: 'Process and dates',
    href: '#admissions',
    icon: ClipboardCheck,
  },
  {
    title: 'Fee structure',
    caption: 'Class-wise fees',
    href: '#academics',
    icon: FileBadge,
  },
  {
    title: 'Downloads',
    caption: 'Forms and circulars',
    href: '#notice-board',
    icon: Download,
  },
  {
    title: 'Mandatory disclosure',
    caption: 'CBSE public information',
    href: '#about',
    icon: CheckCircle2,
  },
  {
    title: 'Results',
    caption: 'Board performance',
    href: '#academics',
    icon: Award,
  },
  {
    title: 'Transfer certificate',
    caption: 'Request and verify',
    href: '#contact',
    icon: GraduationCap,
  },
  {
    title: 'Transport',
    caption: 'Routes and timings',
    href: '#facilities',
    icon: Bus,
  },
  {
    title: 'Contact',
    caption: 'Address and map',
    href: '#contact',
    icon: MapPin,
  },
];

const academicAreas = [
  {
    title: 'Early Years',
    years: 'Nursery to UKG',
    text: 'Play-based learning that builds language, number sense and social skills.',
  },
  {
    title: 'Primary',
    years: 'Classes I to V',
    text: 'Strong foundations in English, Hindi, Mathematics, EVS and Computers.',
  },
  {
    title: 'Secondary',
    years: 'Classes VI to X',
    text: 'Subject teaching, practical labs and focused preparation for Class X boards.',
  },
  {
    title: 'Senior Secondary',
    years: 'Classes XI and XII',
    text: 'Science (PCM / PCB), Commerce and Humanities.',
  },
];

const facilities = [
  {
    title: 'Science laboratories',
    text: 'Separate Physics, Chemistry and Biology labs for practical work.',
    icon: FlaskConical,
  },
  {
    title: 'Smart classrooms',
    text: 'Digital boards and a computer lab with internet access.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Library',
    text: 'Reference books, newspapers and a quiet reading hall.',
    icon: Library,
  },
  {
    title: 'Sports ground',
    text: 'Cricket, football, basketball, athletics and indoor games.',
    icon: Trophy,
  },
  {
    title: 'School transport',
    text: 'Buses on all major routes with trained drivers and attendants.',
    icon: Bus,
  },
  {
    title: 'Safety and security',
    text: 'CCTV coverage, trained staff and a medical room on campus.',
    icon: ShieldCheck,
  },
];

const heroSlides = [
  {
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=85&w=1400',
    caption: 'Engaging classrooms',
  },
  {
    image:
      'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=1400',
    caption: 'A welcoming school campus',
  },
  {
    image:
      'https://images.unsplash.com/photo-1748345952129-3bdd7d39f155?auto=format&fit=crop&q=70&w=1400',
    caption: 'Technology-enabled learning',
  },
];

const schoolHighlights = [
  { value: '20+', label: 'Years of learning', icon: GraduationCap },
  { value: '1:20', label: 'Student-teacher ratio', icon: Users },
  { value: '100%', label: 'Board pass record', icon: Award },
  { value: '25+', label: 'Clubs and activities', icon: Trophy },
];

const galleryItems = [
  {
    caption: 'Main school building',
    image:
      'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=1400',
    size: 'large',
    tone: 'navy',
  },
  {
    caption: 'Science lab',
    image:
      'https://images.pexels.com/photos/8471859/pexels-photo-8471859.jpeg?auto=compress&cs=tinysrgb&w=1200',
    size: 'standard',
    tone: 'gold',
  },
  {
    caption: 'Library',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200',
    size: 'standard',
    tone: 'navy',
  },
  {
    caption: 'Annual day',
    image:
      'https://images.unsplash.com/photo-1782567530577-98d75b4bcb88?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'gold',
  },
  {
    caption: 'Sports day',
    image:
      'https://images.unsplash.com/photo-1700914299961-d8f91559d85d?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'navy',
  },
  {
    caption: 'Assembly',
    image:
      'https://images.unsplash.com/photo-1649008726820-d90aeb70c32e?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'gold',
  },
  {
    caption: 'Art room',
    image:
      'https://images.unsplash.com/photo-1761403942462-04b8b97f1fe9?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'navy',
  },
  {
    caption: 'Playground',
    image:
      'https://images.unsplash.com/photo-1763561553595-a60112a2977e?auto=format&fit=crop&q=60&w=1400',
    size: 'large',
    tone: 'gold',
  },
  {
    caption: 'Smart class',
    image:
      'https://images.unsplash.com/photo-1643199121319-b3b5695e4acb?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'navy',
  },
  {
    caption: 'Computer lab',
    image:
      'https://images.unsplash.com/photo-1748345952129-3bdd7d39f155?auto=format&fit=crop&q=60&w=900',
    size: 'standard',
    tone: 'gold',
  },
];

const SchoolHomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('reveal-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px' }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (heroPaused || reduceMotion) return;

    const interval = window.setInterval(() => {
      setHeroSlide(current => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [heroPaused]);

  useEffect(() => {
    const handleAnchorNavigation = (event: MouseEvent) => {
      const source = event.target as Element | null;
      const anchor = source?.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = anchor?.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      window.history.replaceState(null, '', href);
    };

    document.addEventListener('click', handleAnchorNavigation);
    return () => document.removeEventListener('click', handleAnchorNavigation);
  }, []);

  return (
    <div className="school-home min-h-screen bg-white text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
        .school-home, .school-home button, .school-home input, .school-home textarea, .school-home select { font-family: 'Source Sans 3', sans-serif; }
        .school-home .font-serif { font-family: 'Source Sans 3', sans-serif; }
        html { scroll-behavior: smooth; }
        [id] { scroll-margin-top: 132px; }
        [data-reveal] { opacity: 0; transform: translateY(28px); transition: opacity 650ms ease, transform 650ms ease; }
        [data-reveal].reveal-visible { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          [data-reveal] { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-2 lg:px-8">
          <a
            href="#top"
            className="flex items-center gap-4"
            aria-label="Demo School home"
          >
            <span className="flex h-10 w-10 items-center justify-center border-b-4 border-[#d1a12a] bg-[#17352f] text-white sm:h-12 sm:w-12">
              <School className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-serif text-lg font-bold leading-none text-[#17352f] sm:text-2xl">
                Demo School
              </span>
              <span className="mt-0 block text-xs text-slate-600 sm:text-sm">
                Senior Secondary School, Nursery to Class XII
              </span>
            </span>
          </a>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-slate-900">
              Affiliated to CBSE, New Delhi
            </p>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              Affiliation No. 0000000 · School Code 00000
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-[#17352f] lg:hidden"
            onClick={() => setMenuOpen(open => !open)}
            aria-label={
              menuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>

        <div className="border-b-4 border-[#d1a12a] bg-[#17352f] text-white shadow-md">
          <div className="mx-auto hidden max-w-7xl items-stretch px-5 lg:flex lg:px-8">
            <nav className="flex items-stretch" aria-label="Main navigation">
              {navigation.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-5 py-4 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none ${
                    index === 0 ? 'bg-white/10' : ''
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="ml-auto flex items-stretch">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-full rounded-none px-5 text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10"
                  >
                    Login <ChevronDown aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/superadmin/login" className="cursor-pointer">
                      Administration
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="cursor-pointer">
                      Parents
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                asChild
                className="h-full rounded-none bg-[#d1a12a] px-8 font-bold text-[#17352f] hover:bg-[#e0b443]"
              >
                <Link to="/enquiry">Enquire now</Link>
              </Button>
            </div>
          </div>

          {menuOpen && (
            <div className="px-5 pb-5 lg:hidden">
              <nav className="flex flex-col" aria-label="Mobile navigation">
                {navigation.map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="border-b border-white/15 py-3 text-sm font-semibold"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/superadmin/login" onClick={closeMenu}>
                    Administration
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/login" onClick={closeMenu}>
                    Parents
                  </Link>
                </Button>
                <Button
                  asChild
                  className="col-span-2 bg-[#d1a12a] font-bold text-[#17352f] hover:bg-[#e0b443]"
                >
                  <Link to="/enquiry" onClick={closeMenu}>
                    Enquire now
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main id="top">
        <section
          className="relative min-h-[560px] overflow-hidden bg-[#17352f] text-white"
          data-reveal
          aria-roledescription="carousel"
          aria-label="Demo School highlights"
        >
          {heroSlides.map((slide, index) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === heroSlide ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={index !== heroSlide}
            >
              <img
                src={slide.image}
                alt={index === heroSlide ? slide.caption : ''}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#0c2b26]/82 via-[#0c2b26]/48 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-5 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-[#f4c65f] backdrop-blur-sm">
                CBSE · Nursery to Class XII
              </p>
              <h1 className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                A school where every child can learn with confidence.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                Thoughtful teaching, practical learning and a caring community
                help students build strong foundations for the future.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#f4c65f] px-6 font-bold text-[#17352f] hover:bg-[#ffd979]"
                >
                  <a href="#about">
                    Explore our school <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/50 bg-white/5 px-6 text-white backdrop-blur-sm hover:bg-white hover:text-[#17352f]"
                >
                  <Link to="/enquiry">Admission enquiry</Link>
                </Button>
              </div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 lg:left-8 lg:right-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-white/60">
                  School highlights
                </p>
                <p className="mt-1 text-sm font-semibold" aria-live="polite">
                  {heroSlides[heroSlide].caption}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="mr-1 hidden items-center sm:flex">
                  {heroSlides.map((slide, index) => (
                    <Button
                      key={slide.caption}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-white hover:bg-white/15 hover:text-white"
                      onClick={() => setHeroSlide(index)}
                      aria-label={`Show slide ${index + 1}: ${slide.caption}`}
                      aria-current={index === heroSlide ? 'true' : undefined}
                    >
                      <span
                        className={`h-2 rounded-full transition-all ${
                          index === heroSlide
                            ? 'w-5 bg-[#f4c65f]'
                            : 'w-2 bg-white/70'
                        }`}
                        aria-hidden="true"
                      />
                    </Button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/40 bg-black/15 text-white hover:bg-white hover:text-[#17352f]"
                  onClick={() =>
                    setHeroSlide(current =>
                      current === 0 ? heroSlides.length - 1 : current - 1
                    )
                  }
                  aria-label="Previous hero image"
                >
                  <ChevronLeft aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/40 bg-black/15 text-white hover:bg-white hover:text-[#17352f]"
                  onClick={() => setHeroPaused(paused => !paused)}
                  aria-label={
                    heroPaused ? 'Play hero slideshow' : 'Pause hero slideshow'
                  }
                >
                  {heroPaused ? (
                    <Play aria-hidden="true" />
                  ) : (
                    <Pause aria-hidden="true" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/40 bg-black/15 text-white hover:bg-white hover:text-[#17352f]"
                  onClick={() =>
                    setHeroSlide(current => (current + 1) % heroSlides.length)
                  }
                  aria-label="Next hero image"
                >
                  <ChevronRight aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="border-b border-slate-200 bg-white"
          aria-label="School at a glance"
          data-reveal
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-0 lg:grid-cols-4">
            {schoolHighlights.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-4 border-b border-slate-200 px-3 py-6 even:border-l sm:px-6 lg:border-b-0 lg:border-l lg:first:border-l-0"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf3f1] text-[#17352f]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xl font-bold text-[#17352f]">{value}</p>
                  <p className="text-xs font-semibold uppercase tracking-[.08em] text-slate-500">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="bg-[#f3f0e8] py-16 lg:py-20" data-reveal>
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-8 border-b border-slate-300 pb-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b8751c]">
                  About the school
                </p>
                <h2 className="mt-3 max-w-lg text-2xl font-bold leading-tight text-[#17352f] sm:text-3xl">
                  A caring school with clear expectations.
                </h2>
              </div>
              <div>
                <p className="max-w-2xl text-base leading-7 text-slate-600">
                  Demo School brings teachers and families together around one
                  goal: helping every child become capable, curious and kind. We
                  combine strong academic foundations with practical learning
                  and individual attention.
                </p>
                <Link
                  to="/about-us"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#17352f] hover:text-[#b8751c]"
                >
                  Read our story and meet the school
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-md border border-slate-200 bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf3f1] text-[#17352f]">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-[#17352f]">
                  Known and supported
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Teachers know their students well and keep families informed.
                </p>
              </article>
              <article className="rounded-md border border-slate-200 bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf3f1] text-[#17352f]">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-[#17352f]">
                  Ready to learn
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A balanced CBSE curriculum builds knowledge and confidence.
                </p>
              </article>
              <article className="rounded-md border border-slate-200 bg-[#17352f] p-6 text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#f4c65f]">
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold">
                  Prepared for tomorrow
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Students leave with the skills and values to take their next
                  step.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          id="quick-links"
          className="bg-white py-20 lg:py-24"
          data-reveal
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
                Explore
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#17352f] sm:text-3xl">
                Quick links
              </h2>
              <p className="mt-4 text-base text-slate-600">
                What parents and students look for most.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 border-l border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map(({ title, caption, href, icon: Icon }) => (
                <a
                  key={title}
                  href={href}
                  className="group min-h-40 border-b border-r border-slate-200 bg-white p-6 transition-colors hover:bg-[#17352f] focus-visible:bg-[#17352f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8751c]"
                >
                  <Icon
                    className="h-7 w-7 text-[#b8751c]"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  <h3 className="mt-8 font-serif text-xl font-semibold text-[#17352f] group-hover:text-white group-focus-visible:text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 group-hover:text-white/70 group-focus-visible:text-white/70">
                    {caption}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          id="academics"
          className="bg-[#f3f0e8] py-20 lg:py-24"
          data-reveal
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
                Academics
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#17352f] sm:text-3xl">
                Academics
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                CBSE curriculum from Nursery to Class XII.
              </p>
            </div>
            <div className="mt-10 grid border border-slate-300 sm:grid-cols-2 lg:grid-cols-4">
              {academicAreas.map((area, index) => (
                <article
                  key={area.title}
                  className="border-b border-slate-300 bg-[#f3f0e8] p-7 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0 lg:p-8"
                >
                  <p className="text-sm font-bold text-[#b8751c]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-10 font-serif text-2xl font-semibold text-[#17352f]">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-[#b8751c]">
                    {area.years}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {area.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="facilities"
          className="bg-white py-20 lg:py-24"
          data-reveal
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
              Our campus
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-[#17352f] sm:text-3xl">
              Campus facilities
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {facilities.map(({ title, text, icon: Icon }) => (
                <article
                  key={title}
                  className="flex min-h-40 gap-4 border border-slate-200 border-l-4 border-l-[#17352f] bg-[#f8f7f3] p-6"
                >
                  <Icon
                    className="h-7 w-7 shrink-0 text-[#b8751c]"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#17352f]">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="admissions"
          className="bg-[#17352f] py-20 text-white lg:py-24"
          data-reveal
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1.1fr_.9fr] lg:items-start lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#f4c65f]">
                Admissions
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold  sm:text-3xl">
                We would be pleased to meet your family.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-white/75">
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
              <p className="mt-4 font-serif text-2xl">Saturday, 14 December</p>
              <p className="mt-2 text-white/70">10:00 am to 12:00 pm</p>
              <p className="mt-6 border-t border-white/20 pt-5 text-sm leading-6 text-white/70">
                A short tour, a conversation with our team and time to see the
                school in action.
              </p>
            </div>
          </div>
        </section>

        <section
          id="notice-board"
          className="bg-[#f3f0e8] px-5 py-20 dark:bg-slate-950 lg:px-8 lg:py-24"
          data-reveal
        >
          <style>{`
            .notice-note { transition: transform 180ms ease, box-shadow 180ms ease; }
            .notice-note:hover, .notice-note:focus-visible { transform: rotate(0deg) translateY(-6px) !important; box-shadow: 7px 9px 0 #293246 !important; }
            @media (prefers-reduced-motion: reduce) { .notice-note { transition: none; } }
          `}</style>
          <div className="mx-auto max-w-7xl">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
                Latest updates
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#17352f] sm:text-3xl">
                Notice board
              </h2>
            </div>
            <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-3">
              {noticeBoardItems.map(item => (
                <article
                  key={item.title}
                  tabIndex={0}
                  className="notice-note relative min-h-52 rounded-md border-2 border-[#293246] p-7 pt-9 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#b8751c]"
                  style={{
                    backgroundColor: item.color,
                    color: item.textColor,
                    boxShadow: '5px 5px 0 #293246',
                    transform: `rotate(${item.rotation})`,
                  }}
                >
                  <span
                    className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-[#293246] bg-red-600 shadow-sm"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-bold uppercase tracking-[.14em]">
                    {item.label}
                  </p>
                  <h3 className="mt-3 text-lg font-bold leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6">{item.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button
                asChild
                className="bg-[#17352f] px-7 text-white hover:bg-[#0f2723]"
              >
                <Link to="/notice-board">
                  Show all <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="life-at-school"
          className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
          data-reveal
        >
          <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
            Campus life
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-[#17352f] sm:text-3xl">
            Life at Demo School
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            A glimpse of learning, creativity and community across our campus.
          </p>
          <style>{`
            .school-gallery-grid { grid-auto-rows: 170px; }
            @media (max-width: 639px) { .school-gallery-grid { grid-auto-rows: 130px; } }
          `}</style>
          <div className="school-gallery-grid mt-10 grid grid-flow-dense grid-cols-2 gap-2 lg:grid-cols-4">
            {galleryItems.map(item => (
              <figure
                key={item.caption}
                className={`relative m-0 min-h-0 overflow-hidden ${
                  item.size === 'large' ? 'col-span-2 row-span-2' : ''
                }`}
                style={{
                  backgroundColor: item.tone === 'navy' ? '#17352f' : '#b8751c',
                  backgroundImage:
                    'repeating-linear-gradient(135deg, transparent 0 14px, rgba(255,255,255,.07) 14px 16px)',
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <figcaption className="absolute bottom-3 left-3 right-3 font-serif text-sm font-semibold text-white drop-shadow-md sm:bottom-4 sm:left-4 sm:text-lg">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-[#f3f0e8]">
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
