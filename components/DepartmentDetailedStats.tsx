import React from 'react';
import { Vote, Candidate } from '../types';
import { DEPARTMENT_LIST, COLORS, ACTIVE_CANDIDATES } from '../constants';

interface DepartmentDetailedStatsProps {
  votes: Vote[];
}

export const DepartmentDetailedStats: React.FC<DepartmentDetailedStatsProps> = ({ votes }) => {
  // Processing logic
  const deptData = DEPARTMENT_LIST.map(dept => {
     const deptVotes = votes.filter(v => v.department === dept);
     const total = deptVotes.length;
     
     // Calculate candidate breakdown
     const breakdown = [ ...ACTIVE_CANDIDATES, Candidate.ABSTAINED ].map(candidate => {
         const count = deptVotes.filter(v => v.candidate === candidate).length;
         const percent = total > 0 ? (count / total) * 100 : 0;
         return { candidate, count, percent };
     }).filter(b => b.count > 0).sort((a, b) => b.count - a.count);

     return { dept, total, breakdown };
  });

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl mb-4 md:mb-8 animate-fade-in-up delay-300">
        <h2 className="text-lg md:text-2xl font-bold text-teal-400 mb-4 md:mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
            📊 Department Breakdown
        </h2>
        {/* grid-cols-2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {deptData.map(({ dept, total, breakdown }, idx) => (
                <div key={dept} className="bg-slate-800/60 border border-teal-500/30 rounded-xl p-3 md:p-6 shadow-lg relative overflow-hidden flex flex-col transition-all duration-300">
                   {/* Header */}
                   <div className="flex justify-between items-end mb-3 md:mb-5 pb-2 md:pb-4 border-b border-white/5">
                        <h3 className="text-sm md:text-2xl font-black text-white tracking-tight">{dept}</h3>
                        <span className="text-teal-400 font-mono text-[10px] md:text-sm font-bold bg-teal-500/10 px-1.5 md:px-3 py-0.5 md:py-1 rounded border border-teal-500/20">{total}</span>
                   </div>

                   {/* Visual Stacked Bar */}
                   <div className="w-full bg-slate-800/50 rounded-full h-3 md:h-5 mb-3 md:mb-6 flex overflow-hidden border border-white/5">
                        {breakdown.map((item, i) => (
                            <div 
                                key={item.candidate}
                                title={`${item.candidate}: ${item.count}`}
                                className="h-full relative group"
                                style={{ 
                                    width: '0%', 
                                    backgroundColor: COLORS[item.candidate],
                                    animation: `widthGrow 1s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                                    animationDelay: `${(idx * 0.1) + (i * 0.1)}s`,
                                    flexShrink: 0,
                                    // Use inline style for the target width to allow animation to fill to it
                                    maxWidth: `${item.percent}%`,
                                    flexBasis: `${item.percent}%`
                                }}
                            ></div>
                        ))}
                        {total === 0 && <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-slate-500 tracking-widest uppercase">No Data</div>}
                   </div>

                   {/* List */}
                   <div className="space-y-2 md:space-y-3 flex-1">
                        {breakdown.map((item) => (
                            // Permanent bg-white/5 and white text
                            <div key={item.candidate} className="flex justify-between items-center text-[10px] md:text-sm bg-white/5 p-1 md:p-2 rounded-lg transition-colors -mx-1 md:-mx-2">
                                <div className="flex items-center gap-1.5 md:gap-3 mr-1 md:mr-2 w-[70%] md:w-auto">
                                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full shadow-sm ring-1 ring-white/10 flex-shrink-0" style={{ backgroundColor: COLORS[item.candidate] }} />
                                    <span className="text-white font-medium whitespace-normal break-words leading-tight transition-colors" title={item.candidate}>{item.candidate}</span>
                                </div>
                                <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
                                    <span className="font-bold text-white text-xs md:text-lg tabular-nums">{item.count}</span>
                                    <div className="bg-slate-950/30 border border-white/10 rounded-md py-0.5 md:py-1 min-w-[36px] md:min-w-[54px] flex items-center justify-center px-1 md:px-1.5 shadow-sm">
                                        <span className="text-[9px] md:text-[11px] font-bold text-slate-300 tabular-nums font-sans">
                                            {item.percent.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {total === 0 && (
                            <div className="flex flex-col items-center justify-center h-10 md:h-20 text-slate-500 text-[10px] md:text-sm italic opacity-60">
                                <span>No votes</span>
                            </div>
                        )}
                   </div>
                </div>
            ))}
        </div>
    </div>
  );
};