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

const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  return (
    <g>
      <defs>
        <style>
          {`@keyframes fadeInRight { from { opacity: 0; transform: translateX(-5px); } to { opacity: 1; transform: translateX(0); } }`}
        </style>
      </defs>
      <text
        x={x + width + 8}
        y={y + height / 2 + 1}
        fill="#fff"
        textAnchor="start"
        dominantBaseline="middle"
        style={{
          fontSize: '13px',
          fontWeight: '900',
          opacity: 0,
          animation: 'fadeInRight 0.5s ease-out forwards',
          animationDelay: '200ms'
        }}
      >
        {value}
      </text>
    </g>
  );
};

export const LeadingCandidateStats: React.FC<LeadingCandidateStatsProps> = ({ votes }) => {
  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setChartVisible(entry.isIntersecting), { threshold: 0.1 });
    if (chartRef.current) observer.observe(chartRef.current);
    return () => { if (chartRef.current) observer.disconnect(); };
  }, []);

  const activeVotes = votes.filter(v => v.candidate !== Candidate.ABSTAINED);
  if (activeVotes.length === 0) return null;

  const candidateCounts = activeVotes.reduce((acc, vote) => {
    acc[vote.candidate] = (acc[vote.candidate] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let leader = "";
  let maxVotes = -1;
  Object.entries(candidateCounts).forEach(([cand, count]) => {
    if ((count as number) > maxVotes) {
      maxVotes = count as number;
      leader = cand;
    }
  });

  if (!leader) return null;

  const leaderVotes = activeVotes.filter(v => v.candidate === leader);
  const totalLeaderVotes = leaderVotes.length;
  const percentageOfValid = activeVotes.length > 0 ? (totalLeaderVotes / activeVotes.length) * 100 : 0;
  const percentageOfTotal = votes.length > 0 ? (totalLeaderVotes / votes.length) * 100 : 0;

  const breakdownData = DEPARTMENT_LIST.map(dept => {
    const votesForLeaderInDept = leaderVotes.filter(v => v.department === dept);
    const totalVotesInDept = votes.filter(v => v.department === dept).length;
    return {
      name: dept,
      votes: votesForLeaderInDept.length,
      totalDept: totalVotesInDept,
      percent: totalVotesInDept > 0 ? (votesForLeaderInDept.length / totalVotesInDept) * 100 : 0,
      voterList: votesForLeaderInDept.map(v => v.voterName).sort()
    };
  });

  const leaderColor = COLORS[leader as Candidate] || '#cbd5e1';

  return (
    <ScrollReveal>
        <div className="glass-panel rounded-2xl p-5 md:p-8 shadow-2xl mb-4 md:mb-8 relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-white to-transparent opacity-[0.03] rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 md:mb-8 gap-6 border-b border-white/10 pb-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-[0.15em] shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse">Current Leader</span>
                        </div>
                        <h1 className="text-2xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md flex items-center gap-3 flex-wrap pb-2">
                            {leader === Candidate.BRITTANY_ANGEL && (
                                <img src="https://cdn.7tv.app/emote/01KCA38N23VMWVX2GCTXZ46YDK/4x.webp" alt="Brittany" className="w-10 h-10 md:w-16 md:h-16 object-contain drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
                            )}
                            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400 py-1">{leader}</span>
                        </h1>
                        
                        <div className="mt-3 space-y-2">
                            <div className="text-sm md:text-lg font-bold text-slate-200 flex items-center gap-3">
                                <span className="relative flex h-3 w-3 flex-shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                </span>
                                <span>Holding <span className="text-white font-black text-lg md:text-2xl tabular-nums"><CountUp end={percentageOfValid} decimals={1} suffix="%" /></span> of valid votes</span>
                            </div>
                            <div className="text-xs md:text-sm font-bold text-slate-400 flex items-center gap-3 pl-0.5">
                                <span className="w-2 h-2 rounded-full bg-slate-600 flex-shrink-0"></span>
                                <span>Holding <span className="text-slate-300 font-black tabular-nums"><CountUp end={percentageOfTotal} decimals={1} suffix="%" /></span> of total votes</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 px-6 py-4 md:px-8 md:py-6 rounded-2xl border border-white/10 text-center w-full md:w-auto md:min-w-[200px] shadow-xl flex flex-row md:flex-col justify-between md:justify-center items-center backdrop-blur-md">
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-0 md:mb-2">Total Votes</p>
                        <p className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums drop-shadow-md" style={{ color: leaderColor }}>
                            <CountUp end={totalLeaderVotes} />
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div ref={chartRef} className="h-[250px] md:h-[320px] w-full pb-4 hidden md:block">
                        <h3 className="text-slate-100 font-black mb-6 text-sm uppercase tracking-widest flex items-center gap-3 border-b border-white/10 pb-3">
                            <span className="w-8 h-[4px] bg-slate-400 rounded-full"></span> Department Votes
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart key={chartVisible ? 'visible' : 'hidden'} data={breakdownData} layout="vertical" margin={{ left: 0, right: 40, bottom: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={70} tick={{ fill: '#f1f5f9', fontSize: 13, fontWeight: 900 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={false} content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
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
                                <Bar dataKey="votes" radius={6} barSize={28} background={{ fill: 'rgba(30, 41, 59, 0.4)', radius: 6 }} isAnimationActive={true} animationDuration={1000}>
                                    {breakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={leaderColor} />)}
                                    <LabelList dataKey="votes" content={<CustomBarLabel />} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
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
};