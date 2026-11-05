import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { footerLinks } from './data/landingContent';

const PublicFooter = () => (
  <footer className="bg-blue-900 text-white">
    <div className="mx-auto w-full max-w-[1560px] px-5 pb-5 pt-10 lg:px-8 lg:pt-12">
      <div className="grid gap-9 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
        <div>
          <Link
            to="/"
            aria-label="Demo School home"
            className="inline-block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200"
          >
            <img
              src="/frontendImages/LOGO.png"
              alt="Demo School"
              className="h-11 w-auto rounded bg-white object-contain p-1"
            />
          </Link>
          <p className="mt-5 text-sm font-semibold text-white">
            Verified Careers. Trusted Hiring.
          </p>
          <p className="mt-2 max-w-sm text-sm leading-7 text-blue-100">
            Discover employers, save your dream companies, and keep every step
            of your job search in one place.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerLinks.map(column => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-bold text-white">{column.title}</h2>
              <ul className="mt-4 space-y-2">
                {column.links.map(link => (
                  <li key={link.label}>
                    <Button
                      asChild
                      variant="link"
                      className="h-auto justify-start whitespace-normal px-0 py-1 text-left text-sm font-normal text-white/80 hover:text-white dark:hover:text-white focus-visible:ring-blue-200 dark:focus-visible:ring-blue-800 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
                    >
                      <Link to={link.href}>{link.label}</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="mt-8 border-t border-white/15 dark:border-slate-700/15 pt-5">
        <p className="text-center text-xs text-white/70">
          &copy; {new Date().getFullYear()} Demo School. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
export default PublicFooter;
