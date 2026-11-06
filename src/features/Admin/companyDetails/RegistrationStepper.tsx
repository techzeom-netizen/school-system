import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { ApprovalStatus, RegistrationStep } from './types';

interface RegistrationStepperProps {
  currentStep: RegistrationStep;
  approvalStatus: ApprovalStatus;
}

const steps = [
  { title: 'Company details', text: 'Business and contact info' },
  { title: 'Documents', text: 'GST, PAN, certificate' },
  { title: 'Review & submit', text: 'Confirm your request' },
  { title: 'Approval Status', text: 'Verification by KD Public School' },
];

const RegistrationStepper: React.FC<RegistrationStepperProps> = ({
  currentStep,
  approvalStatus,
}) => (
  <ol className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 p-4 lg:grid-cols-4">
    {steps.map((step, index) => {
      const number = index + 1;
      const isFinalStep = number === 4;
      let tone = 'border-gray-300 text-gray-400';
      let icon: React.ReactNode = number;

      if (
        currentStep > number ||
        (isFinalStep && approvalStatus === 'approved')
      ) {
        tone = 'border-emerald-600 bg-emerald-600 text-white';
        icon = <Check className="h-4 w-4" />;
      } else if (
        isFinalStep &&
        currentStep === 4 &&
        approvalStatus === 'pending'
      ) {
        tone = 'border-amber-500 bg-amber-500 text-white';
        icon = <Clock className="h-4 w-4" />;
      } else if (
        isFinalStep &&
        currentStep === 4 &&
        approvalStatus === 'rejected'
      ) {
        tone = 'border-red-600 bg-red-600 text-white';
        icon = <AlertCircle className="h-4 w-4" />;
      } else if (currentStep === number) {
        tone = 'border-yellow-600 bg-yellow-500 text-white';
      }

      return (
        <li key={step.title} className="flex items-center gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-extrabold ${tone}`}
          >
            {icon}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{step.title}</p>
            <p className="truncate text-xs text-gray-500 dark:text-white/70">
              {step.text}
            </p>
          </div>
        </li>
      );
    })}
  </ol>
);

export default RegistrationStepper;
