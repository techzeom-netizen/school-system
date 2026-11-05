import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that scrolls to the top of the page whenever the route changes
 * This ensures users see the new page content from the beginning
 */
const useScrollToTop = (): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  }, [pathname]);
};

export default useScrollToTop;
