import {
  Award,
  Bus,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileBadge,
  GraduationCap,
  MapPin,
} from 'lucide-react';

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

const QuickLinksSection = () => (
  <section id="quick-links" className="bg-white py-20 lg:py-24" data-reveal>
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[.18em] text-[#7a1724]">
          Explore
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#071f3d] sm:text-3xl">
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
            className="group min-h-40 border-b border-r border-slate-200 bg-white p-6 transition-colors hover:bg-[#7a1724] focus-visible:bg-[#7a1724] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a62f]"
          >
            <Icon
              className="h-7 w-7 text-[#7a1724] transition-colors group-hover:text-[#d4a62f] group-focus-visible:text-[#d4a62f]"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <h3 className="mt-8 text-xl font-semibold text-[#071f3d] group-hover:text-white group-focus-visible:text-white">
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
);

export default QuickLinksSection;
