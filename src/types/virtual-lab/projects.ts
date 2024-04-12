export type MockProject = {
  id: number;
  title: string;
  latestUpdate: string;
  isFavorite: boolean;
  description: string;
  exploreSessions: number;
  builds: number;
  simulationExperiments: number;
  members: number;
  admin: string;
  creationDate: string;
  budget: {
    total: number;
    totalSpent: number;
    remaining: number;
  };
};
export type Project = {
  id: string;
  name: string;
  description: string;
  budget: number;
  created_at: string;
  updated_at: string;
};
