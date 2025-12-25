import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Vote, Candidate } from '../types';
import { COLORS, ACTIVE_CANDIDATES } from '../constants';
import { ScrollReveal } from './ScrollReveal';
import { CountUp } from './CountUp';
import { AnimatedBar } from './AnimatedBar';
import { X, Loader2 } from 'lucide-react';

interface ResultsSectionProps {
  votes: Vote[];
}

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
  }
};

export const ResultsSection: React.FC<ResultsSectionProps> = ({ votes }) => {
  const totalVotes = votes.length;
  
  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const [modalState, setModalState] = useState<{ isOpen: boolean; gifUrl: string; title: string }>({
    isOpen: false,
    gifUrl: '',
    title: ''
  });
  
  const [isClosing, setIsClosing] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setChartVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) observer.disconnect();
    };
  }, []);

  const handleCloseGifModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalState(prev => ({ ...prev, isOpen: false }));
      setIsClosing(false);
    }, 400); 
  };

  // Process data for ALL candidates including ABSTAINED
  // We create a combined list, map the data, and then sort by vote count
  const allCandidatesList = [...ACTIVE_CANDIDATES, Candidate.ABSTAINED];

  const data = allCandidatesList.map(candidate => {
    const candidateVotes = votes.filter(v => v.candidate === candidate);
    
    // Sort voters alphabetically
    candidateVotes.sort((a, b) => a.voterName.localeCompare(b.voterName));

    return {
      name: candidate,
      value: candidateVotes.length,
      voters: candidateVotes.map(v => v.voterName).join(", ")
    };
  }).sort((a, b) => b.value - a.value); // Sort by votes descending

  // Custom label render using passed x, y for better alignment with lines
  const renderCustomizedLabel = (props: any) => {
    const { x, y, cx, percent } = props;
    if (percent === 0) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-[10px] md:text-xs font-bold animate-fade-in-up"
        style={{ 
            fontWeight: '700', 
            fill: '#f8fafc', 
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.9))',
            animationDelay: '0s'
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
      {/* List Column */}
      <div className="order-2 lg:order-1 h-full">
        <ScrollReveal delay={100} className="h-full">
            <div className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl h-full flex flex-col">
                <h2 className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-4 md:mb-8 flex items-center gap-3 border-b border-white/5 pb-4 py-2">
                📊 Candidate Results
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-5 flex-1">
                {data.map((item, idx) => {
                    // Percent of TOTAL votes (including abstentions)
                    const percentage = totalVotes > 0 ? (item.value / totalVotes) * 100 : 0;

                    return (
                    <ScrollReveal key={item.name} delay={idx * 50} width="100%">
                        <div 
                            className="group bg-slate-800/80 p-3 md:p-5 rounded-xl border border-teal-500/50 transition-all duration-300 relative overflow-hidden shadow-lg h-full"
                        >
                            {/* Background bar animation */}
                            <AnimatedBar 
                                targetWidth={`${percentage}%`}
                                backgroundColor={COLORS[item.name as Candidate]}
                                className="absolute top-0 bottom-0 left-0 opacity-[0.25]"
                                delay={idx * 50 + 100}
                            />
                            
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between md:items-center mb-0 md:mb-4 gap-2 md:gap-0">
                                    <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                                        <div className="w-1 h-6 md:w-1.5 md:h-10 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] flex-shrink-0 transition-all scale-y-110" style={{ backgroundColor: COLORS[item.name as Candidate] }}></div>
                                        <span 
                                          className="font-bold text-xs md:text-xl tracking-tight leading-snug pr-2 whitespace-normal break-words text-teal-50 py-1"
                                        >
                                          {item.name}
                                        </span>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-3 pl-3 md:pl-0 self-end md:self-auto">
                                        <span className={`text-2xl md:text-4xl font-black tracking-tighter tabular-nums ${item.value > 0 ? 'text-white' : 'text-slate-600'}`}>
                                            <CountUp end={item.value} />
                                        </span>
                                        <div className="text-[10px] md:text-xs font-bold text-slate-300 bg-slate-800/80 border border-slate-600/50 rounded px-1.5 py-0.5 md:px-2 md:py-1 min-w-[40px] md:min-w-[50px] text-center shadow-sm backdrop-blur-sm">
                                            <CountUp end={percentage} decimals={1} suffix="%" />
                                        </div>
                                    </div>
                                </div>
                                
                                {item.value > 0 && (
                                    <div className="mt-2 pt-2 md:pt-3 border-t border-white/5 hidden md:block opacity-100 transition-opacity duration-300">
                                        <span className="text-slate-400 uppercase text-[10px] tracking-widest block mb-2 font-bold flex items-center gap-2">
                                            <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Recorded Voters
                                        </span> 
                                        <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-normal">
                                            {item.voters}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>
                    );
                })}
                </div>
            </div>
        </ScrollReveal>
      </div>

      {/* Chart Column */}
      <div className="order-1 lg:order-2 h-full">
        <ScrollReveal delay={100} className="h-full">
            <div ref={chartRef} className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl flex flex-col h-full">
                <h2 className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-2 md:mb-6 flex items-center gap-3 border-b border-white/5 pb-4 py-2">
                📈 Distribution
                </h2>
                <div className="flex-1 min-h-[250px] md:min-h-0 flex items-center justify-center relative -ml-4">
                <ResponsiveContainer width="100%" height="100%" className="!h-[250px] md:!h-full min-h-[250px]">
                    <PieChart key={chartVisible ? 'visible' : 'hidden'}>
                    <Pie
                        data={data.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%" 
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        label={renderCustomizedLabel}
                        labelLine={true}
                        isAnimationActive={true}
                        animationDuration={800} // Speed up
                        animationEasing="ease-out"
                    >
                        {data.filter(d => d.value > 0).map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[entry.name as Candidate]} 
                            style={{ outline: 'none' }}
                        />
                        ))}
                    </Pie>
                    <Tooltip 
                        isAnimationActive={false}
                        offset={20}
                        contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.90)', 
                            borderColor: 'rgba(255,255,255,0.1)', 
                            borderRadius: '12px', 
                            color: '#fff',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                        }}
                        itemStyle={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}
                        labelStyle={{ color: '#fff' }}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        wrapperStyle={{ paddingTop: '10px', fontSize: '10px', fontWeight: 500, color: '#cbd5e1' }}
                        iconType="circle"
                    />
                    </PieChart>
                </ResponsiveContainer>
                </div>
            </div>
        </ScrollReveal>
      </div>

      {/* Easter Egg Modal (GIFs) */}
      {modalState.isOpen && (
        <div 
          className={`fixed inset-0 z-[999] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden transition-all duration-500 ease-in-out ${isClosing ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={handleCloseGifModal}
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-[40px] z-[-1]" />
          
          <div 
            className={`relative w-full max-w-[95vw] md:max-w-4xl transform-gpu transition-all duration-500 ease-out flex flex-col items-center gap-6 md:gap-8 ${isClosing ? 'scale-90 opacity-0 blur-xl' : 'scale-100 opacity-100'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-square md:aspect-video max-h-[60vh] md:max-h-[70vh] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,1)] border-4 md:border-8 border-white/10 ring-1 ring-white/5 bg-slate-900/60 flex items-center justify-center">
              <button 
                onClick={handleCloseGifModal}
                className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 bg-black/80 hover:bg-white text-white hover:text-black rounded-full transition-all backdrop-blur-xl z-30 border border-white/20 active:scale-90 shadow-[0_10px_30px_rgba(0,0,0,0.6)] opacity-100 ring-2 ring-white/10"
                aria-label="Close"
              >
                <X className="w-5 h-5 md:w-8 md:h-8" />
              </button>

              <img 
                src={modalState.gifUrl} 
                alt={modalState.title} 
                className={`block w-full h-full object-cover md:object-contain transition-all duration-1000 ease-out ${isImageLoaded ? 'scale-100 opacity-100 blur-0' : 'scale-125 opacity-0 blur-2xl'}`}
                onLoad={() => setIsImageLoaded(true)}
              />
              
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-teal-500/10 via-transparent to-white/5 opacity-40"></div>
              
              {!isImageLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                  <div className="p-6 md:p-8 rounded-full bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl animate-pulse flex items-center justify-center">
                    <Loader2 className="w-10 h-10 md:w-16 md:h-16 text-teal-400 animate-spin" />
                  </div>
                  <p className="mt-6 text-[10px] md:text-sm font-black text-teal-400 uppercase tracking-[0.5em] animate-pulse text-center">Loading Content...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};