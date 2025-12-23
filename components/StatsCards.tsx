
import React from 'react';

interface StatsCardsProps {
  totalVotes: number;
  validVotes: number;
  abstentions: number;
  candidateCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ totalVotes, validVotes, abstentions, candidateCount }) => {
  const cards = [
    { label: "Total Votes", value: totalVotes, sub: "Cast" },
    { label: "Valid Votes", value: validVotes, sub: "Active" },
    { label: "Abstentions", value: abstentions, color: "text-slate-400", sub: "Recused" },
    { label: "Candidates", value: candidateCount, sub: "Running" },
  ];

  return (
    // grid-cols-2 on mobile for side-by-side view
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-slate-800 border border-slate-600 rounded-xl p-3 md:p-6 shadow-lg hover:bg-slate-750 transition-colors group relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex justify-center md:justify-between items-start mb-1 md:mb-3 w-full">
              <h3 className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest group-hover:text-teal-300 transition-colors">{card.label}</h3>
            </div>
            <p className={`text-2xl md:text-5xl font-black tracking-tighter drop-shadow-sm ${card.color || 'text-white'}`}>
              {card.value}
            </p>
             <p className="hidden md:flex text-[10px] md:text-xs text-slate-500 font-medium mt-1 md:mt-3 border-t border-slate-700/50 pt-1 md:pt-3 items-center justify-center md:justify-start gap-1 md:gap-2 w-full">
                <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-slate-500 group-hover:bg-teal-400 transition-colors hidden md:block"></span>
                {card.sub}
             </p>
          </div>
        </div>
      ))}
    </div>
  );
};
