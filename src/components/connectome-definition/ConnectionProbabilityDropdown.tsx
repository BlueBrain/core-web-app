import { Select } from 'antd';

export default function ConnectionProbabilityDropdown() {
  return (
    <div className="w-[250px] flex flex-col h-[60px] justify-between">
      <div>Connection probability models</div>
      <Select
        defaultValue="Distance-dependent"
        style={{ width: 200 }}
        options={[{ value: 'Distance-dependent', label: 'Distance-dependent' }]}
      />
    </div>
  );
}
