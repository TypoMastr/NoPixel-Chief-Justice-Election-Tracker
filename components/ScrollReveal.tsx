import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number; // ms
  threshold?: number; // 0 to 1
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  width = "100%", 
  delay = 0,
  threshold = 0.1, 
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Determine entry direction based on position relative to viewport center
          const isEnteringFromBottom = entry.boundingClientRect.top > (window.innerHeight / 2);
          setDirection(isEnteringFromBottom ? 'down' : 'up');
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: threshold,
        rootMargin: "0px 0px -20px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, [threshold]);

  const getHiddenState = () => {
    // Removed 'filter blur-sm' for performance optimization on mobile devices.
    // Opacity and Transform are handled by the compositor thread (GPU), while Blur often requires rasterization.
    return direction === 'down' 
      ? 'opacity-0 translate-y-8 scale-[0.98]' 
      : 'opacity-0 -translate-y-8 scale-[0.98]';
  };

  return (
    <div
      ref={ref}
      style={{ 
        width, 
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        transitionDuration: '600ms', // Slightly faster for snappier feel
      }}
      // Added transform-gpu to force layer creation
      className={`transform-gpu transition-all ease-out will-change-[transform,opacity] ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : getHiddenState()
      } ${className}`}
    >
      {children}
    </div>
  );
};