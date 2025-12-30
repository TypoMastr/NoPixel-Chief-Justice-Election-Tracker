import React, { useState, useEffect } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Timer, Megaphone, MapPin, Calendar, Clock } from 'lucide-react';

interface CountdownTimerProps {
  onStatusChange?: (isClosed: boolean) => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ onStatusChange }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isClosed: boolean;
    mode: 'VOTING' | 'ANNOUNCEMENT';
    hasStarted: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isClosed: false, mode: 'VOTING', hasStarted: false });

  const [dateTimeInfo, setDateTimeInfo] = useState<{date: string, time: string}>({ date: "", time: "" });

  // Fixed Election Dates
  // Voting ends: Dec 29, 2025 12:00 (Brasilia Time)
  const VOTING_END_TARGET = "2025-12-29T12:00:00-03:00";
  // Results Announcement: Dec 31, 2025 15:00 (Brasilia Time)
  const ANNOUNCEMENT_TARGET = "2025-12-31T15:00:00-03:00";

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(timeLeft.isClosed);
    }
  }, [timeLeft.isClosed, onStatusChange]);

  useEffect(() => {
    const date = new Date(ANNOUNCEMENT_TARGET);
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
      timeZoneName: 'short'
    });

    setDateTimeInfo({
        date: dateFormatter.format(date),
        time: timeFormatter.format(date)
    });
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      
      const votingEndDate = new Date(VOTING_END_TARGET);
      const votingDifference = votingEndDate.getTime() - now.getTime();

      // 1. Voting Period Logic
      if (votingDifference > 0) {
        return {
          days: Math.floor(votingDifference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((votingDifference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((votingDifference / 1000 / 60) % 60),
          seconds: Math.floor((votingDifference / 1000) % 60),
          isClosed: false,
          mode: 'VOTING' as const,
          hasStarted: false
        };
      } else {
        // 2. Announcement Period Logic
        const announcementTargetDate = new Date(ANNOUNCEMENT_TARGET);
        const announcementDifference = announcementTargetDate.getTime() - now.getTime();
        const hasStarted = announcementDifference <= 0;
        
        // Use absolute difference for "Started at" count-up logic
        const diff = Math.abs(announcementDifference);

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60),
            isClosed: true,
            mode: 'ANNOUNCEMENT' as const,
            hasStarted
        };
      }
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const CompactUnit: React.FC<{ value: number; label: string; highContrast?: boolean }> = ({ value, label, highContrast }) => (
    <div className={`flex flex-col items-center justify-center rounded-lg md:rounded-xl border px-3 py-3 md:px-5 md:py-4 min-w-[4.2rem] md:min-w-[7rem] ${highContrast ? 'bg-slate-950 border-blue-400/50 shadow-lg shadow-blue-900/20' : 'bg-slate-900/40 border-white/5'}`}>
      <span className={`text-3xl md:text-5xl font-black tabular-nums leading-none tracking-tight ${highContrast ? 'text-white drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]' : 'text-teal-400'}`}>
        {value.toString().padStart(2, '0')}
      </span>
      <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest leading-none mt-2 md:mt-3 ${highContrast ? 'text-blue-200' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <ScrollReveal delay={50}>
      <div 
        className={`glass-panel rounded-xl p-3 md:px-6 md:py-4 mb-4 md:mb-6 relative overflow-hidden transition-colors duration-500 
        ${timeLeft.isClosed 
            ? 'bg-blue-950/40 border-blue-500/30 shadow-[0_0_30px_rgba(30,58,138,0.2)]'
            : 'bg-[#020617]/80 border-teal-500/20 shadow-lg shadow-teal-900/5'
        }`}
      >
        
        {timeLeft.isClosed ? (
             <div className="flex flex-col items-center justify-center w-full animate-fade-in text-center py-2">
                
                <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 opacity-90">
                    <div className="bg-red-500/10 p-1.5 rounded-full border border-red-500/20">
                        <Timer className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                    </div>
                    <span className="text-sm md:text-base font-black uppercase tracking-widest text-red-400 drop-shadow-sm">
                      Voting Period Ended
                    </span>
                </div>
                
                <div className="flex flex-col items-center gap-8 w-full">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl md:text-4xl font-black text-white leading-tight mb-2 drop-shadow-md">
                          Results Announcement
                        </span>
                        <div className={`flex items-center gap-2 ${timeLeft.hasStarted ? 'text-teal-400' : 'text-blue-300'}`}>
                            <Megaphone className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm font-bold uppercase tracking-widest">
                                {timeLeft.hasStarted ? 'Started at' : 'Starting In'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-6 justify-center py-2">
                        <CompactUnit value={timeLeft.days} label="Days" highContrast />
                        <span className="text-blue-500/50 font-black text-xl md:text-4xl pb-4 hidden sm:block">:</span>
                        <CompactUnit value={timeLeft.hours} label="Hrs" highContrast />
                        <span className="text-blue-500/50 font-black text-xl md:text-4xl pb-4 hidden sm:block">:</span>
                        <CompactUnit value={timeLeft.minutes} label="Min" highContrast />
                        <span className="text-blue-500/50 font-black text-xl md:text-4xl pb-4 hidden sm:block">:</span>
                        <CompactUnit value={timeLeft.seconds} label="Sec" highContrast />
                    </div>

                    {/* Unified Details Card */}
                    <div className="mt-4 w-full max-w-4xl">
                        <div className="glass-panel rounded-xl p-6 md:p-8 bg-slate-900/70 border-blue-500/30 shadow-2xl flex flex-col items-center justify-center gap-4 transition-all hover:bg-slate-900/80">
                            
                            {/* Top Row: Date & Time */}
                            <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-6 w-full">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                                    <span className="text-lg md:text-2xl font-black text-white tracking-tight drop-shadow-md">
                                        {dateTimeInfo.date || "Loading..."}
                                    </span>
                                </div>

                                <div className="hidden lg:block w-px h-8 bg-white/10" />

                                <div className="flex items-center gap-3 bg-blue-500/10 px-4 py-1.5 rounded-lg border border-blue-500/20">
                                    <Clock className="w-4 h-4 text-blue-300" />
                                    <span className="text-lg md:text-2xl font-bold text-white tracking-tight">
                                        {dateTimeInfo.time}
                                    </span>
                                </div>
                            </div>

                            {/* Middle Row: Separator */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            {/* Bottom Row: Location */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-blue-400">Location</span>
                                </div>
                                <span className="text-xl md:text-3xl font-black text-blue-100 tracking-tight text-center drop-shadow-md">
                                    Galileo Observatory
                                </span>
                            </div>
                            
                        </div>
                    </div>
                </div>
             </div>
        ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
                   <div className="p-2 rounded-lg animate-pulse border shadow-[0_0_10px_rgba(20,184,166,0.1)] hidden md:block bg-teal-500/10 text-teal-400 border-teal-500/20">
                      <Timer className="w-5 h-5" />
                   </div>
                   <div className="flex flex-col justify-center text-center md:text-left">
                      <span className="text-xs md:text-base font-black uppercase tracking-widest leading-tight text-white">
                        Voting Ends
                      </span>
                      <span className="text-[9px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Dec 29, 2025 at 12:00
                      </span>
                   </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-center">
                    <CompactUnit value={timeLeft.days} label="Days" />
                    <span className="text-slate-600 font-black text-lg pb-3 hidden sm:block">:</span>
                    <CompactUnit value={timeLeft.hours} label="Hrs" />
                    <span className="text-slate-600 font-black text-lg pb-3 hidden sm:block">:</span>
                    <CompactUnit value={timeLeft.minutes} label="Min" />
                    <span className="text-slate-600 font-black text-lg pb-3 hidden sm:block">:</span>
                    <CompactUnit value={timeLeft.seconds} label="Sec" />
                </div>
            </div>
        )}
      </div>
    </ScrollReveal>
  );
};