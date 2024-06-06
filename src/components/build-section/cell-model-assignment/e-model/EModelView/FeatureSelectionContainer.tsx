import { useAtom, useAtomValue } from 'jotai';
import { CheckCircleFilled } from '@ant-design/icons';

import FeatureSelectionItem from './FeatureSelectionItem';
import {
  featureParametersAtom,
  featureSelectedPresetAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { presetNames } from '@/constants/cell-model-assignment/e-model';
import { classNames } from '@/util/utils';
import GenericButton from '@/components/Global/GenericButton';

export default function FeatureSelectionContainer() {
  const featureParameters = useAtomValue(featureParametersAtom);

  if (!featureParameters) return null;

  return (
    <>
      <PresetSelector />

      <FeatureSelectionItem featureCategory="Spike shape" featureGroup={featureParameters} />
      <FeatureSelectionItem featureCategory="Spike event" featureGroup={featureParameters} />
      <FeatureSelectionItem featureCategory="Voltage" featureGroup={featureParameters} />
    </>
  );
}

function PresetSelector() {
  const [featureSelectedPreset, setFeatureSelectedPreset] = useAtom(featureSelectedPresetAtom);

  return (
    <>
      <div className="my-4 text-xl font-bold text-primary-8">Optimization target</div>

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

      <div className="my-4 text-primary-8">
        <div>DESCRIPTION</div>
        <div>
          OPTIMIZATION_TARGET_DESCRIPTION
        </div>
      </div>
    </>
  );
}
