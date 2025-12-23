import React from 'react';
import { Vote, Candidate } from '../types';
import { Edit2 } from 'lucide-react';
import { COLORS } from '../constants';
import { ScrollReveal } from './ScrollReveal';

interface VoterGridProps {
  votes: Vote[];
  onEdit: (vote: Vote) => void;
  isAdmin: boolean;
}

export const VoterGrid: React.FC<VoterGridProps> = ({ votes, onEdit, isAdmin }) => {
  // 1. Group votes by Department
  const groupedVotes = votes.reduce((acc, vote) => {
    if (!acc[vote.department]) {
      acc[vote.department] = [];
    }
    acc[vote.department].push(vote);
    return acc;
  }, {} as Record<string, Vote[]>);

  // 2. Sort Departments Alphabetically
  const sortedDepartments = Object.keys(groupedVotes).sort();

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl mb-12">
      <div className="flex justify-between items-center mb-4 md:mb-8 border-b border-white/5 pb-2 md:pb-4">
        <h2 className="text-lg md:text-2xl font-bold text-teal-400 flex items-center gap-2 md:gap-3">
          👥 Voters List <span className="text-slate-300 text-[10px] md:text-sm font-bold bg-slate-800/50 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-slate-600/50">Total: {votes.length}</span>
        </h2>
      </div>

      <div className="space-y-4 md:space-y-10">
        {sortedDepartments.map((dept, deptIndex) => {
          // 3. Sort voters inside department alphabetically
          const deptVotes = groupedVotes[dept].sort((a, b) => 
            a.voterName.localeCompare(b.voterName)
          );

          return (
            <ScrollReveal key={dept} delay={deptIndex * 100}>
                <div className="bg-slate-900/30 p-3 md:p-6 rounded-xl border border-white/5 shadow-md">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-6">
                        <h3 className="text-base md:text-2xl font-black text-slate-300 uppercase tracking-widest">{dept}</h3>
                        <div className="h-px bg-white/5 flex-1"></div>
                        <span className="text-slate-400 text-[9px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap">{deptVotes.length} voters</span>
                    </div>
                    
                    {/* 2 columns on mobile, 4 on medium, 6 on xl */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                        {deptVotes.map((vote, vIndex) => (
                        <ScrollReveal 
                          key={vote.id} 
                          delay={(vIndex % 8) * 50} // Stagger effect for grid items
                          width="100%"
                        >
                            <div 
                                onClick={() => isAdmin ? onEdit(vote) : undefined}
                                className={`group relative bg-slate-700/80 border border-teal-500/30 p-2 md:p-4 rounded-lg transition-all duration-300 shadow-sm h-full ${
                                    isAdmin 
                                    ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-teal-500/60 hover:bg-slate-700' 
                                    : 'cursor-default'
                                }`}
                            >
                                <div className="flex flex-col gap-1 md:gap-3 h-full justify-between">
                                    {/* Name */}
                                    <div className="flex justify-between items-start">
                                        {/* Permanent teal-300 text for visual consistency */}
                                        <h3 className="text-teal-300 font-bold text-xs md:text-sm leading-tight transition-colors w-[90%] whitespace-normal break-words" title={vote.voterName}>
                                            {vote.voterName}
                                        </h3>
                                        {isAdmin && (
                                            <Edit2 className="w-3 h-3 text-teal-400 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
                                        )}
                                    </div>

                                    {/* Candidate Pill */}
                                    <div className="flex items-center mt-auto">
                                        <div 
                                            className="px-1.5 py-1 md:px-2.5 md:py-1.5 rounded text-[9px] md:text-[11px] font-bold w-full text-center border transition-all shadow-sm whitespace-normal break-words leading-tight"
                                            style={{ 
                                                backgroundColor: `${COLORS[vote.candidate]}10`, // very low opacity
                                                color: COLORS[vote.candidate],
                                                borderColor: `${COLORS[vote.candidate]}30`
                                            }}
                                        >
                                            {vote.candidate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                        ))}
                    </div>
                </div>
            </ScrollReveal>
          );
        })}

        {votes.length === 0 && (
            <div className="text-center py-16 text-slate-500 italic text-lg">
                No votes recorded yet.
            </div>
        )}
      </div>
    </div>
  );
};