
import React, { useState, useEffect } from 'react';
import { Vote, Candidate } from './types';
import { CANDIDATE_LIST } from './constants';
import { StatsCards } from './components/StatsCards';
import { ResultsSection } from './components/ResultsSection';
import { DepartmentDetailedStats } from './components/DepartmentDetailedStats';
import { LeadingCandidateStats } from './components/LeadingCandidateStats';
import { VoterGrid } from './components/VoterGrid';
import { VoteModal } from './components/VoteModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Scale, Plus, Gavel, ExternalLink, Loader2, Lock, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingVote, setEditingVote] = useState<Vote | null>(null);

  // Fetch votes from Supabase on load
  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Ensure timestamp is treated as a number (Supabase int8 might come as string sometimes)
        const parsedVotes: Vote[] = data.map((v: any) => ({
            ...v,
            timestamp: Number(v.timestamp)
        }));
        setVotes(parsedVotes);
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
      alert('Error connecting to database. Check console details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVote = async (voteData: Omit<Vote, 'id' | 'timestamp'>, id?: string) => {
    try {
      if (id) {
        // Edit existing
        const { error } = await supabase
          .from('votes')
          .update({
            voterName: voteData.voterName,
            department: voteData.department,
            candidate: voteData.candidate
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        // Add new
        const { error } = await supabase
          .from('votes')
          .insert([{
            voterName: voteData.voterName,
            department: voteData.department,
            candidate: voteData.candidate,
            timestamp: Date.now()
          }]);

        if (error) throw error;
      }
      // Refresh list
      fetchVotes();
    } catch (error) {
      console.error('Error saving vote:', error);
      alert('Failed to save vote.');
    }
  };

  const handleDeleteVote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Optimistic update
      setVotes(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting vote:', error);
      alert('Failed to delete vote.');
    }
  };

  const openAddModal = () => {
    if (!isAdmin) return;
    setEditingVote(null);
    setIsVoteModalOpen(true);
  };

  const openEditModal = (vote: Vote) => {
    if (!isAdmin) return;
    setEditingVote(vote);
    setIsVoteModalOpen(true);
  };

  // Derived Stats
  const totalVotes = votes.length;
  const abstentions = votes.filter(v => v.candidate === Candidate.ABSTAINED).length;
  const validVotes = totalVotes - abstentions;
  const candidateCount = CANDIDATE_LIST.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-teal-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-slate-300 font-medium">Loading election data...</p>
      </div>
    );
  }

  return (
    // Changed background to a slightly lighter slate 900 base for better contrast with cards
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 text-slate-200 font-sans flex flex-col">
      <div className="max-w-7xl mx-auto space-y-10 w-full flex-grow">
        
        {/* Header */}
        <div className="relative overflow-hidden bg-slate-800 border border-slate-600 rounded-2xl p-8 text-center shadow-2xl ring-1 ring-white/5">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 opacity-90"></div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-4 drop-shadow-lg">
            <Scale className="w-10 h-10 md:w-12 md:h-12 text-teal-400" />
            Chief Justice Election
            <Gavel className="w-10 h-10 md:w-12 md:h-12 text-blue-500 transform -scale-x-100" />
          </h1>
        </div>

        {/* Stats Row */}
        <StatsCards 
          totalVotes={totalVotes}
          validVotes={validVotes}
          abstentions={abstentions}
          candidateCount={candidateCount}
        />

        {/* Visualizations Row 1 */}
        <ResultsSection votes={votes} />

        {/* Leading Candidate Breakdown */}
        <LeadingCandidateStats votes={votes} />

        {/* New Detailed Department Breakdown */}
        <DepartmentDetailedStats votes={votes} />

        {/* Voters Grid */}
        <VoterGrid votes={votes} onEdit={openEditModal} isAdmin={isAdmin} />

        {/* Discord Link - Only Visible to Admin */}
        {isAdmin && (
          <div className="flex justify-center pt-8 border-t border-slate-800">
              <a 
                  href="https://discord.com/channels/85441497989664768/1032678228512493619/1452750119471681699"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#5865F2]/25 hover:-translate-y-1 border border-[#5865F2]/50"
              >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Latest Updates on Discord</span>
              </a>
          </div>
        )}
      </div>

      {/* Footer / Admin Login */}
      <footer className="mt-20 py-6 border-t border-slate-800 text-center">
        {isAdmin ? (
             <button 
                onClick={() => setIsAdmin(false)}
                className="text-slate-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors"
             >
                <LogOut className="w-4 h-4" />
                Logout Admin
             </button>
        ) : (
            <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-slate-600 hover:text-teal-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors"
             >
                <Lock className="w-3 h-3" />
                Administration
             </button>
        )}
      </footer>

      {/* Floating Action Button - Only Visible to Admin */}
      {isAdmin && (
        <button 
            onClick={openAddModal}
            className="fixed bottom-8 right-8 bg-teal-500 hover:bg-teal-400 text-slate-950 p-4 rounded-full shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center z-40 group border-4 border-slate-900"
            title="Record New Vote"
        >
            <Plus className="w-8 h-8 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}

      {/* Vote Modal */}
      <VoteModal 
        isOpen={isVoteModalOpen} 
        onClose={() => setIsVoteModalOpen(false)}
        onSave={handleSaveVote}
        onDelete={handleDeleteVote}
        editingVote={editingVote}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => setIsAdmin(true)}
      />
    </div>
  );
};

export default App;
