import { useState } from 'react';
import { CalendarRange, ClipboardList, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Section from '@/components/common/Section';

import RegularizationTab from '../../components/AttendenceRequestTabs/RegularizationTab';
import OnDutyTab from '../../components/AttendenceRequestTabs/OnDutyTab';
import WFHTab from '../../components/AttendenceRequestTabs/WFHTab';
import LeaveTab from '../../components/AttendenceRequestTabs/LeaveTab';

const AttendenceRequests = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      label: 'Regularization',
      icon: Clock,
      component: <RegularizationTab />,
    },
    { id: 1, label: 'On Duty', icon: ClipboardList, component: <OnDutyTab /> },
    { id: 2, label: 'Work From Home', icon: Home, component: <WFHTab /> },
    {
      id: 3,
      label: 'Leave',
      icon: CalendarRange,
      component: <LeaveTab />,
    },
  ];

  return (
    <>
      <Section
        title="Attendance Requests"
        menuId="attendence-requests"
        showBreadcrumbs
      >
        <div className="w-full space-y-5 p-3 sm:p-0 lg:p-0">
          <div className="border-b border-border">
            <nav
              aria-label="Attendance request types"
              role="tablist"
              className="flex w-full gap-1 overflow-x-auto"
            >
              {tabs.map(tab => (
                <Button
                  key={tab.id}
                  id={`attendance-request-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-auto shrink-0 rounded-none border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-5 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>

          <div
            role="tabpanel"
            aria-labelledby={`attendance-request-tab-${activeTab}`}
            className="min-w-0"
          >
            {tabs[activeTab].component}
          </div>
        </div>
      </Section>
    </>
  );
};

export default AttendenceRequests;
