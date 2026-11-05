import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pricingPlans } from './employerPortalData';
import SectionHeading from './SectionHeading';

interface PricingSectionProps {
  onRegister: () => void;
}

const PricingSection = ({ onRegister }: PricingSectionProps) => (
  <section
    className="bg-white dark:bg-slate-900 py-16 lg:py-20"
    aria-labelledby="pricing-title"
  >
    <div className="mx-auto w-full max-w-[1560px] px-5 lg:px-8">
      <SectionHeading
        id="pricing-title"
        eyebrow="Pricing"
        title="Simple plans that grow with your team"
        subtitle="Start small, then scale recruiter access as your hiring pipeline grows."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {pricingPlans.map(plan => (
          <article
            key={plan.name}
            className={`relative rounded-2xl border bg-white dark:bg-slate-900 p-6 shadow-sm ${
              plan.highlighted
                ? '-translate-y-2 border-blue-500 shadow-xl shadow-blue-100'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            {plan.highlighted && (
              <span className="absolute right-5 top-5 rounded-full bg-blue-700 px-3 py-1 text-xs font-bold text-white">
                Most popular
              </span>
            )}
            <h3 className="text-xl font-extrabold text-slate-950 dark:text-slate-100">
              {plan.name}
            </h3>
            <p className="mt-3 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
              {plan.price}
            </p>
            <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-600 dark:text-slate-300">
              {plan.description}
            </p>
            <div className="mt-6 space-y-3">
              {plan.features.map(feature => (
                <p
                  key={feature}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  {feature}
                </p>
              ))}
            </div>
            <Button
              type="button"
              onClick={onRegister}
              variant={plan.highlighted ? 'default' : 'outline'}
              className={`mt-7 h-12 w-full rounded-xl font-bold ${
                plan.highlighted
                  ? 'bg-blue-700 text-white hover:bg-blue-800'
                  : ''
              }`}
            >
              Register Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
