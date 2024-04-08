import { MockVirtualLab } from '@/types/virtual-lab/lab';

export const mockVirtualLab: MockVirtualLab = {
  title: 'Institute of Neuroscience',
  description:
    'A Neuroscience Virtual Lab is a digital simulation of a real-world neuroscience laboratory. It offers an interactive environment for conducting experiments, analyzing data, and learning about the brain and nervous system.',
  builds: 278,
  simulationExperiments: 15,
  members: 9,
  admin: 'Julian Budd',
  creationDate: '12.02.2023',
  budget: {
    total: 1650,
    totalSpent: 1300,
    remaining: 350,
  },
};
