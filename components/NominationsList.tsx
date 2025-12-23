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
            {NOMINATIONS.map((nom, index) => (
              <ScrollReveal key={nom.dept} delay={index * 50} width="100%">
                <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between h-full hover:border-yellow-500/30 transition-colors relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-lg font-black text-white tracking-wider">{nom.dept}</span>
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1">Endorsed</span>
                    <div 
                        className="px-2 py-1.5 rounded text-xs font-bold w-full text-center border shadow-sm whitespace-normal break-words leading-tight flex items-center justify-center gap-2"
                        style={{ 
                            backgroundColor: `${COLORS[nom.candidate]}15`,
                            color: COLORS[nom.candidate],
                            borderColor: `${COLORS[nom.candidate]}30`
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[nom.candidate] }}></span>
                        {nom.candidate}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};