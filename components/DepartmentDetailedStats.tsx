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
     
     // Calculate candidate breakdown (Excluding Abstained for the percentage visual usually, or keep it?)
     // Let's keep all options including Abstained in breakdown to show full picture
     const breakdown = [ ...ACTIVE_CANDIDATES, Candidate.ABSTAINED ].map(candidate => {
         const count = deptVotes.filter(v => v.candidate === candidate).length;
         const percent = total > 0 ? (count / total) * 100 : 0;
         return { candidate, count, percent };
     }).filter(b => b.count > 0).sort((a, b) => b.count - a.count);

     return { dept, total, breakdown };
  });

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-2xl p-4 md:p-8 shadow-xl mb-4 md:mb-8">
        <h2 className="text-lg md:text-2xl font-bold text-teal-400 mb-4 md:mb-8 flex items-center gap-3 border-b border-slate-700 pb-4">
            📊 Department Breakdown
        </h2>
        {/* grid-cols-2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {deptData.map(({ dept, total, breakdown }) => (
                <div key={dept} className="bg-slate-900 border border-slate-700 rounded-xl p-3 md:p-6 shadow-lg relative overflow-hidden flex flex-col hover:border-teal-500/30 transition-colors">
                   {/* Header */}
                   <div className="flex justify-between items-end mb-3 md:mb-5 pb-2 md:pb-4 border-b border-slate-800">
                        <h3 className="text-sm md:text-2xl font-black text-white tracking-tight">{dept}</h3>
                        <span className="text-teal-400 font-mono text-[10px] md:text-sm font-bold bg-teal-500/10 px-1.5 md:px-3 py-0.5 md:py-1 rounded border border-teal-500/20">{total}</span>
                   </div>

                   {/* Visual Stacked Bar */}
                   <div className="w-full bg-slate-800 rounded-full h-3 md:h-5 mb-3 md:mb-6 flex overflow-hidden border border-slate-600">
                        {breakdown.map((item) => (
                            <div 
                                key={item.candidate}
                                style={{ width: `${item.percent}%`, backgroundColor: COLORS[item.candidate] }}
                                title={`${item.candidate}: ${item.count}`}
                                className="h-full hover:brightness-110 transition-all cursor-help relative group"
                            ></div>
                        ))}
                        {total === 0 && <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-slate-500 tracking-widest uppercase">No Data</div>}
                   </div>

                   {/* List */}
                   <div className="space-y-2 md:space-y-3 flex-1">
                        {breakdown.map((item) => (
                            <div key={item.candidate} className="flex justify-between items-center text-[10px] md:text-sm group hover:bg-slate-800 p-1 md:p-2 rounded-lg transition-colors -mx-1 md:-mx-2">
                                <div className="flex items-center gap-1.5 md:gap-3 mr-1 md:mr-2 w-[70%] md:w-auto">
                                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full shadow-sm ring-1 ring-white/10 flex-shrink-0" style={{ backgroundColor: COLORS[item.candidate] }} />
                                    <span className="text-slate-300 font-medium whitespace-normal break-words leading-tight" title={item.candidate}>{item.candidate}</span>
                                </div>
                                <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
                                    <span className="font-bold text-white text-xs md:text-lg tabular-nums">{item.count}</span>
                                    <div className="bg-slate-800 border border-slate-600 rounded-md py-0.5 md:py-1 min-w-[36px] md:min-w-[54px] flex items-center justify-center px-1 md:px-1.5 shadow-sm">
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