import React, { useEffect, useState, useRef } from 'react';

interface AnimatedBarProps {
  targetWidth: string; // e.g., "50%"
  backgroundColor: string;
  className?: string;
  delay?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const AnimatedBar: React.FC<AnimatedBarProps> = ({ 
  targetWidth, 
  backgroundColor, 
  className = "", 
  delay = 0,
  children,
  style = {}
}) => {
  const [width, setWidth] = useState("0%");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add small timeout to ensure smooth transition trigger
          setTimeout(() => {
            setWidth(targetWidth);
          }, delay);
        } else {
          // Reset immediately when out of view
          setWidth("0%");
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, [targetWidth, delay]);

  return (
    <div 
      ref={ref}
      className={`${className} transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)`}
      style={{ 
        width: width, 
        backgroundColor: backgroundColor,
        transitionProperty: 'width',
        willChange: 'width',
        ...style
      }}
    >
      {children}
    </div>
  );
};