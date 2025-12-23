import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Vote, Candidate } from '../types';
import { COLORS, ACTIVE_CANDIDATES } from '../constants';
import { ScrollReveal } from './ScrollReveal';
import { CountUp } from './CountUp';
import { AnimatedBar } from './AnimatedBar';

interface ResultsSectionProps {
  votes: Vote[];
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ votes }) => {
  const abstainedVotes = votes.filter(v => v.candidate === Candidate.ABSTAINED).length;
  const totalVotes = votes.length;
  
  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

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

  // Process data for ACTIVE candidates only
  const data = ACTIVE_CANDIDATES.map(candidate => {
    const candidateVotes = votes.filter(v => v.candidate === candidate);
    
    // Sort voters alphabetically
    candidateVotes.sort((a, b) => a.voterName.localeCompare(b.voterName));

    return {
      name: candidate,
      value: candidateVotes.length,
      voters: candidateVotes.map(v => v.voterName).join(", ")
    };
  });

  // Data for chart (Total votes including abstained for visibility of turnout)
  const chartData = [
    ...data,
    { name: Candidate.ABSTAINED, value: abstainedVotes }
  ];

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
      <div className="order-2 lg:order-1">
        <ScrollReveal delay={100}>
            <div className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl">
                {/* Fixed: Added py-1 to prevent bg-clip-text clipping */}
                <h2 className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-4 md:mb-8 flex items-center gap-3 border-b border-white/5 pb-4 py-1">
                📊 Candidate Results
                </h2>
                {/* Grid-cols-2 on mobile for side-by-side cards */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-5">
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
                                    <div className="flex items-center gap-2 md:gap-4">
                                        <div className="w-1 h-6 md:w-1.5 md:h-10 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] flex-shrink-0 transition-all scale-y-110" style={{ backgroundColor: COLORS[item.name as Candidate] }}></div>
                                        {/* Permanent highlighted text color */}
                                        <h3 className="font-bold text-xs md:text-xl tracking-tight leading-snug pr-2 whitespace-normal break-words text-teal-50 transition-colors">{item.name}</h3>
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
                                    /* Permanently visible (opacity-100) instead of hover */
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
                
                {/* Abstained Small Summary */}
                <ScrollReveal delay={200} width="100%">
                    <div className="mt-4 p-3 bg-slate-900/30 border border-white/5 rounded-lg flex justify-between items-center hover:bg-slate-800/50 transition-colors">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Abstained</span>
                        <span className="text-slate-200 font-mono font-bold">
                            <CountUp end={abstainedVotes} />
                        </span>
                    </div>
                </ScrollReveal>
            </div>
        </ScrollReveal>
      </div>

      {/* Chart Column */}
      <div className="order-1 lg:order-2">
        <ScrollReveal delay={100}>
            <div ref={chartRef} className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl flex flex-col">
                {/* Fixed: Added py-1 to prevent bg-clip-text clipping */}
                <h2 className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-2 md:mb-6 flex items-center gap-3 border-b border-white/5 pb-4 py-1">
                📈 Distribution
                </h2>
                <div className="flex-1 min-h-[250px] md:min-h-[400px] flex items-center justify-center relative -ml-4">
                <ResponsiveContainer width="100%" height="100%" className="!h-[250px] md:!h-[450px]">
                    <PieChart key={chartVisible ? 'visible' : 'hidden'}>
                    <Pie
                        data={chartData.filter(d => d.value > 0)}
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
                        {chartData.filter(d => d.value > 0).map((entry, index) => (
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
    </div>
  );
};