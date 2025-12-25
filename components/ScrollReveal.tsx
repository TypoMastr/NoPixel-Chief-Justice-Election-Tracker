import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  threshold?: number;
  className?: string;
  containerRef?: React.RefObject<HTMLElement | null>; // Novo suporte para container de scroll
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  width = "100%", 
  delay = 0,
  threshold = 0.1, 
  className = "",
  containerRef
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Atualiza o estado baseado na visibilidade atual.
        // Se entrar na tela -> true (anima entrada)
        // Se sair da tela -> false (anima saída)
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: threshold,
        root: containerRef?.current || null // Usa o container específico se fornecido, senão usa viewport
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, containerRef]);

  return (
    <div
      ref={ref}
      style={{ 
        width, 
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        // Duração um pouco mais rápida na saída para parecer responsivo
        transitionDuration: isVisible ? '700ms' : '500ms',
      }}
      className={`transform-gpu transition-all ease-out will-change-[transform,opacity] ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100 blur-0' 
          : 'opacity-0 translate-y-8 scale-[0.96] blur-sm'
      } ${className}`}
    >
      {children}
    </div>
  );
};