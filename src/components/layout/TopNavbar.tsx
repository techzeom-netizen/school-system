import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useLayout } from '@/hooks/useLayout';
import { UserRole } from '@/types';
import { getRoleDashboardPath } from '@/utils/roleUtils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LogOut, Layout } from 'lucide-react';

const logoSrc = '/frontendImages/LOGO.png';

interface TopNavbarProps {
  onLogout: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const { toggleOrientation, isVertical } = useLayout();

  return (
    <TooltipProvider>
      <div className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-responsive">
          <div className="flex h-12 items-center justify-between">
            {/* Logo */}
            <Link
              to={getRoleDashboardPath(user?.role || UserRole.JOB_SEEKER)}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img src={logoSrc} alt="Demo School" className="h-8 w-auto" />
            </Link>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Layout Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleOrientation}
                    className="h-9 w-9 hover:bg-accent"
                  >
                    <Layout className="h-4 w-4" />
                    <span className="sr-only">Toggle layout</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Switch to {isVertical ? 'horizontal' : 'vertical'} layout
                  </p>
                </TooltipContent>
              </Tooltip>

              <ThemeToggle />

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="h-9 px-3 text-xs hover:bg-accent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TopNavbar;
