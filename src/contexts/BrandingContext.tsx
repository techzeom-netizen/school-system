import React, { createContext, useContext, ReactNode, useMemo } from 'react';

// Default branding configuration for the school platform
export const defaultBranding = {
  companyName: 'KD Public School',
  primaryColor: '#7a1724',
  secondaryColor: '#d4a62f',
  fontFamily: 'Inter',
  contactInfo: {
    address: 'KD Public School Campus, Bengaluru, Karnataka 560001',
    phone: '+91 80 1234 5678',
    email: 'hello@kdpublicschool.edu',
    website: 'https://kdpublicschool.edu',
  },
};

export type BrandingType = typeof defaultBranding;

interface BrandingContextType {
  branding: BrandingType;
}

const BrandingContext = createContext<BrandingContextType | undefined>(
  undefined
);

interface BrandingProviderProps {
  children: ReactNode;
  branding?: BrandingType;
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({
  children,
  branding = defaultBranding,
}) => {
  const value = useMemo(() => ({ branding }), [branding]);

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = (): BrandingType => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    // Fallback to default branding if context is not available
    return defaultBranding;
  }
  return context.branding;
};

export default BrandingContext;
