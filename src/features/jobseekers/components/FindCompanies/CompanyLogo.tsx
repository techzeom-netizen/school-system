import { initialsOf, toneClasses, type Company } from '../../data/companies';

type CompanyLogoProps = {
  company: Pick<Company, 'name' | 'tone'>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-lg',
  lg: 'h-20 w-20 text-2xl',
};

const CompanyLogo = ({
  company,
  size = 'md',
  className = '',
}: CompanyLogoProps) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-lg border font-black shadow-sm ${toneClasses[company.tone]} ${sizeClasses[size]} ${className}`}
    aria-hidden="true"
  >
    {initialsOf(company.name)}
  </div>
);

export default CompanyLogo;
