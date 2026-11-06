import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from './SectionHeading';

interface CtaBannerProps {
  onRegister: () => void;
}

const CtaBanner = ({ onRegister }: CtaBannerProps) => (
  <section
    className="bg-blue-300 dark:bg-blue-950/50"
    aria-label="Create recruiter account"
  >
    <div className="mx-auto w-full  ">
      <div className=" bg-blue-50 dark:bg-blue-950/40 px-6 py-10 text-center shadow-sm lg:px-12">
        <SectionHeading
          title=" Ready to build your team?"
          subtitle=" Create your recruiter account and post your first job today."
        />
        <Button
          type="button"
          onClick={onRegister}
          className="group mt-7 inline-flex h-12 items-center gap-2   divide-x divide-white/10 dark:divide-slate-700/10 rounded-xl border-2 border-white dark:border-slate-700  bg-blue-800 p-2 shadow-[5px_5px_0_0_#c96b7c] dark:border-white/60 hover:bg-blue-800 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#7a1724] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:transition-none lg:mt-[clamp(1rem,3.4vh,1.75rem)] dark:text-white"
        >
          Register Account
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Button>
      </div>
    </div>
  </section>
);

export default CtaBanner;
