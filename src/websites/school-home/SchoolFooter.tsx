import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SchoolBrand from '@/components/common/SchoolBrand';
import { Button } from '@/components/ui/button';
import HomeSectionLink from './HomeSectionLink';
import PortalLoginDropdown from './PortalLoginDropdown';

const SchoolFooter = () => (
  <footer
    id="contact"
    className="relative overflow-hidden bg-gradient-to-br from-[#4f0f19] via-[#7a1724] to-[#3d0b13] text-white md:max-h-[400px] lg:max-h-[350px]"
  >
    <div
      className="pointer-events-none absolute -right-24 top-24 size-80 rounded-full border border-[#d4a62f]/15"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute -right-8 top-40 size-48 rounded-full border border-[#d4a62f]/10"
      aria-hidden="true"
    />

    <div className="relative border-b border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e8c866]">
            Begin your school journey
          </p>
          <h2 className="mt-1 text-lg font-semibold sm:text-xl">
            Discover whether KD Public School is right for your child.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-[#d4a62f] font-bold text-[#4f0f19] hover:bg-[#e8c866]"
          >
            <Link to="/enquiry">
              Make an enquiry <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link to="/notice-board">View school updates</Link>
          </Button>
        </div>
      </div>
    </div>

    <div className="relative mx-auto grid max-w-7xl gap-7 px-5 py-7 sm:grid-cols-2 md:grid-cols-[1.3fr_.7fr_.8fr_1.1fr] lg:grid-cols-[1.4fr_.75fr_.8fr_1.1fr] lg:px-8 lg:py-6">
      <div>
        <Link
          to="/"
          className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a62f]"
          aria-label="KD Public School home"
        >
          <SchoolBrand inverse />
        </Link>
        <p className="mt-3 hidden max-w-sm text-xs leading-5 text-white/70 lg:block">
          A caring school community where thoughtful teaching, practical
          learning and strong values help every child grow with confidence.
        </p>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#e8c866]">
          Knowledge · Discipline · Excellence
        </p>
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/55">
            Follow our school
          </p>
          <div className="mt-2 flex gap-2">
            <a
              href="https://www.facebook.com/kdpublicschool"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="KD Public School on Facebook"
              className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[#e8c866] transition-all hover:-translate-y-0.5 hover:border-[#d4a62f] hover:bg-[#d4a62f] hover:text-[#4f0f19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a62f]"
            >
              <Facebook className="size-4" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/kdpublicschool"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="KD Public School on Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[#e8c866] transition-all hover:-translate-y-0.5 hover:border-[#d4a62f] hover:bg-[#d4a62f] hover:text-[#4f0f19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a62f]"
            >
              <Instagram className="size-4" aria-hidden="true" />
            </a>
            <a
              href="https://www.youtube.com/@kdpublicschool"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="KD Public School on YouTube"
              className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[#e8c866] transition-all hover:-translate-y-0.5 hover:border-[#d4a62f] hover:bg-[#d4a62f] hover:text-[#4f0f19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a62f]"
            >
              <Youtube className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#e8c866]">
          Explore
        </p>
        <nav
          className="mt-4 grid gap-2 text-xs text-white/75 lg:text-sm"
          aria-label="Footer navigation"
        >
          <Link to="/about-us" className="transition-colors hover:text-white">
            About the school
          </Link>
          <HomeSectionLink
            sectionId="academics"
            className="transition-colors hover:text-white"
          >
            Academics
          </HomeSectionLink>
          <HomeSectionLink
            sectionId="facilities"
            className="transition-colors hover:text-white"
          >
            Campus facilities
          </HomeSectionLink>
          <HomeSectionLink
            sectionId="admissions"
            className="transition-colors hover:text-white"
          >
            Admissions
          </HomeSectionLink>
        </nav>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#e8c866]">
          Useful links
        </p>
        <div className="mt-4 grid justify-items-start gap-2 text-xs lg:text-sm">
          <Link
            to="/notice-board"
            className="text-white/75 transition-colors hover:text-white"
          >
            Notice board
          </Link>
          <Link
            to="/enquiry"
            className="text-white/75 transition-colors hover:text-white"
          >
            Admissions enquiry
          </Link>
          <PortalLoginDropdown
            align="start"
            side="top"
            trigger={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 border-[#d4a62f]/70 bg-white/5 text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10"
              >
                Portal login <ChevronDown aria-hidden="true" />
              </Button>
            }
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#e8c866]">
          Contact the school
        </p>
        <div className="mt-4 grid gap-3 text-xs text-white/75 lg:text-sm">
          <a
            href="mailto:hello@kdpublicschool.edu"
            className="flex items-start gap-3 transition-colors hover:text-white"
          >
            <Mail
              className="mt-0.5 size-4 shrink-0 text-[#e8c866]"
              aria-hidden="true"
            />
            hello@kdpublicschool.edu
          </a>
          <a
            href="tel:+919876543210"
            className="flex items-start gap-3 transition-colors hover:text-white"
          >
            <Phone
              className="mt-0.5 size-4 shrink-0 text-[#e8c866]"
              aria-hidden="true"
            />
            +91 98765 43210
          </a>
          <p className="flex items-start gap-3">
            <MapPin
              className="mt-0.5 size-4 shrink-0 text-[#e8c866]"
              aria-hidden="true"
            />
            Campus visits available by appointment
          </p>
          <p className="flex items-start gap-3">
            <Clock3
              className="mt-0.5 size-4 shrink-0 text-[#e8c866]"
              aria-hidden="true"
            />
            Admissions replies within one school day
          </p>
        </div>
      </div>
    </div>

    <div className="relative border-t border-white/10 bg-black/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-3 text-[11px] text-white/55 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© 2026 KD Public School. All rights reserved.</p>
        <p>Established in 2026 · Affiliated to CBSE, New Delhi</p>
      </div>
    </div>
  </footer>
);

export default SchoolFooter;
