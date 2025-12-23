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
import { supabase } from './lib/supabaseClient';
import { Scale, Plus, Gavel, ExternalLink, ShieldCheck, LogOut, Lock, AlertCircle } from 'lucide-react';

const ADMIN_PASS = 'tarantino1994';

const App: React.FC = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [editingVote, setEditingVote] = useState<Vote | null>(null);

  // Initial Data Fetch from Supabase
  useEffect(() => {
    fetchVotes();
    
    // Check session storage for admin persistence during refresh
    const sessionAdmin = sessionStorage.getItem('isAdmin');
    if (sessionAdmin === 'true') setIsAdmin(true);
  }, []);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      if (data) {
        // Normalize data to handle potential case-sensitivity issues from DB (voterName vs votername)
        const normalizedVotes: Vote[] = data.map((row: any) => ({
          id: row.id,
          voterName: row.voterName || row.votername || row.voter_name || 'Unknown',
          department: row.department,
          candidate: row.candidate,
          timestamp: row.timestamp || (row.created_at ? new Date(row.created_at).getTime() : Date.now())
        }));
        setVotes(normalizedVotes);
      }
    } catch (error: any) {
      console.error('Error fetching votes:', error);
      // Ensure we extract a readable message
      const message = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      
      let friendlyMessage = message;
      if (message.includes("relation") && message.includes("does not exist")) {
        friendlyMessage = "Table 'votes' not found. Please create the table in Supabase.";
      } else if (message.includes("Failed to fetch")) {
        friendlyMessage = "Connection failed. Check your Supabase URL and internet connection.";
      }
      
      setErrorMsg(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASS) {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      setIsLoginModalOpen(false);
    } else {
      alert("Incorrect Password");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  };

  const handleSaveVote = async (voteData: Omit<Vote, 'id' | 'timestamp'>, id?: string) => {
    try {
      const payload = {
        voterName: voteData.voterName, // Ensure these match your DB column names (or use snake_case if your DB uses it)
        department: voteData.department,
        candidate: voteData.candidate
      };

      if (id) {
        // Edit existing in Supabase
        const { error } = await supabase
          .from('votes')
          .update(payload)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Add new to Supabase
        const { error } = await supabase
          .from('votes')
          .insert([{
            ...payload,
            timestamp: Date.now()
          }]);

        if (error) throw error;
      }
      // Refresh local state
      fetchVotes();
    } catch (error: any) {
      console.error('Error saving vote:', error);
      const message = error?.message || "Unknown error";
      alert(`Failed to save vote: ${message}`);
    }
  };

  const handleDeleteVote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchVotes();
    } catch (error: any) {
      console.error('Error deleting vote:', error);
      alert(`Failed to delete vote: ${error?.message || "Unknown error"}`);
    }
  };

  const openAddModal = () => {
    setEditingVote(null);
    setIsVoteModalOpen(true);
  };

  const openEditModal = (vote: Vote) => {
    setEditingVote(vote);
    setIsVoteModalOpen(true);
  };

  // Derived Stats
  const totalVotes = votes.length;
  const abstentions = votes.filter(v => v.candidate === Candidate.ABSTAINED).length;
  const validVotes = totalVotes - abstentions;
  const candidateCount = CANDIDATE_LIST.length;

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 text-slate-200 font-sans pb-32">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="relative overflow-hidden bg-slate-800 border border-slate-600 rounded-2xl p-8 text-center shadow-2xl ring-1 ring-white/5">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 opacity-90"></div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-4 drop-shadow-lg">
            <Scale className="w-10 h-10 md:w-12 md:h-12 text-teal-400" />
            Chief Justice Election
            <Gavel className="w-10 h-10 md:w-12 md:h-12 text-blue-500 transform -scale-x-100" />
          </h1>
        </div>

        {/* Loading / Error / Content State */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
           </div>
        ) : errorMsg ? (
           <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center animate-in fade-in">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
              <p className="text-red-200 font-mono text-sm break-all max-w-2xl mx-auto">{errorMsg}</p>
              <div className="mt-6 text-slate-400 text-sm">
                  <p className="mb-2">Setup Checklist:</p>
                  <ul className="list-disc list-inside text-left max-w-md mx-auto space-y-1">
                      <li>Check <strong>VITE_SUPABASE_URL</strong> in environment variables.</li>
                      <li>Check <strong>VITE_SUPABASE_ANON_KEY</strong> in environment variables.</li>
                      <li>Ensure table <strong>votes</strong> exists with columns: <code>id, voterName, department, candidate, timestamp</code>.</li>
                  </ul>
              </div>
           </div>
        ) : (
          <>
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
          </>
        )}

        {/* Footer Administration Section */}
        <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-800 gap-6">
            {!isAdmin ? (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                  <Lock className="w-4 h-4" />
                  Admin Login
                </button>
            ) : (
              <div className="w-full max-w-2xl bg-slate-800/50 border border-teal-500/30 rounded-2xl p-6 flex flex-col items-center gap-6 animate-in slide-in-from-bottom-5">
                <div className="flex items-center gap-2 text-teal-400 font-bold uppercase tracking-widest text-xs mb-2">
                   <ShieldCheck className="w-4 h-4" />
                   Administrator Mode Active
                </div>

                <a 
                    href="https://discord.com/channels/85441497989664768/1032678228512493619/1452750119471681699"
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full md:w-auto justify-center items-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#5865F2]/25 hover:-translate-y-1 border border-[#5865F2]/50"
                >
                    <ExternalLink className="w-5 h-5" />
                    <span>View Latest Updates on Discord</span>
                </a>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </div>
            )}
        </div>

      </div>

      {/* Floating Action Button - Only for Admin */}
      {isAdmin && (
        <button 
          onClick={openAddModal}
          className="fixed bottom-8 right-8 bg-teal-500 hover:bg-teal-400 text-slate-950 p-4 rounded-full shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center z-40 group border-4 border-slate-900 animate-in zoom-in duration-300"
          title="Record New Vote"
        >
          <Plus className="w-8 h-8 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}

      {/* Modals */}
      <VoteModal 
        isOpen={isVoteModalOpen} 
        onClose={() => setIsVoteModalOpen(false)}
        onSave={handleSaveVote}
        onDelete={handleDeleteVote}
        editingVote={editingVote}
      />

      <AdminLoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;