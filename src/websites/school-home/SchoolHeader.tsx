import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import SchoolBrand from '@/components/common/SchoolBrand';
import { Button } from '@/components/ui/button';
import PortalLoginDropdown from './PortalLoginDropdown';

const navigation = [
  { href: '#top', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#academics', label: 'Academics' },
  { href: '#admissions', label: 'Admissions' },
  { href: '#facilities', label: 'Campus' },
  { href: '#notice-board', label: 'Notice board' },
  { href: '#contact', label: 'Contact' },
];

const SchoolHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-2 lg:px-8">
        <a
          href="#top"
          className="flex items-center gap-4"
          aria-label="KD Public School home"
        >
          <SchoolBrand />
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
          className="shrink-0 text-[#071f3d] lg:hidden"
          onClick={() => setMenuOpen(open => !open)}
          aria-label={
            menuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </div>

      <div className="border-b-4 border-[#D4A62F] bg-gradient-to-br from-[#4f0f19] via-[#7a1724] to-[#9a3342] text-white shadow-md">
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
            <PortalLoginDropdown
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  className="h-full rounded-none !border-0 px-5 text-white !shadow-none hover:bg-white/10 hover:text-white focus-visible:!border-0 focus-visible:!ring-0 focus-visible:!outline-none data-[state=open]:bg-white/10"
                >
                  Login <ChevronDown aria-hidden="true" />
                </Button>
              }
            />
            <Button
              asChild
              className="h-full rounded-none  bg-[#d4a62f] px-8 font-bold text-[#7a1724] hover:bg-[#e0bb54]"
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
                className="col-span-2 bg-[#d4a62f] font-bold text-[#071f3d] hover:bg-[#e0bb54]"
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
  );
};

export default SchoolHeader;
