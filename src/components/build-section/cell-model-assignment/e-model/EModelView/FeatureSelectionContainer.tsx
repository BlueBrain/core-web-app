import { useAtomValue } from 'jotai';

import FeatureSelectionItem from './FeatureSelectionItem';
import { featureParametersAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';

export default function FeatureSelectionContainer() {
  const featureParameters = useAtomValue(featureParametersAtom);

  if (!featureParameters) return null;

  return (
    <>
      <FeatureSelectionItem title="Spike shape" params={featureParameters['Spike shape']} />
      <FeatureSelectionItem title="Spike event" params={featureParameters?.['Spike event']} />
      <FeatureSelectionItem title="Voltage" params={featureParameters?.Voltage} />
    </>
  );
}
