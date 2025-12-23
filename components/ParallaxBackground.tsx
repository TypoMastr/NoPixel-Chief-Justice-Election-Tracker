import React, { useEffect, useRef } from 'react';

export const ParallaxBackground: React.FC = () => {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          
          // Efeito de Parallax Profundo: Movimentação em múltiplos eixos e escala
          // Blob 1: Fundo Profundo (Movimento mais lento + leve horizontal)
          if (blob1Ref.current) {
            const y = scrolled * 0.2;
            const x = scrolled * 0.05;
            const s = 1 + (scrolled * 0.00005);
            blob1Ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
          }
          
          // Blob 2: Plano Médio (Movimento mais rápido e oposto)
          if (blob2Ref.current) {
            const y = scrolled * 0.4;
            const x = scrolled * -0.05;
            const s = 1 + (scrolled * 0.0001);
            blob2Ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
          }
          
          // Blob 3: Base (Movimento negativo para contra-balanço)
          if (blob3Ref.current) {
            const y = scrolled * -0.25;
            const x = scrolled * 0.08;
            const s = 1 - (scrolled * 0.00005);
            blob3Ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${Math.max(0.7, s)})`;
          }
          
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] transform-gpu">
      {/* Camada de escurecimento para garantir legibilidade */}
      <div className="absolute inset-0 bg-slate-950/30 backdrop-brightness-[0.8]"></div>
      
      {/* Blobs Dinâmicos */}
      <div 
        ref={blob1Ref}
        className="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-teal-600/10 rounded-full blur-[120px] will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      <div 
        ref={blob2Ref}
        className="absolute top-[20%] right-[-15%] w-[900px] h-[900px] bg-blue-600/10 rounded-full blur-[140px] will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      <div 
        ref={blob3Ref}
        className="absolute bottom-[-10%] left-[5%] w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[110px] will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* Ruído de Textura Estático */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};