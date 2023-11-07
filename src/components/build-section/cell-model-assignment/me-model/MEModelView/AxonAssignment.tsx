import { Select } from 'antd';
import { SelectOption } from '@/types/common';

const selectOptions: SelectOption[] = [{ label: 'Fixed value', value: 'fixedValue' }];

export default function AxonAssignment() {
  const defaultValue = selectOptions[0].value;

  return (
    <>
      <div className="flex gap-5">
        <div className="text-3xl font-bold text-primary-8">Axon initial segment assignment</div>
        <Select defaultValue={defaultValue} options={selectOptions} />
      </div>
      <div className="flex gap-5">
        <div className="font-bold text-primary-8">Segment number</div>
        <input type="number" value={1} readOnly />
      </div>
    </>
  );
}
