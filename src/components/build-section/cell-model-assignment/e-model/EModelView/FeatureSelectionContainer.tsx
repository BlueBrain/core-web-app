import { useAtomValue } from 'jotai';

import FeatureSelectionItem from './FeatureSelectionItem';
import { featureParametersAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';

export default function FeatureSelectionContainer() {
  const featureParameters = useAtomValue(featureParametersAtom);

  if (!featureParameters) return null;

  return (
    <>
      <FeatureSelectionItem featureCategory="Spike shape" featureGroup={featureParameters} />
      <FeatureSelectionItem featureCategory="Spike event" featureGroup={featureParameters} />
      <FeatureSelectionItem featureCategory="Voltage" featureGroup={featureParameters} />
    </>
  );
}
