import { Select } from 'antd';
import { SelectOption } from '@/types/common';

const selectOptions: SelectOption[] = [{ label: 'Feature based', value: 'featureBased' }];

export default function AssignmentAlgorithm() {
  const defaultValue = selectOptions[0].value;

  return (
    <div className="flex gap-5">
      <div className="text-3xl font-bold text-primary-8">Assignment algorithm</div>
      <Select defaultValue={defaultValue} options={selectOptions} />
    </div>
  );
}
