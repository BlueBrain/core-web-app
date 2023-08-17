import { CheckCircleFilled } from '@ant-design/icons';

import { AllFeatureKeys, FeatureItem } from '@/types/e-model';

function generateKey(str1: string, str2: string) {
  return `${str1}_${str2}`.replaceAll(' ', '').toLowerCase();
}

type Props = {
  title: string;
  params: FeatureItem<AllFeatureKeys>[];
};

export default function FeatureSelectionItem({ title, params }: Props) {
  const selectedCount = params.length;

  return (
    <div>
      <div className="flex justify-between font-bold text-primary-8">
        <div className="text-xl my-4">{title}</div>
        <div>Selected: {selectedCount}</div>
      </div>
      <div className="flex gap-3 flex-wrap">
        {params.map((parameter) => (
          <CustomCheckbox key={generateKey(title, parameter.featureKey)} item={parameter} />
        ))}
      </div>
    </div>
  );
}

function CustomCheckbox({ item }: { item: FeatureItem<AllFeatureKeys> }) {
  return (
    <div className="flex rounded-3xl bg-slate-50 py-2 px-4 text-primary-8 gap-2">
      <div className="whitespace-nowrap">{item.featureKey}</div>
      <CheckCircleFilled />
    </div>
  );
}
