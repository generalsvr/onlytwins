'use client';

import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'm' | 'ms' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  xs: 0,
  ms:320,
  m:375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Update breakpoint
      if (window.innerWidth >= breakpoints['2xl']) {
        setBreakpoint('2xl');
      } else if (window.innerWidth >= breakpoints.xl) {
        setBreakpoint('xl');
      } else if (window.innerWidth >= breakpoints.lg) {
        setBreakpoint('lg');
      } else if (window.innerWidth >= breakpoints.md) {
        setBreakpoint('md');
        setIsMobile(false);
      } else if (window.innerWidth >= breakpoints.sm) {
        setBreakpoint('sm');
        setIsMobile(true);
      } else {
        setBreakpoint('xs');
        setIsMobile(true);
      }
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    breakpoint,
    isMobile,
    isTablet: breakpoint === 'md',
    isDesktop:
      breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    isSmallScreen: breakpoint === 'xs' || breakpoint === 'sm',
    isLargeScreen: breakpoint === 'xl' || breakpoint === '2xl',
  };
}
