'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Section from '@/components/common/Section';

import PreJoiningTasks from './on-boarding/Pre-JoiningTasks';
import OnboardingTasks from './on-boarding/OnboardingTasks';
import Induction from './on-boarding/Induction';
import Probation from './on-boarding/Probation';

const TABS = [
  {
    id: 'pre-joining',
    label: 'Pre-Joining Portal',
    component: PreJoiningTasks,
  },
  { id: 'tasks', label: 'Onboarding Tasks', component: OnboardingTasks },
  { id: 'induction', label: 'Induction & Welcome', component: Induction },
  { id: 'probation', label: 'Probation & Confirmation', component: Probation },
] as const;

export default function OnboardingHubPage() {
  const [tab, setTab] = useState<string>('pre-joining');
  const navigate = useNavigate();

  return (
    <div>
      <Section title="Onboarding Hub" menuId="onboarding-hub" showBreadcrumbs>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Manage candidate pre-joining, tasks, induction, and probation
            tracking.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Onboarding steps"
              className="flex flex-wrap gap-1"
            >
              {TABS.map(item => {
                const isActive = tab === item.id;

                return (
                  <Button
                    key={item.id}
                    type="button"
                    variant="ghost"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setTab(item.id)}
                    className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:bg-transparent hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>
            <div className="ml-auto flex w-full justify-end sm:w-auto">
              <Button
                type="button"
                className="w-full sm:w-44"
                onClick={() =>
                  navigate(
                    '/dashboard/employer/actions/onboarding-hub/add-candidate'
                  )
                }
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Add Candidate
              </Button>
            </div>
          </div>

          {TABS.map(item => {
            const TabComponent = item.component;

            return (
              <div
                key={item.id}
                role="tabpanel"
                hidden={tab !== item.id}
                className={tab === item.id ? 'pt-2' : undefined}
              >
                <TabComponent />
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
