
import { Candidate, Department, Vote } from "./types";

// Helper to generate IDs for initial data
const uuid = () => Math.random().toString(36).substring(2, 15);

// Helper to generate staggered timestamps to ensure order preservation
const baseTime = Date.now();
let timeOffset = 0;

// Standard increment
const getTimestamp = () => {
    timeOffset += 1000; // Increment 1 second per vote
    return baseTime + timeOffset;
};

// Sync timestamp (increments minimally to appear "together" with previous)
const getSyncTimestamp = () => {
    timeOffset += 10; // Only 10ms diff
    return baseTime + timeOffset;
};

// Ordered list: 12 Brittany -> 1 Abstained -> Rest
export const INITIAL_VOTES: Vote[] = [
  // 1. First 11 votes for Brittany
  { id: uuid(), voterName: "Maeve Wolfe", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Matthew Espinoz", department: Department.LSPD, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Cohen Ryker", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Roman Atlas", department: Department.DOJ, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Brooke Ruth", department: Department.SASM, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Jessie Lea Gallagah", department: Department.SASM, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Daisy Dukakis", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Jonah Sloe", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Vincent Ventura", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Arnold Frost", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Ricky Dallas", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  
  // 2. The 12th Brittany Vote
  { id: uuid(), voterName: "Tommy Horver", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },

  // 3. The 1st Abstained Vote (Synced closely to appear with the 12th vote)
  { id: uuid(), voterName: "Brian Knight", department: Department.SASM, candidate: Candidate.ABSTAINED, timestamp: getSyncTimestamp() },

  // 4. Remaining Brittany votes
  { id: uuid(), voterName: "Albert King", department: Department.LSPD, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Jenna Mustard", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Austin Bean", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: getTimestamp() },
  
  // 5. Remaining Abstained votes
  { id: uuid(), voterName: "Jessica Springfield", department: Department.SASM, candidate: Candidate.ABSTAINED, timestamp: getTimestamp() },
  { id: uuid(), voterName: "Yui Ishida", department: Department.DOC, candidate: Candidate.ABSTAINED, timestamp: getTimestamp() },
];

// Candidates actually running for office (excluding Abstained)
export const ACTIVE_CANDIDATES = [
  Candidate.BRITTANY_ANGEL,
  Candidate.NATHANIEL_GREYSON,
  Candidate.SEAN_DANIELSON
];

// Options available in the dropdown
export const CANDIDATE_LIST = [
  ...ACTIVE_CANDIDATES,
  Candidate.ABSTAINED
];

export const DEPARTMENT_LIST = [
  Department.BSCO,
  Department.DOC,
  Department.DOJ,
  Department.LSPD,
  Department.SASM
];

export const COLORS = {
  [Candidate.BRITTANY_ANGEL]: "#14b8a6", // Teal-500
  [Candidate.NATHANIEL_GREYSON]: "#3b82f6", // Blue-500
  [Candidate.SEAN_DANIELSON]: "#a855f7", // Purple-500
  [Candidate.ABSTAINED]: "#cbd5e1", // Slate-300 (Light Grey for readability on dark cards)
};
