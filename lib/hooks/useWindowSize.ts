import { useState, useEffect } from 'react';

// Interface for the return type of the hook
interface DeviceType {
  isMobile: boolean;
  isDesktop: boolean;
}

/**
 * Custom hook to determine if the current device is mobile or desktop based on screen width.
 * Uses window.matchMedia to check if the screen width is <= 768px.
 * Safe for SSR as it checks for the existence of the window object.
 * @returns {DeviceType} Object containing isMobile and isDesktop boolean flags
 */
const useWindowSize = (): DeviceType => {
  // State to track if the device is mobile
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Ensure the code runs only in the browser environment
    if (typeof window === 'undefined') return;

    // Define the media query for mobile devices (screen width <= 768px)
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    // Set initial value based on the current screen size
    setIsMobile(mediaQuery.matches);

    // Handler for media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Add event listener for media query changes
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup: remove event listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Return object with mobile and desktop flags
  return { isMobile, isDesktop: !isMobile };
};

export default useWindowSize;
