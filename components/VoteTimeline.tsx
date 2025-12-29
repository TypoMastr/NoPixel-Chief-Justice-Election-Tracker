import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Vote, Candidate } from '../types';
import { COLORS, ACTIVE_CANDIDATES } from '../constants';
import { Play, Pause, RotateCcw, Vote as VoteIcon, Turtle, Rabbit, Zap, History } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface VoteTimelineProps {
  votes: Vote[];
}

type SpeedOption = {
  label: string;
  duration: number;
  icon: React.ReactNode;
};

// Durations doubled to slow down animation by half
const SPEED_OPTIONS: SpeedOption[] = [
  { label: 'Slow', duration: 40000, icon: <Turtle className="w-3 h-3" /> },
  { label: 'Normal', duration: 20000, icon: <Rabbit className="w-3 h-3" /> },
  { label: 'Fast', duration: 10000, icon: <Zap className="w-3 h-3" /> },
];

// Custom Label Component for Smooth Fade In
const FadeInLabel = (props: any) => {
    const { x, y, width, value } = props;
    const isVisible = value > 0;
    
    return (
        <text
            x={x + width / 2}
            y={y - 10}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="auto"
            style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth fade in
                fontSize: '14px',
                fontWeight: 900,
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))',
                pointerEvents: 'none'
            }}
        >
            {value}
        </text>
    );
};

export const VoteTimeline: React.FC<VoteTimelineProps> = ({ votes }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoteIndex, setCurrentVoteIndex] = useState(0); // This now tracks "Cluster Index" not "Vote Index"
  const [selectedDuration, setSelectedDuration] = useState<number>(20000); // Default to new Normal (20s)
  const [isDesktop, setIsDesktop] = useState(false);
  
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Responsive check for Desktop vs Mobile labels
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);
  
  // Sort votes chronologically
  const sortedVotes = useMemo(() => {
    return [...votes].sort((a, b) => {
        const timeDiff = a.timestamp - b.timestamp;
        if (timeDiff !== 0) return timeDiff;
        
        // Tie-breakers for sorting stability
        // CHANGED: Prioritize Abstained over Brittany in ties so they render/animate slightly earlier in the sequence
        if (a.candidate === Candidate.ABSTAINED && b.candidate !== Candidate.ABSTAINED) return -1;
        if (b.candidate === Candidate.ABSTAINED && a.candidate !== Candidate.ABSTAINED) return 1;

        if (a.candidate === Candidate.BRITTANY_ANGEL && b.candidate !== Candidate.BRITTANY_ANGEL) return -1;
        if (b.candidate === Candidate.BRITTANY_ANGEL && a.candidate !== Candidate.BRITTANY_ANGEL) return 1;
        
        return a.candidate.localeCompare(b.candidate);
    });
  }, [votes]);

  // Group votes into "Simultaneous Clusters" (votes happening within 50ms of each other)
  // This allows multiple bars to grow at the exact same time in the animation.
  const voteClusters = useMemo(() => {
    if (sortedVotes.length === 0) return [];
    
    const clusters: Vote[][] = [];
    let currentCluster: Vote[] = [sortedVotes[0]];
    
    for (let i = 1; i < sortedVotes.length; i++) {
        const prev = sortedVotes[i-1];
        const curr = sortedVotes[i];
        
        // If votes are within 50ms, consider them simultaneous
        if (curr.timestamp - prev.timestamp < 50) {
            currentCluster.push(curr);
        } else {
            clusters.push(currentCluster);
            currentCluster = [curr];
        }
    }
    clusters.push(currentCluster);
    return clusters;
  }, [sortedVotes]);

  // Calculate Fixed Max Domain
  const maxDomainValue = useMemo(() => {
    if (votes.length === 0) return 10;
    const counts: Record<string, number> = {};
    votes.forEach(v => {
        counts[v.candidate] = (counts[v.candidate] || 0) + 1;
    });
    const max = Math.max(...Object.values(counts));
    return max + Math.ceil(max * 0.15); // 15% padding
  }, [votes]);

  // Data Interpolation Logic
  const currentData = useMemo(() => {
    const candidates = [...ACTIVE_CANDIDATES, Candidate.ABSTAINED];
    const counts: Record<string, number> = {};
    
    candidates.forEach(c => counts[c] = 0);

    const totalSteps = voteClusters.length;
    // Cap index at max steps
    const safeIndex = Math.min(currentVoteIndex, totalSteps);
    
    const flooredIndex = Math.floor(safeIndex);
    const fraction = safeIndex - flooredIndex;

    // 1. Add full votes from completed clusters
    for (let i = 0; i < flooredIndex; i++) {
        if (i < totalSteps) {
            voteClusters[i].forEach(vote => {
                 if (counts[vote.candidate] !== undefined) {
                    counts[vote.candidate] += 1;
                 }
            });
        }
    }

    // 2. Add fractional part for the active cluster (animating simultaneous votes together)
    if (flooredIndex < totalSteps && fraction > 0) {
        voteClusters[flooredIndex].forEach(vote => {
            if (counts[vote.candidate] !== undefined) {
                counts[vote.candidate] += fraction;
            }
        });
    }

    // Map and Sort
    const result = candidates.map(candidate => ({
      name: candidate,
      shortName: candidate.split(' ')[0],
      count: counts[candidate], // Float for height
      displayCount: Math.floor(counts[candidate]), // Integer for label
      color: COLORS[candidate as Candidate]
    }));

    return result.sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
    });

  }, [currentVoteIndex, voteClusters]);

  // Animation Loop
  const animate = (time: number) => {
    if (lastTimeRef.current !== 0) {
        const deltaTime = time - lastTimeRef.current;
        // Calculate speed based on number of CLUSTERS, not total votes
        const stepIncrement = (voteClusters.length * deltaTime) / selectedDuration;

        setCurrentVoteIndex(prev => {
            const next = prev + stepIncrement;
            if (next >= voteClusters.length) {
                setIsPlaying(false);
                return voteClusters.length;
            }
            return next;
        });
    }
    
    lastTimeRef.current = time;
    
    if (isPlaying) {
        requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isPlaying) {
        if (currentVoteIndex >= voteClusters.length) {
            setCurrentVoteIndex(0);
        }
        lastTimeRef.current = 0; 
        requestRef.current = requestAnimationFrame(animate);
    } else {
        cancelAnimationFrame(requestRef.current);
        lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, voteClusters.length]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentVoteIndex(val);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!isPlaying && currentVoteIndex >= voteClusters.length) {
        setCurrentVoteIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentVoteIndex(0);
  };

  if (votes.length === 0) return null;

  const progressPercentage = (currentVoteIndex / voteClusters.length) * 100;

  return (
    <ScrollReveal>
        <div className="glass-panel rounded-2xl p-4 md:p-8 shadow-xl mb-8 relative overflow-hidden border border-teal-500/20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-white/5 pb-4">
                <h2 className="text-lg md:text-2xl font-bold text-teal-400 flex items-center gap-3">
                    <History className="w-6 h-6" />
                    Election Timeline
                </h2>
                
                <div className="flex flex-col-reverse md:flex-row items-end md:items-center gap-4 w-full md:w-auto">
                    {/* Speed Selector (Desktop) */}
                    <div className="hidden md:flex items-center bg-slate-950 rounded-lg p-1.5 border border-white/10 shadow-inner gap-1">
                        {SPEED_OPTIONS.map((opt) => (
                            <button
                                key={opt.label}
                                onClick={() => { setSelectedDuration(opt.duration); setIsPlaying(false); }}
                                className={`flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-wider rounded-md transition-all duration-300 ${
                                    selectedDuration === opt.duration 
                                    ? 'bg-teal-400 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-105 border border-teal-300' 
                                    : 'text-slate-500 hover:text-teal-200 hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                {opt.icon}
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Vote Counter */}
                    <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-1.5 rounded-lg border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                        <VoteIcon className="w-4 h-4 text-teal-400" />
                        <span className="font-mono font-bold text-xs md:text-sm text-slate-200">
                            {/* We show raw vote count here, so sum up counts from currentData */}
                            {currentData.reduce((acc, curr) => acc + curr.displayCount, 0)} <span className="text-slate-500">/ {sortedVotes.length}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            {/* Increased vertical height and bottom margin */}
            <div className="h-[350px] md:h-[500px] w-full pl-0 select-none mb-12 md:mb-16 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={currentData}
                        // Increased bottom margin to prevent label cutoff
                        margin={{ top: 30, right: 0, left: 0, bottom: 40 }}
                        barCategoryGap="20%"
                    >
                        <XAxis 
                            dataKey={isDesktop ? "name" : "shortName"} 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: isDesktop ? 12 : 10, fontWeight: 700 }}
                            interval={0}
                            dy={15}
                        />
                        <YAxis 
                            hide 
                            domain={[0, maxDomainValue]} 
                        />
                        <Tooltip 
                            cursor={{fill: 'rgba(20, 184, 166, 0.05)'}}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '0.75rem' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [Math.floor(value), 'Votes']}
                        />
                        <Bar 
                            dataKey="count" 
                            radius={[6, 6, 0, 0]}
                            isAnimationActive={false} 
                        >
                            <LabelList 
                                dataKey="displayCount" 
                                content={<FadeInLabel />} 
                            />
                            
                            {currentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Speed Selector (Mobile) */}
            <div className="flex md:hidden justify-center gap-2 mb-4 bg-slate-950/50 p-2 rounded-xl border border-white/5">
                 {SPEED_OPTIONS.map((opt) => (
                    <button
                        key={opt.label}
                        onClick={() => { setSelectedDuration(opt.duration); setIsPlaying(false); }}
                        className={`flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all flex-1 ${
                            selectedDuration === opt.duration 
                            ? 'bg-teal-400 border-teal-300 text-slate-950 shadow-lg shadow-teal-900/40' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        {opt.icon}
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Main Controls */}
            <div className="bg-slate-900/40 p-3 md:p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 md:gap-4">
                    <button 
                        onClick={togglePlay}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-400 text-slate-900 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105 active:scale-95 flex-shrink-0"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-1" />}
                    </button>
                    
                    <button 
                        onClick={reset}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-white/10 flex-shrink-0"
                        title="Reset Timeline"
                    >
                        <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>

                    <div className="flex-1 flex flex-col justify-center px-1 md:px-2">
                        <input
                            type="range"
                            min="0"
                            max={voteClusters.length}
                            step="0.1" 
                            value={currentVoteIndex}
                            onChange={handleSliderChange}
                            className="w-full h-1.5 md:h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400 transition-colors"
                        />
                        <div className="flex justify-between text-[8px] md:text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-bold px-1">
                            <span>Start</span>
                            <span>{Math.min(100, Math.round(progressPercentage))}%</span>
                            <span>Finish</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ScrollReveal>
  );
};