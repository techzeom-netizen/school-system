// hooks/useLayout.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

type LayoutOrientation = 'horizontal' | 'vertical';

interface LayoutContextType {
  orientation: LayoutOrientation;
  toggleOrientation: () => void;
  isVertical: boolean;
  isHorizontal: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Get initial orientation from localStorage or default to 'horizontal'
  const getInitialOrientation = (): LayoutOrientation => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('navbar-layout');
      return (saved as LayoutOrientation) || 'horizontal';
    }
    return 'horizontal';
  };

  const [orientation, setOrientation] = useState<LayoutOrientation>(
    getInitialOrientation
  );

  // Save to localStorage whenever orientation changes
  useEffect(() => {
    localStorage.setItem('navbar-layout', orientation);
  }, [orientation]);

  const toggleOrientation = () => {
    setOrientation(prev => (prev === 'horizontal' ? 'vertical' : 'horizontal'));
  };

  const value = {
    orientation,
    toggleOrientation,
    isVertical: orientation === 'vertical',
    isHorizontal: orientation === 'horizontal',
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
