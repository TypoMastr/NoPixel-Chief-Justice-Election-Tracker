import React from 'react';
import { Vote, Candidate } from '../types';
import { DEPARTMENT_LIST, COLORS, ACTIVE_CANDIDATES } from '../constants';
import { ScrollReveal } from './ScrollReveal';
import { CountUp } from './CountUp';
import { AnimatedBar } from './AnimatedBar';

interface DepartmentDetailedStatsProps {
  votes: Vote[];
}

export const DepartmentDetailedStats: React.FC<DepartmentDetailedStatsProps> = ({ votes }) => {
  const deptData = DEPARTMENT_LIST.map(dept => {
     const deptVotes = votes.filter(v => v.department === dept);
     const total = deptVotes.length;
     
     const breakdown = [ ...ACTIVE_CANDIDATES, Candidate.ABSTAINED ].map(candidate => {
         const count = deptVotes.filter(v => v.candidate === candidate).length;
         const percent = total > 0 ? (count / total) * 100 : 0;
         return { candidate, count, percent };
     }).filter(b => b.count > 0).sort((a, b) => b.count - a.count);

     return { dept, total, breakdown };
  });

  return (
    <ScrollReveal>
        <div className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl mb-4 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-teal-400 mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                📊 Department Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {deptData.map(({ dept, total, breakdown }, idx) => (
                    <ScrollReveal key={dept} delay={idx * 100} width="100%">
                        <div className="bg-slate-800/60 border border-teal-500/20 rounded-xl p-4 md:p-6 shadow-lg relative overflow-hidden flex flex-col transition-all duration-300 h-full">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                                <h3 className="text-base md:text-2xl font-black text-white tracking-tight">{dept}</h3>
                                <span className="text-teal-400 font-mono text-xs md:text-sm font-black bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20 tabular-nums">
                                    <CountUp end={total} />
                                </span>
                        </div>

                        <div className="w-full bg-slate-900 rounded-full h-4 md:h-5 mb-5 flex overflow-hidden border border-white/10">
                                {breakdown.map((item, i) => (
                                    <AnimatedBar 
                                        key={item.candidate}
                                        targetWidth={`${item.percent}%`}
                                        backgroundColor={COLORS[item.candidate]}
                                        delay={(idx * 100) + (i * 100)}
                                        className="h-full relative"
                                        style={{ flexShrink: 0 }}
                                        children={null}
                                    />
                                ))}
                                {total === 0 && <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-500 tracking-widest uppercase">No Data</div>}
                        </div>

                        <div className="space-y-2.5 flex-1">
                                {breakdown.map((item) => (
                                    <div key={item.candidate} className="flex justify-between items-center text-xs md:text-sm bg-white/5 p-2 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-2 mr-2 flex-1">
                                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: COLORS[item.candidate] }} />
                                            <span className="text-slate-100 font-bold leading-tight">{item.candidate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="font-black text-white text-sm md:text-lg tabular-nums">
                                                <CountUp end={item.count} />
                                            </span>
                                            <div className="bg-slate-950/50 border border-white/10 rounded px-1.5 py-0.5 min-w-[42px] text-center shadow-sm">
                                                <span className="text-[10px] md:text-xs font-black text-slate-300 tabular-nums">
                                                    <CountUp end={item.percent} decimals={0} suffix="%" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {total === 0 && (
                                    <div className="flex flex-col items-center justify-center h-16 text-slate-500 text-xs font-bold uppercase tracking-widest opacity-40">
                                        <span>No votes</span>
                                    </div>
                                )}
                        </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    </ScrollReveal>
  );
};