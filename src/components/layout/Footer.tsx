import React from 'react';
import { Link } from 'react-router-dom';
import SchoolBrand from '@/components/common/SchoolBrand';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t-4 border-[#d4a62f] bg-gradient-to-r from-[#4f0f19] via-[#7a1724] to-[#65121d] text-white">
      <div className="container-responsive py-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Link
              to="/"
              aria-label="KD Public School home"
              className="w-fit rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a62f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#7a1724]"
            >
              <SchoolBrand compact inverse />
            </Link>
            <span className="hidden h-10 w-px bg-white/20 sm:block" />
            <p className="max-w-xs text-xs leading-5 text-white/70">
              School administration portal for secure academic and operational
              management.
            </p>
          </div>

          <div className="text-xs text-white/70 sm:text-right">
            <span className="block uppercase tracking-[0.14em] text-[#e8c866]">
              Technology partner
            </span>
            <a
              href="https://zeksta.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block font-semibold text-white transition-colors hover:text-[#f0d47a] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a62f]"
            >
              Zeksta Technology
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-responsive flex flex-col gap-1 py-3 text-[11px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} KD Public School. All rights
            reserved.
          </p>
          <p>Knowledge · Discipline · Excellence</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
