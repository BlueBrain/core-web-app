import { CheckCircleFilled } from '@ant-design/icons';

import { FeatureParameterItem } from '@/types/e-model';

type Props = {
  title: string;
  params: FeatureParameterItem[];
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
          <CustomCheckbox key={parameter.parameterName} item={parameter} />
        ))}
      </div>
    </div>
  );
}

function CustomCheckbox({ item }: { item: FeatureParameterItem }) {
  return (
    <div className="flex rounded-3xl bg-slate-50 py-2 px-4 text-primary-8 gap-2">
      <div className="whitespace-nowrap">{item.parameterName}</div>
      <CheckCircleFilled />
    </div>
  );
}
