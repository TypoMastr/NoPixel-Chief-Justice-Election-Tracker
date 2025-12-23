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

  // Helper to determine department theme
  const getDeptTheme = (dept: string) => {
    const d = dept.toUpperCase();
    
    if (d === 'BSCO' || d === 'BCSO') {
      return {
        cardWrapper: "bg-gradient-to-br from-[#423a26] to-[#262115] border-[#7d7150]/60 shadow-[0_4px_20px_rgba(66,58,38,0.3)]",
        title: "text-[#e8e3d3] drop-shadow-sm",
        divider: "bg-[#7d7150]/40",
        counter: "text-[#b0a586]",
        itemCard: "bg-[#2b2518]/60 border-[#7d7150]/30 hover:border-[#7d7150]/80",
        itemName: "text-[#f0eadd]",
        editIcon: "text-[#b0a586]",
        decorationColor: "bg-[#7d7150]/10"
      };
    } 
    
    if (d === 'LSPD') {
      return {
        // Deep Police Blue Theme
        cardWrapper: "bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] border-blue-800/60 shadow-[0_4px_20px_rgba(30,58,138,0.3)]",
        title: "text-blue-100 drop-shadow-sm",
        divider: "bg-blue-700/40",
        counter: "text-blue-200",
        // Darkened inner card background (Slate 950/50%) to pop against the blue gradient
        itemCard: "bg-[#020617]/50 border-blue-500/30 hover:border-blue-400 hover:bg-[#020617]/70",
        itemName: "text-blue-50",
        editIcon: "text-blue-300",
        decorationColor: "bg-blue-500/10"
      };
    }

    if (d === 'SASM') {
      return {
        // "Middle Ground" Theme: Gunmetal / Slate Grey
        // Card background is Slate 500-600 (Visible Grey).
        cardWrapper: "bg-gradient-to-br from-[#64748b] to-[#475569] border-slate-400/50 shadow-[0_4px_20px_rgba(100,116,139,0.25)]",
        title: "text-white drop-shadow-md font-black", 
        divider: "bg-white/20",
        counter: "text-slate-200",
        // High contrast inner cards: Dark Slate (almost black) with higher opacity
        // This ensures the white text and colored pills stand out clearly against the mid-grey wrapper
        itemCard: "bg-[#0f172a]/80 border-white/20 hover:border-white/50 hover:bg-[#0f172a]",
        itemName: "text-white font-bold", 
        editIcon: "text-slate-300",
        decorationColor: "bg-slate-200/5"
      };
    }

    // Default Theme (DOJ, DOC, etc.)
    return {
      cardWrapper: "bg-slate-900/30 border-white/5 shadow-md",
      title: "text-slate-300",
      divider: "bg-white/5",
      counter: "text-slate-400",
      itemCard: "bg-slate-700/80 border-teal-500/30 hover:border-teal-500/60 hover:bg-slate-700",
      itemName: "text-teal-300",
      editIcon: "text-teal-400",
      decorationColor: "hidden"
    };
  };

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

          const theme = getDeptTheme(dept);

          return (
            <ScrollReveal key={dept} delay={deptIndex * 100}>
                <div className={`${theme.cardWrapper} p-3 md:p-6 rounded-xl border relative overflow-hidden`}>
                    {/* Decorative element */}
                    {theme.decorationColor !== 'hidden' && (
                        <div className={`absolute -top-10 -right-10 w-40 h-40 ${theme.decorationColor} rounded-full blur-3xl pointer-events-none`}></div>
                    )}

                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-6 relative z-10">
                        <h3 className={`text-base md:text-2xl font-black uppercase tracking-widest ${theme.title}`}>{dept}</h3>
                        <div className={`h-px flex-1 ${theme.divider}`}></div>
                        <span className={`${theme.counter} text-[9px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap`}>{deptVotes.length} voters</span>
                    </div>
                    
                    {/* 2 columns on mobile, 4 on medium, 6 on xl */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 relative z-10">
                        {deptVotes.map((vote, vIndex) => (
                        <ScrollReveal 
                          key={vote.id} 
                          delay={(vIndex % 8) * 50} // Stagger effect for grid items
                          width="100%"
                        >
                            <div 
                                onClick={() => isAdmin ? onEdit(vote) : undefined}
                                className={`group relative p-2 md:p-4 rounded-lg transition-all duration-300 shadow-sm h-full border ${theme.itemCard} ${isAdmin ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : 'cursor-default'}`}
                            >
                                <div className="flex flex-col gap-1 md:gap-3 h-full justify-between">
                                    {/* Name */}
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-bold text-xs md:text-sm leading-tight transition-colors w-[90%] whitespace-normal break-words ${theme.itemName}`} title={vote.voterName}>
                                            {vote.voterName}
                                        </h3>
                                        {isAdmin && (
                                            <Edit2 className={`w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1 ${theme.editIcon}`} />
                                        )}
                                    </div>

                                    {/* Candidate Pill */}
                                    <div className="flex items-center mt-auto">
                                        <div 
                                            className="px-1.5 py-1 md:px-2.5 md:py-1.5 rounded text-[9px] md:text-[11px] font-bold w-full text-center border transition-all shadow-sm whitespace-normal break-words leading-tight"
                                            style={{ 
                                                backgroundColor: `${COLORS[vote.candidate]}10`, // very low opacity background
                                                color: COLORS[vote.candidate], // Text color (now lighter for Abstained)
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