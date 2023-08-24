import { createContext } from 'react';
import { ExperimentInteractiveContextType } from '@/components/experiment-interactive/types';

export const ExperimentInteractiveContext = createContext<ExperimentInteractiveContextType>(
  {} as ExperimentInteractiveContextType
);
