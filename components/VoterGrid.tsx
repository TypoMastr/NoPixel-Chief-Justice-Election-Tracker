import React from 'react';
import { Vote, Candidate } from '../types';
import { Edit2 } from 'lucide-react';
import { COLORS } from '../constants';

interface VoterGridProps {
  votes: Vote[];
  onEdit: (vote: Vote) => void;
}

export const VoterGrid: React.FC<VoterGridProps> = ({ votes, onEdit }) => {
  // 1. Group votes by Department
  const groupedVotes = votes.reduce((acc, vote) => {
    if (!acc[vote.department]) {
      acc[vote.department] = [];
    }
    acc[vote.department].push(vote);
    return acc;
  }, {} as Record<string, Vote[]>);

  // 2. Sort Departments Alphabetically
  const sortedDepartments = Object.keys(groupedVotes).sort();

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8 shadow-xl mb-20">
      <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-teal-400 flex items-center gap-3">
          👥 All Voters List <span className="text-slate-300 text-sm font-bold bg-slate-700 px-3 py-1 rounded-full border border-slate-600">Total: {votes.length}</span>
        </h2>
      </div>

      <div className="space-y-10">
        {sortedDepartments.map(dept => {
          // 3. Sort voters inside department alphabetically
          const deptVotes = groupedVotes[dept].sort((a, b) => 
            a.voterName.localeCompare(b.voterName)
          );

          return (
            <div key={dept} className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-md">
                <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">{dept}</h3>
                    <div className="h-px bg-slate-700 flex-1"></div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{deptVotes.length} voters</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {deptVotes.map((vote) => (
                    <div 
                        key={vote.id} 
                        onClick={() => onEdit(vote)}
                        className="group relative bg-slate-800 border border-slate-600 p-4 rounded-lg hover:border-teal-500/50 transition-all hover:bg-slate-750 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="flex flex-col gap-3">
                            {/* Name */}
                            <div className="flex justify-between items-start">
                                <h3 className="text-white font-bold text-sm truncate leading-tight group-hover:text-teal-300 transition-colors" title={vote.voterName}>
                                    {vote.voterName}
                                </h3>
                                <Edit2 className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Candidate Pill */}
                            <div className="flex items-center">
                                <div 
                                    className="px-2.5 py-1.5 rounded text-[11px] font-bold truncate w-full text-center border transition-colors shadow-sm"
                                    style={{ 
                                        backgroundColor: `${COLORS[vote.candidate]}15`, // very low opacity
                                        color: COLORS[vote.candidate],
                                        borderColor: `${COLORS[vote.candidate]}40`
                                    }}
                                >
                                    {vote.candidate}
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          );
        })}

        {votes.length === 0 && (
            <div className="text-center py-16 text-slate-500 italic text-lg">
                No votes recorded yet.
            </div>
        )}
      </div>
    </div>
  );
};