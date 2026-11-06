import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/websites/AdminWebsite/Components/SectionHeading';

const SignUpCtaSection = ({ onSignIn }: { onSignIn?: () => void }) => (
  <section
    aria-labelledby="signup-cta-heading"
    className="bg-blue-300 dark:bg-blue-800/40"
  >
    <div className="bg-blue-50 dark:bg-blue-950/40 px-6 py-10 text-center shadow-sm lg:px-12">
      <SectionHeading
        id="signup-cta-heading"
        title="Your next role is one profile away."
        subtitle="Join KD Public School and stay connected to your school community."
      />
      <div className="mt-7 flex flex-wrap items-center justify-center gap-5 lg:mt-[clamp(1rem,3.4vh,1.75rem)]">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="group h-11 rounded-lg border-2  bg-white dark:bg-slate-900 -800 px-6 text-blue-800 dark:text-blue-300  border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:scale-105 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <Link to="/jobseekers/register">Create free account</Link>
        </Button>
        <Button
          asChild={!onSignIn}
          onClick={onSignIn}
          variant="outline"
          size="lg"
          className="group h-11 rounded-lg border-2 border-white dark:border-slate-700 bg-blue-800 px-6 text-white hover:bg-blue-800 hover:scale-105 hover:text-white dark:hover:text-white"
        >
          {onSignIn ? 'Sign in' : <Link to="/jobseekers">Sign in</Link>}
        </Button>
      </div>
    </div>
  </section>
);
export default SignUpCtaSection;
