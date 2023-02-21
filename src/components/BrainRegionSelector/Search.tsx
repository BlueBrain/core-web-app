import { useAtomValue } from 'jotai/react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { brainRegionsFilteredArrayAtom } from '@/state/brain-regions';

export default function Search({
  onSelect,
}: {
  onSelect: SelectProps<
    unknown,
    {
      label: string;
      value: string;
      ancestors?: string[];
      leaves?: string[];
    }
  >['onSelect'];
}) {
  const brainRegionsFilteredArray = useAtomValue(brainRegionsFilteredArrayAtom);

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
          options={
            brainRegionsFilteredArray?.map(({ title, id, ancestors, leaves }) => ({
              label: title,
              value: id,
              ancestors,
              leaves,
            })) ?? []
          }
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
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
