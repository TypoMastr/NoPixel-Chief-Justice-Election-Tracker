import React, { useState, useEffect } from 'react';
import { Vote, Candidate, Department } from '../types';
import { CANDIDATE_LIST, DEPARTMENT_LIST } from '../constants';
import { X, Trash2 } from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voteData: Omit<Vote, 'id' | 'timestamp'>, id?: string) => void;
  onDelete: (id: string) => void;
  editingVote: Vote | null;
}

export const VoteModal: React.FC<VoteModalProps> = ({ isOpen, onClose, onSave, onDelete, editingVote }) => {
  const [name, setName] = useState('');
  const [dept, setDept] = useState<Department>(Department.BSCO);
  const [candidate, setCandidate] = useState<Candidate>(Candidate.BRITTANY_ANGEL);

  useEffect(() => {
    if (editingVote) {
      setName(editingVote.voterName);
      setDept(editingVote.department);
      setCandidate(editingVote.candidate);
    } else {
      setName('');
      setDept(Department.BSCO);
      setCandidate(Candidate.BRITTANY_ANGEL);
    }
  }, [editingVote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      voterName: name,
      department: dept,
      candidate: candidate
    }, editingVote?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">
            {editingVote ? 'Edit Vote' : 'Record New Vote'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Voter Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Department</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value as Department)}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-teal-500"
            >
              {DEPARTMENT_LIST.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Vote For</label>
            <select
              value={candidate}
              onChange={(e) => setCandidate(e.target.value as Candidate)}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-teal-500"
            >
              {CANDIDATE_LIST.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4 mt-4 border-t border-slate-700">
            {editingVote && (
               <button
               type="button"
               onClick={() => {
                   if(window.confirm('Are you sure you want to delete this vote?')) {
                       onDelete(editingVote.id);
                       onClose();
                   }
               }}
               className="flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded font-semibold transition-colors border border-red-500/20"
             >
               <Trash2 className="w-4 h-4" />
             </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 text-slate-200 rounded hover:bg-slate-600 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 font-semibold transition-colors"
            >
              {editingVote ? 'Update Vote' : 'Submit Vote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};