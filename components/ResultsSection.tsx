import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Vote, Candidate } from '../types';
import { COLORS, CANDIDATE_LIST } from '../constants';

interface ResultsSectionProps {
  votes: Vote[];
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ votes }) => {
  const totalVotes = votes.length;

  // Process data
  const data = CANDIDATE_LIST.map(candidate => {
    const candidateVotes = votes.filter(v => v.candidate === candidate);
    return {
      name: candidate,
      value: candidateVotes.length,
      voters: candidateVotes.map(v => v.voterName).join(", ")
    };
  });

  // Custom label render
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }: any) => {
    if (percent === 0) return null;
    const RADIAN = Math.PI / 180;
    // Position the label outside
    const radius = outerRadius * 1.15; 
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
        style={{ 
            fontSize: '14px', 
            fontWeight: '700', 
            fill: '#f8fafc', 
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.9))' 
        }}
      >
        {`${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* List Column */}
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-teal-400 mb-8 flex items-center gap-3 border-b border-slate-700 pb-4">
          📊 Voting Results
        </h2>
        <div className="space-y-5">
          {data.map((item) => {
            const percentage = totalVotes > 0 ? ((item.value / totalVotes) * 100).toFixed(1) : "0.0";
            return (
              <div key={item.name} className="group bg-slate-900 p-5 rounded-xl border border-slate-600 hover:border-teal-500/50 transition-all duration-300 relative overflow-hidden shadow-md hover:shadow-lg">
                {/* Background bar for visual weight */}
                 <div 
                    className="absolute top-0 bottom-0 left-0 opacity-[0.15] transition-all duration-500 group-hover:opacity-[0.25]"
                    style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: COLORS[item.name as Candidate] 
                    }}
                />
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                             <div className="w-1.5 h-10 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: COLORS[item.name as Candidate] }}></div>
                             <h3 className="text-white font-bold text-lg md:text-xl tracking-tight leading-snug">{item.name}</h3>
                        </div>
                        <div className="flex items-center gap-3 pl-4">
                            <span className={`text-4xl font-black tracking-tighter tabular-nums ${item.value > 0 ? 'text-white' : 'text-slate-600'}`}>
                            {item.value}
                            </span>
                            <div className="text-xs font-bold text-slate-300 bg-slate-800 border border-slate-600 rounded px-2 py-1 min-w-[50px] text-center shadow-sm">
                                {percentage}%
                            </div>
                        </div>
                    </div>
                    
                    {item.value > 0 && (
                        <div className="mt-2 pt-3 border-t border-slate-700/50">
                            <span className="text-slate-400 uppercase text-[10px] tracking-widest block mb-2 font-bold flex items-center gap-2">
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Recorded Voters
                            </span> 
                            <p className="text-slate-200 text-sm leading-relaxed font-normal">
                                {item.voters}
                            </p>
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Column */}
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8 shadow-xl flex flex-col">
        <h2 className="text-2xl font-bold text-teal-400 mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
          📈 Vote Distribution
        </h2>
        <div className="flex-1 min-h-[400px] flex items-center justify-center relative -ml-4">
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie
                data={data.filter(d => d.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={170} 
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                label={renderCustomizedLabel}
                labelLine={true}
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
                contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderColor: '#475569', 
                    borderRadius: '8px', 
                    color: '#fff',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
                itemStyle={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '24px', fontSize: '14px', fontWeight: 500, color: '#cbd5e1' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};