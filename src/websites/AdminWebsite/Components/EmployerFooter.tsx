import { Button } from '@/components';
import SchoolBrand from '@/components/common/SchoolBrand';
import { Facebook, Linkedin, Twitter } from 'lucide-react';

const linkColumns = [
  ['Employers', 'Post a job', 'Search candidates', 'Pricing'],
  ['Company', 'About', 'Careers', 'Contact'],
  ['Support', 'Help center', 'Privacy', 'Terms'],
];

const EmployerFooter = () => (
  <footer className="bg-blue-900 text-white slate-700">
    <div className="mx-auto grid w-full  gap-10 px-5 pt-8 pb-4 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
      <div>
        <SchoolBrand inverse />
        <p className="mt-5 max-w-sm text-sm leading-7 text-white">
          KD Public School helps administrators, teachers, staff and parents
          manage hiring pipelines with confidence.
        </p>
        <div className="mt-5 flex gap-3">
          {[Facebook, Twitter, Linkedin].map((Icon, index) => (
            <Button
              key={index}
              type="button"
              variant="link"
              aria-label="Social link"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white dark:border-slate-700 text-white hover:border-blue-100 dark:hover:border-blue-900 hover:text-white dark:hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-3 lg:col-span-2">
        {linkColumns.map(([title, ...links]) => (
          <div key={title}>
            <h2 className="font-bold text-white">{title}</h2>
            <div className="mt-4 space-y-3">
              {links.map(link => (
                <Button
                  key={link}
                  variant="link"
                  type="button"
                  className="block text-sm text-white/80 hover:text-white dark:hover:text-white"
                >
                  {link}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-3">
        <p className="-mt-3 text-center text-xs text-white/70">
          &copy; 2026 KD Public School. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default EmployerFooter;
