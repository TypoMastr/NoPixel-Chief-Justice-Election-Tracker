import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Vote, Candidate } from '../types';
import { COLORS, DEPARTMENT_LIST } from '../constants';
import { ScrollReveal } from './ScrollReveal';
import { CountUp } from './CountUp';
import { AnimatedBar } from './AnimatedBar';

interface LeadingCandidateStatsProps {
  votes: Vote[];
}

export const LeadingCandidateStats: React.FC<LeadingCandidateStatsProps> = ({ votes }) => {
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

  // Filter out abstained votes for leadership calculation
  const activeVotes = votes.filter(v => v.candidate !== Candidate.ABSTAINED);
  
  if (activeVotes.length === 0) return null;

  // 1. Find the leader among active candidates
  const candidateCounts = activeVotes.reduce((acc, vote) => {
    acc[vote.candidate] = (acc[vote.candidate] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let leader = "";
  let maxVotes = -1;

  Object.entries(candidateCounts).forEach(([cand, count]) => {
    const voteCount = count as number;
    if (voteCount > maxVotes) {
      maxVotes = voteCount;
      leader = cand;
    }
  });

  if (!leader) return null;

  // 2. Prepare data for the leader
  const leaderVotes = activeVotes.filter(v => v.candidate === leader);
  const totalLeaderVotes = leaderVotes.length;
  
  // Percentage against VALID votes (active votes)
  const percentageOfValid = activeVotes.length > 0 ? (totalLeaderVotes / activeVotes.length) * 100 : 0;

  // Percentage against TOTAL votes (including abstentions)
  const percentageOfTotal = votes.length > 0 
    ? (totalLeaderVotes / votes.length) * 100 
    : 0;

  const breakdownData = DEPARTMENT_LIST.map(dept => {
    const leaderCountInDept = leaderVotes.filter(v => v.department === dept).length;
    
    // Count ALL votes in department (including abstentions) for the total/denominator
    const totalVotesInDept = votes.filter(v => v.department === dept).length;
    
    // Calculate domination percentage: (Votes for Leader in Dept / Total Votes in Dept)
    const dominationPercent = totalVotesInDept > 0 
        ? (leaderCountInDept / totalVotesInDept) * 100 
        : 0;
    
    return {
      name: dept,
      votes: leaderCountInDept,
      totalDept: totalVotesInDept,
      percent: dominationPercent
    };
  });

  const leaderColor = COLORS[leader as Candidate] || '#cbd5e1';

  return (
    <ScrollReveal>
        <div className="glass-panel rounded-2xl p-4 md:p-8 shadow-2xl mb-4 md:mb-8 relative overflow-hidden ring-1 ring-white/10">
            {/* Glow behind the card */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-white to-transparent opacity-[0.03] rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <div className="relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 md:mb-8 gap-4 md:gap-6 border-b border-white/5 pb-4 md:pb-6">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                {/* Fixed: Increased py-0.5 to py-1 to prevent font clipping at bottom */}
                                <span className="bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 px-2 py-1 rounded text-[10px] md:text-[11px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.15)] animate-pulse">Current Leader</span>
                            </div>
                            {/* Header Name */}
                            <h1 className="text-xl md:text-5xl font-black text-white leading-normal tracking-tight drop-shadow-md flex items-center gap-2 md:gap-4 flex-wrap pb-2">
                                {leader === Candidate.BRITTANY_ANGEL && (
                                    <img 
                                        src="https://cdn.7tv.app/emote/01KCA38N23VMWVX2GCTXZ46YDK/4x.webp" 
                                        alt="Brittany Angel" 
                                        className="w-8 h-8 md:w-16 md:h-16 object-contain drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]" 
                                    />
                                )}
                                {/* Fixed: Added pb-2 and inline-block to prevent bg-clip-text from cutting off descenders (g, y, p, q) */}
                                <span className="whitespace-normal bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400 pr-1 pb-2 inline-block">{leader}</span>
                            </h1>
                            
                            <div className="mt-1 flex flex-col gap-1">
                                {/* Valid Votes Stat */}
                                <div className="text-sm md:text-lg font-medium text-slate-300 flex items-center gap-2 md:gap-3 flex-wrap py-1">
                                    <span className="relative flex h-2 w-2 md:h-3 md:w-3 flex-shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                    </span>
                                    <span className="leading-relaxed">
                                        Holding <span className="text-white font-bold text-base md:text-xl inline-block align-baseline">
                                            <CountUp end={percentageOfValid} decimals={1} suffix="%" />
                                        </span> of valid votes
                                    </span>
                                </div>

                                {/* Total Votes Stat */}
                                <div className="text-xs md:text-sm font-medium text-slate-500 flex items-center gap-2 md:gap-3 pl-0.5 py-1">
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-600 ml-0.5 flex-shrink-0"></span>
                                    <span className="leading-relaxed">
                                        Holding <span className="text-slate-400 font-bold text-sm md:text-base inline-block align-baseline">
                                            <CountUp end={percentageOfTotal} decimals={1} suffix="%" />
                                        </span> of total votes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 px-4 py-3 md:px-8 md:py-5 rounded-xl border border-white/10 text-center w-full md:w-auto md:min-w-[180px] shadow-inner flex flex-row md:flex-col justify-between md:justify-center items-center backdrop-blur-sm">
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-0 md:mb-2">Total Votes</p>
                        <p className="text-3xl md:text-5xl font-black tracking-tighter drop-shadow-md" style={{ color: leaderColor }}>
                            <CountUp end={totalLeaderVotes} />
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    {/* Chart - Smaller on mobile */}
                    <div ref={chartRef} className="h-[200px] md:h-[320px] w-full pb-4 hidden md:block">
                        <h3 className="text-slate-200 font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-3 border-b border-white/5 pb-2">
                            <span className="w-6 h-[3px] bg-slate-400 rounded-full"></span> Department Votes
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart key={chartVisible ? 'visible' : 'hidden'} data={breakdownData} layout="vertical" margin={{ left: 0, right: 30, bottom: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={60} 
                                    tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 700 }} 
                                    axisLine={false} 
                                    tickLine={false}
                                />
                                <Tooltip 
                                    cursor={false}
                                    isAnimationActive={false}
                                    offset={20}
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                                        borderColor: 'rgba(255,255,255,0.1)', 
                                        color: '#fff', 
                                        borderRadius: '8px',
                                        backdropFilter: 'blur(8px)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#fff' }}
                                    formatter={(value: number) => [`${value} votes for ${leader}`]}
                                />
                                <Bar 
                                    dataKey="votes" 
                                    radius={[0, 4, 4, 0] as [number, number, number, number]}
                                    barSize={24} 
                                    background={{ fill: 'rgba(30, 41, 59, 0.5)', radius: [0, 4, 4, 0] as any }}
                                    isAnimationActive={true}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                >
                                    {breakdownData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={leaderColor} />
                                    ))}
                                    <LabelList dataKey="votes" position="right" fill="#fff" fontSize={12} fontWeight="bold" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick Stats Grid - 2 cols on mobile */}
                    <div>
                        <h3 className="text-slate-200 font-bold mb-4 md:mb-6 text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 border-b border-white/5 pb-2">
                            <span className="w-6 h-[3px] bg-slate-400 rounded-full"></span> Department Breakdown
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 md:gap-4 place-content-start">
                            {breakdownData.map((d, i) => (
                                <ScrollReveal key={d.name} delay={i * 100} width="100%">
                                    <div className="flex flex-col p-3 md:p-4 rounded-xl bg-slate-800/60 border border-slate-500/50 transition-all duration-300 group relative overflow-hidden h-full">
                                        <div className="absolute top-0 left-0 h-1 bg-slate-700/30 w-full">
                                            <AnimatedBar 
                                                targetWidth={`${d.percent}%`}
                                                backgroundColor={leaderColor}
                                                className="h-full"
                                                delay={500 + (i * 100)}
                                            />
                                        </div>
                                        
                                        <div className="flex justify-between items-center mb-1 md:mb-2 mt-2">
                                            <span className="text-xs md:text-sm font-bold text-white transition-colors">{d.name}</span>
                                            <span className="text-[10px] md:text-xs font-mono font-bold px-1.5 md:px-2 py-0.5 rounded border bg-green-500/10 text-green-400 border-green-500/30">
                                                <CountUp end={d.percent} decimals={1} suffix="%" />
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-lg md:text-2xl font-black text-white font-mono tracking-tight">
                                                <CountUp end={d.votes} />
                                            </span>
                                            <span className="text-[9px] md:text-[11px] text-slate-500 font-medium uppercase tracking-wide">of <CountUp end={d.totalDept} /></span>
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
};