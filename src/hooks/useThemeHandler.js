import { useCallback } from 'react';

/**
 * Custom hook to handle theme color detection and management
 * @param {React.RefObject} containerRef - Reference to the container element
 * @param {boolean} embedded - Whether the bot is embedded in another component
 * @returns {Function} - Function to get theme colors
 */
const useThemeHandler = (containerRef, embedded) => {
  const getThemeColors = useCallback(() => {
    // Get colors from CSS variables if available, fall back to defaults
    const getCSSVariable = (name, fallback) => {
      if (containerRef.current) {
        // First check the container itself
        const containerStyle = getComputedStyle(containerRef.current);
        const containerValue = containerStyle.getPropertyValue(name);
        if (containerValue && containerValue.trim() !== '') {
          return containerValue.trim();
        }

        // Then check parent (useful for web component shadow DOM)
        if (containerRef.current.parentElement) {
          const parentStyle = getComputedStyle(containerRef.current.parentElement);
          const parentValue = parentStyle.getPropertyValue(name);
          if (parentValue && parentValue.trim() !== '') {
            return parentValue.trim();
          }
        }
      }
      return fallback;
    };

    return {
      primaryColor: getCSSVariable('--primary-color', '#1a5b6e'),
      secondaryColor: getCSSVariable('--secondary-color', '#107180'),
      fontFamily: getCSSVariable('--font-family', 'Arial, sans-serif'),
      embedded: embedded
    };
  }, [containerRef, embedded]);

  return getThemeColors;
};

export default useThemeHandler;