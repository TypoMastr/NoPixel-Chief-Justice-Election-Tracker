export enum Candidate {
    BRITTANY_ANGEL = "Brittany Angel",
    NATHANIEL_GREYSON = "Nathaniel Greyson",
    SEAN_DANIELSON = "Sean Danielson",
    ABSTAINED = "Abstained"
  }
  
  export enum Department {
    BSCO = "BSCO",
    DOC = "DOC",
    DOJ = "DOJ",
    LSPD = "LSPD",
    SASM = "SASM"
  }
  
  export interface Vote {
    id: string;
    voterName: string;
    department: Department;
    candidate: Candidate;
    timestamp: number;
  }
  
  export interface DashboardMetrics {
    totalVotes: number;
    validVotes: number;
    abstentions: number;
    candidateCount: number;
  }