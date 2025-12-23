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
          
          // Direct DOM manipulation avoids React render cycle overhead
          if (blob1Ref.current) {
            blob1Ref.current.style.transform = `translate3d(0, ${scrolled * 0.15}px, 0)`;
          }
          if (blob2Ref.current) {
            blob2Ref.current.style.transform = `translate3d(0, ${scrolled * 0.25}px, 0)`;
          }
          if (blob3Ref.current) {
            blob3Ref.current.style.transform = `translate3d(0, ${-scrolled * 0.1}px, 0)`;
          }
          
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] transform-gpu">
      {/* 
          Deep Background Overlay 
          Fixed: Changed from solid bg-[#0f172a] to a semi-transparent overlay 
          to allow the body's radial gradients (the red/magenta tones) to show through.
      */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-brightness-[0.8]"></div>
      
      {/* Floating Blobs with Parallax */}
      
      {/* Teal Blob - Moves slower */}
      <div 
        ref={blob1Ref}
        className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[100px]"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* Blue/Red Blend Blob - Moves medium speed */}
      <div 
        ref={blob2Ref}
        className="absolute top-[10%] right-[-10%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[120px]"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* Purple/Magenta Blob - Enhanced to match the reddish theme */}
      <div 
        ref={blob3Ref}
        className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[90px]"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* Subtle Noise Texture Overlay - Static */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};