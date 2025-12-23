import React from 'react';

interface StatsCardsProps {
  totalVotes: number;
  validVotes: number;
  abstentions: number;
  candidateCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ totalVotes, validVotes, abstentions, candidateCount }) => {
  const cards = [
    { label: "Total Votes Cast", value: totalVotes, sub: "All recorded entries" },
    { label: "Valid Votes", value: validVotes, sub: "Excluding abstentions" },
    { label: "Abstentions", value: abstentions, color: "text-red-400", sub: "Recused voters" },
    { label: "Active Candidates", value: candidateCount, sub: "Running for office" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg hover:bg-slate-750 transition-colors group relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-slate-300 text-xs font-bold uppercase tracking-widest group-hover:text-teal-300 transition-colors">{card.label}</h3>
            </div>
            <p className={`text-4xl md:text-5xl font-black tracking-tighter drop-shadow-sm ${card.color || 'text-white'}`}>
              {card.value}
            </p>
             <p className="text-xs text-slate-400 font-medium mt-3 border-t border-slate-700 pt-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-teal-400 transition-colors"></span>
                {card.sub}
             </p>
          </div>
        </div>
      ))}
    </div>
  );
};