import type { ReactElement } from 'react';
import { Building2, ChevronRight, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PortalLoginDropdownProps {
  trigger: ReactElement;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const PortalLoginDropdown = ({
  trigger,
  align = 'end',
  side = 'bottom',
}: PortalLoginDropdownProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={8}
        className="w-[26rem] max-w-[calc(100vw-2rem)] rounded-xl border-[#7a1724]/15 bg-white p-4 text-[#071f3d] shadow-xl"
      >
        <div className="px-1 pb-3">
          <p className="text-base font-bold">Welcome to School Portal</p>
          <p className="mt-1 text-xs text-slate-600">
            Select your portal to continue
          </p>
        </div>
        <DropdownMenuItem
          className="group mb-2 cursor-pointer gap-3 rounded-lg border border-slate-200 p-3 focus:bg-[#7a1724]/5 focus:text-[#071f3d]"
          onSelect={() => navigate('/login')}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#7a1724]/10 text-[#7a1724]">
            <UsersRound className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">Parent Portal</span>
            <span className="mt-0.5 block text-xs leading-5 text-slate-600">
              Attendance, fees, results and student information.
            </span>
          </span>
          <ChevronRight
            className="size-5 shrink-0 text-[#7a1724] transition-transform group-focus:translate-x-0.5"
            aria-hidden="true"
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="group cursor-pointer gap-3 rounded-lg border border-slate-200 p-3 focus:bg-[#7a1724]/5 focus:text-[#071f3d]"
          onSelect={() => navigate('/superadmin/login')}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d4a62f]/15 text-[#7a1724]">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Staff &amp; Administration</span>
            <span className="mt-0.5 block text-xs leading-5 text-slate-600">
              Access for school employees and management.
            </span>
          </span>
          <ChevronRight
            className="size-5 shrink-0 text-[#7a1724] transition-transform group-focus:translate-x-0.5"
            aria-hidden="true"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PortalLoginDropdown;
