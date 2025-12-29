import React, { useState, useEffect } from 'react';
import { Vote, Candidate } from './types';
import { CANDIDATE_LIST, ACTIVE_CANDIDATES } from './constants';
import { StatsCards } from './components/StatsCards';
import { ResultsSection } from './components/ResultsSection';
import { DepartmentDetailedStats } from './components/DepartmentDetailedStats';
import { LeadingCandidateStats } from './components/LeadingCandidateStats';
import { VoterGrid } from './components/VoterGrid';
import { NominationsList } from './components/NominationsList';
import { VoteModal } from './components/VoteModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ReportModal } from './components/ReportModal';
import { Scale, Plus, Gavel, Loader2, Lock, LogOut, FileText } from 'lucide-react';
import { supabase } from './supabaseClient';
import { ScrollReveal } from './components/ScrollReveal';
import { ParallaxBackground } from './components/ParallaxBackground';
import { useToast } from './components/ToastProvider';
import { CountdownTimer } from './components/CountdownTimer';
import { VoteTimeline } from './components/VoteTimeline';

const App: React.FC = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  
  // Election Status State (Controlled by CountdownTimer)
  const [isElectionClosed, setIsElectionClosed] = useState(false);
  
  // Modal States
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState('');
  
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
        const parsedVotes: Vote[] = data.map((v: any) => ({
            ...v,
            timestamp: Number(v.timestamp)
        }));
        setVotes(parsedVotes);
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
      showToast('Error connecting to database', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (votes.length === 0) {
      showToast('No votes to generate report.', 'info');
      return;
    }

    const candidates = Array.from(new Set(votes.map(v => v.candidate))).sort();
    const activeCandidates = candidates.filter(c => c !== Candidate.ABSTAINED);
    const abstainedVotes = votes.filter(v => v.candidate === Candidate.ABSTAINED);

    const isoTimestamp = new Date().toISOString();

    let report = `ELECTION REPORT: CHIEF JUSTICE\n`;
    report += `REPORT TIMESTAMP (UTC/ISO 8601): ${isoTimestamp}\n`;
    report += `-----------------------------------------\n\n`;
    
    report += `SUMMARY\n`;
    activeCandidates.forEach(cand => {
      const count = votes.filter(v => v.candidate === cand).length;
      report += `- ${cand}: ${count} votes\n`;
    });
    report += `- Abstentions: ${abstainedVotes.length}\n`;
    report += `- Total Turnout: ${votes.length}\n\n`;

    report += `-----------------------------------------\n\n`;
    report += `DETAILED VOTER LIST\n\n`;

    activeCandidates.forEach(cand => {
      const candVotes = votes.filter(v => v.candidate === cand);
      if (candVotes.length > 0) {
        report += `${(cand as string).toUpperCase()} (${candVotes.length})\n`;
        
        const deptsInCand = Array.from(new Set(candVotes.map(v => v.department))).sort();
        deptsInCand.forEach(dept => {
          const deptVoters = candVotes
            .filter(v => v.department === dept)
            .sort((a, b) => a.voterName.localeCompare(b.voterName));
          
          const namesLine = deptVoters.map(v => v.voterName).join(' / ');
          report += `${dept} (${deptVoters.length}): ${namesLine}\n`;
        });
        report += `\n`;
      }
    });

    if (abstainedVotes.length > 0) {
      report += `ABSTENTIONS (${abstainedVotes.length})\n`;
      const deptsInAbstain = Array.from(new Set(abstainedVotes.map(v => v.department))).sort();
      deptsInAbstain.forEach(dept => {
        const deptVoters = abstainedVotes
          .filter(v => v.department === dept)
          .sort((a, b) => a.voterName.localeCompare(b.voterName));
        
        const namesLine = deptVoters.map(v => v.voterName).join(' / ');
        report += `${dept} (${deptVoters.length}): ${namesLine}\n`;
      });
    }

    const finalReportText = report.trim();
    setCurrentReport(finalReportText);
    
    // Auto-copy to clipboard
    navigator.clipboard.writeText(finalReportText).then(() => {
      showToast('Report copied to clipboard', 'success');
    }).catch(err => {
      console.error('Failed to copy report:', err);
    });

    // Open Modal
    setIsReportModalOpen(true);
  };

  const handleSaveVote = async (voteData: Omit<Vote, 'id' | 'timestamp'>, id?: string) => {
    try {
      if (id) {
        const { error } = await supabase
          .from('votes')
          .update({
            voterName: voteData.voterName,
            department: voteData.department,
            candidate: voteData.candidate
          })
          .eq('id', id);

        if (error) throw error;
        showToast('Vote updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('votes')
          .insert([{
            voterName: voteData.voterName,
            department: voteData.department,
            candidate: voteData.candidate,
            timestamp: Date.now()
          }]);

        if (error) throw error;
        showToast('New vote recorded successfully', 'success');
      }
      fetchVotes();
    } catch (error) {
      console.error('Error saving vote:', error);
      showToast('Failed to save vote', 'error');
    }
  };

  const handleDeleteVote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVotes(prev => prev.filter(v => v.id !== id));
      showToast('Vote deleted permanently', 'success');
    } catch (error) {
      console.error('Error deleting vote:', error);
      showToast('Failed to delete vote', 'error');
    }
  };

  const handleLogin = () => {
    setIsAdmin(true);
    showToast('Admin access granted', 'success');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    showToast('Admin logged out', 'info');
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

  const totalVotes = votes.length;
  const abstentions = votes.filter(v => v.candidate === Candidate.ABSTAINED).length;
  const validVotes = totalVotes - abstentions;
  const candidateCount = ACTIVE_CANDIDATES.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-teal-500">
        <ParallaxBackground />
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-slate-300 font-medium">Loading election data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 md:p-8 text-slate-200 font-sans flex flex-col relative overflow-x-hidden">
      <ParallaxBackground />
      
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 w-full flex-grow pb-12 md:pb-0 z-10">
        
        {/* Header */}
        <ScrollReveal>
            <div className="relative mb-4 md:mb-6 mt-2 md:mt-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="relative overflow-hidden glass-panel rounded-2xl p-4 md:p-6 text-center shadow-2xl ring-1 ring-white/10 group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-70 shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
                    
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-center relative z-10 gap-3 md:gap-8">
                              <div className="flex items-center justify-center">
                                  <Scale className="w-6 h-6 md:w-10 md:h-10 text-slate-200" />
                              </div>

                              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 text-center">
                                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tighter drop-shadow-xl leading-tight py-2">
                                      CHIEF JUSTICE
                                  </h1>
                                  
                                  <span className="hidden md:block w-2 h-2 rounded-full bg-slate-200/80 shadow-[0_0_10px_rgba(255,255,255,0.3)]"></span>

                                  <h2 className="text-xs md:text-2xl font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-md pb-1">
                                      Election Results
                                  </h2>
                              </div>

                              <div className="flex items-center justify-center">
                                  <Gavel className="w-6 h-6 md:w-10 md:h-10 text-slate-200 scale-x-[-1]" />
                              </div>
                      </div>

                      {/* Public Global Action: Generate Text Report */}
                      <div className="flex justify-center">
                        <button
                          onClick={handleGenerateReport}
                          className="flex items-center gap-3 px-6 py-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:shadow-[0_0_25px_rgba(20,184,166,0.2)] active:scale-95 group"
                        >
                          <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em]">View & Copy Report</span>
                        </button>
                      </div>
                    </div>
                </div>
            </div>
        </ScrollReveal>

        {/* Countdown Timer with Callback to toggle Timeline */}
        <CountdownTimer onStatusChange={setIsElectionClosed} />

        {/* Stats Row */}
        <StatsCards 
          totalVotes={totalVotes}
          validVotes={validVotes}
          abstentions={abstentions}
          candidateCount={candidateCount}
        />

        {/* Visualizations Row 1 */}
        <ResultsSection votes={votes} />

        {/* Timeline Chart - Only shows when election is closed */}
        {isElectionClosed && (
            <VoteTimeline votes={votes} />
        )}

        {/* Leading Candidate Breakdown */}
        <LeadingCandidateStats votes={votes} />

        {/* New Detailed Department Breakdown */}
        <DepartmentDetailedStats votes={votes} />

        {/* Voters Grid */}
        <VoterGrid votes={votes} onEdit={openEditModal} isAdmin={isAdmin} />
        
        {/* Nominations List */}
        <NominationsList />

      </div>

      <footer className="mt-4 md:mt-8 py-4 border-t border-slate-800/50 text-center mb-16 md:mb-0 z-10">
        {isAdmin ? (
             <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors p-4"
             >
                <LogOut className="w-4 h-4" />
                Logout Admin
             </button>
        ) : (
            <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-slate-600 hover:text-teal-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors p-4"
             >
                <Lock className="w-3 h-3" />
                Administration
             </button>
        )}
      </footer>

      {isAdmin && (
        <button 
            onClick={openAddModal}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-teal-500 hover:bg-teal-400 text-slate-950 p-4 rounded-full shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center z-40 group border-4 border-slate-900 animate-fade-in-up"
            title="Record New Vote"
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
             <span className="absolute inset-0 rounded-full animate-ping bg-teal-500 opacity-20"></span>
            <Plus className="w-6 h-6 md:w-8 md:h-8 stroke-[3] group-hover:rotate-90 transition-transform duration-300 relative z-10" />
        </button>
      )}

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

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportText={currentReport}
      />
    </div>
  );
};

export default App;