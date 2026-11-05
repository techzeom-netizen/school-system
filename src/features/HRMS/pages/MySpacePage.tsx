import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  BadgeCheck,
  Box,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarMinus,
  CheckCircle2,
  ChevronRight,
  Contact,
  Clock3,
  FileText,
  GraduationCap,
  Network,
  Phone,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Section from '@/components/common/Section';
import WorkTab from '../components/my-space/WorkTab';
import ExperienceTab from '../components/my-space/ExperienceTab';
import AttendanceTab from '../components/my-space/AttendanceTab';
import LeavesTab from '../components/my-space/LeavesTab';
import PayslipsTab from '../components/my-space/PayslipsTab';
import AssetsTab from '../components/my-space/AssetsTab';
import EducationTab from '../components/my-space/EducationTab';
import ContactTab from '../components/my-space/ContactTab';
import IdentityTab from '../components/my-space/IdentityTab';
import DocumentsTab from '../components/my-space/DocumentsTab';
import AcknowledgementsTab from '../components/my-space/AcknowledgementsTab';

const profileSections = [
  { key: 'work', label: 'Work', icon: Briefcase, component: WorkTab },
  {
    key: 'experience',
    label: 'Experience',
    icon: Award,
    component: ExperienceTab,
  },
  {
    key: 'attendance',
    label: 'Attendance',
    icon: CalendarCheck,
    component: AttendanceTab,
  },
  { key: 'leaves', label: 'Leaves', icon: CalendarMinus, component: LeavesTab },
  { key: 'payslips', label: 'Payslips', icon: Wallet, component: PayslipsTab },
  { key: 'assets', label: 'Assets', icon: Box, component: AssetsTab },
  {
    key: 'education',
    label: 'Education',
    icon: GraduationCap,
    component: EducationTab,
  },
  { key: 'contact', label: 'Contact', icon: Phone, component: ContactTab },
  { key: 'identity', label: 'Identity', icon: Contact, component: IdentityTab },
  {
    key: 'documents',
    label: 'Documents',
    icon: FileText,
    component: DocumentsTab,
  },
  {
    key: 'acknowledgements',
    label: 'Acknowledgements',
    icon: BadgeCheck,
    component: AcknowledgementsTab,
  },
] as const;

type ProfileSectionKey = (typeof profileSections)[number]['key'];

const ProfileCompletionRing = ({ small = false }: { small?: boolean }) => (
  <div
    className={`grid shrink-0 place-items-center rounded-full p-1.5 ${
      small ? 'h-12 w-12' : 'h-20 w-20'
    }`}
    style={{
      background:
        'conic-gradient(hsl(var(--primary)) 0deg 288deg, hsl(var(--muted)) 288deg 360deg)',
    }}
    role="img"
    aria-label="Profile 80 percent complete"
  >
    <span
      className={`grid h-full w-full place-items-center rounded-full bg-background font-semibold text-primary ${
        small ? 'text-xs' : 'text-lg'
      }`}
    >
      80%
    </span>
  </div>
);

const MySpacePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ProfileSectionKey>('work');

  return (
    <>
      <Section title="My Profile" menuId="profile" showBreadcrumbs>
        <Section className="!rounded-md border-border" contentClassName="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:items-center">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-secondary text-2xl font-semibold text-secondary-foreground">
                SA
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-card-foreground">
                  Singam A
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">SWM001</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Software Developer
                </p>
              </div>
            </div>

            <ProfileSummaryItem
              icon={Network}
              label="Department"
              value="Engineering"
            />
            <ProfileSummaryItem icon={Building2} label="Office" value="-" />
            <ProfileSummaryItem
              icon={Clock3}
              label="Status"
              value={
                <span className="inline-flex rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  Active
                </span>
              }
            />
            <div className="flex items-center gap-3 border-t border-border pt-3 xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
              <ProfileCompletionRing small />
              <span className="text-xs text-muted-foreground">
                Profile completion
              </span>
            </div>
          </div>
        </Section>

        <div className="grid min-w-0 grid-cols-1 gap-4 bg-muted/30 p-2 sm:p-4 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <Section
              title="Profile Completion"
              icon={CheckCircle2}
              headerClassName="bg-card [&_.text-navbar-text]:text-card-foreground"
            >
              <div className="flex flex-col items-center">
                <ProfileCompletionRing />
                <div className="mt-4 flex items-start gap-2 text-center">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div>
                    <p className="text-xs font-medium text-destructive">
                      Missing information
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      2 items remaining
                    </p>
                  </div>
                </div>
                <div
                  role="list"
                  className="mt-3 w-full space-y-2 text-xs text-muted-foreground"
                >
                  <div role="listitem">Bank account details</div>
                  <div role="listitem">Emergency contact</div>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4 w-full text-primary"
                  onClick={() => setActiveSection('contact')}
                >
                  Complete profile
                  <span aria-hidden="true">→</span>
                </Button>
              </div>
            </Section>

            <Section
              className="!rounded-md border-border"
              contentClassName="p-2"
            >
              <nav
                aria-label="Profile sections"
                className="grid min-w-0 grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-col"
              >
                {profileSections.map(section => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.key;

                  return (
                    <Button
                      key={section.key}
                      type="button"
                      variant={isActive ? 'secondary' : 'ghost'}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setActiveSection(section.key)}
                      className={`min-w-0 w-full justify-start gap-2 whitespace-normal text-left lg:shrink-0 ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 break-words">
                        {section.label}
                      </span>
                      {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                    </Button>
                  );
                })}
              </nav>
            </Section>
          </div>

          <main className="min-w-0 space-y-4 lg:col-span-3">
            {profileSections.map(section => {
              const Tab = section.component;

              return (
                <div key={section.key} hidden={activeSection !== section.key}>
                  <Tab />
                </div>
              );
            })}
          </main>
        </div>
      </Section>
    </>
  );
};

interface ProfileSummaryItemProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
}

const ProfileSummaryItem = ({
  label,
  value,
  icon: Icon,
}: ProfileSummaryItemProps) => (
  <div className="flex gap-2 border-t border-border pt-3 xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-medium text-card-foreground">
        {value}
      </div>
    </div>
  </div>
);

export default MySpacePage;
