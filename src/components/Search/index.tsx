import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';

type SelectOptions = {
  label: string;
  value: string;
  ancestors?: string[];
  leaves?: string[];
  representedInAnnotation: boolean;
};

export default function Search({
  onSelect,
  options,
}: {
  onSelect: SelectProps<unknown, SelectOptions>['onSelect'];
  options: SelectOptions[];
}) {
  const css = `
.ant-select-selector {
  padding: 0 !important;
}
.ant-select-selection-search {
  inset-inline-start: 0 !important;
  inset-inline-end: 0 !important;
}
.ant-select-selection-search-input {
  color:white !important;
}
.ant-select-selection-placeholder {
  color:#69C0FF !important;
}
.ant-select-selection-item {
  color:white !important;
}
`;

  return (
    <>
      <style>{css}</style>
      <div className="border-b border-white mb-10">
        <Select
          bordered={false}
          className="block w-full py-3 text-white"
          dropdownStyle={{ borderRadius: '4px' }}
          placeholder="Search region..."
          options={options}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          showSearch
          optionFilterProp="label"
          onSelect={onSelect}
        />
      </div>
    </>
  );
}
