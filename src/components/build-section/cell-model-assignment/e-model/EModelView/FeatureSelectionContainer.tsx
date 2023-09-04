import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { CheckCircleFilled } from '@ant-design/icons';
import FeatureSelectionItem from './FeatureSelectionItem';
import {
  eModelEditModeAtom,
  eModelUIConfigAtom,
  featureParametersAtom,
  featureSelectedPresetAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { presetNames } from '@/constants/cell-model-assignment/e-model';
import { classNames } from '@/util/utils';
import GenericButton from '@/components/Global/GenericButton';

export default function FeatureSelectionContainer() {
  const featureParameters = useAtomValue(featureParametersAtom);
  const eModelEditMode = useAtomValue(eModelEditModeAtom);

  if (!featureParameters) return null;

  return (
    <>
      {eModelEditMode && <PresetSelector />}

      <FeatureSelectionItem featureCategory="Spike shape" featureGroup={featureParameters} />
      <FeatureSelectionItem featureCategory="Spike event" featureGroup={featureParameters} />
      <FeatureSelectionItem featureCategory="Voltage" featureGroup={featureParameters} />
    </>
  );
}

function PresetSelector() {
  const [featureSelectedPreset, setFeatureSelectedPreset] = useAtom(featureSelectedPresetAtom);
  const setEModelUIConfig = useSetAtom(eModelUIConfigAtom);

  useEffect(() => {
    if (!featureSelectedPreset) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      featurePresetName: featureSelectedPreset,
    }));
  }, [featureSelectedPreset, setEModelUIConfig]);

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
              text={
                <>
                  {presetName}
                  {isSelected && <CheckCircleFilled className="ml-2" />}
                </>
              }
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
