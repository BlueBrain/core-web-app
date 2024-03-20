type Budget = {
    total: number;
    totalSpent: number;
    remaining: number;
  };
  
  export type VirtualLab = {
    title: string;
    description: string;
    builds: number;
    simulationExperiments: number;
    members: number;
    admin: string;
    creationDate: string;
    budget: Budget;
  };
  