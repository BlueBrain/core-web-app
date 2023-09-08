import { useState } from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';

import {
  AllFeatureKeys,
  FeatureCategory,
  FeatureItem,
  FeatureParameterGroup,
} from '@/types/e-model';
import { EyeIcon } from '@/components/icons';

type Props = {
  featureCategory: FeatureCategory;
  featureGroup: FeatureParameterGroup;
};

export default function FeatureSelectionItem({ featureCategory, featureGroup }: Props) {
  const features: FeatureItem<AllFeatureKeys>[] = featureGroup[featureCategory];

  const selectedFeatures = features.filter((f) => f.selected);
  const unselectedFeatures = features.filter((f) => !f.selected);
  const selectedCount = selectedFeatures.length;

  return (
    <div>
      <div className="flex justify-between font-bold text-primary-8">
        <div className="my-4">
          <span className="text-xl">{featureCategory}</span>
          <span className="text-xs font-thin ml-1">({features.length})</span>
        </div>
        <div>Selected: {selectedCount}</div>
      </div>
      <div className="flex gap-3 flex-wrap">
        {selectedFeatures.map((feature) => (
          <CustomCheckbox key={feature.uuid} feature={feature} />
        ))}
        <UnselectedFeatures unselectedFeatures={unselectedFeatures} />
      </div>
    </div>
  );
}

function CustomCheckbox({ feature }: { feature: FeatureItem<AllFeatureKeys> }) {
  return (
    <Tooltip title={feature.description}>
      <div className="flex rounded-3xl bg-slate-50 py-2 px-4 text-primary-8 gap-2">
        <div className="whitespace-nowrap">{feature.displayName}</div>
        {feature.selected && <CheckCircleFilled />}
      </div>
    </Tooltip>
  );
}

function UnselectedFeatures({
  unselectedFeatures,
}: {
  unselectedFeatures: FeatureItem<AllFeatureKeys>[];
}) {
  const [showAll, setShowAll] = useState(false);

  const pillStyle =
    'flex rounded-3xl bg-transparent py-2 px-4 text-gray-400 gap-2 border border-gray-400 items-center';

  if (!showAll) {
    return (
      <button type="button" className={pillStyle} onClick={() => setShowAll(true)}>
        <div className="whitespace-nowrap">Show all parameters</div>
        <EyeIcon />
      </button>
    );
  }

  return (
    <>
      {unselectedFeatures.map((feature) => (
        <CustomCheckbox key={feature.uuid} feature={feature} />
      ))}

      <button type="button" className={pillStyle} onClick={() => setShowAll(false)}>
        <div className="whitespace-nowrap">Show less</div>
        <EyeIcon />
      </button>
    </>
  );
}
