import { useAtom, useAtomValue } from 'jotai';

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
      <div className="font-bold text-primary-8 text-xl my-4">Optimization target</div>

      <div className="flex gap-4">
        {presetNames.map((presetName) => {
          const isSelected = presetName === featureSelectedPreset;

          return (
            <GenericButton
              key={presetName}
              className={classNames(isSelected ? 'text-white bg-primary-8' : 'text-primary-8')}
              onClick={() => setFeatureSelectedPreset(presetName)}
              text={presetName}
            />
          );
        })}
      </div>

      <div className="text-primary-8 my-4">
        <div>DESCRIPTION</div>
        <div>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam, id tenetur modi iusto
          aspernatur culpa exercitationem explicabo quod! Perferendis consectetur provident
          voluptatibus animi rem tenetur suscipit molestias excepturi possimus dolorem?
        </div>
      </div>
    </>
  );
}
