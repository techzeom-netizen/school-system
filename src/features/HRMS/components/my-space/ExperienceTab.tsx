import { useRef, useState, type FormEvent } from 'react';
import {
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  MapPin,
  Pencil,
  Plus,
} from 'lucide-react';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import ProfileEditDialog, { type ProfileEditField } from './ProfileEditDialog';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';

interface Experience {
  id: string;
  company: string;
  position: string;
  workType: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  technologies: string[];
  document: string;
}

interface ExperienceForm extends Record<string, string> {
  company: string;
  position: string;
  workType: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  technologies: string;
  document: string;
}

const initialExperience: Experience = {
  id: 'initial-experience',
  company: 'Heptarise IT Solutions',
  position: 'Software Developer',
  workType: 'Internship',
  startDate: '2025-01-01',
  endDate: '2025-07-01',
  location: 'Project Intern',
  description:
    'Worked as a Project Intern at Heptarise IT Solutions for 6 months, contributing to the development of real-world web applications. Gained hands-on experience in backend development and project-based collaboration using modern technologies. Implemented backend features using Django and MTV architecture, reducing development time by 30%. Designed and managed MySQL databases and worked with Django ORM to improve data handling and performance.',
  technologies: [
    'HTML',
    'CSS',
    'Bootstrap',
    'JavaScript',
    'Python',
    'Django',
    'MySQL',
  ],
  document: 'Internship Certificate',
};

const emptyForm: ExperienceForm = {
  company: '',
  position: '',
  workType: '',
  startDate: '',
  endDate: '',
  location: '',
  description: '',
  technologies: '',
  document: '',
};

const workTypeOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Freelance', label: 'Freelance' },
];

const experienceEditFields: ProfileEditField[] = [
  { name: 'company', label: 'Company', required: true },
  { name: 'position', label: 'Position', required: true },
  {
    name: 'workType',
    label: 'Work Type',
    type: 'select',
    options: workTypeOptions,
    required: true,
  },
  { name: 'location', label: 'Location' },
  { name: 'startDate', label: 'Start Date', type: 'date', required: true },
  { name: 'endDate', label: 'End Date', type: 'date' },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 4,
    colSpan: 2,
  },
  {
    name: 'technologies',
    label: 'Technologies',
    hint: 'Separate technologies with commas.',
    colSpan: 2,
  },
  {
    name: 'document',
    label: 'Replace Document',
    type: 'file',
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
    hint: 'Choose a file to replace the attached document.',
    colSpan: 2,
  },
];

const formatDate = (date: string) => {
  if (!date) return 'Present';

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getDateRange = (experience: Experience) => {
  const start = experience.startDate
    ? new Date(`${experience.startDate}T00:00:00`).toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      })
    : '';
  const end = experience.endDate
    ? new Date(`${experience.endDate}T00:00:00`).toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      })
    : 'Present';

  return `${start} – ${end}`;
};

const toDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isCurrentExperience = (experience: Experience) => {
  const end = experience.endDate ? toDate(experience.endDate) : null;
  return !end || end.getTime() > Date.now();
};

const getDuration = (experience: Experience) => {
  const start = toDate(experience.startDate);
  const end = isCurrentExperience(experience)
    ? new Date()
    : toDate(experience.endDate);
  if (!start || !end) return '';

  const months = Math.max(
    1,
    (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth())
  );
  const years = Math.floor(months / 12);
  const restMonths = months % 12;

  return [years > 0 ? `${years}y` : '', restMonths > 0 ? `${restMonths}m` : '']
    .filter(Boolean)
    .join(' ');
};

const getSummary = (description: string) =>
  description
    .trim()
    .match(/^[^.!?]+[.!?]?/)?.[0]
    .trim() ?? '';

const sortExperiences = (items: Experience[]) =>
  [...items].sort((first, second) => {
    const currentGap =
      Number(isCurrentExperience(second)) - Number(isCurrentExperience(first));
    if (currentGap !== 0) return currentGap;

    return (
      (toDate(second.startDate)?.getTime() ?? 0) -
      (toDate(first.startDate)?.getTime() ?? 0)
    );
  });

const maxTimelineTechnologies = 3;

const ExperienceTab = () => {
  const [experiences, setExperiences] = useState([initialExperience]);
  const [activeExperienceId, setActiveExperienceId] = useState(
    initialExperience.id
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [form, setForm] = useState<ExperienceForm>(emptyForm);
  const [editForm, setEditForm] = useState<ExperienceForm>(emptyForm);
  const nextId = useRef(0);
  const activeExperience =
    experiences.find(item => item.id === activeExperienceId) ?? experiences[0];
  const timelineExperiences = sortExperiences(experiences);

  const updateForm = (name: keyof ExperienceForm, value: string) => {
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleAddExperience = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newExperience: Experience = {
      ...form,
      id: `experience-${Date.now()}-${nextId.current++}`,
      technologies: form.technologies
        .split(',')
        .map(technology => technology.trim())
        .filter(Boolean),
    };

    setExperiences(current => [...current, newExperience]);
    setActiveExperienceId(newExperience.id);
    setForm(emptyForm);
    setIsAddDialogOpen(false);
  };

  const openEditDialog = () => {
    if (!activeExperience) return;

    setEditForm({
      ...activeExperience,
      technologies: activeExperience.technologies.join(', '),
    });
    setIsEditDialogOpen(true);
  };

  const updateEditForm = (name: string, value: string) => {
    setEditForm(current => ({ ...current, [name]: value }));
  };

  const handleEditExperience = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeExperience) return;

    const updatedExperience: Experience = {
      ...editForm,
      id: activeExperience.id,
      technologies: editForm.technologies
        .split(',')
        .map(technology => technology.trim())
        .filter(Boolean),
    };

    setExperiences(current =>
      current.map(item =>
        item.id === activeExperience.id ? updatedExperience : item
      )
    );
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <Section title="Experience" contentClassName="bg-card p-3 sm:p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="default"
              className="w-full shrink-0 sm:w-auto"
              onClick={openEditDialog}
              disabled={!activeExperience}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit Profile
            </Button>
            <Button
              type="button"
              variant="default"
              className="w-full shrink-0 sm:w-auto"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Experience
            </Button>
          </div>
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Section
            className="order-2 !rounded-md  lg:order-2"
            contentClassName="p-4"
          >
            <div role="list" aria-label="Experience timeline">
              {timelineExperiences.map((item, index) => {
                const isActive = activeExperienceId === item.id;
                const isLast = index === timelineExperiences.length - 1;
                const isCurrent = isCurrentExperience(item);
                const summary = getSummary(item.description);
                const shownTechnologies = item.technologies.slice(
                  0,
                  maxTimelineTechnologies
                );
                const hiddenTechnologies =
                  item.technologies.length - shownTechnologies.length;
                const meta = [
                  getDateRange(item),
                  getDuration(item),
                  item.location,
                ].filter(Boolean);

                return (
                  <div role="listitem" key={item.id} className="relative">
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-5 top-12 w-0.5 -translate-x-1/2 rounded-full bg-primary/25"
                      />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveExperienceId(item.id)}
                      aria-pressed={isActive}
                      aria-label={`${item.position} at ${item.company}`}
                      className={`group h-auto w-full min-w-0 items-start justify-start gap-3 whitespace-normal rounded-md p-0 text-left hover:bg-transparent ${
                        isLast ? '' : 'pb-6'
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition-colors ${
                          isActive
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-primary/20 bg-primary/10 text-primary group-hover:bg-primary/20'
                        }`}
                      >
                        <Briefcase className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 space-y-1.5">
                        <span className="flex flex-wrap items-center gap-2">
                          <span
                            className={`break-words text-base font-semibold leading-tight ${
                              isActive ? 'text-primary' : 'text-card-foreground'
                            }`}
                          >
                            {item.position}
                          </span>
                          {isCurrent && (
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              Current
                            </span>
                          )}
                        </span>
                        <span className="block break-words text-sm font-medium text-card-foreground">
                          {item.company}
                        </span>
                        <span className="block break-words text-xs text-muted-foreground">
                          {meta.join(' | ')}
                        </span>
                        {summary && (
                          <span className="line-clamp-2 break-words text-xs text-muted-foreground">
                            {summary}
                          </span>
                        )}
                        {shownTechnologies.length > 0 && (
                          <span className="flex flex-wrap gap-1.5 pt-0.5">
                            {shownTechnologies.map(technology => (
                              <span
                                key={technology}
                                className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                              >
                                {technology}
                              </span>
                            ))}
                            {hiddenTechnologies > 0 && (
                              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                                +{hiddenTechnologies}
                              </span>
                            )}
                          </span>
                        )}
                      </span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </Section>

          {activeExperience && (
            <div className="order-1 min-w-0 space-y-3 lg:order-1">
              <Section
                className="!rounded-md border-border"
                contentClassName="p-3 sm:p-4"
              >
                <div className="flex min-w-0 flex-col gap-3  pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md ">
                      <Building2 className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold ">
                        {activeExperience.company}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activeExperience.position}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {activeExperience.workType}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                      {getDateRange(activeExperience)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {activeExperience.location}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  <FormField
                    label="Company"
                    name="experience-view-company"
                    value={activeExperience.company}
                    readOnly
                  />
                  <FormField
                    label="Position"
                    name="experience-view-position"
                    value={activeExperience.position}
                    readOnly
                  />
                  <FormField
                    label="Start Date"
                    name="experience-view-start-date"
                    value={formatDate(activeExperience.startDate)}
                    readOnly
                  />
                  <FormField
                    label="Work Type"
                    name="experience-view-work-type"
                    value={activeExperience.workType}
                    readOnly
                  />
                  <FormField
                    label="End Date"
                    name="experience-view-end-date"
                    value={formatDate(activeExperience.endDate)}
                    readOnly
                  />
                  <FormField
                    label="Location"
                    name="experience-view-location"
                    value={activeExperience.location}
                    readOnly
                  />
                </div>
              </Section>

              <Section
                className="!rounded-md border-border"
                contentClassName="p-3 sm:p-4"
              >
                <FormField
                  label="Description"
                  name="experience-view-description"
                  type="textarea"
                  value={
                    activeExperience.description || 'No description provided.'
                  }
                  rows={4}
                  readOnly
                />

                {activeExperience.technologies.length > 0 && (
                  <div className="mt-4 border-t border-border pt-4">
                    <FormField
                      label="Technologies Used"
                      name="experience-view-technologies"
                      value={activeExperience.technologies.join(', ')}
                      readOnly
                    />
                  </div>
                )}

                {activeExperience.document && (
                  <div className="mt-4 flex min-w-0 items-center gap-3  pt-4">
                    <FileText
                      className="h-4 w-4 shrink-0 "
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <FormField
                        label="Document"
                        name="experience-view-document"
                        value={activeExperience.document}
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </Section>
            </div>
          )}
        </div>
      </Section>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} modal>
        <DialogContent
          className="w-[calc(100%-2rem)] gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <Section
            title="Add Experience"
            className="!rounded-md border-border"
            contentClassName="space-y-4 bg-card p-4 sm:p-6"
          >
            <form onSubmit={handleAddExperience} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={value => updateForm('company', value)}
                  placeholder="Company name"
                  required
                />
                <FormField
                  label="Position"
                  name="position"
                  value={form.position}
                  onChange={value => updateForm('position', value)}
                  placeholder="Job title"
                  required
                />
                <FormField
                  label="Work Type"
                  name="workType"
                  type="select"
                  value={form.workType}
                  onChange={value => updateForm('workType', value)}
                  options={workTypeOptions}
                  placeholder="Select work type"
                  required
                />
                <FormField
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={value => updateForm('location', value)}
                  placeholder="Office or work location"
                />
                <FormField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={value => updateForm('startDate', value)}
                  required
                />
                <FormField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={value => updateForm('endDate', value)}
                  hint="Leave blank if this is your current role."
                />
                <FormField
                  label="Description"
                  name="description"
                  type="textarea"
                  value={form.description}
                  onChange={value => updateForm('description', value)}
                  placeholder="Describe your role and achievements"
                  rows={4}
                  colSpan={2}
                />
                <FormField
                  label="Technologies"
                  name="technologies"
                  value={form.technologies}
                  onChange={value => updateForm('technologies', value)}
                  placeholder="Separate technologies with commas"
                  hint="For example: React, TypeScript, Node.js"
                  colSpan={2}
                />
                <FormField
                  label="Document"
                  name="document"
                  value={form.document}
                  type="file"
                  onChange={value => updateForm('document', value)}
                  placeholder="Document name"
                  colSpan={2}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Experience</Button>
              </DialogFooter>
            </form>
          </Section>
        </DialogContent>
      </Dialog>
      <ProfileEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Experience"
        description="Update the selected work experience."
        fields={experienceEditFields}
        values={editForm}
        onValueChange={updateEditForm}
        onSubmit={handleEditExperience}
      />
    </>
  );
};

export default ExperienceTab;
