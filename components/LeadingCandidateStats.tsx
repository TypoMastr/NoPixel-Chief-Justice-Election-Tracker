import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Vote, Candidate } from '../types';
import { COLORS, DEPARTMENT_LIST } from '../constants';

interface LeadingCandidateStatsProps {
  votes: Vote[];
}

export const LeadingCandidateStats: React.FC<LeadingCandidateStatsProps> = ({ votes }) => {
  if (votes.length === 0) return null;

  // 1. Find the leader
  const candidateCounts = votes.reduce((acc, vote) => {
    acc[vote.candidate] = (acc[vote.candidate] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let leader = "";
  let maxVotes = -1;

  Object.entries(candidateCounts).forEach(([cand, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      leader = cand;
    }
  });

  if (!leader) return null;

  // 2. Prepare data for the leader
  const leaderVotes = votes.filter(v => v.candidate === leader);
  const totalLeaderVotes = leaderVotes.length;
  const percentageOfTotal = ((totalLeaderVotes / votes.length) * 100).toFixed(1);

  const breakdownData = DEPARTMENT_LIST.map(dept => {
    const leaderCountInDept = leaderVotes.filter(v => v.department === dept).length;
    const totalVotesInDept = votes.filter(v => v.department === dept).length;
    
    // Calculate domination percentage: (Votes for Leader in Dept / Total Votes in Dept)
    const dominationPercent = totalVotesInDept > 0 
        ? ((leaderCountInDept / totalVotesInDept) * 100).toFixed(1) 
        : "0.0";
    
    return {
      name: dept,
      votes: leaderCountInDept,
      totalDept: totalVotesInDept,
      percent: dominationPercent
    };
  });

  const leaderColor = COLORS[leader as Candidate] || '#cbd5e1';

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8 shadow-2xl mb-8 relative overflow-hidden ring-1 ring-white/10">
        {/* Glow behind the card */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-white to-transparent opacity-[0.05] rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <div className="relative z-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6 border-b border-slate-700 pb-6">
                <div className="flex items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(234,179,8,0.2)]">Current Leader</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md flex items-center gap-4">
                            {leader === Candidate.BRITTANY_ANGEL && (
                                <img 
                                    src="https://cdn.7tv.app/emote/01KCA38N23VMWVX2GCTXZ46YDK/4x.webp" 
                                    alt="Brittany Angel" 
                                    className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]" 
                                />
                            )}
                            {leader}
                        </h1>
                         <span className="text-lg font-medium text-slate-300 mt-2 block flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            </span>
                            Dominating with <span className="text-white font-bold text-xl">{percentageOfTotal}%</span> of total votes
                        </span>
                    </div>
                </div>

                <div className="bg-slate-900 px-8 py-5 rounded-xl border border-slate-600 text-center min-w-[180px] shadow-inner">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Support</p>
                    <p className="text-5xl font-black tracking-tighter drop-shadow-md" style={{ color: leaderColor }}>{totalLeaderVotes}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Chart */}
                <div className="h-[320px] w-full pb-4">
                    <h3 className="text-slate-200 font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-3 border-b border-slate-700/50 pb-2">
                        <span className="w-6 h-[3px] bg-slate-400 rounded-full"></span> Department Votes
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={breakdownData} layout="vertical" margin={{ left: 0, right: 30, bottom: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={60} 
                                tick={{ fill: '#cbd5e1', fontSize: 14, fontWeight: 700 }} 
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip 
                                cursor={{fill: '#334155', opacity: 0.4}}
                                contentStyle={{ 
                                    backgroundColor: '#0f172a', 
                                    borderColor: '#475569', 
                                    color: '#fff', 
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                }}
                                formatter={(value: number) => [`${value} votes for ${leader}`]}
                            />
                            <Bar dataKey="votes" fill={leaderColor} radius={[0, 4, 4, 0]} barSize={36} background={{ fill: '#1e293b' }}>
                                <LabelList dataKey="votes" position="right" fill="#fff" fontSize={15} fontWeight="bold" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick Stats Grid */}
                 <div>
                    <h3 className="text-slate-200 font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-3 border-b border-slate-700/50 pb-2">
                        <span className="w-6 h-[3px] bg-slate-400 rounded-full"></span> % of Department Vote
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-start">
                        {breakdownData.map(d => (
                            <div key={d.name} className="flex flex-col p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 transition-all duration-200 group relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-1 bg-slate-700 w-full">
                                    <div className="h-full bg-white transition-all duration-1000" style={{ width: `${d.percent}%`, backgroundColor: leaderColor }}></div>
                                </div>
                                
                                <div className="flex justify-between items-center mb-2 mt-2">
                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{d.name}</span>
                                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${Number(d.percent) > 50 ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                        {d.percent}%
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black text-white font-mono tracking-tight">{d.votes}</span>
                                    <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">of {d.totalDept} votes</span>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};