import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Vote, Candidate } from '../types';
import { COLORS, DEPARTMENT_LIST } from '../constants';
import { ScrollReveal } from './ScrollReveal';
import { CountUp } from './CountUp';
import { AnimatedBar } from './AnimatedBar';
import { X, Loader2 } from 'lucide-react';

interface LeadingCandidateStatsProps {
  votes: Vote[];
}

const EMOTE_MAP: Record<string, string> = {
  [Candidate.BRITTANY_ANGEL]: "https://cdn.7tv.app/emote/01KCA38N23VMWVX2GCTXZ46YDK/4x.webp",
  [Candidate.NATHANIEL_GREYSON]: "https://cdn.7tv.app/emote/01G4ZGET1R0003SYTMXJ2SQCGP/4x.gif",
  [Candidate.SEAN_DANIELSON]: "https://cdn.7tv.app/emote/01G1GEAAK800054T8VD7CWC8Y2/4x.webp",
  [Candidate.ABSTAINED]: "https://cdn.7tv.app/emote/01G3F6FE2800067JFSTYNA74GE/4x.gif"
};

const EASTER_EGGS: Record<string, { gif: string; title: string }> = {
  [Candidate.BRITTANY_ANGEL]: {
    gif: "https://media1.tenor.com/m/77jgUjNcuGMAAAAC/girl-power-beat-up.gif",
    title: "Leadership Presence"
  },
  [Candidate.ABSTAINED]: {
    gif: "https://media1.tenor.com/m/YInVaU96-AgAAAAC/foldable-fence.gif",
    title: "Strategic Withdrawal"
  },
  [Candidate.NATHANIEL_GREYSON]: {
    gif: "https://media.tenor.com/evbnS5cmj7AAAAAi/chicken-walking.gif",
    title: "Steady Progress"
  },
  [Candidate.SEAN_DANIELSON]: {
    gif: "https://media1.tenor.com/m/3K5PzTVTQtMAAAAC/pablo-escobar-pablo.gif",
    title: "Waiting for Results"
  }
};

const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  if (value === 0) return null;
  return (
    <g>
      <text
        x={x + width + 8}
        y={y + height / 2 + 1}
        fill="#fff"
        textAnchor="start"
        dominantBaseline="middle"
        style={{
          fontSize: '13px',
          fontWeight: '900',
        }}
      >
        {value}
      </text>
    </g>
  );
};

export const LeadingCandidateStats: React.FC<LeadingCandidateStatsProps> = ({ votes }) => {
  const [modalState, setModalState] = useState<{ isOpen: boolean; gifUrl: string; title: string }>({
    isOpen: false,
    gifUrl: '',
    title: ''
  });
  const [isClosing, setIsClosing] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Alterado: agora guardamos apenas se está visível no momento ou não, por candidato
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    Object.keys(cardRefs.current).forEach(key => {
      const observer = new IntersectionObserver(([entry]) => {
        // Atualiza estado: true se visível, false se não
        setVisibleCards(prev => ({ ...prev, [key]: entry.isIntersecting }));
      }, { threshold: 0.1 }); 

      if (cardRefs.current[key]) {
        observer.observe(cardRefs.current[key]!);
        observers.push(observer);
      }
    });

    return () => observers.forEach(o => o.disconnect());
  }, [votes]);

  const handleOpenModal = (candidate: Candidate) => {
    const egg = EASTER_EGGS[candidate];
    if (!egg) return;

    setModalState({
      isOpen: true,
      gifUrl: egg.gif,
      title: egg.title
    });
    setIsClosing(false);
    setIsImageLoaded(false);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalState(prev => ({ ...prev, isOpen: false }));
      setIsClosing(false);
    }, 400); 
  };

  if (votes.length === 0) return null;

  const activeVotesCount = votes.filter(v => v.candidate !== Candidate.ABSTAINED).length;
  
  const allCandidateStatsWithVotes = Object.values(Candidate).map(cand => {
    const candVotes = votes.filter(v => v.candidate === cand);
    return {
      candidate: cand,
      count: candVotes.length,
      votes: candVotes,
      isAbstained: cand === Candidate.ABSTAINED
    };
  }).filter(stat => stat.count > 0);

  const sortedStats = [
    ...allCandidateStatsWithVotes.filter(c => !c.isAbstained).sort((a, b) => b.count - a.count),
    ...allCandidateStatsWithVotes.filter(c => c.isAbstained)
  ];

  const getRankBadge = (index: number, isAbstained: boolean, candidate: string) => {
    // 1. Prioridade máxima: Abstenção
    if (isAbstained) return "Abstention Count";
    
    // 2. Prioridade específica: Nathaniel Greyson é sempre Runner Up
    if (candidate === Candidate.NATHANIEL_GREYSON) return "Runner Up";

    // 3. Lógica padrão de ranking
    if (index === 0) return "Current Leader";
    if (index === 1) return "Runner Up";
    if (index === 2) return "Third Place";
    return `Rank #${index + 1}`;
  };

  return (
    <div className="space-y-8 mb-8">
      {sortedStats.map((stat, index) => {
        const { candidate, count, votes: candVotes, isAbstained } = stat;
        const leaderColor = COLORS[candidate as Candidate] || '#cbd5e1';
        const percentageOfValid = activeVotesCount > 0 ? (count / activeVotesCount) * 100 : 0;
        const percentageOfTotal = votes.length > 0 ? (count / votes.length) * 100 : 0;
        
        const breakdownData = DEPARTMENT_LIST.map(dept => {
          const votesForInDept = candVotes.filter(v => v.department === dept);
          const totalVotesInDept = votes.filter(v => v.department === dept).length;
          return {
            name: dept,
            votes: votesForInDept.length,
            totalDept: totalVotesInDept,
            percent: totalVotesInDept > 0 ? (votesForInDept.length / totalVotesInDept) * 100 : 0,
            voterList: votesForInDept.map(v => v.voterName).sort()
          };
        });

        const isEasterEggTarget = !!EASTER_EGGS[candidate as Candidate];
        const isVisible = visibleCards[candidate] || false;

        return (
          <ScrollReveal key={candidate}>
            <div 
              ref={(el) => { cardRefs.current[candidate] = el; }}
              className="glass-panel rounded-2xl p-5 md:p-8 shadow-2xl relative overflow-hidden ring-1 ring-white/10"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-white to-transparent opacity-[0.03] rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

              <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 md:mb-8 gap-6 border-b border-white/10 pb-6">
                      <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                              <button 
                                onClick={isEasterEggTarget ? () => handleOpenModal(candidate as Candidate) : undefined}
                                className={`bg-teal-500/20 text-teal-400 border border-teal-500/40 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(20,184,166,0.2)] ${isEasterEggTarget ? 'animate-pulse hover:animate-none hover:bg-teal-400/30 hover:text-white hover:border-teal-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:brightness-125 cursor-pointer' : 'cursor-default'} outline-none flex items-center justify-center transition-all`}
                              >
                                <span>{getRankBadge(index, isAbstained, candidate)}</span>
                              </button>
                          </div>
                          <h1 className="text-2xl md:text-5xl font-black text-white leading-tight tracking-tight flex items-center gap-3 flex-wrap pb-2">
                              <button 
                                onClick={isEasterEggTarget ? () => handleOpenModal(candidate as Candidate) : undefined}
                                className={`focus:outline-none transition-transform ${isEasterEggTarget ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'} relative group/emote`}
                              >
                                <img 
                                  src={EMOTE_MAP[candidate]} 
                                  alt="" 
                                  className="w-10 h-10 md:w-16 md:h-16 object-contain"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </button>
                              <button 
                                onClick={isEasterEggTarget ? () => handleOpenModal(candidate as Candidate) : undefined}
                                className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400 py-1 text-left focus:outline-none transition-all ${isEasterEggTarget ? 'hover:brightness-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer' : 'cursor-default'}`}
                              >
                                {candidate}
                              </button>
                          </h1>
                          
                          <div className="mt-3 space-y-2">
                              {!isAbstained && (
                                <div className="text-sm md:text-lg font-bold text-slate-200 flex items-center gap-3">
                                    <span className="relative flex h-3 w-3 flex-shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                    </span>
                                    <span>Holding <span className="text-white font-black text-lg md:text-2xl tabular-nums"><CountUp end={percentageOfValid} decimals={1} suffix="%" /></span> of valid votes</span>
                                </div>
                              )}
                              <div className="text-xs md:text-sm font-bold text-slate-400 flex items-center gap-3 pl-0.5">
                                  <span className="w-2 h-2 rounded-full bg-slate-600 flex-shrink-0"></span>
                                  <span>Representing <span className="text-slate-300 font-black tabular-nums"><CountUp end={percentageOfTotal} decimals={1} suffix="%" /></span> of total votes</span>
                              </div>
                          </div>
                      </div>

                      <div className="bg-slate-900/60 px-6 py-4 md:px-8 md:py-6 rounded-2xl border border-white/10 text-center w-full md:w-auto md:min-w-[200px] shadow-xl flex flex-row md:flex-col justify-between md:justify-center items-center backdrop-blur-md">
                          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-0 md:mb-2">Total Votes</p>
                          <p className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums drop-shadow-md" style={{ color: leaderColor }}>
                              <CountUp end={count} />
                          </p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                      <div className="h-[250px] md:h-[320px] w-full pb-4 hidden md:block">
                          <h3 className="text-slate-100 font-black mb-6 text-sm uppercase tracking-widest flex items-center gap-3 border-b border-white/10 pb-3">
                              <span className="w-8 h-[4px] bg-slate-400 rounded-full"></span> Department Votes
                          </h3>
                          <div className="w-full h-full min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                  // Reutiliza a key baseada na visibilidade para "resetar" a animação de entrada do gráfico
                                  // quando o usuário rola para fora e volta.
                                  key={isVisible ? 'visible' : 'hidden'}
                                  data={breakdownData} 
                                  layout="vertical" 
                                  margin={{ left: 0, right: 40, bottom: 20 }}
                                >
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={70} tick={{ fill: '#f1f5f9', fontSize: 13, fontWeight: 900 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={false} content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        if (data.votes === 0) return null;
                                        return (
                                          <div className="bg-slate-900/95 border border-white/20 p-4 rounded-xl shadow-2xl backdrop-blur-md min-w-[220px]">
                                            <p className="font-black text-white text-sm uppercase tracking-widest mb-2 border-b border-white/10 pb-2">{data.name}</p>
                                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-1.5">
                                              {data.voterList.map((name: string, idx: number) => (
                                                <div key={idx} className="text-xs text-slate-200 font-bold flex items-center gap-2">
                                                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0 shadow-[0_0_5px_rgba(20,184,166,0.5)]"></div>
                                                  {name}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      }
                                      return null;
                                    }} />
                                    <Bar 
                                      dataKey="votes" 
                                      radius={6} 
                                      barSize={28} 
                                      isAnimationActive={true} 
                                      animationDuration={1000}
                                    >
                                        {breakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={leaderColor} />)}
                                        <LabelList dataKey="votes" content={<CustomBarLabel />} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                          </div>
                      </div>

                      <div>
                          <h3 className="text-slate-100 font-black mb-5 md:mb-6 text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 border-b border-white/10 pb-3">
                              <span className="w-8 h-[4px] bg-slate-400 rounded-full"></span> Quick Breakdown
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                              {breakdownData.map((d, i) => (
                                  <ScrollReveal key={d.name} delay={i * 50} width="100%">
                                      <div className="flex flex-col p-4 rounded-2xl bg-slate-800/80 border border-white/10 transition-all duration-300 group relative overflow-hidden h-full shadow-lg">
                                          <div className="absolute top-0 left-0 h-1.5 bg-slate-900 w-full">
                                              <AnimatedBar targetWidth={`${d.percent}%`} backgroundColor={leaderColor} className="h-full" delay={100 + (i * 50)} />
                                          </div>
                                          <div className="flex justify-between items-center mb-2 mt-2">
                                              <span className="text-xs font-black text-white uppercase tracking-wider">{d.name}</span>
                                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-green-500/10 text-green-400 border-green-500/30 tabular-nums">
                                                  <CountUp end={d.percent} decimals={0} suffix="%" />
                                              </span>
                                          </div>
                                          <div className="flex items-baseline gap-1.5">
                                              <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
                                                  <CountUp end={d.votes} />
                                              </span>
                                              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">of <CountUp end={d.totalDept} /></span>
                                          </div>
                                      </div>
                                  </ScrollReveal>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </ScrollReveal>
        );
      })}

      {/* Easter Egg Modal */}
      {modalState.isOpen && (
        <div 
          className={`fixed inset-0 z-[999] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden transition-all duration-500 ease-in-out ${isClosing ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={handleCloseModal}
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-[40px] z-[-1]" />
          
          <div 
            className={`relative w-full max-w-[95vw] md:max-w-4xl transform-gpu transition-all duration-500 ease-out flex flex-col items-center gap-6 md:gap-8 ${isClosing ? 'scale-90 opacity-0 blur-xl' : 'scale-100 opacity-100'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-square md:aspect-video max-h-[60vh] md:max-h-[70vh] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,1)] border-4 md:border-8 border-white/10 ring-1 ring-white/5 bg-slate-900/60 flex items-center justify-center">
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 bg-black/80 hover:bg-white text-white hover:text-black rounded-full transition-all backdrop-blur-xl z-30 border border-white/20 active:scale-90 shadow-[0_10px_30px_rgba(0,0,0,0.6)] opacity-100 ring-2 ring-white/10"
                aria-label="Close"
              >
                <X className="w-5 h-5 md:w-8 md:h-8" />
              </button>

              <img 
                src={modalState.gifUrl} 
                alt="" 
                className={`block w-full h-full object-cover md:object-contain transition-all duration-1000 ease-out ${isImageLoaded ? 'scale-100 opacity-100 blur-0' : 'scale-125 opacity-0 blur-2xl'}`}
                onLoad={() => setIsImageLoaded(true)}
              />
              
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-teal-500/10 via-transparent to-white/5 opacity-40"></div>
              
              {!isImageLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                  <div className="p-6 md:p-8 rounded-full bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl animate-pulse flex items-center justify-center">
                    <Loader2 className="w-10 h-10 md:w-16 md:h-16 text-teal-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};