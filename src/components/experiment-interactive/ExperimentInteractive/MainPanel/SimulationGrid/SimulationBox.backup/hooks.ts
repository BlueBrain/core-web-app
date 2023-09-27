import { useContext } from 'react';
import { SimulationPreviewContext } from './context';

export const useSimulationPreview = () => useContext(SimulationPreviewContext);
