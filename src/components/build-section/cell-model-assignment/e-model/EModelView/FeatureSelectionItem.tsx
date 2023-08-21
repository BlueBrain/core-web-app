import { CheckCircleFilled } from '@ant-design/icons';

import {
  AllFeatureKeys,
  FeatureCategory,
  FeatureItem,
  FeatureParameterGroup,
} from '@/types/e-model';

type Props = {
  featureCategory: FeatureCategory;
  featureGroup: FeatureParameterGroup;
};

export default function FeatureSelectionItem({ featureCategory, featureGroup }: Props) {
  const features: FeatureItem<AllFeatureKeys>[] = featureGroup[featureCategory];
  const selectedCount = features.length;

  return (
    <div>
      <div className="flex justify-between font-bold text-primary-8">
        <div className="text-xl my-4">{featureCategory}</div>
        <div>Selected: {selectedCount}</div>
      </div>
      <div className="flex gap-3 flex-wrap">
        {features.map((feature) => (
          <CustomCheckbox key={feature.uuid} feature={feature} />
        ))}
      </div>
    </div>
  );
}

function CustomCheckbox({ feature }: { feature: FeatureItem<AllFeatureKeys> }) {
  return (
    <div className="flex rounded-3xl bg-slate-50 py-2 px-4 text-primary-8 gap-2">
      <div className="whitespace-nowrap">{feature.displayName}</div>
      <CheckCircleFilled />
    </div>
  );
}
