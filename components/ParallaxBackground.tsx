import React, { useEffect, useState } from 'react';

export const ParallaxBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Deep Background Gradient */}
      <div className="absolute inset-0 bg-[#0f172a]"></div>
      
      {/* Floating Blobs with Parallax */}
      {/* Added will-change-transform for smoother repetitive scrolling */}
      
      {/* Teal Blob - Moves slower */}
      <div 
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px] will-change-transform"
        style={{ 
          transform: `translate3d(-20%, ${scrollY * 0.2}px, 0)` 
        }}
      />

      {/* Blue Blob - Moves medium speed */}
      <div 
        className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] will-change-transform"
        style={{ 
          transform: `translate3d(0, ${scrollY * 0.3}px, 0)` 
        }}
      />

      {/* Purple Blob - Moves slightly faster (appears closer) */}
      <div 
        className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[90px] will-change-transform"
        style={{ 
          transform: `translate3d(0, ${-scrollY * 0.15}px, 0)` 
        }}
      />

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};