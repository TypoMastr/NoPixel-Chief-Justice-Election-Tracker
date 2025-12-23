import React from 'react';
import { Vote, Candidate } from '../types';
import { Edit2, ShieldCheck } from 'lucide-react';
import { COLORS } from '../constants';
import { ScrollReveal } from './ScrollReveal';

interface VoterGridProps {
  votes: Vote[];
  onEdit: (vote: Vote) => void;
  isAdmin: boolean;
}

export const VoterGrid: React.FC<VoterGridProps> = ({ votes, onEdit, isAdmin }) => {
  const groupedByDept = votes.reduce((acc, vote) => {
    if (!acc[vote.department]) {
      acc[vote.department] = [];
    }
    acc[vote.department].push(vote);
    return acc;
  }, {} as Record<string, Vote[]>);

  const sortedDepartments = Object.keys(groupedByDept).sort();

  const getDeptTheme = (dept: string) => {
    const d = dept.toUpperCase();
    if (d === 'BSCO' || d === 'BCSO') {
      return {
        cardWrapper: "bg-gradient-to-br from-[#423a26] to-[#262115] border-[#7d7150]/60 shadow-[0_4px_20px_rgba(66,58,38,0.3)]",
        title: "text-[#e8e3d3]",
        divider: "bg-[#7d7150]/40",
        counter: "text-[#b0a586]",
        itemCard: "bg-[#2b2518]/60 border-[#7d7150]/30 hover:border-teal-500/50",
        itemName: "text-[#f0eadd]",
        editIcon: "text-teal-400",
        decorationColor: "bg-[#7d7150]/10"
      };
    } 
    if (d === 'LSPD') {
      return {
        cardWrapper: "bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] border-blue-800/60 shadow-[0_4px_20px_rgba(30,58,138,0.3)]",
        title: "text-blue-100",
        divider: "bg-blue-700/40",
        counter: "text-blue-200",
        itemCard: "bg-[#020617]/50 border-blue-500/30 hover:border-teal-400/50",
        itemName: "text-blue-50",
        editIcon: "text-teal-300",
        decorationColor: "bg-blue-500/10"
      };
    }
    if (d === 'SASM') {
      return {
        cardWrapper: "bg-gradient-to-br from-[#64748b] to-[#475569] border-slate-400/50 shadow-[0_4px_20px_rgba(100,116,139,0.25)]",
        title: "text-white", 
        divider: "bg-white/20",
        counter: "text-slate-200",
        itemCard: "bg-[#0f172a]/80 border-white/20 hover:border-teal-400/50",
        itemName: "text-white", 
        editIcon: "text-teal-300",
        decorationColor: "bg-slate-200/5"
      };
    }
    return {
      cardWrapper: "bg-slate-900/30 border-white/5 shadow-md",
      title: "text-slate-300",
      divider: "bg-white/5",
      counter: "text-slate-400",
      itemCard: "bg-slate-800/80 border-white/5 hover:border-teal-500/40",
      itemName: "text-white",
      editIcon: "text-teal-400",
      decorationColor: "hidden"
    };
  };

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg md:text-2xl font-bold text-teal-400 flex items-center gap-3">
            👥 Voters List
          </h2>
          <span className="text-slate-300 text-[10px] md:text-sm font-bold bg-slate-800/80 px-3 py-1 rounded-full border border-slate-600/50 shadow-inner">
            {votes.length} Total
          </span>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          {isAdmin && (
            <div className="flex items-center gap-2 px-3 py-2 bg-teal-500/10 border border-teal-500/20 rounded-lg animate-pulse hidden sm:flex">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Edit Mode Active</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 md:space-y-12">
        {sortedDepartments.map((dept) => {
          const deptVotes = groupedByDept[dept].sort((a, b) => a.voterName.localeCompare(b.voterName));
          const theme = getDeptTheme(dept);

          return (
            <ScrollReveal key={dept} delay={100}>
              <div className={`${theme.cardWrapper} p-4 md:p-8 rounded-2xl border relative overflow-hidden group/dept transition-all duration-500`}>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <h3 className={`text-lg md:text-3xl font-black uppercase tracking-[0.15em] ${theme.title}`}>{dept}</h3>
                  <div className={`h-px flex-1 ${theme.divider}`}></div>
                  <span className={`${theme.counter} text-[10px] md:text-xs font-black uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full`}>
                    {deptVotes.length} Votes
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative z-10">
                  {deptVotes.map((vote, vIdx) => (
                    <ScrollReveal key={vote.id} delay={150 + (vIdx % 5) * 40} width="100%">
                      <div 
                        onClick={() => isAdmin ? onEdit(vote) : undefined}
                        className={`group relative p-4 rounded-xl transition-all duration-300 shadow-sm h-full border ${theme.itemCard} ${isAdmin ? 'cursor-pointer hover:shadow-teal-500/10 hover:-translate-y-1 active:scale-95' : 'cursor-default'}`}
                      >
                        <div className="flex flex-col gap-4 h-full">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className={`font-bold text-sm leading-tight transition-colors flex-1 ${theme.itemName}`}>
                              {vote.voterName}
                            </h3>
                            {isAdmin && (
                              <div className="p-1.5 bg-teal-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit2 className={`w-3 h-3 ${theme.editIcon}`} />
                              </div>
                            )}
                          </div>

                          <div className="mt-auto">
                            <div 
                              className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider w-full text-center border shadow-inner transition-all"
                              style={{ 
                                backgroundColor: `${COLORS[vote.candidate]}08`,
                                color: COLORS[vote.candidate],
                                borderColor: `${COLORS[vote.candidate]}20`
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
          <div className="text-center py-20 bg-slate-800/20 border border-white/5 rounded-2xl">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};