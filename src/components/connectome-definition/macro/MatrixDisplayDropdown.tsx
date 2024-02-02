import { Select } from 'antd';

export default function MatrixDisplayDropdown() {
  return (
    <div className="flex h-[60px] w-[250px] flex-col justify-between">
      <div>Display</div>
      <Select
        defaultValue="Absolute density"
        style={{ width: 200 }}
        options={[{ value: 'Absolute density', label: 'Absolute density' }]}
      />
    </div>
  );
}
