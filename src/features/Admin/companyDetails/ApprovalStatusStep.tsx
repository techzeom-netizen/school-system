import React from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApprovalInfo } from './types';
import { CompanyDetails } from '@/types';

interface ApprovalStatusStepProps {
  approval: ApprovalInfo;
  details: CompanyDetails;
  isChecking: boolean;
  onCheckStatus: () => void;
  onEdit: () => void;
  onGoToDashboard: () => void;
}

/**
 * Step 4: waiting for / result of super admin approval.
 * Renders the pending, approved or rejected view from approval.status.
 */
const ApprovalStatusStep: React.FC<ApprovalStatusStepProps> = ({
  approval,
  isChecking,
  onCheckStatus,
  onEdit,
  onGoToDashboard,
}) => {
  const { status } = approval;
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';
  const isReviewed = isApproved || isRejected;

  // Status configuration
  let tone = {
    box: 'bg-amber-100 text-amber-600 border-amber-500',
    icon: Clock,
  };

  let title = 'Pending approval';
  let text =
    'Your organisation details were sent to the Demo School team. Dashboard access stays locked until your organisation is approved.';

  let decisionLabel = 'Decision';
  let decisionSub = 'Approved or changes needed';
  let decisionState = 'todo';

  let connectorColor = 'bg-border';
  let mobileConnectorColor = 'bg-border';

  if (isApproved) {
    tone = {
      box: 'bg-emerald-100 text-emerald-600 border-emerald-600',
      icon: CheckCircle2,
    };

    title = 'Company approved';
    text =
      'The super admin has approved your company. You can now use the full dashboard and the free HRMS for your employees.';

    decisionLabel = 'Approved';
    decisionSub = 'Full access unlocked';
    decisionState = 'done';

    connectorColor = 'bg-emerald-600';
    mobileConnectorColor = 'bg-emerald-600';
  } else if (isRejected) {
    tone = {
      box: 'bg-red-100 text-red-600 border-red-600',
      icon: AlertCircle,
    };

    title = 'Request not approved yet';
    text =
      'Your dashboard access stays locked. Update your details and submit again, and the request goes back for review.';

    decisionLabel = 'Changes needed';
    decisionSub = 'Update and resubmit';
    decisionState = 'error';

    connectorColor = 'bg-red-500';
    mobileConnectorColor = 'bg-red-500';
  }

  const StatusIcon = tone.icon;
  const rejectionReasons = Array.from(
    new Set(
      [approval.rejectionReason, ...(approval.rejectionReasons || [])].filter(
        (reason): reason is string => Boolean(reason?.trim())
      )
    )
  );

  const reviewLabel = isReviewed ? 'Reviewed' : 'Under review';
  const reviewSub = isReviewed
    ? 'Verified by Demo School'
    : 'Super admin is verifying';
  const reviewState = isReviewed ? 'done' : 'current';

  const timeline = [
    {
      label: 'Request submitted',
      sub: 'Details and documents sent',
      state: 'done',
    },
    {
      label: reviewLabel,
      sub: reviewSub,
      state: reviewState,
    },
    {
      label: decisionLabel,
      sub: decisionSub,
      state: decisionState,
    },
  ];

  const dot: Record<string, string> = {
    done: 'border-emerald-600 bg-emerald-600 text-white shadow-sm',
    current: 'border-amber-500 bg-amber-500 text-white shadow-sm',
    error: 'border-red-600 bg-red-600 text-white shadow-sm',
    todo: 'border-border bg-card text-muted-foreground',
  };

  const pulseClass = !isReviewed
    ? 'animate-pulse motion-reduce:animate-none'
    : '';

  return (
    <div className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <span
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-2 shadow-sm ${pulseClass} ${tone.box}`}
        >
          <StatusIcon className="h-9 w-9" aria-hidden="true" />
        </span>

        <h3 className="mt-6 text-2xl font-extrabold tracking-tight">{title}</h3>

        <p className="mx-auto mt-2 max-w-xl text-gray-600 dark:text-white/70">
          {text}
        </p>

        <p className="mx-auto mt-4 w-fit rounded-full border border-border bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wide text-foreground">
          Status: {status}
        </p>

        {isRejected && rejectionReasons.length > 0 && (
          <div className="mx-auto mt-5 max-w-xl rounded-lg border border-red-200 bg-red-50 p-4 text-left">
            <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">
              Rejection reasons
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-900">
              {rejectionReasons.map(reason => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {isApproved && (
            <Button type="button" size="lg" onClick={onGoToDashboard}>
              Go to dashboard
            </Button>
          )}

          {isRejected && (
            <Button type="button" size="sm" variant="pending" onClick={onEdit}>
              Edit and Resubmit
            </Button>
          )}

          {status === 'pending' && (
            <Button
              type="button"
              size="lg"
              variant="outline"
              isLoading={isChecking}
              onClick={onCheckStatus}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Check status
            </Button>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-muted/20 px-4 py-7 sm:px-8 sm:py-8">
        <ol className="relative grid grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-0">
          <span
            className="absolute left-[16.666%] right-1/2 top-7 hidden h-1 bg-emerald-600 sm:block"
            aria-hidden="true"
          />

          <span
            className={`absolute left-1/2 right-[16.666%] top-7 hidden h-1 sm:block ${connectorColor}`}
            aria-hidden="true"
          />

          {timeline.map((item, index) => {
            let mobileLineColor = mobileConnectorColor;

            if (index === 0) {
              mobileLineColor = 'bg-emerald-600';
            }

            let stepContent: React.ReactNode = index + 1;

            if (item.state === 'done') {
              stepContent = <Check className="h-6 w-6" aria-hidden="true" />;
            } else if (item.state === 'error') {
              stepContent = (
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
              );
            }

            return (
              <li
                key={item.label}
                className="relative z-10 flex items-center gap-4 sm:flex-col sm:text-center"
              >
                {index < timeline.length - 1 && (
                  <span
                    className={`absolute left-7 top-14 h-7 w-1 -translate-x-1/2 sm:hidden ${mobileLineColor}`}
                    aria-hidden="true"
                  />
                )}

                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                  {item.state === 'current' && (
                    <span
                      className="absolute inset-0 animate-ping rounded-2xl bg-amber-400/25 motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  )}

                  <span
                    className={`relative flex h-12 w-12 items-center justify-center rounded-xl border-2 text-base font-extrabold ${dot[item.state]}`}
                  >
                    {stepContent}
                  </span>
                </span>

                <div>
                  <p className="text-sm font-bold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.sub}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
};

export default ApprovalStatusStep;
