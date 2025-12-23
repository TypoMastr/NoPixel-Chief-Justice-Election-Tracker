import React from 'react';
import { Candidate } from '../types';
import { COLORS } from '../constants';
import { ScrollReveal } from './ScrollReveal';
import { Award, ShieldCheck } from 'lucide-react';

// Static data for nominations including non-voting departments
const NOMINATIONS = [
  { dept: 'BCSO', candidate: Candidate.BRITTANY_ANGEL },
  { dept: 'BSMO', candidate: Candidate.BRITTANY_ANGEL },
  { dept: 'DOC', candidate: Candidate.NATHANIEL_GREYSON },
  { dept: 'DOJ', candidate: Candidate.NATHANIEL_GREYSON },
  { dept: 'LSMO', candidate: Candidate.BRITTANY_ANGEL },
  { dept: 'LSPD', candidate: Candidate.BRITTANY_ANGEL },
  { dept: 'SAMA', candidate: Candidate.BRITTANY_ANGEL },
  { dept: 'SASM', candidate: Candidate.SEAN_DANIELSON },
];

export const NominationsList: React.FC = () => {
  // Helper to match VoterGrid styling
  const getNominationTheme = (dept: string) => {
    const d = dept.toUpperCase();
    
    if (d === 'BSCO' || d === 'BCSO') {
      return {
        wrapper: "bg-gradient-to-br from-[#423a26] to-[#262115] border-[#7d7150]/60 hover:border-white shadow-[0_4px_20px_rgba(66,58,38,0.3)]",
        title: "text-[#e8e3d3]",
        icon: "text-[#b0a586]",
        labelColor: "text-[#b0a586]"
      };
    } 
    
    if (d === 'LSPD') {
      return {
        wrapper: "bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] border-blue-800/60 hover:border-white shadow-[0_4px_20px_rgba(30,58,138,0.3)]",
        title: "text-blue-100",
        icon: "text-blue-300",
        labelColor: "text-blue-200"
      };
    }

    if (d === 'SASM') {
      return {
        wrapper: "bg-gradient-to-br from-[#64748b] to-[#475569] border-slate-400/50 hover:border-white shadow-[0_4px_20px_rgba(100,116,139,0.25)]",
        title: "text-white",
        icon: "text-slate-300",
        labelColor: "text-slate-200"
      };
    }

    // Default Theme
    return {
      wrapper: "bg-slate-900/60 border-white/10 hover:border-white",
      title: "text-white",
      icon: "text-slate-500",
      labelColor: "text-slate-400"
    };
  };

  return (
    <ScrollReveal>
      <div className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl mb-12 relative overflow-hidden group">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold text-yellow-100 mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
            <Award className="w-6 h-6 text-yellow-500" />
            Official Department Nominations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {NOMINATIONS.map((nom, index) => {
              const theme = getNominationTheme(nom.dept);
              
              return (
                <ScrollReveal key={nom.dept} delay={index * 50} width="100%">
                  <div className={`${theme.wrapper} border rounded-xl p-4 flex flex-col justify-between h-full transition-colors relative overflow-hidden`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-lg font-black tracking-wider ${theme.title}`}>{nom.dept}</span>
                      <ShieldCheck className={`w-4 h-4 ${theme.icon}`} />
                    </div>
                    
                    <div>
                      <span className={`text-[10px] uppercase tracking-widest font-bold block mb-1 ${theme.labelColor}`}>Endorsed</span>
                      <div 
                          className="px-2 py-1.5 rounded text-xs font-bold w-full text-center border shadow-sm whitespace-normal break-words leading-tight flex items-center justify-center gap-2 backdrop-blur-md"
                          style={{ 
                              backgroundColor: 'rgba(15, 23, 42, 0.75)', // Dark background for contrast against all card types
                              color: COLORS[nom.candidate],
                              borderColor: `${COLORS[nom.candidate]}40`,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                      >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[nom.candidate] }}></span>
                          <span className="drop-shadow-sm filter brightness-110">{nom.candidate}</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};