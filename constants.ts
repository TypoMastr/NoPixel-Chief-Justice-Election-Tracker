import { Candidate, Department, Vote } from "./types";

// Helper to generate IDs for initial data
const uuid = () => Math.random().toString(36).substring(2, 15);

export const INITIAL_VOTES: Vote[] = [
  { id: uuid(), voterName: "Maeve Wolfe", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Matthew Espinoz", department: Department.LSPD, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Cohen Ryker", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Roman Atlas", department: Department.DOJ, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Brooke Ruth", department: Department.SASM, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Jessie Lea Gallagah", department: Department.SASM, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Daisy Dukakis", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Jonah Sloe", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Vincent Ventura", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Arnold Frost", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Ricky Dallas", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Tommy Horver", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Albert King", department: Department.LSPD, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Jenna Mustard", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Austin Bean", department: Department.BSCO, candidate: Candidate.BRITTANY_ANGEL, timestamp: Date.now() },
  { id: uuid(), voterName: "Brian Knight", department: Department.SASM, candidate: Candidate.ABSTAINED, timestamp: Date.now() },
  { id: uuid(), voterName: "Jessica Springfield", department: Department.SASM, candidate: Candidate.ABSTAINED, timestamp: Date.now() },
  { id: uuid(), voterName: "Yui Ishida", department: Department.DOC, candidate: Candidate.ABSTAINED, timestamp: Date.now() },
];

export const CANDIDATE_LIST = [
  Candidate.BRITTANY_ANGEL,
  Candidate.NATHANIEL_GREYSON,
  Candidate.SEAN_DANIELSON,
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
  [Candidate.ABSTAINED]: "#ef4444", // Red-500
};