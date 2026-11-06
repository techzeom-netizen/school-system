import { cn } from '@/lib/utils';

interface SchoolBrandProps {
  className?: string;
  compact?: boolean;
  inverse?: boolean;
  large?: boolean;
}

const SchoolBrand = ({
  className,
  compact = false,
  inverse = false,
  large = false,
}: SchoolBrandProps) => (
  <span className={cn('inline-flex items-center gap-3', className)}>
    <img
      src="/frontendImages/KDPublicLogo.png"
      alt=""
      className={cn(
        'shrink-0 object-contain',
        large ? 'h-20 w-20' : compact ? 'h-10 w-10' : 'h-14 w-14'
      )}
      aria-hidden="true"
    />
    <span>
      <span
        className={cn(
          'block font-bold leading-none',
          large ? 'text-2xl' : compact ? 'text-base' : 'text-lg',
          inverse ? 'text-white' : 'text-[#7A1724]'
        )}
      >
        KD Public School
      </span>
      <span
        className={cn(
          'block font-semibold uppercase tracking-[.15em]',
          large ? 'mt-1 text-[10px]' : '-mt-1 text-[9px]',
          inverse ? 'text-white/65' : 'text-[#7e5f10]'
        )}
      >
        Established in 2026
      </span>
    </span>
  </span>
);

export default SchoolBrand;
