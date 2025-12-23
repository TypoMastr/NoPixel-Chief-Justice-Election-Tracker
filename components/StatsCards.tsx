import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { CountUp } from './CountUp';

interface StatsCardsProps {
  totalVotes: number;
  validVotes: number;
  abstentions: number;
  candidateCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ totalVotes, validVotes, abstentions, candidateCount }) => {
  const cards = [
    { label: "Total Votes", value: totalVotes, sub: "Cast", delay: 0 },
    { label: "Valid Votes", value: validVotes, sub: "Active", delay: 50 },
    { label: "Abstentions", value: abstentions, color: "text-slate-300", sub: "Recused", delay: 100 },
    { label: "Candidates", value: candidateCount, sub: "Running", delay: 150 },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
      {cards.map((card, index) => (
        <ScrollReveal key={index} delay={card.delay}>
            <div 
            className={`glass-panel rounded-xl p-4 md:p-6 shadow-lg shadow-teal-900/20 bg-slate-800/80 transition-all duration-300 group relative overflow-hidden h-full`}
            >
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-teal-500/20 rounded-full blur-2xl transition-all duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex justify-center md:justify-between items-start mb-2 md:mb-3 w-full">
                <h3 className="text-teal-400 text-xs font-black uppercase tracking-[0.1em] transition-colors">{card.label}</h3>
                </div>
                <div className={`text-3xl md:text-5xl font-black tracking-tighter tabular-nums drop-shadow-sm transition-all duration-300 origin-left ${card.color || 'text-white'}`}>
                    <CountUp end={card.value} duration={1000} />
                </div>
                <p className="flex text-[11px] md:text-xs text-slate-400 font-bold mt-2 md:mt-3 border-t border-white/10 pt-2 md:pt-3 items-center justify-center md:justify-start gap-2 w-full uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_5px_rgba(45,212,191,0.5)]"></span>
                    {card.sub}
                </p>
            </div>
            </div>
        </ScrollReveal>
      ))}
    </div>
  );
};