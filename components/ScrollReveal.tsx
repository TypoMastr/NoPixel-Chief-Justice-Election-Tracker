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
          // If top > innerHeight/2, it likely entered from the bottom (scrolling down)
          // If top < innerHeight/2, it likely entered from the top (scrolling up)
          const isEnteringFromBottom = entry.boundingClientRect.top > (window.innerHeight / 2);
          setDirection(isEnteringFromBottom ? 'down' : 'up');
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: threshold,
        // Asymmetric margin: trigger slightly early from bottom
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
    // If direction is down (scrolling down), element starts below and moves up (translate-y-12)
    // If direction is up (scrolling up), element starts above and moves down (-translate-y-12)
    return direction === 'down' 
      ? 'opacity-0 translate-y-12 filter blur-sm scale-95' 
      : 'opacity-0 -translate-y-12 filter blur-sm scale-95';
  };

  return (
    <div
      ref={ref}
      style={{ 
        width, 
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        transitionDuration: '700ms'
      }}
      className={`transform transition-all ease-out will-change-transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 filter blur-0 scale-100' 
          : getHiddenState()
      } ${className}`}
    >
      {children}
    </div>
  );
};