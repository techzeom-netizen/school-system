import React from 'react';
import { BrandingProvider, BrandingType } from '@/contexts/BrandingContext';

interface PublicLayoutProps {
  children: React.ReactNode;
  branding?: BrandingType;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children, branding }) => {
  return (
    <BrandingProvider branding={branding}>
      <div className="min-h-screen bg-gray-50">
        {/* Public layout wrapper with branding context */}
        <div className="w-full">{children}</div>
      </div>
    </BrandingProvider>
  );
};

export default PublicLayout;
