import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll to top on route change (but not hash changes within same page)
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' for immediate scroll, 'smooth' for animated
      });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
