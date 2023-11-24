import { useMemo } from 'react';
import { useUnwrappedValue } from './hooks';
import { expDesignerConfigAtom } from '@/state/experiment-designer';
import { ExpDesignerCustomAnalysisParameter } from '@/types/experiment-designer';

export function useCustomAnalysisConfig() {
  const analysisConfig = useUnwrappedValue(expDesignerConfigAtom)?.analysis;
  return useMemo(() => analysisConfig?.find((a) => a.id === 'custom'), [analysisConfig]) as
    | ExpDesignerCustomAnalysisParameter
    | undefined;
}
