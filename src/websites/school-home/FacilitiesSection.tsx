import {
  Bus,
  FlaskConical,
  Library,
  MonitorSmartphone,
  ShieldCheck,
  Trophy,
} from 'lucide-react';

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

const FacilitiesSection = () => (
  <section id="facilities" className="bg-white py-20 lg:py-24" data-reveal>
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-[#7a1724]">
        Our campus
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-[#071f3d] sm:text-3xl">
        Campus facilities
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map(({ title, text, icon: Icon }) => (
          <article
            key={title}
            className="flex min-h-40 gap-4 border border-slate-200 border-l-4 border-l-[#7a1724] bg-[#fbf8f0] p-6"
          >
            <Icon
              className="h-7 w-7 shrink-0 text-[#7a1724]"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <div>
              <h3 className="text-xl font-semibold text-[#071f3d]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default FacilitiesSection;
