import { Select } from 'antd';

export default function MatrixDisplayDropdown() {
  return (
    <div className="w-[250px] flex flex-col h-[60px] justify-between">
      <div>Display</div>
      <Select
        defaultValue="Absolute density"
        style={{ width: 200 }}
        options={[{ value: 'Absolute density', label: 'Absolute density' }]}
      />
    </div>
  );
}
