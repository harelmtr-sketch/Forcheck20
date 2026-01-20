import { useEffect, useState, memo } from 'react';

interface ScreenTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
}

export const ScreenTransition = memo(function ScreenTransition({ children, transitionKey }: ScreenTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(transitionKey);

  useEffect(() => {
    if (transitionKey !== currentKey) {
      // Fade out (faster)
      setIsVisible(false);
      
      // Wait for fade out, then swap content and fade in
      const timeout = setTimeout(() => {
        setCurrentKey(transitionKey);
        setIsVisible(true);
      }, 100); // Reduced from 150ms to 100ms

      return () => clearTimeout(timeout);
    } else {
      // Initial mount
      setIsVisible(true);
    }
  }, [transitionKey, currentKey]);

  return (
    <div
      className={`h-full w-full transition-opacity duration-150 ease-out ${
        isVisible 
          ? 'opacity-100' 
          : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
});