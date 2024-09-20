import { useAtom, useAtomValue } from 'jotai';
import { CheckCircleFilled } from '@ant-design/icons';

import { InfoMessageBox, StandardFallback } from './ErrorMessageLine';
import FeatureSelectionItem from './FeatureSelectionItem';
import Header from './Header';

import {
  featureParametersAtom,
  featureSelectedPresetAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { presetNames } from '@/constants/cell-model-assignment/e-model';
import { classNames } from '@/util/utils';
import GenericButton from '@/components/Global/GenericButton';

export default function FeatureSelectionContainer() {
  const featureParameters = useAtomValue(featureParametersAtom);

  if (!featureParameters) {
    return <InfoMessageBox message="No information available" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <PresetSelector />

      <div className="border border-neutral-3 p-4">
        <FeatureSelectionItem featureCategory="Spike shape" featureGroup={featureParameters} />
        <FeatureSelectionItem featureCategory="Spike event" featureGroup={featureParameters} />
        <FeatureSelectionItem featureCategory="Voltage" featureGroup={featureParameters} />
      </div>
    </div>
  );
}

function PresetSelector() {
  const [featureSelectedPreset, setFeatureSelectedPreset] = useAtom(featureSelectedPresetAtom);

  const title = 'Optimization target';

  if (!presetNames) {
    return <StandardFallback type="info">{title}</StandardFallback>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Header>{title}</Header>

      <div className="flex gap-4">
        {presetNames.map((presetName) => {
          const isSelected = presetName === featureSelectedPreset;

          return (
            <GenericButton
              key={presetName}
              className={classNames(
                'hover:text-white',
                isSelected ? 'bg-primary-8 text-white' : 'text-primary-8'
              )}
              onClick={() => setFeatureSelectedPreset(presetName)}
              text={
                isSelected ? (
                  <div className="flex items-center justify-center gap-2">
                    {presetName}
                    <CheckCircleFilled className="text-white" />
                  </div>
                ) : (
                  presetName
                )
              }
            />
          );
        })}
      </div>

      <div className="text-primary-8">
        <div>DESCRIPTION</div>
        <div>
          Optimization target selects the target stimulation protocols (e-codes) and electrical
          features (e-features) combinations to extract from intracellular electrophysiological
          traces. The pipeline will try to find the best combination of e-codes, amplitudes, and
          e-features that match the data available in the recordings. The optimization and
          validation steps of e-model building use these targets.
        </div>
      </div>
    </div>
  );
}
