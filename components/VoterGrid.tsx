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
    
    // BCSO Theme: Tan/Brown
    if (d === 'BSCO' || d === 'BCSO') {
      return {
        cardWrapper: "bg-gradient-to-br from-[#423a26] to-[#262115] border-[#7d7150]/60 shadow-[0_10px_40px_rgba(0,0,0,0.4)]",
        title: "text-[#e8e3d3]",
        divider: "bg-[#7d7150]/40",
        counter: "text-[#b0a586]",
        itemCard: "bg-[#2b2518]/80 border-[#7d7150]/30 hover:border-teal-500/50",
        itemName: "text-white",
        editIcon: "text-teal-400"
      };
    } 
    
    // LSPD Theme: Police Blue
    if (d === 'LSPD') {
      return {
        cardWrapper: "bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] border-blue-800/60 shadow-[0_10px_40px_rgba(0,0,0,0.4)]",
        title: "text-blue-100",
        divider: "bg-blue-700/40",
        counter: "text-blue-200",
        itemCard: "bg-[#020617]/70 border-blue-500/30 hover:border-teal-400/50",
        itemName: "text-white",
        editIcon: "text-teal-300"
      };
    }
    
    // SASM Theme: Slate/Grey
    if (d === 'SASM') {
      return {
        cardWrapper: "bg-gradient-to-br from-[#64748b] to-[#475569] border-slate-400/50 shadow-[0_10px_40px_rgba(0,0,0,0.4)]",
        title: "text-white", 
        divider: "bg-white/20",
        counter: "text-slate-200",
        itemCard: "bg-[#0f172a]/90 border-white/20 hover:border-teal-400/50",
        itemName: "text-white", 
        editIcon: "text-teal-300"
      };
    }

    // DOC Theme: Deepest Neutro (Slate 950) - Máximo contraste com o fundo
    if (d === 'DOC') {
      return {
        cardWrapper: "bg-slate-950/98 border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/5",
        title: "text-slate-200",
        divider: "bg-slate-700/30",
        counter: "text-slate-500",
        itemCard: "bg-slate-900/95 border-slate-800/60 hover:border-white/40",
        itemName: "text-white",
        editIcon: "text-slate-400"
      };
    }

    // DOJ Theme: Medium Neutro (Slate 900) - Ligeiramente mais claro que DOC
    if (d === 'DOJ') {
      return {
        cardWrapper: "bg-slate-900/90 border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/5",
        title: "text-white",
        divider: "bg-slate-600/30",
        counter: "text-slate-400",
        itemCard: "bg-slate-800/80 border-slate-700/60 hover:border-white/50",
        itemName: "text-white",
        editIcon: "text-slate-300"
      };
    }

    // Default Theme: Standard Slate
    return {
      cardWrapper: "bg-slate-900/90 border-white/10 shadow-xl",
      title: "text-slate-300",
      divider: "bg-white/5",
      counter: "text-slate-400",
      itemCard: "bg-slate-800/80 border-white/5 hover:border-teal-500/40",
      itemName: "text-white",
      editIcon: "text-teal-400"
    };
  };

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 border-b border-white/10 pb-5 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-black text-teal-400 flex items-center gap-3">
            👥 Voters List
          </h2>
          <span className="text-white text-xs md:text-sm font-black bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-600 shadow-inner tabular-nums">
            {votes.length} Total
          </span>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-2 bg-teal-500/10 border border-teal-500/20 rounded-lg hidden sm:flex">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Edit Mode Active</span>
          </div>
        )}
      </div>

      <div className="space-y-8 md:space-y-12">
        {sortedDepartments.map((dept) => {
          const deptVotes = groupedByDept[dept].sort((a, b) => a.voterName.localeCompare(b.voterName));
          const theme = getDeptTheme(dept);

          return (
            <ScrollReveal key={dept} delay={100}>
              <div className={`${theme.cardWrapper} p-5 md:p-8 rounded-2xl border-2 relative overflow-hidden group/dept transition-all duration-500`}>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <h3 className={`text-xl md:text-3xl font-black uppercase tracking-[0.15em] ${theme.title}`}>{dept}</h3>
                  <div className={`h-[2px] flex-1 ${theme.divider}`}></div>
                  <span className={`${theme.counter} text-xs font-black uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full tabular-nums border border-white/5`}>
                    {deptVotes.length} Votes
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 relative z-10">
                  {deptVotes.map((vote, vIdx) => (
                    <ScrollReveal key={vote.id} delay={150 + (vIdx % 5) * 40} width="100%">
                      <div 
                        onClick={() => isAdmin ? onEdit(vote) : undefined}
                        className={`group relative p-4 rounded-xl transition-all duration-300 shadow-lg h-full border ${theme.itemCard} ${isAdmin ? 'cursor-pointer hover:border-white active:scale-95' : 'cursor-default'}`}
                      >
                        <div className="flex flex-col gap-4 h-full">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className={`font-black text-sm md:text-base leading-snug transition-colors flex-1 ${theme.itemName}`}>
                              {vote.voterName}
                            </h3>
                            {isAdmin && (
                              <div className="p-1.5 bg-teal-500/20 rounded-md shadow-inner">
                                <Edit2 className={`w-3.5 h-3.5 ${theme.editIcon}`} />
                              </div>
                            )}
                          </div>

                          <div className="mt-auto">
                            <div 
                              className="px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest w-full text-center border shadow-inner transition-all backdrop-blur-md"
                              style={{ 
                                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                                color: COLORS[vote.candidate],
                                borderColor: `${COLORS[vote.candidate]}40`
                              }}
                            >
                              <span className="drop-shadow-sm filter brightness-110">{vote.candidate}</span>
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
            <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};