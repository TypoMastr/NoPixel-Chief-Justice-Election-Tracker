import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Vote, Department, Candidate } from '../types';
import { DEPARTMENT_LIST, COLORS } from '../constants';

interface DepartmentSectionProps {
  votes: Vote[];
}

export const DepartmentSection: React.FC<DepartmentSectionProps> = ({ votes }) => {
  
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Bar Chart */}
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-teal-400 mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
          🏢 Votes by Department
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#cbd5e1" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontWeight: 'bold', fontSize: 13 }} 
              />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{fill: '#334155', opacity: 0.4}}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#fff' }}
              />
              <Bar dataKey="count" fill="#14b8a6" radius={[6, 6, 0, 0]} barSize={50}>
                <LabelList dataKey="count" position="top" fill="#f1f5f9" fontWeight="bold" fontSize={14} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Details List */}
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8 shadow-lg flex flex-col justify-between">
        <h2 className="text-2xl font-bold text-teal-400 mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
          📋 Department Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((dept) => (
            <div key={dept.name} className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:border-slate-500 transition-colors shadow-sm">
               {/* Progress bar background for visual flair */}
               <div className="absolute bottom-0 left-0 h-1.5 bg-slate-800 w-full">
                  <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${Math.min(dept.count * 5, 100)}%` }}></div>
               </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-black text-xl tracking-tight">{dept.name}</span>
                <span className="text-slate-200 font-bold bg-slate-800 px-3 py-1 rounded-md text-sm border border-slate-600 shadow-sm">
                    {dept.count}
                </span>
              </div>
              
              <div className="space-y-2">
                  {Object.entries(dept.breakdown).map(([candidate, count]) => (
                    <div key={candidate} className="flex justify-between text-xs items-center border-b border-slate-800 pb-1.5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 truncate max-w-[80%]">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: COLORS[candidate as Candidate] }}></div>
                            <span className="text-slate-300 font-medium truncate">{candidate}</span>
                        </div>
                        <span className="text-white font-bold font-mono">{count}</span>
                    </div>
                  ))}
                  {dept.count === 0 && <span className="text-slate-500 text-xs italic">No votes yet</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};