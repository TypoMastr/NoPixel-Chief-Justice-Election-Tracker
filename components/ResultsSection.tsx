import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Vote, Candidate } from '../types';
import { COLORS, ACTIVE_CANDIDATES } from '../constants';

interface ResultsSectionProps {
  votes: Vote[];
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ votes }) => {
  const abstainedVotes = votes.filter(v => v.candidate === Candidate.ABSTAINED).length;
  const totalVotes = votes.length;

  // Process data for ACTIVE candidates only
  const data = ACTIVE_CANDIDATES.map(candidate => {
    const candidateVotes = votes.filter(v => v.candidate === candidate);
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
        className="text-[10px] md:text-xs font-bold"
        style={{ 
            fontWeight: '700', 
            fill: '#f8fafc', 
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.9))' 
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
      {/* List Column */}
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-4 md:p-8 shadow-xl order-2 lg:order-1">
        <h2 className="text-lg md:text-2xl font-bold text-teal-400 mb-4 md:mb-8 flex items-center gap-3 border-b border-slate-700 pb-4">
          📊 Candidate Results
        </h2>
        {/* Grid-cols-2 on mobile for side-by-side cards */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-5">
          {data.map((item) => {
            // Percent of TOTAL votes (including abstentions)
            const percentage = totalVotes > 0 ? ((item.value / totalVotes) * 100).toFixed(1) : "0.0";
            return (
              <div key={item.name} className="group bg-slate-900 p-3 md:p-5 rounded-xl border border-slate-600 hover:border-teal-500/50 transition-all duration-300 relative overflow-hidden shadow-md hover:shadow-lg">
                {/* Background bar */}
                 <div 
                    className="absolute top-0 bottom-0 left-0 opacity-[0.15] transition-all duration-500 group-hover:opacity-[0.25]"
                    style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: COLORS[item.name as Candidate] 
                    }}
                />
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-0 md:mb-4 gap-2 md:gap-0">
                        <div className="flex items-center gap-2 md:gap-4">
                             <div className="w-1 h-6 md:w-1.5 md:h-10 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] flex-shrink-0" style={{ backgroundColor: COLORS[item.name as Candidate] }}></div>
                             <h3 className="text-white font-bold text-xs md:text-xl tracking-tight leading-snug pr-2 whitespace-normal break-words">{item.name}</h3>
                        </div>
                        <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-3 pl-3 md:pl-0 self-end md:self-auto">
                            <span className={`text-2xl md:text-4xl font-black tracking-tighter tabular-nums ${item.value > 0 ? 'text-white' : 'text-slate-600'}`}>
                            {item.value}
                            </span>
                            <div className="text-[10px] md:text-xs font-bold text-slate-300 bg-slate-800 border border-slate-600 rounded px-1.5 py-0.5 md:px-2 md:py-1 min-w-[40px] md:min-w-[50px] text-center shadow-sm">
                                {percentage}%
                            </div>
                        </div>
                    </div>
                    
                    {item.value > 0 && (
                        <div className="mt-2 pt-2 md:pt-3 border-t border-slate-700/50 hidden md:block">
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
            );
          })}
        </div>
        
        {/* Abstained Small Summary */}
        <div className="mt-4 p-3 bg-slate-800 border border-slate-700 rounded-lg flex justify-between items-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Abstained</span>
            <span className="text-slate-200 font-mono font-bold">{abstainedVotes}</span>
        </div>
      </div>

      {/* Chart Column */}
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-4 md:p-8 shadow-xl flex flex-col order-1 lg:order-2">
        <h2 className="text-lg md:text-2xl font-bold text-teal-400 mb-2 md:mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
          📈 Distribution
        </h2>
        <div className="flex-1 min-h-[250px] md:min-h-[400px] flex items-center justify-center relative -ml-4">
          <ResponsiveContainer width="100%" height="100%" className="!h-[250px] md:!h-[450px]">
            <PieChart>
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
                wrapperStyle={{ paddingTop: '10px', fontSize: '10px', fontWeight: 500, color: '#cbd5e1' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};