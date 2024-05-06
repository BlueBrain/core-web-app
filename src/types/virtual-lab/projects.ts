import { VlmResponse } from './common';

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

export type ProjectResponse = VlmResponse<{ project: Project }>;

export type Project = {
  id: string;
  nexus_project_id: string;
  name: string;
  description: string;
  budget: number;
  created_at: string;
  updated_at: string;
  virtual_lab_id: string;
  admin: {
    id: string;
    username: string;
    email: string;
    created_at: string;
    first_name: string;
    last_name: string;
    name: string;
  };
};
