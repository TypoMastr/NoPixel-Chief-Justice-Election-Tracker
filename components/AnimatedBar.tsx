import React, { useEffect, useState, useRef } from 'react';

interface AnimatedBarProps {
  targetWidth: string; 
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
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Pequeno delay para começar a crescer apenas quando o usuário focar
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        } else {
          // Reseta a barra quando sai da tela para poder animar novamente depois
          setIsVisible(false);
        }
      },
      { threshold: 0.01 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  const numericScale = parseFloat(targetWidth) / 100 || 0;

  return (
    <div 
      ref={ref}
      className={`${className} relative overflow-hidden`}
      style={{ 
        width: '100%',
        backgroundColor: 'transparent',
        ...style
      }}
    >
      <div 
        className="absolute inset-0 transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) origin-left will-change-transform transform-gpu"
        style={{ 
          backgroundColor: backgroundColor,
          transform: isVisible ? `scaleX(${numericScale})` : 'scaleX(0)',
        }}
      />
      {children}
    </div>
  );
};