import { useAtom } from 'jotai';

import RangeSlider from './RangeSlider';
import { MEFeatureKeys, MEFeatureWithEModel } from '@/types/me-model';
import { featureWithEModelAtom } from '@/state/brain-model-config/cell-model-assignment/me-model';

export default function FeatureRows() {
  const [featureWithEModel, setFeatureWithEModel] = useAtom(featureWithEModelAtom);

  if (!featureWithEModel) return null;

  const onSliderChange = (featureKey: MEFeatureKeys, newStart: number, newEnd: number) => {
    setFeatureWithEModel((oldAtomData: MEFeatureWithEModel | null) => {
      if (!oldAtomData) return null;

      return {
        ...oldAtomData,
        [featureKey]: {
          ...oldAtomData[featureKey],
          selectedRange: [newStart, newEnd],
        },
      };
    });
  };

  return (
    featureWithEModel &&
    Object.entries(featureWithEModel).map(([featureName, featureInfo]) => (
      <div key={featureName} className="grid grid-cols-3 gap-6 py-4 items-center">
        <div>{featureInfo.displayName}</div>
        <RangeSlider
          featureInfo={featureInfo}
          onChangeParam={(start, end) => onSliderChange(featureName as MEFeatureKeys, start, end)}
        />
      </div>
    ))
  );
}
