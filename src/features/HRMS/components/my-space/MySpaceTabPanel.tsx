import Section from '@/components/common/Section';

interface MySpaceTabPanelProps {
  title: string;
  description: string;
}

const MySpaceTabPanel = ({ title, description }: MySpaceTabPanelProps) => (
  <Section
    title={title}
    className="!rounded-md border-border"
    headerClassName="bg-muted [&_.text-navbar-text]:text-foreground"
    contentClassName="bg-card p-5"
  >
    <p className="text-sm leading-6 text-muted-foreground">{description}</p>
  </Section>
);

export default MySpaceTabPanel;
