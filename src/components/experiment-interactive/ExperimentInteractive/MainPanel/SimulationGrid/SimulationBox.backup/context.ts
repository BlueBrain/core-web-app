import { createContext } from 'react';
import { SimulationPreviewContextType } from '@/components/experiment-interactive/types';

export const SimulationPreviewContext = createContext<SimulationPreviewContextType>(
  {} as SimulationPreviewContextType
);
