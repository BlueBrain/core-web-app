import { useContext } from 'react';

import { ExperimentInteractiveContext } from '@/components/experiment-interactive/ExperimentInteractive/context';

export const useExperimentInteractive = () => useContext(ExperimentInteractiveContext);
