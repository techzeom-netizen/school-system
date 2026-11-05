import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that automatically scrolls to the top of the page when the route changes
 * This ensures users see the new page content from the beginning when navigating
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;
