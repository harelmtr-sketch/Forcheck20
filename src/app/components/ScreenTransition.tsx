import { useEffect, useState } from 'react';

interface ScreenTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
}

export function ScreenTransition({ children, transitionKey }: ScreenTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(transitionKey);

  useEffect(() => {
    if (transitionKey !== currentKey) {
      // Fade out
      setIsVisible(false);
      
      // Wait for fade out, then swap content and fade in
      const timeout = setTimeout(() => {
        setCurrentKey(transitionKey);
        setIsVisible(true);
      }, 150);

      return () => clearTimeout(timeout);
    } else {
      // Initial mount
      setIsVisible(true);
    }
  }, [transitionKey, currentKey]);

  return (
    <div
      className={`h-full w-full transition-all duration-200 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}