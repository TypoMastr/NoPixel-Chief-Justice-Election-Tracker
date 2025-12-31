import React, { useEffect } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Trophy, Crown, ExternalLink, Sparkles, CheckCircle2, Tv } from 'lucide-react';

interface CountdownTimerProps {
  onStatusChange?: (isClosed: boolean) => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ onStatusChange }) => {
  useEffect(() => {
    // Force election status to closed so results are always shown
    if (onStatusChange) {
      onStatusChange(true);
    }
  }, [onStatusChange]);

  return (
    <ScrollReveal delay={50}>
      <div className="w-full mb-12 mt-4 flex flex-col items-center gap-8">
        
        {/* OFFICIAL WINNER CARD */}
        <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-[#1a160a] to-slate-900 border border-yellow-500/30 shadow-[0_0_60px_rgba(234,179,8,0.15)] group">
            
            {/* Background Ambient Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent blur-[80px] pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23EAB308' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8 md:gap-12">
                
                {/* Left Side: Winner Image & Badge */}
                <div className="relative flex-shrink-0">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-500 animate-[bounce_3s_infinite]">
                        <Crown className="w-12 h-12 fill-yellow-500/20 stroke-[1.5px] drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    </div>
                    
                    <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
                        <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
                        <img 
                            src="https://cdn.7tv.app/emote/01KCA38N23VMWVX2GCTXZ46YDK/4x.webp" 
                            alt="Winner" 
                            className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] scale-110 relative z-10 filter brightness-110 contrast-125"
                        />
                         {/* Certified Badge */}
                         <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-2 border border-yellow-500/50 shadow-lg z-20">
                            <CheckCircle2 className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />
                        </div>
                    </div>
                </div>

                {/* Right Side: Text & Title */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-transparent border-l-2 border-yellow-500 px-4 py-1.5 mb-6">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-yellow-200">
                            Official Election Result
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 tracking-tighter drop-shadow-sm leading-[0.9] mb-4">
                        BRITTANY<br/><span className="text-white">ANGEL</span>
                    </h1>

                    <div className="w-full h-px bg-gradient-to-r from-yellow-500/50 via-transparent to-transparent mb-5"></div>

                    <p className="text-yellow-500/80 text-sm md:text-lg font-bold uppercase tracking-[0.4em] flex items-center gap-3">
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                        Elected Chief Justice
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                    </p>
                </div>
            </div>
        </div>

        {/* Live Stream Button */}
        <a 
          href="https://kick.com/kyliebitkin"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-4 px-8 py-4 bg-[#53fc18]/10 hover:bg-[#53fc18]/20 border border-[#53fc18]/30 hover:border-[#53fc18]/60 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(83,252,24,0.2)]"
        >
           <div className="relative">
             <div className="absolute inset-0 bg-[#53fc18] rounded-full animate-ping opacity-20"></div>
             <div className="p-2 bg-[#53fc18]/20 rounded-full border border-[#53fc18]/40">
               <Tv className="w-6 h-6 text-[#53fc18]" />
             </div>
           </div>
           
           <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-widest text-[#53fc18]/80 group-hover:text-[#53fc18] transition-colors">
               Watch Live Stream
             </span>
             <span className="text-lg md:text-xl font-black text-white group-hover:text-white transition-colors tracking-tight flex items-center gap-2">
               KylieBitkin on Kick
               <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
             </span>
           </div>
        </a>

      </div>
    </ScrollReveal>
  );
};