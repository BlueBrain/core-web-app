type MockBudget = {
  total: number;
  totalSpent: number;
  remaining: number;
};

export type MockVirtualLab = {
  title: string;
  description: string;
  builds: number;
  simulationExperiments: number;
  members: number;
  admin: string;
  creationDate: string;
  budget: MockBudget;
};
