import React, { useState, useEffect } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Timer } from 'lucide-react';

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
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isClosed: false });

  // Effect to notify parent when status changes
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(timeLeft.isClosed);
    }
  }, [timeLeft.isClosed, onStatusChange]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      // 1. Get current time components specifically in 'America/New_York'
      const nyFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      });

      const parts = nyFormatter.formatToParts(now);
      const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
      
      const nyYear = getPart('year');
      const nyMonth = getPart('month') - 1; 
      const nyDay = getPart('day');
      const nyHour = getPart('hour');
      const nyMinute = getPart('minute');
      const nySecond = getPart('second');

      // 2. Create "Abstract" Date objects
      const nyNow = new Date(nyYear, nyMonth, nyDay, nyHour, nyMinute, nySecond);

      // 3. Find Next Monday
      const currentDay = nyNow.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
      let daysUntilMonday = (1 + 7 - currentDay) % 7;
      
      // 4. Create Target Date (Monday 12:00:00 PM)
      const target = new Date(nyNow);
      target.setDate(nyNow.getDate() + daysUntilMonday);
      target.setHours(12, 0, 0, 0);

      // NOTE: Auto-reset logic removed to allow "Closed" state to persist
      // and trigger the Election Timeline display.
      // if (target.getTime() <= nyNow.getTime()) {
      //   target.setDate(target.getDate() + 7);
      // }

      // 5. Calculate difference
      const difference = target.getTime() - nyNow.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isClosed: false
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isClosed: true };
      }
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const CompactUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center bg-slate-900/40 rounded md:rounded-lg border border-white/5 px-2 py-1 md:px-4 md:py-1.5 min-w-[3rem] md:min-w-[4.5rem]">
      <span className="text-lg md:text-2xl font-black text-teal-400 tabular-nums leading-none tracking-tight">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
        {label}
      </span>
    </div>
  );

  return (
    <ScrollReveal delay={50}>
      <div className={`glass-panel rounded-xl p-3 md:px-6 md:py-3 mb-4 md:mb-6 flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden bg-[#020617]/80 border shadow-lg shadow-teal-900/5 transition-colors duration-500 ${timeLeft.isClosed ? 'border-red-500/20' : 'border-teal-500/20'}`}>
        
        {/* Left Side: Label */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
           <div className={`p-2 rounded-lg animate-pulse border shadow-[0_0_10px_rgba(20,184,166,0.1)] hidden md:block ${timeLeft.isClosed ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'}`}>
              <Timer className="w-5 h-5" />
           </div>
           <div className="flex flex-col justify-center text-center md:text-left">
              <span className={`text-xs md:text-base font-black uppercase tracking-widest leading-tight ${timeLeft.isClosed ? 'text-red-400' : 'text-white'}`}>
                {timeLeft.isClosed ? "Voting Period Ended" : "Voting Ends"}
              </span>
              <span className="text-[9px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
                Monday 12:00 PM EST
              </span>
           </div>
        </div>

        {/* Right Side: Timer or Message */}
        {timeLeft.isClosed ? (
             <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-right w-full md:w-auto justify-center md:justify-end animate-fade-in">
                <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg shrink-0">
                    <span className="text-red-400 font-black uppercase tracking-widest text-xs">
                      Closed
                    </span>
                </div>
                <span className="text-xs md:text-sm font-medium text-teal-100/80 leading-tight max-w-md">
                  Results announced <span className="text-white font-bold">Friday, Jan 2, 2026</span> at <span className="text-white font-bold">Galileo Observatory</span>
                </span>
             </div>
        ) : (
            <div className="flex items-center gap-1 md:gap-3 w-full md:w-auto justify-center">
                <CompactUnit value={timeLeft.days} label="Days" />
                <span className="text-slate-600 font-black text-lg pb-3 hidden sm:block">:</span>
                <CompactUnit value={timeLeft.hours} label="Hrs" />
                <span className="text-slate-600 font-black text-lg pb-3 hidden sm:block">:</span>
                <CompactUnit value={timeLeft.minutes} label="Min" />
                <span className="text-slate-600 font-black text-lg pb-3 hidden sm:block">:</span>
                <CompactUnit value={timeLeft.seconds} label="Sec" />
            </div>
        )}
      </div>
    </ScrollReveal>
  );
};