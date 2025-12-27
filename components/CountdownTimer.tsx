import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isClosed: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isClosed: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // 1. Get current time
      const now = new Date();
      
      // 2. Create a formatter for New York time to handle EST/EDT correctly
      // We use this to determine "what time is it in NY" to align with the deadline
      const nyDateString = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
      const nyDate = new Date(nyDateString);

      // 3. Find the next Monday
      // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
      const currentDay = nyDate.getDay();
      
      // Calculate days to add to get to next Monday
      // If today is Sunday (0), add 1. If Monday (1), add 7 (to get to next week) or 0 (if deadline hasn't passed).
      // We'll calculate target first assuming upcoming monday, then adjust if it's in the past.
      let daysUntilMonday = (1 + 7 - currentDay) % 7;
      
      // 4. Create target date based on NY time components
      const target = new Date(nyDate);
      target.setDate(nyDate.getDate() + daysUntilMonday);
      target.setHours(12, 0, 0, 0); // 12:00:00 PM

      // If the calculated target is in the past (e.g. it's Monday 1pm), move to next week
      if (target.getTime() <= nyDate.getTime()) {
        target.setDate(target.getDate() + 7);
      }

      // 5. Calculate difference using the actual timestamps (This handles the duration correctly)
      // Note: We need to compare "Target NY Time" vs "Current NY Time" logic, 
      // but simpler is to use the difference in ms.
      const difference = target.getTime() - nyDate.getTime();

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

    // Initial call
    setTimeLeft(calculateTimeLeft());

    // Interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-slate-900/80 border border-teal-500/30 rounded-lg p-2 md:p-3 min-w-[50px] md:min-w-[70px] text-center shadow-[0_0_15px_rgba(20,184,166,0.1)] backdrop-blur-md">
        <span className="text-lg md:text-2xl font-mono font-black text-teal-400 tabular-nums leading-none block">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{label}</span>
    </div>
  );

  return (
    <ScrollReveal delay={50}>
      <div className="glass-panel rounded-xl p-4 md:px-8 md:py-4 mb-4 md:mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-teal-500/20 shadow-lg shadow-teal-900/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${timeLeft.isClosed ? 'bg-red-500/10 text-red-500' : 'bg-teal-500/10 text-teal-400'} animate-pulse`}>
            {timeLeft.isClosed ? <AlertCircle className="w-5 h-5 md:w-6 md:h-6" /> : <Timer className="w-5 h-5 md:w-6 md:h-6" />}
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest">
              {timeLeft.isClosed ? "Election Status" : "Voting Ends In"}
            </h3>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">
              12:00 PM EST Next Monday
            </p>
          </div>
        </div>

        {timeLeft.isClosed ? (
          <div className="flex-1 flex justify-center md:justify-end">
             <div className="px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                <span className="text-red-400 font-black uppercase tracking-[0.2em] text-sm md:text-lg animate-pulse">
                  Voting Closed
                </span>
             </div>
          </div>
        ) : (
          <div className="flex gap-2 md:gap-4">
            <TimeUnit value={timeLeft.days} label="Days" />
            <div className="text-teal-500/30 font-black text-xl md:text-2xl self-start mt-2">:</div>
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <div className="text-teal-500/30 font-black text-xl md:text-2xl self-start mt-2">:</div>
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <div className="text-teal-500/30 font-black text-xl md:text-2xl self-start mt-2">:</div>
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </div>
        )}
      </div>
    </ScrollReveal>
  );
};
