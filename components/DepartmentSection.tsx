import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Vote, Department, Candidate } from '../types';
import { DEPARTMENT_LIST, COLORS } from '../constants';
import { ScrollReveal } from './ScrollReveal';
import { AnimatedBar } from './AnimatedBar';
import { CountUp } from './CountUp';

interface DepartmentSectionProps {
  votes: Vote[];
}

export const DepartmentSection: React.FC<DepartmentSectionProps> = ({ votes }) => {
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
  
  const data = DEPARTMENT_LIST.map(dept => {
    const deptVotes = votes.filter(v => v.department === dept);
    // Group votes within department by candidate
    const breakdown = deptVotes.reduce((acc, vote) => {
      acc[vote.candidate] = (acc[vote.candidate] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      name: dept,
      count: deptVotes.length,
      breakdown
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
      {/* Bar Chart */}
      <ScrollReveal>
        <div ref={chartRef} className="glass-panel rounded-2xl p-5 md:p-8 shadow-xl h-full">
          <h2 className="text-xl md:text-2xl font-bold text-teal-400 mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
            🏢 Votes by Department
          </h2>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                key={chartVisible ? 'visible' : 'hidden'} // Force animation replay on scroll
                data={data} 
                margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#cbd5e1" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontWeight: 'bold', fontSize: 12 }} 
                />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.4}}
                  isAnimationActive={false}
                  offset={20}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar 
                    dataKey="count" 
                    fill="#14b8a6" 
                    radius={6} 
                    barSize={30}
                    isAnimationActive={true}
                    animationDuration={800} // Speed up
                    animationEasing="ease-out"
                >
                  <LabelList 
                    dataKey="count" 
                    position="top" 
                    fill="#f1f5f9" 
                    fontWeight="bold" 
                    fontSize={12} 
                  />
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#14b8a6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ScrollReveal>

      {/* Details List */}
      <div className="glass-panel rounded-2xl p-5 md:p-8 shadow-xl flex flex-col justify-between h-full">
        <ScrollReveal>
            <h2 className="text-xl md:text-2xl font-bold text-teal-400 mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
            📋 Department Details
            </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((dept, idx) => (
            <ScrollReveal key={dept.name} delay={idx * 50}>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-teal-500/30 transition-colors shadow-sm h-full">
                {/* Progress bar background using AnimatedBar */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-800">
                    <AnimatedBar 
                        targetWidth={`${Math.min(dept.count * 5, 100)}%`} 
                        backgroundColor="#14b8a6" 
                        className="h-full"
                        delay={200 + (idx * 50)}
                    />
                </div>

                <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-black text-xl tracking-tight">{dept.name}</span>
                    <span className="text-slate-200 font-bold bg-slate-800 px-3 py-1 rounded-md text-sm border border-slate-600 shadow-sm">
                        <CountUp end={dept.count} />
                    </span>
                </div>
                
                <div className="space-y-2 mb-2">
                    {Object.entries(dept.breakdown).map(([candidate, count]) => (
                        <div key={candidate} className="flex justify-between text-xs items-center border-b border-slate-800 pb-1.5 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2 truncate max-w-[80%]">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: COLORS[candidate as Candidate] }}></div>
                                <span className="text-slate-300 font-medium truncate">{candidate}</span>
                            </div>
                            <span className="text-white font-bold font-mono">
                                <CountUp end={count} />
                            </span>
                        </div>
                    ))}
                    {dept.count === 0 && <span className="text-slate-500 text-xs italic">No votes yet</span>}
                </div>
                </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};